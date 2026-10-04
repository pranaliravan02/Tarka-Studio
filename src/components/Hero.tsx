import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Domain } from "../data/domains";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  domains: Domain[];
  reducedMotion: boolean;
  onSelectDomain: (index: number) => void;
}

function Hero({ domains, reducedMotion, onSelectDomain }: HeroProps) {
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setCardRef =
    (index: number) => (element: HTMLButtonElement | null) => {
      cardRefs.current[index] = element;
    };

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);

      if (reducedMotion) {
        gsap.set(
          [
            navRef.current,
            titleRef.current,
            subtitleRef.current,
            footerRef.current,
            nodeRef.current,
            ...cards,
          ].filter(Boolean),
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            clearProps: "transform,filter",
          }
        );

        return;
      }

      /*
       * ============================================================
       * INITIAL STATE
       * ============================================================
       */

      gsap.set(navRef.current, {
        opacity: 0,
        y: -18,
      });

      gsap.set(titleRef.current, {
        opacity: 0,
        y: 80,
        scale: 0.92,
        transformOrigin: "center center",
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 25,
      });

      gsap.set(footerRef.current, {
        opacity: 0,
        y: 20,
      });

      gsap.set(nodeRef.current, {
        opacity: 0,
        scale: 0,
      });

      /*
       * Five-domain entrance positions.
       *
       * The fifth card gets a slightly different entrance so
       * Video Generation feels like a new visual layer rather
       * than simply another repeated card.
       */
      cards.forEach((card, index) => {
        if (!card) return;

        const rotations = [-7, 6, 5, -6, 2];

        gsap.set(card, {
          opacity: 0,
          scale: index === 4 ? 0.62 : 0.72,
          y:
            index === 4
              ? 85
              : index % 2 === 0
                ? -55
                : 55,
          rotation: rotations[index] ?? 0,
          transformOrigin: "center center",
        });
      });

      /*
       * ============================================================
       * INTRO ANIMATION
       * ============================================================
       */

      const intro = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      intro
        .to(navRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
        })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.15,
          },
          "-=0.35"
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.7"
        )
        .to(
          nodeRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: "back.out(2)",
          },
          "-=0.45"
        )
        .to(
          cards,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.15,
            stagger: 0.13,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .to(
          footerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.55"
        );

      /*
       * ============================================================
       * CARD FLOATING MOTION
       * ============================================================
       */

      cards.forEach((card, index) => {
        if (!card) return;

        gsap.to(card, {
          y: index % 2 === 0 ? -10 : 10,
          rotation:
            index === 4
              ? 2.8
              : index % 2 === 0
                ? -7.5
                : 6.5,
          duration: 3.5 + index * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.2 + index * 0.15,
        });
      });

      /*
       * ============================================================
       * CENTRAL NODE PULSE
       * ============================================================
       */

      gsap.to(nodeRef.current, {
        scale: 1.18,
        opacity: 0.72,
        duration: 1.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.8,
      });

      /*
       * ============================================================
       * SCROLL-DRIVEN CARD SEPARATION
       * ============================================================
       */

      const directions = [
        { x: -75, y: -55 },
        { x: 75, y: -45 },
        { x: -65, y: 60 },
        { x: 70, y: 55 },

        // Video Generation
        { x: 20, y: 95 },
      ];

      cards.forEach((card, index) => {
        if (!card) return;

        const direction =
          directions[index] ?? { x: 0, y: 0 };

        gsap.to(card, {
          x: direction.x,
          y: direction.y,
          rotation:
            index === 4
              ? -1
              : (index % 2 === 0 ? -1 : 1) *
                (8 + index),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.4,
          },
        });
      });

      /*
       * ============================================================
       * MOUSE PARALLAX
       * ============================================================
       */

      if (!window.matchMedia("(pointer: coarse)").matches) {
        const handleMouseMove = (event: MouseEvent) => {
          const rect = section.getBoundingClientRect();

          const x =
            (event.clientX -
              (rect.left + rect.width / 2)) /
            rect.width;

          const y =
            (event.clientY -
              (rect.top + rect.height / 2)) /
            rect.height;

          gsap.to(titleRef.current, {
            x: x * 16,
            y: y * 9,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
          });

          cards.forEach((card, index) => {
            if (!card) return;

            const depth =
              1 + index * 0.25;

            gsap.to(card, {
              x: x * 28 * depth,
              y: y * 20 * depth,
              duration: 1,
              ease: "power3.out",
              overwrite: "auto",
            });
          });

          gsap.to(nodeRef.current, {
            x: x * 18,
            y: y * 18,
            duration: 1,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        section.addEventListener(
          "mousemove",
          handleMouseMove
        );

        return () => {
          section.removeEventListener(
            "mousemove",
            handleMouseMove
          );
        };
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleCardEnter = (index: number) => {
    if (reducedMotion) return;

    const card = cardRefs.current[index];

    if (!card) return;

    gsap.to(card, {
      scale: index === 4 ? 1.1 : 1.08,
      zIndex: 20,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
      filter:
        "drop-shadow(0 0 18px color-mix(in srgb, var(--duck-blue) 55%, transparent))",
    });
  };

  const handleCardLeave = (index: number) => {
    if (reducedMotion) return;

    const card = cardRefs.current[index];

    if (!card) return;

    gsap.to(card, {
      scale: 1,
      zIndex: 1,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
      filter: "none",
    });
  };

  const handleCardClick = (index: number) => {
    const domain = domains[index];

    if (!domain) return;

    onSelectDomain(index);
  };

    const routes: Record<string, string> = {
      HOME: "/",
      WORK: "/product",
      DOMAINS: "/",
      TEAM: "/team",
      ABOUT: "/",
      CONTACT: "/quote",
    };

  const handleNavigation = (label: string) => {
    const route = routes[label];

    if (route) {
      navigate(route);
    }
  };

  /*
   * Five-card composition.
   *
   * The first four preserve the existing visual arrangement.
   * Video Generation becomes the fifth card in the central-right
   * layer, visually connecting the upper and lower card groups.
   */
  const positions = [
    {
      left: "66%",
      top: "23%",
      rotation: -7,
      width: "clamp(175px, 17vw, 235px)",
      height: "clamp(225px, 23vw, 305px)",
    },
    {
      left: "86%",
      top: "32%",
      rotation: 6,
      width: "clamp(175px, 17vw, 235px)",
      height: "clamp(225px, 23vw, 305px)",
    },
    {
      left: "65%",
      top: "73%",
      rotation: 6,
      width: "clamp(175px, 17vw, 235px)",
      height: "clamp(225px, 23vw, 305px)",
    },
    {
      left: "85%",
      top: "69%",
      rotation: -7,
      width: "clamp(175px, 17vw, 235px)",
      height: "clamp(225px, 23vw, 305px)",
    },

    // 05 / VIDEO GENERATION
    {
      left: "76%",
      top: "51%",
      rotation: 2,
      width: "clamp(155px, 15vw, 210px)",
      height: "clamp(205px, 21vw, 275px)",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="tarka-hero"
      aria-label="Tarka Design Studio domains"
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background: "var(--black)",
        color: "var(--white)",
        isolation: "isolate",
      }}
    >
      {/* ============================================================
          TECHNICAL GRID
          ============================================================ */}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(
              to right,
              color-mix(in srgb, var(--white) 8%, transparent) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              color-mix(in srgb, var(--white) 8%, transparent) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 92%)",
        }}
      />

      {/* ============================================================
          DIAGONAL NETWORK LINES
          ============================================================ */}

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <line
          x1="0"
          y1="180"
          x2="720"
          y2="450"
          stroke="var(--white)"
          strokeOpacity="0.16"
          strokeWidth="1"
        />

        <line
          x1="1440"
          y1="190"
          x2="720"
          y2="450"
          stroke="var(--white)"
          strokeOpacity="0.16"
          strokeWidth="1"
        />

        <line
          x1="0"
          y1="760"
          x2="720"
          y2="450"
          stroke="var(--white)"
          strokeOpacity="0.16"
          strokeWidth="1"
        />

        <line
          x1="1440"
          y1="760"
          x2="720"
          y2="450"
          stroke="var(--white)"
          strokeOpacity="0.16"
          strokeWidth="1"
        />

        <line
          x1="0"
          y1="450"
          x2="1440"
          y2="450"
          stroke="var(--duck-blue)"
          strokeOpacity="0.25"
          strokeWidth="1"
        />

        <path
          d="M 80 820 L 720 450 L 1360 820"
          fill="none"
          stroke="var(--duck-blue)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />

        <path
          d="M 80 80 L 720 450 L 1360 80"
          fill="none"
          stroke="var(--duck-blue)"
          strokeOpacity="0.42"
          strokeWidth="1"
        />

        <circle
          cx="720"
          cy="450"
          r="110"
          fill="none"
          stroke="var(--duck-blue)"
          strokeOpacity="0.18"
          strokeWidth="1"
        />

        <circle
          cx="720"
          cy="450"
          r="165"
          fill="none"
          stroke="var(--white)"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
      </svg>

      {/* ============================================================
          TOP NAVIGATION
          ============================================================ */}

      <div
        ref={navRef}
        className="tarka-hero__nav"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "28px",
          padding: "28px clamp(24px, 5vw, 72px)",
          borderBottom:
            "1px solid color-mix(in srgb, var(--white) 14%, transparent)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Tarka home"
          style={{
            color: "var(--white)",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
          }}
        >
          TARKA
        </button>

        <nav
          aria-label="Primary navigation"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(16px, 3vw, 42px)",
          }}
        >
          {["HOME", "WORK", "DOMAINS", "TEAM", "ABOUT", "CONTACT"].map(
            (label) => (
              <button
                key={label}
                type="button"
                onClick={() => handleNavigation(label)}
                style={{
                  color:
                    label === "DOMAINS"
                      ? "var(--duck-blue)"
                      : "var(--white-soft)",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  transition: "color 250ms ease",
                }}
              >
                {label}
              </button>
            ),
          )}
        </nav>

        <button
          type="button"
          onClick={() => navigate("/quote")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "11px 16px",
            border:
              "1px solid color-mix(in srgb, var(--duck-blue) 70%, transparent)",
            color: "var(--white)",
            fontSize: "0.67rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Let's Talk
          <span aria-hidden="true">↗</span>
        </button>
      </div>

      {/* ============================================================
          MAIN TITLE
          ============================================================ */}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "52%",
          zIndex: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          pointerEvents: "none",
          padding: "90px 0 110px clamp(32px, 7vw, 110px)",
        }}
      >
        <p
          ref={subtitleRef}
          style={{
            margin: "0 0 18px",
            color: "var(--duck-blue)",
            textAlign: "left",
            fontSize: "clamp(0.62rem, 1vw, 0.78rem)",
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          TARKA DESIGN STUDIO / 2026
        </p>

        <h1
          ref={titleRef}
          style={{
            margin: 0,
            color: "var(--white)",
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(4.2rem, 13vw, 12rem)",
            fontWeight: 800,
            lineHeight: 0.78,
            letterSpacing: "-0.075em",
            textAlign: "left",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          D<span style={{ color: "var(--duck-blue)" }}>O</span>
          MAINS
        </h1>
      </div>

      {/* ============================================================
          CENTRAL NODE
          ============================================================ */}

      <div
        ref={nodeRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "18px",
          height: "18px",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "var(--duck-blue)",
          boxShadow:
            "0 0 0 8px color-mix(in srgb, var(--duck-blue) 14%, transparent), 0 0 40px color-mix(in srgb, var(--duck-blue) 70%, transparent)",
          zIndex: 12,
          pointerEvents: "none",
        }}
      />

      {/* ============================================================
          FIVE DOMAIN CARDS
          ============================================================ */}

      {domains.slice(0, 5).map((domain, index) => {
        const position = positions[index] ?? positions[0];

        return (
          <button
            key={domain.id}
            ref={setCardRef(index)}
            type="button"
            onClick={() => handleCardClick(index)}
            onMouseEnter={() => handleCardEnter(index)}
            onMouseLeave={() => handleCardLeave(index)}
            aria-label={`Explore ${domain.title}`}
            style={{
              position: "absolute",
              left: position.left,
              top: position.top,
              width: position.width,
              height: position.height,
              padding: 0,
              overflow: "hidden",
              border:
                "1px solid color-mix(in srgb, var(--white) 30%, transparent)",
              background: "var(--black-soft)",
              color: "var(--white)",
              transform: `translate(-50%, -50%) rotate(${position.rotation}deg)`,
              cursor: "pointer",
              zIndex: 5 + index,
              boxShadow:
                "0 24px 60px color-mix(in srgb, var(--black) 75%, transparent)",
            }}
          >
            <img
              src={domain.imageLarge}
              alt=""
              aria-hidden="true"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                filter: "grayscale(12%) contrast(1.06)",
              }}
            />

            <span
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, color-mix(in srgb, var(--black) 82%, transparent), transparent 55%)",
              }}
            />

            <span
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                padding: "5px 8px",
                borderLeft: "2px solid var(--duck-blue)",
                background: "color-mix(in srgb, var(--black) 82%, transparent)",
                color: "var(--white)",
                fontSize: "0.58rem",
                fontWeight: 600,
                letterSpacing: "0.13em",
              }}
            >
              {domain.number} / {domain.category}
            </span>

            <span
              style={{
                position: "absolute",
                left: "16px",
                right: "16px",
                bottom: "16px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "12px",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  maxWidth: "78%",
                  fontSize: "clamp(0.82rem, 1.15vw, 1rem)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                {domain.title}
              </span>

              <span
                aria-hidden="true"
                style={{
                  color: "var(--duck-blue)",
                  fontSize: "1.35rem",
                  lineHeight: 1,
                }}
              >
                ↗
              </span>
            </span>
          </button>
        );
      })}

      {/* ============================================================
          FOOTER STRIP
          ============================================================ */}

      <div
        ref={footerRef}
        className="tarka-hero__footer"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          padding: "18px clamp(24px, 5vw, 72px)",
          borderTop:
            "1px solid color-mix(in srgb, var(--white) 14%, transparent)",
          color: "var(--white-soft)",
          fontSize: "0.62rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        <span>TARKA / CREATIVE SYSTEMS</span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--duck-blue)",
            }}
          />
          05 DOMAINS
        </span>

        <span>SCROLL TO EXPLORE ↓</span>
      </div>

      {/* ============================================================
          RESPONSIVE CSS
          ============================================================ */}

      <style>
        {`
          .tarka-hero button:hover {
            color: var(--duck-blue);
          }

          @media (max-width: 900px) {
            .tarka-hero__nav {
              grid-template-columns: auto auto !important;
            }

            .tarka-hero__nav nav {
              display: none !important;
            }

            .tarka-hero h1 {
              font-size: clamp(4rem, 17vw, 8rem) !important;
            }

            .tarka-hero > div[style*="width: 52%"] {
              width: 55% !important;
              padding-left: 24px !important;
            }
          }

          @media (max-width: 640px) {
            .tarka-hero__nav {
              padding: 20px !important;
            }

            .tarka-hero__nav > button:last-child {
              padding: 9px 12px !important;
              font-size: 0.58rem !important;
            }

            .tarka-hero h1 {
              font-size: clamp(3.2rem, 19vw, 6rem) !important;
            }

            .tarka-hero button[aria-label^="Explore"] {
              width: 145px !important;
              height: 190px !important;
            }

            .tarka-hero__footer {
              padding: 14px 20px !important;
              font-size: 0.5rem !important;
            }

            .tarka-hero__footer span:first-child {
              display: none;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .tarka-hero *,
            .tarka-hero *::before,
            .tarka-hero *::after {
              animation: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}

export default Hero;