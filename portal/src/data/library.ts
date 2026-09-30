export type SourceFile = {
  file: string
  kind: "Book" | "Module" | "Form" | "Model" | "Worksheet" | "Reference"
  portal: string
  use: string
}

export const sources: SourceFile[] = [
  {
    file: "FOUND_Full_Book_2025-07-14.pdf",
    kind: "Book",
    portal: "/course",
    use: "Bound reference manual. Module packets below are the working copies.",
  },
  {
    file: "FOUND_M1_Overview_2025-07-14.pdf",
    kind: "Module",
    portal: "/course/1",
    use: "20-page packet: product types, space vs capital markets, services.",
  },
  {
    file: "FOUND_M2_Markets_Trade_Areas_Demos_KS_2025-07-14.pdf",
    kind: "Module",
    portal: "/course/2",
    use: "18-page packet: geography, trade area, skills, strategic model.",
  },
  {
    file: "FOUND_M3_TVM_2025-07-14.pdf",
    kind: "Module",
    portal: "/course/3",
    use: "40-page packet: compounding, discounting, Activity 3-1 drills.",
  },
  {
    file: "FOUND_M4_Leasing_Market_2025-07-14.pdf",
    kind: "Module",
    portal: "/course/4",
    use: "12-page packet: cycles, vacancy, absorption.",
  },
  {
    file: "FOUND_M5_Lease_Clauses_2025-07-14.pdf",
    kind: "Module",
    portal: "/course/5",
    use: "20-page packet: lease types, cash-flow clauses, effective rent.",
  },
  {
    file: "FOUND_M06_Business_Development_2025-07-14.pdf",
    kind: "Module",
    portal: "/course/6",
    use: "34-page packet: territory, prospecting, listing, negotiation.",
  },
  {
    file: "FOUND_M07_Investment_Analysis_Tools_2025-07-14.pdf",
    kind: "Module",
    portal: "/course/7",
    use: "20-page packet: NOI, IRV/cap rate, T-bar.",
  },
  {
    file: "FOUND_M08_Using_IRR_2025-07-14.pdf",
    kind: "Module",
    portal: "/course/8",
    use: "22-page packet: IRR on uneven cash flows, Activity 8-1.",
  },
  {
    file: "FOUND_M09_Mortgage_Loans_2025-07-14.pdf",
    kind: "Module",
    portal: "/course/9",
    use: "32-page packet: annuity loans, balance, balloon.",
  },
  {
    file: "FOUND_M10_Case_Study_2025-07-23.pdf",
    kind: "Module",
    portal: "/course/10",
    use: "48-page office case: eight tasks from market analysis through BTIRR.",
  },
  {
    file: "CCIM_Glossary_2023-02_(2).pdf",
    kind: "Reference",
    portal: "/glossary",
    use: "Searchable study glossary. Official CCIM definitions stay in the PDF.",
  },
  {
    file: "CCIM_Financial_Calculator_V_14.3_2026.04.13.xlsx",
    kind: "Model",
    portal: "/tools/calculator",
    use: "Workbook recreation: TVM, chain, NPV/IRR, differential CF, amortization, stats, math.",
  },
  {
    file: "CCIM_DCF_Analysis_V.12.2_2025.12.10.xlsx",
    kind: "Model",
    portal: "/tools/dcf",
    use: "Holding-period cash flows, sale proceeds, and investment measures.",
  },
  {
    file: "CCIM_APOD_eForm.pdf",
    kind: "Form",
    portal: "/tools/apod",
    use: "Annual Property Operating Data: PRI through CFBT and cap-rate value.",
  },
  {
    file: "CFAW_6Year_eForm.pdf",
    kind: "Form",
    portal: "/tools/cfaw",
    use: "Six-year taxable income and cash flow before/after tax.",
  },
  {
    file: "CCIM_ACSW_eForm.pdf",
    kind: "Form",
    portal: "/tools/acsw",
    use: "Alternative cash sale worksheet: basis, gain, and after-tax proceeds.",
  },
  {
    file: "Annual_Financial_Goal_Worksheet_v2.1.xls",
    kind: "Worksheet",
    portal: "/tools/goals",
    use: "Reverse-engineer closings, leads, and weekly activity from an income goal.",
  },
  {
    file: "Foundations_Skills_Worksheet_v2.0.xls",
    kind: "Worksheet",
    portal: "/tools/skills",
    use: "Rank and weight skills and characteristics to find development gaps.",
  },
  {
    file: "ProbabilityForm.xls",
    kind: "Worksheet",
    portal: "/tools/probability",
    use: "Inventory, users, lease value, and market-share commission potential.",
  },
]
