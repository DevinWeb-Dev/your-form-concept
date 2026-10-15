import {
  COACHES,
  MEMBERSHIPS,
  PROGRAMS,
} from "./studioData.js";

export const ANALYTICS_STORAGE_KEY =
  "your-form-analytics-scenario-v1";

const DEFAULT_COUNTS = [28, 46, 16];

export const DEFAULT_SCENARIO = {
  ...Object.fromEntries(
    MEMBERSHIPS.map((plan, index) => [
      plan.id,
      DEFAULT_COUNTS[index] ?? 0,
    ])
  ),
  monthlyOperatingCost: 92000,
  growthPercent: 3,
};

export const REPORT_OPTIONS = [
  {
    id: "reservations",
    label: "Reservations & Attendance",
  },
  {
    id: "classes",
    label: "Class Operations",
  },
  {
    id: "coaches",
    label: "Coach Assignments",
  },
  {
    id: "programs",
    label: "Program Performance",
  },
  {
    id: "memberships",
    label: "Membership Scenario",
  },
];

const pesoFormatter = new Intl.NumberFormat(
  "en-PH",
  {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }
);

export function money(value) {
  return pesoFormatter.format(
    Number(value) || 0
  );
}

export function percent(value, total) {
  if (!total || total <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round((value / total) * 100)
    )
  );
}

export function shortDate(dateKey) {
  if (!dateKey) return "—";

  const date = new Date(
    `${dateKey}T12:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

export function fullDate(dateKey) {
  if (!dateKey) return "—";

  const date = new Date(
    `${dateKey}T12:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function shortTime(value) {
  if (!value) return "—";

  const parts = String(value).split(":");

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes)
  ) {
    return String(value);
  }

  return `${
    hours % 12 || 12
  }:${String(minutes).padStart(2, "0")} ${
    hours >= 12 ? "PM" : "AM"
  }`;
}

function numericPrice(value) {
  if (typeof value === "number") {
    return value;
  }

  return (
    Number(
      String(value ?? "")
        .replace(/[^0-9.]/g, "")
    ) || 0
  );
}

function boundedNumber(
  value,
  fallback,
  minimum,
  maximum
) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return minimum;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.min(
    maximum,
    Math.max(minimum, number)
  );
}

export function normalizeScenario(input) {
  const source =
    input &&
    typeof input === "object"
      ? input
      : {};

  const output = {
    ...DEFAULT_SCENARIO,
  };

  MEMBERSHIPS.forEach((plan) => {
    output[plan.id] = Math.floor(
      boundedNumber(
        source[plan.id],
        output[plan.id],
        0,
        5000
      )
    );
  });

  output.monthlyOperatingCost =
    boundedNumber(
      source.monthlyOperatingCost,
      DEFAULT_SCENARIO.monthlyOperatingCost,
      0,
      20000000
    );

  output.growthPercent =
    boundedNumber(
      source.growthPercent,
      DEFAULT_SCENARIO.growthPercent,
      -15,
      25
    );

  return output;
}

export function membershipModel(input) {
  const scenario =
    normalizeScenario(input);

  const plans = MEMBERSHIPS.map((plan) => {
    const count =
      Number(scenario[plan.id]) || 0;

    const price = numericPrice(
      plan.price
    );

    return {
      ...plan,
      count,
      price,
      subtotal: count * price,
    };
  });

  const members = plans.reduce(
    (sum, plan) => sum + plan.count,
    0
  );

  const grossMonthly = plans.reduce(
    (sum, plan) => sum + plan.subtotal,
    0
  );

  const operatingCost =
    scenario.monthlyOperatingCost;

  const estimatedBalance =
    grossMonthly - operatingCost;

  const averageValue = members
    ? grossMonthly / members
    : 0;

  const breakEvenMembers =
    averageValue > 0
      ? Math.ceil(
          operatingCost / averageValue
        )
      : null;

  const projectedMonths = Array.from(
    { length: 6 },
    (_, index) => {
      const date = new Date();

      date.setDate(1);
      date.setMonth(
        date.getMonth() + index
      );

      const rate =
        scenario.growthPercent / 100;

      const gross = Math.round(
        grossMonthly *
          Math.pow(1 + rate, index)
      );

      return {
        label: date.toLocaleDateString(
          "en-PH",
          { month: "short" }
        ),
        gross,
        cost: operatingCost,
        balance: gross - operatingCost,
      };
    }
  );

  return {
    plans,
    members,
    grossMonthly,
    operatingCost,
    estimatedBalance,
    averageValue,
    breakEvenMembers,
    projectedMonths,
    growthPercent:
      scenario.growthPercent,
  };
}

export function buildStudioAnalytics({
  classes = [],
  reservations = [],
  attendance = {},
}) {
  const validClasses = Array.isArray(classes)
    ? classes
    : [];

  const validReservations =
    Array.isArray(reservations)
      ? reservations
      : [];

  const classMap = new Map(
    validClasses.map((session) => [
      session.id,
      session,
    ])
  );

  const knownBookings =
    validReservations.filter((record) =>
      classMap.has(record.sessionId)
    );

  const checkedIn =
    validReservations.filter(
      (record) =>
        attendance[record.id] ===
        "checked-in"
    ).length;

  const noShow =
    validReservations.filter(
      (record) =>
        attendance[record.id] ===
        "no-show"
    ).length;

  const pending =
    validReservations.length -
    checkedIn -
    noShow;

  const recordedOutcomes =
    checkedIn + noShow;

  const capacity = validClasses.reduce(
    (sum, item) =>
      sum + (Number(item.capacity) || 0),
    0
  );

  const occupied = validClasses.reduce(
    (sum, item) =>
      sum + (Number(item.occupied) || 0),
    0
  );

  const sampleTaken = validClasses.reduce(
    (sum, item) =>
      sum + (Number(item.sampleTaken) || 0),
    0
  );

  const programRows = PROGRAMS.map(
    (program) => {
      const programClasses =
        validClasses.filter(
          (item) =>
            item.program?.id === program.id
        );

      const sessionIds = new Set(
        programClasses.map((item) => item.id)
      );

      const bookings =
        knownBookings.filter(
          (record) =>
            sessionIds.has(record.sessionId)
        );

      return {
        id: program.id,
        name: program.name,
        category: program.category,
        sessions: programClasses.length,
        bookings: bookings.length,
        checkins: bookings.filter(
          (record) =>
            attendance[record.id] ===
            "checked-in"
        ).length,
      };
    }
  ).sort(
    (a, b) =>
      b.bookings - a.bookings ||
      b.sessions - a.sessions
  );

  const coachRows = COACHES.map(
    (coach) => {
      const assigned = validClasses.filter(
        (item) =>
          item.assignedCoachId === coach.id
      );

      const bookingRecords =
        assigned.flatMap(
          (item) => item.bookings || []
        );

      const minutes = assigned.reduce(
        (sum, item) =>
          sum +
          (Number(
            item.program?.duration
          ) || 0),
        0
      );

      return {
        ...coach,
        sessions: assigned.length,
        bookings: bookingRecords.length,
        checkins: bookingRecords.filter(
          (record) =>
            attendance[record.id] ===
            "checked-in"
        ).length,
        minutes,
        ready: assigned.filter(
          (item) => item.stage === "ready"
        ).length,
      };
    }
  ).sort(
    (a, b) =>
      b.sessions - a.sessions
  );

  const dayMap = new Map();

  validClasses.forEach((item) => {
    if (!dayMap.has(item.date)) {
      dayMap.set(item.date, {
        date: item.date,
        sessions: 0,
        bookings: 0,
        capacity: 0,
      });
    }

    const day = dayMap.get(item.date);

    day.sessions += 1;
    day.bookings +=
      Number(item.bookedCount) || 0;
    day.capacity +=
      Number(item.capacity) || 0;
  });

  const dayRows = [...dayMap.values()]
    .sort((a, b) =>
      String(a.date).localeCompare(
        String(b.date)
      )
    );

  return {
    classesCount: validClasses.length,
    reservationCount:
      validReservations.length,
    inWindowReservations:
      knownBookings.length,

    checkedIn,
    noShow,
    pending,
    recordedOutcomes,

    attendanceRate:
      recordedOutcomes > 0
        ? percent(checkedIn, recordedOutcomes)
        : null,

    capacity,
    occupied,
    sampleTaken,

    sampleOccupancyRate:
      percent(occupied, capacity),

    ready: validClasses.filter(
      (item) => item.stage === "ready"
    ).length,

    completed: validClasses.filter(
      (item) =>
        item.stage === "completed"
    ).length,

    programRows,
    coachRows,
    dayRows,

    firstDate: dayRows[0]?.date || "",
    lastDate:
      dayRows[dayRows.length - 1]?.date || "",
  };
}

// Protect spreadsheet software from
// interpreting user text as formulas.
function csvCell(value) {
  let text = String(value ?? "");

  if (/^\s*[=+\-@\t\r]/.test(text)) {
    text = "'" + text;
  }

  return `"${text.replaceAll(
    '"',
    '""'
  )}"`;
}

export function downloadCsv(
  filename,
  headers,
  rows
) {
  const lines = [
    headers,
    ...rows,
  ].map((row) =>
    row.map(csvCell).join(",")
  );

  const blob = new Blob(
    [
      "\uFEFF",
      lines.join("\r\n"),
    ],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(
    () => URL.revokeObjectURL(url),
    1500
  );
}