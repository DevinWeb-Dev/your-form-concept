import {
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
  ClipboardList,
  Database,
  Dumbbell,
  Info,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UsersRound,
  Wallet,
} from "lucide-react";

import {
  useStudio,
} from "../context/StudioContext.jsx";

import {
  useTraining,
} from "../context/TrainingContext.jsx";

import {
  useOperations,
} from "../context/OperationsContext.jsx";

const STORAGE_GROUPS = [
  {
    id: "bookings",
    title: "Member Reservations",
    description:
      "Demo class reservations and the selected membership plan.",
    icon: UsersRound,
    keys: [
      "your-form-demo-reservations-v1",
      "your-form-demo-membership-v1",
    ],
  },
  {
    id: "training",
    title: "Workout Records",
    description:
      "Saved training plans, workout journal entries, and personal goals.",
    icon: Dumbbell,
    keys: [
      "your-form-demo-workout-plans-v1",
      "your-form-demo-workout-journal-v1",
      "your-form-demo-training-goals-v1",
    ],
  },
  {
    id: "operations",
    title: "Staff Operations",
    description:
      "Class preparation, coach assignments, attendance statuses, and staff tasks.",
    icon: ClipboardList,
    keys: [
      "your-form-demo-operations-v1",
    ],
  },
  {
    id: "analytics",
    title: "Financial Scenarios",
    description:
      "Illustrative membership counts, operating-cost assumptions, and revenue projections.",
    icon: Wallet,
    keys: [
      "your-form-analytics-scenario-v1",
    ],
  },
];

const ALL_KEYS =
  STORAGE_GROUPS.flatMap(
    (group) => group.keys
  );

function savedKeyCount() {
  try {
    return ALL_KEYS.filter(
      (key) =>
        localStorage.getItem(key) !==
        null
    ).length;
  } catch {
    return 0;
  }
}

function downloadSnapshot() {
  const entries = {};

  for (const key of ALL_KEYS) {
    const stored =
      localStorage.getItem(key);

    if (stored === null) {
      entries[key] = null;
      continue;
    }

    try {
      entries[key] =
        JSON.parse(stored);
    } catch {
      entries[key] = stored;
    }
  }

  const snapshot = {
    application:
      "YOUR FORM. FITNESS STUDIO DEMO",
    schemaVersion: 1,
    exportedAt:
      new Date().toISOString(),
    notice:
      "Browser-local demonstration data. Not a production database backup.",
    data: entries,
  };

  const blob = new Blob(
    [
      JSON.stringify(
        snapshot,
        null,
        2
      ),
    ],
    {
      type:
        "application/json;charset=utf-8",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  const date =
    new Date()
      .toISOString()
      .slice(0, 10);

  link.href = url;

  link.download =
    `your-form-demo-snapshot-${date}.json`;

  document.body.appendChild(link);

  link.click();
  link.remove();

  window.setTimeout(
    () => URL.revokeObjectURL(url),
    1500
  );
}

export default function DemoSettingsPage() {
  const {
    reservations,
    membership,
  } = useStudio();

  const {
    plans,
    logs,
  } = useTraining();

  const {
    tasks,
  } = useOperations();

  const [message, setMessage] =
    useState("");

  const metrics = [
    {
      label: "RESERVATIONS",
      value: reservations.length,
    },
    {
      label: "WORKOUT PLANS",
      value: plans.length,
    },
    {
      label: "WORKOUT LOGS",
      value: logs.length,
    },
    {
      label: "STAFF TASKS",
      value: tasks.length,
    },
  ];

  function handleExport() {
    try {
      downloadSnapshot();

      setMessage(
        "Snapshot download started. Keep the file in a safe location."
      );
    } catch {
      setMessage(
        "Unable to export browser data. Check your browser storage permissions."
      );
    }
  }

  function resetKeys(
    keys,
    label
  ) {
    const approved =
      window.confirm(
        `Reset ${label}?\n\n` +
          "This will permanently clear the selected demo data from this browser.\n\n" +
          "Other browsers and devices will not be affected."
      );

    if (!approved) {
      return;
    }

    try {
      keys.forEach((key) => {
        localStorage.removeItem(key);
      });

      window.location.reload();
    } catch {
      setMessage(
        "Reset failed. Browser storage may be blocked."
      );
    }
  }

  return (
    <div className="yf5-settings-page">
      <header className="yf5-settings-heading">
        <span className="yf5-eyebrow">
          STUDIO MANAGEMENT / FINAL BATCH
        </span>

        <h1>
          KEEP YOUR
          <br />
          <em>DEMO READY.</em>
        </h1>

        <p>
          Manage the information saved
          locally during client
          demonstrations. Export a
          snapshot or reset individual
          areas without modifying the
          website's source code.
        </p>
      </header>

      <div className="yf5-settings-stats">
        {metrics.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>

            <strong>
              {item.value}
            </strong>
          </div>
        ))}
      </div>

      <section className="yf5-settings-panel">
        <div className="yf5-settings-panel-head">
          <div>
            <span className="yf5-eyebrow">
              01 / EXPORT
            </span>

            <h2>
              Save a demo snapshot.
            </h2>
          </div>

          <Database size={24} />
        </div>

        <p>
          Download the reservations,
          training records, staff
          operations, and business
          scenarios currently stored
          in this browser.
        </p>

        <div className="yf5-snapshot-row">
          <div className="yf5-snapshot-stat">
            <strong>
              {savedKeyCount()}
            </strong>

            <span>
              Stored data categories
              and records
            </span>
          </div>

          <button
            type="button"
            className="yf5-primary-button"
            onClick={handleExport}
          >
            <ArrowDownToLine size={18} />

            Export Snapshot
          </button>
        </div>

        {message && (
          <p
            className="yf5-settings-message"
            role="status"
          >
            <Info size={17} />
            {message}
          </p>
        )}

        <div className="yf5-settings-tip">
          <ShieldCheck size={18} />

          <span>
            Exported files stay on your
            device. This feature does
            not upload your data to a
            server. JSON import/restore
            is not included in this
            batch.
          </span>
        </div>
      </section>

      <section className="yf5-settings-panel">
        <div className="yf5-settings-panel-head">
          <div>
            <span className="yf5-eyebrow">
              02 / DATA MANAGEMENT
            </span>

            <h2>
              Reset demo modules.
            </h2>
          </div>

          <RotateCcw size={24} />
        </div>

        <p>
          Clear one module at a time.
          Use these controls when
          preparing the studio demo for
          another presentation.
        </p>

        <div className="yf5-reset-grid">
          {STORAGE_GROUPS.map(
            (group) => {
              const Icon =
                group.icon;

              return (
                <article
                  className="yf5-reset-card"
                  key={group.id}
                >
                  <div className="yf5-reset-icon">
                    <Icon size={21} />
                  </div>

                  <h3>
                    {group.title}
                  </h3>

                  <p>
                    {group.description}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      resetKeys(
                        group.keys,
                        group.title
                      )
                    }
                  >
                    <Trash2 size={16} />
                    Clear Module
                  </button>
                </article>
              );
            }
          )}
        </div>
      </section>

      <section className="yf5-danger-panel">
        <div className="yf5-danger-intro">
          <AlertTriangle size={23} />

          <div>
            <h2>
              Full demo reset
            </h2>

            <p>
              Clear all YOUR FORM.
              demonstration data saved
              under this project's
              storage keys. This
              includes reservations,
              training records, staff
              notes, attendance, and
              financial scenarios.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            resetKeys(
              ALL_KEYS,
              "ALL YOUR FORM. demo data"
            )
          }
        >
          <Trash2 size={17} />

          Reset All Demo Data
        </button>
      </section>

      <div className="yf5-disclaimer">
        <CheckCircle2 size={19} />

        <p>
          <strong>
            Browser-only prototype.
          </strong>{" "}
          These tools manage local
          demonstration data only.
          They do not reset a real
          studio database, process
          payments, or provide
          authenticated staff
          administration.
        </p>
      </div>
    </div>
  );
}