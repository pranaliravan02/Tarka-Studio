
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

import type { Domain } from "../../data/domains";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface DomainCTAProps {
  domain: Domain;
}

function DomainCTA({ domain }: DomainCTAProps) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".domain-cta__content",
        {
          opacity: 0,
          y: 90,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".domain-cta__orb",
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "elastic.out(1, 0.55)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (reducedMotion || !buttonRef.current) {
      return;
    }

    const rect =
      buttonRef.current.getBoundingClientRect();

    const x =
      event.clientX -
      (rect.left + rect.width / 2);

    const y =
      event.clientY -
      (rect.top + rect.height / 2);

    gsap.to(buttonRef.current, {
      x: x * 0.12,
      y: y * 0.12,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion || !buttonRef.current) {
      return;
    }

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="domain-cta"
      aria-labelledby={`cta-title-${domain.id}`}
    >
      <div
        className="domain-cta__orb"
        aria-hidden="true"
      />

      <div className="domain-cta__content">
        <p className="domain-cta__eyebrow">
          READY TO BUILD?
        </p>

        <h2 id={`cta-title-${domain.id}`}>
          Have an idea?
          <br />
          <em>Let's make it real.</em>
        </h2>

        <p className="domain-cta__description">
          Tell us what you're working on and
          build a quotation around the services
          you actually need.
        </p>

        <Link
          ref={buttonRef}
          to={`/quote?domain=${domain.id}`}
          className="domain-cta__button"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span>Get a Quote</span>

          <span
            className="domain-cta__button-arrow"
            aria-hidden="true"
          >
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}

export default DomainCTA;

