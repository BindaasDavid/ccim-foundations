export type CourseModule = {
  id: string
  number: number
  title: string
  tldr: { line: string; bullets: string[]; }
  outcomes: string[]
  agenda: string[]
  activities: string[]
  focus: string[]
  practice: string
  tools: { label: string; href: string }[]
  walk?: { title: string; points: string[] }[]
}

export const modules: CourseModule[] = [
  {
    id: "1",
    number: 1,
    title: "Overview of Commercial Real Estate",
    tldr: {
      line: "CRE is two clients and two markets. Users buy space. Investors buy cash flow. The space market sets rent and vacancy; the capital market sets the return they will accept.",
      bullets: [
        "Four product types: office, industrial, retail, multifamily. Everything else is specialty.",
        "Users care about location, term, and occupancy cost. Investors care about income, risk, and resale.",
        "Space market = physical supply and demand. Capital market = equity, debt, and required yield.",
        "Office class is A/B/C plus low/mid/high-rise. Compare space on usable SF and rentable SF (load factor).",
        "Services you can sell: land, leasing (owner or tenant), sales, financing, management, corporate, REITs, appraisal, site selection.",
        "The deal is not done at closing. Follow-up and the network are the book of business.",
      ],
    },
    outcomes: [
      "Name the four primary product types and what moves each one.",
      "Separate user/tenant space decisions from investor wealth decisions.",
      "Map services you can offer: tenant rep, listing, and follow-on work.",
    ],
    agenda: [
      "Users/tenants vs investors",
      "Space market vs capital market",
      "Office, industrial, retail, multifamily, specialty",
      "Business opportunities and follow-up services",
    ],
    activities: ["Self-check: product types and who you can serve"],
    focus: [
      "Users buy occupancy; investors buy cash flow and residual value.",
      "The space market sets rent and vacancy; the capital market sets required return.",
      "Each property type has its own demand driver and lease culture.",
    ],
    practice: "Score yourself on the Skills worksheet before you pick a specialty.",
    tools: [{ label: "Skills evaluation", href: "/tools/skills" }],
  },
  {
    id: "2",
    number: 2,
    title: "Markets, Trade Areas, Demographics, Knowledge, and Skills",
    tldr: {
      line: "Pick a geography small enough to know and large enough to eat. Demographics show the trend. A trade area plus a skill stack is the business model.",
      bullets: [
        "Study the right level: site, neighborhood, submarket, metro — not “the whole city” by default.",
        "A trade area is where users actually come from, shaped by drive time, barriers, and competition.",
        "Demographics are a trend source (who is moving, aging, earning). Confirm on the ground.",
        "Office surveys follow employment and class. Retail follows rooftops and spending. Industrial follows freight and labor.",
        "You need knowledge (product, market, people) and skills (analysis, prospecting, negotiation).",
        "The strategic model: territory + information system + CRM + a goal that the inventory can support. Run Probability of Success before you commit.",
      ],
    },
    outcomes: [
      "Pick a study geography that matches the property type, not the whole metro.",
      "Use demographics as a trend source, then verify on the ground.",
      "Sketch a strategic model for your book of business.",
    ],
    agenda: [
      "Demographics as trending data",
      "Levels of geographic study areas",
      "Trade-area analysis and market surveys",
      "Knowledge, skills, resources, and a strategic model",
    ],
    activities: ["Self-check: trade area, skills, and a territory that can feed a goal"],
    focus: [
      "Trade area first, metro second.",
      "A territory has to contain enough users and inventory to feed a goal.",
      "Information systems and a CRM are part of the business model, not extras.",
    ],
    practice: "Run Probability of Success on a submarket you already know.",
    tools: [
      { label: "Probability of success", href: "/tools/probability" },
      { label: "Annual financial goal", href: "/tools/goals" },
    ],
  },
  {
    id: "3",
    number: 3,
    title: "Time Value of Money Concepts",
    tldr: {
      line: "Money has a time stamp. Compounding grows a present amount; discounting brings a future amount back. One family of keys: N, I/YR, PV, PMT, FV.",
      bullets: [
        "Investors prefer less money in, sooner money out, and less risk — all else equal.",
        "Draw a T-bar before you touch the calculator.",
        "Monthly means N = years × 12 and the rate is I/YR ÷ 12.",
      ],
    },
    outcomes: [
      "State the four investor cash-flow questions: how much in, when in, how much out, when out.",
      "Compound a present amount and discount a future amount.",
      "Solve N, I/YR, PV, PMT, or FV on the same problem.",
    ],
    agenda: [
      "What investing is, and risk",
      "Cash flows and investor preferences",
      "Compounding",
      "Discounting",
      "Compounding and discounting drills",
    ],
    activities: ["Drill compounding and discounting on one T-bar", "Self-check: N, I/YR, PV, PMT, and FV"],
    focus: [
      "A T-bar is just a timeline of signed cash flows.",
      "Smaller equity in and larger/earlier cash out is preferred, all else equal.",
      "Monthly compounding means N = years × 12 and I is the periodic rate.",
    ],
    practice: "On TVM, solve FV, then solve PV with that FV to prove the identity.",
    tools: [{ label: "TVM calculator", href: "/tools/tvm" }],
  },
  {
    id: "4",
    number: 4,
    title: "The Leasing Market",
    tldr: {
      line: "Vacancy is empty space as a percent of stock. Absorption is the change in occupied space. Cycle position tells you how hard to push rent.",
      bullets: [
        "Building vacancy = vacant SF ÷ total SF. Market vacancy uses the same math at scale.",
        "Net absorption = ending occupied − starting occupied.",
        "Vacancy rises from new supply, weaker demand, or both.",
      ],
    },
    outcomes: [
      "Place a property on its market cycle.",
      "Compute building and market vacancy.",
      "Compute absorption for a building and a market.",
    ],
    agenda: [
      "Market cycles",
      "Space availability and vacancy drivers",
      "Vacancy rate math",
      "Absorption math and supply/demand forecasts",
    ],
    activities: ["Self-check: vacancy, absorption, and where the cycle is"],
    focus: [
      "Vacancy = vacant SF ÷ total SF (or lost rent ÷ PRI).",
      "Absorption is the net change in occupied space over the period.",
      "Rising vacancy usually means new supply, weaker demand, or both.",
    ],
    practice: "Enter three buildings on the vacancy/absorption workshop and read the submarket rate.",
    tools: [
      { label: "Vacancy & absorption", href: "/tools/market" },
      { label: "APOD", href: "/tools/apod" },
    ],
  },
  {
    id: "5",
    number: 5,
    title: "Leases and Lease Clauses",
    tldr: {
      line: "The lease is the cash-flow contract. Face rent is not what either party economically pays after stops, CAM, TIs, and free rent.",
      bullets: [
        "Gross vs net: who pays operating expenses.",
        "Expense stop: owner pays to the stop; tenant pays the excess.",
        "Compare leases on effective rent / present value, not year-1 face rent.",
      ],
    },
    outcomes: [
      "Tell a valid commercial lease from an incomplete one.",
      "Trace how stops, CAM, TIs, and concessions change cash flow.",
      "Compare alternative structures: ground lease, sublease, assignment, sale-leaseback.",
    ],
    agenda: [
      "Requirements of a valid lease",
      "Gross, net, and hybrid types",
      "Clauses that move cash flow",
      "Rent terminology and options",
      "Effective rent / lease-cost analysis",
    ],
    activities: ["Self-check: lease types, stops, and effective rent"],
    focus: [
      "Face rent is not what the tenant economically pays.",
      "An expense stop caps the owner’s opex; the rest is a tenant pass-through.",
      "Compare two leases on present value, not year-1 rent.",
    ],
    practice: "Price a lease with free rent and TIs on the effective-rent workshop.",
    tools: [
      { label: "Effective rent", href: "/tools/effective-rent" },
      { label: "Differential CF / NPV", href: "/tools/npv" },
    ],
  },
  {
    id: "6",
    number: 6,
    title: "Business Development",
    tldr: {
      line: "Territory, prospecting math, then qualify. Weekly contacts are a derived number from the income goal, not a mood.",
      bullets: [
        "Cover inventory you can actually work.",
        "Qualify before you market or list.",
        "Interest-based negotiation: interests, options, walk-away.",
      ],
    },
    outcomes: [
      "Choose an area of responsibility you can actually cover.",
      "Build a prospecting pattern that supports the income goal.",
      "Walk interest-based negotiation: interests, options, walk-away.",
    ],
    agenda: [
      "Selecting an area of responsibility",
      "Influences, marketing, and branding",
      "Users vs investors",
      "Prospecting, qualifying, the meeting",
      "Property marketing, listing control, negotiation",
    ],
    activities: ["Self-check: territory, prospecting math, and negotiation"],
    focus: [
      "Inventory, users, competitors, and lease-vs-sale mix decide the territory.",
      "Weekly contacts are a derived number, not a mood.",
      "Listing control and negotiation come after you have qualified a real assignment.",
    ],
    practice: "Set a dollar goal, then read weekly contacts on the Goals worksheet.",
    tools: [
      { label: "Annual financial goal", href: "/tools/goals" },
      { label: "Skills evaluation", href: "/tools/skills" },
    ],
  },
  {
    id: "7",
    number: 7,
    title: "Investment Analysis Tools",
    tldr: {
      line: "PRI → vacancy → GOI → opex → NOI → debt service → CFBT. Value ≈ NOI ÷ cap rate. The T-bar is the IRR input tape.",
      bullets: [
        "NOI is before debt and tax.",
        "IRV: Income = Rate × Value. Solve for any one.",
        "Initial equity is price + costs − loan proceeds.",
      ],
    },
    outcomes: [
      "Build PRI → ERI → GOI → NOI → CFBT.",
      "Use IRV: Income = Rate × Value, and solve for any one.",
      "Lay a T-bar: equity out, annual CF, sale proceeds.",
    ],
    agenda: [
      "Sources of property income",
      "Estimating NOI",
      "Cap rate and purchase price",
      "Annual debt service and CFBT",
      "The cash-flow model / T-bar",
    ],
    activities: ["Self-check: PRI through CFBT, cap rate, and the T-bar"],
    focus: [
      "NOI is before debt and tax.",
      "Value = NOI ÷ cap rate when the rate is market-supported.",
      "The T-bar is the input tape for IRR.",
    ],
    practice: "Solve value from NOI and a cap rate on IRV, then drop the same NOI onto APOD.",
    tools: [
      { label: "IRV / cap rate", href: "/tools/irv" },
      { label: "APOD", href: "/tools/apod" },
      { label: "CFAW", href: "/tools/cfaw" },
    ],
  },
  {
    id: "8",
    number: 8,
    title: "Using the Internal Rate of Return",
    tldr: {
      line: "IRR is the discount rate that makes NPV of the cash-flow series equal zero. Beat the hurdle, or walk.",
      bullets: [
        "CF0 is a negative equity outlay.",
        "Put sale proceeds in the exit year.",
        "NPV at the required rate answers “is this worth it?”",
      ],
    },
    outcomes: [
      "Define IRR as the rate that zeros NPV.",
      "Compute IRR on uneven annual cash flows plus a sale.",
      "Compare IRR to a required rate (NPV test).",
    ],
    agenda: [
      "IRR on real estate investments",
      "Uneven cash-flow series",
      "IRR on an uneven cash-flow series",
    ],
    activities: ["Solve IRR on uneven cash flows plus a sale", "Self-check: IRR versus a required rate"],
    focus: [
      "Enter CF0 as a negative equity outlay.",
      "Put sale proceeds in the exit year, not in a phantom extra year unless that is the story.",
      "If signs flip more than once, inspect the series before you trust a single IRR.",
    ],
    practice: "Type the T-bar into NPV/IRR and compare the rate to a 10% hurdle.",
    tools: [
      { label: "NPV & IRR", href: "/tools/npv" },
      { label: "DCF analysis", href: "/tools/dcf" },
    ],
  },
  {
    id: "9",
    number: 9,
    title: "Mortgage Loans",
    tldr: {
      line: "A fully amortizing loan is an annuity. Payment splits into interest on the remaining balance and principal. A short term leaves a balloon.",
      bullets: [
        "PMT solves PV = loan amount.",
        "Balance after k periods is the PV of what’s left.",
        "Borrower and lender see opposite signs on the same contract.",
      ],
    },
    outcomes: [
      "Treat a fully amortizing loan as an annuity.",
      "Split a payment into interest and principal.",
      "Find a remaining balance or balloon after n periods.",
    ],
    agenda: [
      "Borrower vs lender view",
      "Amortization and remaining balance",
      "Mortgage payment, balance, and balloon",
    ],
    activities: ["Build an amortizing loan and read a remaining balance", "Self-check: payment, interest, and balloon"],
    focus: [
      "Payment solves PV = loan amount at the contract rate.",
      "Balance after k periods is the PV of the remaining payments.",
      "A term shorter than amortization leaves a balloon (FV).",
    ],
    practice: "Build the loan, then read the year-5 balance for a sale worksheet.",
    tools: [
      { label: "Amortization", href: "/tools/amort" },
      { label: "TVM calculator", href: "/tools/tvm" },
    ],
  },
  {
    id: "10",
    number: 10,
    title: "Office building case walkthrough",
    tldr: {
      line: "Walk one office from the people who use the space through lease cash, operations, debt, and sale. The IRR is the last number, because it needs every earlier step.",
      bullets: [
        "Describe demand before you calculate. Who occupies this kind of suite, and what would fill a vacancy?",
        "Compare leases on the owner’s year-1 cash after the expense stop, free rent, and tenant improvements. Face rent alone misleads.",
        "Vacancy is empty area divided by stock. Absorption is the change in occupied area.",
        "Stabilized NOI is potential rent minus a market vacancy allowance and operating expenses. Debt is not an operating expense.",
        "A value indication is NOI divided by a cap rate you can support from the market.",
        "A sale price often uses the income a buyer would see after your hold, not only the last year you operate.",
        "Before-tax IRR needs equity out at closing, annual cash flow, and sale proceeds on the exit year. Cash out is negative.",
      ],
    },
    outcomes: [
      "Run market, vacancy, and absorption on a small office.",
      "Apply an expense stop and an effective-rent concession analysis.",
      "Complete APOD, a six-year NOI forecast, a loan, and before-tax IRR.",
    ],
    agenda: [
      "Phase I — property and market",
      "Phase II — marketing, expense stop, vacancy/absorption",
      "Phase III — leasing and effective rent",
      "Phase IV — APOD and value",
      "Phase V — six-year NOI",
      "Phase VI — financing",
      "Phase VII — before-tax IRR",
    ],
    activities: [
      "Task 1: Market analysis",
      "Task 2: Operating expense stop",
      "Task 3: Vacancy and absorption",
      "Task 4: Concessions, allowances, and effective rent",
      "Task 5: APOD and value",
      "Task 6: Six-year NOI forecast",
      "Task 7: Mortgage loans",
      "Task 8: Before-tax IRR",
    ],
    focus: [
      "The walkthrough is one office taken through every tool in these notes.",
      "Do not skip Task 3–4; they feed the APOD vacancy and the lease-up story.",
      "IRR is the last step because it needs operations, loan, and sale together.",
    ],
    practice: "Open the case lab and move from market notes through lease cash, operations, the loan, and sale. Confirm IRR only after sale proceeds sit on the exit year.",
    walk: [
      {
        title: "Phase I — property and market",
        points: [
          "Read the building, the street, and the rent roll before you touch a calculator.",
          "Users here are tenants in a trade, not a metro average. Ask who fills the vacant suite.",
          "Task 1 is judgment: workforce, lifestyle, demand generators, and four target uses for the empty space.",
        ],
      },
      {
        title: "Phase II — stop, vacancy, absorption",
        points: [
          "Task 2: new tenant cost = face rent + (old stop − new stop) × SF.",
          "Task 3: building vacancy and submarket vacancy are the same fraction at different totals.",
          "Stressed GOI = (SF × market rent) × (1 − stressed vacancy).",
          "Absorption is a change in occupied stock, not a rent number.",
        ],
      },
      {
        title: "Phase III — leasing",
        points: [
          "Two prospects, same suite. Higher face rent can lose after TIs and free months.",
          "Year-1 owner cash ≈ face − owner opex to the stop − concessions.",
          "Recommend the prospect that actually funds the owner in year 1 and still fills the hole.",
        ],
      },
      {
        title: "Phase IV — APOD and value",
        points: [
          "PRI is the rent roll at 100% occupancy. Vacancy is a market allowance even when the building is full.",
          "Management is usually a percent of GOI. Add owner-paid opex. NOI is before debt.",
          "Asking price = NOI ÷ cap rate. Round to a price a buyer would actually negotiate.",
        ],
      },
      {
        title: "Phase V–VII — hold, loan, IRR",
        points: [
          "Roll each tenant through the bump years. Year 6 exists to cap the sale, not because you hold six years.",
          "Monthly PMT on the new loan × 12 = ADS. CFBT = NOI − ADS.",
          "Sale price = year-6 NOI ÷ exit cap. Proceeds = price − cost of sale − remaining balance.",
          "IRR last: equity out at t=0, operations in years 1–5, sale on the year-5 line.",
        ],
      },
    ],
    tools: [
      { label: "Case lab", href: "/tools/case" },
      { label: "NOI forecast", href: "/tools/noi" },
      { label: "Vacancy & absorption", href: "/tools/market" },
      { label: "Effective rent", href: "/tools/effective-rent" },
      { label: "APOD", href: "/tools/apod" },
      { label: "CFAW", href: "/tools/cfaw" },
      { label: "DCF analysis", href: "/tools/dcf" },
    ],
  },
]
