
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { domains } from "../data/domains";
import { useReducedMotion } from "../hooks/useReducedMotion";

import "./DomainPage.css";
import DomainHero from "../components/domain/DomainHero";
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

function DomainPage({ domainId }: DomainPageProps) {
  const reducedMotion = useReducedMotion();

  const domain = domains.find(
    (item) => item.id === domainId
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [domainId]);

  if (!domain) {
    return (
      <main className="domain-not-found">
        <div className="domain-not-found__content">
          <span>404</span>

          <h1>Domain not found.</h1>

          <p>
            The page you're looking for doesn't exist.
          </p>

          <Link to="/" className="domain-not-found__link">
            <span>Return to Tarka</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = domains.findIndex(
    (item) => item.id === domain.id
  );

  const previousDomain =
    domains[
      (currentIndex - 1 + domains.length) %
        domains.length
    ];

  const nextDomain =
    domains[
      (currentIndex + 1) % domains.length
    ];

  const getRoute = (id: string) => {
    const routes: Record<string, string> = {
      "product-design": "/product",
      "graphic-design": "/identity",
      "uiux-web": "/digital",
      marketing: "/reach",
    };

    return routes[id] ?? "/";
  };

  return (
    <main
      className={`domain-page domain-page--${domain.id} ${
        reducedMotion
          ? "domain-page--reduced-motion"
          : ""
      }`}
    >
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

          <span>{domain.category}</span>
        </div>

        <Link
          to={`/quote?domain=${domain.id}`}
          className="domain-page__quote-link"
        >
          <span>Get a Quote</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <DomainHero domain={domain} />

      <DomainIntro domain={domain} />

      <DomainCapabilities
        domainId={domain.id}
      />

      <DomainWork
        domainId={domain.id}
      />

      <DomainProcess />

      <DomainCTA domain={domain} />

      <DomainNavigation
        previousDomain={previousDomain}
        nextDomain={nextDomain}
        getRoute={getRoute}
      />

      <DomainFooter />
    </main>
  );
}

export default DomainPage;

