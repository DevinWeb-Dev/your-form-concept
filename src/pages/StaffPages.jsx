import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  Info,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import {
  COACHES,
} from "../data/studioData.js";

import {
  useStudio,
} from "../context/StudioContext.jsx";

import {
  ATTENDANCE_STATES,
  CLASS_CHECKLIST,
  CLASS_STAGES,
  useOperations,
} from "../context/OperationsContext.jsx";

// ==========================================
// SHARED PRESENTATION
// ==========================================

function dayLabel(dateKey, options) {
  if (!dateKey) return "No date";

  const date = new Date(
    `${dateKey}T12:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return new Intl.DateTimeFormat(
    "en-PH",
    options || {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
  ).format(date);
}

function timeLabel(time) {
  if (!time) return "—";

  const [hours, minutes] = String(time)
    .split(":")
    .map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return time;
  }

  const hour = hours % 12 || 12;

  return `${hour}:${String(minutes).padStart(
    2,
    "0"
  )} ${hours >= 12 ? "PM" : "AM"}`;
}

function percentage(value, maximum) {
  if (!maximum) return 0;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (Number(value) / Number(maximum)) *
          100
      )
    )
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="yf3-page-heading">
      <div>
        <span className="yf3-eyebrow">
          {eyebrow}
        </span>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      {action && (
        <div className="yf3-heading-action">
          {action}
        </div>
      )}
    </div>
  );
}

function PanelHeading({
  eyebrow,
  title,
  right,
}) {
  return (
    <div className="yf3-panel-heading">
      <div>
        {eyebrow && (
          <span className="yf3-eyebrow">
            {eyebrow}
          </span>
        )}

        <h2>{title}</h2>
      </div>

      {right && <div>{right}</div>}
    </div>
  );
}

function StageBadge({ stage }) {
  const item = CLASS_STAGES.find(
    (entry) => entry.id === stage
  );

  return (
    <span
      className={`yf3-stage yf3-stage-${stage}`}
    >
      <span className="yf3-status-dot" />

      {item?.label || "Scheduled"}
    </span>
  );
}

function AttendanceBadge({ status }) {
  const item = ATTENDANCE_STATES.find(
    (entry) => entry.id === status
  );

  return (
    <span
      className={`yf3-attendance yf3-attendance-${status}`}
    >
      {item?.label || "Pending"}
    </span>
  );
}

function EmptyState({
  title,
  description,
  children,
}) {
  return (
    <div className="yf3-empty">
      <ClipboardCheck size={28} />

      <strong>{title}</strong>

      <p>{description}</p>

      {children}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  accent = false,
}) {
  return (
    <div
      className={`yf3-metric ${
        accent ? "is-accent" : ""
      }`}
    >
      <div className="yf3-metric-top">
        <span>{label}</span>
        <Icon size={19} />
      </div>

      <strong>{value}</strong>

      <small>{detail}</small>
    </div>
  );
}

function SeatMeter({ item }) {
  const filled = percentage(
    item.occupied,
    item.capacity
  );

  return (
    <div className="yf3-seat-meter">
      <div className="yf3-seat-top">
        <span>Sample seat occupancy</span>

        <strong>
          {item.occupied}/{item.capacity}
        </strong>
      </div>

      <div className="yf3-progress-track">
        <div
          className="yf3-progress-fill"
          style={{
            width: `${filled}%`,
          }}
        />
      </div>

      <small>
        {item.bookedCount} browser demo{" "}
        {item.bookedCount === 1
          ? "reservation"
          : "reservations"}
        {" "}· {item.remaining} sample spots left
      </small>
    </div>
  );
}

function ClassRow({
  item,
  onClick,
  active = false,
}) {
  return (
    <button
      type="button"
      className={`yf3-class-row ${
        active ? "is-active" : ""
      }`}
      onClick={onClick}
    >
      <div className="yf3-class-time">
        <Clock3 size={15} />
        {timeLabel(item.time)}
      </div>

      <div className="yf3-class-primary">
        <strong>
          {item.program?.name ||
            "Training Class"}
        </strong>

        <span>
          {item.assignedCoach?.name ||
            "Coach TBA"}
        </span>
      </div>

      <StageBadge stage={item.stage} />

      <ArrowUpRight
        size={18}
        className="yf3-class-arrow"
      />
    </button>
  );
}

// ==========================================
// PAGE 01 — STAFF DASHBOARD
// ==========================================

export function StaffDashboardPage() {
  const {
    reservations,
  } = useStudio();

  const {
    classes,
    tasks,
    checkedInCount,
    addTask,
    toggleTask,
    removeTask,
  } = useOperations();

  const [taskText, setTaskText] =
    useState("");

  const openTasks = tasks.filter(
    (item) => !item.done
  ).length;

  const readyClasses = classes.filter(
    (item) => item.stage === "ready"
  ).length;

  const upcoming = classes.slice(0, 5);

  function handleAddTask(event) {
    event.preventDefault();

    if (addTask(taskText)) {
      setTaskText("");
    }
  }

  return (
    <div className="yf3-page">
      <PageHeading
        eyebrow="MANAGEMENT / COMMAND CENTER"
        title={
          <>
            THE STUDIO.
            <br />
            <em>AT A GLANCE.</em>
          </>
        }
        description="A single workspace for your class schedule, operational tasks, and member activity."
        action={
          <Link
            to="/staff/classes"
            className="yf3-primary-button"
          >
            Manage Classes
            <ArrowUpRight size={17} />
          </Link>
        }
      />

      <div className="yf3-metrics-grid">
        <Metric
          icon={CalendarDays}
          label="CLASS SESSIONS"
          value={classes.length}
          detail="Upcoming demo sessions"
          accent
        />

        <Metric
          icon={UsersRound}
          label="RESERVATIONS"
          value={reservations.length}
          detail="Saved browser bookings"
        />

        <Metric
          icon={UserRoundCheck}
          label="CHECKED IN"
          value={checkedInCount}
          detail="Recorded attendance"
        />

        <Metric
          icon={ClipboardCheck}
          label="OPEN TASKS"
          value={openTasks}
          detail={`${readyClasses} classes marked ready`}
        />
      </div>

      <div className="yf3-dashboard-grid">
        <section className="yf3-panel">
          <PanelHeading
            eyebrow="UPCOMING TRAINING"
            title="Next on the floor."
            right={
              <Link
                to="/staff/classes"
                className="yf3-text-link"
              >
                Full Schedule
                <ArrowUpRight size={15} />
              </Link>
            }
          />

          {upcoming.length ? (
            <div className="yf3-upcoming-list">
              {upcoming.map((item, index) => (
                <div
                  className="yf3-upcoming-item"
                  key={item.id}
                >
                  <span className="yf3-upcoming-number">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div>
                    <small>
                      {dayLabel(item.date)}
                      {" / "}
                      {timeLabel(item.time)}
                    </small>

                    <strong>
                      {item.program?.name}
                    </strong>

                    <span>
                      {item.assignedCoach?.name}
                    </span>
                  </div>

                  <StageBadge stage={item.stage} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming sessions"
              description="There are no sample sessions in the current planning window."
            />
          )}
        </section>

        <section className="yf3-panel">
          <PanelHeading
            eyebrow="DAILY RESPONSIBILITIES"
            title="Operations checklist."
            right={
              <span className="yf3-count-label">
                {openTasks} OPEN
              </span>
            }
          />

          <form
            className="yf3-task-form"
            onSubmit={handleAddTask}
          >
            <input
              value={taskText}
              onChange={(event) =>
                setTaskText(
                  event.target.value
                )
              }
              maxLength={180}
              placeholder="Add a studio task..."
              aria-label="New studio task"
            />

            <button
              type="submit"
              aria-label="Add task"
              disabled={!taskText.trim()}
            >
              <Plus size={19} />
            </button>
          </form>

          {tasks.length ? (
            <div className="yf3-task-list">
              {tasks.map((item) => (
                <div
                  className="yf3-task"
                  key={item.id}
                >
                  <button
                    type="button"
                    className={`yf3-task-check ${
                      item.done
                        ? "is-done"
                        : ""
                    }`}
                    aria-label={
                      item.done
                        ? "Mark task incomplete"
                        : "Complete task"
                    }
                    onClick={() =>
                      toggleTask(item.id)
                    }
                  >
                    {item.done && (
                      <Check size={14} />
                    )}
                  </button>

                  <span
                    className={
                      item.done
                        ? "is-done"
                        : ""
                    }
                  >
                    {item.text}
                  </span>

                  <button
                    type="button"
                    className="yf3-task-delete"
                    aria-label="Delete task"
                    onClick={() =>
                      removeTask(item.id)
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="yf3-task-placeholder">
              <CheckCircle2 size={24} />

              <strong>
                Your checklist starts here.
              </strong>

              <span>
                Add tasks for facility checks,
                cleaning, staff briefings,
                or class preparation.
              </span>
            </div>
          )}
        </section>
      </div>

      <div className="yf3-info-banner">
        <Info size={20} />

        <p>
          <strong>Prototype operations:</strong>{" "}
          reservations come from the same
          browser's YOUR FORM. booking data.
          Occupancy includes fictional
          sample bookings. No real payments,
          facility access, or live studio
          tracking are performed.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 02 — CLASS OPERATIONS
// ==========================================

export function StaffClassesPage() {
  const {
    classes,
    classDates,
    updateSession,
  } = useOperations();

  const [date, setDate] = useState(
    classDates[0] || ""
  );

  const [query, setQuery] =
    useState("");

  const [stageFilter, setStageFilter] =
    useState("all");

  const [selectedId, setSelectedId] =
    useState("");

  const filtered = useMemo(
    () =>
      classes.filter((item) => {
        const matchesDate =
          item.date === date;

        const matchesStage =
          stageFilter === "all" ||
          item.stage === stageFilter;

        const combined = [
          item.program?.name,
          item.assignedCoach?.name,
          item.program?.category,
        ]
          .join(" ")
          .toLowerCase();

        return (
          matchesDate &&
          matchesStage &&
          combined.includes(
            query.trim().toLowerCase()
          )
        );
      }),
    [
      classes,
      date,
      query,
      stageFilter,
    ]
  );

  const selected =
    filtered.find(
      (item) => item.id === selectedId
    ) ||
    filtered[0] ||
    null;

  function toggleCheck(id) {
    if (!selected) return;

    const next = new Set(
      selected.checks
    );

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    updateSession(selected.id, {
      checks: [...next],
    });
  }

  return (
    <div className="yf3-page">
      <PageHeading
        eyebrow="TRAINING OPERATIONS / 02"
        title={
          <>
            EVERY CLASS.
            <br />
            <em>UNDER CONTROL.</em>
          </>
        }
        description="Review upcoming sessions, prepare the studio, assign coaches, and keep class notes organized."
      />

      <div className="yf3-filter-bar">
        <label className="yf3-field">
          <span>SELECT DAY</span>

          <select
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setSelectedId("");
            }}
          >
            {classDates.map((key) => (
              <option key={key} value={key}>
                {dayLabel(key)}
              </option>
            ))}
          </select>
        </label>

        <label className="yf3-field">
          <span>CLASS STATUS</span>

          <select
            value={stageFilter}
            onChange={(event) => {
              setStageFilter(
                event.target.value
              );

              setSelectedId("");
            }}
          >
            <option value="all">
              All Statuses
            </option>

            {CLASS_STAGES.map((item) => (
              <option
                value={item.id}
                key={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="yf3-field yf3-search-field">
          <span>SEARCH</span>

          <div className="yf3-search">
            <Search size={17} />

            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedId("");
              }}
              placeholder="Program or coach..."
            />
          </div>
        </label>
      </div>

      <div className="yf3-classes-grid">
        <section className="yf3-panel">
          <PanelHeading
            eyebrow="CLASS ROSTER"
            title={dayLabel(date)}
            right={
              <span className="yf3-count-label">
                {filtered.length} SESSIONS
              </span>
            }
          />

          {filtered.length ? (
            <div className="yf3-class-list">
              {filtered.map((item) => (
                <ClassRow
                  key={item.id}
                  item={item}
                  active={
                    selected?.id === item.id
                  }
                  onClick={() =>
                    setSelectedId(item.id)
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No classes found"
              description="Try choosing another date or clearing the filters."
            />
          )}
        </section>

        <section className="yf3-panel yf3-editor-panel">
          <PanelHeading
            eyebrow="SESSION WORKSPACE"
            title="Class control."
          />

          {selected ? (
            <div
              className="yf3-class-editor"
              key={selected.id}
            >
              <div className="yf3-class-spotlight">
                <small>
                  {dayLabel(selected.date)}
                  {" / "}
                  {timeLabel(selected.time)}
                </small>

                <h3>
                  {selected.program?.name}
                </h3>

                <p>
                  {selected.program?.category ||
                    "Fitness"}
                  {" / "}
                  {selected.program?.duration ||
                    60}{" "}
                  MINUTES
                </p>

                <SeatMeter item={selected} />
              </div>

              <div className="yf3-form-grid">
                <label className="yf3-field">
                  <span>CLASS STATUS</span>

                  <select
                    value={selected.stage}
                    onChange={(event) =>
                      updateSession(
                        selected.id,
                        {
                          stage:
                            event.target.value,
                        }
                      )
                    }
                  >
                    {CLASS_STAGES.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.label}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="yf3-field">
                  <span>ASSIGNED COACH</span>

                  <select
                    value={
                      selected.assignedCoachId
                    }
                    onChange={(event) =>
                      updateSession(
                        selected.id,
                        {
                          coachId:
                            event.target.value,
                        }
                      )
                    }
                  >
                    {COACHES.map((coach) => (
                      <option
                        key={coach.id}
                        value={coach.id}
                      >
                        {coach.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="yf3-checklist-section">
                <h4>
                  <ClipboardCheck size={18} />
                  PRE-CLASS CHECKLIST
                </h4>

                {CLASS_CHECKLIST.map(
                  (item) => {
                    const checked =
                      selected.checks.includes(
                        item.id
                      );

                    return (
                      <label
                        className="yf3-check-row"
                        key={item.id}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleCheck(item.id)
                          }
                        />

                        <span
                          className={
                            checked
                              ? "is-done"
                              : ""
                          }
                        >
                          {item.label}
                        </span>
                      </label>
                    );
                  }
                )}
              </div>

              <label className="yf3-field">
                <span>STAFF SESSION NOTES</span>

                <textarea
                  rows={5}
                  maxLength={500}
                  value={selected.staffNote}
                  onChange={(event) =>
                    updateSession(
                      selected.id,
                      {
                        note:
                          event.target.value,
                      }
                    )
                  }
                  placeholder="Coach instructions, equipment requirements, or class preparation notes..."
                />
              </label>

              <div className="yf3-saved-hint">
                <CheckCircle2 size={16} />

                Changes save automatically
                in this browser.
              </div>
            </div>
          ) : (
            <EmptyState
              title="Select a class"
              description="Choose a scheduled class from the list to manage its operational details."
            />
          )}
        </section>
      </div>

      <div className="yf3-info-banner">
        <Info size={20} />

        <p>
          <strong>Staff-only scheduling:</strong>{" "}
          changes to coach assignments and
          status update this Operations
          Portal, but they do not modify
          the public booking calendar yet.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 03 — COACH SCHEDULING
// ==========================================

export function StaffCoachesPage() {
  const {
    classes,
    classDates,
    updateSession,
  } = useOperations();

  const [date, setDate] = useState(
    classDates[0] || ""
  );

  const [coachFilter, setCoachFilter] =
    useState("all");

  const currentClasses = classes.filter(
    (item) =>
      item.date === date &&
      (coachFilter === "all" ||
        item.assignedCoachId ===
          coachFilter)
  );

  const getCoachLoad = (coachId) =>
    classes.filter(
      (item) =>
        item.assignedCoachId === coachId
    ).length;

  return (
    <div className="yf3-page">
      <PageHeading
        eyebrow="COACH MANAGEMENT / 03"
        title={
          <>
            THE PEOPLE.
            <br />
            <em>BEHIND THE WORK.</em>
          </>
        }
        description="See each coach's assigned classes and coordinate training sessions from one workspace."
      />

      <div className="yf3-coach-grid">
        {COACHES.map((coach, index) => (
          <button
            type="button"
            key={coach.id}
            className={`yf3-coach-card ${
              coachFilter === coach.id
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              setCoachFilter(
                coachFilter === coach.id
                  ? "all"
                  : coach.id
              )
            }
          >
            <div className="yf3-coach-index">
              <span>
                COACH /{" "}
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <ArrowUpRight size={19} />
            </div>

            <div className="yf3-coach-avatar">
              {coach.initials}
            </div>

            <strong>{coach.name}</strong>

            <span>{coach.role}</span>

            <div className="yf3-coach-bottom">
              <small>ASSIGNED SESSIONS</small>

              <b>{getCoachLoad(coach.id)}</b>
            </div>
          </button>
        ))}
      </div>

      <section className="yf3-panel">
        <PanelHeading
          eyebrow="DAILY COACH BOARD"
          title="Training assignments."
          right={
            <span className="yf3-count-label">
              {currentClasses.length} CLASSES
            </span>
          }
        />

        <div className="yf3-filter-bar yf3-inside-filters">
          <label className="yf3-field">
            <span>TRAINING DAY</span>

            <select
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            >
              {classDates.map((key) => (
                <option
                  key={key}
                  value={key}
                >
                  {dayLabel(key)}
                </option>
              ))}
            </select>
          </label>

          <label className="yf3-field">
            <span>COACH FILTER</span>

            <select
              value={coachFilter}
              onChange={(event) =>
                setCoachFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Coaches
              </option>

              {COACHES.map((coach) => (
                <option
                  key={coach.id}
                  value={coach.id}
                >
                  {coach.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {currentClasses.length ? (
          <div className="yf3-assignment-list">
            {currentClasses.map((item) => (
              <div
                className="yf3-assignment"
                key={item.id}
              >
                <div className="yf3-assignment-time">
                  <Clock3 size={18} />

                  {timeLabel(item.time)}
                </div>

                <div className="yf3-assignment-program">
                  <strong>
                    {item.program?.name}
                  </strong>

                  <span>
                    {item.program?.category}
                    {" · "}
                    {item.program?.duration}
                    {" min"}
                  </span>
                </div>

                <label className="yf3-field">
                  <span>ASSIGN COACH</span>

                  <select
                    value={
                      item.assignedCoachId
                    }
                    onChange={(event) =>
                      updateSession(
                        item.id,
                        {
                          coachId:
                            event.target.value,
                        }
                      )
                    }
                  >
                    {COACHES.map((coach) => (
                      <option
                        key={coach.id}
                        value={coach.id}
                      >
                        {coach.name}
                      </option>
                    ))}
                  </select>
                </label>

                <StageBadge
                  stage={item.stage}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching assignments"
            description="Select another day or coach to see more class assignments."
          />
        )}
      </section>

      <div className="yf3-info-banner">
        <ShieldCheck size={20} />

        <p>
          Coach workload counts are based
          on the upcoming demo sessions.
          Assignments here are operational
          planning data, not real staff
          schedules or availability.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 04 — MEMBER DESK
// ==========================================

export function StaffMembersPage() {
  const {
    reservations,
    reserveSession,
  } = useStudio();

  const {
    classes,
    attendance,
    setAttendance,
    cancelBooking,
  } = useOperations();

  const [alias, setAlias] =
    useState("");

  const [sessionId, setSessionId] =
    useState("");

  const [query, setQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [feedback, setFeedback] =
    useState(null);

  const openClasses = classes.filter(
    (item) => item.remaining > 0
  );

  const bookingSessionId =
    openClasses.some(
      (item) => item.id === sessionId
    )
      ? sessionId
      : openClasses[0]?.id || "";

  const sessionMap = useMemo(
    () =>
      new Map(
        classes.map((item) => [
          item.id,
          item,
        ])
      ),
    [classes]
  );

  const filtered = reservations
    .filter((record) => {
      const classInfo =
        sessionMap.get(record.sessionId);

      const combined = [
        record.alias,
        classInfo?.program?.name,
        record.date,
        record.time,
      ]
        .join(" ")
        .toLowerCase();

      const status =
        attendance[record.id] || "pending";

      return (
        combined.includes(
          query.trim().toLowerCase()
        ) &&
        (statusFilter === "all" ||
          status === statusFilter)
      );
    })
    .sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(
        `${b.date} ${b.time}`
      )
    );

  function handleRegistration(event) {
    event.preventDefault();

    setFeedback(null);

    const result = reserveSession(
      bookingSessionId,
      alias
    );

    if (result.ok) {
      setAlias("");

      setFeedback({
        type: "success",
        text: "Demo member reservation saved successfully.",
      });
    } else {
      setFeedback({
        type: "error",
        text:
          result.error ||
          "Could not create the reservation.",
      });
    }
  }

  function handleCancel(record) {
    const approved = window.confirm(
      `Cancel the demo reservation for ${
        record.alias || "this member"
      }?`
    );

    if (approved) {
      cancelBooking(record.id);
    }
  }

  return (
    <div className="yf3-page">
      <PageHeading
        eyebrow="MEMBER OPERATIONS / 04"
        title={
          <>
            EVERY MEMBER.
            <br />
            <em>EVERY SESSION.</em>
          </>
        }
        description="Manage demo class reservations, help members register, and track attendance in one place."
        action={
          <Link
            to="/schedule"
            className="yf3-secondary-button"
          >
            View Public Schedule
            <ArrowUpRight size={17} />
          </Link>
        }
      />

      <div className="yf3-members-layout">
        <section className="yf3-panel">
          <PanelHeading
            eyebrow="FRONT DESK"
            title="Register a demo member."
          />

          <form
            className="yf3-registration-form"
            onSubmit={handleRegistration}
          >
            <label className="yf3-field">
              <span>MEMBER ALIAS</span>

              <input
                value={alias}
                onChange={(event) =>
                  setAlias(
                    event.target.value
                  )
                }
                maxLength={40}
                required
                placeholder="e.g. Member Alex"
              />
            </label>

            <label className="yf3-field">
              <span>CHOOSE A CLASS</span>

              <select
                value={bookingSessionId}
                onChange={(event) =>
                  setSessionId(
                    event.target.value
                  )
                }
                disabled={
                  !openClasses.length
                }
              >
                {openClasses.length ? (
                  openClasses.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {dayLabel(item.date)}
                      {" — "}
                      {timeLabel(item.time)}
                      {" / "}
                      {item.program?.name}
                    </option>
                  ))
                ) : (
                  <option value="">
                    No available classes
                  </option>
                )}
              </select>
            </label>

            <button
              type="submit"
              className="yf3-primary-button"
              disabled={
                !alias.trim() ||
                !bookingSessionId
              }
            >
              <Plus size={18} />
              Create Reservation
            </button>

            {feedback && (
              <div
                role="status"
                className={`yf3-form-message ${
                  feedback.type
                }`}
              >
                {feedback.type ===
                  "success" ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <Info size={17} />
                )}

                <span>
                  {feedback.text}
                </span>
              </div>
            )}
          </form>

          <div className="yf3-desk-notice">
            <Info size={18} />

            <p>
              Use fictional member aliases.
              No real contact details,
              payment information, or ID
              documents are needed.
            </p>
          </div>
        </section>

        <section className="yf3-panel">
          <PanelHeading
            eyebrow="MEMBER ACTIVITY"
            title="Booking overview."
          />

          <div className="yf3-member-summary">
            <div>
              <span>TOTAL BOOKINGS</span>

              <strong>
                {reservations.length}
              </strong>
            </div>

            <div>
              <span>CHECKED IN</span>

              <strong>
                {
                  reservations.filter(
                    (item) =>
                      attendance[item.id] ===
                      "checked-in"
                  ).length
                }
              </strong>
            </div>

            <div>
              <span>NO SHOW</span>

              <strong>
                {
                  reservations.filter(
                    (item) =>
                      attendance[item.id] ===
                      "no-show"
                  ).length
                }
              </strong>
            </div>
          </div>

          <p className="yf3-summary-note">
            All records are stored locally
            in this browser and are not
            shared across devices.
          </p>
        </section>
      </div>

      <section className="yf3-panel">
        <PanelHeading
          eyebrow="BOOKING MANAGEMENT"
          title="Member reservations."
          right={
            <span className="yf3-count-label">
              {filtered.length} RECORDS
            </span>
          }
        />

        <div className="yf3-filter-bar yf3-inside-filters">
          <label className="yf3-field yf3-search-field">
            <span>SEARCH BOOKINGS</span>

            <div className="yf3-search">
              <Search size={17} />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Name, program, or date..."
              />
            </div>
          </label>

          <label className="yf3-field">
            <span>ATTENDANCE</span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Records
              </option>

              {ATTENDANCE_STATES.map(
                (item) => (
                  <option
                    value={item.id}
                    key={item.id}
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </label>
        </div>

        {filtered.length ? (
          <div className="yf3-roster-list">
            {filtered.map((record) => {
              const classInfo =
                sessionMap.get(
                  record.sessionId
                );

              const status =
                attendance[record.id] ||
                "pending";

              return (
                <div
                  key={record.id}
                  className="yf3-roster-record"
                >
                  <div className="yf3-roster-avatar">
                    {(record.alias ||
                      "M")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="yf3-roster-details">
                    <strong>
                      {record.alias ||
                        "Demo Member"}
                    </strong>

                    <span>
                      {classInfo?.program
                        ?.name ||
                        record.programId ||
                        "Training Class"}
                    </span>

                    <small>
                      <CalendarDays size={13} />

                      {dayLabel(
                        record.date
                      )}
                      {" · "}
                      {timeLabel(
                        record.time
                      )}
                    </small>
                  </div>

                  <AttendanceBadge
                    status={status}
                  />

                  <div className="yf3-roster-actions">
                    <label className="yf3-field">
                      <span>ATTENDANCE</span>

                      <select
                        value={status}
                        onChange={(event) =>
                          setAttendance(
                            record.id,
                            event.target.value
                          )
                        }
                      >
                        {ATTENDANCE_STATES.map(
                          (item) => (
                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.label}
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    <button
                      type="button"
                      className="yf3-icon-danger"
                      aria-label={`Cancel ${
                        record.alias
                      } reservation`}
                      title="Cancel demo reservation"
                      onClick={() =>
                        handleCancel(record)
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No matching reservations"
            description="Create a demo booking above or reserve a class from the public schedule to see it here."
          >
            <Link
              to="/schedule"
              className="yf3-text-link"
            >
              Open Public Schedule
              <ArrowRight size={16} />
            </Link>
          </EmptyState>
        )}
      </section>

      <div className="yf3-info-banner">
        <Activity size={20} />

        <p>
          <strong>Connected demo flow:</strong>{" "}
          Creating or cancelling bookings
          here updates the same reservation
          records used by the public My
          Studio page. Attendance statuses
          remain staff-side operational
          records.
        </p>
      </div>
    </div>
  );
}