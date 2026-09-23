export type ReadingPage = {
  page: number
  paragraphs: string[]
}

export type ReadingDoc = {
  id: string
  file: string
  pages: ReadingPage[]
}

const tocNoise = /\.{6,}|_{6,}|…{3,}/

export function isSpeakable(text: string): boolean {
  const t = text.trim()
  if (t.length < 40) return false
  if (tocNoise.test(t) && t.length < 400) return false
  if (/^answers to activity/i.test(t) && t.length < 80) return false
  return true
}

export function flatten(doc: ReadingDoc, skipAnswers: boolean): { page: number; text: string }[] {
  const rows: { page: number; text: string }[] = []
  for (const p of doc.pages) {
    const isAnswer =
      skipAnswers &&
      p.paragraphs.some((x) => /answers to (activity|task)/i.test(x) || /^answer section/i.test(x))
    if (isAnswer) continue
    for (const para of p.paragraphs) {
      if (isSpeakable(para)) rows.push({ page: p.page, text: para })
    }
  }
  return rows
}

export async function loadReading(id: string): Promise<ReadingDoc> {
  const res = await fetch(`/readings/module-${id}.json`)
  if (!res.ok) throw new Error(`Could not load module ${id}`)
  return res.json()
}
