
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

import type { Domain } from "../../data/domains";
import { useReducedMotion } from "../../hooks/useReducedMotion";

import "./DigitalHero.css";

interface DigitalHeroProps {
  domain: Domain;
}

const interfaceCards = [
  {
    number: "01",
    label: "DISCOVER",
    title: "Understand people.",
    className: "digital-hero__card--discover",
  },
  {
    number: "02",
    label: "DESIGN",
    title: "Make it intuitive.",
    className: "digital-hero__card--design",
  },
  {
    number: "03",
    label: "DEVELOP",
    title: "Bring it to life.",
    className: "digital-hero__card--develop",
  },
];

function DigitalHero({ domain }: DigitalHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const revealElements =
        root.querySelectorAll<HTMLElement>("[data-digital-reveal]");

      if (reducedMotion) {
        gsap.set(revealElements, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          clearProps: "transform",
        });
        return;
      }

      gsap.set(revealElements, {
        opacity: 0,
        y: 28,
      });

      gsap.set(".digital-hero__visual", {
        opacity: 0,
        x: 36,
        scale: 0.97,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(root.querySelector(".digital-hero__eyebrow"), {
          opacity: 1,
          y: 0,
          duration: 0.55,
        })
        .to(
          root.querySelector(".digital-hero__title"),
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
          },
          "-=0.25",
        )
        .to(
          root.querySelector(".digital-hero__description"),
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.45",
        )
        .to(
          root.querySelector(".digital-hero__actions"),
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.3",
        )
        .to(
          root.querySelector(".digital-hero__visual"),
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
          },
          "-=0.65",
        )
        .to(
          root.querySelectorAll(".digital-hero__card"),
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
          },
          "-=0.45",
        );

      gsap.to(".digital-hero__orbit--outer", {
        rotate: 360,
        duration: 34,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".digital-hero__orbit--inner", {
        rotate: -360,
        duration: 24,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".digital-hero__floating-chip", {
        y: -9,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.35,
        ease: "sine.inOut",
      });
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="digital-hero"
      aria-labelledby="digital-hero-title"
    >
      <div className="digital-hero__grid" aria-hidden="true" />

      <div className="digital-hero__topline">
        <span className="digital-hero__eyebrow" data-digital-reveal>
          <span className="digital-hero__status-dot" />
          DIGITAL EXPERIENCES STUDIO
        </span>

        <span className="digital-hero__index">
          {domain.number} / 05
        </span>
      </div>

      <div className="digital-hero__layout">
        <div className="digital-hero__copy">
          <p className="digital-hero__overline">
            STRATEGY · DESIGN · DEVELOPMENT
          </p>

          <h1
            id="digital-hero-title"
            className="digital-hero__title"
            data-digital-reveal
          >
            We design
            <br />
            what comes
            <br />
            <span>next<span className="digital-hero__period">.</span></span>
          </h1>

          <p
            className="digital-hero__description"
            data-digital-reveal
          >
            {domain.description}
          </p>

          <div
            className="digital-hero__actions"
            data-digital-reveal
          >
            <Link
              to={`/quote?domain=${domain.id}`}
              className="digital-hero__button"
            >
              <span>Start a project</span>
              <span aria-hidden="true">↗</span>
            </Link>

            <a className="digital-hero__text-link" href="#digital-intro">
              Explore our approach
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="digital-hero__footnote">
            <span>BUILT AROUND PEOPLE</span>
            <span className="digital-hero__footnote-line" />
            <span>MADE FOR WHAT'S NEXT</span>
          </div>
        </div>

        <div className="digital-hero__visual" aria-label="Interactive design concept">
          <div className="digital-hero__orbit digital-hero__orbit--outer">
            <span className="digital-hero__orbit-point digital-hero__orbit-point--one" />
            <span className="digital-hero__orbit-point digital-hero__orbit-point--two" />
          </div>

          <div className="digital-hero__orbit digital-hero__orbit--inner">
            <span className="digital-hero__orbit-point digital-hero__orbit-point--three" />
          </div>

          <div className="digital-hero__visual-caption digital-hero__visual-caption--top">
            <span>FIG. 001</span>
            <span>INTERFACE STUDY</span>
          </div>

          <div className="digital-hero__canvas">
            <div className="digital-hero__window">
              <div className="digital-hero__window-bar">
                <div className="digital-hero__window-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span>tarka.studio</span>
                <span className="digital-hero__window-menu">•••</span>
              </div>

              <div className="digital-hero__window-content">
                <div className="digital-hero__mock-nav">
                  <span className="digital-hero__mock-logo">t.</span>
                  <span>WORK&nbsp;&nbsp;&nbsp; ABOUT&nbsp;&nbsp;&nbsp; CONTACT</span>
                </div>

                <div className="digital-hero__mock-heading">
                  <span>GOOD DESIGN FEELS</span>
                  <strong>
                    Almost
                    <br />
                    effortless<span>.</span>
                  </strong>
                </div>

                <div className="digital-hero__mock-art">
                  <div className="digital-hero__art-ring digital-hero__art-ring--one" />
                  <div className="digital-hero__art-ring digital-hero__art-ring--two" />
                  <div className="digital-hero__art-core">T</div>
                  <span className="digital-hero__art-label">FORM / 01</span>
                </div>

                <div className="digital-hero__mock-footer">
                  <span>DESIGNED WITH INTENTION</span>
                  <span>SCROLL TO DISCOVER ↓</span>
                </div>
              </div>
            </div>

            <div className="digital-hero__floating-chip digital-hero__floating-chip--cursor">
              <span className="digital-hero__cursor-icon">↖</span>
              <span>
                <strong>Thoughtful UI</strong>
                <small>Every detail matters</small>
              </span>
            </div>

            <div className="digital-hero__floating-chip digital-hero__floating-chip--score">
              <span className="digital-hero__score-icon">✳</span>
              <span>
                <strong>Experience score</strong>
                <small>Clarity / 98%</small>
              </span>
              <span className="digital-hero__score-value">98</span>
            </div>

            <div className="digital-hero__coordinate" aria-hidden="true">
              <span>DESIGN SYSTEM</span>
              <span>19° 04' N / 72° 52' E</span>
            </div>
          </div>

          <div className="digital-hero__visual-caption digital-hero__visual-caption--bottom">
            <span>IDEAS INTO INTERFACES</span>
            <span>EST. 2026</span>
          </div>
        </div>
      </div>

      <div className="digital-hero__bottom">
        <span>FROM FIRST THOUGHT TO FINAL PIXEL</span>

        <div className="digital-hero__bottom-track" aria-hidden="true">
          <span />
        </div>

        <span>SCROLL TO EXPLORE ↓</span>
      </div>

      <div className="digital-hero__principles" aria-label="Our design approach">
        {interfaceCards.map((card) => (
          <div
            className={`digital-hero__card ${card.className}`}
            key={card.number}
            data-digital-reveal
          >
            <span className="digital-hero__card-number">{card.number}</span>
            <span className="digital-hero__card-label">{card.label}</span>
            <strong>{card.title}</strong>
            <span className="digital-hero__card-arrow" aria-hidden="true">↗</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DigitalHero;
