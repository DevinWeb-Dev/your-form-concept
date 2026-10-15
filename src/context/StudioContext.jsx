import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  findMembership,
  findProgram,
  upcomingSessions,
} from "../data/studioData.js";

const StudioContext = createContext(null);

const RESERVATIONS_KEY =
  "your-form-demo-reservations-v1";

const MEMBERSHIP_KEY =
  "your-form-demo-membership-v1";

function readReservations() {
  try {
    const value = JSON.parse(
      localStorage.getItem(RESERVATIONS_KEY) || "[]"
    );

    return Array.isArray(value)
      ? value
          .filter(
            (item) =>
              item &&
              typeof item === "object" &&
              typeof item.id === "string" &&
              typeof item.sessionId === "string" &&
              typeof item.date === "string"
          )
          .slice(0, 30)
      : [];
  } catch {
    return [];
  }
}

function readMembership() {
  try {
    const id = localStorage.getItem(
      MEMBERSHIP_KEY
    );

    return findMembership(id)?.id || "";
  } catch {
    return "";
  }
}

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return (
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2)
  );
}

export function StudioProvider({ children }) {
  const [reservations, setReservations] = useState(
    readReservations
  );

  const [membershipId, setMembershipId] = useState(
    readMembership
  );

  const sessions = useMemo(
    () => upcomingSessions(21),
    []
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        RESERVATIONS_KEY,
        JSON.stringify(reservations)
      );
    } catch (error) {
      console.warn(
        "Demo reservation storage unavailable:",
        error
      );
    }
  }, [reservations]);

  useEffect(() => {
    try {
      if (membershipId) {
        localStorage.setItem(
          MEMBERSHIP_KEY,
          membershipId
        );
      } else {
        localStorage.removeItem(
          MEMBERSHIP_KEY
        );
      }
    } catch (error) {
      console.warn(
        "Demo membership storage unavailable:",
        error
      );
    }
  }, [membershipId]);

  function chooseMembership(id) {
    const plan = findMembership(id);

    if (!plan) {
      return {
        ok: false,
        error: "Membership concept not found.",
      };
    }

    setMembershipId(id);

    return {
      ok: true,
    };
  }

  function removeMembership() {
    setMembershipId("");
  }

  function reserveSession(sessionId, alias) {
    const session = sessions.find(
      (item) => item.id === sessionId
    );

    if (!session || !findProgram(session.programId)) {
      return {
        ok: false,
        error:
          "This demo session is outside the current 21-day planning window.",
      };
    }

    const name = String(alias || "").trim();

    if (
      name.length < 2 ||
      name.length > 35 ||
      !/^[a-zA-Z0-9 ._-]+$/.test(name)
    ) {
      return {
        ok: false,
        error:
          "Enter a fictional alias using 2–35 letters, numbers, spaces, periods, or hyphens.",
      };
    }

    if (
      reservations.some(
        (item) =>
          item.sessionId === sessionId
      )
    ) {
      return {
        ok: false,
        error:
          "You already saved this demo session.",
      };
    }

    const futureReservations = reservations.filter(
      (item) => item.date >= session.date.slice(0, 10)
    );

    if (futureReservations.length >= 8) {
      return {
        ok: false,
        error:
          "The demo allows up to eight upcoming session reservations.",
      };
    }

    const scheduleConflict = reservations.some(
      (item) =>
        item.date === session.date &&
        item.time === session.time
    );

    if (scheduleConflict) {
      return {
        ok: false,
        error:
          "You already have a demo session saved at that date and time.",
      };
    }

    if (
      session.sampleTaken >= session.capacity
    ) {
      return {
        ok: false,
        error:
          "This illustrative class is marked full.",
      };
    }

    const record = {
      id: createId(),
      sessionId: session.id,
      date: session.date,
      time: session.time,
      programId: session.programId,
      coachId: session.coachId,
      alias: name,
      createdAt: new Date().toISOString(),
    };

    setReservations((current) => [
      record,
      ...current,
    ]);

    return {
      ok: true,
      record,
    };
  }

  function cancelReservation(id) {
    setReservations((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  const value = {
    sessions,
    reservations,
    membershipId,
    membership: findMembership(membershipId),
    chooseMembership,
    removeMembership,
    reserveSession,
    cancelReservation,
  };

  return (
    <StudioContext.Provider value={value}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const value = useContext(StudioContext);

  if (!value) {
    throw new Error(
      "useStudio must be used inside StudioProvider."
    );
  }

  return value;
}