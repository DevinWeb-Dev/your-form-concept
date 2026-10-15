import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  ArrowUp,
} from "lucide-react";

const PAGE_TITLES = {
  "/": "Home",
  "/programs": "Training Programs",
  "/schedule": "Class Schedule",
  "/memberships": "Membership Plans",
  "/coaches": "Our Coaches",
  "/my-studio": "My Studio",
  "/about": "About",

  "/member": "Member Dashboard",
  "/member/planner": "Workout Planner",
  "/member/journal": "Workout Journal",
  "/member/progress": "Progress and Goals",

  "/staff": "Studio Command Center",
  "/staff/classes": "Class Operations",
  "/staff/coaches": "Coach Scheduling",
  "/staff/members": "Member Desk",

  "/staff/analytics": "Studio Analytics",
  "/staff/analytics/memberships":
    "Membership Intelligence",
  "/staff/analytics/coaches":
    "Coach Insights",
  "/staff/analytics/reports":
    "Reports Center",

  "/staff/settings": "Demo Settings",
};

export default function ExperienceTools() {
  const { pathname } = useLocation();

  const [showTop, setShowTop] =
    useState(false);

  const pageTitle =
    PAGE_TITLES[pathname] ||
    "Fitness Studio";

  useEffect(() => {
    document.title =
      `${pageTitle} | YOUR FORM.`;

    const frame =
      window.requestAnimationFrame(
        () => {
          window.scrollTo(0, 0);
        }
      );

    return () =>
      window.cancelAnimationFrame(
        frame
      );
  }, [pathname, pageTitle]);

  useEffect(() => {
    function handleScroll() {
      setShowTop(
        window.scrollY > 550
      );
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  function skipToMain() {
    const main =
      document.querySelector(
        ".yf3-main, main"
      );

    if (!main) {
      return;
    }

    main.setAttribute(
      "tabindex",
      "-1"
    );

    main.focus({
      preventScroll: false,
    });
  }

  function goTop() {
    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion
        ? "instant"
        : "smooth",
    });
  }

  return (
    <>
      <button
        type="button"
        className="yf5-skip-link"
        onClick={skipToMain}
      >
        Skip to main content
      </button>

      <div
        className="yf5-screen-reader-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        YOUR FORM. —
        {pageTitle}
      </div>

      {showTop && (
        <button
          type="button"
          className="yf5-back-to-top"
          onClick={goTop}
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}