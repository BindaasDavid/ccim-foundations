import type { CourseModule } from "../data/modules"

export type NoteBlock = {
  heading: string
  text: string
}

/** Spoken review built only from the bundled study notes. */
export function moduleNotes(module: CourseModule): NoteBlock[] {
  const blocks: NoteBlock[] = [{ heading: "Summary", text: module.tldr.line }]
  for (const bullet of module.tldr.bullets) blocks.push({ heading: "Summary", text: bullet })
  for (const item of module.outcomes) blocks.push({ heading: "You should be able to", text: item })
  module.agenda.forEach((item, i) => blocks.push({ heading: "Agenda", text: `${i + 1}. ${item}` }))
  for (const item of module.focus) blocks.push({ heading: "Study point", text: item })
  for (const section of module.walk ?? []) {
    for (const point of section.points) blocks.push({ heading: section.title, text: point })
  }
  blocks.push({ heading: "Practice", text: module.practice })
  for (const item of module.activities) blocks.push({ heading: "Practice", text: item })
  return blocks.filter((block) => block.text.trim().length > 0)
}
