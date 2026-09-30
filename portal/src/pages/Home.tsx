import { Link } from "react-router-dom"
import { fridayDue } from "../data/homework"
import { sources } from "../data/library"
import { modules } from "../data/modules"

export function Home() {
  const m5 = modules.find((m) => m.id === "5")!
  const m6 = modules.find((m) => m.id === "6")!

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <p className="text-[11px] tracking-[0.22em] text-gold-deep uppercase">Study workspace</p>
      <h2 className="font-serif mt-2 max-w-2xl text-4xl leading-tight text-ink">
        Foundations for Success — interactive portal
      </h2>
      <p className="mt-4 max-w-2xl text-ink/70">
        Twenty source files are mapped here: the bound manual, ten module packets, the calculator
        workbooks, and the production worksheets.
      </p>

      <div className="mt-10 rounded-xl border border-gold/50 bg-gold/10 p-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">{fridayDue.label}</p>
        <h3 className="font-serif mt-2 text-2xl">{fridayDue.session}</h3>
        <p className="mt-1 text-sm text-ink/55">From {fridayDue.source}. Work the printed packet; use the links to listen, score, and check math.</p>

        <ol className="mt-6 space-y-6">
          <li className="rounded-lg border border-line bg-paper p-5">
            <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">1 · Read</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {[m5, m6].map((m) => (
                <div key={m.id}>
                  <Link to={`/course/${m.id}`} className="font-serif text-xl hover:text-gold-deep">
                    Module {m.number}: {m.title}
                  </Link>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{m.tldr.line}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <Link to={`/course/${m.id}`} className="text-gold-deep">
                      Open module →
                    </Link>
                    <Link to={`/listen/${m.id}`} className="text-gold-deep">
                      Listen →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </li>

          <li className="rounded-lg border border-line bg-paper p-5">
            <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">2 · Self-assessments</p>
            <p className="mt-2 text-sm text-ink/70">Complete these in the printed packets, then check the related workshops.</p>
            <ul className="mt-3 space-y-2 text-sm">
              {fridayDue.reads.map((r) => (
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

          <li className="rounded-lg border border-line bg-paper p-5">
            <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
              3 · Module 10 case · pages {fridayDue.case.pages}
            </p>
            <p className="mt-2 text-sm text-ink/70">Review the case pages, then finish only these three tasks this week.</p>
            <ul className="mt-3 space-y-2">
              {fridayDue.case.tasks.map((t) => (
                <li key={t.n}>
                  <Link to={t.href} className="text-sm text-gold-deep hover:underline">
                    Task {t.n}: {t.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/tools/case#task-2" className="mt-4 inline-block rounded-md bg-ink px-3 py-2 text-sm text-cream hover:bg-ink-soft">
              Open case lab at Task 2
            </Link>
          </li>

          <li className="rounded-lg border border-line bg-paper p-5">
            <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">4 · Review the business forms</p>
            <p className="mt-2 text-sm text-ink/70">
              Walk each interactive sheet. Gold rows total the lines named next to them.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {fridayDue.forms.map((f) => (
                <Link key={f.href} to={f.href} className="rounded-lg border border-line bg-cream/40 p-4 hover:border-gold">
                  <p className="text-xs text-gold-deep">{f.label}</p>
                  <p className="font-serif mt-1 text-lg">{f.full}</p>
                </Link>
              ))}
            </div>
          </li>
        </ol>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link to="/practice" className="rounded-xl border border-gold/50 bg-gold/10 p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Practice</p>
          <p className="font-serif mt-2 text-2xl">100-question mock</p>
          <p className="mt-2 text-sm text-ink/60">Submit each item. See right or wrong, then why.</p>
        </Link>
        <Link to="/listen" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Listen</p>
          <p className="font-serif mt-2 text-2xl">Read aloud</p>
          <p className="mt-2 text-sm text-ink/60">Start with Modules 5 and 6 for Friday.</p>
        </Link>
        <Link to="/course" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Course</p>
          <p className="font-serif mt-2 text-2xl">10 modules</p>
          <p className="mt-2 text-sm text-ink/60">Each packet has outcomes, agenda, activities, and a workshop.</p>
        </Link>
        <Link to="/tools/case#task-2" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Case this week</p>
          <p className="font-serif mt-2 text-2xl">Tasks 2–4</p>
          <p className="mt-2 text-sm text-ink/60">Expense stop, vacancy/absorption, effective rent.</p>
        </Link>
      </div>

      <h3 className="font-serif mt-12 text-2xl">Suggested path</h3>
      <ol className="mt-4 space-y-2">
        {modules.map((m) => (
          <li key={m.id}>
            <Link to={`/course/${m.id}`} className="flex items-baseline gap-3 text-sm hover:text-gold-deep">
              <span className="w-8 font-medium text-gold-deep">{String(m.number).padStart(2, "0")}</span>
              <span>{m.title}</span>
              {(m.id === "5" || m.id === "6" || m.id === "10") && (
                <span className="text-xs text-gold-deep">Friday</span>
              )}
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-xs text-ink/50">{sources.length} source files ingested from Support Materials.</p>
    </div>
  )
}
