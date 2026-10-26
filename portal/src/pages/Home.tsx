import { Link } from "react-router-dom"
import { currentHomework } from "../data/homework"
import { modules } from "../data/modules"

export function Home() {
  const due = currentHomework()
  const activeIds = new Set(due.flatMap((item) => item.moduleIds))

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <p className="text-[11px] tracking-[0.22em] text-gold-deep uppercase">Study workspace</p>
      <h2 className="font-serif mt-2 max-w-3xl text-3xl leading-tight break-words text-ink sm:text-4xl">
        Commercial real estate study notes
      </h2>
      <p className="mt-4 max-w-2xl text-ink/70">
        Module notes, a spoken review of those notes, and workshops for rent, value, debt, and cash flow.
      </p>

      {due.map((item) => (
        <div key={item.due} className="mt-8 rounded-xl border border-gold/50 bg-gold/10 p-4 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">{item.label}</p>
          <h3 className="font-serif mt-2 text-2xl break-words">{item.session}</h3>
          <ol className="mt-6 space-y-6">
            <li className="rounded-lg border border-line bg-paper p-4 sm:p-5">
              <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">1 · Read</p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {item.reads.map((read) => {
                  const module = modules.find((m) => m.id === read.id)
                  return (
                    <div key={read.id}>
                      <Link to={`/course/${read.id}`} className="font-serif text-xl break-words hover:text-gold-deep">
                        Module {read.id}: {read.title}
                      </Link>
                      {module ? <p className="mt-2 text-sm leading-relaxed text-ink/75">{module.tldr.line}</p> : null}
                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        <Link to={`/course/${read.id}`} className="text-gold-deep">
                          Open module
                        </Link>
                        <Link to={`/listen/${read.id}`} className="text-gold-deep">
                          Listen
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </li>
            <li className="rounded-lg border border-line bg-paper p-4 sm:p-5">
              <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">2 · Self-checks</p>
              <ul className="mt-3 space-y-2 text-sm">
                {item.reads.map((read) => (
                  <li key={read.id}>
                    <Link to={`/course/${read.id}`} className="text-gold-deep">
                      {read.activity}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="rounded-lg border border-line bg-paper p-4 sm:p-5">
              <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">3 · Case lab</p>
              <ul className="mt-3 space-y-2">
                {item.tasks.map((task) => (
                  <li key={task.n}>
                    <Link to={task.href} className="text-sm text-gold-deep hover:underline">
                      Step {task.n}: {task.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="rounded-lg border border-line bg-paper p-4 sm:p-5">
              <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">4 · Worksheets</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {item.forms.map((form) => (
                  <Link key={form.href} to={form.href} className="rounded-lg border border-line bg-cream/40 p-4 hover:border-gold">
                    <p className="text-xs text-gold-deep">{form.label}</p>
                    <p className="font-serif mt-1 text-lg">{form.full}</p>
                  </Link>
                ))}
              </div>
            </li>
          </ol>
        </div>
      ))}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/practice" className="rounded-xl border border-gold/50 bg-gold/10 p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Practice</p>
          <p className="font-serif mt-2 text-2xl">100-question mock</p>
          <p className="mt-2 text-sm text-ink/60">Submit each item. See right or wrong, then why.</p>
        </Link>
        <Link to="/listen" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Listen</p>
          <p className="font-serif mt-2 text-2xl">Read aloud</p>
          <p className="mt-2 text-sm text-ink/60">Hear the module notes already on this site.</p>
        </Link>
        <Link to="/course" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Course</p>
          <p className="font-serif mt-2 text-2xl">10 modules</p>
          <p className="mt-2 text-sm text-ink/60">Outcomes, agenda, study points, and a workshop.</p>
        </Link>
      </div>

      <h3 className="font-serif mt-12 text-2xl">Suggested path</h3>
      <ol className="mt-4 space-y-2">
        {modules.map((m) => (
          <li key={m.id}>
            <Link to={`/course/${m.id}`} className="flex items-baseline gap-3 text-sm hover:text-gold-deep">
              <span className="w-8 shrink-0 font-medium text-gold-deep">{String(m.number).padStart(2, "0")}</span>
              <span className="min-w-0 break-words">{m.title}</span>
              {activeIds.has(m.id) ? <span className="text-xs text-gold-deep">Current</span> : null}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
