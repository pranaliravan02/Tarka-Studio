
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import DomainSection from "../components/DomainSection";
import HomeCTA from "../components/HomeCTA";

import { domains } from "../data/domains";
import { useReducedMotion } from "../hooks/useReducedMotion";

const DOMAIN_ROUTES: Record<string, string> = {
  "product-design": "/product",
  "graphic-design": "/identity",
  "uiux-web": "/digital",
  marketing: "/reach",
  "video-generation": "/video",
  photography: "/photography",
};

function HomePage() {
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  const navigateToDomain = useCallback(
    (index: number) => {
      const domain = domains[index];

      if (!domain) return;

      const route = DOMAIN_ROUTES[domain.id];

      if (route) {
        navigate(route);
      }
    },
    [navigate]
  );

  return (
    <main>
      <Hero
        domains={domains}
        reducedMotion={reducedMotion}
        onSelectDomain={navigateToDomain}
      />

      <DomainSection
        domains={domains}
        reducedMotion={reducedMotion}
        onSelectDomain={navigateToDomain}
      />

      <HomeCTA reducedMotion={reducedMotion} />
    </main>
  );
}

export default HomePage;
