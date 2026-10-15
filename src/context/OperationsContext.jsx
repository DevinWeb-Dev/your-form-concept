import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useStudio } from "./StudioContext.jsx";

import { COACHES } from "../data/studioData.js";

const OperationsContext = createContext(null);

const STORAGE_KEY =
  "your-form-demo-operations-v1";

export const CLASS_STAGES = [
  {
    id: "scheduled",
    label: "Scheduled",
  },
  {
    id: "ready",
    label: "Ready",
  },
  {
    id: "in-progress",
    label: "In Progress",
  },
  {
    id: "completed",
    label: "Completed",
  },
];

export const CLASS_CHECKLIST = [
  {
    id: "equipment",
    label: "Equipment inspected",
  },
  {
    id: "space",
    label: "Studio space prepared",
  },
  {
    id: "coach",
    label: "Coach briefed",
  },
  {
    id: "safety",
    label: "Safety checklist completed",
  },
];

export const ATTENDANCE_STATES = [
  {
    id: "pending",
    label: "Pending",
  },
  {
    id: "checked-in",
    label: "Checked In",
  },
  {
    id: "no-show",
    label: "No Show",
  },
];

function initialData() {
  return {
    sessions: {},
    attendance: {},
    tasks: [],
  };
}

function readData() {
  try {
    const saved = localStorage.getItem(
      STORAGE_KEY
    );

    if (!saved) {
      return initialData();
    }

    const parsed = JSON.parse(saved);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return initialData();
    }

    return {
      sessions:
        parsed.sessions &&
        typeof parsed.sessions === "object" &&
        !Array.isArray(parsed.sessions)
          ? parsed.sessions
          : {},

      attendance:
        parsed.attendance &&
        typeof parsed.attendance === "object" &&
        !Array.isArray(parsed.attendance)
          ? parsed.attendance
          : {},

      tasks: Array.isArray(parsed.tasks)
        ? parsed.tasks.slice(0, 60)
        : [],
    };
  } catch {
    return initialData();
  }
}

function createId(prefix) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function getCoach(id) {
  return COACHES.find(
    (coach) => coach.id === id
  );
}

export function OperationsProvider({
  children,
}) {
  const {
    sessions,
    reservations,
    cancelReservation,
  } = useStudio();

  const [data, setData] = useState(
    readData
  );

  // Save staff-side operations locally.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.warn(
        "Staff demo data could not be saved:",
        error
      );
    }
  }, [data]);

  // Resolve the same class and booking data
  // already used by public booking pages.
  const classes = useMemo(() => {
    const bookingsBySession = new Map();

    reservations.forEach((record) => {
      if (!bookingsBySession.has(record.sessionId)) {
        bookingsBySession.set(
          record.sessionId,
          []
        );
      }

      bookingsBySession
        .get(record.sessionId)
        .push(record);
    });

    return sessions.map((session) => {
      const operations =
        data.sessions[session.id] || {};

      const bookings =
        bookingsBySession.get(session.id) || [];

      const assignedCoach =
        getCoach(operations.coachId) ||
        session.coach;

      const capacity = Number(
        session.capacity || 0
      );

      const sampleTaken = Number(
        session.sampleTaken || 0
      );

      const occupied = Math.min(
        capacity,
        sampleTaken + bookings.length
      );

      const checkedIn = bookings.filter(
        (record) =>
          data.attendance[record.id] ===
          "checked-in"
      ).length;

      return {
        ...session,

        assignedCoach,
        assignedCoachId:
          assignedCoach?.id || "",

        stage:
          operations.stage || "scheduled",

        staffNote:
          operations.note || "",

        checks: Array.isArray(
          operations.checks
        )
          ? operations.checks
          : [],

        bookings,
        bookedCount: bookings.length,
        occupied,
        remaining: Math.max(
          0,
          capacity - occupied
        ),
        checkedIn,
      };
    });
  }, [
    sessions,
    reservations,
    data.sessions,
    data.attendance,
  ]);

  // Staff changes only apply to the
  // operational layer of a valid class.
  const updateSession = useCallback(
    (sessionId, patch) => {
      if (
        !sessions.some(
          (item) => item.id === sessionId
        )
      ) {
        return;
      }

      setData((current) => {
        const previous =
          current.sessions[sessionId] || {};

        const next = { ...previous };

        if (
          patch.stage !== undefined &&
          CLASS_STAGES.some(
            (item) =>
              item.id === patch.stage
          )
        ) {
          next.stage = patch.stage;
        }

        if (
          patch.coachId !== undefined
        ) {
          if (
            patch.coachId === "" ||
            getCoach(patch.coachId)
          ) {
            next.coachId =
              patch.coachId;
          }
        }

        if (
          typeof patch.note === "string"
        ) {
          next.note = patch.note.slice(
            0,
            500
          );
        }

        if (Array.isArray(patch.checks)) {
          const allowed =
            CLASS_CHECKLIST.map(
              (item) => item.id
            );

          next.checks = [
            ...new Set(
              patch.checks.filter(
                (id) => allowed.includes(id)
              )
            ),
          ];
        }

        return {
          ...current,

          sessions: {
            ...current.sessions,
            [sessionId]: next,
          },
        };
      });
    },
    [sessions]
  );

  const setAttendance = useCallback(
    (bookingId, status) => {
      if (
        !reservations.some(
          (item) => item.id === bookingId
        )
      ) {
        return;
      }

      if (
        !ATTENDANCE_STATES.some(
          (item) => item.id === status
        )
      ) {
        return;
      }

      setData((current) => {
        const next = {
          ...current.attendance,
        };

        if (status === "pending") {
          delete next[bookingId];
        } else {
          next[bookingId] = status;
        }

        return {
          ...current,
          attendance: next,
        };
      });
    },
    [reservations]
  );

  // Cancel through StudioContext so the
  // booking disappears in My Studio too.
  const cancelBooking = useCallback(
    (bookingId) => {
      if (
        !reservations.some(
          (item) => item.id === bookingId
        )
      ) {
        return;
      }

      cancelReservation(bookingId);

      setData((current) => {
        const attendance = {
          ...current.attendance,
        };

        delete attendance[bookingId];

        return {
          ...current,
          attendance,
        };
      });
    },
    [
      cancelReservation,
      reservations,
    ]
  );

  const addTask = useCallback((text) => {
    const clean = String(text || "")
      .trim()
      .slice(0, 180);

    if (!clean) {
      return false;
    }

    setData((current) => ({
      ...current,

      tasks: [
        {
          id: createId("task"),
          text: clean,
          done: false,
          createdAt:
            new Date().toISOString(),
        },
        ...current.tasks,
      ].slice(0, 60),
    }));

    return true;
  }, []);

  const toggleTask = useCallback((id) => {
    setData((current) => ({
      ...current,

      tasks: current.tasks.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                done: !item.done,
              }
            : item
      ),
    }));
  }, []);

  const removeTask = useCallback((id) => {
    setData((current) => ({
      ...current,

      tasks: current.tasks.filter(
        (item) => item.id !== id
      ),
    }));
  }, []);

  const classDates = useMemo(
    () => [
      ...new Set(
        classes.map((item) => item.date)
      ),
    ],
    [classes]
  );

  const checkedInCount = useMemo(
    () =>
      reservations.filter(
        (item) =>
          data.attendance[item.id] ===
          "checked-in"
      ).length,
    [
      reservations,
      data.attendance,
    ]
  );

  const value = useMemo(
    () => ({
      classes,
      classDates,
      tasks: data.tasks,
      attendance: data.attendance,

      checkedInCount,

      updateSession,
      setAttendance,
      cancelBooking,
      addTask,
      toggleTask,
      removeTask,
    }),
    [
      classes,
      classDates,
      data.tasks,
      data.attendance,
      checkedInCount,
      updateSession,
      setAttendance,
      cancelBooking,
      addTask,
      toggleTask,
      removeTask,
    ]
  );

  return (
    <OperationsContext.Provider
      value={value}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const context = useContext(
    OperationsContext
  );

  if (!context) {
    throw new Error(
      "useOperations must be used inside OperationsProvider."
    );
  }

  return context;
}