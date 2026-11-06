
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./PhotographyPage.css";

gsap.registerPlugin(ScrollTrigger);

type PhotographyProject = {
  id: number;
  title: string;
  category: string;
  description: string;
  cover: string;
  images: string[];
  year: string;
};

const demoPhotographyProjects: PhotographyProject[] = [
  {
    id: 1,
    title: "The Art of Form",
    category: "Product",
    description:
      "A refined product photography series focused on form, material, light and detail.",
    cover:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=85",
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=1400&q=85",
    ],
    year: "2026",
  },
  {
    id: 2,
    title: "Golden Hour Stories",
    category: "Lifestyle",
    description:
      "Warm, expressive lifestyle imagery capturing authentic moments and atmosphere.",
    cover:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1400&q=85",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&q=85",
    ],
    year: "2026",
  },
  {
    id: 3,
    title: "Objects in Focus",
    category: "Product",
    description:
      "A minimal visual study of everyday objects through controlled studio lighting.",
    cover:
      "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=1400&q=85",
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1400&q=85",
    ],
    year: "2026",
  },
  {
    id: 4,
    title: "The Editorial Edit",
    category: "Editorial",
    description:
      "An editorial photography direction built around character, composition and mood.",
    cover:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400&q=85",
    ],
    year: "2026",
  },
  {
    id: 5,
    title: "Faces & Stories",
    category: "Portrait",
    description:
      "Character-led portraiture that communicates personality through natural expression.",
    cover:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1400&q=85",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1400&q=85",
    ],
    year: "2026",
  },
  {
    id: 6,
    title: "Beyond the Ordinary",
    category: "Campaign",
    description:
      "Bold campaign imagery designed to make a brand's visual message memorable.",
    cover:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1400&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=85",
    ],
    year: "2026",
  },
];

const filters = [
  "All",
  "Product",
  "Lifestyle",
  "Editorial",
  "Portrait",
  "Campaign",
];

const services = [
  {
    number: "01",
    title: "Product Photography",
    description:
      "Thoughtfully composed product imagery that highlights details, materials and personality.",
  },
  {
    number: "02",
    title: "Brand & Lifestyle",
    description:
      "Authentic visual stories that bring a brand's identity, values and world to life.",
  },
  {
    number: "03",
    title: "Campaign & Editorial",
    description:
      "Distinctive campaign visuals with a strong creative direction and visual narrative.",
  },
  {
    number: "04",
    title: "Portrait Photography",
    description:
      "Expressive portraits that capture people, character and individuality.",
  },
];

const process = [
  {
    number: "01",
    title: "Discover",
    description:
      "We understand your brand, audience, objectives and the story you want to tell.",
  },
  {
    number: "02",
    title: "Art Direct",
    description:
      "We develop the visual direction, mood, composition and creative approach.",
  },
  {
    number: "03",
    title: "Capture",
    description:
      "We bring the concept to life through thoughtful photography and execution.",
  },
  {
    number: "04",
    title: "Refine",
    description:
      "We carefully select and refine the final images for a consistent visual result.",
  },
];

function PhotographyPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] =
    useState<PhotographyProject | null>(null);

  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") return demoPhotographyProjects;

    return demoPhotographyProjects.filter(
      (project) => project.category === activeFilter
    );
  }, [activeFilter]);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from(".photo-hero-label", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".photo-hero-title span", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.15,
      });

      gsap.from(".photo-hero-image", {
        scale: 1.12,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.25,
      });

      gsap.utils.toArray<HTMLElement>(".photo-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".photo-service-row").forEach((row) => {
        gsap.from(row, {
          x: -35,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            once: true,
          },
        });
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <main className="photography-page" ref={pageRef}>
      {/* HERO */}
      <section className="photo-hero">
        <div className="photo-hero-top">
          <span className="photo-hero-label">
            TARKA DOMAINS / 06 — PHOTOGRAPHY
          </span>
          <span className="photo-hero-label">VISUAL STORYTELLING</span>
        </div>

        <div className="photo-hero-heading">
          <h1 className="photo-hero-title">
            <span>BEYOND</span>
            <span className="photo-title-second">
              THE <em>FRAME.</em>
            </span>
          </h1>
          <p>
            We don't just take pictures.
            <br />
            We create images that make people feel something.
          </p>
        </div>

        <div className="photo-hero-image-wrap">
          <img
            className="photo-hero-image"
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=2000&q=90"
            alt="Photographer capturing a creative portrait"
          />
          <span className="photo-image-caption">
            THE ART OF SEEING DIFFERENTLY
          </span>
          <span className="photo-image-index">01 / 06</span>
        </div>

        <div className="photo-hero-bottom">
          <span>LIGHT. COMPOSITION. EMOTION.</span>
          <a href="#photo-intro">SCROLL TO EXPLORE ↓</a>
        </div>
      </section>

      {/* INTRO */}
      <section className="photo-intro section-padding" id="photo-intro">
        <div className="photo-section-label photo-reveal">
          <span>01 / OUR PERSPECTIVE</span>
          <span>EVERY IMAGE HAS A STORY</span>
        </div>

        <div className="photo-intro-content">
          <h2 className="photo-reveal">
            A moment lasts
            <br />
            <span>forever.</span>
            <br />
            Make it matter.
          </h2>

          <div className="photo-intro-side photo-reveal">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=85"
              alt="Camera ready for a photography session"
            />
            <p>
              From the smallest detail to the bigger picture, we create
              thoughtful imagery that gives brands a distinct visual voice.
              Every frame is intentional. Every detail has a purpose.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="photo-services section-padding">
        <div className="photo-section-label photo-reveal">
          <span>02 / WHAT WE DO</span>
          <span>OUR CAPABILITIES</span>
        </div>

        <div className="photo-services-heading photo-reveal">
          <h2>
            Different stories.
            <br />
            <span>One clear vision.</span>
          </h2>
          <p>
            Photography shaped around your purpose, audience and identity.
          </p>
        </div>

        <div className="photo-services-list">
          {services.map((service) => (
            <article className="photo-service-row" key={service.number}>
              <span className="photo-service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="photo-service-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="photo-work section-padding" id="photo-work">
        <div className="photo-section-label photo-reveal">
          <span>03 / SELECTED WORK</span>
          <span>DEMO PROJECTS — TEMPORARY CONTENT</span>
        </div>

        <div className="photo-work-heading photo-reveal">
          <h2>
            Seen through
            <br />
            <em>our lens.</em>
          </h2>
          <p>
            A selection of visual directions across products, people and
            campaigns.
          </p>
        </div>

        <div className="photo-gallery-toolbar">
          <div className="photo-filter-list" aria-label="Filter projects">
            {filters.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
          <span className="photo-project-count">
            {String(visibleProjects.length).padStart(2, "0")} PROJECTS
          </span>
        </div>

        <div className="photo-gallery-grid">
          {visibleProjects.map((project, index) => (
            <button
              className={`photo-project-card photo-project-card-${index % 3}`}
              key={project.id}
              onClick={() => setSelectedProject(project)}
              type="button"
              aria-label={`View ${project.title}`}
            >
              <div className="photo-project-image">
                <img src={project.cover} alt={project.title} loading="lazy" />
                <span className="photo-project-open">VIEW PROJECT ↗</span>
              </div>
              <div className="photo-project-info">
                <div>
                  <h3>{project.title}</h3>
                  <span>{project.category}</span>
                </div>
                <span>{project.year}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="photo-process section-padding">
        <div className="photo-section-label photo-reveal">
          <span>04 / HOW WE WORK</span>
          <span>FROM IDEA TO IMAGE</span>
        </div>

        <div className="photo-process-heading photo-reveal">
          <h2>
            Thoughtful
            <br />
            <span>by design.</span>
          </h2>
        </div>

        <div className="photo-process-grid">
          {process.map((step) => (
            <article className="photo-process-card photo-reveal" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="photo-cta section-padding">
        <span className="photo-cta-label">05 / LET'S CREATE</span>
        <h2>
          YOUR STORY.
          <br />
          <em>OUR LENS.</em>
        </h2>
        <p>
          Have a story worth capturing? Let's create something worth
          remembering.
        </p>
        <Link to="/quote" className="photo-cta-link">
          START A PROJECT <span>↗</span>
        </Link>
      </section>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div
          className="photo-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedProject(null)}
        >
          <section
            className="photo-project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="photo-modal-close"
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project"
            >
              ×
            </button>

            <span className="photo-modal-category">
              {selectedProject.category} / {selectedProject.year}
            </span>
            <h2>{selectedProject.title}</h2>
            <p>{selectedProject.description}</p>

            <div className="photo-modal-images">
              {selectedProject.images.map((image, index) => (
                <img
                  src={image}
                  alt={`${selectedProject.title} photograph ${index + 1}`}
                  key={image}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default PhotographyPage;
