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
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  Gauge,
  HeartPulse,
  ShieldCheck,
  Target,
  UsersRound,
  Zap,
} from "lucide-react";

import {
  BRAND,
  CATEGORIES,
  COACHES,
  IMAGES,
  MEMBERSHIPS,
  PROGRAMS,
  formatPeso,
} from "../data/studioData.js";

import {
  useStudio,
} from "../context/StudioContext.jsx";

function PageHero({
  kicker,
  first,
  second,
  description,
}) {
  return (
    <section className="yf-page-hero">
      <div className="yf-container">
        <span className="yf-eyebrow is-orange">
          {kicker}
        </span>

        <h1>
          {first}
          <br />
          <em>{second}</em>
        </h1>

        <p>{description}</p>
        <div className="yf6-page-hero-foot">
          <span>YOUR FORM / STUDIO SYSTEMS</span>
          <span>MADE TO MOVE / BUILT TO LAST</span>
        </div>
      </div>
      <div className="yf6-page-lines" aria-hidden="true" />

      <span className="yf-page-hero-decor">
        YOUR FORM / 2026
      </span>
    </section>
  );
}

function SectionTitle({
  eyebrow,
  first,
  accent,
  description,
  action,
}) {
  return (
    <div className="yf-section-heading">
      <div>
        <span className="yf-eyebrow">
          {eyebrow}
        </span>

        <h2>
          {first}
          <br />
          <em>{accent}</em>
        </h2>
      </div>

      <div className="yf-section-aside">
        {description && <p>{description}</p>}

        {action && (
          <Link
            className="yf-text-link"
            to={action.path}
          >
            {action.label}
            <ArrowUpRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}

function ProgramCard({ program, featured = false }) {
  return (
    <article
      className={`yf-program-card ${
        featured ? "is-featured" : ""
      }`}
    >
      <div className="yf-program-photo">
        <img
          src={program.image}
          alt={`${program.name} workout inspiration`}
          loading="lazy"
        />

        <span>{program.number} / {program.category}</span>

        <Link
          to={`/schedule?program=${program.id}`}
          aria-label={`View sessions for ${program.name}`}
        >
          <ArrowUpRight size={22} />
        </Link>
      </div>

      <div className="yf-program-details">
        <span className="yf-eyebrow">
          {program.label}
        </span>

        <h3>{program.name}</h3>

        <p>{program.short}</p>

        <div className="yf-program-meta">
          <span>
            <Clock3 size={16} />
            {program.duration} MIN
          </span>

          <span>
            <Flame size={16} />
            {program.intensity}
          </span>
        </div>
      </div>
    </article>
  );
}

export function HomePage() {
  const [trainingFocus, setTrainingFocus] = useState("strength");
  const [activeZone, setActiveZone] = useState("forge");

  const trainingModes = [
    {
      id: "strength",
      number: "01",
      title: "LIFT / STRENGTH",
      short: "Strength",
      program: PROGRAMS[0],
      detail: "Structured progress. Technique before load. Build a foundation you can return to.",
      metric: "60",
      output: "CONTROLLED POWER",
      stats: [72, 88, 64, 93, 78, 100, 83],
    },
    {
      id: "conditioning",
      number: "02",
      title: "MOVE / CONDITION",
      short: "Conditioning",
      program: PROGRAMS[1],
      detail: "Raise the energy with scalable intervals, movement variety, and steady momentum.",
      metric: "45",
      output: "DYNAMIC ENGINE",
      stats: [42, 68, 86, 60, 91, 74, 98],
    },
    {
      id: "recovery",
      number: "03",
      title: "RESET / RECOVER",
      short: "Recovery",
      program: PROGRAMS[4],
      detail: "Make space for mobility, control and consistency on the days in between.",
      metric: "45",
      output: "INTENTIONAL RESET",
      stats: [34, 44, 55, 64, 49, 70, 62],
    },
  ];

  const currentMode = trainingModes.find(
    (mode) => mode.id === trainingFocus
  ) || trainingModes[0];

  const studioZones = [
    {
      id: "forge",
      number: "A1",
      title: "THE FORGE",
      category: "STRENGTH FLOOR",
      detail: "Free weights, deliberate progressions and technique-first strength work.",
      path: "/programs",
      action: "Explore strength",
    },
    {
      id: "engine",
      number: "B2",
      title: "THE ENGINE",
      category: "CONDITIONING STUDIO",
      detail: "Scalable intervals, endurance formats and fast-moving class energy.",
      path: "/schedule",
      action: "View conditioning",
    },
    {
      id: "flow",
      number: "C3",
      title: "THE RESET",
      category: "MOBILITY SUITE",
      detail: "Room to restore, work on movement quality and maintain a sustainable routine.",
      path: "/programs",
      action: "Explore recovery",
    },
    {
      id: "lab",
      number: "D4",
      title: "THE LAB",
      category: "MEMBER PROGRESS",
      detail: "A digital space to plan sample sessions and visualize training consistency.",
      path: "/member",
      action: "Open member hub",
    },
  ];

  const selectedZone = studioZones.find(
    (zone) => zone.id === activeZone
  ) || studioZones[0];

  return (
    <>
      <section className="yf-hero yf6-hero">
        <div className="yf-hero-image">
          <img
            src={IMAGES.hero}
            alt="Athlete training inside a strength-focused gym"
            fetchPriority="high"
          />
        </div>
        <div className="yf-hero-shade" />
        <div className="yf6-hero-grid" aria-hidden="true" />
        <div className="yf6-hero-ruler" aria-hidden="true">
          <span>Y / 001</span>
          <span>DETERMINATION / DISCIPLINE / DRIVE</span>
          <span>FORM STUDIES © 2026</span>
        </div>

        <div className="yf-container yf-hero-content yf6-hero-content">
          <div className="yf6-hero-copy" data-yf-reveal>
            <div className="yf-hero-flag">
              <span className="yf-pulse-dot" />
              THE PERFORMANCE STUDIO / 001
            </div>
            <div className="yf6-hero-edition">
              <span>YOUR FORM.®</span>
              <span>ATHLETIC CULTURE / PH</span>
            </div>
            <h1>
              NO
              <br />
              <span>SHORT</span>
              <br />
              <em>CUTS<span className="yf6-headline-period">.</span></em>
            </h1>
            <p>
              Built through repetition. Defined by intent.
              A new standard for training, movement and
              showing up for yourself.
            </p>
            <div className="yf-hero-actions">
              <Link to="/programs" className="yf-button is-orange">
                Find your discipline <ArrowUpRight size={20} />
              </Link>
              <Link to="/schedule" className="yf-button is-outline-light">
                Explore sessions <ArrowRight size={19} />
              </Link>
            </div>
            <div className="yf-hero-signature">
              <span><span className="yf6-crosshair">✳</span> TRAIN WITH INTENT</span>
              <span>FORM FOLLOWS EFFORT</span>
            </div>
          </div>

          <div className="yf6-hero-display" aria-hidden="true">
            <div className="yf6-display-top">
              <span>FORM / SYSTEM ONLINE</span>
              <span>00:01 / MOMENTUM</span>
            </div>
            <div className="yf6-target">
              <div className="yf6-target-rim" />
              <div className="yf6-target-center">
                <Activity size={36} strokeWidth={1.1} />
                <b>F / M</b>
                <small>MOVE WITH PURPOSE</small>
              </div>
            </div>
            <div className="yf6-display-bottom">
              <span>01—06 / DISCIPLINES</span>
              <span>↑ ENERGY / FOCUS</span>
            </div>
          </div>
        </div>

        <div className="yf6-hero-strip">
          <div><span>01 / DISCIPLINES</span><strong>06</strong></div>
          <div><span>02 / WORKOUT PLANNER</span><strong>READY</strong></div>
          <div><span>03 / TRAINING MINDSET</span><strong>EVERY DAY</strong></div>
          <Link to="/schedule" aria-label="Explore studio schedule">
            <span>DISCOVER WHAT'S NEXT</span>
            <ArrowUpRight size={23} />
          </Link>
        </div>
      </section>

      <div className="yf-marquee yf6-marquee" aria-label="Training philosophy">
        <div>
          {Array.from({ length: 2 }, (_, index) => (
            <span className="yf6-marquee-group" key={index} aria-hidden={index === 1}>
              <span>FORM FOLLOWS EFFORT</span><Zap size={26} />
              <span>STRONG IS BUILT</span><Zap size={26} />
              <span>NO SHORTCUTS</span><Zap size={26} />
            </span>
          ))}
        </div>
      </div>

      <section className="yf6-manifesto" aria-label="The Your Form mindset">
        <div className="yf-container yf6-manifesto-inner" data-yf-reveal>
          <div className="yf6-manifesto-index">
            <span>00 / THE PRINCIPLE</span>
            <span>YOUR FORM MANIFESTO</span>
          </div>
          <div className="yf6-manifesto-headline">
            <span>THE BODY</span>
            <strong>IS THE <i>CANVAS.</i></strong>
            <span>EFFORT IS THE ART.</span>
          </div>
          <div className="yf6-manifesto-foot">
            <p>
              Strength isn't an aesthetic. It's the choice to
              start, to return, and to keep learning.
            </p>
            <span>SCROLL TO EXPLORE <ArrowRight size={17}/></span>
          </div>
        </div>
      </section>

      <section className="yf-section yf-container">
        <SectionTitle
          eyebrow="01 / THE TRAINING PHILOSOPHY"
          first="THE BODY MOVES."
          accent="THE MIND LEADS."
          description="A fitness website designed around confident choices, accessible program details, and a motivating first impression."
        />

        <div className="yf-method-grid">
          <article className="yf-method-lead">
            <img
              src={IMAGES.gym}
              alt="Dark industrial fitness studio interior"
              loading="lazy"
            />

            <div>
              <span className="yf-eyebrow is-orange">
                THE EXPERIENCE
              </span>

              <h3>
                DON'T JUST
                <br />
                <em>SHOW UP.</em>
                <br />
                SHOW OUT.
              </h3>
            </div>
          </article>

          <div className="yf-method-points">
            <article>
              <Target size={28} />

              <span>01 / INTENT</span>

              <h3>TRAIN WITH DIRECTION.</h3>

              <p>
                Explore training formats built
                around clear goals and
                easy-to-understand sessions.
              </p>
            </article>

            <article>
              <Activity size={28} />

              <span>02 / MOVEMENT</span>

              <h3>FIND YOUR FLOW.</h3>

              <p>
                From strength and endurance to
                recovery, discover a balanced
                set of studio experiences.
              </p>
            </article>

            <article>
              <Gauge size={28} />

              <span>03 / MOMENTUM</span>

              <h3>MAKE IT COUNT.</h3>

              <p>
                Organize your sample sessions
                and keep a clearer picture of
                your personal fitness routine.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="yf-section yf-section-cream">
        <div className="yf-container">
          <SectionTitle
            eyebrow="02 / CHOOSE YOUR DISCIPLINE"
            first="THE WORK IS"
            accent="YOUR SIGNATURE."
            description="Six different training directions. One premium studio experience."
            action={{
              path: "/programs",
              label: "View All Programs",
            }}
          />

          <div className="yf-program-grid">
            {PROGRAMS.slice(0, 3).map(
              (program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                />
              )
            )}
          </div>
        </div>
      </section>

      <section className="yf6-console-section" id="training-system">
        <div className="yf-container yf6-console-shell">
          <div className="yf6-console-heading" data-yf-reveal>
            <div>
              <span className="yf-eyebrow">03 / TRAINING SYSTEM</span>
              <h2>FIND YOUR <em>FREQUENCY.</em></h2>
            </div>
            <p>Choose a direction. Explore an illustrative session profile, then jump straight to that training format.</p>
          </div>
          <div className="yf6-console">
            <div className="yf6-console-controls">
              <div className="yf6-console-meta"><span>WORKOUT MODE SELECTOR</span><span>3 OPTIONS / CONCEPT DATA</span></div>
              <div className="yf6-console-modes" role="tablist" aria-label="Training style">
                {trainingModes.map((mode) => (
                  <button
                    type="button"
                    key={mode.id}
                    className={trainingFocus === mode.id ? "is-active" : ""}
                    onClick={() => setTrainingFocus(mode.id)}
                    role="tab"
                    aria-selected={trainingFocus === mode.id}
                    aria-controls="yf6-training-panel"
                  >
                    <span>{mode.number}</span>
                    <strong>{mode.short}</strong>
                    <ArrowUpRight size={18}/>
                  </button>
                ))}
              </div>
              <div className="yf6-console-copy" role="tabpanel" id="yf6-training-panel">
                <span className="yf6-console-label">{currentMode.output}</span>
                <h3>{currentMode.title}</h3>
                <p>{currentMode.detail}</p>
                <Link className="yf-button is-orange" to={`/schedule?program=${currentMode.program.id}`}>
                  Explore this session <ArrowUpRight size={18}/>
                </Link>
              </div>
            </div>
            <div className="yf6-console-visual">
              <div className="yf6-visual-head"><span>SESSION SIGNAL / DEMO</span><span>FIG. 00{trainingModes.findIndex(mode => mode.id === trainingFocus) + 1}</span></div>
              <div className="yf6-pulse-visual" aria-label={`Illustrative intensity waveform for ${currentMode.short}`}>
                {currentMode.stats.map((height, index) => (
                  <span key={`${currentMode.id}-${index}`} style={{ "--height": `${height}%`, "--delay": `${index * 65}ms` }}/>
                ))}
                <div className="yf6-pulse-midline" />
              </div>
              <div className="yf6-console-readout">
                <div><span>SESSION LENGTH</span><strong>{currentMode.metric}<small> MIN</small></strong></div>
                <div><span>TRAINING FORMAT</span><strong>{currentMode.program.category}</strong></div>
              </div>
              <div className="yf6-console-caption">ILLUSTRATIVE TRAINING GRAPHIC / NOT BIOMETRIC DATA</div>
            </div>
          </div>
        </div>
      </section>

      <section className="yf6-architecture-section">
        <div className="yf-container yf6-architecture-grid">
          <div className="yf6-architecture-intro" data-yf-reveal>
            <span className="yf-eyebrow">04 / THE STUDIO ARCHITECTURE</span>
            <h2>EVERY ZONE.<br/><em>EVERY INTENTION.</em></h2>
            <p>A conceptual blueprint of a modern training floor. Select any zone to explore the purpose behind its design.</p>
            <div className="yf6-zone-details" aria-live="polite">
              <span>SELECTED / {selectedZone.number}</span>
              <h3>{selectedZone.title}</h3>
              <strong>{selectedZone.category}</strong>
              <p>{selectedZone.detail}</p>
              <Link to={selectedZone.path} className="yf-text-link">{selectedZone.action}<ArrowUpRight size={18}/></Link>
            </div>
          </div>
          <div className="yf6-blueprint" aria-label="Interactive gym floor concept">
            <div className="yf6-blueprint-meta"><span>YOUR FORM / TRAINING FLOOR</span><span>CONCEPT MAP — NOT TO SCALE</span></div>
            <div className="yf6-blueprint-zones">
              {studioZones.map((zone) => (
                <button
                  type="button"
                  key={zone.id}
                  className={`yf6-zone yf6-zone-${zone.id} ${activeZone === zone.id ? "is-active" : ""}`}
                  onClick={() => setActiveZone(zone.id)}
                  aria-pressed={activeZone === zone.id}
                >
                  <span>{zone.number}</span>
                  <strong>{zone.title}</strong>
                  <small>{zone.category}</small>
                  <span className="yf6-zone-plus">＋</span>
                </button>
              ))}
            </div>
            <div className="yf6-blueprint-footer"><span>4 TRAINING ZONES</span><span>FORM, FUNCTION & FLOW</span></div>
          </div>
        </div>
      </section>

      <section className="yf-impact">
        <div className="yf-impact-image">
          <img
            src={IMAGES.athlete}
            alt="Athlete working out"
            loading="lazy"
          />
        </div>

        <div className="yf-impact-copy">
          <span className="yf-eyebrow is-orange">
            03 / YOUR NEXT SESSION
          </span>

          <h2>
            FIND YOUR
            <br />
            <em>REASON.</em>
            <br />
            THEN MOVE.
          </h2>

          <p>
            A thoughtfully designed class
            schedule makes it easier to
            explore sessions by date,
            program, and training format.
          </p>

          <Link
            to="/schedule"
            className="yf-button is-orange"
          >
            Open Class Schedule
            <ArrowUpRight size={18} />
          </Link>

          <div className="yf-impact-tag">
            PERFORMANCE / DISCIPLINE / CONSISTENCY
          </div>
        </div>
      </section>

      <section className="yf-section yf-container">
        <SectionTitle
          eyebrow="06 / MEMBERSHIP EXPERIENCE"
          first="INVEST IN"
          accent="YOUR NEXT LEVEL."
          description="A clean, transparent presentation of sample membership tiers, built to help prospective clients compare options."
          action={{
            path: "/memberships",
            label: "Compare All Memberships",
          }}
        />

        <div className="yf-home-pricing">
          <div>
            <span className="yf-eyebrow is-orange">
              MOST FLEXIBLE STUDIO CONCEPT
            </span>

            <h3>PERFORMANCE</h3>

            <p>
              One concept. More ways to move.
              Explore group training, sample
              coaching access, and a member hub.
            </p>

            <Link
              to="/memberships"
              className="yf-text-link is-light"
            >
              Explore Membership
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="yf-home-pricing-value">
            <span>DEMO STARTING PRICE</span>

            <strong>
              {formatPeso(
                MEMBERSHIPS[1].price
              )}
            </strong>

            <small>PER MONTH / ILLUSTRATIVE</small>
          </div>
        </div>
      </section>

      <section className="yf-section yf-section-dark">
        <div className="yf-container">
          <SectionTitle
            eyebrow="07 / THE PEOPLE BEHIND THE FORMAT"
            first="GUIDANCE MEETS"
            accent="GRIT."
            description="Explore the fictional coaching profiles designed to demonstrate how a fitness business can showcase its team."
            action={{
              path: "/coaches",
              label: "Meet the Coaches",
            }}
          />

          <div className="yf-coach-preview">
            {COACHES.map((coach, index) => (
              <article key={coach.id}>
                <span className="yf-coach-preview-number">
                  0{index + 1}
                </span>

                <div className="yf-coach-monogram">
                  {coach.initials}
                </div>

                <div>
                  <small>{coach.role}</small>
                  <h3>{coach.name}</h3>
                </div>

                <ArrowUpRight size={22} />
              </article>
            ))}
          </div>

          <div className="yf-coach-disclaimer">
            <ShieldCheck size={19} />
            Coach identities are fictional
            placeholders for the portfolio demo.
          </div>
        </div>
      </section>
    </>
  );
}

export function ProgramsPage() {
  const [category, setCategory] =
    useState("All");

  const filtered = useMemo(
    () =>
      PROGRAMS.filter(
        (program) =>
          category === "All" ||
          program.category === category
      ),
    [category]
  );

  return (
    <>
      <PageHero
        kicker="YOUR FORM / TRAINING FORMATS"
        first="FIND YOUR"
        second="DISCIPLINE."
        description="From the strength floor to high-energy conditioning, explore fictional group training formats created for this premium studio concept."
      />

      <section className="yf-section yf-container">
        <SectionTitle
          eyebrow="01 / DISCOVER THE PROGRAMS"
          first="MOVE YOUR WAY."
          accent="OWN THE WORK."
        />

        <div className="yf-filter-bar">
          {CATEGORIES.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={category === item}
              className={
                category === item
                  ? "is-active"
                  : ""
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="yf-result-count">
          {filtered.length} PROGRAM
          {filtered.length !== 1 ? "S" : ""} SHOWN
        </p>

        <div className="yf-program-grid">
          {filtered.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
            />
          ))}
        </div>
      </section>

      <section className="yf-section yf-section-cream">
        <div className="yf-container">
          <SectionTitle
            eyebrow="02 / A CLOSER LOOK"
            first="WHAT'S INSIDE"
            accent="EACH FORMAT?"
            description="Open a program to explore its illustrative approach, session duration, and key training elements."
          />

          <div className="yf-program-accordion">
            {PROGRAMS.map((program) => (
              <details key={program.id}>
                <summary>
                  <span>{program.number}</span>

                  <strong>{program.name}</strong>

                  <span>{program.category}</span>

                  <ChevronRight size={24} />
                </summary>

                <div className="yf-accordion-content">
                  <div>
                    <p>{program.description}</p>

                    <div className="yf-program-tags">
                      <span>{program.duration} MINUTES</span>
                      <span>{program.intensity}</span>
                    </div>
                  </div>

                  <div>
                    {program.highlights.map((item) => (
                      <p key={item}>
                        <Check size={17} />
                        {item}
                      </p>
                    ))}

                    <Link
                      to={`/schedule?program=${program.id}`}
                      className="yf-text-link"
                    >
                      Explore Sessions
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function MembershipsPage() {
  const {
    membershipId,
    chooseMembership,
  } = useStudio();

  const [notice, setNotice] = useState("");

  function select(id) {
    const result = chooseMembership(id);

    if (result.ok) {
      setNotice(
        "Membership interest saved in My Studio. This does not activate or purchase a plan."
      );
    } else {
      setNotice(result.error);
    }
  }

  return (
    <>
      <PageHero
        kicker="YOUR FORM / MEMBERSHIP CONCEPTS"
        first="YOUR COMMITMENT."
        second="YOUR CALL."
        description="Compare illustrative fitness memberships and save your preferred tier without payment or personal information."
      />

      <section className="yf-section yf-container">
        <SectionTitle
          eyebrow="01 / THE MEMBERSHIP COLLECTION"
          first="FIND YOUR"
          accent="FIT."
          description="All prices and inclusions below are fictional, for presentation purposes only."
        />

        <div className="yf-pricing-grid">
          {MEMBERSHIPS.map((plan) => (
            <article
              key={plan.id}
              className={`yf-price-card ${
                plan.highlighted ? "is-featured" : ""
              }`}
            >
              {plan.highlighted && (
                <span className="yf-price-popular">
                  FEATURED CONCEPT
                </span>
              )}

              <div className="yf-price-card-top">
                <span className="yf-eyebrow">
                  {plan.number} / {plan.caption}
                </span>

                <h3>{plan.name}</h3>

                <p>{plan.description}</p>
              </div>

              <div className="yf-price-amount">
                <strong>{formatPeso(plan.price)}</strong>
                <span>PER MONTH / SAMPLE RATE</span>
              </div>

              <div className="yf-price-benefits">
                {plan.benefits.map((benefit) => (
                  <span key={benefit}>
                    <Check size={18} />
                    {benefit}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className={`yf-button ${
                  plan.highlighted
                    ? "is-orange"
                    : "is-dark"
                }`}
                onClick={() => select(plan.id)}
              >
                {membershipId === plan.id
                  ? "Saved to My Studio"
                  : "Choose Demo Plan"}

                {membershipId === plan.id ? (
                  <Check size={19} />
                ) : (
                  <ArrowUpRight size={19} />
                )}
              </button>
            </article>
          ))}
        </div>

        {notice && (
          <div className="yf-inline-success" role="status">
            <CheckCircle2Icon />
            <span>{notice}</span>

            <Link to="/my-studio">
              Open My Studio
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        <div className="yf-demo-note">
          <ShieldCheck size={23} />

          <p>
            Selecting a membership only saves
            your preference locally in this
            browser. No account is created,
            no subscription is activated,
            and no payment is collected.
          </p>
        </div>
      </section>
    </>
  );
}

function CheckCircle2Icon() {
  return <Check size={19} />;
}

export function CoachesPage() {
  return (
    <>
      <PageHero
        kicker="YOUR FORM / MEET THE TEAM"
        first="THE PEOPLE."
        second="THE PURPOSE."
        description="A premium team presentation showing how fitness businesses can introduce their trainers and coaching philosophies."
      />

      <section className="yf-section yf-container">
        <SectionTitle
          eyebrow="01 / THE COACHING COLLECTION"
          first="STANDARDS"
          accent="START HERE."
          description="These are clearly fictional profiles used to demonstrate a future coaching-team page."
        />

        <div className="yf-coach-grid">
          {COACHES.map((coach, index) => (
            <article
              className="yf-coach-card"
              key={coach.id}
            >
              <div className="yf-coach-card-visual">
                <span>PROFILE 0{index + 1}</span>
                <strong>{coach.initials}</strong>
                <Dumbbell size={54} />
              </div>

              <div className="yf-coach-card-info">
                <span className="yf-eyebrow">
                  {coach.role}
                </span>

                <h3>{coach.name}</h3>

                <strong>{coach.specialty}</strong>

                <p>{coach.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="yf-section yf-section-cream">
        <div className="yf-container yf-coach-values">
          <SectionTitle
            eyebrow="02 / THE APPROACH"
            first="MORE THAN"
            accent="MOTIVATION."
            description="Great coaching experiences are built around responsible programming, respectful guidance, and clear communication."
          />

          <div className="yf-values-grid">
            <article>
              <UsersRound size={30} />
              <h3>SUPPORT</h3>
              <p>Clear and approachable guidance.</p>
            </article>

            <article>
              <Target size={30} />
              <h3>FOCUS</h3>
              <p>Training with a defined purpose.</p>
            </article>

            <article>
              <HeartPulse size={30} />
              <h3>BALANCE</h3>
              <p>Thoughtful movement and recovery.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero
        kicker="YOUR FORM / THE STUDIO CONCEPT"
        first="NOT JUST A GYM."
        second="A MINDSET."
        description="A fictional Philippine fitness studio concept designed as a premium digital experience for business owners and their future members."
      />

      <section className="yf-section yf-container">
        <div className="yf-about-grid">
          <div className="yf-about-visual">
            <img
              src={IMAGES.gym}
              alt="Modern fitness facility inspiration"
              loading="lazy"
            />
          </div>

          <div className="yf-about-copy">
            <span className="yf-eyebrow">
              01 / THE BIG IDEA
            </span>

            <h2>
              TRAINING
              <br />
              MEETS <em>DESIGN.</em>
            </h2>

            <p>
              YOUR FORM. brings together
              high-impact visual identity,
              clear program discovery,
              membership comparisons,
              and intuitive studio scheduling.
            </p>

            <p>
              The goal is simple: help a potential
              member understand the business,
              explore the experience, and
              confidently choose their next step.
            </p>

            <Link
              to="/programs"
              className="yf-button is-dark"
            >
              Discover the Programs
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="yf-section yf-section-dark">
        <div className="yf-container yf-about-ending">
          <span className="yf-eyebrow is-orange">
            BUILT AS A PORTFOLIO CONCEPT
          </span>

          <h2>
            DIGITAL EXPERIENCES
            <br />
            <em>MADE TO MOVE PEOPLE.</em>
          </h2>

          <p>{BRAND.attribution}</p>

          <div className="yf-demo-note is-dark">
            <ShieldCheck size={22} />

            <p>
              This is a demonstration website.
              All classes, coaches, memberships,
              and pricing are fictional.
              Reservations are only stored in
              the visitor's browser.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}