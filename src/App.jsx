import {
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  ArrowLeft,
  ClipboardList,
} from "lucide-react";

import SiteShell from "./components/SiteShell.jsx";

import MemberLayout from "./components/MemberLayout.jsx";

import StaffLayout from "./components/StaffLayout.jsx";

import ExperienceTools from "./components/ExperienceTools.jsx";

import {
  HomePage,
  ProgramsPage,
  MembershipsPage,
  CoachesPage,
  AboutPage,
} from "./pages/PublicPages.jsx";

import {
  SchedulePage,
  MyStudioPage,
} from "./pages/SchedulePages.jsx";

import {
  MemberDashboardPage,
  WorkoutPlannerPage,
  WorkoutJournalPage,
  ProgressPage,
} from "./pages/MemberPages.jsx";

import {
  StaffDashboardPage,
  StaffClassesPage,
  StaffCoachesPage,
  StaffMembersPage,
} from "./pages/StaffPages.jsx";

import {
  AnalyticsLayout,
  AnalyticsDashboardPage,
  MembershipIntelligencePage,
  CoachInsightsPage,
  ReportsPage,
} from "./pages/AnalyticsPages.jsx";

import DemoSettingsPage from "./pages/DemoSettingsPage.jsx";

// ==========================================
// PUBLIC SITE
// ==========================================

function PublicSiteLayout() {
  return (
    <>
      <SiteShell />

      <Link
        to="/staff"
        className="yf3-staff-shortcut"
        title="Open Staff Operations Demo"
      >
        <ClipboardList size={16} />

        STAFF DEMO
      </Link>
    </>
  );
}

// ==========================================
// NOT FOUND
// ==========================================

function NotFoundPage() {
  return (
    <section className="yf-not-found">
      <div className="yf-container">
        <span className="yf-eyebrow is-orange">
          404 / NO SUCH PATH
        </span>

        <h1>
          WRONG
          <br />
          <em>DIRECTION.</em>
        </h1>

        <p>
          This route isn't part of
          the YOUR FORM. studio.
        </p>

        <Link
          to="/"
          className="yf-button is-orange"
        >
          <ArrowLeft size={19} />

          Back to Homepage
        </Link>
      </div>
    </section>
  );
}

// ==========================================
// APP
// ==========================================

export default function App() {
  return (
    <>
      <ExperienceTools />

      <Routes>
        {/* ============================
            PUBLIC PAGES
            ============================ */}

        <Route
          path="/"
          element={<PublicSiteLayout />}
        >
          <Route
            index
            element={<HomePage />}
          />

          <Route
            path="programs"
            element={<ProgramsPage />}
          />

          <Route
            path="schedule"
            element={<SchedulePage />}
          />

          <Route
            path="memberships"
            element={<MembershipsPage />}
          />

          <Route
            path="coaches"
            element={<CoachesPage />}
          />

          <Route
            path="my-studio"
            element={<MyStudioPage />}
          />

          <Route
            path="about"
            element={<AboutPage />}
          />

          {/* MEMBER HUB */}

          <Route
            path="member"
            element={<MemberLayout />}
          >
            <Route
              index
              element={<MemberDashboardPage />}
            />

            <Route
              path="planner"
              element={<WorkoutPlannerPage />}
            />

            <Route
              path="journal"
              element={<WorkoutJournalPage />}
            />

            <Route
              path="progress"
              element={<ProgressPage />}
            />
          </Route>

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Route>

        {/* ============================
            STAFF OPERATIONS
            ============================ */}

        <Route
          path="/staff"
          element={<StaffLayout />}
        >
          <Route
            index
            element={<StaffDashboardPage />}
          />

          <Route
            path="classes"
            element={<StaffClassesPage />}
          />

          <Route
            path="coaches"
            element={<StaffCoachesPage />}
          />

          <Route
            path="members"
            element={<StaffMembersPage />}
          />

          {/* BUSINESS ANALYTICS */}

          <Route
            path="analytics"
            element={<AnalyticsLayout />}
          >
            <Route
              index
              element={
                <AnalyticsDashboardPage />
              }
            />

            <Route
              path="memberships"
              element={
                <MembershipIntelligencePage />
              }
            />

            <Route
              path="coaches"
              element={<CoachInsightsPage />}
            />

            <Route
              path="reports"
              element={<ReportsPage />}
            />
          </Route>

          {/* FINAL BATCH SETTINGS */}

          <Route
            path="settings"
            element={<DemoSettingsPage />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/staff"
                replace
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}