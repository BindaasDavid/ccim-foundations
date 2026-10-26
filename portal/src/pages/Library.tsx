import { Link } from "react-router-dom"
import { sources } from "../data/library"
import { Page } from "../components/ui"

export function Library() {
  return (
    <Page kicker="In this portal" title="Notes and workshops">
      <div className="grid gap-3">
        {sources.map((s) => (
          <article key={s.title} className="rounded-xl border border-line bg-paper p-4 md:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif text-lg">{s.title}</h3>
              <p className="text-xs tracking-wide text-ink/45 uppercase">{s.kind}</p>
            </div>
            <p className="mt-2 text-sm text-ink/70">{s.use}</p>
            <Link to={s.portal} className="mt-3 inline-flex min-h-11 items-center text-sm text-gold-deep hover:underline">
              Open
            </Link>
          </article>
        ))}
      </div>
    </Page>
  )
}
