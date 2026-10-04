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

/**
 * Static "home" placement for each domain's atmospheric background photo.
 * These never animate — only their opacity is driven by the timeline —
 * so photographic content stays a quiet, duotoned supporting layer while
 * the foreground SVG geometry carries the primary transformation.
 */
const FRAME_IMAGE_HOME: Record<
  string,
  {
    x: number;
    y: number;
    width: number;
    height: number;
  }
> = {
  a: { x: -60, y: -200, width: 560, height: 500 },
  b: { x: 550, y: -200, width: 360, height: 460 },
  c: { x: -100, y: 260, width: 500, height: 320 },
  d: { x: -380, y: 280, width: 420, height: 340 },
};

const DomainSection = forwardRef<HTMLElement, DomainSectionProps>(
  ({ domains, reducedMotion, onSelectDomain }, forwardedRef) => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const activeDomainRef = useRef<number | null>(0);

    const [activeDomain, setActiveDomain] = useState<number | null>(0);

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
        },
      );

      return () => handle.revert();
    }, [domains, reducedMotion]);

    const handleVisualActivate = useCallback(() => {
      if (activeDomainRef.current !== null) {
        onSelectDomain(activeDomainRef.current);
      }
    }, [onSelectDomain]);

    return (
      <section
        ref={(element) => {
          sectionRef.current = element;

          if (typeof forwardedRef === "function") {
            forwardedRef(element);
          } else if (forwardedRef) {
            forwardedRef.current = element;
          }
        }}
        className="dfilm"
        aria-label="Tarka creative domains"
      >
        <div className="dfilm-stage" ref={stageRef}>
          <svg
            className="dfilm-svg"
            viewBox={STAGE_VIEWBOX}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
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
            </defs>

            <rect
              data-grid=""
              x={-500}
              y={-156}
              width={1600}
              height={900}
              fill="url(#dfilm-grid-pattern)"
            />

            {FRAME_IDS.map((id) => {
              const imageLayout = FRAME_IMAGE_HOME[id];

              return (
                <image
                  key={`image-${id}`}
                  data-frame-image={id}
                  href={domains[0]?.imageLarge}
                  x={imageLayout.x}
                  y={imageLayout.y}
                  width={imageLayout.width}
                  height={imageLayout.height}
                  preserveAspectRatio="xMidYMid slice"
                  className="dfilm-image"
                  opacity={0}
                />
              );
            })}

            <g data-product="">
              <path d={PRODUCT_WIREFRAME_D} className="dfilm-product-path" />
            </g>

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

            <g className="dfilm-frames" onClick={handleVisualActivate}>
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

            <circle
              data-reticle=""
              className="dfilm-reticle"
              cx={RETICLE_LAYOUTS.product.cx}
              cy={RETICLE_LAYOUTS.product.cy}
              r={RETICLE_LAYOUTS.product.r}
            />
          </svg>

          <div className="dfilm-copy">
            <span className="dfilm-kicker" data-label-kicker="" />

            <div className="dfilm-domain-list">
              {domains.map((domain, index) => (
                <button
                  key={domain.id}
                  type="button"
                  className="dfilm-domain-title"
                  data-domain-index={index}
                  aria-current={activeDomain === index}
                  onClick={() => onSelectDomain(index)}
                >
                  <span className="dfilm-domain-number">{domain.number}</span>

                  <span className="dfilm-domain-name">{domain.title}</span>

                  <span className="dfilm-domain-category">
                    {domain.category}
                  </span>
                </button>
              ))}
            </div>

            <div className="dfilm-annotation">
              <span data-label-coord="" className="dfilm-annotation-coord" />

              <span data-label-unit="" className="dfilm-annotation-unit" />
            </div>
          </div>

          <div className="dfilm-progress" aria-hidden="true">
            <div className="dfilm-progress-track">
              <div data-progress-fill="" className="dfilm-progress-fill" />
            </div>
          </div>

          <div className="dfilm-footer">
            <span>SCROLL TO EXPLORE</span>

            <span>
              {activeDomain !== null
                ? String(activeDomain + 1).padStart(2, "0")
                : "••"}{" "}
              / {String(domains.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>
    );
  },
);

DomainSection.displayName = "DomainSection";

export default DomainSection;
