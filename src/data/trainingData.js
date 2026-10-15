// ============================================
// YOUR FORM. — BATCH 2
// TRAINING EXPERIENCE DATA & UTILITIES
// ============================================

export const TRAINING_STORAGE = {
  plans: "your-form-demo-workout-plans-v1",
  logs: "your-form-demo-workout-journal-v1",
  goals: "your-form-demo-training-goals-v1",
};

export const FOCUS_OPTIONS = [
  {
    id: "general",
    name: "Balanced Fitness",
    description: "A mix of movement styles",
  },
  {
    id: "strength",
    name: "Strength",
    description: "Resistance training concepts",
  },
  {
    id: "conditioning",
    name: "Conditioning",
    description: "Cardio and circuit concepts",
  },
  {
    id: "mobility",
    name: "Movement & Mobility",
    description: "Mobility-focused routines",
  },
];

export const TRAINING_DAYS = [
  { id: 1, short: "MON", name: "Monday" },
  { id: 2, short: "TUE", name: "Tuesday" },
  { id: 3, short: "WED", name: "Wednesday" },
  { id: 4, short: "THU", name: "Thursday" },
  { id: 5, short: "FRI", name: "Friday" },
  { id: 6, short: "SAT", name: "Saturday" },
  { id: 0, short: "SUN", name: "Sunday" },
];

export const EXERCISE_LIBRARY = [
  {
    id: "squat",
    name: "Squat Pattern",
    category: "Strength",
    prescription: "3 sets / 8–12 reps",
    equipment: "Bodyweight or resistance",
  },
  {
    id: "hinge",
    name: "Hip Hinge Pattern",
    category: "Strength",
    prescription: "3 sets / 8–10 reps",
    equipment: "Bodyweight or resistance",
  },
  {
    id: "push",
    name: "Upper-Body Push",
    category: "Strength",
    prescription: "3 sets / 8–12 reps",
    equipment: "Bodyweight or resistance",
  },
  {
    id: "pull",
    name: "Upper-Body Pull",
    category: "Strength",
    prescription: "3 sets / 8–12 reps",
    equipment: "Resistance equipment",
  },
  {
    id: "lunge",
    name: "Lunge Pattern",
    category: "Strength",
    prescription: "2 sets / 8–10 each side",
    equipment: "Bodyweight",
  },
  {
    id: "core",
    name: "Core Stability",
    category: "Strength",
    prescription: "3 sets / controlled holds",
    equipment: "Mat",
  },
  {
    id: "walk",
    name: "Brisk Walking",
    category: "Conditioning",
    prescription: "10–20 min / self-paced",
    equipment: "Walking area",
  },
  {
    id: "cycle",
    name: "Stationary Cycling",
    category: "Conditioning",
    prescription: "10–20 min / self-paced",
    equipment: "Stationary bike",
  },
  {
    id: "step",
    name: "Low-Impact Step Work",
    category: "Conditioning",
    prescription: "3 rounds / controlled pace",
    equipment: "Stable step platform",
  },
  {
    id: "shadowbox",
    name: "Shadowboxing",
    category: "Conditioning",
    prescription: "3 rounds / technique-focused",
    equipment: "Open training space",
  },
  {
    id: "shoulders",
    name: "Shoulder Mobility",
    category: "Mobility",
    prescription: "5 min / gentle range",
    equipment: "Open training space",
  },
  {
    id: "hips",
    name: "Hip Mobility",
    category: "Mobility",
    prescription: "5 min / gentle range",
    equipment: "Mat",
  },
  {
    id: "recovery",
    name: "Recovery Walk",
    category: "Mobility",
    prescription: "10–15 min / easy pace",
    equipment: "Walking area",
  },
  {
    id: "breathing",
    name: "Breathing & Cooldown",
    category: "Mobility",
    prescription: "5 min / relaxed breathing",
    equipment: "Mat or chair",
  },
];

export const PLAN_TEMPLATES = [
  {
    id: "full-body",
    name: "FULL-BODY FOUNDATION",
    focus: "strength",
    description:
      "A general introduction to structured strength movements.",
    exerciseIds: [
      "squat",
      "hinge",
      "push",
      "pull",
      "core",
    ],
    days: [1, 3, 5],
  },
  {
    id: "cardio",
    name: "CONDITIONING FLOW",
    focus: "conditioning",
    description:
      "An illustrative mix of cardio and conditioning exercises.",
    exerciseIds: [
      "walk",
      "cycle",
      "step",
      "shadowbox",
      "breathing",
    ],
    days: [2, 4, 6],
  },
  {
    id: "recovery",
    name: "MOVEMENT RESET",
    focus: "mobility",
    description:
      "A lower-intensity, movement-oriented session concept.",
    exerciseIds: [
      "shoulders",
      "hips",
      "recovery",
      "breathing",
    ],
    days: [2, 5],
  },
];

export const DEFAULT_TRAINING_GOALS = {
  weeklySessions: 3,
  focus: "general",
  label: "BUILD A CONSISTENT ROUTINE",
};

export function getExercise(id) {
  return EXERCISE_LIBRARY.find(
    (item) => item.id === id
  );
}

export function getFocus(id) {
  return FOCUS_OPTIONS.find(
    (item) => item.id === id
  );
}

export function getTrainingTemplate(id) {
  return PLAN_TEMPLATES.find(
    (item) => item.id === id
  );
}

export function toDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function fromDateKey(key) {
  if (
    typeof key !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(key)
  ) {
    return null;
  }

  const [year, month, day] = key
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
    12
  );

  return toDateKey(date) === key
    ? date
    : null;
}

export function shiftDay(key, days) {
  const date = fromDateKey(key);

  if (!date) return "";

  date.setDate(
    date.getDate() + days
  );

  return toDateKey(date);
}

export function weekStart(key = toDateKey()) {
  const date = fromDateKey(key);

  if (!date) return "";

  const offset =
    (date.getDay() + 6) % 7;

  date.setDate(
    date.getDate() - offset
  );

  return toDateKey(date);
}

export function displayTrainingDate(key) {
  const date = fromDateKey(key);

  return date
    ? date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Invalid date";
}

export function recentDays(count = 14) {
  const today = toDateKey();

  return Array.from(
    { length: count },
    (_, index) => {
      const key = shiftDay(
        today,
        index - count + 1
      );

      const date = fromDateKey(key);

      return {
        key,
        day: date.toLocaleDateString(
          "en-PH",
          { weekday: "short" }
        ),
        number: date.getDate(),
      };
    }
  );
}

export function summarizeTraining(
  plans,
  logs,
  goals
) {
  const today = toDateKey();
  const monday = weekStart(today);
  const nextMonday = shiftDay(monday, 7);

  const thisWeek = logs.filter(
    (item) =>
      item.date >= monday &&
      item.date < nextMonday
  );

  const totalMinutes = logs.reduce(
    (sum, item) =>
      sum + (Number(item.minutes) || 0),
    0
  );

  const weeklyMinutes = thisWeek.reduce(
    (sum, item) =>
      sum + (Number(item.minutes) || 0),
    0
  );

  const target = Math.max(
    1,
    Number(goals.weeklySessions) || 3
  );

  const daily = recentDays(14).map(
    (day) => ({
      ...day,
      count: logs.filter(
        (item) => item.date === day.key
      ).length,
      minutes: logs
        .filter(
          (item) => item.date === day.key
        )
        .reduce(
          (sum, item) =>
            sum + (Number(item.minutes) || 0),
          0
        ),
    })
  );

  const fourWeeks = Array.from(
    { length: 4 },
    (_, index) => {
      const start = shiftDay(
        monday,
        (index - 3) * 7
      );

      const end = shiftDay(
        start,
        7
      );

      const count = logs.filter(
        (item) =>
          item.date >= start &&
          item.date < end
      ).length;

      return {
        id: start,
        label:
          index === 3
            ? "THIS WEEK"
            : `${3 - index}W AGO`,
        count,
        start,
      };
    }
  );

  return {
    savedPlans: plans.length,
    loggedSessions: logs.length,
    thisWeek: thisWeek.length,
    weeklyMinutes,
    totalMinutes,
    target,
    completion:
      Math.min(
        100,
        (thisWeek.length / target) * 100
      ),
    remaining: Math.max(
      0,
      target - thisWeek.length
    ),
    daily,
    fourWeeks,
    goalReached:
      thisWeek.length >= target,
  };
}