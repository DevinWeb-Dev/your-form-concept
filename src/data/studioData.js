// ========================================
// YOUR FORM. — STUDIO DATA
// BATCH 1 — PUBLIC EXPERIENCE
// ========================================

export const BRAND = {
  name: "YOUR FORM.",
  tagline: "BUILT DIFFERENT.",
  description:
    "A premium fitness studio website concept built around movement, confidence, and measurable personal progress.",
  attribution:
    "Website Concept Made by: Web Developer Devin Planas",
};

export const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800&q=85&fit=crop",

  gym:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=85&fit=crop",

  athlete:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=85&fit=crop",

  training:
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1300&q=85&fit=crop",

  strength:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&fit=crop",

  conditioning:
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&q=80&fit=crop",

  performance:
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&q=80&fit=crop",

  boxing:
    "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&q=80&fit=crop",

  mobility:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80&fit=crop",

  athletic:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80&fit=crop",
};

export const PROGRAMS = [
  {
    id: "strength-lab",
    number: "01",
    name: "STRENGTH LAB",
    category: "Strength",
    intensity: "Moderate–High",
    duration: 60,
    label: "BUILD YOUR BASE.",
    image: IMAGES.strength,
    short:
      "Progressive strength sessions built around controlled movement and sound technique.",
    description:
      "Explore foundational lifts, movement quality, and progressive training principles in a structured group environment.",
    highlights: [
      "Foundational lifting patterns",
      "Structured training blocks",
      "Technique-first demonstrations",
    ],
  },
  {
    id: "burn-circuit",
    number: "02",
    name: "BURN CIRCUIT",
    category: "Conditioning",
    intensity: "High",
    duration: 45,
    label: "TURN UP THE ENERGY.",
    image: IMAGES.conditioning,
    short:
      "Fast-paced circuit training with rotating stations and dynamic movement.",
    description:
      "A fictional group-class format mixing strength-endurance exercises, conditioning intervals, and recovery periods.",
    highlights: [
      "Timed training stations",
      "Scalable movement options",
      "Coach-led group energy",
    ],
  },
  {
    id: "performance-ride",
    number: "03",
    name: "PERFORMANCE RIDE",
    category: "Endurance",
    intensity: "Moderate–High",
    duration: 45,
    label: "FIND YOUR RHYTHM.",
    image: IMAGES.performance,
    short:
      "A rhythm-driven endurance concept for focused cardio sessions.",
    description:
      "Move through an illustrative cycling-inspired training sequence with intervals, pacing, and controlled effort.",
    highlights: [
      "Structured endurance intervals",
      "Adjustable effort levels",
      "Recovery-focused pacing",
    ],
  },
  {
    id: "boxing-conditioning",
    number: "04",
    name: "BOXING CONDITIONING",
    category: "Conditioning",
    intensity: "High",
    duration: 50,
    label: "MOVE WITH PURPOSE.",
    image: IMAGES.boxing,
    short:
      "Footwork, coordination, and boxing-inspired conditioning.",
    description:
      "A non-contact fitness class concept focused on boxing fundamentals, conditioning drills, and movement confidence.",
    highlights: [
      "Non-contact training drills",
      "Footwork and coordination",
      "Conditioning combinations",
    ],
  },
  {
    id: "restore-mobility",
    number: "05",
    name: "RESTORE & MOBILITY",
    category: "Recovery",
    intensity: "Low",
    duration: 45,
    label: "RECOVER TO MOVE.",
    image: IMAGES.mobility,
    short:
      "Mobility work and controlled movement for a more balanced training routine.",
    description:
      "A recovery-oriented studio session featuring guided mobility sequences, breathing, and movement awareness.",
    highlights: [
      "Guided mobility sequences",
      "Gentle progression options",
      "Breathing and cooldown work",
    ],
  },
  {
    id: "athletic-engine",
    number: "06",
    name: "ATHLETIC ENGINE",
    category: "Performance",
    intensity: "High",
    duration: 60,
    label: "OWN YOUR OUTPUT.",
    image: IMAGES.athletic,
    short:
      "An athletic conditioning format built around speed, coordination, and power.",
    description:
      "Combine illustrated athletic-development drills and circuit work with progressions suitable for a coached setting.",
    highlights: [
      "Athletic movement patterns",
      "Speed and power concepts",
      "Coached training progressions",
    ],
  },
];

export const CATEGORIES = [
  "All",
  "Strength",
  "Conditioning",
  "Endurance",
  "Recovery",
  "Performance",
];

export const MEMBERSHIPS = [
  {
    id: "essential",
    number: "01",
    name: "ESSENTIAL",
    caption: "THE STARTING LINE",
    price: 1890,
    description:
      "An approachable studio membership concept for building a consistent routine.",
    highlighted: false,
    benefits: [
      "Gym-floor access concept",
      "Basic movement orientation",
      "Sample weekly program suggestions",
      "Access to member dashboard demo",
    ],
  },
  {
    id: "performance",
    number: "02",
    name: "PERFORMANCE",
    caption: "THE EVERYDAY STANDARD",
    price: 2890,
    description:
      "An all-round membership concept for gym sessions and coached group training.",
    highlighted: true,
    benefits: [
      "Everything in Essential",
      "Illustrative group-class access",
      "Personal training goal planner",
      "Class scheduling demo",
      "Monthly progress review concept",
    ],
  },
  {
    id: "elite",
    number: "03",
    name: "ELITE",
    caption: "THE NEXT LEVEL",
    price: 4490,
    description:
      "A premium membership presentation for members who want a more guided experience.",
    highlighted: false,
    benefits: [
      "Everything in Performance",
      "Priority planning concept",
      "Coaching consultation example",
      "Personalized routine presentation",
      "Enhanced progress tools concept",
    ],
  },
];

export const COACHES = [
  {
    id: "coach-ari",
    initials: "AR",
    name: "ARI REYES",
    role: "STRENGTH COACH",
    specialty: "Strength & foundational movement",
    description:
      "Fictional coach profile representing a technique-first strength training approach.",
  },
  {
    id: "coach-sam",
    initials: "SC",
    name: "SAM CRUZ",
    role: "PERFORMANCE COACH",
    specialty: "Conditioning & athletic movement",
    description:
      "Fictional coach profile representing structured energy, conditioning, and athletic development.",
  },
  {
    id: "coach-kai",
    initials: "KL",
    name: "KAI LIM",
    role: "MOVEMENT COACH",
    specialty: "Mobility & endurance",
    description:
      "Fictional coach profile focused on recovery-oriented movement and endurance training concepts.",
  },
];

// JS weekday format: Sunday = 0, Monday = 1.
export const CLASS_TEMPLATES = [
  { id: "mo-1", day: 1, time: "06:30", programId: "strength-lab", coachId: "coach-ari", capacity: 14, sampleTaken: 6 },
  { id: "mo-2", day: 1, time: "12:00", programId: "restore-mobility", coachId: "coach-kai", capacity: 16, sampleTaken: 5 },
  { id: "mo-3", day: 1, time: "18:00", programId: "burn-circuit", coachId: "coach-sam", capacity: 18, sampleTaken: 9 },

  { id: "tu-1", day: 2, time: "07:00", programId: "performance-ride", coachId: "coach-kai", capacity: 16, sampleTaken: 7 },
  { id: "tu-2", day: 2, time: "17:30", programId: "boxing-conditioning", coachId: "coach-sam", capacity: 16, sampleTaken: 10 },
  { id: "tu-3", day: 2, time: "19:00", programId: "strength-lab", coachId: "coach-ari", capacity: 14, sampleTaken: 6 },

  { id: "we-1", day: 3, time: "06:30", programId: "athletic-engine", coachId: "coach-sam", capacity: 14, sampleTaken: 6 },
  { id: "we-2", day: 3, time: "12:00", programId: "restore-mobility", coachId: "coach-kai", capacity: 16, sampleTaken: 4 },
  { id: "we-3", day: 3, time: "18:00", programId: "strength-lab", coachId: "coach-ari", capacity: 14, sampleTaken: 9 },

  { id: "th-1", day: 4, time: "07:00", programId: "burn-circuit", coachId: "coach-sam", capacity: 18, sampleTaken: 10 },
  { id: "th-2", day: 4, time: "17:30", programId: "performance-ride", coachId: "coach-kai", capacity: 16, sampleTaken: 8 },
  { id: "th-3", day: 4, time: "19:00", programId: "boxing-conditioning", coachId: "coach-sam", capacity: 16, sampleTaken: 11 },

  { id: "fr-1", day: 5, time: "06:30", programId: "strength-lab", coachId: "coach-ari", capacity: 14, sampleTaken: 7 },
  { id: "fr-2", day: 5, time: "12:00", programId: "athletic-engine", coachId: "coach-sam", capacity: 14, sampleTaken: 8 },
  { id: "fr-3", day: 5, time: "18:00", programId: "restore-mobility", coachId: "coach-kai", capacity: 16, sampleTaken: 5 },

  { id: "sa-1", day: 6, time: "08:00", programId: "athletic-engine", coachId: "coach-sam", capacity: 14, sampleTaken: 9 },
  { id: "sa-2", day: 6, time: "10:00", programId: "strength-lab", coachId: "coach-ari", capacity: 14, sampleTaken: 8 },
  { id: "sa-3", day: 6, time: "15:00", programId: "boxing-conditioning", coachId: "coach-sam", capacity: 16, sampleTaken: 7 },
];

export const findProgram = (id) =>
  PROGRAMS.find((item) => item.id === id);

export const findCoach = (id) =>
  COACHES.find((item) => item.id === id);

export const findMembership = (id) =>
  MEMBERSHIPS.find((item) => item.id === id);

export function formatPeso(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function dateFromKey(key) {
  const [year, month, day] =
    key.split("-").map(Number);

  return new Date(year, month - 1, day, 12);
}

export function formatDate(key, options = {}) {
  if (!key) return "—";

  return dateFromKey(key).toLocaleDateString(
    "en-PH",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...options,
    }
  );
}

export function formatTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(2026, 0, 1, hour, minute);

  return date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function calendarDates(count = 21) {
  const dates = [];
  const today = new Date();

  for (let index = 1; index <= count; index += 1) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + index,
      12
    );

    dates.push({
      key: localDateKey(date),
      dayNumber: date.getDate(),
      dayName: date.toLocaleDateString(
        "en-PH",
        { weekday: "short" }
      ),
      month: date.toLocaleDateString(
        "en-PH",
        { month: "short" }
      ),
      weekday: date.getDay(),
    });
  }

  return dates;
}

export function sessionsForDate(dateKey) {
  const date = dateFromKey(dateKey);
  const weekday = date.getDay();

  return CLASS_TEMPLATES.filter(
    (item) => item.day === weekday
  ).map((item) => ({
    ...item,
    id: `${dateKey}-${item.id}`,
    date: dateKey,
    program: findProgram(item.programId),
    coach: findCoach(item.coachId),
  }));
}

export function upcomingSessions(count = 21) {
  return calendarDates(count).flatMap(
    (date) => sessionsForDate(date.key)
  );
}