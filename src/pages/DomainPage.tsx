
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { domains } from "../data/domains";
import { useReducedMotion } from "../hooks/useReducedMotion";

import "./DomainPage.css";

import DomainHero from "../components/domain/DomainHero";
import VideoGenerationHero from "../components/domain/VideoGenerationHero";
import DigitalHero from "../components/domain/DigitalHero";
import GraphicDesignPage from "../components/domain/GraphicDesignPage";
import MarketingAttentionTunnel from "../components/domain/MarketingAttentionTunnel";
import DomainIntro from "../components/domain/DomainIntro";
import DomainCapabilities from "../components/domain/DomainCapabilities";
import DomainWork from "../components/domain/DomainWork";
import DomainProcess from "../components/domain/DomainProcess";
import DomainCTA from "../components/domain/DomainCTA";
import DomainNavigation from "../components/domain/DomainNavigation";
import DomainFooter from "../components/domain/DomainFooter";

interface DomainPageProps {
  domainId: string;
}

const domainRoutes: Record<string, string> = {
  "product-design": "/product",
  "graphic-design": "/identity",
  "uiux-web": "/digital",
  marketing: "/reach",
  "video-generation": "/video",
  photography: "/photography",
};

function DomainPage({ domainId }: DomainPageProps) {
  const reducedMotion = useReducedMotion();

  // Find the current domain configuration.
  const domain = domains.find(
    (item) => item.id === domainId
  );

  // Scroll to the top whenever the domain changes.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [domainId]);

  // Handle invalid domain routes.
  if (!domain) {
    return (
      <main className="domain-not-found">
        <div className="domain-not-found__content">
          <span>404</span>

          <h1>Domain not found.</h1>

          <p>
            The page you're looking for doesn't exist.
          </p>

          <Link
            to="/"
            className="domain-not-found__link"
          >
            <span>Return to Tarka</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </main>
    );
  }

  // Graphic Design has its own complete standalone page.
  if (domain.id === "graphic-design") {
    return <GraphicDesignPage />;
  }

  // Find previous and next domains.
  const currentIndex = domains.findIndex(
    (item) => item.id === domain.id
  );

  const previousDomain =
    domains[
      (currentIndex - 1 + domains.length) % domains.length
    ];

  const nextDomain =
    domains[
      (currentIndex + 1) % domains.length
    ];

  // ==========================================
  // DOMAIN-SPECIFIC HERO
  // ==========================================

  const renderHero = () => {
    switch (domain.id) {
      case "uiux-web":
        return <DigitalHero domain={domain} />;

      case "video-generation":
        return (
          <VideoGenerationHero
            title={domain.title}
            description={domain.description}
          />
        );

      case "marketing":
        return <MarketingAttentionTunnel />;

      default:
        return <DomainHero domain={domain} />;
    }
  };

  // ==========================================
  // DOMAIN-SPECIFIC SELECTED WORK
  // ==========================================

  const renderWork = () => {
    return <DomainWork domainId={domain.id} />;
  };

  // ==========================================
  // SHARED DOMAIN PAGE LAYOUT
  // ==========================================

  return (
    <main
      className={`domain-page domain-page--${domain.id} ${
        reducedMotion
          ? "domain-page--reduced-motion"
          : ""
      }`}
    >
      {/* ======================================
          01. SHARED NAVIGATION
      ====================================== */}

      <header className="domain-page__nav">
        <Link
          to="/"
          className="domain-page__logo"
          aria-label="Tarka home"
        >
          TARKA
        </Link>

        <div className="domain-page__nav-center">
          <span>
            {domain.number} /{" "}
            {String(domains.length).padStart(2, "0")}
          </span>

          <span>
            {domain.category}
          </span>
        </div>

        <Link
          to={`/quote?domain=${domain.id}`}
          className="domain-page__quote-link"
        >
          <span>Get a Quote</span>

          <span aria-hidden="true">
            ↗
          </span>
        </Link>
      </header>

      {/* ======================================
          02. DOMAIN-SPECIFIC HERO
      ====================================== */}

      {renderHero()}

      {/* ======================================
          03. SHARED INTRODUCTION
          Marketing uses its cinematic hero as its introduction.
      ====================================== */}

      {domain.id !== "marketing" && (
        <DomainIntro domain={domain} />
      )}

      {/* ======================================
          04. DOMAIN CAPABILITIES
      ====================================== */}

      <DomainCapabilities
        domainId={domain.id}
      />

      {/* ======================================
          06. DOMAIN-SPECIFIC SELECTED WORK
      ====================================== */}

      {renderWork()}

      {/* ======================================
          07. SHARED PROCESS
      ====================================== */}

      <DomainProcess />

      {/* ======================================
          08. SHARED CALL TO ACTION
      ====================================== */}

      <DomainCTA domain={domain} />

      {/* ======================================
          09. SHARED DOMAIN NAVIGATION
      ====================================== */}

      <DomainNavigation
        previousDomain={previousDomain}
        nextDomain={nextDomain}
        getRoute={(id) => domainRoutes[id] ?? "/"}
      />

      {/* ======================================
          10. SHARED FOOTER
      ====================================== */}

      <DomainFooter />
    </main>
  );
}

export default DomainPage;
