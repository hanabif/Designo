import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * GridRise — canvas recreation of React Bits Pro's "Grid Rise" background.
 *
 * A field of rounded tiles viewed from an orbiting camera: tiles under the
 * cursor rise in terraced layers (plate + block) while idle tiles keep a thin
 * visible plate so seams never disappear. Props mirror the documented Pro API
 * (pro.reactbits.dev/docs/components/grid-rise) so configs port over 1:1.
 */
export interface GridRiseProps {
  /** Base tile colour; side faces are darkened automatically. */
  color?: string;
  /** How much darker the side faces read than the tops. */
  relief?: number;
  /** Colour blended into tiles nearest the cursor. */
  accent?: string;
  /** Backdrop colour the grid fades into. */
  background?: string;
  /** How strongly the accent tints lifted tiles (0–1). */
  accentStrength?: number;
  /** Width of one grid cell in world units. */
  cellSize?: number;
  /** Rounds the top corners of the tiles, 0 keeps them square. */
  rounding?: number;
  /** Fraction of each cell left empty as a seam. */
  gap?: number;
  /** Height of the idle bobbing near the cursor. */
  amplitude?: number;
  /** Steady rise applied to tiles under the cursor. */
  lift?: number;
  /** Radius of the cursor's influence (world units). */
  liftRadius?: number;
  /** Multiplier for the bobbing rate. */
  speed?: number;
  /** Lens length; higher flattens the perspective. */
  zoom?: number;
  /** Camera angle around the grid in degrees. */
  orbit?: number;
  /** Camera distance from the centre. */
  distance?: number;
  /** Camera height above the grid. */
  altitude?: number;
  /** How much of the depth fades into the background (0–1). */
  haze?: number;
  /** Anti-aliasing level 1–3; raises the backing-store supersample. */
  samples?: number;
  /** Pixel ratio ceiling. */
  dpr?: number;
  /** Upper bound on rendered frames per second. */
  maxFps?: number;
  /** Radius of the idle orbit used before the cursor arrives. */
  drift?: number;
  /** How quickly the focus catches up to the cursor (per 60fps frame). */
  ease?: number;
  /** Let the pointer steer the raised region. */
  interactive?: boolean;
  /** Freeze the animation clock. */
  paused?: boolean;
  /** Classes applied to the wrapper. */
  className?: string;
  /** Overlay content rendered above the grid. */
  children?: React.ReactNode;
}

type RGB = [number, number, number];
type V3 = [number, number, number];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth01 = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(n)) return [255, 255, 255];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const mixRgb = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const scaleRgb = (c: RGB, f: number): RGB => [
  Math.min(255, Math.max(0, c[0] * f)),
  Math.min(255, Math.max(0, c[1] * f)),
  Math.min(255, Math.max(0, c[2] * f)),
];

const css = (c: RGB) =>
  `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

/** Deterministic per-cell hash. */
function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** Smooth 2D value noise. */
function vnoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/**
 * Quantise to a terrace step, blending across band edges so a tile glides
 * between heights instead of popping (layered look of the reference).
 */
function softRound(v: number, step: number): number {
  const f = v / step;
  const i = Math.floor(f);
  return (i + smooth01((f - i - 0.3) / 0.4)) * step;
}

/** Rounded polygon path (rounding applied at each corner). */
function roundedPath(ctx: CanvasRenderingContext2D, pts: Array<[number, number]>, r: number) {
  const n = pts.length;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const prev = pts[(i + n - 1) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const d1 = Math.hypot(prev[0] - cur[0], prev[1] - cur[1]);
    const d2 = Math.hypot(next[0] - cur[0], next[1] - cur[1]);
    const rr = Math.max(0, Math.min(r, d1 * 0.5, d2 * 0.5));
    if (rr < 0.4 || d1 < 0.001 || d2 < 0.001) {
      if (i === 0) ctx.moveTo(cur[0], cur[1]);
      else ctx.lineTo(cur[0], cur[1]);
      continue;
    }
    const p1: [number, number] = [cur[0] + ((prev[0] - cur[0]) * rr) / d1, cur[1] + ((prev[1] - cur[1]) * rr) / d1];
    const p2: [number, number] = [cur[0] + ((next[0] - cur[0]) * rr) / d2, cur[1] + ((next[1] - cur[1]) * rr) / d2];
    if (i === 0) ctx.moveTo(p1[0], p1[1]);
    else ctx.lineTo(p1[0], p1[1]);
    ctx.quadraticCurveTo(cur[0], cur[1], p2[0], p2[1]);
  }
  ctx.closePath();
}

export default function GridRise({
  className = '',
  color = '#0a0a0a',
  relief = 0,
  accent = '#de7dfa',
  background = '#0a0a0a',
  accentStrength = 0.85,
  cellSize = 0.06,
  rounding = 0.1,
  gap = 0.08,
  amplitude = 0.05,
  lift = 0.06,
  liftRadius = 0.6,
  speed = 0.6,
  zoom = 4,
  orbit = 45,
  distance = 1.5,
  altitude = 1,
  haze = 1,
  samples = 2,
  dpr = 1,
  maxFps = 60,
  drift = 0.28,
  ease = 0.1,
  interactive = true,
  paused = false,
  children,
}: GridRiseProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('[GridRise] 2D context unavailable — background disabled.');
      return;
    }

    const baseCol = hexToRgb(color);
    const accentCol = hexToRgb(accent);
    const bgCol = hexToRgb(background);

    // ── Camera (orbit / distance / altitude / zoom from the Pro API) ──
    const az = (orbit * Math.PI) / 180;
    const cam: V3 = [Math.sin(az) * distance, altitude, Math.cos(az) * distance];
    const camLen = Math.hypot(cam[0], cam[1], cam[2]);
    const w: V3 = [-cam[0] / camLen, -cam[1] / camLen, -cam[2] / camLen];
    // u = normalize(cross(w, up)), v = cross(u, w)
    const uLen = Math.hypot(-w[2], w[0]) || 1;
    const u: V3 = [-w[2] / uLen, 0, w[0] / uLen];
    const v: V3 = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const camDotW = cam[0] * w[0] + cam[1] * w[1] + cam[2] * w[2];

    let W = 0;
    let H = 0;
    let scale = 1;

    /** World → CSS-pixel screen position (and depth along the view axis). */
    const project = (x: number, y: number, z: number): [number, number, number] | null => {
      const rx = x - cam[0];
      const ry = y - cam[1];
      const rz = z - cam[2];
      const zc = rx * w[0] + ry * w[1] + rz * w[2];
      if (zc <= 1e-4) return null;
      const xc = (rx * u[0] + ry * u[1] + rz * u[2]) / zc;
      const yc = (rx * v[0] + ry * v[1] + rz * v[2]) / zc;
      return [W / 2 + xc * zoom * (H / 2), H / 2 - yc * zoom * (H / 2), zc];
    };

    /**
     * Screen → ground-plane world position. Every in-frame ray points below
     * the horizon (elevation > half-FOV at these defaults), so the top of the
     * frame tracks correctly — rays that miss (ultra-wide) clamp to a far
     * point instead of flipping behind the camera.
     */
    const unproject = (px: number, py: number): [number, number] => {
      const ux = (2 * px - W) / H;
      const uy = (H - 2 * py) / H;
      let dx = ux * u[0] + uy * v[0] + zoom * w[0];
      let dy = ux * u[1] + uy * v[1] + zoom * w[1];
      let dz = ux * u[2] + uy * v[2] + zoom * w[2];
      const dl = Math.hypot(dx, dy, dz) || 1;
      dx /= dl; dy /= dl; dz /= dl;
      const t = dy < -1e-4 ? -cam[1] / dy : 8;
      return [cam[0] + dx * t, cam[2] + dz * t];
    };

    // ── Visible cell set, rebuilt on resize ──
    interface Cell { cx: number; cz: number; zc0: number; plate: number; seed: number }
    let cells: Cell[] = [];
    let minX = -1;
    let maxX = 1;
    let minZ = -1;
    let maxZ = 1;

    const rebuild = () => {
      if (W < 2 || H < 2) return;
      // Frustum corners → ground-plane AABB (expand by liftRadius + margin).
      const xs: number[] = [];
      const zs: number[] = [];
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const p = unproject(W / 2 + sx * (H / 2), H / 2 - sy * (H / 2));
        xs.push(p[0]);
        zs.push(p[1]);
      }
      const margin = liftRadius + cellSize * 2;
      minX = Math.min(...xs) - margin;
      maxX = Math.max(...xs) + margin;
      minZ = Math.min(...zs) - margin;
      maxZ = Math.max(...zs) + margin;
      // Hard cap so pathological aspect ratios can't explode the cell count.
      const cap = 6000;
      if ((maxX - minX) / cellSize * (maxZ - minZ) / cellSize > cap) {
        const cx0 = (minX + maxX) / 2;
        const cz0 = (minZ + maxZ) / 2;
        const half = Math.sqrt((cap * cellSize * cellSize) / 4);
        minX = cx0 - half; maxX = cx0 + half;
        minZ = cz0 - half; maxZ = cz0 + half;
      }

      const i0 = Math.floor(minX / cellSize);
      const i1 = Math.ceil(maxX / cellSize);
      const j0 = Math.floor(minZ / cellSize);
      const j1 = Math.ceil(maxZ / cellSize);
      const built: Cell[] = [];
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const cx = (i + 0.5) * cellSize;
          const cz = (j + 0.5) * cellSize;
          built.push({
            cx,
            cz,
            // Depth key for painter's ordering (constant y term → far first).
            zc0: cx * w[0] + cz * w[2] - camDotW,
            plate: cellSize * (0.22 + 0.14 * hash2(i * 3.7, j * 1.9)),
            seed: hash2(i, j),
          });
        }
      }
      built.sort((a, b) => b.zc0 - a.zc0);
      cells = built;
      // Keep the focus (cursor) inside the grid.
      minX += cellSize * 2; maxX -= cellSize * 2;
      minZ += cellSize * 2; maxZ -= cellSize * 2;
      draw();
    };

    // ── Focus (cursor) state ──
    const focus = { x: 0, z: 0 };
    const target = { x: 0, z: 0 };
    let pointerInside = false;
    const pointer = { x: 0, y: 0 };
    let clock = 0;
    let last = performance.now();
    let lastDraw = -1e9;
    const frameInterval = 1000 / Math.max(1, maxFps);

    /** Project 4 world points; null if any is behind the camera. */
    const quad = (pts: Array<V3>): Array<[number, number]> | null => {
      const out: Array<[number, number]> = [];
      for (const p of pts) {
        const s = project(p[0], p[1], p[2]);
        if (!s) return null;
        out.push([s[0], s[1]]);
      }
      return out;
    };

    /** Fill a projected polygon (arrays aren't valid Path2D args). */
    const fillPoly = (pts: Array<[number, number]>) => {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      ctx.fill();
    };

    /** One tile = flat floor quad, or shadow + plate + raised block layer. */
    const drawCell = (c: Cell, h: number, col: RGB, zc: number) => {
      const cellPx = (cellSize * zoom * (H / 2)) / Math.max(zc, 1e-3);
      const r = rounding * cellPx * 0.5;

      // Flat tiles (no lift): a single seamless full-cell quad — no gap,
      // side faces or shadow, so the untouched floor reads as one clean
      // white surface instead of a grid of squares.
      if (h <= 1e-4) {
        const e = cellSize * 0.004; // closes hairline AA gaps between quads
        const f = cellSize * 0.5 + e;
        const fp = quad([
          [c.cx - f, 0.0006, c.cz - f],
          [c.cx + f, 0.0006, c.cz - f],
          [c.cx + f, 0.0006, c.cz + f],
          [c.cx - f, 0.0006, c.cz + f],
        ]);
        if (fp) {
          ctx.fillStyle = css(col);
          fillPoly(fp);
        }
        return;
      }

      const hw = (cellSize * (1 - gap)) * 0.5;
      const x0 = c.cx - hw;
      const x1 = c.cx + hw;
      const z0 = c.cz - hw;
      const z1 = c.cz + hw;
      const y1 = c.plate;
      const sideX = scaleRgb(col, 0.86 - relief * 0.35);
      const sideZ = scaleRgb(col, 0.71 - relief * 0.35);

      // Contact shadow (reads as the dark seam floor between tiles).
      const sh = quad([
        [x0 - hw * 0.12, 0.0004, z0 - hw * 0.12],
        [x1 + hw * 0.12, 0.0004, z0 - hw * 0.12],
        [x1 + hw * 0.12, 0.0004, z1 + hw * 0.12],
        [x0 - hw * 0.12, 0.0004, z1 + hw * 0.12],
      ]);
      if (sh) {
        ctx.fillStyle = 'rgba(18,14,34,0.07)';
        fillPoly(sh);
      }

      // Plate side faces (+x and +z face the orbit camera at 45°).
      const sx = quad([[x1, y1, z0], [x1, y1, z1], [x1, 0, z1], [x1, 0, z0]]);
      if (sx) { ctx.fillStyle = css(sideX); fillPoly(sx); }
      const sz = quad([[x0, y1, z1], [x1, y1, z1], [x1, 0, z1], [x0, 0, z1]]);
      if (sz) { ctx.fillStyle = css(sideZ); fillPoly(sz); }

      // Plate rounded top — every tile keeps this layer, flat or raised,
      // so the field never turns into one seamless surface.
      const tp = quad([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]);
      if (tp) {
        roundedPath(ctx, tp, r);
        ctx.fillStyle = css(col);
        ctx.fill();
      }

      // Raised block: inset second layer sitting on the plate (the layered
      // look of the reference).
      if (h > 1e-4) {
        const ib = hw - cellSize * 0.1;
        const bx0 = c.cx - ib;
        const bx1 = c.cx + ib;
        const bz0 = c.cz - ib;
        const bz1 = c.cz + ib;
        const y2 = y1 + h;
        const bsx = quad([[bx1, y2, bz0], [bx1, y2, bz1], [bx1, y1, bz1], [bx1, y1, bz0]]);
        if (bsx) { ctx.fillStyle = css(sideX); fillPoly(bsx); }
        const bsz = quad([[bx0, y2, bz1], [bx1, y2, bz1], [bx1, y1, bz1], [bx0, y1, bz1]]);
        if (bsz) { ctx.fillStyle = css(sideZ); fillPoly(bsz); }
        const btp = quad([[bx0, y2, bz0], [bx1, y2, bz0], [bx1, y2, bz1], [bx0, y2, bz1]]);
        if (btp) {
          roundedPath(ctx, btp, r);
          ctx.fillStyle = css(scaleRgb(col, 1.05));
          ctx.fill();
        }
      }
    };

    const draw = () => {
      if (W < 2 || H < 2) return;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.fillStyle = css(bgCol);
      ctx.fillRect(0, 0, W, H);

      const step = cellSize * 0.5;
      const reach = liftRadius * 1.15;
      const fadeStart = camLen + 0.15;

      for (const c of cells) {
        const zc = c.zc0;
        // Screen cull (cell centre + radius).
        const s = project(c.cx, c.plate * 0.5, c.cz);
        if (!s) continue;
        const rad = ((cellSize * zoom * (H / 2)) / Math.max(zc, 1e-3)) * 1.1;
        if (s[0] < -rad || s[0] > W + rad || s[1] < -rad || s[1] > H + rad) continue;

        // Docs semantics: `lift` is the STEADY rise under the cursor (a flat
        // plateau that fades out at the `liftRadius` edge); `amplitude` is the
        // idle bob riding on top of it near the cursor; `speed` only scales
        // the bobbing rate.
        const d = Math.hypot(c.cx - focus.x, c.cz - focus.z);
        const infl = d < liftRadius ? smooth01((liftRadius - d) / (liftRadius * 0.55)) : 0;
        const n = vnoise(c.cx * 7.5 + clock * speed * 0.22, c.cz * 7.5 - clock * speed * 0.17);
        const bob = Math.sin(clock * speed * 2.0 + n * Math.PI * 2 + c.seed * 6.2831) * 0.5 + 0.5;
        let h = softRound(infl * (lift + amplitude * bob), step);
        // NOTE: no minimum-height cutoff here — `softRound` already returns a
        // smooth glide from the first terrace down to exactly 0, so blocks
        // lower into the flat floor instead of popping out of existence.

        // Accent tint nearest the cursor, stronger on lifted tiles.
        const tint = d < reach ? 1 - smooth01(d / reach) : 0;
        const hn = Math.min(1, h / (lift + amplitude));
        const amt = clamp01(accentStrength * tint * (0.35 + 0.65 * hn));
        let col = mixRgb(baseCol, accentCol, amt);

        // Haze: depth fades into the background.
        const fog = haze * (1 - Math.exp(-Math.max(0, zc - fadeStart) / 0.62));
        if (fog > 0.003) col = mixRgb(col, bgCol, clamp01(fog));

        drawCell(c, h, col, zc);
      }
    };

    // ── Pointer ──
    const onMove = (e: MouseEvent) => {
      if (!interactive) return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointerInside = pointer.x >= 0 && pointer.x <= r.width && pointer.y >= 0 && pointer.y <= r.height;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // ── Sizing ──
    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      if (W < 2 || H < 2) return;
      const base = Math.min(window.devicePixelRatio || 1, dpr);
      // samples 1/2/3 → mild supersample on top of canvas native AA.
      scale = base * (samples >= 3 ? 1.5 : samples === 2 ? 1.25 : 1);
      canvas.width = Math.max(2, Math.round(W * scale));
      canvas.height = Math.max(2, Math.round(H * scale));
      rebuild();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // ── Loop ──
    let raf = requestAnimationFrame(function loop(now: number) {
      raf = requestAnimationFrame(loop);
      const dtMs = Math.min(now - last, 100);
      last = now;
      if (now - lastDraw < frameInterval - 1) return;
      lastDraw = now;
      const dt = dtMs / 1000;
      if (!paused && !reduceMotion) clock += dt;

      if (interactive && pointerInside) {
        const p = unproject(pointer.x, pointer.y);
        target.x = Math.min(maxX, Math.max(minX, p[0]));
        target.z = Math.min(maxZ, Math.max(minZ, p[1]));
      } else if (!reduceMotion) {
        // Idle orbit (the `drift` radius) until the cursor arrives.
        target.x = Math.cos(clock * 0.6) * drift;
        target.z = Math.sin(clock * 0.6) * drift;
      }
      const k = 1 - Math.pow(1 - clamp01(ease), dt * 60);
      focus.x += (target.x - focus.x) * k;
      focus.z += (target.z - focus.z) * k;

      draw();
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, interactive, reduceMotion]);

  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}



