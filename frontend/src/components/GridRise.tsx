import { useEffect, useRef } from 'react';

interface GridRiseProps {
  /** Tailwind / CSS className applied to the canvas wrapper */
  className?: string;
  /** Overall brightness of the scene. 0–1, default 0.55 */
  brightness?: number;
  /** Accent colour as a [r,g,b] vec3 in 0..1 space */
  accentColor?: [number, number, number];
  /** How strongly tiles rise toward the cursor. Default 1.0 */
  riseStrength?: number;
}

const VERT = `#version 300 es
precision highp float;
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

/**
 * Fragment shader.
 *
 * NOTE: `half` is a reserved word in GLSL ES, so the box half-width in
 * `mapScene` must not be called `half` — doing so fails compilation silently
 * (the canvas simply renders nothing).
 */
const FRAG = `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_brightness;
uniform vec3  u_accent;
uniform float u_riseStrength;

out vec4 fragColor;

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

const float TILE = 1.0;
const float GAP  = 0.07;

float tileHeight(vec2 cell, vec2 cw, float t) {
  float d    = length(cell - cw);
  float wave = sin(d * 1.5 - t * 3.5) * 0.5 + 0.5;
  float fall = 1.0 / (1.0 + d * d * 0.22);
  return fall * wave * u_riseStrength;
}

float mapScene(vec3 p, vec2 cw, float t, out vec2 cell) {
  cell       = floor(p.xz / TILE + 0.5);
  vec2 local = p.xz - cell * TILE;
  float halfW = (TILE - GAP) * 0.5;
  float h    = tileHeight(cell, cw, t);
  float cy   = h * 0.5 - 0.04;
  float ch   = max(0.05, h * 0.5 + 0.04);
  return sdBox(vec3(local.x, p.y - cy, local.y), vec3(halfW, ch, halfW));
}

const int   MAX_STEPS = 80;
const float MAX_DIST  = 30.0;
const float SURF_DIST = 0.003;

vec2 march(vec3 ro, vec3 rd, vec2 cw, float t) {
  float dist = 0.0;
  vec2  cell = vec2(0.0);
  for (int i = 0; i < MAX_STEPS; i++) {
    float d = mapScene(ro + rd * dist, cw, t, cell);
    if (d < SURF_DIST) return vec2(dist, 1.0);
    if (dist > MAX_DIST) break;
    dist += d * 0.7;
  }
  return vec2(dist, 0.0);
}

float ao(vec3 p, vec3 n, vec2 cw, float t) {
  float occ = 0.0, sc = 1.0;
  vec2 tmp;
  for (int i = 1; i <= 5; i++) {
    float h = 0.03 * float(i);
    occ += (h - mapScene(p + n * h, cw, t, tmp)) * sc;
    sc  *= 0.7;
  }
  return clamp(1.0 - 2.0 * occ, 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.y;

  vec3 ro = vec3(0.0, 4.5, 7.0);
  vec3 ta = vec3(0.0, 0.0, 0.0);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.6 * ww);

  vec2 mNDC = u_mouse * 2.0 - 1.0;
  vec3 mDir = normalize(mNDC.x * uu + mNDC.y * vv + 1.6 * ww);
  float tp  = -ro.y / mDir.y;
  vec2  cw  = clamp((ro + mDir * tp).xz, vec2(-8.0), vec2(8.0));

  vec2  res  = march(ro, rd, cw, u_time);
  float dist = res.x;
  float hit  = res.y;

  vec3 col = vec3(0.0);
  if (hit > 0.5) {
    vec3 p = ro + rd * dist;
    float e = 0.002;
    vec2 tmp;
    vec3 n = normalize(vec3(
      mapScene(p + vec3(e,0,0), cw, u_time, tmp) - mapScene(p - vec3(e,0,0), cw, u_time, tmp),
      mapScene(p + vec3(0,e,0), cw, u_time, tmp) - mapScene(p - vec3(0,e,0), cw, u_time, tmp),
      mapScene(p + vec3(0,0,e), cw, u_time, tmp) - mapScene(p - vec3(0,0,e), cw, u_time, tmp)
    ));

    vec3 ld   = normalize(vec3(1.0, 3.0, 1.5));
    float dif = max(dot(n, ld), 0.0);
    float spc = pow(max(dot(reflect(-ld, n), -rd), 0.0), 32.0);
    float occ = ao(p, n, cw, u_time);

    vec2 cell;
    mapScene(p, cw, u_time, cell);
    float af = exp(-length(cell - cw) * length(cell - cw) * 0.15);

    vec3 base = vec3(0.88, 0.86, 0.96);
    vec3 tc   = mix(base, u_accent, af * 0.6);

    col = tc * (0.3 + 0.7 * dif) * occ;
    col += vec3(1.0) * spc * 0.35;
    col *= u_brightness;
  } else {
    float skyT = uv.y * 0.5 + 0.5;
    col = mix(vec3(0.96, 0.94, 0.99), vec3(0.98, 0.97, 1.0), skyT) * u_brightness;
  }

  float vig = 1.0 - smoothstep(0.6, 1.4, length(uv));
  col *= vig * 0.8 + 0.2;
  col  = col / (col + 0.35);
  col  = pow(col, vec3(1.0 / 2.2));

  fragColor = vec4(col, 1.0);
}`;

export default function GridRise({
  className = '',
  brightness = 0.55,
  accentColor = [0.42, 0.22, 0.83],
  riseStrength = 1.0,
}: GridRiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef<[number, number]>([0.5, 0.5]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.warn('[GridRise] WebGL2 context unavailable — background disabled.');
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error('[GridRise] shader', gl.getShaderInfoLog(s));
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[GridRise] program link failed', gl.getProgramInfoLog(prog));
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(prog);
    const uRes    = gl.getUniformLocation(prog, 'u_resolution');
    const uTime   = gl.getUniformLocation(prog, 'u_time');
    const uMouse  = gl.getUniformLocation(prog, 'u_mouse');
    const uBright = gl.getUniformLocation(prog, 'u_brightness');
    const uAccent = gl.getUniformLocation(prog, 'u_accent');
    const uRise   = gl.getUniformLocation(prog, 'u_riseStrength');

    gl.uniform1f(uBright, brightness);
    gl.uniform3fv(uAccent, accentColor);
    gl.uniform1f(uRise, riseStrength);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = [
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      ];
    };
    window.addEventListener('mousemove', onMove);

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2fv(uMouse, mouse.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brightness, accentColor[0], accentColor[1], accentColor[2], riseStrength]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
