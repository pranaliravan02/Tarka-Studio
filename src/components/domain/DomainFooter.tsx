
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

import { tarkaContact } from "../../data/services";
import { useReducedMotion } from "../../hooks/useReducedMotion";

function DomainFooter() {
  const reducedMotion = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!footerRef.current || reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".domain-footer__animate",
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, footerRef);

    return () => context.revert();
  }, [reducedMotion]);

  const handleLogoEnter = () => {
    if (reducedMotion || !logoRef.current) {
      return;
    }

    gsap.to(logoRef.current, {
      letterSpacing: "0.18em",
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const handleLogoLeave = () => {
    if (reducedMotion || !logoRef.current) {
      return;
    }

    gsap.to(logoRef.current, {
      letterSpacing: "0.08em",
      duration: 0.55,
      ease: "power3.out",
    });
  };

  return (
    <footer ref={footerRef} className="domain-footer">
      <div className="domain-footer__main">
        <Link
          ref={logoRef}
          to="/"
          className="domain-footer__logo domain-footer__animate"
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
        >
          TARKA
        </Link>

        <p className="domain-footer__statement domain-footer__animate">
          Design that thinks
          <br />
          before it looks.
        </p>

        <Link
          to="/quote"
          className="domain-footer__quote domain-footer__animate"
        >
          <span>Start a project</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="domain-footer__bottom">
        <div className="domain-footer__contact domain-footer__animate">
          <a href={`mailto:${tarkaContact.email}`}>
            {tarkaContact.email}
          </a>

          <a href={`tel:${tarkaContact.phone}`}>
            {tarkaContact.phone}
          </a>

          <span>{tarkaContact.address}</span>
        </div>

        <div className="domain-footer__meta domain-footer__animate">
          <span>TARKA DESIGN STUDIO</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

export default DomainFooter;
