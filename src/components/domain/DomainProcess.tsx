
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useReducedMotion } from "../../hooks/useReducedMotion";

const processSteps = [
  {
    number: "01",
    title: "Discover",
    text: "We understand the problem, the people and the context before jumping into solutions.",
  },
  {
    number: "02",
    title: "Think",
    text: "We turn research and observations into a clear direction, structure and creative opportunity.",
  },
  {
    number: "03",
    title: "Create",
    text: "We explore concepts, prototypes and visual systems until the right idea starts taking shape.",
  },
  {
    number: "04",
    title: "Refine",
    text: "We test, polish and simplify the work so the final experience feels intentional from every angle.",
  },
];

function DomainProcess() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>(
        ".domain-process__step"
      );

      gsap.fromTo(
        steps,
        {
          opacity: 0,
          x: 70,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".domain-process__line-progress",
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 1.8,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="domain-process"
      aria-labelledby="domain-process-title"
    >
      <div className="domain-process__header">
        <div className="domain-process__label">
          <span>04</span>
          <span>Our Process</span>
        </div>

        <div className="domain-process__heading">
          <p className="domain-process__eyebrow">
            HOW WE WORK
          </p>

          <h2 id="domain-process-title">
            Think first.
            <br />
            <em>Then make.</em>
          </h2>
        </div>
      </div>

      <div className="domain-process__timeline">
        <div
          className="domain-process__line"
          aria-hidden="true"
        >
          <span className="domain-process__line-progress" />
        </div>

        <div className="domain-process__steps">
          {processSteps.map((step) => (
            <article
              key={step.number}
              className="domain-process__step"
            >
              <div className="domain-process__step-top">
                <span className="domain-process__number">
                  {step.number}
                </span>

                <span
                  className="domain-process__dot"
                  aria-hidden="true"
                />
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DomainProcess;

