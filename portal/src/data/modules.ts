export type CourseModule = {
  id: string
  number: number
  title: string
  packet: string
  pages: number
  tldr: { line: string; bullets: string[]; answers?: { task: string; items: string[] }[] }
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
    packet: "FOUND_M1_Overview_2025-07-14.pdf",
    pages: 20,
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
    activities: ["Activity 1-1: Self-assessment review"],
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
    packet: "FOUND_M2_Markets_Trade_Areas_Demos_KS_2025-07-14.pdf",
    pages: 18,
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
    activities: ["Activity 2-1: Self-assessment review"],
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
    packet: "FOUND_M3_TVM_2025-07-14.pdf",
    pages: 40,
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
      "Activity 3-1 drill set",
    ],
    activities: ["Activity 3-1: Compounding and discounting", "Activity 3-2: Self-assessment review"],
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
    packet: "FOUND_M4_Leasing_Market_2025-07-14.pdf",
    pages: 12,
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
    activities: ["Activity 4-1: Self-assessment review"],
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
    packet: "FOUND_M5_Lease_Clauses_2025-07-14.pdf",
    pages: 20,
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
    activities: ["Activity 5-1: Self-assessment review"],
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
    packet: "FOUND_M06_Business_Development_2025-07-14.pdf",
    pages: 34,
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
    activities: ["Activity 6-1: Self-assessment review"],
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
    packet: "FOUND_M07_Investment_Analysis_Tools_2025-07-14.pdf",
    pages: 20,
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
    activities: ["Activity 7-1: Self-assessment review"],
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
    packet: "FOUND_M08_Using_IRR_2025-07-14.pdf",
    pages: 22,
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
      "Activity 8-1 calculation set",
    ],
    activities: ["Activity 8-1: Calculating IRR", "Activity 8-2: Self-assessment review"],
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
    packet: "FOUND_M09_Mortgage_Loans_2025-07-14.pdf",
    pages: 32,
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
      "Activity 9-1 mortgage drill",
    ],
    activities: ["Activity 9-1: Mortgage loans", "Activity 9-2: Self-assessment review"],
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
    title: "Case Study: Office Building",
    packet: "FOUND_M10_Case_Study_2025-07-23.pdf",
    pages: 48,
    tldr: {
      line: "Fill the vacant medical suite with the clean lease, not the concession-heavy one. Stabilized NOI is $73,464. Cap that at 7% and the ask is $1,050,000. Hold five years, sell off year-6 NOI, and before-tax IRR is 11.27%.",
      bullets: [
        "Recommend Prospect C / Tenant C. Year-1 owner cash is $20,520 ($10.26 psf). Prospect A is a year-1 loss after TIs and free rent.",
        "Buyer equity is $262,500 on a $787,500 loan. ADS is $63,807. Sale at $1,145,000. IRR 11.27%.",
      ],
      answers: [
        {
          task: "Task 1 — Market analysis",
          items: [
            "1. Characterize the city’s population: growing city of 50,000 in a 225,000 county (5-year city 60,000 / county 270,000); median age 37; families plus a large retiree share; transit-oriented and walkable.",
            "Workforce — a. White collar or blue collar? Majority white collar (60% / 40% blue collar). Professionally employed people who need office space.",
            "Workforce — b. Stage in their working lives? Peak-earning / baby-boomer years (30–59 is 42% of the population).",
            "Workforce — c. Effect on office demand? Strong demand for medical and personal services, professional office, and government-support space.",
            "Lifestyle — d. Who is drawn to this city? People who want parks, walkability, transit, schools, and hospital access.",
            "Lifestyle — e. Benefits of living here? Economic stability (government 35%), a medical base, and retiree demand.",
            "Lifestyle — f. Families, singles, retirees, or other? Baby-boomer families plus a large retirement population.",
            "g. Four+ representative sectors: (1) families (2) white-collar workers (3) government employees (4) retirees. Also school-age children, singles, and a growing international community.",
            "h. Retail/office that stay strong (four+): (1) medical office (2) children’s retail (3) professional/service office (4) tutoring (5) sporting goods.",
            "i. Medical uses for the vacant suite (four+): (1) obstetrics (2) dentistry / orthodontia (3) cardiology (4) sports medicine / chiropractic (5) oncology / gerontology.",
          ],
        },
        {
          task: "Task 2 — Operating expense stop",
          items: [
            "1. Effect on Tenant A this year (2,200 sf at $11 psf): annual rent $11.00 psf = $24,200. Additional payment from the $1.54 stop ($0.20 psf CAM) = $440. Total tenant responsibilities = $11.20 psf / $24,640.",
            "2. New effective annual rate = $24,640 ÷ 2,200 sf = $11.20 psf.",
          ],
        },
        {
          task: "Task 3 — Vacancy and absorption",
          items: [
            "1. Submarket vacancy = 9,250 ÷ 30,500 = 0.30, or 30%.",
            "2. Vacancy by building: Park Plaza 2,000 ÷ 10,000 = 20%; Comparable A 3,000 ÷ 12,000 = 25%; Comparable B 4,250 ÷ 8,500 = 50%.",
            "3. Occupied space in the three-building submarket = 30,500 − 9,250 = 21,250 sf.",
            "4. GOI at a 30% vacancy: Park Plaza $120,000 − $36,000 = $84,000; Comparable A $132,000 − $39,600 = $92,400; Comparable B $87,125 − $26,138 = $60,987.",
            "5. Absorption = EOY occupied 26,375 − BOY occupied 21,250 = 5,125 sf.",
          ],
        },
        {
          task: "Task 4 — Concessions and effective rent",
          items: [
            "1. Prospect A, year-1 owner cash: base rent $27,000; owner opex to the $1.74 stop $3,480; concessions and allowances $39,750; total = ($16,230).",
            "2. Prospect A annual effective rate, year 1 = ($16,230) ÷ 2,000 sf = ($8.12) psf.",
            "3. Prospect C, year-1 owner cash: base rent $24,000; owner opex to the stop $3,480; concessions $0; total = $20,520.",
            "4. Prospect C annual effective rate, year 1 = $20,520 ÷ 2,000 sf = $10.26 psf.",
            "Recommendation: take Prospect C / Tenant C. The owner’s first job is to fill the vacancy, and C is the only year-1 cash-positive lease.",
          ],
        },
        {
          task: "Task 5 — APOD and value",
          items: [
            "1. APOD lines (nearest dollar): Line 2 Vacancy & credit losses $7,434; Line 3 Effective rental income $98,766; Line 5 GOI $98,766; Line 10 Off-site management $6,914; Line 29 Total operating expenses $25,302; Line 30 NOI $73,464; Line 35 CFBT $25,464 (after $48,000 ADS).",
            "Line 29 is the sum of owner-paid opex on 10,000 sf: Line 7 Real estate taxes $10,000 ($1.00 psf); Line 9 Property insurance $3,000 ($0.30); Line 10 Off-site management $6,914 (7% of GOI); Line 14 Repairs and maintenance $2,000 ($0.20 exterior/CAM); Line 15 Common-area electric $600 ($0.06); Line 16 Water and sewer $600 ($0.06); Lines 19–21 Accounting/legal/permits/advertising $988 (combined; owner-paid, not in the stop); Line 24 Landscaping $1,200 ($0.12). Lines 8 and 11–13 are $0 (payroll sits inside the management fee). Check: $17,400 stop ($1.74 × 10,000) + $6,914 + $988 = $25,302.",
            "2. Ask price = $73,464 ÷ 0.07 = $1,049,485, rounded to $1,050,000.",
          ],
        },
        {
          task: "Task 6 — Six-year NOI",
          items: [
            "1. NOI worksheet: Y1 $73,464; Y2 $73,464; Y3 $75,946; Y4 $78,008; Y5 $78,008; Y6 $80,173. PRI by year: $106,200 / $106,200 / $109,100 / $111,510 / $111,510 / $114,041.",
            "2. Enter those NOI figures on CFAW line 7 and line 17. Year-6 NOI on the form is $80,173.",
          ],
        },
        {
          task: "Task 7 — Mortgage loans",
          items: [
            "1. Monthly mortgage payment = $5,317.26 (PV $787,500, I/YR 6.5%, 12 P/YR, N = 25 × 12).",
            "2. Amortize the five-year hold (Tab 6 / annual summary). ADS = $63,807.",
            "3. Remaining loan balance at EOY 5 ≈ $713,177.",
            "4. Mortgage Data box: periodic payment $5,317.26; annual debt service $63,807.",
            "5. CFAW line 18 (ADS, not interest only) = $63,807 each year.",
            "6. CFAW line 22 CFBT: Y1 $9,657; Y2 $9,657; Y3 $12,139; Y4 $14,201; Y5 $14,201.",
          ],
        },
        {
          task: "Task 8 — Before-tax IRR",
          items: [
            "1. Selling price = year-6 NOI $80,173 ÷ 0.07 = $1,145,328, rounded to $1,145,000.",
            "2. ACSW lines 17–22: sale $1,145,000 − cost of sale 5% ($57,250) − EOY-5 mortgage ≈ $713,177 = sale proceeds before tax ≈ $374,573.",
            "3. T-bar: t = 0 (−$262,500); Y1 $9,657; Y2 $9,657; Y3 $12,139; Y4 $14,201; Y5 $14,201 + $374,573. Before-tax IRR = 11.27%.",
          ],
        },
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
      "The case is one office walked through every tool in the course.",
      "Do not skip Task 3–4; they feed the APOD vacancy and the lease-up story.",
      "IRR is the last step because it needs operations, loan, and sale together.",
    ],
    practice: "Open the case lab and run Tasks 1–8 in order. Type the packet’s given figures. Confirm IRR only after sale proceeds sit on year 5.",
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
          "Asking price = NOI ÷ cap rate. Round the way the packet tells you.",
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
