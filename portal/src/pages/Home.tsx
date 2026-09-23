import { Link } from "react-router-dom"
import { sources } from "../data/library"
import { modules } from "../data/modules"

export function Home() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <p className="text-[11px] tracking-[0.22em] text-gold-deep uppercase">Study workspace</p>
      <h2 className="font-serif mt-2 max-w-2xl text-4xl leading-tight text-ink">
        Foundations for Success — interactive portal
      </h2>
      <p className="mt-4 max-w-2xl text-ink/70">
        Twenty source files are mapped here: the bound manual, ten module packets, the calculator
        workbooks, and the production worksheets. Each module page now follows its packet agenda.
      </p>

      <div className="mt-10 rounded-xl border border-gold/50 bg-gold/10 p-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">Today</p>
        <h3 className="font-serif mt-2 text-2xl">Modules 1 and 2</h3>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {modules.slice(0, 2).map((m) => (
            <Link key={m.id} to={`/course/${m.id}`} className="block rounded-lg border border-line bg-paper p-5 hover:border-gold">
              <p className="text-xs text-gold-deep">Module {m.number}</p>
              <p className="font-serif mt-1 text-xl">{m.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{m.tldr.line}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink/70">
                {m.tldr.bullets.slice(0, 3).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
        <Link to="/course/10" className="mt-6 block rounded-lg border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep">Module 10 · completed</p>
          <p className="font-serif mt-1 text-xl">{modules[9].title}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">{modules[9].tldr.line}</p>
          <p className="mt-3 text-sm text-gold-deep">Open the module, then run the case lab through Task 8.</p>
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link to="/listen" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Listen</p>
          <p className="font-serif mt-2 text-2xl">Read aloud</p>
          <p className="mt-2 text-sm text-ink/60">The computer reads modules 1–10 from the official packets.</p>
        </Link>
        <Link to="/course" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Start here</p>
          <p className="font-serif mt-2 text-2xl">10 modules</p>
          <p className="mt-2 text-sm text-ink/60">Each packet has outcomes, agenda, activities, and a workshop.</p>
        </Link>
        <Link to="/tools/dcf" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Core analysis</p>
          <p className="font-serif mt-2 text-2xl">APOD → DCF</p>
          <p className="mt-2 text-sm text-ink/60">Same stack as the case study: operations, hold, sale, IRR.</p>
        </Link>
        <Link to="/tools/goals" className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
          <p className="text-xs text-gold-deep uppercase">Practice</p>
          <p className="font-serif mt-2 text-2xl">Book of business</p>
          <p className="mt-2 text-sm text-ink/60">Goals, skills, and territory probability in one place.</p>
        </Link>
      </div>

      <h3 className="font-serif mt-12 text-2xl">Suggested path</h3>
      <ol className="mt-4 space-y-2">
        {modules.map((m) => (
          <li key={m.id}>
            <Link to={`/course/${m.id}`} className="flex items-baseline gap-3 text-sm hover:text-gold-deep">
              <span className="w-8 font-medium text-gold-deep">{String(m.number).padStart(2, "0")}</span>
              <span>{m.title}</span>
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-xs text-ink/50">{sources.length} source files ingested from Support Materials.</p>
    </div>
  )
}
