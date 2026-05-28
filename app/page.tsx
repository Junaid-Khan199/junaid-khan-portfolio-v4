import Hero from "@/components/Hero"
import { About } from "@/components/About"
import Skills from "@/components/Skills"
import { KPISection, Resume, Contact, Nav, Footer } from "@/components/Misc"
import Projects from "@/components/Projects"
import Dashboard from "@/components/Dashboard"
import SQLShowcase from "@/components/SQLShowcase"
import PythonEditor from "@/components/PythonEditor"

// Thin divider between sections
function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center px-6">
      <div className="h-px w-full max-w-7xl bg-gradient-to-r from-transparent via-[#30363d] to-transparent" />
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        <Hero />
        <KPISection />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Dashboard />
        <SectionDivider />
        <SQLShowcase />
        <SectionDivider />
        <PythonEditor />
        <SectionDivider />
        <Resume />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
