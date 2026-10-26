import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Layout } from "./components/Layout"
import { Apod } from "./pages/Apod"
import { Course, CourseModule } from "./pages/Course"
import { Glossary } from "./pages/Glossary"
import { Goals } from "./pages/Goals"
import { Home } from "./pages/Home"
import { ListenIndex, ListenPlayer } from "./pages/Listen"
import { Library } from "./pages/Library"
import { Probability } from "./pages/Probability"
import { Skills } from "./pages/Skills"
import { EffectiveRent } from "./pages/EffectiveRent"
import { Irv } from "./pages/Irv"
import { Market } from "./pages/Market"
import { Quiz } from "./pages/Quiz"

const Calculator = lazy(() => import("./pages/Calculator").then((m) => ({ default: m.Calculator })))
const Tvm = lazy(() => import("./pages/Tvm").then((m) => ({ default: m.Tvm })))
const NpvIrr = lazy(() => import("./pages/NpvIrr").then((m) => ({ default: m.NpvIrr })))
const Amort = lazy(() => import("./pages/Amort").then((m) => ({ default: m.Amort })))
const CaseLab = lazy(() => import("./pages/CaseLab").then((m) => ({ default: m.CaseLab })))
const NoiForecast = lazy(() => import("./pages/NoiForecast").then((m) => ({ default: m.NoiForecast })))
const Cfaw = lazy(() => import("./pages/Cfaw").then((m) => ({ default: m.Cfaw })))
const Acsw = lazy(() => import("./pages/Acsw").then((m) => ({ default: m.Acsw })))
const Dcf = lazy(() => import("./pages/Dcf").then((m) => ({ default: m.Dcf })))

function RouteFallback() {
  return <p className="px-4 py-8 text-sm text-ink/60 md:px-8">Loading…</p>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="course" element={<Course />} />
        <Route path="course/:id" element={<CourseModule />} />
        <Route path="listen" element={<ListenIndex />} />
        <Route path="listen/:id" element={<ListenPlayer />} />
        <Route path="library" element={<Library />} />
        <Route path="glossary" element={<Glossary />} />
        <Route path="practice" element={<Quiz />} />
        <Route path="tools/calculator" element={<Suspense fallback={<RouteFallback />}><Calculator /></Suspense>} />
        <Route path="tools/tvm" element={<Suspense fallback={<RouteFallback />}><Tvm /></Suspense>} />
        <Route path="tools/npv" element={<Suspense fallback={<RouteFallback />}><NpvIrr /></Suspense>} />
        <Route path="tools/amort" element={<Suspense fallback={<RouteFallback />}><Amort /></Suspense>} />
        <Route path="tools/market" element={<Market />} />
        <Route path="tools/effective-rent" element={<EffectiveRent />} />
        <Route path="tools/irv" element={<Irv />} />
        <Route path="tools/case" element={<Suspense fallback={<RouteFallback />}><CaseLab /></Suspense>} />
        <Route path="tools/noi" element={<Suspense fallback={<RouteFallback />}><NoiForecast /></Suspense>} />
        <Route path="tools/apod" element={<Apod />} />
        <Route path="tools/cfaw" element={<Suspense fallback={<RouteFallback />}><Cfaw /></Suspense>} />
        <Route path="tools/acsw" element={<Suspense fallback={<RouteFallback />}><Acsw /></Suspense>} />
        <Route path="tools/dcf" element={<Suspense fallback={<RouteFallback />}><Dcf /></Suspense>} />
        <Route path="tools/goals" element={<Goals />} />
        <Route path="tools/skills" element={<Skills />} />
        <Route path="tools/probability" element={<Probability />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
