import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./GraphicDesignPage.css";

type Poster = {
  id: string;
  name: string;
  category: string;
  style: string;
  artwork: string;
  subtitle: string;
};

const posters: Poster[] = [
  {
    id: "01",
    name: "Colour Theory",
    category: "Poster Design",
    style: "poster-red",
    artwork: "COLOUR\nIS ENERGY",
    subtitle: "AN EXPERIMENT IN COLOUR",
  },
  {
    id: "02",
    name: "The New Wave",
    category: "Visual Campaign",
    style: "poster-blue",
    artwork: "NEW\nWAVE",
    subtitle: "A DIFFERENT PERSPECTIVE",
  },
  {
    id: "03",
    name: "Typographic Form",
    category: "Typography",
    style: "poster-yellow",
    artwork: "TYPE\nMATTERS.",
    subtitle: "FORM FOLLOWS FEELING",
  },
  {
    id: "04",
    name: "Beyond Ordinary",
    category: "Creative Poster",
    style: "poster-pink",
    artwork: "BEYOND\nORDINARY",
    subtitle: "BREAK THE EXPECTED",
  },
  {
    id: "05",
    name: "Visual Rhythm",
    category: "Art Direction",
    style: "poster-green",
    artwork: "VISUAL\nRHYTHM",
    subtitle: "DESIGN IN MOTION",
  },
  {
    id: "06",
    name: "The Good Edit",
    category: "Editorial Design",
    style: "poster-orange",
    artwork: "THE\nGOOD EDIT",
    subtitle: "A STUDY OF COMPOSITION",
  },
  {
    id: "07",
    name: "Shape of Ideas",
    category: "Graphic Exploration",
    style: "poster-purple",
    artwork: "SHAPE\nOF IDEAS",
    subtitle: "THINK BEYOND THE FRAME",
  },
];

const services = [
  {
    number: "01",
    title: "Brand Identity",
    description:
      "Distinctive visual identities that give brands a recognisable voice and personality.",
    tag: "IDENTITY",
  },
  {
    number: "02",
    title: "Poster & Print Design",
    description:
      "Expressive posters, print layouts and compositions that capture attention.",
    tag: "PRINT",
  },
  {
    number: "03",
    title: "Packaging Design",
    description:
      "Thoughtful packaging that brings together function, creativity and brand character.",
    tag: "PACKAGING",
  },
  {
    number: "04",
    title: "Typography & Layout",
    description:
      "Strong typography and carefully structured layouts that make communication clearer.",
    tag: "TYPOGRAPHY",
  },
  {
    number: "05",
    title: "Campaign Graphics",
    description:
      "Consistent visual systems for campaigns, promotions and digital communication.",
    tag: "CAMPAIGNS",
  },
];

const process = [
  {
    number: "01",
    title: "Discover",
    description:
      "We understand your brand, audience, objectives and creative direction.",
  },
  {
    number: "02",
    title: "Explore",
    description:
      "We research, experiment with concepts and develop visual possibilities.",
  },
  {
    number: "03",
    title: "Create",
    description:
      "We turn the selected direction into a thoughtful and distinctive design.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "We refine the details and prepare the final designs for use.",
  },
];

function GraphicDesignPage() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const elements = root.querySelectorAll<HTMLElement>(".gd-reveal");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => {
        element.classList.add("gd-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("gd-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="gd-page" ref={pageRef}>
      {/* NAVIGATION */}
      <header className="gd-nav">
        <Link to="/" className="gd-logo" aria-label="Tarka home">
          TARKA<span>®</span>
        </Link>

        <span className="gd-nav-label">
          GRAPHIC DESIGN STUDIO
        </span>

        <Link
          to="/quote?domain=graphic-design"
          className="gd-nav-cta"
        >
          LET'S TALK <span>↗</span>
        </Link>
      </header>

      {/* PROJECTS-FIRST HERO */}
      <section className="gd-hero" id="gd-home">
        <div className="gd-hero-topline">
          <span>02 / 06 — CREATIVE DISCIPLINES</span>
          <span>INDEPENDENT VISUAL THINKING</span>
        </div>

        <div className="gd-hero-layout">
          <div className="gd-hero-copy">
            <p className="gd-eyebrow">
              TARKA® / GRAPHIC DESIGN
            </p>

            <h1>
              Graphic
              <br />
              <span>Design.</span>
            </h1>

            <p className="gd-hero-description">
              Ideas made visible. We create expressive visual
              identities, thoughtful compositions and designs
              that make people stop and look.
            </p>

            <a href="#gd-selected-work" className="gd-explore-link">
              EXPLORE SELECTED WORK <span>↘</span>
            </a>
          </div>

          <div className="gd-poster-exhibition">
            <div className="gd-exhibition-heading">
              <span>SELECTED POSTERS</span>
              <span>2024 — 2026</span>
            </div>

            <div className="gd-poster-arc">
              <svg
                className="gd-arc-guide"
                viewBox="0 0 700 570"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M35 530 C80 350 185 250 340 175 C480 108 565 65 670 12"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 8"
                  opacity=".2"
                />
              </svg>

              {posters.map((poster, index) => (
                <article
                  className={`gd-arc-poster gd-arc-poster-${index + 1} ${poster.style}`}
                  key={poster.id}
                  aria-label={`${poster.name}, ${poster.category}`}
                >
                  <div className="gd-poster-grain" />

                  <div className="gd-poster-top">
                    <span>TARKA®</span>
                    <span>{poster.id}</span>
                  </div>

                  <div className="gd-poster-artwork">
                    {index === 0 && (
                      <div className="gd-art-shape gd-art-shape-one" />
                    )}
                    {index === 1 && (
                      <div className="gd-art-shape gd-art-shape-two" />
                    )}
                    {index === 2 && (
                      <div className="gd-art-shape gd-art-shape-three" />
                    )}
                    {index === 3 && (
                      <div className="gd-art-shape gd-art-shape-four" />
                    )}
                    {index === 4 && (
                      <div className="gd-art-shape gd-art-shape-five" />
                    )}
                    {index === 5 && (
                      <div className="gd-art-shape gd-art-shape-six" />
                    )}
                    {index === 6 && (
                      <div className="gd-art-shape gd-art-shape-seven" />
                    )}

                    <strong>
                      {poster.artwork.split("\n").map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </strong>
                  </div>

                  <div className="gd-poster-bottom">
                    <span>{poster.subtitle}</span>
                    <span>GD / {poster.id}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="gd-exhibition-footer">
              <span>AN EXPLORATION OF VISUAL LANGUAGE</span>
              <span>SCROLL TO DISCOVER ↓</span>
            </div>
          </div>
        </div>

        <div className="gd-hero-bottomline">
          <span>VISUAL STORIES. DISTINCTIVE IDEAS.</span>
          <span>SHAPED WITH PURPOSE.</span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="gd-intro gd-section" id="gd-intro">
        <div className="gd-section-label gd-reveal">
          <span>01 / OUR APPROACH</span>
          <span>DESIGN WITH INTENTION</span>
        </div>

        <div className="gd-intro-content">
          <h2 className="gd-reveal">
            Good design gets noticed.
            <span> Great design gets remembered.</span>
          </h2>

          <div className="gd-intro-description gd-reveal">
            <span className="gd-plus">✳</span>
            <p>
              We believe graphic design is more than making things
              look attractive. It is about communicating ideas,
              building recognition and creating meaningful
              connections through visual language.
            </p>
            <p>
              From the smallest detail to the complete visual
              identity, every element has a purpose.
            </p>
          </div>
        </div>

        <div className="gd-intro-stats gd-reveal">
          <div>
            <strong>01</strong>
            <span>THINK STRATEGICALLY</span>
          </div>
          <div>
            <strong>02</strong>
            <span>DESIGN EXPRESSIVELY</span>
          </div>
          <div>
            <strong>03</strong>
            <span>COMMUNICATE CLEARLY</span>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="gd-services gd-section" id="gd-services">
        <div className="gd-section-label gd-reveal">
          <span>02 / WHAT WE DO</span>
          <span>OUR CAPABILITIES</span>
        </div>

        <div className="gd-services-heading gd-reveal">
          <h2>
            Visual thinking.
            <br />
            <span>Creative execution.</span>
          </h2>
          <p>
            From brand foundations to the final printed detail,
            we bring ideas to life through considered design.
          </p>
        </div>

        <div className="gd-service-list">
          {services.map((service) => (
            <article className="gd-service gd-reveal" key={service.number}>
              <span className="gd-service-number">
                {service.number}
              </span>

              <div className="gd-service-main">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>

              <span className="gd-service-tag">
                {service.tag}
              </span>

              <span className="gd-service-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      {/* SELECTED WORK */}
      <section
        className="gd-work gd-section"
        id="gd-selected-work"
      >
        <div className="gd-section-label gd-reveal">
          <span>03 / SELECTED WORK</span>
          <span>A CLOSER LOOK</span>
        </div>

        <div className="gd-work-heading gd-reveal">
          <h2>
            Made to be
            <br />
            <span>seen differently.</span>
          </h2>
          <p>
            A selection of visual explorations across identity,
            typography, print and creative direction.
          </p>
        </div>

        <div className="gd-project-grid">
          {posters.slice(0, 6).map((poster, index) => (
            <article
              className={`gd-project gd-project-${index + 1} gd-reveal`}
              key={poster.id}
            >
              <div className={`gd-project-art ${poster.style}`}>
                <span className="gd-project-index">
                  {poster.id} / SELECTED WORK
                </span>

                <div className="gd-project-art-shape">
                  {index % 2 === 0 ? "✳" : "✦"}
                </div>

                <strong>
                  {poster.artwork.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </strong>

                <span className="gd-project-art-caption">
                  {poster.subtitle}
                </span>
              </div>

              <div className="gd-project-info">
                <div>
                  <h3>{poster.name}</h3>
                  <p>{poster.category}</p>
                </div>
                <span>↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* DESIGN STATEMENT */}
      <section className="gd-statement">
        <div className="gd-statement-inner gd-reveal">
          <span>OUR DESIGN PHILOSOPHY / 04</span>

          <h2>
            DON'T JUST
            <br />
            <span>MAKE IT LOOK.</span>
            <br />
            MAKE IT MEAN.
          </h2>

          <p>
            Every colour, shape and letter has a story to tell.
          </p>
        </div>

        <div className="gd-statement-symbol" aria-hidden="true">
          ✳
        </div>
      </section>

      {/* PROCESS */}
      <section className="gd-process gd-section" id="gd-process">
        <div className="gd-section-label gd-reveal">
          <span>05 / HOW WE WORK</span>
          <span>OUR PROCESS</span>
        </div>

        <div className="gd-process-heading gd-reveal">
          <h2>
            From first thought
            <br />
            <span>to final form.</span>
          </h2>
        </div>

        <div className="gd-process-grid">
          {process.map((step) => (
            <article className="gd-process-card gd-reveal" key={step.number}>
              <div className="gd-process-card-top">
                <span>{step.number}</span>
                <span>↗</span>
              </div>

              <div className="gd-process-line" />

              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gd-cta">
        <div className="gd-cta-content gd-reveal">
          <span>06 / HAVE AN IDEA?</span>

          <h2>
            Let's make
            <br />
            <span>something matter.</span>
          </h2>

          <p>
            Have a brand, a concept or an idea waiting to take shape?
            Let's give it a visual identity.
          </p>

          <Link to="/quote?domain=graphic-design">
            START A PROJECT <span>↗</span>
          </Link>
        </div>

        <div className="gd-cta-decoration" aria-hidden="true">
          <span>G</span>
          <span>D</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="gd-footer">
        <Link to="/" className="gd-footer-logo">
          TARKA®
        </Link>

        <span>GRAPHIC DESIGN / VISUAL COMMUNICATION</span>

        <a href="#gd-home">BACK TO TOP ↑</a>

        <span className="gd-footer-copy">
          © 2026 TARKA. ALL RIGHTS RESERVED.
        </span>
      </footer>
    </main>
  );
}

export default GraphicDesignPage;