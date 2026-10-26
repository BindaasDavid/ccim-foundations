export type StudyArea = {
  title: string
  kind: "Notes" | "Workshop" | "Reference"
  portal: string
  use: string
}

export const studyAreas: StudyArea[] = [
  {
    title: "Course map",
    kind: "Notes",
    portal: "/course",
    use: "Ten study modules: outcomes, agenda, and practice notes.",
  },
  {
    title: "Listen",
    kind: "Notes",
    portal: "/listen",
    use: "Read the same module notes aloud in the browser.",
  },
  {
    title: "Glossary",
    kind: "Reference",
    portal: "/glossary",
    use: "Short original definitions for the terms used in the workshops.",
  },
  {
    title: "Mock test",
    kind: "Reference",
    portal: "/practice",
    use: "One hundred original practice questions with explanations.",
  },
  {
    title: "Financial calculator",
    kind: "Workshop",
    portal: "/tools/calculator",
    use: "Time value of money, NPV, IRR, amortization, and basic math.",
  },
  {
    title: "Discounted cash flow",
    kind: "Workshop",
    portal: "/tools/dcf",
    use: "Hold-period operations, sale proceeds, and before- and after-tax measures.",
  },
  {
    title: "Annual property operations",
    kind: "Workshop",
    portal: "/tools/apod",
    use: "Potential rent through NOI, cash flow before tax, and a cap-rate value.",
  },
  {
    title: "Multi-year cash flow",
    kind: "Workshop",
    portal: "/tools/cfaw",
    use: "Six years of taxable income and cash flow before and after tax.",
  },
  {
    title: "Sale proceeds",
    kind: "Workshop",
    portal: "/tools/acsw",
    use: "Basis, gain, and cash proceeds before and after tax.",
  },
  {
    title: "Annual income goal",
    kind: "Workshop",
    portal: "/tools/goals",
    use: "Work backward from an income goal to closings, leads, and weekly contacts.",
  },
  {
    title: "Skills check",
    kind: "Workshop",
    portal: "/tools/skills",
    use: "Rank and weight skills to see where practice time should go.",
  },
  {
    title: "Probability of success",
    kind: "Workshop",
    portal: "/tools/probability",
    use: "Turn inventory and users into a commission pool and a share of it.",
  },
]
