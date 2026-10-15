import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Dumbbell,
  Menu,
  X,
} from "lucide-react";

import {
  BRAND,
} from "../data/studioData.js";

const NAVIGATION = [
  { label: "Home", path: "/" },
  { label: "Programs", path: "/programs" },
  { label: "Schedule", path: "/schedule" },
  { label: "Memberships", path: "/memberships" },
  { label: "Coaches", path: "/coaches" },
  { label: "Member Hub", path: "/member" },
];

const PAGE_TITLES = {
  "/": "Home",
  "/programs": "Training Programs",
  "/schedule": "Class Schedule",
  "/memberships": "Membership Plans",
  "/coaches": "The Coaches",
  "/my-studio": "My Studio",
  "/about": "About the Concept",

  "/member": "Member Dashboard",
  "/member/planner": "Workout Planner",
  "/member/journal": "Workout Journal",
  "/member/progress": "Progress and Goals",
};

function Logo() {
  return (
    <span className="yf-logo">
      <span className="yf-logo-mark">
        <Dumbbell
          size={24}
          strokeWidth={2.5}
        />
      </span>

      <span>
        YOUR FORM<span>.</span>
      </span>
    </span>
  );
}

export default function SiteShell() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    document.title = `${
      PAGE_TITLES[location.pathname] ||
      "YOUR FORM."
    } | YOUR FORM.`;
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    function onKey(event) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      onKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKey
      );
  }, [mobileOpen]);

  return (
    <div className="yf-app">
      <a
        href="#yf-main"
        className="yf-skip-link"
      >
        Skip to content
      </a>

      <div className="yf-topline">
        <span>
          THE WORK STARTS WITH YOU.
        </span>

        <span>
          PREMIUM FITNESS STUDIO CONCEPT
        </span>
      </div>

      <header className="yf-header">
        <div className="yf-container yf-header-inner">
          <Link
            to="/"
            aria-label="YOUR FORM. Homepage"
          >
            <Logo />
          </Link>

          <nav
            id="yf-navigation"
            aria-label="Main navigation"
            className={`yf-nav ${
              mobileOpen
                ? "is-open"
                : ""
            }`}
          >
            {NAVIGATION.map(
              (item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={
                    item.path === "/"
                  }
                  className={({
                    isActive,
                  }) =>
                    isActive
                      ? "is-active"
                      : ""
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="yf-header-actions">
            <Link
              className="yf-header-cta"
              to="/schedule"
            >
              Find Your Session
              <ArrowUpRight size={17} />
            </Link>

            <button
              type="button"
              className="yf-menu-toggle"
              aria-label={
                mobileOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="yf-navigation"
              onClick={() =>
                setMobileOpen(
                  (value) => !value
                )
              }
            >
              {mobileOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </header>

      <main
        id="yf-main"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <footer className="yf-footer">
        <div className="yf-footer-cta">
          <div className="yf-container">
            <span className="yf-eyebrow is-orange">
              THE NEXT CHAPTER STARTS HERE
            </span>

            <h2>
              SHOW UP.
              <br />
              <em>LEVEL UP.</em>
            </h2>

            <div className="yf-footer-cta-bottom">
              <p>
                Discover the programs,
                explore membership concepts,
                and organize fictional training
                sessions with the Member Hub.
              </p>

              <Link
                to="/member"
                className="yf-button is-orange"
              >
                Explore Member Hub
                <ArrowUpRight size={19} />
              </Link>
            </div>
          </div>
        </div>

        <div className="yf-container yf-footer-grid">
          <div className="yf-footer-brand">
            <Logo />

            <p>
              {BRAND.description}
            </p>

            <span>
              A FICTIONAL FITNESS STUDIO DEMONSTRATION.
            </span>
          </div>

          <div className="yf-footer-links">
            <strong>
              EXPLORE
            </strong>

            {NAVIGATION.map(
              (item) => (
                <Link
                  key={item.path}
                  to={item.path}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="yf-footer-links">
            <strong>
              MEMBER EXPERIENCE
            </strong>

            <Link to="/my-studio">
              My Studio / Class Reservations
            </Link>

            <Link to="/member/planner">
              Workout Planner
            </Link>

            <Link to="/member/journal">
              Workout Journal
            </Link>

            <Link to="/member/progress">
              Progress & Goals
            </Link>

            <Link to="/about">
              About This Concept
            </Link>

            <p>
              No real gym reservations,
              subscription activation,
              payments, or medical advice.
            </p>
          </div>
        </div>

        <div className="yf-container yf-footer-bottom">
          <span>
            © {new Date().getFullYear()}
            {" "}YOUR FORM.
          </span>

          <span>
            {BRAND.attribution}
          </span>

          <Link to="/">
            Back to top
            <ArrowRight size={15} />
          </Link>
        </div>
      </footer>
    </div>
  );
}