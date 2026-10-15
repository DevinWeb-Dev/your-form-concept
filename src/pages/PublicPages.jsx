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
  Sparkles,
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
      </div>

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
  return (
    <>
      <section className="yf-hero">
        <div className="yf-hero-image">
          <img
            src={IMAGES.hero}
            alt="Athlete training with gym equipment"
            fetchPriority="high"
          />
        </div>

        <div className="yf-hero-shade" />

        <div className="yf-container yf-hero-content">
          <div className="yf-hero-flag">
            <span className="yf-pulse-dot" />
            MORE THAN JUST A WORKOUT
          </div>

          <h1>
            BUILT
            <br />
            <span>BY THE</span>
            <br />
            <em>WORK.</em>
          </h1>

          <p>
            Stronger habits. Smarter sessions.
            A space to put in the work
            and discover what comes next.
          </p>

          <div className="yf-hero-actions">
            <Link
              to="/programs"
              className="yf-button is-orange"
            >
              Explore Training
              <ArrowUpRight size={19} />
            </Link>

            <Link
              to="/schedule"
              className="yf-button is-outline-light"
            >
              View Class Schedule
              <ArrowRight size={19} />
            </Link>
          </div>

          <div className="yf-hero-signature">
            <span>EST. IN YOUR MINDSET.</span>
            <span>MADE TO MOVE YOU.</span>
          </div>
        </div>

        <div className="yf-hero-edge">
          <span>YOUR FORM.</span>
          <span>MOVE WITH INTENTION</span>
          <span>01 — 05</span>
        </div>
      </section>

      <div className="yf-marquee" aria-label="Training philosophy">
        <div>
          <span>TRAIN WITH PURPOSE</span>
          <Zap size={24} />
          <span>OWN YOUR PROGRESS</span>
          <Zap size={24} />
          <span>BUILD YOUR STANDARD</span>
          <Zap size={24} />
          <span>TRAIN WITH PURPOSE</span>
        </div>
      </div>

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
          eyebrow="04 / MEMBERSHIP EXPERIENCE"
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
            eyebrow="05 / THE PEOPLE BEHIND THE FORMAT"
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