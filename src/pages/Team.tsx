import { useRef, useState, useLayoutEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Link } from "react-router-dom";
import TeamNav from "../components/TeamNav";
import team from "../data/team";
import "../styles/team.css";

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const reduceMotion = useReducedMotion();

  // How far the track must travel sideways to reveal the last card
  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDist(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };

    measure();
    window.addEventListener("resize", measure);

    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spring-smoothed progress gives the premium, eased feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });
  const progress = reduceMotion ? scrollYProgress : smoothProgress;

  const x = useTransform(progress, [0, 1], [0, -dist]);

  return (
    <section
      ref={sectionRef}
      className="team-section"
      style={{ height: `calc(100vh + ${dist}px)` }}
    >
      <TeamNav />

      <div className="team-sticky">
        <div className="team-head">
          <span className="team-label">Tarka / The people</span>
          <h1>Our team</h1>
          <p>Scroll to meet us. Click a photo to see the portfolio.</p>
        </div>

        <motion.div ref={trackRef} className="team-track" style={{ x }}>
          {team.map((m, i) => (
            <Link to={`/team/${m.id}`} key={m.id} className="team-card-link">
              <motion.div
                className="team-card"
                whileHover={{ y: -12 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="team-initials">{initials(m.name)}</span>
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="team-num">0{i + 1}</span>
                <div className="team-info">
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                </div>
                <span className="team-arrow">View portfolio ↗</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <div className="team-progress">
          <motion.div
            className="team-progress-bar"
            style={{ scaleX: progress }}
          />
        </div>
      </div>
    </section>
  );
}
