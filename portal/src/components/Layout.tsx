import { NavLink, Outlet } from "react-router-dom"

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/course", label: "Course map" },
  { to: "/listen", label: "Listen" },
  { to: "/library", label: "Source files" },
  { to: "/glossary", label: "Glossary" },
]

const tools = [
  { to: "/tools/tvm", label: "TVM" },
  { to: "/tools/npv", label: "NPV / IRR" },
  { to: "/tools/amort", label: "Amortization" },
  { to: "/tools/market", label: "Vacancy" },
  { to: "/tools/effective-rent", label: "Effective rent" },
  { to: "/tools/irv", label: "IRV" },
  { to: "/tools/case", label: "Case lab" },
  { to: "/tools/apod", label: "APOD" },
  { to: "/tools/cfaw", label: "CFAW" },
  { to: "/tools/acsw", label: "ACSW" },
  { to: "/tools/dcf", label: "DCF" },
  { to: "/tools/goals", label: "Goals" },
  { to: "/tools/skills", label: "Skills" },
  { to: "/tools/probability", label: "Probability" },
]

function linkClass({ isActive }: { isActive: boolean }) {
  return `block rounded-md px-3 py-1.5 text-sm ${
    isActive ? "bg-gold/20 text-gold" : "text-cream/80 hover:bg-white/5 hover:text-white"
  }`
}

export function Layout() {
  return (
    <div className="notranslate min-h-svh bg-cream text-ink" lang="en-US" translate="no">
      <div className="flex min-h-svh">
        <aside className="sticky top-0 flex h-svh w-64 shrink-0 flex-col overflow-y-auto bg-ink text-cream">
          <div className="border-b border-white/10 px-5 py-6">
            <p className="text-[11px] tracking-[0.22em] text-gold uppercase">Foundations portal</p>
            <h1 className="font-serif mt-1 text-xl leading-tight text-white">Commercial Real Estate</h1>
          </div>
          <nav className="flex-1 space-y-6 px-3 py-5">
            <div className="space-y-1">
              {nav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div>
              <p className="px-3 pb-2 text-[11px] tracking-[0.18em] text-gold/80 uppercase">Workshops</p>
              <div className="space-y-0.5">
                {tools.map((item) => (
                  <NavLink key={item.to} to={item.to} className={linkClass}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
          <p className="border-t border-white/10 px-5 py-4 text-[11px] leading-relaxed text-cream/50">
            Independent study workspace. Official CCIM course files remain copyright of The CCIM Institute.
          </p>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
