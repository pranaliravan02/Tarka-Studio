// Single source of truth for the Domains motion film: timing, coordinate
// space, and the numeric state of every actor at each of the six "hold"
// compositions (Product / Graphic / Digital / Marketing / Video / Tarka).
// The transitions between them are not separately authored — they are the
// interpolation GSAP performs between two adjacent states, driven by
// domainFilmTimeline.ts. This file contains no GSAP calls.

import { LOGO_PARTS, LOGO_GRID } from "./tarkaLogo";

/* ------------------------------------------------------------------ */
/* Stage coordinate space                                              */
/* ------------------------------------------------------------------ */

// The stage's absolute coordinate system is centred on the logo's own
// native centre point, so every other composition (product, poster, UI,
// campaign, filmstrip) is authored in the same space the logo lives in.
// No transform group or offset math is needed anywhere else in the film.
export const STAGE_MIN_X = -500;
export const STAGE_MIN_Y = -156;
export const STAGE_WIDTH = 1600;
export const STAGE_HEIGHT = 900;
export const STAGE_VIEWBOX = `${STAGE_MIN_X} ${STAGE_MIN_Y} ${STAGE_WIDTH} ${STAGE_HEIGHT}`;
export const STAGE_CENTER = { x: 300, y: 294 };

/* ------------------------------------------------------------------ */
/* Actor identity                                                      */
/* ------------------------------------------------------------------ */

export const FRAME_IDS = ["a", "b", "c", "d"] as const;
export type FrameId = (typeof FRAME_IDS)[number];

export const GUIDE_IDS = ["g1", "g2", "g3", "g4", "g5", "g6"] as const;
export type GuideId = (typeof GUIDE_IDS)[number];

/** Which logo part each frame rect resolves into during Video → Tarka. */
export const FRAME_TO_LOGO_PART: Record<FrameId, string> = {
  a: "gray-bar",
  b: "gray-stem",
  c: "black-t",
  d: "ka-body",
};

export const RETICLE_TO_LOGO_PART = "arc";

function logoPartBbox(id: string) {
  const part = LOGO_PARTS.find((p) => p.id === id);
  if (!part) throw new Error(`Unknown logo part: ${id}`);
  return part.bbox;
}

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export interface FrameState {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
}

export interface GuideState {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

export interface ReticleState {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}

export interface ProductState {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
}

export interface LabelState {
  unit: string;
  coord: string;
  kicker: string;
}

export type StateKey =
  | "product"
  | "graphic"
  | "digital"
  | "marketing"
  | "video"
  | "tarka";

export const STATE_ORDER: StateKey[] = [
  "product",
  "graphic",
  "digital",
  "marketing",
  "video",
  "tarka",
];

export const DOMAIN_INDEX_BY_STATE: Record<StateKey, number | null> = {
  product: 0,
  graphic: 1,
  digital: 2,
  marketing: 3,
  video: 4,
  tarka: null,
};

/* ------------------------------------------------------------------ */
/* Product wireframe (static shape; only its group transform animates) */
/* ------------------------------------------------------------------ */

// Isometric rectangular prism (190 x 100 x 90) drawn as three visible
// faces, centred at local origin. Positioned/scaled/faded per state via
// PRODUCT_TRANSFORM_BY_STATE below — the path data itself never changes.
export const PRODUCT_WIREFRAME_D =
  "M -189 -77.5 L -24.4 17.5 L -111 67.5 L -275.6 -27.5 Z " +
  "M -24.4 17.5 L -24.4 107.5 L -111 157.5 L -111 67.5 Z " +
  "M -189 -77.5 L -24.4 17.5 L -24.4 107.5 L -189 12.5 Z";

export const PRODUCT_TRANSFORM_BY_STATE: Record<StateKey, ProductState> = {
  product: { x: -150, y: 40, scaleX: 1, scaleY: 1, rotation: -4, opacity: 1 },
  graphic: {
    x: 130,
    y: -220,
    scaleX: 1.3,
    scaleY: 0.08,
    rotation: 0,
    opacity: 0,
  },
  digital: {
    x: 130,
    y: -220,
    scaleX: 1.3,
    scaleY: 0.08,
    rotation: 0,
    opacity: 0,
  },
  marketing: {
    x: 130,
    y: -220,
    scaleX: 1.3,
    scaleY: 0.08,
    rotation: 0,
    opacity: 0,
  },
  video: {
    x: 130,
    y: -220,
    scaleX: 1.3,
    scaleY: 0.08,
    rotation: 0,
    opacity: 0,
  },
  tarka: {
    x: 130,
    y: -220,
    scaleX: 1.3,
    scaleY: 0.08,
    rotation: 0,
    opacity: 0,
  },
};

/* ------------------------------------------------------------------ */
/* Frames (a/b/c/d) — the pool that carries every discipline's visual   */
/* window, and finally resolves into the four filled logo shapes.      */
/* ------------------------------------------------------------------ */

export const FRAME_LAYOUTS: Record<StateKey, Record<FrameId, FrameState>> = {
  product: {
    a: { x: 60, y: -40, width: 360, height: 280, rotation: -2, opacity: 1 },
    b: { x: 240, y: 100, width: 0, height: 0, rotation: 0, opacity: 0 },
    c: { x: 240, y: 100, width: 0, height: 0, rotation: 0, opacity: 0 },
    d: { x: 240, y: 100, width: 0, height: 0, rotation: 0, opacity: 0 },
  },
  graphic: {
    a: { x: 40, y: -140, width: 420, height: 340, rotation: 0, opacity: 1 },
    b: { x: 500, y: 40, width: 160, height: 160, rotation: 0, opacity: 1 },
    c: { x: 40, y: 220, width: 420, height: 60, rotation: 0, opacity: 1 },
    d: { x: 500, y: 220, width: 0, height: 0, rotation: 0, opacity: 0 },
  },
  digital: {
    a: { x: 40, y: -40, width: 420, height: 300, rotation: 0, opacity: 1 },
    b: { x: 40, y: -140, width: 580, height: 56, rotation: 0, opacity: 1 },
    c: { x: 480, y: -40, width: 140, height: 300, rotation: 0, opacity: 1 },
    d: { x: 480, y: 280, width: 140, height: 60, rotation: 0, opacity: 1 },
  },
  marketing: {
    a: { x: -460, y: -120, width: 380, height: 130, rotation: -3, opacity: 1 },
    b: { x: 760, y: -140, width: 150, height: 270, rotation: 4, opacity: 1 },
    c: { x: 40, y: 340, width: 380, height: 214, rotation: -2, opacity: 1 },
    d: { x: -260, y: 380, width: 200, height: 200, rotation: 3, opacity: 1 },
  },
  video: {
    a: { x: -130, y: 220, width: 200, height: 140, rotation: 0, opacity: 1 },
    b: { x: 90, y: 220, width: 200, height: 140, rotation: 0, opacity: 1 },
    c: { x: 310, y: 220, width: 200, height: 140, rotation: 0, opacity: 1 },
    d: { x: 530, y: 220, width: 200, height: 140, rotation: 0, opacity: 1 },
  },
  tarka: (() => {
    const layout = {} as Record<FrameId, FrameState>;
    for (const id of FRAME_IDS) {
      const bbox = logoPartBbox(FRAME_TO_LOGO_PART[id]);
      layout[id] = {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
        rotation: 0,
        opacity: 1,
      };
    }
    return layout;
  })(),
};

/* ------------------------------------------------------------------ */
/* Guide lines — ambient construction/column/divider/rail lines.       */
/* Always present at low opacity; never appear from nothing.           */
/* ------------------------------------------------------------------ */

export const GUIDE_LAYOUTS: Record<StateKey, Record<GuideId, GuideState>> = {
  product: {
    g1: { x1: -300, y1: -100, x2: -300, y2: 180, opacity: 0.35 },
    g2: { x1: -230, y1: -100, x2: -230, y2: 180, opacity: 0.3 },
    g3: { x1: -160, y1: -100, x2: -160, y2: 180, opacity: 0.35 },
    g4: { x1: -90, y1: -100, x2: -90, y2: 180, opacity: 0.3 },
    g5: { x1: -20, y1: -100, x2: -20, y2: 180, opacity: 0.35 },
    g6: { x1: -300, y1: 200, x2: -20, y2: 200, opacity: 0.4 },
  },
  graphic: {
    g1: { x1: 40, y1: -160, x2: 40, y2: 300, opacity: 0.3 },
    g2: { x1: 136, y1: -160, x2: 136, y2: 300, opacity: 0.28 },
    g3: { x1: 232, y1: -160, x2: 232, y2: 300, opacity: 0.3 },
    g4: { x1: 328, y1: -160, x2: 328, y2: 300, opacity: 0.28 },
    g5: { x1: 424, y1: -160, x2: 424, y2: 300, opacity: 0.3 },
    g6: { x1: 40, y1: 300, x2: 460, y2: 300, opacity: 0.35 },
  },
  digital: {
    g1: { x1: 40, y1: -140, x2: 40, y2: 340, opacity: 0.25 },
    g2: { x1: 480, y1: -140, x2: 480, y2: 340, opacity: 0.3 },
    g3: { x1: 620, y1: -140, x2: 620, y2: 340, opacity: 0.25 },
    g4: { x1: 40, y1: -84, x2: 620, y2: -84, opacity: 0.35 },
    g5: { x1: 40, y1: 140, x2: 480, y2: 140, opacity: 0.2 },
    g6: { x1: 40, y1: 340, x2: 620, y2: 340, opacity: 0.25 },
  },
  marketing: {
    g1: { x1: -400, y1: -150, x2: -400, y2: 550, opacity: 0.12 },
    g2: { x1: -100, y1: -150, x2: -100, y2: 550, opacity: 0.12 },
    g3: { x1: 200, y1: -150, x2: 200, y2: 550, opacity: 0.12 },
    g4: { x1: 500, y1: -150, x2: 500, y2: 550, opacity: 0.12 },
    g5: { x1: 800, y1: -150, x2: 800, y2: 550, opacity: 0.12 },
    g6: { x1: -460, y1: 200, x2: 940, y2: 200, opacity: 0.12 },
  },
  video: {
    g1: { x1: -160, y1: 190, x2: 760, y2: 190, opacity: 0.6 },
    g2: { x1: -160, y1: 390, x2: 760, y2: 390, opacity: 0.6 },
    g3: { x1: -60, y1: 190, x2: -60, y2: 210, opacity: 0.3 },
    g4: { x1: 190, y1: 190, x2: 190, y2: 210, opacity: 0.3 },
    g5: { x1: 440, y1: 190, x2: 440, y2: 210, opacity: 0.3 },
    g6: { x1: 680, y1: 190, x2: 680, y2: 210, opacity: 0.3 },
  },
  tarka: {
    g1: { x1: 300, y1: 294, x2: 300, y2: 294, opacity: 0 },
    g2: { x1: 300, y1: 294, x2: 300, y2: 294, opacity: 0 },
    g3: { x1: 300, y1: 294, x2: 300, y2: 294, opacity: 0 },
    g4: { x1: 300, y1: 294, x2: 300, y2: 294, opacity: 0 },
    g5: { x1: 300, y1: 294, x2: 300, y2: 294, opacity: 0 },
    g6: { x1: 300, y1: 294, x2: 300, y2: 294, opacity: 0 },
  },
};

/* ------------------------------------------------------------------ */
/* Reticle — crosshair → focus ring → seal → aperture → logo arc.      */
/* ------------------------------------------------------------------ */

export const RETICLE_LAYOUTS: Record<StateKey, ReticleState> = {
  product: { cx: -24.4, cy: 17.5, r: 14, opacity: 1 },
  graphic: { cx: 460, cy: -140, r: 18, opacity: 1 },
  digital: { cx: 620, cy: -140, r: 10, opacity: 1 },
  marketing: { cx: -80, cy: -120, r: 20, opacity: 1 },
  video: { cx: 730, cy: 220, r: 34, opacity: 1 },
  tarka: { cx: 300, cy: 294, r: 0, opacity: 1 },
};

/* ------------------------------------------------------------------ */
/* Labels                                                               */
/* ------------------------------------------------------------------ */

export const LABELS_BY_STATE: Record<StateKey, LabelState> = {
  product: { unit: "mm", coord: "W190 · D100 · H90", kicker: "CONSTRUCTION" },
  graphic: { unit: "pt", coord: "12PT BASELINE GRID", kicker: "PROPORTION" },
  digital: { unit: "px", coord: "RADIUS 6px · FLEX 1 1 AUTO", kicker: "INTERFACE" },
  marketing: { unit: "FORMAT", coord: "4 FORMATS ACTIVE", kicker: "CAMPAIGN" },
  video: { unit: "FPS", coord: "24 FPS · 2.39:1", kicker: "TIMELINE" },
  tarka: { unit: "", coord: "ONE SYSTEM. FIVE WAYS TO CREATE.", kicker: "SYSTEM" },
};

/* ------------------------------------------------------------------ */
/* Background grid opacity (ambient, non-actor, CSS-driven)            */
/* ------------------------------------------------------------------ */

export const GRID_OPACITY_BY_STATE: Record<StateKey, number> = {
  product: 0.5,
  graphic: 0.4,
  digital: 0.55,
  marketing: 0.25,
  video: 0.3,
  tarka: 0.08,
};

/* ------------------------------------------------------------------ */
/* Master phase timeline (percent of total scroll distance)            */
/* ------------------------------------------------------------------ */

export interface HoldPhase {
  id: StateKey;
  kind: "hold";
  state: StateKey;
  start: number;
  end: number;
}

export interface TransitionPhase {
  id: string;
  kind: "transition";
  from: StateKey;
  to: StateKey;
  start: number;
  end: number;
}

export type Phase = HoldPhase | TransitionPhase;

export const PHASES: Phase[] = [
  { id: "product", kind: "hold", state: "product", start: 0, end: 17 },
  {
    id: "product-graphic",
    kind: "transition",
    from: "product",
    to: "graphic",
    start: 17,
    end: 31,
  },
  { id: "graphic", kind: "hold", state: "graphic", start: 31, end: 40 },
  {
    id: "graphic-digital",
    kind: "transition",
    from: "graphic",
    to: "digital",
    start: 40,
    end: 50,
  },
  { id: "digital", kind: "hold", state: "digital", start: 50, end: 59 },
  {
    id: "digital-marketing",
    kind: "transition",
    from: "digital",
    to: "marketing",
    start: 59,
    end: 68,
  },
  { id: "marketing", kind: "hold", state: "marketing", start: 68, end: 76 },
  {
    id: "marketing-video",
    kind: "transition",
    from: "marketing",
    to: "video",
    start: 76,
    end: 85,
  },
  { id: "video", kind: "hold", state: "video", start: 85, end: 92 },
  {
    id: "video-tarka",
    kind: "transition",
    from: "video",
    to: "tarka",
    start: 92,
    end: 98,
  },
  { id: "tarka", kind: "hold", state: "tarka", start: 98, end: 100 },
];

export const TOTAL_TIMELINE_DURATION = 100;

/** Convenience: the crossfade window (as a 0..1 fraction of the
 * video-tarka transition) during which frame rects hand off to the
 * exact traced logo paths. Kept short and placed near the very end so
 * the geometric convergence reads first and the swap is imperceptible. */
export const LOGO_SWAP_WINDOW: [number, number] = [0.86, 1];

/** Fraction of the video-tarka transition at which domain footage inside
 * frames a-d fades out, before the geometric convergence takes over. */
export const VIDEO_FOOTAGE_FADE_END = 0.18;

export { LOGO_GRID };