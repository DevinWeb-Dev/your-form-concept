import React from "react";

import ReactDOM from "react-dom/client";

import {
  HashRouter,
} from "react-router-dom";

import App from "./App.jsx";

import {
  StudioProvider,
} from "./context/StudioContext.jsx";

import {
  TrainingProvider,
} from "./context/TrainingContext.jsx";

import {
  OperationsProvider,
} from "./context/OperationsContext.jsx";

// BATCH 1 — PUBLIC FITNESS WEBSITE
import "./styles/base.css";
import "./styles/site.css";

// BATCH 2 — MEMBER EXPERIENCE
import "./styles/member.css";

// BATCH 3 — STAFF OPERATIONS
import "./styles/operations.css";

// BATCH 4 — ANALYTICS
import "./styles/analytics.css";

// BATCH 5 — FINAL POLISH
import "./styles/final-polish.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <HashRouter>
      <StudioProvider>
        <TrainingProvider>
          <OperationsProvider>
            <App />
          </OperationsProvider>
        </TrainingProvider>
      </StudioProvider>
    </HashRouter>
  </React.StrictMode>
);