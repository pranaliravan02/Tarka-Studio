
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { projects } from "../../data/projects";
import { useReducedMotion } from "../../hooks/useReducedMotion";

import "./DomainWork.css";

interface DomainWorkProps {
  domainId: string;
}

function DomainWork({ domainId }: DomainWorkProps) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const isDigital = domainId === "uiux-web";

  const domainProjects = projects.filter(
    (project) => project.domainId === domainId
  );

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || reducedMotion) {
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
          y: 65,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, section);

    const hoverCleanups: Array<() => void> = [];

    if (isDigital) {
      const cards = section.querySelectorAll<HTMLElement>(
        ".domain-work__project"
      );

      cards.forEach((card) => {
        const image = card.querySelector<HTMLElement>(
          ".domain-work__image"
        );

        if (!image) {
          return;
        }

        const enter = () => {
          gsap.to(image, {
            scale: 1.035,
            duration: 0.65,
            ease: "power3.out",
            overwrite: "auto",
          });

          card.classList.add("domain-work__project--active");
        };

        const leave = () => {
          gsap.to(image, {
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
            overwrite: "auto",
          });

          card.classList.remove("domain-work__project--active");
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);

        hoverCleanups.push(() => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
        });
      });
    }

    return () => {
      hoverCleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [domainId, isDigital, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={`domain-work ${
        isDigital ? "domain-work--digital" : ""
      }`}
      aria-labelledby={`work-${domainId}`}
      data-domain-id={domainId}
      data-content-type="project-gallery"
    >
      <div className="domain-work__header">
        <div className="domain-work__label">
          <span>03</span>
          <span>
            {isDigital ? "Selected Interfaces" : "Selected Work"}
          </span>
        </div>

        <div className="domain-work__heading">
          <p className="domain-work__eyebrow">
            {isDigital
              ? "DESIGNED WITH PURPOSE. BUILT TO WORK."
              : "WORK WE HAVE BUILT"}
          </p>

          <h2 id={`work-${domainId}`}>
            {isDigital ? (
              <>
                Digital ideas,
                <br />
                <em>made tangible.</em>
              </>
            ) : (
              <>
                Ideas,
                <br />
                <em>made real.</em>
              </>
            )}
          </h2>

          {isDigital && (
            <p className="domain-work__intro">
              Explore digital experiences shaped around real people,
              thoughtful interactions and purposeful design.
            </p>
          )}
        </div>
      </div>

      {domainProjects.length > 0 ? (
        <div
          className={
            isDigital
              ? "domain-work__grid domain-work__grid--case-studies"
              : "domain-work__grid"
          }
        >
          {domainProjects.map((project, index) => (
            <article
              key={project.id}
              className={[
                "domain-work__project",
                index === 0
                  ? "domain-work__project--featured"
                  : "",
                isDigital
                  ? "domain-work__project--case-study"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              data-project-id={project.id}
            >
              <div className="domain-work__image-wrap">
                {isDigital && (
                  <div
                    className="domain-work__browser-bar"
                    aria-hidden="true"
                  >
                    <div className="domain-work__browser-dots">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="domain-work__browser-address">
                      <span>↗</span>
                      <span>Project preview</span>
                    </div>

                    <span className="domain-work__browser-status">
                      WEB / UI
                    </span>
                  </div>
                )}

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

                {isDigital && (
                  <span
                    className="domain-work__image-indicator"
                    aria-hidden="true"
                  >
                    <span />
                    INTERFACE / {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>

              <div className="domain-work__project-info">
                <div>
                  <p className="domain-work__category">
                    {project.category}
                    {project.year ? ` / ${project.year}` : ""}
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

              <div
                className="domain-work__services"
                aria-label="Project services"
              >
                {project.services.map((service) => (
                  <span key={service}>{service}</span>
                ))}
              </div>

              {isDigital && (
                <div className="domain-work__case-study-footer">
                  <span>DESIGN & DEVELOPMENT</span>
                  <span aria-hidden="true">01 — 0{index + 1}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div
          className={
            isDigital
              ? "domain-work__empty domain-work__empty--digital"
              : "domain-work__empty"
          }
          data-content-state="empty"
        >
          {isDigital ? (
            <>
              <div className="domain-work__empty-visual">
                <div className="domain-work__empty-window">
                  <div className="domain-work__empty-window-bar">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="domain-work__empty-layout">
                    <div className="domain-work__empty-sidebar">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="domain-work__empty-content">
                      <span />
                      <span />
                      <span />
                      <div />
                    </div>
                  </div>
                </div>

                <span className="domain-work__empty-orbit" />
              </div>

              <div className="domain-work__empty-copy">
                <span className="domain-work__empty-index">
                  DIGITAL WORK / 001
                </span>

                <h3>Good work is taking shape.</h3>

                <p>
                  Our digital case studies will appear here as they
                  are published.
                </p>

                <span className="domain-work__empty-status">
                  <span />
                  A NEW EXPERIENCE IS IN THE WORKS
                </span>
              </div>
            </>
          ) : (
            <>
              <span>01</span>

              <div>
                <p>Selected work is being prepared.</p>
                <p>More Tarka projects will appear here.</p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default DomainWork;
