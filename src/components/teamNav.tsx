import { useNavigate } from "react-router-dom";

const labels = ["HOME", "WORK", "DOMAINS", "TEAM", "ABOUT", "CONTACT"];

const routes: Record<string, string> = {
  HOME: "/",
  WORK: "/product",
  DOMAINS: "/",
  TEAM: "/team",
  ABOUT: "/",
  CONTACT: "/quote",
};

export default function TeamNav({ active = "TEAM" }: { active?: string }) {
  const navigate = useNavigate();

  return (
    <header className="tn">
      <button
        type="button"
        className="tn-logo"
        onClick={() => navigate("/")}
        aria-label="Tarka home"
      >
        TARKA
      </button>

      <nav className="tn-links" aria-label="Primary navigation">
        {labels.map((label) => (
          <button
            key={label}
            type="button"
            className={label === active ? "tn-btn tn-active" : "tn-btn"}
            onClick={() => navigate(routes[label])}
          >
            {label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="tn-cta"
        onClick={() => navigate("/quote")}
      >
        Let's Talk <span aria-hidden="true">↗</span>
      </button>
    </header>
  );
}
