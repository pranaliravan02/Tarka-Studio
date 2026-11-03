
import { useEffect, useRef } from "react";
import gsap from "gsap";

import type { Domain } from "../../data/domains";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface DomainIntroProps {
  domain: Domain;
}

function DomainIntro({ domain }: DomainIntroProps) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const isDigital = domain.id === "uiux-web";

useEffect(() => {
  const section = sectionRef.current;

  if (!section || reducedMotion) {
    return;
  }

  const context = gsap.context(() => {
    const elements = gsap.utils.toArray<HTMLElement>(
      ".domain-intro__animate"
    );

    const accents = gsap.utils.toArray<HTMLElement>(
      ".domain-intro__accent"
    );

    // 1. Cinematic reveal of the introduction content
    gsap.fromTo(
      elements,
      {
        autoAlpha: 0,
        y: 55,
        filter: "blur(7px)",
      },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        clearProps: "filter",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      }
    );

    // 2. Animated accent line
    gsap.fromTo(
      accents,
      {
        scaleX: 0,
        transformOrigin: "left center",
      },
      {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      }
    );

    if (isDigital) {
      const blueprint = section.querySelector<HTMLElement>(
        ".domain-intro__blueprint"
      );

      const orbit = section.querySelector<HTMLElement>(
        ".domain-intro__blueprint-orbit"
      );

      const bars = gsap.utils.toArray<HTMLElement>(
        ".domain-intro__blueprint-bar"
      );

      // 3. Blueprint enters with depth
      if (blueprint) {
        gsap.fromTo(
          blueprint,
          {
            autoAlpha: 0,
            y: 100,
            rotateX: 8,
            rotateY: -7,
            scale: 0.92,
            transformPerspective: 1200,
          },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.3,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              once: true,
            },
          }
        );

        // 4. Subtle depth while scrolling through the section
        gsap.to(blueprint, {
          y: -35,
          rotateX: -2,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // 5. Orbit responds to scrolling
      if (orbit) {
        gsap.to(orbit, {
          rotation: 24,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // 6. Blueprint progress bars animate into view
      gsap.fromTo(
        bars,
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: blueprint ?? section,
            start: "top 75%",
            once: true,
          },
        }
      );
    }
  }, section);

  return () => context.revert();
}, [domain.id, isDigital, reducedMotion]);

  return (
    <section
     id={domain.id === "uiux-web" ? "digital-intro" : undefined}
      ref={sectionRef}
      className={`domain-intro ${
        isDigital ? "domain-intro--digital" : ""
      }`}
      aria-label={`${domain.category} introduction`}
      data-domain-id={domain.id}
    >
      <div className="domain-intro__label domain-intro__animate">
        <span>{domain.number}</span>
        <span>
          {isDigital ? "Inside the digital studio" : "What we do"}
        </span>
      </div>

      {isDigital ? (
        <div className="domain-intro__digital-layout">
          <div className="domain-intro__digital-copy">
            <div
              className="domain-intro__accent"
              aria-hidden="true"
            />

            <p className="domain-intro__eyebrow domain-intro__animate">
              STRATEGY / DESIGN / DEVELOPMENT
            </p>

            <h2 className="domain-intro__animate">
              We design
              <br />
              <span className="domain-intro__title-outline">
                what comes
              </span>
              <br />
              <em>next.</em>
            </h2>

            <p className="domain-intro__description domain-intro__animate">
              {domain.description}
            </p>

            <p className="domain-intro__supporting domain-intro__animate">
              From the first sketch to the final interaction,
              every detail has a purpose. We bring design thinking
              and thoughtful engineering together to create
              digital experiences that feel effortless.
            </p>

            <div className="domain-intro__principles domain-intro__animate">
              <span>
                <span className="domain-intro__principle-dot" />
                Human-centred
              </span>

              <span>
                <span className="domain-intro__principle-dot" />
                Interaction-led
              </span>

              <span>
                <span className="domain-intro__principle-dot" />
                Built to scale
              </span>
            </div>
          </div>

          <div
            className="domain-intro__blueprint domain-intro__animate"
            aria-label="Illustration of a digital interface design system"
          >
            <div className="domain-intro__blueprint-top">
              <span>DESIGN SYSTEM / 001</span>

              <span className="domain-intro__blueprint-live">
                <span />
                IN PROGRESS
              </span>
            </div>

            <div className="domain-intro__blueprint-canvas">
              <div className="domain-intro__blueprint-coordinate">
                X: 024
                <br />
                Y: 068
              </div>

              <div className="domain-intro__blueprint-orbit">
                <div className="domain-intro__blueprint-orbit-inner">
                  <div className="domain-intro__blueprint-core">
                    <span>t.</span>
                  </div>
                </div>

                <span className="domain-intro__blueprint-node domain-intro__blueprint-node--one" />
                <span className="domain-intro__blueprint-node domain-intro__blueprint-node--two" />
                <span className="domain-intro__blueprint-node domain-intro__blueprint-node--three" />
              </div>

              <div className="domain-intro__blueprint-annotation">
                <span>01 / INTERFACE</span>
                <span>Design with intention.</span>
              </div>

              <div className="domain-intro__blueprint-corner">
                ↗
              </div>
            </div>

            <div className="domain-intro__blueprint-bottom">
              <div>
                <span>01</span>
                <span>Structure</span>
                <div className="domain-intro__blueprint-track">
                  <span
                    className="domain-intro__blueprint-bar"
                    style={{ width: "82%" }}
                  />
                </div>
              </div>

              <div>
                <span>02</span>
                <span>Interaction</span>
                <div className="domain-intro__blueprint-track">
                  <span
                    className="domain-intro__blueprint-bar"
                    style={{ width: "67%" }}
                  />
                </div>
              </div>

              <div>
                <span>03</span>
                <span>Experience</span>
                <div className="domain-intro__blueprint-track">
                  <span
                    className="domain-intro__blueprint-bar"
                    style={{ width: "94%" }}
                  />
                </div>
              </div>
            </div>

            <div className="domain-intro__blueprint-footer">
              <span>TARKA DIGITAL STUDIO</span>
              <span>DESIGNED FOR PEOPLE.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="domain-intro__content">
          <div
            className="domain-intro__accent"
            aria-hidden="true"
          />

          <h2 className="domain-intro__animate">
            Ideas become
            <br />
            <em>experiences.</em>
          </h2>

          <p className="domain-intro__animate">
            {domain.description}
          </p>

          <p className="domain-intro__animate domain-intro__supporting">
            We combine strategy, design and execution
            to create work that is clear, useful and
            memorable.
          </p>
        </div>
      )}
    </section>
  );
}

export default DomainIntro;
