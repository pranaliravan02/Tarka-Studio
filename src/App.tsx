import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DomainPage from "./pages/DomainPage";
import QuotePage from "./pages/QuotePage";
import Team from "./pages/Team";
import TeamMember from "./pages/TeamMember";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/product"
          element={<DomainPage domainId="product-design" />}
        />

        <Route
          path="/identity"
          element={<DomainPage domainId="graphic-design" />}
        />

        <Route path="/digital" element={<DomainPage domainId="uiux-web" />} />

        <Route path="/reach" element={<DomainPage domainId="marketing" />} />

        <Route
          path="/video"
          element={<DomainPage domainId="video-generation" />}
        />

        <Route path="/quote" element={<QuotePage />} />

        <Route path="/team" element={<Team />} />
        <Route path="/team/:id" element={<TeamMember />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
