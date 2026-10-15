import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_TRAINING_GOALS,
  EXERCISE_LIBRARY,
  FOCUS_OPTIONS,
  TRAINING_STORAGE,
  fromDateKey,
  summarizeTraining,
  toDateKey,
} from "../data/trainingData.js";

const TrainingContext =
  createContext(null);

const MAX_PLANS = 10;
const MAX_LOGS = 120;

const exerciseIds = new Set(
  EXERCISE_LIBRARY.map(
    (item) => item.id
  )
);

const focusIds = new Set(
  FOCUS_OPTIONS.map(
    (item) => item.id
  )
);

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);

    return raw
      ? JSON.parse(raw)
      : fallback;
  } catch {
    return fallback;
  }
}

function readPlans() {
  const raw = readJSON(
    TRAINING_STORAGE.plans,
    []
  );

  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        focusIds.has(item.focus) &&
        Array.isArray(item.exerciseIds) &&
        Array.isArray(item.days)
    )
    .slice(0, MAX_PLANS)
    .map((item) => ({
      id: item.id,
      name: item.name.slice(0, 55),
      focus: item.focus,
      exerciseIds: [
        ...new Set(
          item.exerciseIds.filter(
            (id) => exerciseIds.has(id)
          )
        ),
      ].slice(0, 8),
      days: [
        ...new Set(
          item.days.filter(
            (day) =>
              Number.isInteger(day) &&
              day >= 0 &&
              day <= 6
          )
        ),
      ],
      createdAt:
        typeof item.createdAt === "string"
          ? item.createdAt
          : "",
    }))
    .filter(
      (item) =>
        item.exerciseIds.length &&
        item.days.length
    );
}

function readLogs() {
  const raw = readJSON(
    TRAINING_STORAGE.logs,
    []
  );

  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.date === "string" &&
        Boolean(fromDateKey(item.date)) &&
        Number.isInteger(item.minutes) &&
        item.minutes >= 10 &&
        item.minutes <= 180
    )
    .slice(0, MAX_LOGS)
    .map((item) => ({
      id: item.id,
      planId:
        typeof item.planId === "string"
          ? item.planId
          : "",
      planName:
        typeof item.planName === "string"
          ? item.planName.slice(0, 55)
          : "Workout",
      date: item.date,
      minutes: item.minutes,
      note:
        typeof item.note === "string"
          ? item.note.slice(0, 160)
          : "",
      createdAt:
        typeof item.createdAt === "string"
          ? item.createdAt
          : "",
    }));
}

function validateGoal(candidate) {
  const weeklySessions =
    Number(candidate?.weeklySessions);

  const label = String(
    candidate?.label || ""
  ).trim();

  const focus = candidate?.focus;

  if (
    !Number.isInteger(weeklySessions) ||
    weeklySessions < 1 ||
    weeklySessions > 7
  ) {
    return {
      ok: false,
      error:
        "Choose a weekly target from 1 to 7 sessions.",
    };
  }

  if (!focusIds.has(focus)) {
    return {
      ok: false,
      error:
        "Choose a valid fitness focus.",
    };
  }

  if (
    label.length < 3 ||
    label.length > 60
  ) {
    return {
      ok: false,
      error:
        "Goal label must contain 3–60 characters.",
    };
  }

  return {
    ok: true,
    data: {
      weeklySessions,
      focus,
      label,
    },
  };
}

function readGoals() {
  const candidate = readJSON(
    TRAINING_STORAGE.goals,
    DEFAULT_TRAINING_GOALS
  );

  const result = validateGoal(candidate);

  return result.ok
    ? result.data
    : { ...DEFAULT_TRAINING_GOALS };
}

function generateId(prefix) {
  const random =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  return `${prefix}-${random}`;
}

export function TrainingProvider({ children }) {
  const [plans, setPlans] =
    useState(readPlans);

  const [logs, setLogs] =
    useState(readLogs);

  const [goals, setGoals] =
    useState(readGoals);

  useEffect(() => {
    try {
      localStorage.setItem(
        TRAINING_STORAGE.plans,
        JSON.stringify(plans)
      );
    } catch (error) {
      console.warn(
        "Training plan storage unavailable:",
        error
      );
    }
  }, [plans]);

  useEffect(() => {
    try {
      localStorage.setItem(
        TRAINING_STORAGE.logs,
        JSON.stringify(logs)
      );
    } catch (error) {
      console.warn(
        "Workout journal storage unavailable:",
        error
      );
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(
        TRAINING_STORAGE.goals,
        JSON.stringify(goals)
      );
    } catch (error) {
      console.warn(
        "Goal storage unavailable:",
        error
      );
    }
  }, [goals]);

  function savePlan(form, editingId = "") {
    const name = String(
      form?.name || ""
    ).trim();

    const focus = form?.focus;

    const selectedExercises = Array.isArray(
      form?.exerciseIds
    )
      ? [...new Set(form.exerciseIds)]
      : [];

    const selectedDays = Array.isArray(
      form?.days
    )
      ? [...new Set(form.days)]
      : [];

    if (
      name.length < 2 ||
      name.length > 55
    ) {
      return {
        ok: false,
        error:
          "Plan name must contain 2–55 characters.",
      };
    }

    if (!focusIds.has(focus)) {
      return {
        ok: false,
        error:
          "Choose a valid training focus.",
      };
    }

    if (
      selectedExercises.length < 1 ||
      selectedExercises.length > 8 ||
      selectedExercises.some(
        (id) => !exerciseIds.has(id)
      )
    ) {
      return {
        ok: false,
        error:
          "Choose between 1 and 8 valid exercises.",
      };
    }

    if (
      selectedDays.length < 1 ||
      selectedDays.length > 7 ||
      selectedDays.some(
        (day) =>
          !Number.isInteger(day) ||
          day < 0 ||
          day > 6
      )
    ) {
      return {
        ok: false,
        error:
          "Choose at least one valid training day.",
      };
    }

    const existing = plans.find(
      (plan) => plan.id === editingId
    );

    if (
      editingId &&
      !existing
    ) {
      return {
        ok: false,
        error:
          "The plan being edited no longer exists.",
      };
    }

    if (
      !existing &&
      plans.length >= MAX_PLANS
    ) {
      return {
        ok: false,
        error:
          "The demo allows up to 10 workout plans.",
      };
    }

    const plan = {
      id:
        existing?.id ||
        generateId("YFPLAN"),
      name,
      focus,
      exerciseIds: selectedExercises,
      days: selectedDays,
      createdAt:
        existing?.createdAt ||
        new Date().toISOString(),
    };

    if (existing) {
      setPlans((current) =>
        current.map((item) =>
          item.id === plan.id
            ? plan
            : item
        )
      );
    } else {
      setPlans((current) => [
        plan,
        ...current,
      ]);
    }

    return {
      ok: true,
      plan,
    };
  }

  function deletePlan(id) {
    setPlans((current) =>
      current.filter(
        (plan) => plan.id !== id
      )
    );

    // Journal snapshots stay available even
    // if their original plan is removed.
  }

  function addWorkoutLog(form) {
    const plan = plans.find(
      (item) =>
        item.id === form?.planId
    );

    if (!plan) {
      return {
        ok: false,
        error:
          "Choose one of your saved workout plans.",
      };
    }

    const date = String(
      form.date || ""
    );

    if (
      !fromDateKey(date) ||
      date > toDateKey() ||
      date < "2000-01-01"
    ) {
      return {
        ok: false,
        error:
          "Enter a valid past or present demo workout date.",
      };
    }

    const minutes = Number(
      form.minutes
    );

    if (
      String(form.minutes).trim() === "" ||
      !Number.isInteger(minutes) ||
      minutes < 10 ||
      minutes > 180
    ) {
      return {
        ok: false,
        error:
          "Duration must be a whole number from 10 to 180 minutes.",
      };
    }

    const note = String(
      form.note || ""
    ).trim();

    if (note.length > 160) {
      return {
        ok: false,
        error:
          "Journal notes must be 160 characters or fewer.",
      };
    }

    if (
      logs.length >= MAX_LOGS
    ) {
      return {
        ok: false,
        error:
          "The demo journal supports up to 120 entries.",
      };
    }

    const record = {
      id: generateId("YFLOG"),
      planId: plan.id,
      planName: plan.name,
      date,
      minutes,
      note,
      createdAt: new Date().toISOString(),
    };

    setLogs((current) => [
      record,
      ...current,
    ]);

    return {
      ok: true,
      record,
    };
  }

  function deleteWorkoutLog(id) {
    setLogs((current) =>
      current.filter(
        (entry) => entry.id !== id
      )
    );
  }

  function saveGoals(candidate) {
    const result = validateGoal(
      candidate
    );

    if (!result.ok) return result;

    setGoals(result.data);

    return { ok: true };
  }

  const stats = useMemo(
    () =>
      summarizeTraining(
        plans,
        logs,
        goals
      ),
    [plans, logs, goals]
  );

  const value = {
    plans,
    logs,
    goals,
    stats,

    savePlan,
    deletePlan,

    addWorkoutLog,
    deleteWorkoutLog,

    saveGoals,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(
    TrainingContext
  );

  if (!context) {
    throw new Error(
      "useTraining must be used inside TrainingProvider."
    );
  }

  return context;
}