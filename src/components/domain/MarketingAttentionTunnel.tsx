
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import "./MarketingAttentionTunnel.css";

gsap.registerPlugin(ScrollTrigger);

const tunnelWords = [
  { number: "01", word: "ATTENTION", note: "BE SEEN" },
  { number: "02", word: "STRATEGY", note: "KNOW YOUR WHY" },
  { number: "03", word: "CREATIVITY", note: "BREAK THE PATTERN" },
  { number: "04", word: "CONNECTION", note: "REACH THE RIGHT PEOPLE" },
  { number: "05", word: "INFLUENCE", note: "MAKE IT MATTER" },
  { number: "06", word: "GROWTH", note: "MOVE FORWARD" },
];

function MarketingAttentionTunnel() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;

    if (!section || !stage) return;

    const intro = stage.querySelector<HTMLElement>(
      ".marketing-tunnel__intro"
    );

    const portal = stage.querySelector<HTMLElement>(
      ".marketing-tunnel__portal"
    );

    const rings = gsap.utils.toArray<HTMLElement>(
      ".marketing-tunnel__ring",
      stage
    );

    const words = gsap.utils.toArray<HTMLElement>(
      ".marketing-tunnel__word-card",
      stage
    );

    const outro = stage.querySelector<HTMLElement>(
      ".marketing-tunnel__outro"
    );

    const progress = stage.querySelector<HTMLElement>(
      ".marketing-tunnel__progress-fill"
    );

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(intro, {
          clearProps: "all",
          autoAlpha: 1,
        });

        gsap.set(portal, {
          clearProps: "all",
          autoAlpha: 1,
        });

        gsap.set(rings, {
          clearProps: "all",
        });

        gsap.set(words, {
          autoAlpha: 0,
        });

        gsap.set(outro, {
          autoAlpha: 0,
        });

        return;
      }

      // Initial state: all words are hidden and centred.
      gsap.set(words, {
        autoAlpha: 0,
        x: 0,
        y: 100,
        z: -850,
        scale: 0.45,
        filter: "blur(14px)",
        transformOrigin: "center center",
      });

      gsap.set(outro, {
        autoAlpha: 0,
        x: 0,
        y: 65,
        scale: 0.9,
        filter: "blur(12px)",
      });

      gsap.set(progress, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      // Opening animation starts immediately on page load.
      gsap.fromTo(
        intro,
        {
          autoAlpha: 0,
          y: 45,
          filter: "blur(10px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          delay: 0.15,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        portal,
        {
          autoAlpha: 0,
          scale: 0.7,
          rotationY: -25,
        },
        {
          autoAlpha: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.6,
          delay: 0.2,
          ease: "power4.out",
        }
      );

      // Continuous independent rotation of portal rings.
      rings.forEach((ring, index) => {
        gsap.to(ring, {
          rotation: index % 2 === 0 ? 360 : -360,
          duration: 28 + index * 9,
          repeat: -1,
          ease: "none",
        });
      });

      // Main scroll-controlled cinematic timeline.
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${Math.max(3800, window.innerHeight * 4.5)}`,
          scrub: 0.4,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
        },
      });

      // 01 — Opening text exits.
      timeline.to(
        intro,
        {
          autoAlpha: 0,
          x: -100,
          y: -25,
          filter: "blur(12px)",
          duration: 0.9,
          ease: "power2.in",
        },
        0.15
      );

      // 02 — Portal moves towards the viewer.
      timeline.to(
        portal,
        {
          x: () =>
            -Math.min(window.innerWidth * 0.2, 230),
          scale: 1.4,
          duration: 1.5,
          ease: "power2.inOut",
        },
        0.2
      );

      // Portal rings expand.
      timeline.to(
        rings,
        {
          scale: 1.18,
          duration: 2.5,
          stagger: 0.12,
          ease: "power2.inOut",
        },
        0.4
      );

      // Portal becomes a subtle background.
      timeline.to(
        portal,
        {
          autoAlpha: 0.2,
          scale: 1.15,
          duration: 0.7,
          ease: "power2.out",
        },
        1.2
      );

      // 03 — Sequential word animation.
      const firstWordStart = 1.45;
      const wordInterval = 1.3;
      const enterDuration = 0.42;
      const exitStart = 0.65;
      const exitDuration = 0.45;

      // IMPORTANT:
      // Iterate over the DOM word cards.
      // The second callback argument is always a numeric index.
      words.forEach((card, index) => {
        const start = firstWordStart + index * wordInterval;

        // Word enters from depth.
        timeline.fromTo(
          card,
          {
            autoAlpha: 0,
            x: 0,
            y: 100,
            z: -850,
            scale: 0.45,
            filter: "blur(14px)",
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            z: 100,
            scale: 1,
            filter: "blur(0px)",
            duration: enterDuration,
            ease: "power3.out",
          },
          start
        );

        // Word exits before the next word enters.
        timeline.to(
          card,
          {
            autoAlpha: 0,
            x: 0,
            y: -90,
            z: 450,
            scale: 1.18,
            filter: "blur(12px)",
            duration: exitDuration,
            ease: "power2.in",
          },
          start + exitStart
        );
      });

      // Calculate the exact end of the final word.
      const lastWordEnd =
        firstWordStart +
        (words.length - 1) * wordInterval +
        exitStart +
        exitDuration;

      // 04 — Portal disappears before the final message.
      timeline.to(
        portal,
        {
          autoAlpha: 0,
          scale: 0.8,
          duration: 0.55,
          ease: "power2.in",
        },
        lastWordEnd
      );

      // 05 — Final TARKA statement enters.
      timeline.fromTo(
        outro,
        {
          autoAlpha: 0,
          x: 0,
          y: 65,
          scale: 0.9,
          filter: "blur(12px)",
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
        lastWordEnd + 0.35
      );

      // Scroll progress follows the complete timeline.
      const totalDuration = timeline.duration();

      timeline.to(
        progress,
        {
          scaleX: 1,
          duration: totalDuration,
          ease: "none",
        },
        0
      );
    }, section);

    return () => {
      context.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="marketing-tunnel"
      aria-label="Tarka Marketing cinematic experience"
    >
      <div
        ref={stageRef}
        className="marketing-tunnel__stage"
      >
        {/* Background */}
        <div
          className="marketing-tunnel__grid"
          aria-hidden="true"
        />

        <div
          className="marketing-tunnel__ambient marketing-tunnel__ambient--one"
          aria-hidden="true"
        />

        <div
          className="marketing-tunnel__ambient marketing-tunnel__ambient--two"
          aria-hidden="true"
        />

        {/* Top information */}
        <div className="marketing-tunnel__topline">
          <span>04 / THE ATTENTION ENGINE</span>
          <span>STRATEGY × CREATIVITY × IMPACT</span>
          <span>SCROLL TO ENTER ↓</span>
        </div>

        {/* Scroll progress */}
        <div
          className="marketing-tunnel__progress"
          aria-hidden="true"
        >
          <span className="marketing-tunnel__progress-fill" />
        </div>

        {/* Opening composition */}
        <div className="marketing-tunnel__intro">
          <p className="marketing-tunnel__eyebrow">
            TARKA / MARKETING STUDIO
          </p>

          <h1>
            MAKE
            <br />
            <span>NOISE.</span>
            <br />
            MAKE IT
            <br />
            MATTER<span className="marketing-tunnel__period">.</span>
          </h1>

          <p className="marketing-tunnel__description">
            Ideas that break through, connect with people and move brands forward.
          </p>

          <span className="marketing-tunnel__hint">
            SCROLL TO ENTER THE EXPERIENCE <b>↓</b>
          </span>
        </div>

        {/* Futuristic portal */}
        <div
          className="marketing-tunnel__portal"
          aria-hidden="true"
        >
          <div className="marketing-tunnel__portal-halo" />

          <div className="marketing-tunnel__ring marketing-tunnel__ring--outer" />
          <div className="marketing-tunnel__ring marketing-tunnel__ring--middle" />
          <div className="marketing-tunnel__ring marketing-tunnel__ring--inner" />

          <div className="marketing-tunnel__portal-core">
            <span>T</span>
            <small>TARKA</small>
          </div>

          <span className="marketing-tunnel__orbit-dot marketing-tunnel__orbit-dot--one" />
          <span className="marketing-tunnel__orbit-dot marketing-tunnel__orbit-dot--two" />

          <span className="marketing-tunnel__portal-caption">
            ENTER THE SIGNAL
          </span>
        </div>

        {/* Sequential word stage */}
        <div
          className="marketing-tunnel__word-stage"
          aria-hidden="true"
        >
          {tunnelWords.map((item) => (
            <div
              className="marketing-tunnel__word-card"
              key={item.number}
            >
              <span className="marketing-tunnel__word-number">
                {item.number} / 06
              </span>

              <strong>{item.word}</strong>

              <span className="marketing-tunnel__word-note">
                {item.note}
              </span>
            </div>
          ))}
        </div>

        {/* Final message */}
        <div className="marketing-tunnel__outro">
          <p>YOU HAVE THEIR ATTENTION.</p>

          <h2>
            NOW MAKE
            <br />
            IT <span>MATTER.</span>
          </h2>

          <span>STRATEGY / CREATIVITY / GROWTH</span>
        </div>

        {/* Bottom information */}
        <div className="marketing-tunnel__bottomline">
          <span>BUILT TO BREAK THROUGH THE NOISE.</span>
          <span>TARKA — MARKETING STUDIO</span>
        </div>
      </div>
    </section>
  );
}

export default MarketingAttentionTunnel;
