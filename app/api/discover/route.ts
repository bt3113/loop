import { NextRequest, NextResponse } from "next/server";

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

const catalogue: Record<string, DiscoveryResult[]> = {
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

function applyContext(result: DiscoveryResult, dateRange: string, budget: string, area: string): DiscoveryResult {
  const requestedArea = area.trim();

  return {
    ...result,
    date: dateRange || result.date,
    area: requestedArea.length > 0 && requestedArea.toLowerCase() !== "london" ? requestedArea : result.area,
    price: budget === "Any price" ? result.price : budget,
    why: `${result.why} Filtered for ${dateRange.toLowerCase()} around ${requestedArea || "London"}.`
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category") || "Comedy";
  const dateRange = searchParams.get("dateRange") || "This weekend";
  const budget = searchParams.get("budget") || "Under £30";
  const area = searchParams.get("area") || "London";

  const sourceResults = catalogue[category] ?? catalogue.Comedy;
  const results = sourceResults.map((result) => applyContext(result, dateRange, budget, area));

  return NextResponse.json({
    query: { category, dateRange, budget, area },
    results
  });
}
