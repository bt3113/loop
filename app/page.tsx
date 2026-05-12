"use client";

import { FormEvent, useMemo, useState } from "react";

type Reaction = "interested" | "talk" | "declined";
type EventStatus = "Pinned" | "Discussing" | "Likely" | "Confirmed";

type Friend = {
  id: string;
  name: string;
  initials: string;
};

type LoopEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  area: string;
  price: string;
  status: EventStatus;
  vibe: string;
  source: string;
  imageTone: "music" | "food" | "comedy" | "sport";
  reactions: Record<Reaction, string[]>;
};

type DiscoveryResult = {
  id: string;
  title: string;
  category: string;
  date: string;
  area: string;
  price: string;
  source: string;
  why: string;
};

const friends: Friend[] = [
  { id: "bhavesh", name: "Bhavesh", initials: "BT" },
  { id: "arjun", name: "Arjun", initials: "AJ" },
  { id: "meera", name: "Meera", initials: "MR" },
  { id: "rishi", name: "Rishi", initials: "RS" },
  { id: "priya", name: "Priya", initials: "PK" },
  { id: "aman", name: "Aman", initials: "AM" }
];

const initialEvents: LoopEvent[] = [
  {
    id: "jazz-soho",
    title: "Late jazz night in Soho",
    category: "Music",
    date: "Fri 22 May",
    time: "8:30 PM",
    area: "Soho",
    price: "££",
    status: "Likely",
    vibe: "Good for a proper evening plan after dinner.",
    source: "Pinned from Discover",
    imageTone: "music",
    reactions: {
      interested: ["bhavesh", "meera", "priya", "aman"],
      talk: ["rishi"],
      declined: []
    }
  },
  {
    id: "sunday-market",
    title: "Columbia Road + lunch crawl",
    category: "Food",
    date: "Sun 24 May",
    time: "11:00 AM",
    area: "Shoreditch",
    price: "£",
    status: "Discussing",
    vibe: "Low-friction daytime plan with food, coffee, and a walk.",
    source: "Manual idea",
    imageTone: "food",
    reactions: {
      interested: ["bhavesh", "arjun", "meera"],
      talk: ["priya", "rishi"],
      declined: ["aman"]
    }
  },
  {
    id: "comedy-east",
    title: "East London comedy night",
    category: "Comedy",
    date: "Thu 28 May",
    time: "7:00 PM",
    area: "Bethnal Green",
    price: "Under £25",
    status: "Pinned",
    vibe: "Cheap, central enough, and easy to discuss before booking.",
    source: "Suggested by Arjun",
    imageTone: "comedy",
    reactions: {
      interested: ["arjun", "rishi"],
      talk: ["bhavesh"],
      declined: []
    }
  }
];

const discoveryCatalogue: Record<string, DiscoveryResult[]> = {
  Comedy: [
    {
      id: "comedy-club-east",
      title: "East London stand-up night",
      category: "Comedy",
      date: "Friday evening",
      area: "Bethnal Green",
      price: "Under £25",
      source: "Demo adapter: comedy feed",
      why: "Good group fit because it is affordable, social, and does not need heavy planning."
    },
    {
      id: "soho-comedy-cellar",
      title: "Soho basement comedy lineup",
      category: "Comedy",
      date: "This weekend",
      area: "Soho",
      price: "Under £30",
      source: "Demo adapter: comedy feed",
      why: "Best for friends who want central location and an easy drinks-after option."
    },
    {
      id: "camden-comedy-new-material",
      title: "New material comedy showcase",
      category: "Comedy",
      date: "Next week",
      area: "Camden",
      price: "Under £20",
      source: "Demo adapter: comedy feed",
      why: "Cheaper and lower-commitment than a headline show, so it is useful for mixed-interest groups."
    }
  ],
  Food: [
    {
      id: "brixton-food-hall",
      title: "Brixton street food hall night",
      category: "Food",
      date: "Friday night",
      area: "Brixton",
      price: "£10-£25",
      source: "Demo adapter: food feed",
      why: "Flexible arrival times and several food options make it easier for a group to agree."
    },
    {
      id: "shoreditch-supper-club",
      title: "Casual supper club table",
      category: "Food",
      date: "This weekend",
      area: "Shoreditch",
      price: "Under £50",
      source: "Demo adapter: food feed",
      why: "Works well when the group wants something more organised than just drinks."
    },
    {
      id: "borough-market-route",
      title: "Borough Market lunch route",
      category: "Food",
      date: "Saturday afternoon",
      area: "London Bridge",
      price: "£10-£30",
      source: "Demo adapter: food feed",
      why: "Low-risk daytime plan with no ticket dependency."
    }
  ],
  Music: [
    {
      id: "jazz-soho-late",
      title: "Late jazz room in Soho",
      category: "Music",
      date: "Friday night",
      area: "Soho",
      price: "Under £50",
      source: "Demo adapter: music feed",
      why: "Good fit for a proper evening plan with dinner before and drinks after."
    },
    {
      id: "dalston-live-session",
      title: "Dalston live session",
      category: "Music",
      date: "This weekend",
      area: "Dalston",
      price: "Under £30",
      source: "Demo adapter: music feed",
      why: "Better for a casual music night without committing to a major gig."
    },
    {
      id: "southbank-classical-late",
      title: "South Bank late classical set",
      category: "Music",
      date: "Next week",
      area: "South Bank",
      price: "Under £30",
      source: "Demo adapter: music feed",
      why: "More cultural and calmer than nightlife, so it may suit a mixed group."
    }
  ],
  Culture: [
    {
      id: "gallery-late-southbank",
      title: "Gallery late route",
      category: "Culture",
      date: "Thursday evening",
      area: "South Bank",
      price: "Free",
      source: "Demo adapter: culture feed",
      why: "Free entry and central location make it a practical default option."
    },
    {
      id: "immersive-exhibition",
      title: "Immersive exhibition slot",
      category: "Culture",
      date: "This weekend",
      area: "King's Cross",
      price: "Under £30",
      source: "Demo adapter: culture feed",
      why: "Good when friends want something structured but not too formal."
    },
    {
      id: "museum-after-hours",
      title: "Museum after-hours session",
      category: "Culture",
      date: "Next week",
      area: "Kensington",
      price: "Under £20",
      source: "Demo adapter: culture feed",
      why: "Affordable and easy to pair with a casual dinner."
    }
  ],
  Sport: [
    {
      id: "five-a-side-slot",
      title: "Five-a-side pitch slot",
      category: "Sport",
      date: "Sunday afternoon",
      area: "Hackney",
      price: "£8-£15 each",
      source: "Demo adapter: sport feed",
      why: "Good active plan if enough people commit early."
    },
    {
      id: "football-screening",
      title: "Big match pub screening",
      category: "Sport",
      date: "This weekend",
      area: "Islington",
      price: "Free entry",
      source: "Demo adapter: sport feed",
      why: "Casual option where declined votes do not ruin the plan."
    },
    {
      id: "climbing-social",
      title: "Indoor climbing social",
      category: "Sport",
      date: "Next week",
      area: "Vauxhall",
      price: "Under £25",
      source: "Demo adapter: sport feed",
      why: "More memorable than drinks and still flexible for mixed ability levels."
    }
  ],
  "Free events": [
    {
      id: "free-open-air-market",
      title: "Open-air market and walk",
      category: "Free events",
      date: "Saturday afternoon",
      area: "Hackney Wick",
      price: "Free",
      source: "Demo adapter: free events feed",
      why: "Best when the group wants a zero-pressure plan with optional food/drinks."
    },
    {
      id: "free-gallery-night",
      title: "Free gallery night",
      category: "Free events",
      date: "Thursday evening",
      area: "Mayfair",
      price: "Free",
      source: "Demo adapter: free events feed",
      why: "Useful for mixed budgets and easy to convert into drinks after."
    },
    {
      id: "riverside-walk",
      title: "Riverside walk and coffee route",
      category: "Free events",
      date: "Sunday morning",
      area: "Greenwich",
      price: "Free",
      source: "Demo adapter: free events feed",
      why: "Simple daytime backup plan if other tickets sell out."
    }
  ],
  Nightlife: [
    {
      id: "shoreditch-dj-bar",
      title: "Shoreditch DJ bar night",
      category: "Nightlife",
      date: "Saturday night",
      area: "Shoreditch",
      price: "Under £20",
      source: "Demo adapter: nightlife feed",
      why: "Good when the group wants flexibility and does not want to buy expensive tickets."
    },
    {
      id: "camden-late-room",
      title: "Camden late room",
      category: "Nightlife",
      date: "Friday night",
      area: "Camden",
      price: "Under £30",
      source: "Demo adapter: nightlife feed",
      why: "Better for a smaller subgroup that wants a louder plan."
    },
    {
      id: "soho-cocktail-route",
      title: "Soho cocktail route",
      category: "Nightlife",
      date: "This weekend",
      area: "Soho",
      price: "Any price",
      source: "Demo adapter: nightlife feed",
      why: "Flexible route-style plan where people can join late."
    }
  ]
};

const fallbackDiscovery = discoveryCatalogue.Comedy;

const timelineRows = [
  { label: "Mon", title: "Quiet", left: 3, width: 8 },
  { label: "Tue", title: "Open slots", left: 16, width: 15 },
  { label: "Wed", title: "Open slots", left: 32, width: 12 },
  { label: "Thu", title: "Comedy option", left: 48, width: 16 },
  { label: "Fri", title: "Jazz night", left: 66, width: 20 },
  { label: "Weekend", title: "Market + lunch", left: 79, width: 18 }
];

const boardColumns: { title: string; statuses: EventStatus[] }[] = [
  { title: "Pinned", statuses: ["Pinned"] },
  { title: "Discussing", statuses: ["Discussing"] },
  { title: "Likely", statuses: ["Likely"] },
  { title: "Confirmed", statuses: ["Confirmed"] }
];

function namesFor(ids: string[]) {
  return ids
    .map((id) => friends.find((friend) => friend.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}

function signalFor(event: LoopEvent) {
  const interested = event.reactions.interested.length;
  const talk = event.reactions.talk.length;
  const declined = event.reactions.declined.length;

  if (interested >= 4) {
    return { label: "Strong interest", className: "signal good" };
  }

  if (talk >= 2) {
    return { label: "Needs discussion", className: "signal talk" };
  }

  if (declined >= 3) {
    return { label: "Weak fit", className: "signal" };
  }

  return { label: "Gathering signal", className: "signal" };
}

function applyDiscoveryContext(result: DiscoveryResult, dateRange: string, budget: string, area: string): DiscoveryResult {
  const requestedArea = area.trim();

  return {
    ...result,
    date: dateRange || result.date,
    area: requestedArea.length > 0 && requestedArea.toLowerCase() !== "london" ? requestedArea : result.area,
    price: budget === "Any price" ? result.price : budget,
    why: `${result.why} Filtered for ${dateRange.toLowerCase()} around ${requestedArea || "London"}.`
  };
}

function getDiscoveryResults(category: string, dateRange: string, budget: string, area: string) {
  const sourceResults = discoveryCatalogue[category] ?? discoveryCatalogue.Comedy;
  return sourceResults.map((result) => applyDiscoveryContext(result, dateRange, budget, area));
}

export default function Home() {
  const [events, setEvents] = useState<LoopEvent[]>(initialEvents);
  const [activeUser, setActiveUser] = useState("bhavesh");
  const [category, setCategory] = useState("Comedy");
  const [dateRange, setDateRange] = useState("This weekend");
  const [budget, setBudget] = useState("Under £30");
  const [area, setArea] = useState("London");
  const [results, setResults] = useState<DiscoveryResult[]>(fallbackDiscovery);
  const [isSearching, setIsSearching] = useState(false);

  const totals = useMemo(() => {
    const interested = events.reduce((sum, event) => sum + event.reactions.interested.length, 0);
    const talking = events.reduce((sum, event) => sum + event.reactions.talk.length, 0);
    const pinned = events.filter((event) => event.status === "Pinned").length;
    const likely = events.filter((event) => event.status === "Likely").length;

    return { interested, talking, pinned, likely };
  }, [events]);

  function reactToEvent(eventId: string, reaction: Reaction) {
    setEvents((currentEvents) =>
      currentEvents.map((event) => {
        if (event.id !== eventId) return event;

        const nextReactions: Record<Reaction, string[]> = {
          interested: event.reactions.interested.filter((id) => id !== activeUser),
          talk: event.reactions.talk.filter((id) => id !== activeUser),
          declined: event.reactions.declined.filter((id) => id !== activeUser)
        };

        nextReactions[reaction] = [...nextReactions[reaction], activeUser];

        return {
          ...event,
          reactions: nextReactions,
          status:
            reaction === "interested" && nextReactions.interested.length >= 4
              ? "Likely"
              : reaction === "talk"
                ? "Discussing"
                : event.status
        };
      })
    );
  }

  function runDiscovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSearching(true);

    window.setTimeout(() => {
      setResults(getDiscoveryResults(category, dateRange, budget, area));
      setIsSearching(false);
    }, 250);
  }

  function pinResult(result: DiscoveryResult) {
    const newEvent: LoopEvent = {
      id: `${result.id}-${Date.now()}`,
      title: result.title,
      category: result.category,
      date: result.date,
      time: "TBC",
      area: result.area,
      price: result.price,
      status: "Pinned",
      vibe: result.why,
      source: result.source,
      imageTone: result.category.toLowerCase().includes("food") ? "food" : result.category.toLowerCase().includes("comedy") ? "comedy" : "music",
      reactions: {
        interested: [activeUser],
        talk: [],
        declined: []
      }
    };

    setEvents((currentEvents) => [newEvent, ...currentEvents]);
  }

  return (
    <main className="page-shell">
      <nav className="navbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Loop home">
          <span className="logo-mark">∞</span>
          Loop
        </a>
        <div className="nav-links">
          <a href="#plans">Plans</a>
          <a href="#discover">Discover</a>
          <a href="#timeline">Timeline</a>
          <a href="#decisions">Decisions</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-card">
          <span className="kicker">Private planning board for your WhatsApp group</span>
          <h1>Turn group chat chaos into actual plans.</h1>
          <p className="hero-copy">
            Loop helps friends discover London events, pin ideas, vote Interested / Let&apos;s Talk / Declined, and promote the best options into confirmed plans.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#discover">Find events</a>
            <a className="btn ghost" href="#plans">View group board</a>
          </div>

          <div className="stats-grid" aria-label="Loop summary stats">
            <div className="stat">
              <strong>{events.length}</strong>
              <span>active ideas</span>
            </div>
            <div className="stat">
              <strong>{totals.interested}</strong>
              <span>interest signals</span>
            </div>
            <div className="stat">
              <strong>{totals.talking}</strong>
              <span>discussion flags</span>
            </div>
            <div className="stat">
              <strong>{totals.likely}</strong>
              <span>likely plans</span>
            </div>
          </div>
        </div>

        <aside className="panel" aria-labelledby="prototype-heading">
          <div className="panel-header">
            <div>
              <p className="muted">Current group</p>
              <h2 id="prototype-heading">London Loop</h2>
            </div>
            <select className="pill" value={activeUser} onChange={(event) => setActiveUser(event.target.value)} aria-label="Act as friend">
              {friends.map((friend) => (
                <option key={friend.id} value={friend.id}>{friend.name}</option>
              ))}
            </select>
          </div>

          <p className="muted">
            Prototype mode: pick a friend, vote on event cards, search the demo discovery feed, and pin results into the board.
          </p>

          <div className="friend-stack" aria-label="Friends in group">
            {friends.map((friend) => (
              <span className="avatar" key={friend.id} title={friend.name}>{friend.initials}</span>
            ))}
          </div>

          <div className="feature-list section">
            <div className="feature">
              <strong>Group intent, not just RSVP</strong>
              <span>Interested, Let&apos;s Talk, and Declined capture the messy planning stage before anything is final.</span>
            </div>
            <div className="feature">
              <strong>Discovery to decision</strong>
              <span>Search by category, week, budget, and area. Pin the best results directly to the private board.</span>
            </div>
            <div className="feature">
              <strong>Timeline-first planning</strong>
              <span>See how proposed meetups fit across the week without opening a dense calendar grid.</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="section" id="plans">
        <div className="section-top">
          <div>
            <p className="muted">Group board</p>
            <h2>Plans your friends can actually decide on.</h2>
          </div>
          <span className="pill">{totals.pinned} pinned · {totals.likely} likely</span>
        </div>

        <div className="grid-3">
          {events.slice(0, 6).map((event) => {
            const signal = signalFor(event);
            return (
              <article className="event-card" key={event.id}>
                <div className={`event-image ${event.imageTone}`}>
                  <span className="date-chip">{event.date}</span>
                  <span className="status-chip">{event.status}</span>
                </div>
                <div className="event-body">
                  <div className="meta-row">
                    <span>{event.category}</span>
                    <span className="dot" />
                    <span>{event.area}</span>
                    <span className="dot" />
                    <span>{event.price}</span>
                  </div>
                  <h3>{event.title}</h3>
                  <p className="muted">{event.time} · {event.vibe}</p>
                  <div className="signal-row">
                    <span className={signal.className}>{signal.label}</span>
                    <span className="signal">{event.reactions.interested.length} interested</span>
                    <span className="signal">{event.reactions.talk.length} talk</span>
                  </div>
                  <p className="muted" style={{ marginTop: 12, minHeight: 38 }}>
                    {event.reactions.interested.length > 0
                      ? `Interested: ${namesFor(event.reactions.interested)}`
                      : "No interest yet."}
                  </p>
                  <div className="response-row" aria-label={`Respond to ${event.title}`}>
                    <button className="response-btn" onClick={() => reactToEvent(event.id, "interested")}>Interested</button>
                    <button className="response-btn" onClick={() => reactToEvent(event.id, "talk")}>Let&apos;s Talk</button>
                    <button className="response-btn" onClick={() => reactToEvent(event.id, "declined")}>Decline</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section discovery-card" id="discover">
        <div className="section-top">
          <div>
            <p className="muted">Event discovery</p>
            <h2>Search London ideas in the format your group needs.</h2>
          </div>
          <span className="pill">Static demo, API-ready data shape</span>
        </div>

        <div className="discovery-layout">
          <form className="search-form" onSubmit={runDiscovery}>
            <div className="field">
              <label htmlFor="category">Category</label>
              <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Comedy</option>
                <option>Food</option>
                <option>Music</option>
                <option>Culture</option>
                <option>Sport</option>
                <option>Free events</option>
                <option>Nightlife</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="dateRange">Date or week</label>
              <select id="dateRange" value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                <option>Today</option>
                <option>This weekend</option>
                <option>Next week</option>
                <option>Next month</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="budget">Budget</label>
              <select id="budget" value={budget} onChange={(event) => setBudget(event.target.value)}>
                <option>Free</option>
                <option>Under £20</option>
                <option>Under £30</option>
                <option>Under £50</option>
                <option>Any price</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="area">Area</label>
              <input id="area" value={area} onChange={(event) => setArea(event.target.value)} placeholder="London, Shoreditch, Soho..." />
            </div>
            <button className="btn primary" type="submit">{isSearching ? "Searching..." : "Search events"}</button>
          </form>

          <div className="results-list" aria-live="polite">
            {results.map((result) => (
              <article className="result-item" key={result.id}>
                <div className="result-item-top">
                  <div>
                    <div className="meta-row">
                      <span>{result.category}</span>
                      <span className="dot" />
                      <span>{result.date}</span>
                      <span className="dot" />
                      <span>{result.area}</span>
                    </div>
                    <h3>{result.title}</h3>
                  </div>
                  <span className="category-chip">{result.price}</span>
                </div>
                <p className="muted">{result.why}</p>
                <div className="meta-row">
                  <span>{result.source}</span>
                  <span className="dot" />
                  <span>Pin to board, then friends vote</span>
                </div>
                <div className="response-row">
                  <button className="response-btn" onClick={() => pinResult(result)}>Pin</button>
                  <button className="response-btn" onClick={() => pinResult(result)}>Interested</button>
                  <button className="response-btn" onClick={() => pinResult({ ...result, title: `${result.title} — discuss` })}>Let&apos;s Talk</button>
                  <button className="response-btn">Decline</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section timeline-card" id="timeline">
        <div className="section-top">
          <div>
            <p className="muted">Timeline view</p>
            <h2>A lighter alternative to a dense calendar.</h2>
          </div>
          <span className="pill">Week of 18 May</span>
        </div>
        <div className="timeline">
          {timelineRows.map((row) => (
            <div className="timeline-row" key={row.label}>
              <div className="timeline-label">{row.label}</div>
              <div className="timeline-track">
                <div className="timeline-bar" style={{ left: `${row.left}%`, width: `${row.width}%` }}>{row.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section panel" id="decisions">
        <div className="section-top">
          <div>
            <p className="muted">Decision board</p>
            <h2>Move ideas from maybe to confirmed.</h2>
          </div>
          <span className="pill">Suggested → Discussing → Likely → Confirmed</span>
        </div>

        <div className="board">
          {boardColumns.map((column) => (
            <div className="column" key={column.title}>
              <div className="column-title">{column.title}</div>
              {events
                .filter((event) => column.statuses.includes(event.status))
                .map((event) => (
                  <div className="mini-card" key={event.id}>
                    <strong>{event.title}</strong>
                    <p className="muted">{event.date} · {event.area}</p>
                    <span className="signal">{event.reactions.interested.length} interested</span>
                  </div>
                ))}
              {events.filter((event) => column.statuses.includes(event.status)).length === 0 ? (
                <p className="muted">Nothing here yet.</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        Loop MVP: private friend groups, event discovery, pinning, reactions, timeline, and decision flow. Next step is Google auth, persistent database, and real event-source integrations.
      </footer>
    </main>
  );
}
