export type HomeworkItem = {
  due: string
  label: string
  session: string
  moduleIds: string[]
  reads: { id: string; title: string; activity: string }[]
  tasks: { n: string; title: string; href: string }[]
  forms: { label: string; href: string; full: string }[]
}

/** Shown through the end of `due` (local calendar day). Past items stay in the data and drop off the home page. */
export const assignments: HomeworkItem[] = [
  {
    due: "2025-09-25",
    label: "Due Friday, September 25, 2025",
    session: "Session 2 homework · complete before Session 3",
    moduleIds: ["5", "6", "10"],
    reads: [
      { id: "5", title: "Leases and Lease Clauses", activity: "Lease clauses self-check" },
      { id: "6", title: "Business Development", activity: "Business development self-check" },
    ],
    tasks: [
      { n: "2", title: "Forecast operating expenses", href: "/tools/case#task-2" },
      { n: "3", title: "Forecast vacancy and absorption", href: "/tools/case#task-3" },
      { n: "4", title: "Quantify concessions and effective rent", href: "/tools/case#task-4" },
    ],
    forms: [
      { label: "APOD", href: "/tools/apod", full: "Annual property operations" },
      { label: "CFAW", href: "/tools/cfaw", full: "Multi-year cash flow" },
      { label: "ACSW", href: "/tools/acsw", full: "Sale proceeds" },
    ],
  },
]

function endOfDueDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d, 23, 59, 59, 999)
}

export function isCurrent(item: HomeworkItem, today = new Date()): boolean {
  return today.getTime() <= endOfDueDay(item.due).getTime()
}

export function currentHomework(today = new Date()): HomeworkItem[] {
  return assignments.filter((item) => isCurrent(item, today))
}
