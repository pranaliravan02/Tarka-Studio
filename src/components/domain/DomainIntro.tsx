
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

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(
        ".domain-intro__animate"
      );

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 70,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".domain-intro__accent",
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [domain, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="domain-intro"
      aria-label={`${domain.category} introduction`}
    >
      <div className="domain-intro__label domain-intro__animate">
        <span>{domain.number}</span>
        <span>What we do</span>
      </div>

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
    </section>
  );
}

export default DomainIntro;

