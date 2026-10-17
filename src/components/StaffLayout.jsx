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
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Dumbbell,
  FileSpreadsheet,
  LayoutDashboard,
  Menu,
  Settings2,
  ShieldCheck,
  UsersRound,
  Wallet,
  X,
} from "lucide-react";

import {
  BRAND,
} from "../data/studioData.js";

import {
  useOperations,
} from "../context/OperationsContext.jsx";

const NAV_GROUPS = [
  {
    heading: "WORKSPACE / 01",
    items: [
      {
        path: "/staff",
        label: "Overview",
        icon: LayoutDashboard,
        end: true,
        number: "01",
      },
      {
        path: "/staff/classes",
        label: "Class Operations",
        icon: CalendarDays,
        number: "02",
      },
      {
        path: "/staff/coaches",
        label: "Coach Scheduling",
        icon: Dumbbell,
        number: "03",
      },
      {
        path: "/staff/members",
        label: "Member Desk",
        icon: UsersRound,
        number: "04",
      },
    ],
  },
  {
    heading: "BUSINESS INTELLIGENCE / 02",
    items: [
      {
        path: "/staff/analytics",
        label: "Analytics",
        icon: BarChart3,
        end: true,
        number: "05",
      },
      {
        path: "/staff/analytics/memberships",
        label: "Memberships",
        icon: Wallet,
        number: "06",
      },
      {
        path: "/staff/analytics/coaches",
        label: "Coach Insights",
        icon: Activity,
        number: "07",
      },
      {
        path: "/staff/analytics/reports",
        label: "Reports",
        icon: FileSpreadsheet,
        number: "08",
      },
    ],
  },
  {
    heading: "DEMO MANAGEMENT / 03",
    items: [
      {
        path: "/staff/settings",
        label: "Demo Settings",
        icon: Settings2,
        number: "09",
      },
    ],
  },
];

const ALL_NAV_ITEMS =
  NAV_GROUPS.flatMap(
    (group) => group.items
  );

function StaffSidebar({
  menuOpen,
  onClose,
}) {
  const {
    classes,
  } = useOperations();

  return (
    <>
      <button
        type="button"
        className={`yf3-sidebar-scrim ${
          menuOpen
            ? "is-open"
            : ""
        }`}
        aria-label="Close staff navigation"
        onClick={onClose}
      />

      <aside
        className={`yf3-sidebar ${
          menuOpen
            ? "is-open"
            : ""
        }`}
      >
        <div className="yf3-sidebar-brand">
          <div className="yf3-brand-mark">
            <Dumbbell size={21} />
          </div>

          <div>
            <strong>
              YOUR FORM.
            </strong>

            <small>
              STUDIO OPERATIONS
            </small>
          </div>

          <button
            type="button"
            className="yf3-mobile-close"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {NAV_GROUPS.map(
          (group) => (
            <div
              className="yf3-sidebar-section"
              key={group.heading}
            >
              <span className="yf3-side-caption">
                {group.heading}
              </span>

              <nav
                className="yf3-nav"
                aria-label={
                  group.heading
                }
              >
                {group.items.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        onClick={
                          onClose
                        }
                        className={({
                          isActive,
                        }) =>
                          `yf3-nav-link ${
                            isActive
                              ? "is-active"
                              : ""
                          }`
                        }
                      >
                        <Icon size={18} />

                        <span>
                          {item.label}
                        </span>

                        <small>
                          {item.number}
                        </small>
                      </NavLink>
                    );
                  }
                )}
              </nav>
            </div>
          )
        )}

        <div className="yf3-side-spacer" />

        <div className="yf3-side-metrics">
          <div className="yf3-side-status">
            <Activity size={16} />
            LOCAL DEMO MODE
          </div>

          <strong>
            {classes.length}
          </strong>

          <span>
            Upcoming sample training
            sessions in the current
            planning window.
          </span>
        </div>

        <Link
          to="/"
          className="yf3-back-site"
          onClick={onClose}
        >
          <ArrowLeft size={17} />

          Return to website

          <ArrowUpRight size={15} />
        </Link>

        <p className="yf3-sidebar-credit">
          {BRAND.attribution}
        </p>
      </aside>
    </>
  );
}

export default function StaffLayout() {
  const location =
    useLocation();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const currentPage =
    ALL_NAV_ITEMS.find(
      (item) =>
        location.pathname ===
        item.path
    ) || ALL_NAV_ITEMS[0];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <div className="yf3-shell">
      <StaffSidebar
        menuOpen={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />

      <div className="yf3-workspace">
        <header className="yf3-topbar">
          <div className="yf3-topbar-left">
            <button
              type="button"
              className="yf3-menu-button"
              aria-label="Open staff navigation"
              onClick={() =>
                setMenuOpen(true)
              }
            >
              <Menu size={22} />
            </button>

            <div>
              <span>
                STUDIO / CONTROL CENTER
              </span>

              <strong>
                {currentPage.label}
              </strong>
            </div>
          </div>

          <div className="yf3-topbar-right">
            <span className="yf3-demo-chip">
              <ShieldCheck size={14} />

              BROWSER DEMO
            </span>

            <div className="yf3-staff-avatar">
              ST
            </div>
          </div>
        </header>

        <main className="yf3-main">
          <Outlet />
        </main>

        <footer className="yf3-footer">
          <span>
            YOUR FORM. / STUDIO
            INTELLIGENCE
          </span>

          <span>
            {BRAND.attribution}
          </span>
        </footer>
      </div>
    </div>
  );
}