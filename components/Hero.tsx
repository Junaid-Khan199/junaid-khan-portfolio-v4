"use client"
import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Github, Linkedin, Mail, Download, ChevronDown, BarChart3, Database, Brain, Award, MapPin, FileText } from "lucide-react"
import Image from "next/image"

const roles = ["Data Analyst", "Power BI Developer", "ML Researcher", "Statistics Graduate"]

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [typing, setTyping] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 900], [1, 0.3])

  useEffect(() => {
    const current = roles[roleIdx]
    let t: NodeJS.Timeout
    if (typing) {
      if (displayed.length < current.length)
        t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 65)
      else t = setTimeout(() => setTyping(false), 2200)
    } else {
      if (displayed.length > 0)
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38)
      else { setRoleIdx(i => (i + 1) % roles.length); setTyping(true) }
    }
    return () => clearTimeout(t)
  }, [displayed, typing, roleIdx])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-[#0d1117]">

      <Image src="/For_Background.png" alt="Hero background" fill priority className="absolute inset-0 object-cover object-center" />
      <div className="absolute inset-0 bg-slate-950/65" />

      {/* ── Animated BG ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid-pattern absolute inset-0 opacity-25" />
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-cyan-500/6 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-emerald-500/5 blur-[140px]" />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-violet-500/4 blur-[100px]" />
        {[...Array(25)].map((_, i) => (
          <motion.div key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-cyan-400/30"
            style={{ left: `${3 + i * 3.8}%`, top: `${8 + (i % 8) * 10}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
        {/* Scanning lines */}
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent w-[400px]"
            style={{ top: `${20 + i * 30}%` }}
            animate={{ x: ["-50vw", "120vw"] }}
            transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear", delay: i * 4 }}
          />
        ))}
      </div>

      <motion.div style={{ opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 py-20 pt-24">
        <div className="grid lg:grid-cols-1 gap-8 lg:gap-12 items-start justify-items-end min-h-[85vh]">

          {/* ── MAIN CONTENT ── */}
          <div className="order-2 lg:order-1 flex flex-col justify-center space-y-7 max-w-4xl lg:pr-8 xl:pr-12 items-start text-left">

            {/* Status pill */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 w-fit px-4 py-2 rounded-full glass border border-cyan-500/25">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span className="text-sm text-slate-300">Open to GCC &amp; Remote opportunities Worldwide</span>
            </motion.div>

            {/* Name */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
              <p className="text-slate-400 text-lg font-medium mb-1 tracking-wide">Hello, I'm</p>
              <h1 className="text-7xl sm:text-8xl lg:text-[96px] font-black leading-[0.88] tracking-tight">
                <span className="text-white">Junaid</span>
                <br />
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#22d3ee 0%,#10b981 50%,#8b5cf6 100%)" }}>
                    Khan
                  </span>
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.7 }}
                    className="absolute -bottom-3 left-0 h-1.5 w-full origin-left rounded-full"
                    style={{ background: "linear-gradient(90deg,#22d3ee,#10b981,#8b5cf6)" }} />
                </span>
              </h1>
            </motion.div>

            {/* Typewriter */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="flex items-center gap-2 h-10">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 tracking-wide">{displayed}</span>
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-7 bg-cyan-400 rounded-full" />
            </motion.div>

            {/* Bio */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Statistics graduate from <span className="text-white font-semibold">KUST</span> with <span className="text-cyan-400 font-bold">4+ years</span> of hands-on experience
              transforming <span className="text-cyan-400 font-semibold">raw data</span> into{" "}
              <span className="text-emerald-400 font-semibold">actionable business insights</span>. Published ML researcher · Power BI expert · 185K+ records processed.
            </motion.p>

            {/* Stat pills row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}
              className="flex flex-wrap gap-3">
              {[
                { icon: BarChart3, label: "7+ Projects", color: "#22d3ee" },
                { icon: Brain, label: "97% ML Accuracy", color: "#10b981" },
                { icon: Database, label: "185K+ Records", color: "#8b5cf6" },
                { icon: Award, label: "Published Author", color: "#f59e0b" },
                { icon: FileText, label: "4+ Years Exp.", color: "#f43f5e" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass border border-[#30363d]">
                  <s.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: s.color }} />
                  <span className="text-xs font-semibold text-slate-300">{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3">
              <motion.a href="#projects" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-[#0d1117] text-base shadow-lg shadow-cyan-500/20"
                style={{ background: "linear-gradient(135deg,#22d3ee,#10b981)" }}>
                <BarChart3 className="w-5 h-5" /> View My Work
              </motion.a>
              <motion.a href="/junaid_khan_CV.pdf" download whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base glass border border-slate-600 hover:border-cyan-500/60 transition-all">
                <Download className="w-5 h-5" /> Download CV
              </motion.a>
            </motion.div>

            {/* Social + ORCID */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="flex items-center gap-3">
              {[
                { icon: Github, href: "https://github.com/Junaid-Khan199" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/junaid-khan-199j" },
                { icon: Mail, href: "mailto:junaidkhaan455@gmail.com" },
              ].map(s => (
                <motion.a key={s.href} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer" whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-2xl glass border border-slate-700 hover:border-cyan-500/60 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all shadow-sm">
                  <s.icon className="w-5 h-5" />
                </motion.a>
              ))}
              <span className="text-slate-600 text-xs ml-2 hidden sm:block">ORCID: 0009-0005-4796-6958</span>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.a href="#about" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.a>
      </motion.div>
    </section>
  )
}

