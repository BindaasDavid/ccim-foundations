import { Link } from "react-router-dom"
import { sources } from "../data/library"
import { Page } from "../components/ui"

export function Library() {
  return (
    <Page kicker="Support Materials" title="What each file became">
      <div className="overflow-hidden rounded-xl border border-line bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink text-cream">
            <tr>
              <th className="px-4 py-3 font-medium">File</th>
              <th className="px-4 py-3 font-medium">Kind</th>
              <th className="px-4 py-3 font-medium">In the portal</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.file} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{s.file}</td>
                <td className="px-4 py-3 text-ink/60">{s.kind}</td>
                <td className="px-4 py-3">
                  <Link to={s.portal} className="text-gold-deep hover:underline">
                    Open tool
                  </Link>
                  <p className="mt-1 text-ink/60">{s.use}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}
