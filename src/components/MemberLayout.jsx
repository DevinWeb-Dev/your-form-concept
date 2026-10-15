import {
  Link,
  NavLink,
  Outlet,
} from "react-router-dom";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  LayoutDashboard,
  ShieldCheck,
  Target,
} from "lucide-react";

import {
  useStudio,
} from "../context/StudioContext.jsx";

import {
  useTraining,
} from "../context/TrainingContext.jsx";

const MEMBER_NAV = [
  {
    path: "/member",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    path: "/member/planner",
    label: "Workout Planner",
    icon: Dumbbell,
  },
  {
    path: "/member/journal",
    label: "Workout Journal",
    icon: ClipboardList,
  },
  {
    path: "/member/progress",
    label: "Progress & Goals",
    icon: Activity,
  },
];

export default function MemberLayout() {
  const { membership } = useStudio();

  const { goals, stats } = useTraining();

  return (
    <div className="yf2-member">
      <section className="yf2-member-hero">
        <div className="yf-container yf2-member-hero-grid">
          <div>
            <span className="yf-eyebrow is-orange">
              YOUR FORM. / MEMBER EXPERIENCE
            </span>

            <h1>
              THE WORK.
              <br />
              <em>YOUR WAY.</em>
            </h1>

            <p>
              Build a routine, save training
              plans, and explore your progress
              through a thoughtfully designed
              member dashboard.
            </p>

            <div className="yf2-hero-links">
              <Link
                to="/member/planner"
                className="yf-button is-orange"
              >
                Build a Workout
                <ArrowUpRight size={18} />
              </Link>

              <Link
                to="/my-studio"
                className="yf2-hero-text-link"
              >
                View Class Reservations
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="yf2-member-hero-panel">
            <span className="yf2-hero-panel-label">
              THE WEEKLY TARGET
            </span>

            <div className="yf2-hero-panel-count">
              <strong>{stats.thisWeek}</strong>

              <span>
                / {goals.weeklySessions}
              </span>
            </div>

            <div className="yf2-hero-progress">
              <span
                style={{
                  width: `${stats.completion}%`,
                }}
              />
            </div>

            <p>
              {stats.goalReached
                ? "Illustrative weekly target reached."
                : `${stats.remaining} more logged ${
                    stats.remaining === 1
                      ? "session"
                      : "sessions"
                  } to reach your target.`}
            </p>

            <div className="yf2-hero-membership">
              <Target size={18} />

              <span>
                <small>MEMBERSHIP INTEREST</small>

                <strong>
                  {membership?.name ||
                    "NOT SELECTED"}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="yf2-member-navigation">
        <div className="yf-container yf2-member-navigation-inner">
          <div className="yf2-member-nav">
            {MEMBER_NAV.map(
              ({
                path,
                label,
                icon: Icon,
                end,
              }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={end}
                  className={({ isActive }) =>
                    isActive
                      ? "is-active"
                      : ""
                  }
                >
                  <Icon size={18} />

                  <span>{label}</span>
                </NavLink>
              )
            )}
          </div>

          <Link
            className="yf2-nav-book"
            to="/schedule"
          >
            <CalendarDays size={17} />
            Class Schedule
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="yf-container yf2-member-content">
        <Outlet />
      </div>

      <div className="yf-container">
        <div className="yf2-safety-note">
          <ShieldCheck size={21} />

          <p>
            Portfolio demonstration only.
            Workout routines are illustrative,
            not personalized exercise or medical
            advice. Training plans, goals, and
            journal entries are stored in this
            browser, not on a server.
          </p>
        </div>
      </div>

      <section className="yf2-member-bottom">
        <div className="yf-container yf2-member-bottom-grid">
          <div>
            <span className="yf-eyebrow is-orange">
              YOUR FORM. / KEEP BUILDING
            </span>

            <h2>
              ONE SESSION
              <br />
              <em>AT A TIME.</em>
            </h2>
          </div>

          <div>
            <p>
              Explore more studio experiences,
              compare memberships, or add
              fictional classes to your calendar.
            </p>

            <Link
              className="yf-button is-orange"
              to="/schedule"
            >
              Explore Class Schedule
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}