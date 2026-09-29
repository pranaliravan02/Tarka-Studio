import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HomeCTAProps {
  reducedMotion: boolean;
}

function HomeCTA({ reducedMotion }: HomeCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonTextRef = useRef<HTMLSpanElement>(null);
  const buttonArrowRef = useRef<HTMLSpanElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const line = lineRef.current;
    const button = buttonRef.current;

    if (!section || !eyebrow || !heading || !line || !button) return;

    const ctx = gsap.context(() => {
      /*
       * The CTA starts visually quiet and builds as the user
       * approaches the final section of the homepage.
       */
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      reveal
        .fromTo(
          eyebrow,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          }
        )
        .fromTo(
          heading,
          {
            opacity: 0,
            y: 70,
            rotateX: 8,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.1,
          },
          "-=0.35"
        )
        .fromTo(
          line,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 0.9,
          },
          "-=0.65"
        )
        .fromTo(
          button,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
          },
          "-=0.45"
        );

      if (reducedMotion) return;

      /*
       * Subtle heading movement while the CTA passes through
       * the viewport.
       */
      gsap.fromTo(
        heading,
        {
          yPercent: 8,
        },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleMouseEnter = () => {
    if (reducedMotion) return;

    gsap.to(buttonRef.current, {
      y: -5,
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.to(buttonTextRef.current, {
      x: 5,
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.to(buttonArrowRef.current, {
      x: 7,
      y: -7,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;

    gsap.to(buttonRef.current, {
      y: 0,
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.to(buttonTextRef.current, {
      x: 0,
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.to(buttonArrowRef.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleClick = () => {
    if (reducedMotion) {
      navigate("/quote");
      return;
    }

    gsap.to(buttonRef.current, {
      scale: 0.96,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        navigate("/quote");
      },
    });
  };

  return (
    <section
      ref={sectionRef}
      className="home-cta"
      aria-label="Start a project"
    >
      <div className="home-cta-inner">
        <p ref={eyebrowRef} className="home-cta-eyebrow">
          Have something in mind?
        </p>

        <h2 ref={headingRef} className="home-cta-title">
          Let&apos;s make
          <br />
          something
          <br />
          <em>meaningful.</em>
        </h2>

        <div ref={lineRef} className="home-cta-line" />

        <button
          ref={buttonRef}
          type="button"
          className="home-cta-button"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Start a project and get a quote"
        >
          <span ref={buttonTextRef}>START A PROJECT</span>

          <span
            ref={buttonArrowRef}
            className="home-cta-arrow"
            aria-hidden="true"
          >
            ↗
          </span>
        </button>
      </div>
    </section>
  );
}

export default HomeCTA;