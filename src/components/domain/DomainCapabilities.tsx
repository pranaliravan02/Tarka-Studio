
import { useEffect, useRef } from "react";
import gsap from "gsap";

import {
  serviceCategories,
  type ServiceCategory,
} from "../../data/services";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface DomainCapabilitiesProps {
  domainId: string;
}

function DomainCapabilities({
  domainId,
}: DomainCapabilitiesProps) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const services: ServiceCategory[] = serviceCategories.filter(
    (category) =>
      category.services.some(
        (service) => service.domainId === domainId
      )
  );

  const domainServices = services.flatMap(
    (category) =>
      category.services.filter(
        (service) => service.domainId === domainId
      )
  );

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        ".domain-capabilities__item"
      );

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [domainId, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="domain-capabilities"
      aria-labelledby={`capabilities-${domainId}`}
    >
      <div className="domain-capabilities__header">
        <div className="domain-capabilities__label">
          <span>02</span>
          <span>Services</span>
        </div>

        <div>
          <p className="domain-capabilities__eyebrow">
            WHAT WE CAN DO
          </p>

          <h2 id={`capabilities-${domainId}`}>
            Built around
            <br />
            <em>your problem.</em>
          </h2>
        </div>
      </div>

      <div className="domain-capabilities__list">
        {domainServices.map((service, index) => (
          <article
            key={service.id}
            className="domain-capabilities__item"
          >
            <div className="domain-capabilities__index">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="domain-capabilities__body">
              <h3>{service.name}</h3>

              <p>{service.description}</p>

              <span className="domain-capabilities__unit">
                {service.unit}
              </span>
            </div>

            <span
              className="domain-capabilities__arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DomainCapabilities;
