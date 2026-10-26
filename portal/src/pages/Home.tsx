import { Link } from "react-router-dom"
import { dueLabel, openAssignments, type HomeworkItem } from "../data/homework"
import { modules } from "../data/modules"

export function Home() {
  const due = openAssignments()

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <p className="text-[11px] tracking-[0.22em] text-gold-deep uppercase">Study workspace</p>
      <h2 className="font-serif mt-2 max-w-2xl text-3xl leading-tight text-ink md:text-4xl">
        Foundations for Success — interactive portal
      </h2>
      <p className="mt-4 max-w-2xl text-ink/70">
        Study notes for ten modules, plus workshops for time value, leasing math, and the cash-flow forms.
      </p>

      {due.map((item) => (
        <HomeworkCard key={item.due} item={item} />
      ))}

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link to="/practice" className="rounded-xl border border-gold/50 bg-gold/10 p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Practice</p>
          <p className="font-serif mt-2 text-2xl">100-question mock</p>
          <p className="mt-2 text-sm text-ink/60">Submit each item. See right or wrong, then why.</p>
        </Link>
        <Link to="/listen" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Listen</p>
          <p className="font-serif mt-2 text-2xl">Read aloud</p>
          <p className="mt-2 text-sm text-ink/60">Study notes for modules 1–10, read on this device.</p>
        </Link>
        <Link to="/course" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Course</p>
          <p className="font-serif mt-2 text-2xl">10 modules</p>
          <p className="mt-2 text-sm text-ink/60">Outcomes, agenda, study points, and a workshop for each module.</p>
        </Link>
        <Link to="/tools/case" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Case lab</p>
          <p className="font-serif mt-2 text-2xl">Office case</p>
          <p className="mt-2 text-sm text-ink/60">Expense stop, vacancy, effective rent, and before-tax IRR.</p>
        </Link>
      </div>

      <h3 className="font-serif mt-12 text-2xl">Suggested path</h3>
      <ol className="mt-4 space-y-2">
        {modules.map((m) => (
          <li key={m.id}>
            <Link to={`/course/${m.id}`} className="flex items-baseline gap-3 py-1 text-sm hover:text-gold-deep">
              <span className="w-8 shrink-0 font-medium text-gold-deep">{String(m.number).padStart(2, "0")}</span>
              <span>{m.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

function HomeworkCard({ item }: { item: HomeworkItem }) {
  const reads = item.reads.map((r) => modules.find((m) => m.id === r.id)).filter((m) => m != null)

  return (
    <div className="mt-10 rounded-xl border border-gold/50 bg-gold/10 p-4 md:p-6">
      <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">{dueLabel(item.due)}</p>
      <h3 className="font-serif mt-2 text-2xl">{item.session}</h3>
      <p className="mt-1 text-sm text-ink/55">Work the printed module. Use the links to listen and check the math.</p>

      <ol className="mt-6 space-y-6">
        <li className="rounded-lg border border-line bg-paper p-4 md:p-5">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">1 · Read</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {reads.map((m) => (
              <div key={m.id}>
                <Link to={`/course/${m.id}`} className="font-serif text-xl hover:text-gold-deep">
                  Module {m.number}: {m.title}
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{m.tldr.line}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link to={`/course/${m.id}`} className="inline-flex min-h-11 items-center text-gold-deep">
                    Open module →
                  </Link>
                  <Link to={`/listen/${m.id}`} className="inline-flex min-h-11 items-center text-gold-deep">
                    Listen →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </li>

        <li className="rounded-lg border border-line bg-paper p-4 md:p-5">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">2 · Self-assessments</p>
          <p className="mt-2 text-sm text-ink/70">Complete these in the printed modules, then check the related workshops.</p>
          <ul className="mt-3 space-y-2 text-sm">
            {item.reads.map((r) => (
              <li key={r.id}>
                <Link to={`/course/${r.id}`} className="text-gold-deep">
                  {r.activity}
                </Link>
                <span className="text-ink/55"> · Module {r.id}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/tools/effective-rent" className="rounded-md bg-ink px-3 py-2 text-sm text-cream hover:bg-ink-soft">
              Effective rent
            </Link>
            <Link to="/tools/goals" className="rounded-md bg-ink px-3 py-2 text-sm text-cream hover:bg-ink-soft">
              Annual goal
            </Link>
            <Link to="/tools/skills" className="rounded-md bg-ink px-3 py-2 text-sm text-cream hover:bg-ink-soft">
              Skills
            </Link>
          </div>
        </li>

        <li className="rounded-lg border border-line bg-paper p-4 md:p-5">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">3 · Module 10 case</p>
          <p className="mt-2 text-sm text-ink/70">Review the case, then finish these tasks.</p>
          <ul className="mt-3 space-y-2">
            {item.caseTasks.map((t) => (
              <li key={t.n}>
                <Link to={t.href} className="text-sm text-gold-deep hover:underline">
                  Task {t.n}: {t.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/tools/case#task-2" className="mt-4 inline-flex min-h-11 items-center rounded-md bg-ink px-3 py-2 text-sm text-cream hover:bg-ink-soft">
            Open case lab at Task 2
          </Link>
        </li>

        <li className="rounded-lg border border-line bg-paper p-4 md:p-5">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">4 · Review the business forms</p>
          <p className="mt-2 text-sm text-ink/70">Walk each interactive sheet. Gold rows total the lines named next to them.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {item.forms.map((f) => (
              <Link key={f.href} to={f.href} className="rounded-lg border border-line bg-cream/40 p-4 hover:border-gold">
                <p className="text-xs text-gold-deep">{f.label}</p>
                <p className="font-serif mt-1 text-lg">{f.full}</p>
              </Link>
            ))}
          </div>
        </li>
      </ol>
    </div>
  )
}
