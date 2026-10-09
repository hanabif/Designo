/**
 * Renders Mermaid flowchart source as ASCII/box-drawing art.
 *
 * Dependency-free by design: the backend only guarantees Mermaid source, so
 * we derive the other export formats client-side. Supports `graph`/`flowchart`
 * with common node shapes, edge labels, subgraphs, and cycle detection
 * (back-edges are listed in a legend rather than routed through the grid).
 *
 * Layout: nodes are assigned a column via longest-path layering, then drawn
 * as boxes on a character grid with routed edges between them.
 */

const MAX_LABEL_WIDTH = 16;

export interface AsciiNode {
  id: string;
  label: string;
  column: number;
  x: number;
  y: number;
  width: number; // inner (label) width
  height: number; // inner (label) height
}

export interface AsciiEdge {
  from: string;
  to: string;
  label?: string;
  isBackEdge: boolean;
}

export interface AsciiSubgraph {
  id: string;
  title: string;
  memberIds: string[];
}

export interface ParsedFlowchart {
  direction: 'TB' | 'LR';
  nodes: Map<string, { label: string; subgraph?: string }>;
  edges: AsciiEdge[];
  subgraphs: AsciiSubgraph[];
  layerOf: Map<string, number>;
}

/** Greedy word-wrap; long single words are hard-split. */
function wrapLabel(text: string, maxWidth = MAX_LABEL_WIDTH): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (word.length > maxWidth) {
      if (current) { lines.push(current); current = ''; }
      for (let i = 0; i < word.length; i += maxWidth) lines.push(word.slice(i, i + maxWidth));
      continue;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Extract `label` from a shape suffix like `[Text]`, `[(Cyl)]`, `((Round))`, `{Decision}`. */
function shapeLabel(shape: string | undefined, fallbackId: string): string {
  if (!shape) return fallbackId;
  const inner = shape.replace(/^[\s([<{]+/, '').replace(/[\s)\]}>]+$/, '').trim();
  return inner || fallbackId;
}

type LineToken =
  | { kind: 'node'; id: string; shape?: string; pos: number }
  | { kind: 'edge'; op: string; label?: string; pos: number };

/**
 * Tokenize one statement line into node references and the edge operators
 * between them (e.g. `A -->|label| B --> C`).
 *
 * Edge regions (including `|label|` text) are masked out before node
 * extraction so labels like `-->|yes|` are not mistaken for nodes.
 */
function tokenizeLine(line: string): LineToken[] {
  // Normalize `A -- text --> B` to the pipe-label form for uniform handling.
  const work = line.replace(/(^|\s)--\s+([^|>][^>]*?)\s+-->(?=\s|$)/g, '$1-->|$2|');

  const edgeRe = /(-{1,3}>|={2,3}>|-\.->|--[xo]|~~~)\s*(?:\|([^|]*)\|)?/g;
  const edges: LineToken[] = [];
  const masked = [...work];
  let m: RegExpExecArray | null;
  while ((m = edgeRe.exec(work)) !== null) {
    edges.push({ kind: 'edge', op: m[1], label: m[2], pos: m.index });
    for (let i = m.index; i < edgeRe.lastIndex; i++) masked[i] = ' ';
  }

  const nodeRe = /([A-Za-z_][\w-]*)\s*(\[\(.*?\)\]|\(\(.*?\)\)|\[.*?\]|\(.*?\)|\{.*?\}|>.*?\])?/g;
  const nodes: LineToken[] = [];
  while ((m = nodeRe.exec(masked.join(''))) !== null) {
    nodes.push({ kind: 'node', id: m[1], shape: m[2], pos: m.index });
  }

  return [...nodes, ...edges].sort((a, b) => a.pos - b.pos);
}

export function parseMermaidFlowchart(source: string): ParsedFlowchart {
  const parsed: ParsedFlowchart = {
    direction: 'TB',
    nodes: new Map(),
    edges: [],
    subgraphs: [],
    layerOf: new Map(),
  };
  let currentSubgraph: AsciiSubgraph | null = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.replace(/%%.*$/, '').trim();
    if (!line) continue;

    const header = /^(?:flowchart|graph)\s+(TB|TD|LR|RL|BT)\b/i.exec(line);
    if (header) {
      parsed.direction = /^(LR|RL)$/i.test(header[1]) ? 'LR' : 'TB';
      continue;
    }
    if (/^(?:flowchart|graph)\b/i.test(line)) continue;

    const sgOpen = /^subgraph\s*([\w-]+)?\s*(?:\[(.*?)\])?\s*$/.exec(line);
    if (sgOpen) {
      const id = sgOpen[1] ?? `sg${parsed.subgraphs.length}`;
      const title = sgOpen[2] ?? sgOpen[1] ?? id;
      currentSubgraph = { id, title, memberIds: [] };
      parsed.subgraphs.push(currentSubgraph);
      continue;
    }
    if (/^end\b/.test(line)) { currentSubgraph = null; continue; }
    if (/^(?:style|classDef|class|linkStyle|click|direction)\b/.test(line)) continue;

    const tokens = tokenizeLine(line);
    for (const token of tokens) {
      if (token.kind !== 'node') continue;
      const label = shapeLabel(token.shape, token.id);
      const existing = parsed.nodes.get(token.id);
      // Subgraph membership is claimed at first sight (Mermaid assigns a
      // node to the subgraph where it first appears); later references
      // inside other subgraph blocks must not reassign it.
      if (!existing) {
        parsed.nodes.set(token.id, { label, subgraph: currentSubgraph?.id });
        if (currentSubgraph) currentSubgraph.memberIds.push(token.id);
      } else if (token.shape) {
        existing.label = label;
      }
    }
    // Node-edge-node-… chains: A --> B --> C yields two edges.
    for (let i = 0; i + 2 < tokens.length; i += 2) {
      const a = tokens[i];
      const op = tokens[i + 1];
      const b = tokens[i + 2];
      if (a?.kind === 'node' && b?.kind === 'node' && op?.kind === 'edge') {
        parsed.edges.push({ from: a.id, to: b.id, label: op.label, isBackEdge: false });
      }
    }
  }

  // Kahn layering with cycle-breaking. Naive relaxation is wrong for cyclic
  // graphs (values run around the loop). Instead: schedule nodes whose
  // forward in-edges are all resolved; when nothing is schedulable a cycle
  // remains, so we cut it at the earliest-declared node by marking its
  // pending incoming edges as back-edges (those become the "return paths"
  // legend, e.g. `J --> A`).
  const ids = [...parsed.nodes.keys()];
  const pending = new Map<string, number>();
  const incoming = new Map<string, AsciiEdge[]>();
  const outgoing = new Map<string, AsciiEdge[]>();
  for (const id of ids) {
    parsed.layerOf.set(id, 0);
    pending.set(id, 0);
    incoming.set(id, []);
    outgoing.set(id, []);
  }
  for (const edge of parsed.edges) {
    if (!parsed.nodes.has(edge.from) || !parsed.nodes.has(edge.to)) continue;
    pending.set(edge.to, (pending.get(edge.to) ?? 0) + 1);
    incoming.get(edge.to)!.push(edge);
    outgoing.get(edge.from)!.push(edge);
  }

  const processed = new Set<string>();
  const ready: string[] = ids.filter((id) => pending.get(id) === 0);

  const schedule = (id: string) => {
    processed.add(id);
    let layer = 0;
    for (const edge of incoming.get(id) ?? []) {
      if (edge.isBackEdge || !processed.has(edge.from)) continue;
      layer = Math.max(layer, (parsed.layerOf.get(edge.from) ?? 0) + 1);
    }
    parsed.layerOf.set(id, layer);
    for (const edge of outgoing.get(id) ?? []) {
      if (edge.isBackEdge || processed.has(edge.to)) continue;
      const next = (pending.get(edge.to) ?? 1) - 1;
      pending.set(edge.to, next);
      if (next === 0) ready.push(edge.to);
    }
  };

  while (processed.size < ids.length) {
    if (ready.length === 0) {
      // Cycle with no entry point: cut at the earliest-declared node.
      const victim = ids.find((id) => !processed.has(id));
      if (!victim) break;
      for (const edge of incoming.get(victim) ?? []) {
        if (!edge.isBackEdge && !processed.has(edge.from)) {
          edge.isBackEdge = true;
          pending.set(victim, (pending.get(victim) ?? 1) - 1);
        }
      }
      if ((pending.get(victim) ?? 0) <= 0) {
        pending.set(victim, 0);
        ready.push(victim);
      }
      if (ready.length === 0) { schedule(victim); continue; }
    }
    const id = ready.shift()!;
    if (!processed.has(id)) schedule(id);
  }
  return parsed;
}

/** Character-grid canvas used to compose the ASCII art. */
class Grid {
  private cells: string[][] = [];
  width = 0;
  height = 0;

  ensure(x: number, y: number) {
    while (this.cells.length <= y) this.cells.push([]);
    const row = this.cells[y];
    while (row.length <= x) row.push(' ');
    this.width = Math.max(this.width, row.length);
    this.height = this.cells.length;
  }

  set(x: number, y: number, ch: string) {
    if (x < 0 || y < 0) return;
    this.ensure(x, y);
    this.cells[y][x] = ch;
  }

  hLine(x1: number, x2: number, y: number, ch = '─') {
    const [lo, hi] = x1 <= x2 ? [x1, x2] : [x2, x1];
    for (let x = lo; x <= hi; x++) this.set(x, y, ch);
  }

  vLine(x: number, y1: number, y2: number, ch = '│') {
    const [lo, hi] = y1 <= y2 ? [y1, y2] : [y2, y1];
    for (let y = lo; y <= hi; y++) this.set(x, y, ch);
  }

  get(x: number, y: number): string {
    return this.cells[y]?.[x] ?? ' ';
  }

  /**
   * Place an elbow corner, merging with whatever already occupies the cell.
   * Glyphs are decoded into side bits (U=1 D=2 L=4 R=8), unioned, and
   * re-encoded, so overlapping edges produce ┬ ┴ ├ ┤ ┼ junctions instead of
   * clobbering each other. When the cell holds a vertical that overwrote a
   * straight line, the horizontal through-connection is recovered from the
   * left/right neighbors.
   */
  setCorner(x: number, y: number, ch: '┌' | '┐' | '└' | '┘') {
    const SIDES: Record<string, number> = {
      '─': 12, '│': 3, '┌': 10, '┐': 6, '└': 9, '┘': 5,
      '┬': 14, '┴': 13, '├': 11, '┤': 7, '┼': 15,
    };
    const GLYPHS: Record<number, string> = {
      12: '─', 3: '│', 10: '┌', 6: '┐', 9: '└', 5: '┘',
      14: '┬', 13: '┴', 11: '├', 7: '┤', 15: '┼',
      4: '─', 8: '─', 1: '│', 2: '│',
    };
    const cur = this.get(x, y);
    let sides = (SIDES[cur] ?? 0) | (SIDES[ch] ?? 0);
    if (cur === '│') {
      if (SIDES[this.get(x - 1, y)] === 12) sides |= 4;
      if (SIDES[this.get(x + 1, y)] === 12) sides |= 8;
    }
    this.set(x, y, GLYPHS[sides] ?? ch);
  }

  toString(): string {
    const rows = this.cells.map((row) => row.join('').replace(/\s+$/, ''));
    while (rows.length && rows[rows.length - 1] === '') rows.pop();
    return rows.join('\n');
  }
}

interface Box {
  id: string;
  x: number;
  y: number;
  w: number; // outer width (inner + 2 borders)
  h: number; // outer height (inner + 2 borders)
}

/**
 * Compute box positions per layer.
 * - TB: each layer is a horizontal row of boxes; rows stack downward.
 * - LR: each layer is a vertical column of boxes; columns stack rightward.
 */
function layoutBoxes(parsed: ParsedFlowchart): Map<string, Box> {
  const byLayer = new Map<number, string[]>();
  for (const id of parsed.nodes.keys()) {
    const layer = parsed.layerOf.get(id) ?? 0;
    if (!byLayer.has(layer)) byLayer.set(layer, []);
    byLayer.get(layer)!.push(id);
  }
  const layers = [...byLayer.keys()].sort((a, b) => a - b);

  const inner = new Map<string, { lines: string[]; w: number; h: number }>();
  for (const [id, info] of parsed.nodes) {
    const lines = wrapLabel(info.label);
    // +2 = one padding space on each side of the label inside the box.
    const w = Math.max(...lines.map((l) => l.length), 6) + 2;
    inner.set(id, { lines, w, h: lines.length });
  }

  const boxes = new Map<string, Box>();
  const LANE = 4; // routing lane between layers

  if (parsed.direction === 'LR') {
    let x = 1;
    for (const layer of layers) {
      const members = byLayer.get(layer)!;
      let y = 1;
      for (const id of members) {
        const n = inner.get(id)!;
        boxes.set(id, { id, x, y, w: n.w + 2, h: n.h + 2 });
        y += n.h + 2 + 1; // box + 1 blank row between stacked nodes
      }
      const colW = Math.max(...members.map((id) => boxes.get(id)!.w));
      x += colW + LANE;
    }
  } else {
    let y = 1;
    for (const layer of layers) {
      const members = byLayer.get(layer)!;
      const rowH = Math.max(...members.map((id) => inner.get(id)!.h));
      let x = 1;
      for (const id of members) {
        const n = inner.get(id)!;
        // Vertically center shorter boxes within the layer row.
        boxes.set(id, { id, x, y: y + Math.floor((rowH - n.h) / 2), w: n.w + 2, h: n.h + 2 });
        x += n.w + 2 + 3; // box + 3 columns between side-by-side nodes
      }
      y += rowH + 2 + LANE - 2; // box + routing rows below
    }
  }
  return boxes;
}

function drawBox(grid: Grid, box: Box, lines: string[]) {
  const x2 = box.x + box.w - 1;
  const y2 = box.y + box.h - 1;
  grid.set(box.x, box.y, '┌');
  grid.set(x2, box.y, '┐');
  grid.set(box.x, y2, '└');
  grid.set(x2, y2, '┘');
  grid.hLine(box.x + 1, x2 - 1, box.y, '─');
  grid.hLine(box.x + 1, x2 - 1, y2, '─');
  grid.vLine(box.x, box.y + 1, y2 - 1, '│');
  grid.vLine(x2, box.y + 1, y2 - 1, '│');
  for (let i = 0; i < lines.length; i++) {
    const text = (' ' + lines[i]).padEnd(box.w - 2, ' ');
    for (let c = 0; c < text.length; c++) grid.set(box.x + 1 + c, box.y + 1 + i, text[c]);
  }
}

type Arrowhead = { x: number; y: number; ch: '▶' | '▼' };
type Corner = { x: number; y: number; ch: '┌' | '┐' | '└' | '┘' };

/**
 * Route one forward edge between two boxes.
 * LR: leaves the source's right side, crosses a lane, enters the target's
 * left side. TB: leaves the bottom, crosses a row lane, enters the top.
 *
 * Corners and arrowheads are collected rather than drawn immediately:
 * the caller applies segments first, then corners (merged with whatever
 * lines cross them), then arrowheads. That way overlapping edges produce
 * proper ┬ ┴ ├ ┤ junctions instead of erasing each other.
 */
function drawEdge(
  grid: Grid,
  from: Box,
  to: Box,
  direction: 'TB' | 'LR',
  corners: Corner[],
  heads: Arrowhead[],
) {
  if (direction === 'LR') {
    const sy = from.y + Math.floor(from.h / 2);
    const ty = to.y + Math.floor(to.h / 2);
    const startX = from.x + from.w; // first cell right of the source box
    const laneX = startX + 1;
    const endX = to.x - 1; // arrowhead cell
    if (sy === ty) {
      if (endX > startX) grid.hLine(startX, endX - 1, sy, '─');
      heads.push({ x: endX, y: ty, ch: '▶' });
      return;
    }
    // Source stub stops just before the corner cell so the corner glyph
    // (and any merge) can be applied in the later pass.
    grid.hLine(startX, laneX - 1, sy, '─');
    grid.vLine(laneX, sy, ty, '│');
    if (endX > laneX + 1) grid.hLine(laneX + 1, endX - 1, ty, '─');
    corners.push({ x: laneX, y: sy, ch: ty > sy ? '┐' : '┘' });
    corners.push({ x: laneX, y: ty, ch: ty > sy ? '└' : '┌' });
    heads.push({ x: endX, y: ty, ch: '▶' });
  } else {
    const sx = from.x + Math.floor(from.w / 2);
    const tx = to.x + Math.floor(to.w / 2);
    const startY = from.y + from.h;
    const laneY = startY + 1;
    const endY = to.y - 1;
    if (sx === tx) {
      if (endY > startY) grid.vLine(sx, startY, endY - 1, '│');
      heads.push({ x: tx, y: endY, ch: '▼' });
      return;
    }
    grid.vLine(sx, startY, laneY - 1, '│');
    // Segment runs between the corner cell (at sx) and the head cell (at tx),
    // respecting direction; adjacent cells need no segment (guards prevent
    // hLine's range normalization from drawing stray stubs).
    if (tx > sx + 1) grid.hLine(sx + 1, tx - 1, laneY, '─');
    else if (tx < sx - 1) grid.hLine(tx + 1, sx - 1, laneY, '─');
    corners.push({ x: sx, y: laneY, ch: tx > sx ? '└' : '┘' });
    if (endY > laneY) {
      if (endY > laneY + 1) grid.vLine(tx, laneY + 1, endY - 1, '│');
      corners.push({ x: tx, y: laneY, ch: tx > sx ? '┐' : '┌' });
    }
    heads.push({ x: tx, y: endY, ch: '▼' });
  }
}

/**
 * Convert Mermaid flowchart source to an ASCII art diagram.
 * Throws when the source contains no flowchart nodes (e.g. sequenceDiagram),
 * so callers can fall back to showing the raw source.
 */
export function mermaidToAscii(source: string): string {
  const parsed = parseMermaidFlowchart(source);
  if (parsed.nodes.size === 0) {
    throw new Error('Only flowchart (graph/flowchart) diagrams support the ASCII view.');
  }
  const boxes = layoutBoxes(parsed);
  const innerByLayer = new Map<string, string[]>();
  for (const [id, info] of parsed.nodes) innerByLayer.set(id, wrapLabel(info.label));

  const grid = new Grid();
  const corners: Array<{ x: number; y: number; ch: '┌' | '┐' | '└' | '┘' }> = [];
  const heads: Arrowhead[] = [];
  // Three passes: boxes, then edge segments, then merged corners, then
  // arrowheads — overlapping edges form proper junction glyphs and heads
  // are never erased by a later edge sharing the lane row.
  for (const [id, box] of boxes) drawBox(grid, box, innerByLayer.get(id) ?? ['']);
  for (const edge of parsed.edges) {
    if (edge.isBackEdge) continue;
    const from = boxes.get(edge.from);
    const to = boxes.get(edge.to);
    if (from && to) drawEdge(grid, from, to, parsed.direction, corners, heads);
  }
  for (const corner of corners) grid.setCorner(corner.x, corner.y, corner.ch);
  for (const head of heads) grid.set(head.x, head.y, head.ch);

  const label = (id: string) => parsed.nodes.get(id)?.label ?? id;
  const sections: string[] = [];
  sections.push(grid.toString());

  const backEdges = parsed.edges.filter((e) => e.isBackEdge);
  if (backEdges.length) {
    sections.push('Return paths (cycles):');
    for (const e of backEdges) sections.push(`  ${label(e.from)} --> ${label(e.to)}`);
  }
  const labeledEdges = parsed.edges.filter((e) => e.label);
  if (labeledEdges.length) {
    sections.push('Edge labels:');
    for (const e of labeledEdges) sections.push(`  ${label(e.from)} -- ${e.label} --> ${label(e.to)}`);
  }
  if (parsed.subgraphs.length) {
    sections.push('Subgraphs:');
    for (const sg of parsed.subgraphs) {
      sections.push(`  ${sg.title}: ${sg.memberIds.map(label).join(', ')}`);
    }
  }
  const stats = `${parsed.nodes.size} nodes, ${parsed.edges.length} edges`;
  sections.unshift(`flowchart ${parsed.direction === 'LR' ? 'LR' : 'TD'}  (${stats})`);
  return sections.join('\n');
}
