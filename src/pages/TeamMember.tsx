import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import TeamNav from "../components/TeamNav";
import team from "../data/team";
import "../styles/team.css";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d },
});

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

export default function TeamMember() {
  const { id } = useParams<{ id: string }>();
  const m = team.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!m) {
    return (
      <div className="pf-page">
        <TeamNav />
        <p>Member not found.</p>
        <Link to="/team" className="pf-back">
          ← Back to team
        </Link>
      </div>
    );
  }

  return (
    <div className="pf-page">
      <TeamNav />
      <Link to="/team" className="pf-back">
        ← Back to team
      </Link>

      <div className="pf-hero">
        <motion.div {...fade()} className="pf-photo-wrap">
          <span className="team-initials">{initials(m.name)}</span>
          <img
            src={m.photo}
            alt={m.name}
            className="pf-photo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </motion.div>

        <div>
          <motion.span {...fade(0.1)} className="team-label">
            {m.role}
          </motion.span>
          <motion.h1 {...fade(0.2)}>{m.name}</motion.h1>
          <motion.p {...fade(0.3)} className="pf-bio">
            {m.bio}
          </motion.p>
          <motion.div {...fade(0.4)} className="pf-chips">
            {m.skills.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </motion.div>
          <motion.div {...fade(0.5)} className="pf-links">
            {Object.entries(m.socials).map(([k, v]) => (
              <a
                key={k}
                href={k === "email" ? `mailto:${v}` : v}
                target="_blank"
                rel="noreferrer"
              >
                {k}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      <h2 className="pf-title">Selected work</h2>
      <div className="pf-grid">
        {m.projects.map((p, i) => (
          <motion.a
            key={p.title}
            href={p.link}
            className="pf-project"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="pf-chips">
              {p.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
