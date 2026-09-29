import { useEffect, useRef } from "react";
import gsap from "gsap";

import { projects } from "../../data/projects";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface DomainWorkProps {
  domainId: string;
}

function DomainWork({ domainId }: DomainWorkProps) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const domainProjects = projects.filter(
    (project) => project.domainId === domainId
  );

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(
        ".domain-work__project"
      );

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 100,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );

      items.forEach((item) => {
        const image = item.querySelector<HTMLElement>(
          ".domain-work__image"
        );

        if (!image) {
          return;
        }

        const handleEnter = () => {
          gsap.to(image, {
            scale: 1.06,
            duration: 0.8,
            ease: "power3.out",
          });
        };

        const handleLeave = () => {
          gsap.to(image, {
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          });
        };

        item.addEventListener("mouseenter", handleEnter);
        item.addEventListener("mouseleave", handleLeave);

        return () => {
          item.removeEventListener("mouseenter", handleEnter);
          item.removeEventListener("mouseleave", handleLeave);
        };
      });
    }, sectionRef);

    return () => context.revert();
  }, [domainId, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="domain-work"
      aria-labelledby={`work-${domainId}`}
    >
      <div className="domain-work__header">
        <div className="domain-work__label">
          <span>03</span>
          <span>Selected Work</span>
        </div>

        <div className="domain-work__heading">
          <p className="domain-work__eyebrow">
            WORK WE HAVE BUILT
          </p>

          <h2 id={`work-${domainId}`}>
            Ideas,
            <br />
            <em>made real.</em>
          </h2>
        </div>
      </div>

      {domainProjects.length > 0 ? (
        <div className="domain-work__grid">
          {domainProjects.map((project, index) => (
            <article
              key={project.id}
              className={`domain-work__project ${
                index === 0
                  ? "domain-work__project--featured"
                  : ""
              }`}
            >
              <div className="domain-work__image-wrap">
                <div className="domain-work__image">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                  />
                </div>

                <span className="domain-work__project-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="domain-work__project-info">
                <div>
                  <p className="domain-work__category">
                    {project.category}
                  </p>

                  <h3>{project.title}</h3>
                </div>

                <span
                  className="domain-work__project-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>

              <p className="domain-work__description">
                {project.description}
              </p>

              <div className="domain-work__services">
                {project.services.map((service) => (
                  <span key={service}>{service}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="domain-work__empty">
          <span>01</span>

          <div>
            <p>
              Selected work is being prepared.
            </p>

            <p>
              More Tarka projects will appear here.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default DomainWork;

