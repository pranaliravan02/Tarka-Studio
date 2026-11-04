
import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { Domain } from "../data/domains";

import {
  STAGE_VIEWBOX,
  FRAME_IDS,
  GUIDE_IDS,
  FRAME_LAYOUTS,
  GUIDE_LAYOUTS,
  RETICLE_LAYOUTS,
  PRODUCT_WIREFRAME_D,
} from "../data/domainFilm";

import { buildDomainFilmTimeline } from "./domainFilmTimeline";
import "./DomainSection.css";

interface DomainSectionProps {
  domains: Domain[];
  reducedMotion: boolean;
  onSelectDomain: (index: number) => void;
}

/* ------------------------------------------------------------------ */
/* Atmospheric background image positions                             */
/* ------------------------------------------------------------------ */

const FRAME_IMAGE_HOME: Record<
  string,
  { x: number; y: number; width: number; height: number }
> = {
  a: { x: -60, y: -200, width: 560, height: 500 },
  b: { x: 550, y: -200, width: 360, height: 460 },
  c: { x: -100, y: 260, width: 500, height: 320 },
  d: { x: -380, y: 280, width: 420, height: 340 },
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const DomainSection = forwardRef<HTMLElement, DomainSectionProps>(
  ({ domains, reducedMotion, onSelectDomain }, forwardedRef) => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);

    const activeDomainRef = useRef<number | null>(0);

    const [activeDomain, setActiveDomain] = useState<number | null>(0);

    /* -------------------------------------------------------------- */
    /* Forward section ref                                             */
    /* -------------------------------------------------------------- */

    const setSectionRef = useCallback(
      (element: HTMLElement | null) => {
        sectionRef.current = element;

        if (typeof forwardedRef === "function") {
          forwardedRef(element);
        } else if (forwardedRef) {
          forwardedRef.current = element;
        }
      },
      [forwardedRef]
    );

    /* -------------------------------------------------------------- */
    /* Initialize scroll-controlled animation                         */
    /* -------------------------------------------------------------- */

    useLayoutEffect(() => {
      const section = sectionRef.current;
      const stage = stageRef.current;

      if (!section || !stage || domains.length === 0) {
        return;
      }

      const handle = buildDomainFilmTimeline(
        section,
        stage,
        domains,
        reducedMotion,
        (index) => {
          activeDomainRef.current = index;
          setActiveDomain(index);
        }
      );

      return () => {
        handle.revert();
      };
    }, [domains, reducedMotion]);

    /* -------------------------------------------------------------- */
    /* Domain navigation                                               */
    /* -------------------------------------------------------------- */

    const handleVisualActivate = useCallback(() => {
      const index = activeDomainRef.current;

      if (index !== null && domains[index]) {
        onSelectDomain(index);
      }
    }, [domains, onSelectDomain]);

    const handleDomainNavigation = useCallback(
      (index: number) => {
        if (domains[index]) {
          onSelectDomain(index);
        }
      },
      [domains, onSelectDomain]
    );

    /* -------------------------------------------------------------- */
    /* Render                                                           */
    /* -------------------------------------------------------------- */

    return (
      <section
        ref={setSectionRef}
        className="dfilm"
        aria-label="Tarka creative domains"
        data-domain-count={domains.length}
      >
        <div
          className="dfilm-stage"
          ref={stageRef}
          data-active-domain="0"
          data-active-phase="product"
        >
          {/* ------------------------------------------------------ */}
          {/* SVG CINEMATIC COMPOSITION                               */}
          {/* ------------------------------------------------------ */}

          <svg
            className="dfilm-svg"
            viewBox={STAGE_VIEWBOX}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              {/* Technical background grid */}

              <pattern
                id="dfilm-grid-pattern"
                width="72"
                height="72"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 72 0 L 0 0 0 72"
                  fill="none"
                  stroke="var(--tarka-line)"
                  strokeWidth="1"
                />
              </pattern>

              {/* Subtle blue photographic overlay */}

              <linearGradient
                id="dfilm-blue-overlay"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#007f8f"
                  stopOpacity="0.12"
                />
                <stop
                  offset="100%"
                  stopColor="#007f8f"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {/* Background grid */}

            <rect
              data-grid=""
              x={-500}
              y={-156}
              width={1600}
              height={900}
              fill="url(#dfilm-grid-pattern)"
            />

            {/* -------------------------------------------------- */}
            {/* DOMAIN PHOTOGRAPHIC IMAGES                          */}
            {/* -------------------------------------------------- */}

            {FRAME_IDS.map((id) => (
              <image
                key={`image-${id}`}
                data-frame-image={id}
                href={domains[0]?.imageLarge ?? ""}
                x={FRAME_IMAGE_HOME[id].x}
                y={FRAME_IMAGE_HOME[id].y}
                width={FRAME_IMAGE_HOME[id].width}
                height={FRAME_IMAGE_HOME[id].height}
                preserveAspectRatio="xMidYMid slice"
                className="dfilm-image"
                opacity={0}
              />
            ))}

            {/* -------------------------------------------------- */}
            {/* PRODUCT DESIGN WIREFRAME                            */}
            {/* -------------------------------------------------- */}

            <g data-product="">
              <path
                d={PRODUCT_WIREFRAME_D}
                className="dfilm-product-path"
              />
            </g>

            {/* -------------------------------------------------- */}
            {/* CONSTRUCTION GUIDES                                 */}
            {/* -------------------------------------------------- */}

            {GUIDE_IDS.map((id) => {
              const guide = GUIDE_LAYOUTS.product[id];

              return (
                <line
                  key={id}
                  data-guide={id}
                  className="dfilm-guide"
                  x1={guide.x1}
                  y1={guide.y1}
                  x2={guide.x2}
                  y2={guide.y2}
                  opacity={guide.opacity}
                />
              );
            })}

            {/* -------------------------------------------------- */}
            {/* ANIMATED FRAMES                                     */}
            {/* -------------------------------------------------- */}

            <g
              className="dfilm-frames"
              onClick={handleVisualActivate}
              style={{ cursor: "pointer" }}
            >
              {FRAME_IDS.map((id) => {
                const frame = FRAME_LAYOUTS.product[id];

                return (
                  <rect
                    key={id}
                    data-frame={id}
                    className="dfilm-frame"
                    x={frame.x}
                    y={frame.y}
                    width={frame.width}
                    height={frame.height}
                    opacity={frame.opacity}
                  />
                );
              })}
            </g>

            {/* -------------------------------------------------- */}
            {/* CENTRAL RETICLE                                     */}
            {/* -------------------------------------------------- */}

            <circle
              data-reticle=""
              className="dfilm-reticle"
              cx={RETICLE_LAYOUTS.product.cx}
              cy={RETICLE_LAYOUTS.product.cy}
              r={RETICLE_LAYOUTS.product.r}
            />
          </svg>

          {/* ------------------------------------------------------ */}
          {/* OVERLAY CONTENT                                        */}
          {/* ------------------------------------------------------ */}

          <div className="dfilm-copy">
            {/* Top technical label */}

            <span
              className="dfilm-kicker"
              data-label-kicker=""
              aria-live="polite"
            >
              CONSTRUCTION
            </span>

            {/* -------------------------------------------------- */}
            {/* LEFT DOMAIN NAVIGATION                              */}
            {/* -------------------------------------------------- */}

            <nav
              className="dfilm-domain-list"
              aria-label="Explore creative domains"
            >
              {domains.map((domain, index) => {
                const isActive = activeDomain === index;

                return (
                  <button
                    key={domain.id}
                    type="button"
                    className="dfilm-domain-title"
                    data-domain-index={index}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Explore ${domain.title}`}
                    onClick={() => handleDomainNavigation(index)}
                  >
                    <span className="dfilm-domain-number">
                      {domain.number}
                    </span>

                    <span className="dfilm-domain-name">
                      {domain.title}
                    </span>

                    <span className="dfilm-domain-category">
                      {domain.category}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* -------------------------------------------------- */}
            {/* RIGHT/BOTTOM TECHNICAL METADATA                     */}
            {/* -------------------------------------------------- */}

            <div className="dfilm-annotation" aria-live="polite">
              <span
                data-label-coord=""
                className="dfilm-annotation-coord"
              >
                W190 · D100 · H90
              </span>

              <span
                data-label-unit=""
                className="dfilm-annotation-unit"
              >
                mm
              </span>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* SCROLL PROGRESS                                        */}
          {/* ------------------------------------------------------ */}

          <div
            className="dfilm-progress"
            role="progressbar"
            aria-label="Domain showcase progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <div className="dfilm-progress-track">
              <div
                data-progress-fill=""
                className="dfilm-progress-fill"
              />
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* FOOTER                                                 */}
          {/* ------------------------------------------------------ */}

          <div className="dfilm-footer">
            <span>SCROLL TO EXPLORE</span>

            <span aria-live="polite">
              {activeDomain !== null
                ? String(activeDomain + 1).padStart(2, "0")
                : "••"}{" "}
              / {String(domains.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>
    );
  }
);

DomainSection.displayName = "DomainSection";

export default DomainSection;
