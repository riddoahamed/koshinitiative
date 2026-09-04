import { memo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BASE, FACE_H, FACE_W, type Face } from "./persona/faces";

// ── The portrait, in three dimensions ────────────────────────────────────────
// Same twenty-by-twenty grid the canvas renderer draws, extruded into cubes and
// lit. Nothing new is authored for it — a face improved in faces.ts improves
// here too, which is the reason to build it this way rather than modelling
// eight heads.
//
// Depth is not uniform. Hair, spectacles and anything worn stand proud of the
// skin, and the skin stands proud of the outline, so the head reads as a face
// under a light rather than as a flat sticker someone rotated. That one detail
// is most of the difference between this looking 3D and looking like a bad
// perspective trick.
//
// One InstancedMesh, so ~300 voxels cost a single draw call — this sits on a
// result screen that also runs a share-card capture, and it is not allowed to
// be the reason a mid-range phone stutters.

/** How far each kind of pixel sticks out. Higher = closer to the viewer. */
const DEPTH: Record<string, number> = {
  k: 0.35,  // outline — set back, so it reads as edge rather than as feature
  s: 1.0,   // skin
  d: 0.8,   // shadow — slightly recessed, which is what makes it read as shadow
  t: 0.7,   // clothing
  h: 1.25,  // hair
  b: 1.15,  // brows
  e: 0.9,   // eyes, set into the face
  w: 0.95,
  m: 0.9,   // mouth
  g: 1.5,   // spectacles, chains — the things that genuinely sit in front
  c: 1.4,   // caps, buds
};

interface Props {
  face: Face;
  /** CSS pixels for the square canvas. */
  size?: number;
  className?: string;
  label: string;
}

export const VoxelPortrait = memo(function VoxelPortrait({
  face, size = 260, className, label,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // No WebGL (old device, blocked context, headless). The caller falls back.
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    // The third argument is `updateStyle`, and passing false is what made the
    // first attempt fill the screen: the canvas got width/height ATTRIBUTES of
    // size x devicePixelRatio and no CSS size at all, so a 216px portrait laid
    // out at 432px and overflowed its card. Let three set the style.
    renderer.setSize(size, size);
    // Stated rather than assumed. The instance colours are converted to linear
    // below, and that is only correct if the renderer converts back on output.
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    // 20 units of head in a 30-degree field: z=48 leaves a little air around it
    // at rest, which the lean then uses.
    camera.position.set(0, 0, 48);

    // Flatten base + overlays exactly as the 2D renderer does, so the two can
    // never disagree about what a face looks like.
    const grid: Array<Array<string | null>> = Array.from(
      { length: FACE_H }, () => Array<string | null>(FACE_W).fill(null),
    );
    for (const layer of [BASE, ...face.layers]) {
      layer.rows.forEach((row, i) => {
        const y = layer.top + i;
        if (y < 0 || y >= FACE_H) return;
        for (let x = 0; x < Math.min(row.length, FACE_W); x++) {
          const ch = row[x];
          if (ch !== "." && face.palette[ch]) grid[y][x] = ch;
        }
      });
    }

    const cells: Array<{ x: number; y: number; ch: string }> = [];
    for (let y = 0; y < FACE_H; y++) {
      for (let x = 0; x < FACE_W; x++) {
        const ch = grid[y][x];
        if (ch) cells.push({ x, y, ch });
      }
    }

    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshLambertMaterial();
    const mesh = new THREE.InstancedMesh(geo, mat, cells.length);
    const m = new THREE.Matrix4();
    const colour = new THREE.Color();

    cells.forEach((c, i) => {
      const depth = DEPTH[c.ch] ?? 1;
      m.makeScale(1, 1, depth);
      m.setPosition(
        c.x - FACE_W / 2 + 0.5,
        FACE_H / 2 - c.y - 0.5,
        depth / 2,
      );
      mesh.setMatrixAt(i, m);
      // `set()` already does the sRGB -> linear conversion, because
      // THREE.ColorManagement has been enabled by default since r152. Calling
      // convertSRGBToLinear() after it converts twice, and two conversions look
      // exactly like a lighting bug: the warm tan skin came out a dark brick red
      // and the whole cast looked sunburnt. It was the colour pipeline, not the
      // lamps — which is why turning the lights down did not fix it.
      colour.set(face.palette[c.ch]);
      mesh.setColorAt(i, colour);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);

    // Enough directional light to separate the three visible faces of a cube,
    // and no more. The palette does the work; the lamp only has to show which
    // way a voxel is pointing.
    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(-6, 8, 12);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbcd0ff, 0.3);
    rim.position.set(8, -3, 6);
    scene.add(rim);

    let raf = 0;
    const t0 = performance.now();
    // A slow lean rather than a spin. A rotating head is a novelty; a head that
    // turns a few degrees and comes back is a portrait that happens to be lit.
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      group.rotation.y = Math.sin(t * 0.45) * 0.34;
      group.rotation.x = Math.sin(t * 0.31) * 0.1;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      geo.dispose();
      mat.dispose();
      mesh.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [face, size]);

  if (failed) return null;
  return (
    <div
      ref={host}
      className={className}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    />
  );
});
