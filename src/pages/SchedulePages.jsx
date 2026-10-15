import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Info,
  ShieldCheck,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";

import {
  PROGRAMS,
  calendarDates,
  findCoach,
  findProgram,
  formatDate,
  formatTime,
  sessionsForDate,
} from "../data/studioData.js";

import {
  useStudio,
} from "../context/StudioContext.jsx";

function PageHeading({
  eyebrow,
  first,
  second,
  description,
}) {
  return (
    <section className="yf-page-hero">
      <div className="yf-container">
        <span className="yf-eyebrow is-orange">
          {eyebrow}
        </span>

        <h1>
          {first}
          <br />
          <em>{second}</em>
        </h1>

        <p>{description}</p>
      </div>
    </section>
  );
}

export function SchedulePage() {
  const {
    reservations,
    reserveSession,
  } = useStudio();

  const [params] = useSearchParams();

  const dates = useMemo(
    () => calendarDates(21),
    []
  );

  const [date, setDate] = useState(
    dates[0]?.key || ""
  );

  const incomingProgram = params.get("program");

  const [programId, setProgramId] = useState(
    findProgram(incomingProgram)?.id || "all"
  );

  const [selectedId, setSelectedId] =
    useState("");

  const [alias, setAlias] = useState("");

  const [acknowledged, setAcknowledged] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sessions = useMemo(
    () => sessionsForDate(date),
    [date]
  );

  const filtered = sessions.filter(
    (session) =>
      programId === "all" ||
      session.programId === programId
  );

  const selectedSession = sessions.find(
    (session) => session.id === selectedId
  );

  const savedIds = new Set(
    reservations.map(
      (item) => item.sessionId
    )
  );

  function selectDate(nextDate) {
    setDate(nextDate);
    setSelectedId("");
    setError("");
    setSuccess("");
  }

  function selectSession(id) {
    setSelectedId(id);
    setAlias("");
    setAcknowledged(false);
    setError("");
    setSuccess("");
  }

  function saveReservation(event) {
    event.preventDefault();

    if (!selectedSession) {
      setError(
        "Please choose a sample class."
      );
      return;
    }

    if (!acknowledged) {
      setError(
        "Please acknowledge that this is not a real class reservation."
      );
      return;
    }

    const result = reserveSession(
      selectedSession.id,
      alias
    );

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(
      `${selectedSession.program.name} was added to My Studio as a browser-local demo reservation.`
    );

    setSelectedId("");
    setError("");
    setAlias("");
    setAcknowledged(false);
  }

  const proposedSeats = selectedSession
    ? Math.max(
        0,
        selectedSession.capacity -
          selectedSession.sampleTaken -
          (savedIds.has(selectedSession.id) ? 1 : 0)
      )
    : 0;

  return (
    <>
      <PageHeading
        eyebrow="YOUR FORM / TRAINING SCHEDULE"
        first="CHOOSE THE DAY."
        second="OWN THE HOUR."
        description="Explore the next 21 days of fictional group classes, preview sample session details, and save a demonstration reservation locally."
      />

      <section className="yf-section yf-container">
        <div className="yf-section-heading">
          <div>
            <span className="yf-eyebrow">
              01 / PICK YOUR DAY
            </span>

            <h2>
              MAKE THE
              <br />
              <em>TIME.</em>
            </h2>
          </div>

          <div className="yf-section-aside">
            <p>
              The schedule is generated from
              fictional weekly class templates.
              No actual capacity is checked.
            </p>
          </div>
        </div>

        <div className="yf-date-scroller">
          {dates.map((item) => (
            <button
              type="button"
              key={item.key}
              aria-pressed={date === item.key}
              className={`yf-date-chip ${
                date === item.key
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                selectDate(item.key)
              }
            >
              <small>{item.dayName}</small>
              <strong>{item.dayNumber}</strong>
              <span>{item.month}</span>
            </button>
          ))}
        </div>

        <div className="yf-schedule-toolbar">
          <div>
            <span className="yf-eyebrow">
              02 / FIND YOUR CLASS
            </span>

            <h2>
              {formatDate(date, {
                weekday: "long",
              })}
            </h2>

            <p>
              {filtered.length} sample
              {" "}
              {filtered.length === 1
                ? "session"
                : "sessions"}{" "}
              shown
            </p>
          </div>

          <label className="yf-select-field">
            <span>FILTER BY PROGRAM</span>

            <select
              value={programId}
              onChange={(event) => {
                setProgramId(event.target.value);
                setSelectedId("");
                setError("");
              }}
            >
              <option value="all">
                All Training Programs
              </option>

              {PROGRAMS.map((program) => (
                <option
                  key={program.id}
                  value={program.id}
                >
                  {program.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="yf-schedule-layout">
          <div className="yf-session-list">
            {filtered.length === 0 ? (
              <div className="yf-schedule-empty">
                <CalendarDays size={36} />

                <h3>
                  NO CLASSES FOR THIS SELECTION.
                </h3>

                <p>
                  Try another date or select
                  a different training program.
                  Sundays are rest days in
                  this example schedule.
                </p>

                <button
                  type="button"
                  className="yf-button is-dark"
                  onClick={() => {
                    setProgramId("all");
                    setSelectedId("");
                  }}
                >
                  Show All Programs
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              filtered.map((session) => {
                const booked = savedIds.has(
                  session.id
                );

                return (
                  <article
                    key={session.id}
                    className={`yf-session-card ${
                      selectedId === session.id
                        ? "is-selected"
                        : ""
                    }`}
                  >
                    <div className="yf-session-time">
                      <span>STARTS AT</span>

                      <strong>
                        {formatTime(session.time)}
                      </strong>

                      <small>
                        {session.program.duration}
                        {" "}MIN
                      </small>
                    </div>

                    <div className="yf-session-info">
                      <span className="yf-eyebrow">
                        {session.program.category}
                      </span>

                      <h3>
                        {session.program.name}
                      </h3>

                      <p>
                        {session.program.short}
                      </p>

                      <div className="yf-session-meta">
                        <span>
                          <UsersRound size={16} />
                          {session.coach?.name}
                        </span>

                        <span>
                          <Clock3 size={16} />
                          {session.program.intensity}
                        </span>
                      </div>
                    </div>

                    <div className="yf-session-action">
                      <small>
                        ILLUSTRATIVE CAPACITY
                      </small>

                      <strong>
                        {session.capacity}
                        {" "}SAMPLE SEATS
                      </strong>

                      <button
                        type="button"
                        disabled={booked}
                        className={`yf-button ${
                          booked
                            ? "is-saved"
                            : "is-orange"
                        }`}
                        onClick={() =>
                          selectSession(session.id)
                        }
                      >
                        {booked
                          ? "Saved"
                          : "Preview Class"}

                        {booked ? (
                          <Check size={17} />
                        ) : (
                          <ArrowUpRight size={17} />
                        )}
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <aside className="yf-schedule-sidebar">
            <div className="yf-booking-panel">
              <div className="yf-booking-panel-header">
                <span className="yf-eyebrow is-orange">
                  03 / YOUR CLASS PREVIEW
                </span>

                <h2>
                  MAKE YOUR
                  <br />
                  <em>MOVE.</em>
                </h2>

                {selectedSession && (
                  <button
                    type="button"
                    aria-label="Close selected class"
                    onClick={() =>
                      setSelectedId("")
                    }
                  >
                    <X size={19} />
                  </button>
                )}
              </div>

              {!selectedSession ? (
                <div className="yf-booking-placeholder">
                  <Dumbbell size={38} />

                  <h3>CHOOSE A SESSION.</h3>

                  <p>
                    Select any demo class to
                    explore its details and
                    save it to your studio hub.
                  </p>
                </div>
              ) : (
                <form
                  className="yf-booking-form"
                  onSubmit={saveReservation}
                >
                  <span className="yf-eyebrow">
                    {selectedSession.program.category}
                  </span>

                  <h3>
                    {selectedSession.program.name}
                  </h3>

                  <div className="yf-booking-facts">
                    <div>
                      <CalendarDays size={17} />

                      <span>
                        {formatDate(
                          selectedSession.date
                        )}
                      </span>
                    </div>

                    <div>
                      <Clock3 size={17} />

                      <span>
                        {formatTime(
                          selectedSession.time
                        )}
                      </span>
                    </div>

                    <div>
                      <UsersRound size={17} />

                      <span>
                        {selectedSession.coach?.name}
                      </span>
                    </div>
                  </div>

                  <div className="yf-demo-seat">
                    <span>
                      ILLUSTRATIVE SPOTS REMAINING
                    </span>

                    <strong>
                      {proposedSeats}
                    </strong>
                  </div>

                  <label className="yf-form-field">
                    <span>
                      FICTIONAL MEMBER ALIAS
                    </span>

                    <input
                      required
                      minLength={2}
                      maxLength={35}
                      placeholder="e.g. Weekend Athlete"
                      value={alias}
                      onChange={(event) => {
                        setAlias(event.target.value);
                        setError("");
                      }}
                    />
                  </label>

                  <label className="yf-check-row">
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(event) =>
                        setAcknowledged(
                          event.target.checked
                        )
                      }
                    />

                    <span>
                      I understand this saves
                      a fictional reservation
                      in my browser only.
                    </span>
                  </label>

                  {error && (
                    <p
                      className="yf-form-error"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="yf-button is-orange"
                  >
                    Save Demo Session
                    <ArrowUpRight size={18} />
                  </button>
                </form>
              )}
            </div>

            <div className="yf-booking-disclaimer">
              <ShieldCheck size={21} />

              <p>
                Class capacities and remaining
                spots are invented examples.
                This demo cannot reserve a
                real space at a fitness facility.
              </p>
            </div>
          </aside>
        </div>

        {success && (
          <div className="yf-success-panel" role="status">
            <CheckCircle2 size={23} />

            <span>{success}</span>

            <Link to="/my-studio">
              View My Studio
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

        <div className="yf-demo-note">
          <Info size={22} />

          <p>
            All session times, coaches, and
            capacities are fictional. A locally
            saved booking affects only this browser,
            not the schedule displayed to
            other website visitors.
          </p>
        </div>
      </section>
    </>
  );
}

export function MyStudioPage() {
  const {
    reservations,
    membership,
    cancelReservation,
    removeMembership,
  } = useStudio();

  const [message, setMessage] = useState("");

  const ordered = [...reservations].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.time.localeCompare(b.time)
  );

  const upcoming = ordered.filter(
    (item) => item.date >= (
      new Date().getFullYear() +
      "-" +
      String(new Date().getMonth() + 1).padStart(2, "0") +
      "-" +
      String(new Date().getDate()).padStart(2, "0")
    )
  );

  function removeReservation(id) {
    const confirmed = window.confirm(
      "Remove this fictional class reservation from My Studio?"
    );

    if (!confirmed) return;

    cancelReservation(id);

    setMessage(
      "Demo reservation removed from this browser."
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="YOUR FORM / PERSONAL STUDIO HUB"
        first="YOUR ROUTINE."
        second="YOUR CONTROL."
        description="Keep your saved class plans and membership interest in one simple, browser-local demonstration dashboard."
      />

      <section className="yf-section yf-container">
        <div className="yf-studio-stats">
          <article>
            <CalendarCheck2 size={26} />

            <strong>{upcoming.length}</strong>

            <span>
              Upcoming demo sessions
            </span>
          </article>

          <article>
            <Dumbbell size={26} />

            <strong>
              {new Set(
                upcoming.map(
                  (item) => item.programId
                )
              ).size}
            </strong>

            <span>
              Training programs selected
            </span>
          </article>

          <article>
            <CheckCircle2 size={26} />

            <strong>
              {membership ? "01" : "00"}
            </strong>

            <span>
              Membership interests saved
            </span>
          </article>
        </div>

        <div className="yf-studio-grid">
          <section className="yf-studio-panel">
            <div className="yf-studio-heading">
              <span className="yf-eyebrow">
                01 / YOUR SAVED SESSIONS
              </span>

              <h2>
                THE NEXT
                <br />
                <em>MOVE.</em>
              </h2>

              <Link
                to="/schedule"
                className="yf-text-link"
              >
                Browse Schedule
                <ArrowUpRight size={18} />
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="yf-studio-empty">
                <CalendarDays size={35} />

                <h3>
                  NOTHING BOOKMARKED YET.
                </h3>

                <p>
                  Explore the fictional class
                  schedule and save a session
                  to see it here.
                </p>

                <Link
                  to="/schedule"
                  className="yf-button is-dark"
                >
                  Find a Class
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="yf-studio-reservations">
                {upcoming.map((item) => (
                  <article
                    key={item.id}
                    className="yf-studio-reservation"
                  >
                    <div className="yf-reservation-date">
                      <strong>
                        {new Date(
                          `${item.date}T12:00:00`
                        ).getDate()}
                      </strong>

                      <span>
                        {formatDate(
                          item.date,
                          { month: "short" }
                        )}
                      </span>
                    </div>

                    <div className="yf-reservation-info">
                      <span className="yf-eyebrow">
                        BROWSER-LOCAL CLASS PLAN
                      </span>

                      <h3>
                        {findProgram(
                          item.programId
                        )?.name ||
                          "Training Session"}
                      </h3>

                      <p>
                        {formatDate(item.date)}
                        {" · "}
                        {formatTime(item.time)}
                      </p>

                      <p>
                        {findCoach(item.coachId)?.name ||
                          "Demo Coach"}
                        {" · "}
                        {item.alias}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Delete demo reservation"
                      onClick={() =>
                        removeReservation(item.id)
                      }
                    >
                      <Trash2 size={19} />
                    </button>
                  </article>
                ))}
              </div>
            )}

            {message && (
              <p
                className="yf-inline-message"
                role="status"
              >
                {message}
              </p>
            )}
          </section>

          <aside className="yf-membership-summary">
            <span className="yf-eyebrow is-orange">
              02 / YOUR MEMBERSHIP INTEREST
            </span>

            {membership ? (
              <>
                <h2>
                  {membership.name}<em>.</em>
                </h2>

                <p>
                  {membership.description}
                </p>

                <div className="yf-membership-saved-price">
                  <strong>
                    {new Intl.NumberFormat(
                      "en-PH",
                      {
                        style: "currency",
                        currency: "PHP",
                        maximumFractionDigits: 0,
                      }
                    ).format(membership.price)}
                  </strong>

                  <span>
                    / MONTH — DEMO PRICE
                  </span>
                </div>

                <div className="yf-membership-saved-actions">
                  <Link
                    to="/memberships"
                    className="yf-button is-orange"
                  >
                    Change Demo Plan
                    <ArrowUpRight size={18} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      removeMembership();
                      setMessage(
                        "Demo membership interest cleared."
                      );
                    }}
                  >
                    Remove Interest
                  </button>
                </div>
              </>
            ) : (
              <>
                <Dumbbell size={44} />

                <h2>
                  CHOOSE YOUR
                  <br />
                  <em>STANDARD.</em>
                </h2>

                <p>
                  Compare fictional membership
                  options and save the one
                  that best fits your goals.
                </p>

                <Link
                  to="/memberships"
                  className="yf-button is-orange"
                >
                  View Memberships
                  <ArrowUpRight size={18} />
                </Link>
              </>
            )}

            <div className="yf-membership-smallprint">
              <ShieldCheck size={18} />

              <span>
                No active subscription,
                actual membership, or payment.
              </span>
            </div>
          </aside>
        </div>

        <div className="yf-demo-note">
          <ShieldCheck size={23} />

          <p>
            My Studio uses browser-local storage.
            Your saved entries may disappear if
            you clear browser data or use another
            device. Do not use real names,
            medical details, or personal
            identifiers in this portfolio demo.
          </p>
        </div>
      </section>
    </>
  );
}