import { useEffect, useRef } from "react";

/* Flowing brand-gradient shader (the shader-r / seed vibe from 21st.dev):
   violet depth with purple + mint blooms that slowly breathe and follow
   the cursor. Pauses offscreen, caps DPR, degrades to nothing on failure. */

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_intensity;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.55;
  for(int i = 0; i < 5; i++){
    v += a * noise(p);
    p = p * 2.02 + vec2(11.3, 7.7);
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv; p.x *= u_res.x / u_res.y;

  float t = u_time * 0.045;
  vec2 drift = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 4.2));
  float n = fbm(p * 1.7 + drift * 1.15 - t * 0.6);

  // cursor bloom (soft antigravity glow that trails the mouse)
  vec2 m = u_mouse; m.x *= u_res.x / u_res.y;
  float md = length(p - m);
  float cursor = smoothstep(0.55, 0.0, md) * 0.5;

  vec3 base   = vec3(0.043, 0.035, 0.09);            // violet night
  vec3 purple = vec3(0.42, 0.20, 0.86);
  vec3 mint   = vec3(0.18, 0.78, 0.55);
  vec3 lime   = vec3(0.62, 0.85, 0.25);

  vec3 col = base;
  col = mix(col, purple, smoothstep(0.42, 0.85, n) * 0.42);
  col = mix(col, mint, smoothstep(0.62, 0.95, fbm(p * 2.3 - drift + t)) * 0.30);
  col += lime * cursor * 0.35 + mint * cursor * 0.45;
  col += purple * smoothstep(0.75, 1.0, n) * 0.22;

  // vignette so it melts into the page background
  float vig = smoothstep(1.15, 0.35, length(uv - 0.5));
  col = mix(base * 0.9, col, vig);

  gl_FragColor = vec4(col * u_intensity, 1.0);
}
`;

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

type Props = { intensity?: number; className?: string };

const ShaderBg = ({ intensity = 1, className = "" }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).has("still")
    )
      return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uInt = gl.getUniformLocation(prog, "u_intensity");
    gl.uniform1f(uInt, intensity);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = (w * dpr) / 2; // half-res: buttery + cheap, blur hides it
      canvas.height = (h * dpr) / 2;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // cursor with lazy trailing
    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = 1 - (e.clientY - r.top) / r.height;
    };
    const host = canvas.parentElement || canvas;
    host.addEventListener("pointermove", onMove as EventListener, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      (es) => { visible = es[0]?.isIntersecting ?? true; },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform2f(uMouse, mx * (canvas.width / canvas.height), my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove as EventListener);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [intensity]);

  return <canvas ref={ref} className={`shaderbg ${className}`} aria-hidden="true" />;
};

export default ShaderBg;
