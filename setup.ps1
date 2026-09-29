# Run from your project root (where package.json is)
# Usage: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "Creating folders..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "src\components" | Out-Null
New-Item -ItemType Directory -Force -Path "src\data" | Out-Null
New-Item -ItemType Directory -Force -Path "src\hooks" | Out-Null

Write-Host "Removing default index.css..." -ForegroundColor Cyan
Remove-Item -Path "src\index.css" -ErrorAction SilentlyContinue

Write-Host "Installing gsap..." -ForegroundColor Cyan
npm install gsap

Write-Host "Writing src/data/domains.ts..." -ForegroundColor Cyan
@'
export interface Domain {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  imageTeaser: string;
  imageLarge: string;
  alt: string;
}

export const domains: Domain[] = [
  {
    id: "product-design",
    number: "01",
    title: "Product Design",
    category: "PRODUCT",
    description:
      "We turn ideas into tangible products — from first sketch to the object someone holds in their hand.",
    imageTeaser:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=700&q=80&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1600&q=80&auto=format&fit=crop",
    alt: "A minimal industrial product prototype resting on a studio table",
  },
  {
    id: "graphic-design",
    number: "02",
    title: "Graphic Design",
    category: "IDENTITY",
    description:
      "We create visual identities that communicate — marks, systems and print that hold their shape everywhere.",
    imageTeaser:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&q=80&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80&auto=format&fit=crop",
    alt: "Printed brand collateral and colour swatches arranged on a desk",
  },
  {
    id: "uiux-web",
    number: "03",
    title: "UI/UX & Web Development",
    category: "DIGITAL",
    description:
      "We design digital experiences people enjoy using — interfaces built with the same care as the code behind them.",
    imageTeaser:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=700&q=80&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600&q=80&auto=format&fit=crop",
    alt: "A UI layout with wireframes and colour palettes displayed on a screen",
  },
  {
    id: "marketing",
    number: "04",
    title: "Marketing",
    category: "REACH",
    description:
      "We make ideas reach the people who matter — campaigns built around a clear, singular message.",
    imageTeaser:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=700&q=80&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&q=80&auto=format&fit=crop",
    alt: "A campaign storyboard and printed materials spread across a table",
  },
];
'@ | Set-Content -Path "src\data\domains.ts" -Encoding utf8

Write-Host "Writing src/hooks/useReducedMotion.ts..." -ForegroundColor Cyan
@'
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches);

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
'@ | Set-Content -Path "src\hooks\useReducedMotion.ts" -Encoding utf8

Write-Host "Writing src/components/Hero.tsx..." -ForegroundColor Cyan
@'
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Domain } from "../data/domains";

interface HeroProps {
  domains: Domain[];
  reducedMotion: boolean;
  onSelectDomain: (index: number) => void;
}

function Hero({ domains, reducedMotion, onSelectDomain }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const teaserRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    if (!hero || !title) return;

    const ctx = gsap.context(() => {
      const teasers = teaserRefs.current.filter(Boolean) as HTMLButtonElement[];

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro.fromTo(
        title,
        { opacity: 0, y: 90, letterSpacing: "0.2em" },
        { opacity: 1, y: 0, letterSpacing: "-0.02em", duration: 1.3 }
      );

      intro.fromTo(
        ".hero-eyebrow, .hero-counter",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
        "-=1"
      );

      intro.fromTo(
        teasers,
        { opacity: 0, y: 40, clipPath: "inset(100% 0% 0% 0%)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          stagger: 0.12,
        },
        "-=0.75"
      );

      intro.fromTo(
        ".scroll-cue",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.3"
      );

      if (reducedMotion) return;

      teasers.forEach((teaser, index) => {
        gsap.to(teaser, {
          y: index % 2 === 0 ? -10 : 10,
          duration: 3 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.6 + index * 0.15,
        });
      });

      if (!window.matchMedia("(pointer: coarse)").matches) {
        const handleMouseMove = (event: MouseEvent) => {
          const rect = hero.getBoundingClientRect();
          const mouseX = (event.clientX - rect.left - rect.width / 2) / rect.width;
          const mouseY = (event.clientY - rect.top - rect.height / 2) / rect.height;

          gsap.to(title, {
            x: mouseX * 16,
            y: mouseY * 10,
            duration: 0.9,
            ease: "power3.out",
          });

          teasers.forEach((teaser, index) => {
            const depth = (index + 1) * 10;
            gsap.to(teaser, {
              x: mouseX * depth,
              y: mouseY * depth,
              duration: 1,
              ease: "power3.out",
            });
          });
        };

        hero.addEventListener("mousemove", handleMouseMove);
        return () => hero.removeEventListener("mousemove", handleMouseMove);
      }
    }, hero);

    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollToFirstDomain = () => onSelectDomain(0);

  return (
    <section ref={heroRef} className="hero-section">
      <div className="grain" aria-hidden="true" />

      <div className="hero-top">
        <span className="hero-eyebrow">Tarka Design Studio</span>
        <span className="hero-counter">04 Domains</span>
      </div>

      <h1 ref={titleRef} className="hero-title">
        Domains
      </h1>

      <div className="hero-teasers">
        {domains.map((domain, index) => (
          <button
            key={domain.id}
            type="button"
            ref={(element) => {
              teaserRefs.current[index] = element;
            }}
            className={`hero-teaser hero-teaser-${index + 1}`}
            onClick={() => onSelectDomain(index)}
            aria-label={`Jump to ${domain.title}`}
          >
            <img src={domain.imageTeaser} alt="" aria-hidden="true" loading="eager" />
            <span className="hero-teaser-label">
              {domain.number} — {domain.category}
            </span>
          </button>
        ))}
      </div>

      <button type="button" className="scroll-cue" onClick={scrollToFirstDomain}>
        <span>Scroll to explore</span>
        <span className="scroll-cue-line" aria-hidden="true" />
      </button>
    </section>
  );
}

export default Hero;
'@ | Set-Content -Path "src\components\Hero.tsx" -Encoding utf8

Write-Host "Writing src/components/DomainSection.tsx..." -ForegroundColor Cyan
@'
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Domain } from "../data/domains";

gsap.registerPlugin(ScrollTrigger);

interface DomainSectionProps {
  domain: Domain;
  index: number;
  total: number;
  reducedMotion: boolean;
  onActivate: (index: number) => void;
}

const DomainSection = forwardRef<HTMLElement, DomainSectionProps>(
  ({ domain, index, total, reducedMotion, onActivate }, forwardedRef) => {
    const sectionRef = useRef<HTMLElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const arrowRef = useRef<HTMLSpanElement>(null);

    useImperativeHandle(forwardedRef, () => sectionRef.current as HTMLElement);

    const isImageRight = index % 2 === 0;

    useEffect(() => {
      const section = sectionRef.current;
      const imageWrap = imageWrapRef.current;
      if (!section || !imageWrap) return;

      const ctx = gsap.context(() => {
        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        reveal
          .fromTo(
            imageWrap,
            { clipPath: isImageRight ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 }
          )
          .fromTo(
            section.querySelectorAll(".domain-reveal"),
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
            "-=0.7"
          );

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) onActivate(index);
          },
        });

        if (reducedMotion) return;

        gsap.fromTo(
          imageRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
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
    }, [index, isImageRight, reducedMotion, onActivate]);

    const handleEnter = () => {
      if (reducedMotion) return;
      gsap.to(imageRef.current, { scale: 1.06, duration: 0.6, ease: "power3.out" });
      gsap.to(arrowRef.current, { x: 6, y: -6, rotate: 45, duration: 0.4, ease: "power3.out" });
    };

    const handleLeave = () => {
      if (reducedMotion) return;
      gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: "power3.out" });
      gsap.to(arrowRef.current, { x: 0, y: 0, rotate: 0, duration: 0.4, ease: "power3.out" });
    };

    return (
      <article
        ref={sectionRef}
        id={`domain-${domain.number}`}
        className={`domain-row ${isImageRight ? "domain-row-right" : "domain-row-left"}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div className="domain-copy">
          <div className="domain-reveal domain-index">
            <span>{domain.number}</span>
            <span className="domain-index-total"> / {String(total).padStart(2, "0")}</span>
          </div>

          <h3 className="domain-reveal domain-title">{domain.title}</h3>

          <p className="domain-reveal domain-description">{domain.description}</p>

          <div className="domain-reveal domain-category">
            <span>{domain.category}</span>
            <span ref={arrowRef} className="domain-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
        </div>

        <div ref={imageWrapRef} className="domain-image-wrap">
          <img ref={imageRef} src={domain.imageLarge} alt={domain.alt} loading="lazy" />
        </div>
      </article>
    );
  }
);

DomainSection.displayName = "DomainSection";

export default DomainSection;
'@ | Set-Content -Path "src\components\DomainSection.tsx" -Encoding utf8

Write-Host "Writing src/App.tsx..." -ForegroundColor Cyan
@'
import { useCallback, useRef } from "react";
import Hero from "./components/Hero";
import DomainSection from "./components/DomainSection";
import { domains } from "./data/domains";
import { useReducedMotion } from "./hooks/useReducedMotion";
import "./App.css";

function App() {
  const reducedMotion = useReducedMotion();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const scrollToDomain = useCallback(
    (index: number) => {
      sectionRefs.current[index]?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [reducedMotion]
  );

  const handleActivate = useCallback((index: number) => {
    if (indicatorRef.current) {
      indicatorRef.current.textContent = `${domains[index].number} / ${String(
        domains.length
      ).padStart(2, "0")}`;
    }
  }, []);

  return (
    <main>
      <Hero domains={domains} reducedMotion={reducedMotion} onSelectDomain={scrollToDomain} />

      <section className="domains-section" aria-label="Our domains">
        <div className="domains-intro">
          <p className="domains-eyebrow">What we do</p>
          <h2>
            Four domains.
            <br />
            One creative studio.
          </h2>
        </div>

        <div className="domain-list">
          {domains.map((domain, index) => (
            <DomainSection
              key={domain.id}
              ref={(element) => {
                sectionRefs.current[index] = element;
              }}
              domain={domain}
              index={index}
              total={domains.length}
              reducedMotion={reducedMotion}
              onActivate={handleActivate}
            />
          ))}
        </div>
      </section>

      <div className="progress-indicator" aria-hidden="true">
        <span ref={indicatorRef}>01 / {String(domains.length).padStart(2, "0")}</span>
      </div>
    </main>
  );
}

export default App;
'@ | Set-Content -Path "src\App.tsx" -Encoding utf8

Write-Host "Writing src/main.tsx..." -ForegroundColor Cyan
@'
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
'@ | Set-Content -Path "src\main.tsx" -Encoding utf8

Write-Host "Writing src/App.css..." -ForegroundColor Cyan
@'
:root {
  --paper: #eeede7;
  --paper-deep: #e3e1d8;
  --ink: #151510;
  --ink-soft: #55554c;
  --ink-faint: #8b897d;
  --line: #cfccc0;

  --font-serif: "Fraunces", "Iowan Old Style", Georgia, serif;
  --font-sans: "Space Grotesk", "Helvetica Neue", Arial, sans-serif;

  --edge: clamp(24px, 6vw, 88px);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

main {
  overflow-x: clip;
}

img {
  display: block;
  max-width: 100%;
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 4px;
}

.hero-section {
  position: relative;
  min-height: 100svh;
  padding: clamp(20px, 4vw, 40px) var(--edge) clamp(48px, 8vw, 96px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.grain {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

.hero-top {
  position: absolute;
  top: clamp(20px, 4vw, 40px);
  left: var(--edge);
  right: var(--edge);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.hero-eyebrow,
.hero-counter {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.hero-title {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(4.2rem, 15vw, 11.5rem);
  line-height: 0.86;
  letter-spacing: -0.02em;
  margin: 0;
  max-width: 100%;
}

.hero-teasers {
  position: relative;
  margin-top: clamp(32px, 6vw, 56px);
  height: clamp(220px, 32vw, 360px);
}

.hero-teaser {
  position: absolute;
  display: block;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 18px 40px -20px rgba(21, 21, 16, 0.35);
  transition: transform 0.35s ease;
}

.hero-teaser:hover,
.hero-teaser:focus-visible {
  transform: translateY(-4px);
}

.hero-teaser img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-teaser-label {
  position: absolute;
  left: 12px;
  bottom: 12px;
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--paper);
  background: rgba(21, 21, 16, 0.55);
  padding: 5px 9px;
}

.hero-teaser-1 {
  width: clamp(140px, 18vw, 230px);
  height: clamp(180px, 22vw, 280px);
  left: 2%;
  top: 6%;
}

.hero-teaser-2 {
  width: clamp(120px, 15vw, 190px);
  height: clamp(150px, 18vw, 230px);
  left: 26%;
  top: 32%;
}

.hero-teaser-3 {
  width: clamp(150px, 19vw, 240px);
  height: clamp(190px, 23vw, 290px);
  right: 20%;
  top: 2%;
}

.hero-teaser-4 {
  width: clamp(130px, 16vw, 200px);
  height: clamp(160px, 19vw, 240px);
  right: 2%;
  top: 30%;
}

.scroll-cue {
  position: absolute;
  bottom: clamp(24px, 5vw, 48px);
  left: var(--edge);
  display: flex;
  align-items: center;
  gap: 10px;
}

.scroll-cue span:first-child {
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.scroll-cue-line {
  width: 40px;
  height: 1px;
  background: var(--ink-soft);
  position: relative;
  overflow: hidden;
}

.scroll-cue-line::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--ink);
  transform: translateX(-100%);
  animation: cue-sweep 2.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue-line::after {
    animation: none;
    transform: translateX(0);
  }
}

@keyframes cue-sweep {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

.domains-section {
  padding: clamp(64px, 10vw, 140px) var(--edge) clamp(80px, 12vw, 160px);
  border-top: 1px solid var(--line);
}

.domains-intro {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  margin-bottom: clamp(56px, 9vw, 120px);
}

.domains-eyebrow {
  grid-column: 1 / span 3;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin: 0.3em 0 0;
}

.domains-intro h2 {
  grid-column: 4 / span 7;
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(2.4rem, 5.4vw, 4.4rem);
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin: 0;
}

.domain-list {
  display: flex;
  flex-direction: column;
  gap: clamp(56px, 9vw, 120px);
}

.domain-row {
  display: grid;
  grid-template-columns: minmax(260px, 34%) 1fr;
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
  padding-top: clamp(40px, 6vw, 72px);
  border-top: 1px solid var(--line);
}

.domain-row-left .domain-image-wrap {
  order: -1;
}

.domain-copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.domain-index {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  color: var(--ink-faint);
}

.domain-index-total {
  font-size: 0.85rem;
}

.domain-title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin: 0;
}

.domain-description {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--ink-soft);
  max-width: 34ch;
  margin: 0;
}

.domain-category {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.domain-category span:first-child {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.domain-arrow {
  display: inline-block;
  font-size: 1rem;
  color: var(--ink);
}

.domain-image-wrap {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--paper-deep);
}

.domain-row:nth-child(3n + 2) .domain-image-wrap {
  aspect-ratio: 16 / 10;
}

.domain-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

.progress-indicator {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: var(--ink-soft);
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 6px 10px;
  display: none;
}

@media (min-width: 1024px) {
  .progress-indicator {
    display: block;
  }
}

@media (max-width: 900px) {
  .hero-top {
    position: static;
    margin-bottom: 28px;
  }

  .hero-section {
    padding-top: clamp(28px, 6vw, 40px);
  }

  .hero-teasers {
    height: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .hero-teaser {
    position: static;
    width: 100% !important;
    height: 42vw !important;
    max-height: 220px;
  }

  .domains-intro {
    display: block;
  }

  .domains-eyebrow {
    margin-bottom: 12px;
  }

  .domain-row,
  .domain-row-left .domain-image-wrap {
    grid-template-columns: 1fr;
    order: 0;
  }

  .domain-row {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .domain-description {
    max-width: none;
  }
}
'@ | Set-Content -Path "src\App.css" -Encoding utf8

Write-Host "" 
Write-Host "All files written successfully." -ForegroundColor Green
Write-Host "Now run: npm run dev" -ForegroundColor Yellow