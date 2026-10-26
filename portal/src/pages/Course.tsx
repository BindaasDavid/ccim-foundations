import { Link, useParams } from "react-router-dom"
import { modules } from "../data/modules"
import { Page } from "../components/ui"

export function Course() {
  return (
    <Page kicker="Modules" title="Course map">
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((m) => (
          <Link key={m.id} to={`/course/${m.id}`} className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
            <p className="text-xs text-gold-deep">Module {m.number}</p>
            <h3 className="font-serif mt-1 text-xl break-words">{m.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{m.tldr.line}</p>
          </Link>
        ))}
      </div>
    </Page>
  )
}

export function CourseModule() {
  const { id } = useParams()
  const m = modules.find((x) => x.id === id)
  if (!m) return <Page kicker="Course" title="Module not found">Missing module.</Page>
  return (
    <Page kicker={`Module ${m.number}`} title={m.title}>
      <section className="mb-8 rounded-xl border border-gold/50 bg-gold/10 p-4 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">Summary</p>
        <p className="font-serif mt-2 text-xl leading-snug break-words text-ink">{m.tldr.line}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-ink/80">
          {m.tldr.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-semibold tracking-wide uppercase">After this module you should</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/80">
              {m.outcomes.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Agenda</h3>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-ink/80">
              {m.agenda.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ol>
          </section>
          <section>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Study points</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/80">
              {m.focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
          {m.walk && (
            <section className="space-y-5">
              <h3 className="text-sm font-semibold tracking-wide uppercase">How to finish this module</h3>
              {m.walk.map((w) => (
                <div key={w.title}>
                  <p className="font-serif text-lg">{w.title}</p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink/80">
                    {w.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
          <div className="rounded-xl border border-gold/40 bg-gold/10 p-5">
            <p className="text-xs tracking-wide text-gold-deep uppercase">Practice</p>
            <p className="mt-2">{m.practice}</p>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-line bg-paper p-5">
            <p className="text-xs tracking-wide text-ink/50 uppercase">Listen</p>
            <p className="mt-2 text-sm text-ink/70">These notes are what the reader speaks. Nothing is loaded from a course file.</p>
            <Link to={`/listen/${m.id}`} className="mt-4 block rounded-md bg-ink px-3 py-2 text-center text-sm text-cream hover:bg-ink-soft">
              Read this module aloud
            </Link>
          </div>
          <div className="rounded-xl border border-line bg-paper p-5">
            <p className="text-xs tracking-wide text-ink/50 uppercase">Practice</p>
            <ul className="mt-3 space-y-1 text-sm text-ink/80">
              {m.activities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-paper p-5">
            <p className="text-xs tracking-wide text-ink/50 uppercase">Open workshops</p>
            <div className="mt-3 space-y-2">
              {m.tools.map((t) => (
                <Link key={t.href} to={t.href} className="block rounded-md bg-ink px-3 py-2 text-sm text-cream hover:bg-ink-soft">
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </Page>
  )
}
