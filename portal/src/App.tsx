import { Navigate, Route, Routes } from "react-router-dom"
import { Layout } from "./components/Layout"
import { Acsw } from "./pages/Acsw"
import { Amort } from "./pages/Amort"
import { Apod } from "./pages/Apod"
import { Cfaw } from "./pages/Cfaw"
import { Course, CourseModule } from "./pages/Course"
import { Dcf } from "./pages/Dcf"
import { Glossary } from "./pages/Glossary"
import { Goals } from "./pages/Goals"
import { Home } from "./pages/Home"
import { ListenIndex, ListenPlayer } from "./pages/Listen"
import { Library } from "./pages/Library"
import { NpvIrr } from "./pages/NpvIrr"
import { Probability } from "./pages/Probability"
import { Skills } from "./pages/Skills"
import { CaseLab } from "./pages/CaseLab"
import { EffectiveRent } from "./pages/EffectiveRent"
import { Irv } from "./pages/Irv"
import { Market } from "./pages/Market"
import { Calculator } from "./pages/Calculator"
import { Quiz } from "./pages/Quiz"
import { NoiForecast } from "./pages/NoiForecast"
import { Tvm } from "./pages/Tvm"

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
        <Route path="tools/calculator" element={<Calculator />} />
        <Route path="tools/tvm" element={<Tvm />} />
        <Route path="tools/npv" element={<NpvIrr />} />
        <Route path="tools/amort" element={<Amort />} />
        <Route path="tools/market" element={<Market />} />
        <Route path="tools/effective-rent" element={<EffectiveRent />} />
        <Route path="tools/irv" element={<Irv />} />
        <Route path="tools/case" element={<CaseLab />} />
        <Route path="tools/noi" element={<NoiForecast />} />
        <Route path="tools/apod" element={<Apod />} />
        <Route path="tools/cfaw" element={<Cfaw />} />
        <Route path="tools/acsw" element={<Acsw />} />
        <Route path="tools/dcf" element={<Dcf />} />
        <Route path="tools/goals" element={<Goals />} />
        <Route path="tools/skills" element={<Skills />} />
        <Route path="tools/probability" element={<Probability />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
