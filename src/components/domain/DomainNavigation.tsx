
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

import type { Domain } from "../../data/domains";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface DomainNavigationProps {
  previousDomain: Domain;
  nextDomain: Domain;
  getRoute: (id: string) => string;
}

function DomainNavigation({
  previousDomain,
  nextDomain,
  getRoute,
}: DomainNavigationProps) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".domain-navigation__item",
        {
          opacity: 0,
          y: 70,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
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
    if (reducedMotion) {
      return;
    }

    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();

    const x =
      event.clientX -
      (rect.left + rect.width / 2);

    const y =
      event.clientY -
      (rect.top + rect.height / 2);

    gsap.to(element, {
      x: x * 0.08,
      y: y * 0.08,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (reducedMotion) {
      return;
    }

    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="domain-navigation"
      aria-label="Navigate between domains"
    >
      <Link
        to={getRoute(previousDomain.id)}
        className="domain-navigation__item domain-navigation__item--previous"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span className="domain-navigation__direction">
          ← Previous
        </span>

        <strong>{previousDomain.title}</strong>

        <span className="domain-navigation__number">
          {previousDomain.number}
        </span>
      </Link>

      <Link
        to={getRoute(nextDomain.id)}
        className="domain-navigation__item domain-navigation__item--next"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <span className="domain-navigation__direction">
          Next →
        </span>

        <strong>{nextDomain.title}</strong>

        <span className="domain-navigation__number">
          {nextDomain.number}
        </span>
      </Link>
    </section>
  );
}

export default DomainNavigation;

