// A quiet moving light wash over warm paper. The CSS background is the fallback.
export function mountPaperLight(canvas: HTMLCanvasElement) {
  const host = canvas.parentElement;
  if (!host) return;
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
  if (!gl) return;
  const vs = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vs, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"); gl.compileShader(vs);
  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fs, `precision mediump float;
    uniform vec2 resolution; uniform float time; uniform vec2 pointer;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    void main(){
      vec2 uv=gl_FragCoord.xy/resolution;
      vec2 q=uv+pointer*.025;
      float wave=sin(q.x*5.5+q.y*3.+time*.12)*.5+.5;
      float pink=exp(-length((q-vec2(.73,.75))*vec2(1.4,1.1))*3.5);
      float sage=exp(-length((q-vec2(.12,.18))*vec2(1.3,1.))*4.);
      vec3 paper=vec3(.949,.925,.878);
      paper=mix(paper,vec3(.929,.813,.831),pink*.55);
      paper=mix(paper,vec3(.822,.858,.785),sage*.48);
      paper+=vec3(wave*.012-.006);
      float grain=hash(gl_FragCoord.xy)*.013-.0065;
      gl_FragColor=vec4(paper+grain,1.);
    }`); gl.compileShader(fs);
  const program = gl.createProgram()!; gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); return; }
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, "p"); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const res = gl.getUniformLocation(program, "resolution"), clock = gl.getUniformLocation(program, "time"), pointer = gl.getUniformLocation(program, "pointer");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0, visible = false, disposed = false, last = -100, px = 0, py = 0;
  const start = performance.now();
  function paint(now: number) {
    gl!.uniform2f(res, canvas.width, canvas.height);
    gl!.uniform1f(clock, motion.matches ? 0 : (now - start) / 1000);
    gl!.uniform2f(pointer, motion.matches ? 0 : px, motion.matches ? 0 : py);
    gl!.drawArrays(gl!.TRIANGLES, 0, 6);
  }
  function tick(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden || motion.matches) return;
    if (now - last > 45) { paint(now); last = now; }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0;
    if (disposed) return;
    paint(performance.now());
    if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const rect = host!.getBoundingClientRect();
    canvas.width = Math.min(960, Math.max(1, Math.round(rect.width)));
    canvas.height = Math.min(1000, Math.max(1, Math.round(rect.height)));
    gl!.viewport(0, 0, canvas.width, canvas.height); sync();
  }
  function move(e: PointerEvent) { const r = host!.getBoundingClientRect(); px = (e.clientX-r.left)/r.width-.5; py = .5-(e.clientY-r.top)/r.height; }
  const ro = new ResizeObserver(resize); ro.observe(host);
  const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }); io.observe(host);
  motion.addEventListener("change", sync); document.addEventListener("visibilitychange", sync); host.addEventListener("pointermove", move, { passive: true });
  resize();
  return () => {
    disposed = true; cancelAnimationFrame(frame); ro.disconnect(); io.disconnect();
    motion.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); host.removeEventListener("pointermove", move);
    gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs);
  };
}
