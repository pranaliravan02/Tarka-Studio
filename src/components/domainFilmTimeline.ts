// Builds and owns the single master GSAP timeline + ScrollTrigger for the
// Domains motion film. No React here — this module only touches the DOM
// nodes it's given, via a small data-attribute contract that
// DomainSection.tsx fulfils exactly:
//
//   [data-frame="a|b|c|d"]        <rect>   the four transforming actors
//   [data-frame-image="a|b|c|d"]  <image>  photographic content per frame
//   [data-guide="g1".."g6"]       <line>   ambient construction/rail lines
//   [data-reticle]                <circle> crosshair / focus ring / arc seed
//   [data-product]                <g>      wraps the isometric wireframe path
//   [data-grid]                   <rect>   ambient background grid (opacity only)
//   [data-label-unit]             text     "mm" / "pt" / "px" / "FPS" ...
//   [data-label-coord]            text     coordinate/spec annotation
//   [data-label-kicker]           text     small discipline tag
//   [data-progress-fill]          <rect|div> scaled by overall scroll progress
//
// Discrete state (label text, image hrefs, active-domain highlighting) is
// applied imperatively in the ScrollTrigger's onUpdate, keyed off the
// authored phase table — not animated as GSAP tweens — because text
// content and href swaps are not meaningfully "tweenable" and must be
// perfectly symmetric on scroll-reverse. Continuous geometry (position,
// size, rotation, opacity, and the final MorphSVG conversions) lives in the
// single scrubbed timeline itself.

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

import type { Domain } from "../data/domains";
import { LOGO_PARTS, LOGO_ARC_D } from "../data/tarkaLogo";
import {
  PHASES,
  STATE_ORDER,
  DOMAIN_INDEX_BY_STATE,
  FRAME_IDS,
  GUIDE_IDS,
  FRAME_LAYOUTS,
  GUIDE_LAYOUTS,
  RETICLE_LAYOUTS,
  PRODUCT_TRANSFORM_BY_STATE,
  LABELS_BY_STATE,
  GRID_OPACITY_BY_STATE,
  FRAME_TO_LOGO_PART,
  LOGO_SWAP_WINDOW,
  VIDEO_FOOTAGE_FADE_END,
  TOTAL_TIMELINE_DURATION,
  PRODUCT_WIREFRAME_D,
  type StateKey,
  type FrameId,
  type Phase,
} from "../data/domainFilm";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

/**
 * Which domain image (by index into `domains`) each frame displays in
 * each hold state. `null` means the frame carries no photographic content
 * in that state (it reads as a pure geometric/typographic panel).
 */
const IMAGE_DOMAIN_BY_STATE: Record<
  StateKey,
  Record<FrameId, number | null>
> = {
  product: { a: 0, b: null, c: null, d: null },
  graphic: { a: 1, b: null, c: null, d: null },
  digital: { a: 2, b: null, c: null, d: null },
  marketing: { a: 3, b: 3, c: 3, d: 3 },
  video: { a: 4, b: 4, c: 4, d: 4 },
  tarka: { a: null, b: null, c: null, d: null },
};

const FRAME_WASH_COLOR = "#0f2e33";
const LABEL_FADE_WIDTH = 3;

export interface DomainFilmHandle {
  revert: () => void;
}

function logoPart(id: string) {
  const part = LOGO_PARTS.find((p) => p.id === id);

  if (!part) {
    throw new Error(`Unknown logo part: ${id}`);
  }

  return part;
}

/**
 * Which authored phase (and, for transitions, which side of it) a given
 * scroll percentage falls into. Used both to resolve the current "label
 * state" and to drive the active-domain indicator.
 */
function resolvePhaseState(percent: number): {
  phase: Phase;
  state: StateKey;
} {
  const clamped = Math.max(0, Math.min(TOTAL_TIMELINE_DURATION, percent));

  const phase =
    PHASES.find((p) => clamped >= p.start && clamped < p.end) ??
    PHASES[PHASES.length - 1];

  if (phase.kind === "hold") {
    return {
      phase,
      state: phase.state,
    };
  }

  const local = (clamped - phase.start) / (phase.end - phase.start || 1);

  return {
    phase,
    state: local < 0.5 ? phase.from : phase.to,
  };
}

export function buildDomainFilmTimeline(
  section: HTMLElement,
  stage: HTMLElement,
  domains: Domain[],
  reducedMotion: boolean,
  onActiveDomainChange?: (index: number | null) => void,
): DomainFilmHandle {
  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(stage);

    const frameEls: Record<FrameId, SVGRectElement> = {} as Record<
      FrameId,
      SVGRectElement
    >;

    const frameImageEls: Record<FrameId, SVGImageElement> = {} as Record<
      FrameId,
      SVGImageElement
    >;

    for (const id of FRAME_IDS) {
      const rect = q(`[data-frame="${id}"]`)[0] as SVGRectElement | undefined;

      const image = q(`[data-frame-image="${id}"]`)[0] as
        | SVGImageElement
        | undefined;

      if (!rect || !image) {
        return;
      }

      frameEls[id] = rect;
      frameImageEls[id] = image;
    }

    const guideEls: Record<string, SVGLineElement> = {};

    for (const id of GUIDE_IDS) {
      const line = q(`[data-guide="${id}"]`)[0] as SVGLineElement | undefined;

      if (!line) {
        return;
      }

      guideEls[id] = line;
    }

    const reticleEl = q("[data-reticle]")[0] as SVGCircleElement | undefined;

    const productEl = q("[data-product]")[0] as SVGGElement | undefined;

    const gridEl = q("[data-grid]")[0] as SVGRectElement | undefined;

    const labelUnitEl = q("[data-label-unit]")[0] as HTMLElement | undefined;

    const labelCoordEl = q("[data-label-coord]")[0] as HTMLElement | undefined;

    const labelKickerEl = q("[data-label-kicker]")[0] as
      | HTMLElement
      | undefined;

    const progressFillEl = q("[data-progress-fill]")[0] as
      | HTMLElement
      | SVGElement
      | undefined;

    if (!reticleEl || !productEl) {
      return;
    }

    gsap.set([...Object.values(frameEls), reticleEl], {
      transformOrigin: "50% 50%",
    });

    gsap.set(productEl, {
      transformOrigin: "50% 50%",
    });

    // Frame "d" is the only actor whose final path (ka-body) has an
    // internal counter-space. evenodd is a no-op on a plain rectangle, so
    // setting it once up front is safe in both scroll directions and
    // avoids needing a reverse-set later.
    gsap.set(frameEls.d, {
      attr: {
        "fill-rule": "evenodd",
      },
    });

    /* ---------------------------------------------------------------- */
    /* Baseline: establish the Product state before any scroll happens. */
    /* ---------------------------------------------------------------- */

    const applyFrameSnapshot = (state: StateKey) => {
      for (const id of FRAME_IDS) {
        const f = FRAME_LAYOUTS[state][id];

        gsap.set(frameEls[id], {
          attr: {
            x: f.x,
            y: f.y,
            width: f.width,
            height: f.height,
          },
          rotation: f.rotation,
          opacity: f.opacity,
          fill: FRAME_WASH_COLOR,
          fillOpacity: 0.22,
          strokeOpacity: 1,
        });

        const domainIndex = IMAGE_DOMAIN_BY_STATE[state][id];

        gsap.set(frameImageEls[id], {
          opacity: domainIndex === null ? 0 : 1,
          attr:
            domainIndex === null
              ? {}
              : {
                  href: domains[domainIndex]?.imageLarge ?? "",
                },
        });
      }
    };

    const applyGuideSnapshot = (state: StateKey) => {
      for (const id of GUIDE_IDS) {
        const g = GUIDE_LAYOUTS[state][id];

        gsap.set(guideEls[id], {
          attr: {
            x1: g.x1,
            y1: g.y1,
            x2: g.x2,
            y2: g.y2,
          },
          opacity: g.opacity,
        });
      }
    };

    const applyReticleSnapshot = (state: StateKey) => {
      const r = RETICLE_LAYOUTS[state];

      gsap.set(reticleEl, {
        attr: {
          cx: r.cx,
          cy: r.cy,
          r: r.r,
        },
        opacity: r.opacity,
      });
    };

    const applyProductSnapshot = (state: StateKey) => {
      const p = PRODUCT_TRANSFORM_BY_STATE[state];

      gsap.set(productEl, {
        x: p.x,
        y: p.y,
        scaleX: p.scaleX,
        scaleY: p.scaleY,
        rotation: p.rotation,
        opacity: p.opacity,
      });
    };

    applyFrameSnapshot("product");
    applyGuideSnapshot("product");
    applyReticleSnapshot("product");
    applyProductSnapshot("product");

    if (gridEl) {
      gsap.set(gridEl, {
        opacity: GRID_OPACITY_BY_STATE.product,
      });
    }

    if (productEl.querySelector("path")) {
      const wireframe = productEl.querySelector("path") as SVGPathElement;

      wireframe.setAttribute("d", PRODUCT_WIREFRAME_D);
    }

    /* ---------------------------------------------------------------- */
    /* Master timeline: geometric tweens only.                          */
    /* ---------------------------------------------------------------- */

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "none",
      },
    });

    const place = (
      targets: gsap.TweenTarget,
      fromVars: gsap.TweenVars,
      toVars: gsap.TweenVars,
      position: number,
      duration: number,
    ) => {
      if (reducedMotion) {
        tl.set(targets, toVars, position + duration);
      } else {
        tl.fromTo(
          targets,
          fromVars,
          {
            ...toVars,
            duration,
          },
          position,
        );
      }
    };

    for (const phase of PHASES) {
      if (phase.kind !== "transition") {
        continue;
      }

      const { from, to, start } = phase;
      const fullDuration = phase.end - phase.start;

      const isFinal = phase.id === "video-tarka";

      const geometryDuration = isFinal
        ? fullDuration * LOGO_SWAP_WINDOW[0]
        : fullDuration;

      // Frames
      for (const id of FRAME_IDS) {
        const fromState = FRAME_LAYOUTS[from][id];

        const toState = FRAME_LAYOUTS[to][id];

        place(
          frameEls[id],
          {
            attr: {
              x: fromState.x,
              y: fromState.y,
              width: fromState.width,
              height: fromState.height,
            },
            rotation: fromState.rotation,
            opacity: fromState.opacity,
          },
          {
            attr: {
              x: toState.x,
              y: toState.y,
              width: toState.width,
              height: toState.height,
            },
            rotation: toState.rotation,
            opacity: toState.opacity,
          },
          start,
          geometryDuration,
        );
      }

      // Guides
      for (const id of GUIDE_IDS) {
        const fromG = GUIDE_LAYOUTS[from][id];

        const toG = GUIDE_LAYOUTS[to][id];

        place(
          guideEls[id],
          {
            attr: {
              x1: fromG.x1,
              y1: fromG.y1,
              x2: fromG.x2,
              y2: fromG.y2,
            },
            opacity: fromG.opacity,
          },
          {
            attr: {
              x1: toG.x1,
              y1: toG.y1,
              x2: toG.x2,
              y2: toG.y2,
            },
            opacity: toG.opacity,
          },
          start,
          fullDuration,
        );
      }

      // Reticle
      const fromR = RETICLE_LAYOUTS[from];

      const toR = RETICLE_LAYOUTS[to];

      place(
        reticleEl,
        {
          attr: {
            cx: fromR.cx,
            cy: fromR.cy,
            r: fromR.r,
          },
          opacity: fromR.opacity,
        },
        {
          attr: {
            cx: toR.cx,
            cy: toR.cy,
            r: toR.r,
          },
          opacity: toR.opacity,
        },
        start,
        geometryDuration,
      );

      // Product transform
      const fromP = PRODUCT_TRANSFORM_BY_STATE[from];

      const toP = PRODUCT_TRANSFORM_BY_STATE[to];

      place(
        productEl,
        {
          x: fromP.x,
          y: fromP.y,
          scaleX: fromP.scaleX,
          scaleY: fromP.scaleY,
          rotation: fromP.rotation,
          opacity: fromP.opacity,
        },
        {
          x: toP.x,
          y: toP.y,
          scaleX: toP.scaleX,
          scaleY: toP.scaleY,
          rotation: toP.rotation,
          opacity: toP.opacity,
        },
        start,
        fullDuration,
      );

      // Ambient grid opacity
      if (gridEl) {
        place(
          gridEl,
          {
            opacity: GRID_OPACITY_BY_STATE[from],
          },
          {
            opacity: GRID_OPACITY_BY_STATE[to],
          },
          start,
          fullDuration,
        );
      }

      // Final convergence: footage fade, colour resolve,
      // and MorphSVG conversion into the exact traced logo paths.
      if (isFinal) {
        const fadeEnd = start + fullDuration * VIDEO_FOOTAGE_FADE_END;

        for (const id of FRAME_IDS) {
          place(
            frameImageEls[id],
            {
              opacity: 1,
            },
            {
              opacity: 0,
            },
            start,
            fadeEnd - start,
          );
        }

        const swapStart = start + fullDuration * LOGO_SWAP_WINDOW[0];

        const swapEnd = start + fullDuration * LOGO_SWAP_WINDOW[1];

        const swapDuration = swapEnd - swapStart;

        for (const id of FRAME_IDS) {
          const part = logoPart(FRAME_TO_LOGO_PART[id]);

          if (reducedMotion) {
            tl.set(
              frameEls[id],
              {
                morphSVG: part.d,
                fill: part.fill,
                fillOpacity: 1,
                strokeOpacity: 0,
              },
              swapEnd,
            );
          } else {
            tl.to(
              frameEls[id],
              {
                morphSVG: part.d,
                fill: part.fill,
                fillOpacity: 1,
                strokeOpacity: 0,
                duration: swapDuration,
                ease: "none",
              },
              swapStart,
            );
          }
        }

        const arcPart = logoPart("arc");

        if (reducedMotion) {
          tl.set(
            reticleEl,
            {
              morphSVG: arcPart.d,
              fill: arcPart.fill,
              opacity: 1,
            },
            swapEnd,
          );
        } else {
          tl.to(
            reticleEl,
            {
              morphSVG: LOGO_ARC_D,
              fill: arcPart.fill,
              opacity: 1,
              duration: swapDuration,
              ease: "none",
            },
            swapStart,
          );
        }
      }
    }

    // Pad the timeline to an exact total of TOTAL_TIMELINE_DURATION so
    // ScrollTrigger's scroll-progress and this module's phase-percent
    // math stay in lockstep at every point, forward and backward.
    tl.set({}, {}, TOTAL_TIMELINE_DURATION);

    /* ---------------------------------------------------------------- */
    /* Discrete state: labels, image identity, active-domain highlight.  */
    /* ---------------------------------------------------------------- */

    let lastState: StateKey | null = null;

    const applyDiscreteState = (state: StateKey) => {
      if (state === lastState) {
        return;
      }

      lastState = state;

      const labels = LABELS_BY_STATE[state];

      if (labelUnitEl) {
        labelUnitEl.textContent = labels.unit;
      }

      if (labelCoordEl) {
        labelCoordEl.textContent = labels.coord;
      }

      if (labelKickerEl) {
        labelKickerEl.textContent = labels.kicker;
      }

      for (const id of FRAME_IDS) {
        const domainIndex = IMAGE_DOMAIN_BY_STATE[state][id];

        if (domainIndex !== null) {
          const url = domains[domainIndex]?.imageLarge;

          if (url) {
            frameImageEls[id].setAttribute("href", url);
          }
        }
      }

      const domainIndex = DOMAIN_INDEX_BY_STATE[state];

      stage.dataset.activeDomain =
        domainIndex === null ? "none" : String(domainIndex);

      onActiveDomainChange?.(domainIndex);
    };

    const update = (self: ScrollTrigger) => {
      const percent = self.progress * TOTAL_TIMELINE_DURATION;

      const { phase, state } = resolvePhaseState(percent);

      applyDiscreteState(state);

      stage.dataset.activePhase = phase.id;

      if (progressFillEl) {
        (progressFillEl as HTMLElement).style.transform =
          `scaleX(${self.progress})`;
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: reducedMotion ? true : 0.6,
      animation: tl,
      onUpdate: update,
      onRefresh: update,
    });

    // Establish correct discrete state immediately,
    // before first scroll.
    update(trigger);

    /* ---------------------------------------------------------------- */
    /* Ambient idle motion — independent of scroll, so a stopped scroll */
    /* still reads as a living composition rather than a frozen frame.   */
    /* ---------------------------------------------------------------- */

    if (!reducedMotion) {
      gsap.to(reticleEl, {
        scale: 1.08,
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      });

      const wireframe = productEl.querySelector("path");

      if (wireframe) {
        gsap.to(productEl, {
          rotation: "+=3",
          duration: 4.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }

    STATE_ORDER.forEach(() => {
      // Keep STATE_ORDER import used for potential future ordering needs.
    });
  }, section);

  return {
    revert: () => ctx.revert(),
  };
}
