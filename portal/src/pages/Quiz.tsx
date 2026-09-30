import { useMemo, useState } from "react"
import { quizQuestions } from "../data/quiz"
import { loadState, saveState } from "../lib/storage"
import { Page } from "../components/ui"

type Progress = {
  index: number
  picks: Array<number | null>
  checked: boolean[]
}

const KEY = "foundations-quiz-v1"
const empty = (): Progress => ({
  index: 0,
  picks: Array(quizQuestions.length).fill(null),
  checked: Array(quizQuestions.length).fill(false),
})

export function Quiz() {
  const [p, setP] = useState<Progress>(() => loadState(KEY, empty()))
  const q = quizQuestions[p.index]
  const pick = q ? p.picks[p.index] : null
  const checked = q ? p.checked[p.index] : false
  const correct = pick === q?.answer

  const scored = useMemo(() => {
    let right = 0
    let done = 0
    quizQuestions.forEach((item, i) => {
      if (!p.checked[i] || p.picks[i] == null) return
      done += 1
      if (p.picks[i] === item.answer) right += 1
    })
    return { right, done, total: quizQuestions.length }
  }, [p])

  const finished = scored.done === quizQuestions.length

  function persist(next: Progress) {
    setP(next)
    saveState(KEY, next)
  }

  function choose(i: number) {
    if (checked) return
    const picks = [...p.picks]
    picks[p.index] = i
    persist({ ...p, picks })
  }

  function submit() {
    if (pick == null) return
    const checkedNext = [...p.checked]
    checkedNext[p.index] = true
    persist({ ...p, checked: checkedNext })
  }

  function go(delta: number) {
    const index = Math.min(quizQuestions.length - 1, Math.max(0, p.index + delta))
    persist({ ...p, index })
  }

  function jump(index: number) {
    persist({ ...p, index })
  }

  function reset() {
    persist(empty())
  }

  if (!q) return <Page kicker="Practice" title="Mock test">Missing question.</Page>

  return (
    <Page kicker="Practice exam" title="100-question mock test" source="Original study items covering Modules 1–10 and the APOD / CFAW / ACSW stack">
      <p className="mb-6 text-sm text-ink/65">
        Pick an answer, then submit that question. You will see whether you were right and why.
        Progress is saved in this browser.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-md border border-line bg-paper px-3 py-1.5">
          Question {p.index + 1} of {quizQuestions.length}
        </span>
        <span className="rounded-md border border-line bg-paper px-3 py-1.5">
          Submitted {scored.done} · Correct {scored.right}
        </span>
        <span className="rounded-md border border-gold/40 bg-gold/10 px-3 py-1.5 text-gold-deep">
          Module {q.module}
        </span>
        <button type="button" className="ml-auto text-sm text-ink/50 hover:text-ink" onClick={reset}>
          Start over
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {quizQuestions.map((item, i) => {
          const state = p.checked[i]
            ? p.picks[i] === item.answer
              ? "bg-emerald-700 text-white"
              : "bg-red-800 text-white"
            : i === p.index
              ? "bg-gold text-ink"
              : "bg-white text-ink/50"
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => jump(i)}
              className={`h-7 w-7 rounded text-[11px] ${state}`}
              title={`Question ${i + 1}`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border border-line bg-paper p-6">
        <p className="font-serif text-2xl leading-snug text-ink">{q.prompt}</p>
        <ul className="mt-6 space-y-2">
          {q.choices.map((choice, i) => {
            const selected = pick === i
            let tone = "border-line bg-white hover:border-gold"
            if (checked) {
              if (i === q.answer) tone = "border-emerald-700 bg-emerald-50"
              else if (selected) tone = "border-red-800 bg-red-50"
              else tone = "border-line bg-white text-ink/50"
            } else if (selected) {
              tone = "border-gold bg-gold/15"
            }
            return (
              <li key={choice}>
                <button
                  type="button"
                  disabled={checked}
                  onClick={() => choose(i)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${tone}`}
                >
                  <span className="mr-2 font-medium text-ink/45">{String.fromCharCode(65 + i)}.</span>
                  {choice}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          {!checked ? (
            <button
              type="button"
              disabled={pick == null}
              onClick={submit}
              className="rounded-md bg-ink px-4 py-2 text-sm text-cream disabled:opacity-40"
            >
              Submit this answer
            </button>
          ) : (
            <button type="button" onClick={() => go(1)} className="rounded-md bg-ink px-4 py-2 text-sm text-cream">
              {p.index === quizQuestions.length - 1 ? "Review score" : "Next question"}
            </button>
          )}
          <button type="button" onClick={() => go(-1)} disabled={p.index === 0} className="rounded-md border border-line px-4 py-2 text-sm disabled:opacity-40">
            Previous
          </button>
        </div>

        {checked && (
          <div
            className={`mt-6 rounded-lg border p-4 ${
              correct ? "border-emerald-700 bg-emerald-50" : "border-red-800 bg-red-50"
            }`}
          >
            <p className="text-sm font-semibold">
              {correct ? "Correct." : "Not correct."} The right answer is {String.fromCharCode(65 + q.answer)}. {q.choices[q.answer]}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{q.why}</p>
          </div>
        )}
      </div>

      {finished && (
        <div className="mt-8 rounded-xl border-2 border-gold bg-gold/15 p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">Test complete</p>
          <p className="font-serif mt-2 text-3xl">
            {scored.right} / {scored.total} ({Math.round((scored.right / scored.total) * 100)}%)
          </p>
          <p className="mt-2 text-sm text-ink/70">
            Use the number grid to reopen any miss. The explanation stays with each submitted item.
          </p>
        </div>
      )}
    </Page>
  )
}
