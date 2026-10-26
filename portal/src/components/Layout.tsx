import { useEffect, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"

const FOOTER = "Personal study notes. Not affiliated with or endorsed by the CCIM Institute."

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/course", label: "Course map" },
  { to: "/listen", label: "Listen" },
  { to: "/library", label: "Study index" },
  { to: "/glossary", label: "Glossary" },
  { to: "/practice", label: "Mock test" },
]

const tools = [
  { to: "/tools/calculator", label: "Calculator" },
  { to: "/tools/tvm", label: "TVM" },
  { to: "/tools/npv", label: "NPV / IRR" },
  { to: "/tools/amort", label: "Amortization" },
  { to: "/tools/market", label: "Vacancy" },
  { to: "/tools/effective-rent", label: "Effective rent" },
  { to: "/tools/irv", label: "IRV" },
  { to: "/tools/case", label: "Case lab" },
  { to: "/tools/noi", label: "NOI forecast" },
  { to: "/tools/apod", label: "APOD" },
  { to: "/tools/cfaw", label: "CFAW" },
  { to: "/tools/acsw", label: "ACSW" },
  { to: "/tools/dcf", label: "DCF" },
  { to: "/tools/goals", label: "Goals" },
  { to: "/tools/skills", label: "Skills" },
  { to: "/tools/probability", label: "Probability" },
]

function linkClass({ isActive }: { isActive: boolean }) {
  return `block rounded-md px-3 py-2 text-sm md:py-1.5 ${
    isActive ? "bg-gold/20 text-gold" : "text-cream/80 hover:bg-white/5 hover:text-white"
  }`
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const [path, setPath] = useState(pathname)
  if (path !== pathname) {
    setPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className="notranslate min-h-svh bg-cream text-ink" lang="en-US" translate="no">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-ink px-4 py-3 text-cream md:hidden">
        <button
          type="button"
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <p className="min-w-0 font-serif text-base leading-tight text-white">CRE study notes</p>
      </header>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className="md:flex md:min-h-svh">
        <aside
          id="site-nav"
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col overflow-y-auto bg-ink text-cream transition-transform duration-200 md:sticky md:top-0 md:z-0 md:h-svh md:w-64 md:shrink-0 md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-5">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.22em] text-gold uppercase">Study notes</p>
              <h1 className="font-serif mt-1 text-xl leading-tight text-white">Commercial real estate</h1>
            </div>
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-xs md:hidden"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <nav className="flex-1 space-y-6 px-3 py-5" aria-label="Study">
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
          <p className="border-t border-white/10 px-5 py-4 text-[11px] leading-relaxed text-cream/60">{FOOTER}</p>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
          <footer className="border-t border-line px-4 py-4 text-xs leading-relaxed text-ink/55 sm:px-6 md:px-8">
            {FOOTER}
          </footer>
        </div>
      </div>
    </div>
  )
}
