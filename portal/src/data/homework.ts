export type HomeworkItem = {
  /** Calendar due date, YYYY-MM-DD. Hidden once this date is in the past. */
  due: string
  session: string
  reads: { id: string; title: string; activity: string }[]
  caseTasks: { n: string; title: string; href: string }[]
  forms: { label: string; href: string; full: string }[]
}

export const assignments: HomeworkItem[] = [
  {
    due: "2026-09-25",
    session: "Session 2 homework · complete before Session 3",
    reads: [
      { id: "5", title: "Leases and Lease Clauses", activity: "Activity 5-1" },
      { id: "6", title: "Business Development", activity: "Activity 6-1" },
    ],
    caseTasks: [
      { n: "2", title: "Forecast operating expenses", href: "/tools/case#task-2" },
      { n: "3", title: "Forecast vacancy and absorption", href: "/tools/case#task-3" },
      { n: "4", title: "Quantify concessions, allowances, and effective rent", href: "/tools/case#task-4" },
    ],
    forms: [
      { label: "APOD", href: "/tools/apod", full: "Annual Property Operating Data" },
      { label: "CFAW", href: "/tools/cfaw", full: "Cash Flow Analysis Worksheet" },
      { label: "ACSW", href: "/tools/acsw", full: "Alternative Cash Sale Worksheet" },
    ],
  },
]

export function dueLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(y, (m ?? 1) - 1, d ?? 1)
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
  return `Due ${formatted}`
}

/** Assignments whose due date is today or later. Past-due items stay in the data and stay off the page. */
export function openAssignments(today = new Date()): HomeworkItem[] {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  return assignments.filter((item) => {
    const [y, m, d] = item.due.split("-").map(Number)
    return new Date(y, (m ?? 1) - 1, d ?? 1).getTime() >= start
  })
}
