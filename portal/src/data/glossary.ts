export type GlossaryEntry = {
  term: string
  definition: string
  module: string
}

export const glossary: GlossaryEntry[] = [
  { term: "Absorption", definition: "Net change in occupied space over a period. Positive absorption means more space became occupied than vacated.", module: "4" },
  { term: "Adjusted basis", definition: "Acquisition basis plus capital additions, minus cost recovery and any basis allocated to partial sales.", module: "10" },
  { term: "Annual debt service (ADS)", definition: "Total principal and interest due on the loan(s) during the year.", module: "7" },
  { term: "Annuity", definition: "A level series of payments or receipts at regular intervals.", module: "3" },
  { term: "Appreciation", definition: "Increase in property value during the holding period.", module: "7" },
  { term: "Balloon payment", definition: "Remaining principal due when the loan term ends before full amortization.", module: "9" },
  { term: "Before-tax cash flow (CFBT)", definition: "NOI minus debt service and other below-the-line cash uses such as reserves or leasing commissions.", module: "7" },
  { term: "Breakpoint", definition: "Sales level at which percentage rent begins; often base rent divided by the overage rate.", module: "5" },
  { term: "Cap rate", definition: "NOI divided by price (or value). Used to convert a stabilized income into an indicated value.", module: "7" },
  { term: "Capital market", definition: "The market for investment capital and required returns, distinct from the space/occupancy market.", module: "1" },
  { term: "Cash-on-cash", definition: "Periodic cash flow divided by initial equity investment.", module: "8" },
  { term: "Compounding", definition: "Growing a present amount forward by earning a return on both principal and prior earnings.", module: "3" },
  { term: "Cost recovery", definition: "Tax depreciation of improvements (and personal property) over a statutory useful life.", module: "7" },
  { term: "Discounting", definition: "Converting a future cash flow into a present value at a required rate.", module: "3" },
  { term: "Effective rental income", definition: "Potential rental income minus vacancy and credit loss.", module: "7" },
  { term: "Expense stop", definition: "Owner pays operating expenses up to a stated amount; the tenant pays the excess.", module: "5" },
  { term: "Future value (FV)", definition: "What a present amount, plus or minus payments, is worth at the end of n periods.", module: "3" },
  { term: "Gross operating income (GOI)", definition: "Effective rental income plus other collectible income.", module: "7" },
  { term: "Gross rent multiplier", definition: "Price divided by gross rent; a quick, unsophisticated pricing check.", module: "8" },
  { term: "Holding period", definition: "Years the investor expects to own the property before sale.", module: "8" },
  { term: "Initial investment", definition: "Price plus acquisition and loan costs, minus mortgage proceeds — the equity outlay at t=0.", module: "7" },
  { term: "Internal rate of return (IRR)", definition: "Discount rate that makes the NPV of the investment cash-flow series equal zero.", module: "8" },
  { term: "Loan-to-value (LTV)", definition: "Loan amount divided by value or price.", module: "9" },
  { term: "Market rent", definition: "Rent a typical tenant would pay for comparable space today, not necessarily contract rent.", module: "7" },
  { term: "Net operating income (NOI)", definition: "GOI minus operating expenses. Debt service and income tax are not operating expenses.", module: "7" },
  { term: "Net present value (NPV)", definition: "Sum of discounted cash flows, including the initial outlay. Positive NPV beats the hurdle rate.", module: "8" },
  { term: "Potential rental income (PRI)", definition: "Rent if the property were fully occupied at the rents used in the analysis.", module: "7" },
  { term: "Present value (PV)", definition: "Value today of future cash flows discounted at the periodic rate.", module: "3" },
  { term: "Recapture", definition: "Portion of gain on sale attributable to cost recovery previously taken, often taxed differently from appreciation.", module: "10" },
  { term: "Sale proceeds after tax", definition: "Sale price minus costs, loan payoff, and taxes on ordinary items, recapture, and capital gain.", module: "10" },
  { term: "Space market", definition: "The occupancy market where tenants and landlords set rents and vacancy.", module: "1" },
  { term: "T-bar", definition: "A timeline that lists equity out at t=0, annual cash flows, and sale proceeds in the exit year.", module: "7" },
  { term: "Vacancy rate", definition: "Vacant space (or lost rent) divided by total space (or potential rent).", module: "4" },
  { term: "Effective rent", definition: "Face rent after spreading free rent, TIs, and other concessions over the lease term.", module: "5" },
  { term: "IRV", definition: "Income = Rate × Value. Solve for NOI, cap rate, or price when the other two are known.", module: "7" },
  { term: "Net absorption", definition: "Change in occupied space over a period: ending occupied minus starting occupied.", module: "4" },
]
