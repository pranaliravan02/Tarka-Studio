import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DomainPage from "./pages/DomainPage";
import QuotePage from "./pages/QuotePage";

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

        <Route
          path="/digital"
          element={<DomainPage domainId="uiux-web" />}
        />

        <Route
          path="/reach"
          element={<DomainPage domainId="marketing" />}
        />

        <Route
          path="/video"
          element={<DomainPage domainId="video-generation" />}
        />

        <Route path="/quote" element={<QuotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;