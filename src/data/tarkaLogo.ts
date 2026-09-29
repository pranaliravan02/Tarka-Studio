// Exact vector trace of the approved Tarka logo (Tarka_logo_final_png-02.png).
// Traced via per-channel contour extraction at sub-pixel epsilon (0.25% of
// perimeter) directly from the source raster. Geometry is NOT redrawn,
// simplified, or reinterpreted — every coordinate below reproduces the
// original artwork's contours.
//
// Do not edit path data by hand. If the source artwork changes, retrace.

export const LOGO_VIEWBOX = "0 0 591 591";
export const LOGO_SIZE = 591;

export const LOGO_INK = "#040707";
export const LOGO_GRAY = "#B8B1B7";

/**
 * The Marathi "क" body: crossbar, stem, leaf/loop and lower hook, traced as
 * a single compound path with the counter-space (hole) cut via evenodd.
 */
export const LOGO_KA_BODY_D =
  "M 303 242 L 303 264 L 332 265 L 332 320 L 298 333 L 275 354 L 261 381 L 257 416 L 298 400 L 331 369 L 332 451 L 352 451 L 352 402 L 364 377 L 389 361 L 414 367 L 441 398 L 444 429 L 429 468 L 397 494 L 406 512 L 441 485 L 456 460 L 464 427 L 462 399 L 446 368 L 414 345 L 383 342 L 352 359 L 352 265 L 466 264 L 466 242 Z " +
  "M 320 345 L 321 346 L 321 347 L 320 348 L 320 349 L 319 350 L 319 351 L 317 353 L 317 354 L 315 356 L 315 357 L 313 359 L 313 360 L 308 365 L 308 366 L 301 373 L 300 373 L 295 378 L 294 378 L 292 380 L 291 380 L 289 382 L 288 382 L 286 384 L 285 384 L 282 386 L 281 385 L 281 384 L 283 381 L 283 379 L 284 378 L 284 377 L 285 376 L 285 375 L 287 373 L 287 372 L 288 371 L 288 370 L 291 367 L 291 366 L 304 353 L 305 353 L 307 351 L 308 351 L 310 349 L 311 349 L 312 348 L 313 348 L 314 347 L 315 347 L 318 345 Z";

/** The black "T" (crossbar + stem fused as one contour). */
export const LOGO_BLACK_T_D =
  "M 95 242 L 95 265 L 165 266 L 165 481 L 189 481 L 189 266 L 259 265 L 259 242 Z";

/** The upper arc (open ring, top-right of the mark). */
export const LOGO_ARC_D =
  "M 479 107 L 457 89 L 440 81 L 423 77 L 386 79 L 362 89 L 348 99 L 330 121 L 324 133 L 318 157 L 318 180 L 322 199 L 339 231 L 355 219 L 344 201 L 337 173 L 339 151 L 349 128 L 365 111 L 380 102 L 403 96 L 417 96 L 439 102 L 455 112 L 471 129 L 480 146 L 485 170 L 505 169 L 497 135 Z";

/** The gray "T" stem, sitting behind the black T. */
export const LOGO_GRAY_STEM_D = "M 208 266 L 208 443 L 232 443 L 232 266 Z";

/** The gray "T" crossbar, sitting behind the black T. */
export const LOGO_GRAY_BAR_D =
  "M 138 204 L 138 226 L 206 226 L 208 228 L 208 241 L 232 241 L 232 228 L 234 226 L 302 226 L 302 204 Z";

export interface LogoPart {
  id: string;
  d: string;
  fill: string;
  fillRule?: "nonzero" | "evenodd";
  bbox: { x: number; y: number; width: number; height: number };
}

/** Render order matters: gray sits under black. */
export const LOGO_PARTS: LogoPart[] = [
  {
    id: "gray-bar",
    d: LOGO_GRAY_BAR_D,
    fill: LOGO_GRAY,
    bbox: { x: 138, y: 204, width: 164, height: 37 },
  },
  {
    id: "gray-stem",
    d: LOGO_GRAY_STEM_D,
    fill: LOGO_GRAY,
    bbox: { x: 208, y: 266, width: 24, height: 177 },
  },
  {
    id: "black-t",
    d: LOGO_BLACK_T_D,
    fill: LOGO_INK,
    bbox: { x: 95, y: 242, width: 164, height: 239 },
  },
  {
    id: "arc",
    d: LOGO_ARC_D,
    fill: LOGO_INK,
    bbox: { x: 318, y: 77, width: 187, height: 154 },
  },
  {
    id: "ka-body",
    d: LOGO_KA_BODY_D,
    fill: LOGO_INK,
    fillRule: "evenodd",
    bbox: { x: 257, y: 242, width: 209, height: 270 },
  },
];

/** Overall bounds of the visible mark within the 591x591 source canvas. */
export const LOGO_BOUNDS = { x: 95, y: 77, width: 410, height: 435 };
export const LOGO_CENTER = { x: 300, y: 294.5 };

/**
 * Structural anchor lines derived from the logo geometry. Later domain
 * phases align their grids, rails and frame edges to these so every
 * transformation resolves onto the real logo, not an approximation.
 */
export const LOGO_GRID = {
  // Horizontal bars: black T crossbar band and gray T crossbar band.
  blackBarY: [242, 265] as [number, number],
  grayBarY: [204, 226] as [number, number],
  // Vertical stems.
  blackStemX: [165, 189] as [number, number],
  grayStemX: [208, 232] as [number, number],
  // The क body's own crossbar (shares the black T crossbar's y-band).
  kaBarY: [242, 265] as [number, number],
  kaStemX: [332, 352] as [number, number],
  // Arc bounding box, used as the "playhead sweep becomes arc" target.
  arcBounds: { x: 318, y: 77, width: 187, height: 154 },
};