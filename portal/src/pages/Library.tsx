import { Link } from "react-router-dom"
import { studyAreas } from "../data/library"
import { Page } from "../components/ui"

export function Library() {
  return (
    <Page kicker="Index" title="Where each topic lives">
      <div className="overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="bg-ink text-cream">
            <tr>
              <th className="px-4 py-3 font-medium">Topic</th>
              <th className="px-4 py-3 font-medium">Kind</th>
              <th className="px-4 py-3 font-medium">In the portal</th>
            </tr>
          </thead>
          <tbody>
            {studyAreas.map((area) => (
              <tr key={area.title} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{area.title}</td>
                <td className="px-4 py-3 text-ink/60">{area.kind}</td>
                <td className="px-4 py-3">
                  <Link to={area.portal} className="text-gold-deep hover:underline">
                    Open
                  </Link>
                  <p className="mt-1 text-ink/60">{area.use}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}
