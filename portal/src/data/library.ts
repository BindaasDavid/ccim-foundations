// Copyright review: these blurbs are original one-line study notes.
// Official packet and workbook file names are not stored here, so they are not shipped.
// Nothing in this file reads as a transcribed passage from the course packets.

export type SourceFile = {
  title: string
  kind: "Book" | "Module" | "Form" | "Model" | "Worksheet" | "Reference"
  portal: string
  use: string
}

export const sources: SourceFile[] = [
  {
    title: "Bound manual",
    kind: "Book",
    portal: "/course",
    use: "Course map for the ten modules. The working notes live on each module page.",
  },
  {
    title: "Module 1 · Overview",
    kind: "Module",
    portal: "/course/1",
    use: "Product types, space versus capital markets, and services you can offer.",
  },
  {
    title: "Module 2 · Markets",
    kind: "Module",
    portal: "/course/2",
    use: "Geography, trade area, skills, and a strategic model for a territory.",
  },
  {
    title: "Module 3 · Time value",
    kind: "Module",
    portal: "/course/3",
    use: "Compounding, discounting, and the calculator drill set.",
  },
  {
    title: "Module 4 · Leasing market",
    kind: "Module",
    portal: "/course/4",
    use: "Cycles, vacancy, and absorption.",
  },
  {
    title: "Module 5 · Lease clauses",
    kind: "Module",
    portal: "/course/5",
    use: "Lease types, cash-flow clauses, and effective rent.",
  },
  {
    title: "Module 6 · Business development",
    kind: "Module",
    portal: "/course/6",
    use: "Territory, prospecting, listing, and negotiation.",
  },
  {
    title: "Module 7 · Investment tools",
    kind: "Module",
    portal: "/course/7",
    use: "NOI, IRV and cap rate, and the T-bar.",
  },
  {
    title: "Module 8 · IRR",
    kind: "Module",
    portal: "/course/8",
    use: "IRR on uneven cash flows.",
  },
  {
    title: "Module 9 · Mortgage loans",
    kind: "Module",
    portal: "/course/9",
    use: "Annuity loans, remaining balance, and balloon.",
  },
  {
    title: "Module 10 · Office case",
    kind: "Module",
    portal: "/course/10",
    use: "Eight tasks from market analysis through before-tax IRR.",
  },
  {
    title: "Glossary",
    kind: "Reference",
    portal: "/glossary",
    use: "Searchable study glossary written for this portal.",
  },
  {
    title: "Financial calculator",
    kind: "Model",
    portal: "/tools/calculator",
    use: "TVM, chain, NPV and IRR, differential cash flow, amortization, stats, and math.",
  },
  {
    title: "Discounted cash flow",
    kind: "Model",
    portal: "/tools/dcf",
    use: "Holding-period cash flows, sale proceeds, and investment measures.",
  },
  {
    title: "Annual property operating data",
    kind: "Form",
    portal: "/tools/apod",
    use: "Potential rent through cash flow before tax, and a cap-rate value.",
  },
  {
    title: "Six-year cash flow worksheet",
    kind: "Form",
    portal: "/tools/cfaw",
    use: "Six-year taxable income and cash flow before and after tax.",
  },
  {
    title: "Alternative cash sale",
    kind: "Form",
    portal: "/tools/acsw",
    use: "Basis, gain, and after-tax sale proceeds.",
  },
  {
    title: "Annual financial goal",
    kind: "Worksheet",
    portal: "/tools/goals",
    use: "Work backward from an income goal to closings, leads, and weekly contacts.",
  },
  {
    title: "Skills evaluation",
    kind: "Worksheet",
    portal: "/tools/skills",
    use: "Rank and weight skills to find development gaps.",
  },
  {
    title: "Probability of success",
    kind: "Worksheet",
    portal: "/tools/probability",
    use: "Inventory, users, lease value, and a share of commission potential.",
  },
]
