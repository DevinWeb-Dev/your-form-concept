import {
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarCheck2,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Dumbbell,
  Layers3,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Target,
  Trash2,
} from "lucide-react";

import {
  useStudio,
} from "../context/StudioContext.jsx";

import {
  useTraining,
} from "../context/TrainingContext.jsx";

import {
  EXERCISE_LIBRARY,
  FOCUS_OPTIONS,
  PLAN_TEMPLATES,
  TRAINING_DAYS,
  displayTrainingDate,
  getExercise,
  getFocus,
  toDateKey,
} from "../data/trainingData.js";

import {
  findProgram,
  formatTime,
} from "../data/studioData.js";

// =========================================
// REUSABLE PAGE COMPONENTS
// =========================================

function PageTitle({
  eyebrow,
  title,
  accent,
  description,
  children,
}) {
  return (
    <div className="yf2-page-title">
      <div>
        <span className="yf-eyebrow">
          {eyebrow}
        </span>

        <h2>
          {title}
          <br />
          <em>{accent}</em>
        </h2>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {children}
    </div>
  );
}

function Message({
  children,
  error = false,
}) {
  if (!children) return null;

  return (
    <p
      className={`yf2-message ${
        error ? "is-error" : ""
      }`}
      role={error ? "alert" : "status"}
    >
      {error ? (
        <ShieldCheck size={19} />
      ) : (
        <CheckCircle2 size={19} />
      )}

      {children}
    </p>
  );
}

function EmptyState({
  icon: Icon = Dumbbell,
  title,
  description,
  link,
  linkLabel,
}) {
  return (
    <div className="yf2-empty">
      <Icon size={35} />

      <h3>{title}</h3>

      <p>{description}</p>

      {link && (
        <Link
          to={link}
          className="yf-button is-dark"
        >
          {linkLabel}
          <ArrowUpRight size={18} />
        </Link>
      )}
    </div>
  );
}

function PlanTag({ focus }) {
  return (
    <span className="yf2-plan-tag">
      {getFocus(focus)?.name ||
        "Training"}
    </span>
  );
}

function ProgressTrack({
  value = 0,
  label = "",
}) {
  return (
    <div
      className="yf2-track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(
        Math.max(0, Math.min(100, value))
      )}
    >
      <span
        style={{
          width: `${Math.max(
            0,
            Math.min(100, value)
          )}%`,
        }}
      />
    </div>
  );
}

// =========================================
// 1 — MEMBER DASHBOARD
// =========================================

export function MemberDashboardPage() {
  const {
    reservations,
    membership,
  } = useStudio();

  const {
    plans,
    logs,
    goals,
    stats,
  } = useTraining();

  const now = toDateKey();

  const nextClass = [...reservations]
    .filter(
      (item) => item.date >= now
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.time.localeCompare(b.time)
    )[0];

  const latestLogs = [...logs]
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        b.createdAt.localeCompare(a.createdAt)
    )
    .slice(0, 4);

  const todayWeekday =
    new Date().getDay();

  const scheduledPlans = plans.filter(
    (plan) =>
      plan.days.includes(todayWeekday)
  );

  return (
    <div className="yf2-page">
      <PageTitle
        eyebrow="01 / MEMBER COMMAND CENTER"
        title="YOUR TRAINING."
        accent="AT A GLANCE."
        description="One personal space for your sample workout plans, journal activity, goals, and class reservations."
      >
        <Link
          className="yf-button is-dark"
          to="/member/journal"
        >
          Log a Workout
          <ArrowUpRight size={18} />
        </Link>
      </PageTitle>

      <div className="yf2-kpis">
        <article>
          <Dumbbell size={25} />

          <strong>{stats.savedPlans}</strong>

          <span>
            Saved Workout Plans
          </span>

          <small>
            Personalized demo routines
          </small>
        </article>

        <article>
          <CalendarCheck2 size={25} />

          <strong>{stats.thisWeek}</strong>

          <span>
            Sessions This Week
          </span>

          <small>
            Manually logged entries
          </small>
        </article>

        <article>
          <Clock3 size={25} />

          <strong>
            {stats.weeklyMinutes}
          </strong>

          <span>
            Minutes Logged This Week
          </span>

          <small>
            Based on demo journal
          </small>
        </article>

        <article>
          <Target size={25} />

          <strong>
            {stats.target}
          </strong>

          <span>
            Weekly Session Goal
          </span>

          <small>
            Adjustable personal target
          </small>
        </article>
      </div>

      <div className="yf2-dashboard-grid">
        <section className="yf2-panel yf2-goal-card">
          <span className="yf-eyebrow">
            WEEKLY PROGRESS
          </span>

          <h3>
            THE WORK
            <br />
            <em>ADDS UP.</em>
          </h3>

          <div className="yf2-big-goal">
            <strong>
              {Math.round(stats.completion)}
              <span>%</span>
            </strong>

            <p>
              Toward your weekly
              training target
            </p>
          </div>

          <ProgressTrack
            value={stats.completion}
            label="Weekly session goal progress"
          />

          <div className="yf2-goal-footer">
            <span>
              {stats.thisWeek} / {goals.weeklySessions}
              {" "}sessions
            </span>

            <Link to="/member/progress">
              Adjust Goals
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <section className="yf2-panel">
          <span className="yf-eyebrow">
            TODAY / WORKOUT PLANNING
          </span>

          <h3>
            ON THE
            <br />
            <em>AGENDA.</em>
          </h3>

          {scheduledPlans.length ? (
            <div className="yf2-today-list">
              {scheduledPlans.map((plan) => (
                <div key={plan.id}>
                  <span>
                    <Dumbbell size={20} />
                  </span>

                  <div>
                    <strong>
                      {plan.name}
                    </strong>

                    <small>
                      {plan.exerciseIds.length}
                      {" "}exercises
                    </small>
                  </div>

                  <Link
                    to={`/member/journal?plan=${encodeURIComponent(
                      plan.id
                    )}`}
                    aria-label={`Log ${plan.name}`}
                  >
                    <ArrowUpRight size={19} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="yf2-soft-copy">
              No workout plan assigned to
              today. Open the planner to
              choose your training days.
            </p>
          )}

          <Link
            className="yf2-underlined-link"
            to="/member/planner"
          >
            Open Workout Planner
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>

      <div className="yf2-dashboard-grid">
        <section className="yf2-panel">
          <span className="yf-eyebrow">
            RECENT JOURNAL ENTRIES
          </span>

          <h3>
            YOUR LAST
            <br />
            <em>SESSIONS.</em>
          </h3>

          {latestLogs.length ? (
            <div className="yf2-entry-list">
              {latestLogs.map((log) => (
                <div key={log.id}>
                  <span className="yf2-entry-icon">
                    <Activity size={19} />
                  </span>

                  <div>
                    <strong>
                      {log.planName}
                    </strong>

                    <small>
                      {displayTrainingDate(log.date)}
                    </small>
                  </div>

                  <b>
                    {log.minutes} MIN
                  </b>
                </div>
              ))}
            </div>
          ) : (
            <p className="yf2-soft-copy">
              Your journal is empty.
              Save your first demo workout
              to begin seeing activity here.
            </p>
          )}

          <Link
            to="/member/journal"
            className="yf2-underlined-link"
          >
            View Workout Journal
            <ArrowRight size={18} />
          </Link>
        </section>

        <section className="yf2-panel yf2-next-class">
          <span className="yf-eyebrow is-orange">
            STUDIO EXPERIENCE
          </span>

          <h3>
            BEYOND
            <br />
            <em>THE PLAN.</em>
          </h3>

          {nextClass ? (
            <div className="yf2-next-class-content">
              <span>
                UPCOMING DEMO CLASS
              </span>

              <strong>
                {findProgram(nextClass.programId)
                  ?.name || "Group Session"}
              </strong>

              <p>
                {displayTrainingDate(
                  nextClass.date
                )}
                {" · "}
                {formatTime(
                  nextClass.time
                )}
              </p>
            </div>
          ) : (
            <p>
              Nothing saved to your class
              calendar yet. Explore the
              studio schedule and add
              a fictional reservation.
            </p>
          )}

          <div className="yf2-next-class-footer">
            <span>
              Membership interest:
              {" "}
              <strong>
                {membership?.name ||
                  "None"}
              </strong>
            </span>

            <Link to="/my-studio">
              Open My Studio
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      </div>

      <div className="yf2-quick-grid">
        <Link to="/member/planner">
          <Layers3 size={24} />
          <span>BUILD A TRAINING PLAN</span>
          <ArrowUpRight size={19} />
        </Link>

        <Link to="/member/journal">
          <BookOpen size={24} />
          <span>RECORD A SESSION</span>
          <ArrowUpRight size={19} />
        </Link>

        <Link to="/member/progress">
          <BarChart3 size={24} />
          <span>EXPLORE YOUR PROGRESS</span>
          <ArrowUpRight size={19} />
        </Link>
      </div>
    </div>
  );
}

// =========================================
// 2 — WORKOUT PLANNER
// =========================================

function emptyPlanForm() {
  return {
    name: "",
    focus: "general",
    exerciseIds: [],
    days: [1, 3, 5],
  };
}

export function WorkoutPlannerPage() {
  const {
    plans,
    savePlan,
    deletePlan,
  } = useTraining();

  const [form, setForm] = useState(
    emptyPlanForm
  );

  const [editingId, setEditingId] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const categories = [
    "Strength",
    "Conditioning",
    "Mobility",
  ];

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
    setMessage("");
  }

  function toggleExercise(id) {
    setForm((current) => ({
      ...current,

      exerciseIds:
        current.exerciseIds.includes(id)
          ? current.exerciseIds.filter(
              (item) => item !== id
            )
          : [
              ...current.exerciseIds,
              id,
            ],
    }));

    setError("");
    setMessage("");
  }

  function toggleDay(day) {
    setForm((current) => ({
      ...current,

      days: current.days.includes(day)
        ? current.days.filter(
            (item) => item !== day
          )
        : [...current.days, day],
    }));

    setError("");
    setMessage("");
  }

  function selectTemplate(template) {
    setEditingId("");

    setForm({
      name: template.name,
      focus: template.focus,
      exerciseIds: [
        ...template.exerciseIds,
      ],
      days: [...template.days],
    });

    setMessage(
      "Template loaded. Customize it, then save your demo plan."
    );

    setError("");

    document.getElementById(
      "yf2-plan-editor"
    )?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function editPlan(plan) {
    setEditingId(plan.id);

    setForm({
      name: plan.name,
      focus: plan.focus,
      exerciseIds: [
        ...plan.exerciseIds,
      ],
      days: [...plan.days],
    });

    setError("");
    setMessage("");

    document.getElementById(
      "yf2-plan-editor"
    )?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function resetForm() {
    setForm(emptyPlanForm());
    setEditingId("");
    setError("");
    setMessage("");
  }

  function submit(event) {
    event.preventDefault();

    const result = savePlan(
      form,
      editingId
    );

    if (!result.ok) {
      setError(result.error);
      setMessage("");
      return;
    }

    setError("");

    setMessage(
      editingId
        ? "Workout plan updated in this browser."
        : "Workout plan saved in your Member Hub."
    );

    setEditingId("");
    setForm(emptyPlanForm());
  }

  function remove(plan) {
    if (
      !window.confirm(
        `Delete the demo plan "${plan.name}"? Previously saved journal entries will remain.`
      )
    ) {
      return;
    }

    deletePlan(plan.id);

    if (editingId === plan.id) {
      resetForm();
    }

    setMessage(
      "Demo plan deleted. Existing journal history was preserved."
    );

    setError("");
  }

  return (
    <div className="yf2-page">
      <PageTitle
        eyebrow="02 / WORKOUT DESIGN STUDIO"
        title="BUILD YOUR"
        accent="BLUEPRINT."
        description="Choose an exercise combination, set your training days, and save a fictional routine you can later record in your workout journal."
      />

      <div className="yf2-template-section">
        <div className="yf2-section-label">
          <span className="yf-eyebrow">
            QUICK START / TRAINING CONCEPTS
          </span>

          <p>
            Choose a template or create
            a routine from scratch.
          </p>
        </div>

        <div className="yf2-template-grid">
          {PLAN_TEMPLATES.map(
            (template, index) => (
              <button
                type="button"
                key={template.id}
                className="yf2-template"
                onClick={() =>
                  selectTemplate(template)
                }
              >
                <span>
                  TEMPLATE 0{index + 1}
                </span>

                <h3>
                  {template.name}
                </h3>

                <p>
                  {template.description}
                </p>

                <div>
                  {template.exerciseIds.length}
                  {" "}EXERCISES

                  <ArrowUpRight size={20} />
                </div>
              </button>
            )
          )}
        </div>
      </div>

      <div className="yf2-editor-layout">
        <form
          id="yf2-plan-editor"
          className="yf2-panel yf2-plan-editor"
          onSubmit={submit}
        >
          <div className="yf2-panel-heading">
            <span className="yf-eyebrow">
              {editingId
                ? "EDIT YOUR SAVED PLAN"
                : "CREATE A NEW WORKOUT PLAN"}
            </span>

            <h3>
              THE PLAN
              <br />
              <em>STARTS HERE.</em>
            </h3>
          </div>

          <label className="yf2-field">
            <span>WORKOUT PLAN NAME</span>

            <input
              required
              minLength={2}
              maxLength={55}
              value={form.name}
              onChange={(event) =>
                update(
                  "name",
                  event.target.value
                )
              }
              placeholder="e.g. My Strength Days"
            />
          </label>

          <label className="yf2-field">
            <span>PRIMARY TRAINING FOCUS</span>

            <select
              value={form.focus}
              onChange={(event) =>
                update(
                  "focus",
                  event.target.value
                )
              }
            >
              {FOCUS_OPTIONS.map(
                (focus) => (
                  <option
                    key={focus.id}
                    value={focus.id}
                  >
                    {focus.name}
                  </option>
                )
              )}
            </select>
          </label>

          <div className="yf2-editor-group">
            <div className="yf2-editor-group-title">
              <span className="yf-eyebrow">
                WEEKLY TRAINING DAYS
              </span>

              <strong>
                {form.days.length}
                {" "}SELECTED
              </strong>
            </div>

            <div className="yf2-day-picker">
              {TRAINING_DAYS.map(
                (day) => (
                  <button
                    type="button"
                    key={day.id}
                    aria-pressed={
                      form.days.includes(day.id)
                    }
                    className={
                      form.days.includes(day.id)
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      toggleDay(day.id)
                    }
                  >
                    {day.short}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="yf2-editor-group">
            <div className="yf2-editor-group-title">
              <span className="yf-eyebrow">
                EXERCISE LIBRARY
              </span>

              <strong>
                {form.exerciseIds.length}
                /8 SELECTED
              </strong>
            </div>

            <p className="yf2-soft-copy">
              Choose 1–8 example exercise
              patterns. The suggested sets
              and repetitions are illustrative,
              not personalized prescriptions.
            </p>

            {categories.map(
              (category) => (
                <div
                  className="yf2-exercise-category"
                  key={category}
                >
                  <h4>{category}</h4>

                  <div className="yf2-exercise-grid">
                    {EXERCISE_LIBRARY.filter(
                      (exercise) =>
                        exercise.category ===
                        category
                    ).map((exercise) => {
                      const selected =
                        form.exerciseIds.includes(
                          exercise.id
                        );

                      return (
                        <label
                          key={exercise.id}
                          className={`yf2-exercise-choice ${
                            selected
                              ? "is-active"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={
                              !selected &&
                              form.exerciseIds.length >=
                                8
                            }
                            onChange={() =>
                              toggleExercise(
                                exercise.id
                              )
                            }
                          />

                          <span className="yf2-exercise-check">
                            {selected && (
                              <Check size={17} />
                            )}
                          </span>

                          <span>
                            <strong>
                              {exercise.name}
                            </strong>

                            <small>
                              {exercise.prescription}
                            </small>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>

          <Message error>
            {error}
          </Message>

          <Message>
            {message}
          </Message>

          <div className="yf2-editor-actions">
            <button
              type="submit"
              className="yf-button is-orange"
            >
              <Save size={18} />

              {editingId
                ? "Save Plan Changes"
                : "Save Workout Plan"}
            </button>

            <button
              type="button"
              className="yf2-button-muted"
              onClick={resetForm}
            >
              <RotateCcw size={17} />
              Clear Editor
            </button>
          </div>
        </form>

        <aside className="yf2-planner-preview">
          <span className="yf-eyebrow is-orange">
            LIVE PLAN PREVIEW
          </span>

          <h3>
            {form.name ||
              "YOUR NEW PLAN"}
            <em>.</em>
          </h3>

          <PlanTag focus={form.focus} />

          <div className="yf2-preview-section">
            <strong>
              SELECTED DAYS
            </strong>

            <p>
              {TRAINING_DAYS.filter(
                (day) =>
                  form.days.includes(day.id)
              )
                .map((day) => day.short)
                .join(" / ") ||
                "None selected"}
            </p>
          </div>

          <div className="yf2-preview-section">
            <strong>
              EXERCISE LINEUP
            </strong>

            {form.exerciseIds.length ? (
              <ol>
                {form.exerciseIds.map(
                  (id) => (
                    <li key={id}>
                      {getExercise(id)?.name}
                    </li>
                  )
                )}
              </ol>
            ) : (
              <p>
                Choose an exercise to
                begin building this plan.
              </p>
            )}
          </div>

          <div className="yf2-preview-footnote">
            <ShieldCheck size={19} />

            <p>
              This is a portfolio workout
              planner, not an exercise
              safety evaluation.
            </p>
          </div>
        </aside>
      </div>

      <section className="yf2-saved-plans">
        <div className="yf2-section-heading-row">
          <div>
            <span className="yf-eyebrow">
              YOUR LOCAL COLLECTION
            </span>

            <h3>
              SAVED <em>PLANS.</em>
            </h3>
          </div>

          <span>
            {plans.length}/10 PLANS
          </span>
        </div>

        {plans.length ? (
          <div className="yf2-saved-plan-grid">
            {plans.map((plan) => (
              <article
                className="yf2-saved-plan"
                key={plan.id}
              >
                <div className="yf2-saved-plan-top">
                  <PlanTag
                    focus={plan.focus}
                  />

                  <Dumbbell size={25} />
                </div>

                <h4>{plan.name}</h4>

                <p>
                  {plan.exerciseIds.length}
                  {" "}exercise patterns
                </p>

                <div className="yf2-saved-plan-days">
                  {TRAINING_DAYS.map(
                    (day) => (
                      <span
                        key={day.id}
                        className={
                          plan.days.includes(day.id)
                            ? "is-on"
                            : ""
                        }
                      >
                        {day.short.slice(0, 1)}
                      </span>
                    )
                  )}
                </div>

                <div className="yf2-saved-plan-actions">
                  <button
                    type="button"
                    onClick={() =>
                      editPlan(plan)
                    }
                  >
                    Edit
                    <ArrowRight size={16} />
                  </button>

                  <Link
                    to={`/member/journal?plan=${encodeURIComponent(
                      plan.id
                    )}`}
                  >
                    Log Session
                    <ArrowUpRight size={16} />
                  </Link>

                  <button
                    type="button"
                    aria-label={`Delete ${plan.name}`}
                    onClick={() =>
                      remove(plan)
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="NO WORKOUT PLANS YET."
            description="Create your first fictional routine using the exercise library or one of the quick-start templates above."
            icon={Layers3}
          />
        )}
      </section>
    </div>
  );
}

// =========================================
// 3 — WORKOUT JOURNAL
// =========================================

export function WorkoutJournalPage() {
  const {
    plans,
    logs,
    addWorkoutLog,
    deleteWorkoutLog,
  } = useTraining();

  const [params] = useSearchParams();

  const initialPlan = params.get("plan");

  const [form, setForm] =
    useState(() => ({
      planId: plans.some(
        (plan) => plan.id === initialPlan
      )
        ? initialPlan
        : plans[0]?.id || "",
      date: toDateKey(),
      minutes: "45",
      note: "",
    }));

  const [filter, setFilter] =
    useState("all");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const ordered = [...logs]
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        b.createdAt.localeCompare(a.createdAt)
    )
    .filter(
      (log) =>
        filter === "all" ||
        log.planId === filter
    );

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
    setMessage("");
  }

  function submit(event) {
    event.preventDefault();

    const result = addWorkoutLog(
      form
    );

    if (!result.ok) {
      setError(result.error);
      setMessage("");
      return;
    }

    setError("");

    setMessage(
      "Sample workout saved to your browser-local journal."
    );

    setForm((current) => ({
      ...current,
      date: toDateKey(),
      note: "",
    }));
  }

  function removeEntry(entry) {
    if (
      !window.confirm(
        `Remove the demo workout logged on ${displayTrainingDate(
          entry.date
        )}?`
      )
    ) {
      return;
    }

    deleteWorkoutLog(entry.id);

    setMessage(
      "Journal entry removed."
    );

    setError("");
  }

  return (
    <div className="yf2-page">
      <PageTitle
        eyebrow="03 / WORKOUT ACTIVITY JOURNAL"
        title="SHOW UP."
        accent="WRITE IT DOWN."
        description="Record fictional workout sessions, keep sample activity history, and let the member dashboard update automatically."
      />

      <div className="yf2-journal-layout">
        <form
          className="yf2-panel yf2-journal-form"
          onSubmit={submit}
        >
          <div className="yf2-panel-heading">
            <span className="yf-eyebrow">
              RECORD A TRAINING SESSION
            </span>

            <h3>
              TODAY'S
              <br />
              <em>WORK.</em>
            </h3>
          </div>

          {plans.length ? (
            <>
              <label className="yf2-field">
                <span>
                  CHOOSE YOUR WORKOUT PLAN
                </span>

                <select
                  required
                  value={form.planId}
                  onChange={(event) =>
                    update(
                      "planId",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Choose a saved plan
                  </option>

                  {plans.map((plan) => (
                    <option
                      value={plan.id}
                      key={plan.id}
                    >
                      {plan.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="yf2-form-two">
                <label className="yf2-field">
                  <span>
                    SAMPLE WORKOUT DATE
                  </span>

                  <input
                    type="date"
                    required
                    min="2000-01-01"
                    max={toDateKey()}
                    value={form.date}
                    onChange={(event) =>
                      update(
                        "date",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="yf2-field">
                  <span>
                    SESSION DURATION / MIN
                  </span>

                  <input
                    type="number"
                    min={10}
                    max={180}
                    step={1}
                    required
                    value={form.minutes}
                    onChange={(event) =>
                      update(
                        "minutes",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>

              <label className="yf2-field">
                <span>
                  OPTIONAL DEMO JOURNAL NOTE
                </span>

                <textarea
                  rows={4}
                  maxLength={160}
                  placeholder="Example: Finished the sample routine with a cooldown."
                  value={form.note}
                  onChange={(event) =>
                    update(
                      "note",
                      event.target.value
                    )
                  }
                />

                <small>
                  Up to 160 characters.
                  Avoid entering medical
                  or personal information.
                </small>
              </label>

              <Message error>
                {error}
              </Message>

              <Message>
                {message}
              </Message>

              <button
                className="yf-button is-orange"
                type="submit"
              >
                <Plus size={18} />
                Save Workout Entry
              </button>
            </>
          ) : (
            <EmptyState
              icon={Dumbbell}
              title="BUILD A PLAN FIRST."
              description="Create a sample workout plan before adding an entry to your journal."
              link="/member/planner"
              linkLabel="Open Workout Planner"
            />
          )}
        </form>

        <aside className="yf2-journal-aside">
          <span className="yf-eyebrow is-orange">
            THE RECORD
          </span>

          <h3>
            SMALL
            <br />
            ACTIONS.
            <br />
            <em>REAL HABITS.</em>
          </h3>

          <p>
            A clear activity journal can
            help people visualize how often
            they follow their chosen routine.
            This prototype shows the user
            experience using sample entries.
          </p>

          <div>
            <BookOpen size={25} />

            <strong>
              {logs.length}
            </strong>

            <span>
              TOTAL SAVED ENTRIES
            </span>
          </div>

          <Link
            to="/member/progress"
            className="yf2-aside-link"
          >
            Open Progress Dashboard
            <ArrowUpRight size={18} />
          </Link>
        </aside>
      </div>

      <section className="yf2-journal-history">
        <div className="yf2-section-heading-row">
          <div>
            <span className="yf-eyebrow">
              BROWSER-LOCAL ACTIVITY
            </span>

            <h3>
              YOUR <em>JOURNAL.</em>
            </h3>
          </div>

          <label className="yf2-field yf2-history-filter">
            <span>
              FILTER ENTRIES
            </span>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Workout Plans
              </option>

              {plans.map((plan) => (
                <option
                  key={plan.id}
                  value={plan.id}
                >
                  {plan.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {ordered.length ? (
          <div className="yf2-history-table">
            <div className="yf2-history-header">
              <span>WORKOUT PLAN</span>
              <span>DATE</span>
              <span>DURATION</span>
              <span>ACTION</span>
            </div>

            {ordered.map((log) => (
              <article
                className="yf2-history-row"
                key={log.id}
              >
                <div>
                  <strong>
                    {log.planName}
                  </strong>

                  {log.note && (
                    <small>
                      {log.note}
                    </small>
                  )}
                </div>

                <span>
                  {displayTrainingDate(
                    log.date
                  )}
                </span>

                <b>
                  {log.minutes} MIN
                </b>

                <button
                  type="button"
                  aria-label={`Delete journal entry for ${log.planName}`}
                  onClick={() =>
                    removeEntry(log)
                  }
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="NO ENTRIES FOUND."
            description="Complete the demo journal form above, or change your filter to see saved workout entries."
          />
        )}
      </section>
    </div>
  );
}

// =========================================
// 4 — PROGRESS & GOALS
// =========================================

export function ProgressPage() {
  const {
    plans,
    stats,
    goals,
    saveGoals,
  } = useTraining();

  const [form, setForm] =
    useState(() => ({
      ...goals,
    }));

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const maxDaily = Math.max(
    1,
    ...stats.daily.map(
      (day) => day.count
    )
  );

  const maxWeekly = Math.max(
    1,
    stats.target,
    ...stats.fourWeeks.map(
      (week) => week.count
    )
  );

  const last14 = stats.daily.reduce(
    (total, day) =>
      total + day.count,
    0
  );

  const focusCounts = FOCUS_OPTIONS.map(
    (focus) => ({
      ...focus,

      count: plans.filter(
        (plan) =>
          plan.focus === focus.id
      ).length,
    })
  );

  const totalFocus = focusCounts.reduce(
    (sum, focus) =>
      sum + focus.count,
    0
  );

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
    setMessage("");
  }

  function submit(event) {
    event.preventDefault();

    const result = saveGoals(
      form
    );

    if (!result.ok) {
      setError(result.error);
      setMessage("");
      return;
    }

    setError("");
    setMessage(
      "Training goals saved in this browser."
    );
  }

  return (
    <div className="yf2-page">
      <PageTitle
        eyebrow="04 / ACTIVITY ANALYTICS & TARGETS"
        title="MEASURE THE"
        accent="MOMENTUM."
        description="Explore a clear visual summary of manually logged sessions and customize your illustrative weekly training goals."
      />

      <div className="yf2-kpis">
        <article>
          <CalendarCheck2 size={25} />
          <strong>
            {stats.loggedSessions}
          </strong>
          <span>Total Logged Sessions</span>
          <small>Demo journal history</small>
        </article>

        <article>
          <Clock3 size={25} />
          <strong>
            {stats.totalMinutes}
          </strong>
          <span>Total Logged Minutes</span>
          <small>Manual sample entries</small>
        </article>

        <article>
          <Activity size={25} />
          <strong>{last14}</strong>
          <span>Sessions in Last 14 Days</span>
          <small>Selected two-week window</small>
        </article>

        <article>
          <Target size={25} />
          <strong>
            {Math.round(
              stats.completion
            )}%
          </strong>
          <span>Weekly Target Progress</span>
          <small>Based on logged sessions</small>
        </article>
      </div>

      <section className="yf2-panel yf2-chart-panel">
        <div className="yf2-panel-heading">
          <span className="yf-eyebrow">
            01 / LAST FOURTEEN DAYS
          </span>

          <h3>
            EVERY SESSION
            <br />
            <em>COUNTS.</em>
          </h3>

          <p>
            Each column represents the number
            of sample workouts logged on
            that date, not real-time
            physical activity.
          </p>
        </div>

        <div
          className="yf2-daily-chart"
          role="img"
          aria-label="Workout sessions logged in the past fourteen days"
        >
          {stats.daily.map((day) => (
            <div
              className="yf2-daily-column"
              key={day.key}
              title={`${displayTrainingDate(
                day.key
              )}: ${day.count} sessions`}
            >
              <strong>
                {day.count}
              </strong>

              <div>
                <span
                  style={{
                    height:
                      day.count > 0
                        ? `${
                            (day.count /
                              maxDaily) *
                            100
                          }%`
                        : "0%",
                  }}
                />
              </div>

              <small>
                {day.day}
              </small>

              <b>
                {day.number}
              </b>
            </div>
          ))}
        </div>
      </section>

      <div className="yf2-progress-grid">
        <section className="yf2-panel">
          <div className="yf2-panel-heading">
            <span className="yf-eyebrow">
              02 / FOUR-WEEK HISTORY
            </span>

            <h3>
              WEEK BY
              <br />
              <em>WEEK.</em>
            </h3>
          </div>

          <div className="yf2-weekly-bars">
            {stats.fourWeeks.map(
              (week) => (
                <div
                  key={week.id}
                  className="yf2-weekly-row"
                >
                  <strong>
                    {week.label}
                  </strong>

                  <div>
                    <span
                      style={{
                        width: `${
                          (week.count /
                            maxWeekly) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <b>
                    {week.count}
                  </b>
                </div>
              )
            )}
          </div>
        </section>

        <section className="yf2-panel yf2-progress-summary">
          <div className="yf2-panel-heading">
            <span className="yf-eyebrow">
              03 / WEEKLY GOAL
            </span>

            <h3>
              YOUR
              <br />
              <em>TARGET.</em>
            </h3>
          </div>

          <div className="yf2-progress-number">
            <strong>
              {stats.thisWeek}
            </strong>

            <span>
              / {stats.target}
              {" "}SESSIONS
            </span>
          </div>

          <ProgressTrack
            value={stats.completion}
            label="Weekly goal completion"
          />

          <p>
            {stats.goalReached
              ? "Your illustrative weekly goal has been reached."
              : `${stats.remaining} ${
                  stats.remaining === 1
                    ? "session"
                    : "sessions"
                } remaining to reach your demo weekly target.`}
          </p>
        </section>
      </div>

      <div className="yf2-progress-grid">
        <section className="yf2-panel yf2-goal-settings">
          <div className="yf2-panel-heading">
            <span className="yf-eyebrow">
              04 / PERSONALIZE YOUR EXPERIENCE
            </span>

            <h3>
              SET YOUR
              <br />
              <em>STANDARD.</em>
            </h3>
          </div>

          <form onSubmit={submit}>
            <label className="yf2-field">
              <span>
                WEEKLY SESSION TARGET
              </span>

              <select
                value={form.weeklySessions}
                onChange={(event) =>
                  update(
                    "weeklySessions",
                    event.target.value
                  )
                }
              >
                {[1, 2, 3, 4, 5, 6, 7].map(
                  (amount) => (
                    <option
                      key={amount}
                      value={amount}
                    >
                      {amount} session
                      {amount === 1 ? "" : "s"}
                      {" "}per week
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="yf2-field">
              <span>
                PRIMARY TRAINING INTEREST
              </span>

              <select
                value={form.focus}
                onChange={(event) =>
                  update(
                    "focus",
                    event.target.value
                  )
                }
              >
                {FOCUS_OPTIONS.map(
                  (focus) => (
                    <option
                      key={focus.id}
                      value={focus.id}
                    >
                      {focus.name}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="yf2-field">
              <span>
                YOUR DEMO GOAL STATEMENT
              </span>

              <input
                type="text"
                minLength={3}
                maxLength={60}
                required
                value={form.label}
                onChange={(event) =>
                  update(
                    "label",
                    event.target.value
                  )
                }
              />
            </label>

            <Message error>
              {error}
            </Message>

            <Message>
              {message}
            </Message>

            <button
              type="submit"
              className="yf-button is-orange"
            >
              <Save size={18} />
              Save Training Goals
            </button>
          </form>
        </section>

        <aside className="yf2-focus-panel">
          <span className="yf-eyebrow is-orange">
            YOUR PLAN COLLECTION
          </span>

          <h3>
            YOUR
            <br />
            <em>TRAINING MIX.</em>
          </h3>

          <p>
            An overview of the primary
            focus categories assigned
            to your saved workout plans.
          </p>

          <div className="yf2-focus-list">
            {focusCounts.map(
              (focus) => (
                <div key={focus.id}>
                  <div>
                    <strong>
                      {focus.name}
                    </strong>

                    <span>
                      {focus.count}
                      {" "}plans
                    </span>
                  </div>

                  <div className="yf2-track">
                    <span
                      style={{
                        width:
                          totalFocus
                            ? `${
                                (focus.count /
                                  totalFocus) *
                                100
                              }%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>

          <Link
            to="/member/planner"
            className="yf2-aside-link"
          >
            Manage Workout Plans
            <ArrowUpRight size={18} />
          </Link>
        </aside>
      </div>

      <div className="yf2-progress-disclaimer">
        <ShieldCheck size={20} />

        <p>
          All metrics are calculated from
          manually entered demo workout logs.
          They do not measure calories,
          physical fitness, health outcomes,
          or the safety of a training program.
        </p>
      </div>
    </div>
  );
}