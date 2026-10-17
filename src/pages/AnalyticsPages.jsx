import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
} from "react-router-dom";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Dumbbell,
  FileSpreadsheet,
  Info,
  TrendingUp,
  UsersRound,
  Wallet,
} from "lucide-react";

import {
  useStudio,
} from "../context/StudioContext.jsx";

import {
  useOperations,
} from "../context/OperationsContext.jsx";

import {
  ANALYTICS_STORAGE_KEY,
  DEFAULT_SCENARIO,
  REPORT_OPTIONS,
  buildStudioAnalytics,
  downloadCsv,
  membershipModel,
  money,
  normalizeScenario,
  percent,
  shortDate,
} from "../data/analyticsData.js";

const AnalyticsContext = createContext(null);

const TABS = [
  {
    path: "/staff/analytics",
    label: "Overview",
    end: true,
  },
  {
    path: "/staff/analytics/memberships",
    label: "Memberships",
  },
  {
    path: "/staff/analytics/coaches",
    label: "Coach Insights",
  },
  {
    path: "/staff/analytics/reports",
    label: "Reports",
  },
];

function loadScenario() {
  try {
    const saved = localStorage.getItem(
      ANALYTICS_STORAGE_KEY
    );

    return saved
      ? normalizeScenario(JSON.parse(saved))
      : { ...DEFAULT_SCENARIO };
  } catch {
    return { ...DEFAULT_SCENARIO };
  }
}

function useAnalytics() {
  const context =
    useContext(AnalyticsContext);

  if (!context) {
    throw new Error(
      "Analytics must be inside AnalyticsLayout."
    );
  }

  return context;
}

// ======================================
// ANALYTICS LAYOUT AND PROVIDER
// ======================================

export function AnalyticsLayout() {
  const studioContext = useStudio();

  const operations = useOperations();

  const reservations = useMemo(() => studioContext.reservations || [], [studioContext.reservations]);

  const membership =
    studioContext.membership || null;

  const classes = useMemo(() => operations.classes || [], [operations.classes]);

  const attendance = useMemo(() => operations.attendance || {}, [operations.attendance]);

  const [scenario, setScenario] =
    useState(loadScenario);

  useEffect(() => {
    try {
      localStorage.setItem(
        ANALYTICS_STORAGE_KEY,
        JSON.stringify(scenario)
      );
    } catch (error) {
      console.warn(
        "Could not save analytics scenario:",
        error
      );
    }
  }, [scenario]);

  const studio = useMemo(
    () =>
      buildStudioAnalytics({
        classes,
        reservations,
        attendance,
      }),
    [classes, reservations, attendance]
  );

  const model = useMemo(
    () => membershipModel(scenario),
    [scenario]
  );

  function updateScenario(field, value) {
    setScenario((current) =>
      normalizeScenario({
        ...current,
        [field]: value,
      })
    );
  }

  function resetScenario() {
    setScenario({
      ...DEFAULT_SCENARIO,
    });
  }

  return (
    <AnalyticsContext.Provider
      value={{
        studio,
        model,
        scenario,
        classes,
        reservations,
        attendance,
        membership,
        updateScenario,
        resetScenario,
      }}
    >
      <div className="yf4-area">
        <div className="yf4-subnavigation">
          <div className="yf4-subnav-label">
            <BarChart3 size={17} />
            PERFORMANCE INTELLIGENCE
          </div>

          <nav aria-label="Analytics pages">
            {TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.end}
                className={({ isActive }) =>
                  `yf4-tab ${
                    isActive ? "is-active" : ""
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <Outlet />
      </div>
    </AnalyticsContext.Provider>
  );
}

// ======================================
// SHARED COMPONENTS
// ======================================

function PageHeading({
  eyebrow,
  title,
  accent,
  description,
}) {
  return (
    <header className="yf4-heading">
      <span className="yf4-eyebrow">
        {eyebrow}
      </span>

      <h1>
        {title}
        <br />
        <em>{accent}</em>
      </h1>

      <p>{description}</p>
    </header>
  );
}

function Panel({
  eyebrow,
  title,
  children,
  extra,
}) {
  return (
    <section className="yf4-panel">
      <div className="yf4-panel-heading">
        <div>
          <span className="yf4-eyebrow">
            {eyebrow}
          </span>

          <h2>{title}</h2>
        </div>

        {extra && <div>{extra}</div>}
      </div>

      {children}
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  featured = false,
}) {
  return (
    <article
      className={`yf4-metric ${
        featured ? "is-featured" : ""
      }`}
    >
      <div className="yf4-metric-top">
        <span>{label}</span>
        <Icon size={20} />
      </div>

      <strong>{value}</strong>

      <p>{detail}</p>
    </article>
  );
}

function Notice({ children }) {
  return (
    <div className="yf4-notice">
      <Info size={19} />

      <p>{children}</p>
    </div>
  );
}

function DataBar({
  name,
  value,
  maximum,
  detail,
  index,
}) {
  const width =
    maximum > 0
      ? percent(value, maximum)
      : 0;

  return (
    <div className="yf4-data-bar">
      <div className="yf4-data-bar-heading">
        <span>
          <small>
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </small>

          <b>{name}</b>
        </span>

        <strong>{value}</strong>
      </div>

      <div
        className="yf4-bar-track"
        role="progressbar"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={maximum}
        aria-valuenow={value}
      >
        <span
          style={{
            width: `${width}%`,
          }}
        />
      </div>

      {detail && <small>{detail}</small>}
    </div>
  );
}

function BookingChart({ rows }) {
  const visible = rows.slice(0, 8);

  const maximum = Math.max(
    1,
    ...visible.map(
      (item) => item.bookings
    )
  );

  if (!visible.length) {
    return (
      <p className="yf4-empty">
        No upcoming scheduled days.
      </p>
    );
  }

  return (
    <div
      className="yf4-booking-chart"
      aria-label="Reservations per scheduled day"
    >
      {visible.map((day) => (
        <div
          className="yf4-chart-day"
          key={day.date}
        >
          <div className="yf4-chart-column">
            <span
              style={{
                height: `${
                  day.bookings
                    ? Math.max(
                        8,
                        (day.bookings /
                          maximum) *
                          100
                      )
                    : 0
                }%`,
              }}
              title={`${day.bookings} reservations`}
            >
              {day.bookings > 0 &&
                day.bookings}
            </span>
          </div>

          <b>{shortDate(day.date)}</b>

          <small>
            {day.sessions} classes
          </small>
        </div>
      ))}
    </div>
  );
}

// ======================================
// PAGE 01 — ANALYTICS OVERVIEW
// ======================================

export function AnalyticsDashboardPage() {
  const { studio } = useAnalytics();

  const maxBookings = Math.max(
    1,
    ...studio.programRows.map(
      (item) => item.bookings
    )
  );

  const topProgram =
    studio.programRows.find(
      (item) => item.bookings > 0
    );

  return (
    <div className="yf4-page">
      <PageHeading
        eyebrow="STUDIO ANALYTICS / 01"
        title="KNOW THE"
        accent="NUMBERS."
        description="An operational overview of upcoming classes, reservations, attendance, and training demand."
      />

      <div className="yf4-metric-grid">
        <Metric
          icon={CalendarDays}
          label="UPCOMING CLASSES"
          value={studio.classesCount}
          detail="Scheduled training sessions"
          featured
        />

        <Metric
          icon={UsersRound}
          label="DEMO BOOKINGS"
          value={studio.reservationCount}
          detail={`${studio.inWindowReservations} in the current class window`}
        />

        <Metric
          icon={CheckCircle2}
          label="CHECKED IN"
          value={studio.checkedIn}
          detail={`${studio.pending} pending records`}
        />

        <Metric
          icon={Activity}
          label="SAMPLE OCCUPANCY"
          value={`${studio.sampleOccupancyRate}%`}
          detail="Includes fictional pre-filled seats"
        />
      </div>

      <div className="yf4-two-columns">
        <Panel
          eyebrow="CLASS DEMAND"
          title="Upcoming reservations."
        >
          <BookingChart
            rows={studio.dayRows}
          />

          <p className="yf4-muted-note">
            Actual browser demo bookings
            grouped by upcoming class date.
          </p>
        </Panel>

        <Panel
          eyebrow="ATTENDANCE"
          title="Recorded outcomes."
        >
          <div className="yf4-attendance-layout">
            <div
              className="yf4-attendance-ring"
              style={{
                "--rate": `${
                  studio.attendanceRate ?? 0
                }%`,
              }}
            >
              <div>
                <strong>
                  {studio.attendanceRate ===
                  null
                    ? "—"
                    : `${studio.attendanceRate}%`}
                </strong>

                <small>
                  CHECK-IN RATE
                </small>
              </div>
            </div>

            <div className="yf4-attendance-stats">
              <div>
                <span className="is-green" />
                Checked In
                <b>{studio.checkedIn}</b>
              </div>

              <div>
                <span className="is-red" />
                No Show
                <b>{studio.noShow}</b>
              </div>

              <div>
                <span className="is-grey" />
                Pending
                <b>{studio.pending}</b>
              </div>
            </div>
          </div>

          <p className="yf4-muted-note">
            Pending records are excluded
            from the calculated check-in rate.
          </p>
        </Panel>
      </div>

      <div className="yf4-two-columns">
        <Panel
          eyebrow="POPULARITY"
          title="Training programs."
        >
          <div className="yf4-bars">
            {studio.programRows.map(
              (program, index) => (
                <DataBar
                  key={program.id}
                  index={index}
                  name={program.name}
                  value={program.bookings}
                  maximum={maxBookings}
                  detail={`${program.sessions} class sessions`}
                />
              )
            )}
          </div>
        </Panel>

        <Panel
          eyebrow="MANAGEMENT"
          title="Operations snapshot."
        >
          <div className="yf4-stat-list">
            <div>
              <span>
                Classes marked ready
              </span>
              <strong>{studio.ready}</strong>
            </div>

            <div>
              <span>
                Classes completed
              </span>
              <strong>
                {studio.completed}
              </strong>
            </div>

            <div>
              <span>
                Sample seat capacity
              </span>
              <strong>
                {studio.capacity}
              </strong>
            </div>

            <div>
              <span>
                Fictional pre-filled seats
              </span>
              <strong>
                {studio.sampleTaken}
              </strong>
            </div>

            <div>
              <span>
                Most booked program
              </span>
              <strong className="is-text">
                {topProgram?.name ||
                  "No bookings yet"}
              </strong>
            </div>
          </div>
        </Panel>
      </div>

      <Notice>
        This is a browser-local demo.
        Attendance and reservations come
        from the Staff Portal. No live
        payment, membership database, or
        physical attendance system is
        connected.
      </Notice>
    </div>
  );
}

// ======================================
// PAGE 02 — MEMBERSHIP INTELLIGENCE
// ======================================

export function MembershipIntelligencePage() {
  const {
    model,
    scenario,
    membership,
    updateScenario,
    resetScenario,
  } = useAnalytics();

  const maxRevenue = Math.max(
    1,
    ...model.plans.map(
      (plan) => plan.subtotal
    )
  );

  const maxForecast = Math.max(
    1,
    ...model.projectedMonths.map(
      (month) => month.gross
    )
  );

  return (
    <div className="yf4-page">
      <PageHeading
        eyebrow="BUSINESS INTELLIGENCE / 02"
        title="PLAN THE"
        accent="GROWTH."
        description="Create a hypothetical membership business scenario using the current website membership prices."
      />

      <Notice>
        <strong>FINANCIAL PROJECTIONS ONLY.</strong>
        {" "}All membership counts and
        operating costs below are
        hypothetical. These are not
        recorded payments or real earnings.
      </Notice>

      <div className="yf4-metric-grid">
        <Metric
          icon={UsersRound}
          label="ASSUMED MEMBERS"
          value={model.members}
          detail="Hypothetical member population"
          featured
        />

        <Metric
          icon={Wallet}
          label="MONTHLY GROSS"
          value={money(
            model.grossMonthly
          )}
          detail="Before deductions"
        />

        <Metric
          icon={Activity}
          label="MONTHLY COSTS"
          value={money(
            model.operatingCost
          )}
          detail="Entered cost assumption"
        />

        <Metric
          icon={TrendingUp}
          label="ESTIMATED BALANCE"
          value={money(
            model.estimatedBalance
          )}
          detail="Gross minus assumed costs"
        />
      </div>

      <div className="yf4-two-columns">
        <Panel
          eyebrow="SCENARIO BUILDER"
          title="Adjust the numbers."
          extra={
            <button
              type="button"
              className="yf4-quiet-button"
              onClick={resetScenario}
            >
              Reset
            </button>
          }
        >
          <div className="yf4-plan-list">
            {model.plans.map((plan) => (
              <label
                className="yf4-plan-field"
                key={plan.id}
              >
                <span>
                  <strong>
                    {plan.name}
                  </strong>

                  <small>
                    {money(plan.price)}/month
                  </small>
                </span>

                <input
                  type="number"
                  min="0"
                  max="5000"
                  step="1"
                  value={
                    scenario[plan.id] ?? 0
                  }
                  onChange={(event) =>
                    updateScenario(
                      plan.id,
                      event.target.value
                    )
                  }
                  aria-label={`${plan.name} assumed members`}
                />
              </label>
            ))}
          </div>

          <div className="yf4-finance-fields">
            <label>
              <span>
                MONTHLY OPERATING COST (₱)
              </span>

              <input
                type="number"
                min="0"
                step="1000"
                value={
                  scenario.monthlyOperatingCost
                }
                onChange={(event) =>
                  updateScenario(
                    "monthlyOperatingCost",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                ASSUMED MONTHLY GROWTH (%)
              </span>

              <input
                type="number"
                min="-15"
                max="25"
                step="0.5"
                value={
                  scenario.growthPercent
                }
                onChange={(event) =>
                  updateScenario(
                    "growthPercent",
                    event.target.value
                  )
                }
              />
            </label>
          </div>

          <p className="yf4-muted-note">
            Scenario values save
            automatically in this browser.
          </p>
        </Panel>

        <Panel
          eyebrow="REVENUE MIX"
          title="Membership composition."
        >
          <div className="yf4-bars">
            {model.plans.map(
              (plan, index) => (
                <DataBar
                  key={plan.id}
                  index={index}
                  name={plan.name}
                  value={plan.subtotal}
                  maximum={maxRevenue}
                  detail={`${plan.count} assumed members · ${money(
                    plan.subtotal
                  )}`}
                />
              )
            )}
          </div>

          <div className="yf4-stat-list yf4-space-top">
            <div>
              <span>
                Average revenue per member
              </span>

              <strong>
                {money(
                  model.averageValue
                )}
              </strong>
            </div>

            <div>
              <span>
                Estimated break-even count
              </span>

              <strong>
                {model.breakEvenMembers ??
                  "—"}
              </strong>
            </div>

            <div>
              <span>
                Selected demo membership
              </span>

              <strong className="is-text">
                {membership?.name ||
                  "No selection"}
              </strong>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        eyebrow="SIX-MONTH OUTLOOK"
        title="Illustrative gross revenue."
        extra={
          <span className="yf4-label">
            {model.growthPercent}%
            MONTHLY ASSUMPTION
          </span>
        }
      >
        <div className="yf4-forecast">
          {model.projectedMonths.map(
            (month, index) => (
              <div
                className="yf4-forecast-item"
                key={index}
              >
                <div className="yf4-forecast-track">
                  <span
                    style={{
                      height: `${
                        month.gross
                          ? Math.max(
                              5,
                              (month.gross /
                                maxForecast) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                    title={money(
                      month.gross
                    )}
                  />
                </div>

                <b>{month.label}</b>

                <small>
                  {money(month.gross)}
                </small>
              </div>
            )
          )}
        </div>

        <p className="yf4-muted-note">
          This projection compounds the
          assumed monthly growth rate.
          It does not account for churn,
          taxes, payment fees, or
          capital expenditures.
        </p>
      </Panel>
    </div>
  );
}

// ======================================
// PAGE 03 — COACH INSIGHTS
// ======================================

export function CoachInsightsPage() {
  const { studio } = useAnalytics();

  const maxSessions = Math.max(
    1,
    ...studio.coachRows.map(
      (coach) => coach.sessions
    )
  );

  const totalMinutes =
    studio.coachRows.reduce(
      (sum, coach) =>
        sum + coach.minutes,
      0
    );

  return (
    <div className="yf4-page">
      <PageHeading
        eyebrow="COACH INTELLIGENCE / 03"
        title="THE TEAM."
        accent="THE WORKLOAD."
        description="Review staff-side assignments, upcoming sessions, class demand, and check-ins across the coaching team."
      />

      <div className="yf4-metric-grid">
        <Metric
          icon={Dumbbell}
          label="COACHES"
          value={
            studio.coachRows.length
          }
          detail="Coaches in the demo roster"
          featured
        />

        <Metric
          icon={CalendarDays}
          label="CLASS ASSIGNMENTS"
          value={
            studio.classesCount
          }
          detail="Upcoming scheduled sessions"
        />

        <Metric
          icon={Clock3}
          label="TRAINING MINUTES"
          value={
            totalMinutes.toLocaleString(
              "en-PH"
            )
          }
          detail="Scheduled demo training time"
        />

        <Metric
          icon={CheckCircle2}
          label="RECORDED CHECK-INS"
          value={studio.checkedIn}
          detail="All browser attendance records"
        />
      </div>

      <Panel
        eyebrow="WORKLOAD COMPARISON"
        title="Classes per coach."
      >
        <div className="yf4-bars">
          {studio.coachRows.map(
            (coach, index) => (
              <DataBar
                key={coach.id}
                index={index}
                name={coach.name}
                value={coach.sessions}
                maximum={maxSessions}
                detail={`${coach.minutes} scheduled minutes · ${coach.bookings} bookings`}
              />
            )
          )}
        </div>
      </Panel>

      <div className="yf4-coach-grid">
        {studio.coachRows.map(
          (coach, index) => (
            <article
              className="yf4-coach-card"
              key={coach.id}
            >
              <div className="yf4-coach-card-top">
                <span>
                  COACH /{" "}
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <ArrowUpRight size={19} />
              </div>

              <div className="yf4-coach-avatar">
                {coach.initials ||
                  coach.name
                    ?.slice(0, 2)
                    .toUpperCase()}
              </div>

              <h3>{coach.name}</h3>

              <p>{coach.role}</p>

              <div className="yf4-coach-details">
                <div>
                  <span>CLASSES</span>
                  <b>{coach.sessions}</b>
                </div>

                <div>
                  <span>BOOKINGS</span>
                  <b>{coach.bookings}</b>
                </div>

                <div>
                  <span>CHECK-INS</span>
                  <b>{coach.checkins}</b>
                </div>

                <div>
                  <span>READY</span>
                  <b>{coach.ready}</b>
                </div>
              </div>
            </article>
          )
        )}
      </div>

      <Notice>
        These are scheduling and
        attendance counts, not individual
        employee performance ratings.
        Coach assignments reflect
        browser-local staff operations.
      </Notice>
    </div>
  );
}

// ======================================
// REPORT GENERATOR
// ======================================

function generateReport({
  type,
  classes,
  reservations,
  attendance,
  model,
  start,
  end,
}) {
  const matchesDate = (date) =>
    (!start || date >= start) &&
    (!end || date <= end);

  const filteredClasses =
    classes.filter(
      (item) => matchesDate(item.date)
    );

  const filteredReservations =
    reservations.filter(
      (item) => matchesDate(item.date)
    );

  const sessions = new Map(
    classes.map((item) => [
      item.id,
      item,
    ])
  );

  if (type === "reservations") {
    return {
      headers: [
        "Member Alias",
        "Date",
        "Time",
        "Program",
        "Coach",
        "Attendance",
        "Booking ID",
      ],

      rows: filteredReservations.map(
        (record) => {
          const session =
            sessions.get(
              record.sessionId
            );

          return [
            record.alias ||
              "Demo Member",
            record.date,
            record.time,
            session?.program?.name ||
              record.programId ||
              "Training Class",
            session?.assignedCoach
              ?.name || "",
            attendance[record.id] ||
              "pending",
            record.id,
          ];
        }
      ),
    };
  }

  if (type === "classes") {
    return {
      headers: [
        "Date",
        "Time",
        "Program",
        "Coach",
        "Status",
        "Capacity",
        "Occupied",
        "Bookings",
        "Checked In",
        "Staff Notes",
      ],

      rows: filteredClasses.map(
        (item) => [
          item.date,
          item.time,
          item.program?.name || "",
          item.assignedCoach?.name || "",
          item.stage,
          item.capacity,
          item.occupied,
          item.bookedCount,
          item.checkedIn,
          item.staffNote,
        ]
      ),
    };
  }

  if (type === "coaches") {
    return {
      headers: [
        "Date",
        "Time",
        "Coach",
        "Program",
        "Duration",
        "Status",
        "Bookings",
      ],

      rows: filteredClasses.map(
        (item) => [
          item.date,
          item.time,
          item.assignedCoach?.name || "",
          item.program?.name || "",
          item.program?.duration || 0,
          item.stage,
          item.bookedCount,
        ]
      ),
    };
  }

  if (type === "programs") {
    const programMap = new Map();

    filteredClasses.forEach((item) => {
      const key =
        item.program?.id ||
        item.program?.name ||
        "unknown";

      if (!programMap.has(key)) {
        programMap.set(key, {
          name:
            item.program?.name ||
            "Training Class",
          category:
            item.program?.category ||
            "Fitness",
          sessions: 0,
          capacity: 0,
          bookings: 0,
          checkins: 0,
        });
      }

      const program =
        programMap.get(key);

      program.sessions += 1;
      program.capacity +=
        Number(item.capacity) || 0;
      program.bookings +=
        Number(item.bookedCount) || 0;
      program.checkins +=
        Number(item.checkedIn) || 0;
    });

    return {
      headers: [
        "Program",
        "Category",
        "Sessions",
        "Capacity",
        "Bookings",
        "Check-ins",
      ],

      rows: [
        ...programMap.values(),
      ].map((item) => [
        item.name,
        item.category,
        item.sessions,
        item.capacity,
        item.bookings,
        item.checkins,
      ]),
    };
  }

  return {
    headers: [
      "Membership Plan",
      "Assumed Members",
      "Monthly Price PHP",
      "Projected Gross PHP",
    ],

    rows: model.plans.map(
      (plan) => [
        plan.name,
        plan.count,
        plan.price,
        plan.subtotal,
      ]
    ),
  };
}

// ======================================
// PAGE 04 — REPORTS CENTER
// ======================================

export function ReportsPage() {
  const {
    classes,
    reservations,
    attendance,
    model,
  } = useAnalytics();

  const [type, setType] =
    useState("reservations");

  const [start, setStart] =
    useState("");

  const [end, setEnd] =
    useState("");

  const [message, setMessage] =
    useState("");

  const invalidDates = Boolean(
    start && end && start > end
  );

  const report = useMemo(
    () =>
      generateReport({
        type,
        classes,
        reservations,
        attendance,
        model,
        start,
        end,
      }),
    [
      type,
      classes,
      reservations,
      attendance,
      model,
      start,
      end,
    ]
  );

  const rows = invalidDates
    ? []
    : report.rows;

  function exportReport() {
    if (!rows.length || invalidDates) {
      return;
    }

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    const filename =
      `your-form-${type}-${today}.csv`;

    downloadCsv(
      filename,
      report.headers,
      rows
    );

    setMessage(
      `CSV download started: ${filename}`
    );
  }

  return (
    <div className="yf4-page">
      <PageHeading
        eyebrow="REPORT CENTER / 04"
        title="TURN DATA"
        accent="INTO DECISIONS."
        description="Build operational reports, preview demo records, and export CSV files for further analysis."
      />

      <div className="yf4-report-grid">
        <Panel
          eyebrow="REPORT BUILDER"
          title="Configure your export."
        >
          <div className="yf4-report-fields">
            <label>
              <span>REPORT TYPE</span>

              <select
                value={type}
                onChange={(event) => {
                  setType(
                    event.target.value
                  );
                  setMessage("");
                }}
              >
                {REPORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.id}
                      value={option.id}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>FROM DATE</span>

              <input
                type="date"
                value={start}
                disabled={
                  type === "memberships"
                }
                onChange={(event) =>
                  setStart(
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>TO DATE</span>

              <input
                type="date"
                value={end}
                disabled={
                  type === "memberships"
                }
                onChange={(event) =>
                  setEnd(
                    event.target.value
                  )
                }
              />
            </label>
          </div>

          {invalidDates && (
            <p
              className="yf4-error"
              role="alert"
            >
              End date cannot be earlier
              than start date.
            </p>
          )}

          <div className="yf4-report-actions">
            <button
              type="button"
              className="yf4-download-button"
              onClick={exportReport}
              disabled={
                !rows.length ||
                invalidDates
              }
            >
              <Download size={17} />
              DOWNLOAD CSV
            </button>

            <button
              type="button"
              className="yf4-quiet-button"
              onClick={() => {
                setType(
                  "reservations"
                );
                setStart("");
                setEnd("");
                setMessage("");
              }}
            >
              Reset Filters
            </button>
          </div>

          {message && (
            <p
              className="yf4-success"
              role="status"
            >
              <CheckCircle2 size={17} />
              {message}
            </p>
          )}
        </Panel>

        <Panel
          eyebrow="REPORT SUMMARY"
          title="Ready for review."
        >
          <div className="yf4-report-summary">
            <FileSpreadsheet size={37} />

            <strong>
              {rows.length}
            </strong>

            <span>
              MATCHING REPORT ROWS
            </span>

            <p>
              {
                REPORT_OPTIONS.find(
                  (option) =>
                    option.id === type
                )?.label
              }
            </p>
          </div>
        </Panel>
      </div>

      <Panel
        eyebrow="PREVIEW"
        title="Report data."
        extra={
          <span className="yf4-label">
            FIRST 8 ROWS
          </span>
        }
      >
        {rows.length ? (
          <div className="yf4-table-scroll">
            <table className="yf4-table">
              <thead>
                <tr>
                  {report.headers.map(
                    (header) => (
                      <th key={header}>
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {rows
                  .slice(0, 8)
                  .map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map(
                        (cell, index) => (
                          <td key={index}>
                            {String(
                              cell ?? "—"
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="yf4-report-empty">
            <FileSpreadsheet size={33} />

            <strong>
              No matching records
            </strong>

            <p>
              Try another report type
              or date filter. You can
              create demo reservations
              from the Member Desk.
            </p>
          </div>
        )}

        {rows.length > 8 && (
          <p className="yf4-muted-note">
            Showing 8 of {rows.length}
            rows. The CSV will contain
            all matching records.
          </p>
        )}
      </Panel>

      <Notice>
        Reports are created from local
        demonstration data. Membership
        financial reports are hypothetical
        scenarios and should not be
        treated as actual sales or
        accounting records.
      </Notice>
    </div>
  );
}