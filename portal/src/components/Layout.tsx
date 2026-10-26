import { useEffect, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { modules } from "../data/modules"

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/course", label: "Course map" },
  { to: "/listen", label: "Listen" },
  { to: "/library", label: "Source files" },
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

const titles: Record<string, string> = {
  "/": "Home",
  "/course": "Course map",
  "/listen": "Listen",
  "/library": "Source files",
  "/glossary": "Glossary",
  "/practice": "Mock test",
  "/tools/calculator": "Calculator",
  "/tools/tvm": "TVM",
  "/tools/npv": "NPV / IRR",
  "/tools/amort": "Amortization",
  "/tools/market": "Vacancy",
  "/tools/effective-rent": "Effective rent",
  "/tools/irv": "IRV",
  "/tools/case": "Case lab",
  "/tools/noi": "NOI forecast",
  "/tools/apod": "APOD",
  "/tools/cfaw": "CFAW",
  "/tools/acsw": "ACSW",
  "/tools/dcf": "DCF",
  "/tools/goals": "Goals",
  "/tools/skills": "Skills",
  "/tools/probability": "Probability",
}

function titleFor(pathname: string): string {
  const course = pathname.match(/^\/course\/([^/]+)$/)
  if (course) {
    const m = modules.find((x) => x.id === course[1])
    return m ? `Module ${m.number}: ${m.title}` : "Course"
  }
  const listen = pathname.match(/^\/listen\/([^/]+)$/)
  if (listen) {
    const m = modules.find((x) => x.id === listen[1])
    return m ? `Listen: ${m.title}` : "Listen"
  }
  return titles[pathname] ?? "Foundations"
}

function linkClass({ isActive }: { isActive: boolean }) {
  return `block min-h-11 rounded-md px-3 py-2.5 text-base md:min-h-0 md:py-1.5 md:text-sm ${
    isActive ? "bg-gold/20 text-gold" : "text-cream/80 hover:bg-white/5 hover:text-white"
  }`
}

export function Layout() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.title = `${titleFor(location.pathname)} · Foundations`
  }, [location.pathname])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const close = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener("change", close)
    return () => mq.removeEventListener("change", close)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className="notranslate min-h-svh bg-cream text-ink" lang="en-US" translate="no">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-ink px-3 py-2 text-cream md:hidden">
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-cream hover:bg-white/10"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <path d="M3 6h16M3 11h16M3 16h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Foundations portal</p>
          <p className="font-serif truncate text-sm text-white">Commercial Real Estate</p>
        </div>
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/60 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="md:flex md:min-h-svh">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col overflow-y-auto bg-ink text-cream transition-transform duration-200 md:sticky md:top-0 md:h-svh md:w-64 md:shrink-0 md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-6">
            <div>
              <p className="text-[11px] tracking-[0.22em] text-gold uppercase">Foundations portal</p>
              <h1 className="font-serif mt-1 text-xl leading-tight text-white">Commercial Real Estate</h1>
            </div>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-cream/80 hover:bg-white/10 md:hidden"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
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
            Independent study workspace. Not affiliated with or endorsed by the CCIM Institute.
          </p>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
