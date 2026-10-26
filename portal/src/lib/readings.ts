import type { CourseModule } from "../data/modules"

export type NoteBlock = {
  heading: string
  text: string
}

/**
 * Passages Listen can read aloud. Built only from the study notes in modules.ts.
 * Answer-key text is omitted: that block is flagged for a copyright review.
 */
export function spokenNotes(m: CourseModule): NoteBlock[] {
  const blocks: NoteBlock[] = [
    { heading: "Summary", text: m.tldr.line },
    ...m.tldr.bullets.map((text, i) => ({ heading: `Note ${i + 1}`, text })),
    ...m.outcomes.map((text) => ({ heading: "Outcome", text })),
    ...m.agenda.map((text) => ({ heading: "Agenda", text })),
    ...m.activities.map((text) => ({ heading: "Activity", text })),
    ...m.focus.map((text) => ({ heading: "Study point", text })),
    { heading: "Practice", text: m.practice },
  ]
  for (const section of m.walk ?? []) {
    for (const text of section.points) blocks.push({ heading: section.title, text })
  }
  return blocks.filter((b) => b.text.trim().length > 0)
}
