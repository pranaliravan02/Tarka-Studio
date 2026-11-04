import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import DomainSection from "../components/DomainSection";
import HomeCTA from "../components/HomeCTA";

import { domains } from "../data/domains";
import { useReducedMotion } from "../hooks/useReducedMotion";

// The existing home film animation is designed for five domains.
// Photography is available through its own page and domain navigation.
const homeDomains = domains.filter(
  (domain) => domain.id !== "photography"
);

function HomePage() {
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  const navigateToDomain = useCallback(
    (index: number) => {
      const routes: Record<string, string> = {
        "product-design": "/product",
        "graphic-design": "/identity",
        "uiux-web": "/digital",
        marketing: "/reach",
        "video-generation": "/video",
      };

      const domain = homeDomains[index];

      if (domain) {
        navigate(routes[domain.id]);
      }
    },
    [navigate]
  );

  return (
    <main>
      <Hero
        domains={homeDomains}
        reducedMotion={reducedMotion}
        onSelectDomain={navigateToDomain}
      />

      <DomainSection
        domains={homeDomains}
        reducedMotion={reducedMotion}
        onSelectDomain={navigateToDomain}
      />

      <HomeCTA reducedMotion={reducedMotion} />
    </main>
  );
}

export default HomePage;