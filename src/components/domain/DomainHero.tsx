import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Domain } from "../../data/domains";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { productProjects } from "../../data/productProjects";

gsap.registerPlugin(ScrollTrigger);

interface DomainHeroProps {
  domain: Domain;
}

function DomainHero({ domain }: DomainHeroProps) {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const helixRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const numberRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLAnchorElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const projectCardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const isProductDesign = domain.id === "product-design";

  /*
   * ================================================================
   * PRODUCT DESIGN — DNA HERO
   * ================================================================
   */

  useEffect(() => {
    if (!isProductDesign) return;

    const section = sectionRef.current;
    const scene = sceneRef.current;
    const helix = helixRef.current;

    if (!section || !scene || !helix) return;

    const cards = projectCardsRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      /*
       * ------------------------------------------------------------
       * REDUCED MOTION
       * ------------------------------------------------------------
       */

      if (reducedMotion) {
        gsap.set(
          [
            kickerRef.current,
            numberRef.current,
            titleRef.current,
            descriptionRef.current,
            quoteRef.current,
            bottomRef.current,
            helix,
            ...cards,
          ],
          {
            opacity: 1,
            clearProps: "transform,clipPath",
          }
        );

        return;
      }

      /*
       * ------------------------------------------------------------
       * INITIAL STATE
       * ------------------------------------------------------------
       */

      gsap.set(kickerRef.current, {
        opacity: 0,
        y: 25,
      });

      gsap.set(numberRef.current, {
        opacity: 0,
        y: 20,
      });

      gsap.set(titleRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.86,
        transformOrigin: "left bottom",
      });

      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 30,
      });

      gsap.set(quoteRef.current, {
        opacity: 0,
        y: 20,
      });

      gsap.set(helix, {
        opacity: 0,
        scale: 0.72,
        rotationY: -35,
      });

      gsap.set(cards, {
        opacity: 0,
        scale: 0.72,
      });

      gsap.set(bottomRef.current, {
        opacity: 0,
        y: 20,
      });

      /*
       * ------------------------------------------------------------
       * INTRO
       * ------------------------------------------------------------
       */

      const intro = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      intro
        .to(kickerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        .to(
          numberRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.3"
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
          },
          "-=0.25"
        )
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.55"
        )
        .to(
          quoteRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.35"
        )
        .to(
          helix,
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1.3,
            ease: "power4.out",
          },
          "-=0.9"
        )
        .to(
          cards,
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "back.out(1.5)",
          },
          "-=0.85"
        )
        .to(
          bottomRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.35"
        );

      /*
       * ------------------------------------------------------------
       * DNA CONTINUOUS ROTATION
       * ------------------------------------------------------------
       */

      gsap.to(helix, {
        rotationY: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      /*
       * ------------------------------------------------------------
       * CARD FLOATING
       * ------------------------------------------------------------
       */

      cards.forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -10 : 10,
          duration: 2.5 + index * 0.25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.15,
        });
      });

      /*
       * ------------------------------------------------------------
       * SCROLL — DNA MOVES THROUGH SPACE
       * ------------------------------------------------------------
       */

      gsap.to(helix, {
        y: -80,
        scale: 0.88,
        rotationX: 18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(titleRef.current, {
        y: -65,
        scale: 0.92,
        opacity: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      /*
       * ------------------------------------------------------------
       * MOUSE PARALLAX
       * ------------------------------------------------------------
       */

      if (!window.matchMedia("(pointer: coarse)").matches) {
        const handleMouseMove = (event: MouseEvent) => {
          const rect = section.getBoundingClientRect();

          const x =
            (event.clientX - (rect.left + rect.width / 2)) / rect.width;

          const y =
            (event.clientY - (rect.top + rect.height / 2)) / rect.height;

          gsap.to(scene, {
            rotateY: x * 8,
            rotateX: y * -6,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
          });

          gsap.to(titleRef.current, {
            x: x * 14,
            y: y * 7,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
          });

          gsap.to(cards, {
            x: x * 10,
            duration: 0.8,
            stagger: 0.015,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        section.addEventListener("mousemove", handleMouseMove);

        return () => {
          section.removeEventListener("mousemove", handleMouseMove);
        };
      }
    }, section);

    return () => ctx.revert();
  }, [domain.id, isProductDesign, reducedMotion]);

  /*
   * ================================================================
   * NON-PRODUCT HERO ANIMATION
   * ================================================================
   */

  useEffect(() => {
    if (isProductDesign) return;

    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = [
        kickerRef.current,
        numberRef.current,
        titleRef.current,
        descriptionRef.current,
        quoteRef.current,
        bottomRef.current,
      ].filter(Boolean);

      if (reducedMotion) {
        gsap.set(elements, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });

        return;
      }

      gsap.set(elements, {
        opacity: 0,
        y: 25,
      });

      gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      })
        .to(kickerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        .to(
          numberRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.3"
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
          },
          "-=0.3"
        )
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.45"
        )
        .to(
          quoteRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.35"
        )
        .to(
          bottomRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.3"
        );
    }, section);

    return () => ctx.revert();
  }, [domain.id, isProductDesign, reducedMotion]);

  /*
   * ================================================================
   * QUOTE HOVER
   * ================================================================
   */

  const handleQuoteEnter = () => {
    if (reducedMotion) return;

    gsap.to(quoteRef.current, {
      gap: 28,
      x: 7,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleQuoteLeave = () => {
    if (reducedMotion) return;

    gsap.to(quoteRef.current, {
      gap: 18,
      x: 0,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  /*
   * ================================================================
   * PRODUCT CARD HOVER
   * ================================================================
   */

  const handleCardEnter = (index: number) => {
    if (reducedMotion) return;

    const card = projectCardsRef.current[index];

    if (!card) return;

    gsap.to(card, {
      scale: 1.12,
      zIndex: 30,
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(card.querySelector(".product-dna-card__image"), {
      scale: 1.08,
      duration: 0.55,
      ease: "power3.out",
    });
  };

  const handleCardLeave = (index: number) => {
    if (reducedMotion) return;

    const card = projectCardsRef.current[index];

    if (!card) return;

    gsap.to(card, {
      scale: 1,
      zIndex: 1,
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(card.querySelector(".product-dna-card__image"), {
      scale: 1,
      duration: 0.55,
      ease: "power3.out",
    });
  };

  /*
   * ================================================================
   * STANDARD HERO FOR OTHER DOMAINS
   * ================================================================
   */

  if (!isProductDesign) {
    return (
      <section
        ref={sectionRef}
        className="domain-hero"
        aria-labelledby={`domain-title-${domain.id}`}
      >
        <div className="domain-hero__top">
          <p ref={numberRef} className="domain-hero__number">
            {domain.number} — {domain.category}
          </p>

          <span className="domain-hero__rule" aria-hidden="true" />

          <span className="domain-hero__year">2026</span>
        </div>

        <div className="domain-hero__main">
          <div className="domain-hero__heading">
            <p ref={kickerRef} className="domain-hero__kicker">
              TARKA / DOMAIN
            </p>

            <h1
              ref={titleRef}
              id={`domain-title-${domain.id}`}
              className="domain-hero__title"
            >
              {domain.title}
            </h1>

            <p ref={descriptionRef} className="domain-hero__description">
              {domain.description}
            </p>

            <Link
              ref={quoteRef}
              to={`/quote?domain=${domain.id}`}
              className="domain-hero__quote"
              onMouseEnter={handleQuoteEnter}
              onMouseLeave={handleQuoteLeave}
            >
              <span>Get a Quote</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="domain-hero__visual">
            <div className="domain-hero__visual-frame">
              <img
                src={domain.imageLarge}
                alt={domain.alt}
                fetchPriority="high"
              />
            </div>

            <span className="domain-hero__visual-label">
              {domain.number} / {domain.category}
            </span>
          </div>
        </div>

        <div ref={bottomRef} className="domain-hero__bottom">
          <span>SCROLL TO EXPLORE</span>

          <span
            className="domain-hero__scroll-line"
            aria-hidden="true"
          >
            <span />
          </span>
        </div>
      </section>
    );
  }

  /*
   * ================================================================
   * PRODUCT DESIGN DNA HERO
   * ================================================================
   */

  return (
    <section
      ref={sectionRef}
      className="domain-hero product-dna-hero"
      aria-labelledby={`domain-title-${domain.id}`}
      style={{
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* BACKGROUND TECHNICAL GEOMETRY */}

      <svg
        aria-hidden="true"
        className="product-dna-hero__geometry"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="product-dna-line"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--duck-blue)"
              stopOpacity="0"
            />

            <stop
              offset="50%"
              stopColor="var(--duck-blue)"
              stopOpacity="0.5"
            />

            <stop
              offset="100%"
              stopColor="var(--duck-blue)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <path
          d="M0 650 L1440 120"
          stroke="url(#product-dna-line)"
          strokeWidth="1"
          fill="none"
        />

        <path
          d="M0 730 L1440 200"
          stroke="var(--white)"
          strokeOpacity="0.07"
          strokeWidth="1"
          fill="none"
        />

        <path
          d="M160 800 L700 0"
          stroke="var(--duck-blue)"
          strokeOpacity="0.18"
          strokeWidth="1"
          fill="none"
        />

        <path
          d="M850 800 L1360 0"
          stroke="var(--white)"
          strokeOpacity="0.06"
          strokeWidth="1"
          fill="none"
        />

        <circle
          cx="920"
          cy="405"
          r="260"
          fill="none"
          stroke="var(--duck-blue)"
          strokeOpacity="0.12"
          strokeWidth="1"
        />

        <circle
          cx="920"
          cy="405"
          r="330"
          fill="none"
          stroke="var(--white)"
          strokeOpacity="0.05"
          strokeWidth="1"
        />
      </svg>

      {/* TOP INFORMATION */}

      <div
        className="domain-hero__top"
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >
        <p ref={numberRef} className="domain-hero__number">
          {domain.number} — {domain.category}
        </p>

        <span className="domain-hero__rule" aria-hidden="true" />

        <span className="domain-hero__year">2026</span>
      </div>

      {/* MAIN CONTENT */}

      <div
        className="product-dna-hero__layout"
        style={{
          position: "relative",
          zIndex: 5,
        }}
      >
        <div className="product-dna-hero__copy">
          <p ref={kickerRef} className="domain-hero__kicker">
            TARKA / PRODUCT LAB
          </p>

          <h1
            ref={titleRef}
            id={`domain-title-${domain.id}`}
            className="domain-hero__title"
          >
            Product
            <br />
            Design
          </h1>

          <p
            ref={descriptionRef}
            className="domain-hero__description"
          >
            Objects, systems and ideas engineered into things people can
            touch, use and remember.
          </p>

          <Link
            ref={quoteRef}
            to={`/quote?domain=${domain.id}`}
            className="domain-hero__quote"
            onMouseEnter={handleQuoteEnter}
            onMouseLeave={handleQuoteLeave}
          >
            <span>Get a Quote</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* DNA SCENE */}

        <div
          ref={sceneRef}
          className="product-dna-scene"
          aria-label="Selected Product Design projects"
        >
          <div ref={helixRef} className="product-dna-helix">
            {/* LEFT STRAND */}

            <div className="product-dna-strand product-dna-strand--left">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            {/* RIGHT STRAND */}

            <div className="product-dna-strand product-dna-strand--right">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            {/* DNA CONNECTORS */}

            <div className="product-dna-connectors">
              {Array.from({ length: 7 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>

            {/* PROJECT CARDS */}

            <div className="product-dna-projects">
              {productProjects.slice(0, 6).map((project, index) => {
                const side = index % 2 === 0 ? "left" : "right";

                return (
                  <Link
                    key={project.id}
                    ref={(element) => {
                      projectCardsRef.current[index] = element;
                    }}
                    to={`/product/${project.slug}`}
                    className={`product-dna-card product-dna-card--${side} product-dna-card--${index + 1}`}
                    onMouseEnter={() => handleCardEnter(index)}
                    onMouseLeave={() => handleCardLeave(index)}
                    aria-label={`Open ${project.title} project`}
                  >
                    <div className="product-dna-card__image-wrap">
                      <img
                        className="product-dna-card__image"
                        src={project.image}
                        alt={project.title}
                        loading="eager"
                      />
                    </div>

                    <div className="product-dna-card__info">
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <strong>{project.title}</strong>

                      <span aria-hidden="true">↗</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* CENTER AXIS */}

            <div className="product-dna-axis">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}

      <div
        ref={bottomRef}
        className="domain-hero__bottom"
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >
        <span>SELECT A PROJECT</span>

        <span
          className="domain-hero__scroll-line"
          aria-hidden="true"
        >
          <span />
        </span>

        <span>SCROLL TO EXPLORE</span>
      </div>

      {/* DNA HERO RESPONSIVE STYLES */}

      <style>
        {`
          .product-dna-hero__geometry {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
          }

          .product-dna-hero__layout {
            display: grid;
            grid-template-columns: minmax(300px, 0.8fr) minmax(520px, 1.2fr);
            align-items: center;
            gap: clamp(30px, 5vw, 90px);
            min-height: 62vh;
          }

          .product-dna-hero__copy {
            position: relative;
            z-index: 20;
          }

          .product-dna-scene {
            position: relative;
            width: min(100%, 720px);
            height: min(64vh, 650px);
            min-height: 500px;
            perspective: 1400px;
            transform-style: preserve-3d;
          }

          .product-dna-helix {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 430px;
            height: 610px;
            transform: translate(-50%, -50%);
            transform-style: preserve-3d;
          }

          .product-dna-strand {
            position: absolute;
            top: 0;
            width: 150px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transform-style: preserve-3d;
          }

          .product-dna-strand--left {
            left: 20px;
          }

          .product-dna-strand--right {
            right: 20px;
          }

          .product-dna-strand::before {
            content: "";
            position: absolute;
            left: 50%;
            top: 0;
            width: 2px;
            height: 100%;
            transform: translateX(-50%);
            background: linear-gradient(
              to bottom,
              transparent,
              var(--duck-blue),
              transparent
            );
            opacity: 0.75;
          }

          .product-dna-strand span {
            position: relative;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--duck-blue);
            box-shadow:
              0 0 0 7px color-mix(
                in srgb,
                var(--duck-blue) 10%,
                transparent
              ),
              0 0 24px color-mix(
                in srgb,
                var(--duck-blue) 75%,
                transparent
              );
            transform: translateX(-50%);
            left: 50%;
          }

          .product-dna-strand--right span {
            background: var(--white);
            box-shadow:
              0 0 0 7px color-mix(
                in srgb,
                var(--white) 8%,
                transparent
              ),
              0 0 18px color-mix(
                in srgb,
                var(--white) 35%,
                transparent
              );
          }

          .product-dna-connectors {
            position: absolute;
            inset: 0;
            pointer-events: none;
            transform-style: preserve-3d;
          }

          .product-dna-connectors span {
            position: absolute;
            left: 48px;
            width: 335px;
            height: 1px;
            background: linear-gradient(
              90deg,
              var(--duck-blue),
              var(--white),
              var(--duck-blue)
            );
            opacity: 0.3;
            transform-origin: left center;
          }

          .product-dna-connectors span:nth-child(1) {
            top: 4%;
            transform: rotate(9deg);
          }

          .product-dna-connectors span:nth-child(2) {
            top: 20%;
            transform: rotate(-8deg);
          }

          .product-dna-connectors span:nth-child(3) {
            top: 36%;
            transform: rotate(8deg);
          }

          .product-dna-connectors span:nth-child(4) {
            top: 52%;
            transform: rotate(-8deg);
          }

          .product-dna-connectors span:nth-child(5) {
            top: 68%;
            transform: rotate(8deg);
          }

          .product-dna-connectors span:nth-child(6) {
            top: 84%;
            transform: rotate(-8deg);
          }

          .product-dna-connectors span:nth-child(7) {
            top: 96%;
            transform: rotate(8deg);
          }

          .product-dna-projects {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            pointer-events: none;
          }

          .product-dna-card {
            position: absolute;
            width: 175px;
            padding: 8px;
            background: var(--black);
            border: 1px solid color-mix(
              in srgb,
              var(--duck-blue) 55%,
              transparent
            );
            box-shadow:
              0 20px 50px rgba(0, 0, 0, 0.3),
              0 0 30px color-mix(
                in srgb,
                var(--duck-blue) 10%,
                transparent
              );
            text-decoration: none;
            color: var(--white);
            pointer-events: auto;
            transform-style: preserve-3d;
            will-change: transform;
          }

          .product-dna-card--left {
            left: -92px;
          }

          .product-dna-card--right {
            right: -92px;
          }

          .product-dna-card--1 {
            top: 1%;
            transform: rotate(-5deg);
          }

          .product-dna-card--2 {
            top: 17%;
            transform: rotate(5deg);
          }

          .product-dna-card--3 {
            top: 34%;
            transform: rotate(-5deg);
          }

          .product-dna-card--4 {
            top: 50%;
            transform: rotate(5deg);
          }

          .product-dna-card--5 {
            top: 67%;
            transform: rotate(-5deg);
          }

          .product-dna-card--6 {
            top: 83%;
            transform: rotate(5deg);
          }

          .product-dna-card__image-wrap {
            position: relative;
            overflow: hidden;
            aspect-ratio: 1.18;
          }

          .product-dna-card__image {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            transform: scale(1);
            will-change: transform;
          }

          .product-dna-card__info {
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: 8px;
            padding: 10px 4px 3px;
            font-family: var(--font-sans);
            font-size: 10px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .product-dna-card__info span {
            color: var(--duck-blue);
          }

          .product-dna-card__info strong {
            font-size: 10px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .product-dna-card__info span:last-child {
            color: var(--white);
            font-size: 14px;
          }

          .product-dna-axis {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 2px;
            height: 108%;
            transform: translate(-50%, -50%);
            background: linear-gradient(
              to bottom,
              transparent,
              color-mix(
                in srgb,
                var(--duck-blue) 55%,
                transparent
              ),
              transparent
            );
            pointer-events: none;
          }

          .product-dna-axis span {
            position: absolute;
            left: 50%;
            width: 7px;
            height: 7px;
            transform: translateX(-50%);
            border-radius: 50%;
            background: var(--duck-blue);
          }

          .product-dna-axis span:nth-child(1) {
            top: 20%;
          }

          .product-dna-axis span:nth-child(2) {
            top: 50%;
          }

          .product-dna-axis span:nth-child(3) {
            top: 80%;
          }

          @media (max-width: 1100px) {
            .product-dna-hero__layout {
              grid-template-columns: 0.7fr 1.3fr;
            }

            .product-dna-helix {
              transform: translate(-50%, -50%) scale(0.85);
            }
          }

          @media (max-width: 820px) {
            .product-dna-hero__layout {
              grid-template-columns: 1fr;
              gap: 10px;
            }

            .product-dna-hero__copy {
              text-align: center;
              max-width: 600px;
              margin: 0 auto;
            }

            .product-dna-hero__copy .domain-hero__quote {
              justify-content: center;
              margin-left: auto;
              margin-right: auto;
            }

            .product-dna-scene {
              width: 100%;
              height: 520px;
              min-height: 520px;
            }

            .product-dna-helix {
              transform: translate(-50%, -50%) scale(0.7);
            }
          }

          @media (max-width: 560px) {
            .product-dna-hero__layout {
              min-height: auto;
            }

            .product-dna-scene {
              height: 440px;
              min-height: 440px;
              overflow: visible;
            }

            .product-dna-helix {
              transform: translate(-50%, -50%) scale(0.53);
            }

            .product-dna-card {
              width: 160px;
            }

            .product-dna-card--left {
              left: -70px;
            }

            .product-dna-card--right {
              right: -70px;
            }

            .product-dna-hero__geometry {
              opacity: 0.6;
            }
          }
        `}
      </style>
    </section>
  );
}

export default DomainHero;