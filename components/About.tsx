"use client"
import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { MapPin, GraduationCap, Globe, Target, Lightbulb, TrendingUp, Zap, Code2, BarChart3, Database, Award, BookOpen, Clock } from "lucide-react"

const orbitItems = [
  { label: "Power BI", icon: BarChart3, color: "#22d3ee", angle: 0 },
  { label: "Published Author", icon: BookOpen, color: "#10b981", angle: 45 },
  { label: "Python", icon: Code2, color: "#8b5cf6", angle: 90 },
  { label: "97% ML Accuracy", icon: TrendingUp, color: "#f59e0b", angle: 135 },
  { label: "SQL / MySQL", icon: Database, color: "#f43f5e", angle: 180 },
  { label: "Detail-Oriented", icon: Zap, color: "#06b6d4", angle: 225 },
  { label: "Advanced Excel", icon: Target, color: "#10b981", angle: 270 },
  { label: "Problem Solver", icon: Lightbulb, color: "#a78bfa", angle: 315 },
]

function OrbitDiagram({ isInView, size = 380 }: { isInView: boolean; size?: number }) {
  const radius = (size - 84) / 2
  const center = size / 2
  return (
    <div className="relative mx-auto select-none" style={{ width: size, height: size }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute rounded-full border border-cyan-500/10"
          style={{ inset: `${Math.round(i * (size / 14))}px` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 28 + i * 14, repeat: Infinity, ease: "linear" }} />
      ))}
      {/* Center */}
      <div className="absolute glass rounded-full border border-[#30363d] flex flex-col items-center justify-center text-center z-10"
        style={{ inset: `${Math.round(center - 96)}px` }}>
        <p className="text-4xl font-black text-cyan-400">7+</p>
        <p className="text-[10px] text-slate-500 leading-tight">Analytics<br />Projects</p>
        <div className="w-px h-3 bg-cyan-500/30 my-1" />
        <p className="text-2xl font-black text-emerald-400">4+</p>
        <p className="text-[10px] text-slate-500 leading-tight">Years<br />Experience</p>
      </div>
      {orbitItems.map((item, i) => {
        const rad = (item.angle * Math.PI) / 180
        const x = center + radius * Math.cos(rad) - 46
        const y = center + radius * Math.sin(rad) - 18
        return (
          <motion.div key={item.label}
            initial={{ opacity: 0, scale: 0.5 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="absolute glass rounded-xl px-2.5 py-1.5 border border-[#30363d] hover:border-cyan-500/40 transition-colors cursor-default"
            style={{ left: x, top: y, zIndex: 20 }}
            whileHover={{ scale: 1.12, zIndex: 30 }}>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}22` }}>
                <item.icon className="w-3 h-3" style={{ color: item.color }} />
              </div>
              <span className="text-[10px] font-semibold text-white whitespace-nowrap">{item.label}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" ref={ref} className="py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">

          {/* Text */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-5 text-left">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-cyan-500" />
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">About Me</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Passionate About{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#22d3ee,#10b981)' }}>
                Data-Driven
              </span>{' '}Solutions
            </h2>

            <div className="space-y-3 text-slate-400 leading-relaxed text-sm">
              <p>
                I'm a <span className="text-white font-semibold">Statistics graduate from KUST</span> (CGPA 3.02) with over
                <span className="text-cyan-400 font-bold"> 4 years of hands-on experience</span> in data analytics, business intelligence, and machine learning — starting from my FSc years when I first began working with data tools independently.
              </p>
              <p>
                My expertise spans the <span className="text-emerald-400 font-semibold">full analytics lifecycle</span>: from designing messy real-world datasets and building automated <span className="text-white font-medium">ETL pipelines in Power Query</span>, to creating executive Power BI dashboards, writing complex SQL queries, and publishing <span className="text-violet-400 font-semibold">peer-reviewed ML research</span> achieving 97% accuracy on 85K+ healthcare records.
              </p>
              <p>
                I've delivered <span className="text-white font-medium">7+ end-to-end projects</span> covering retail BI, oral cancer detection, sales analytics, and consumer behavior — processing over <span className="text-cyan-400 font-semibold">185,000 records</span> total. When I take on a task, I see it through — completely.
              </p>
            </div>

            {/* Info rows */}
            <div className="space-y-2.5 pt-1">
              {[
                { icon: MapPin, v: 'Kohat, KPK, Pakistan', l: 'Location', href: 'https://maps.google.com/?q=Kohat,KPK,Pakistan', clickable: true },
                { icon: GraduationCap, v: 'BS Statistics – KUST', l: 'CGPA 3.02', href: 'https://kust.edu.pk', clickable: true },
                { icon: Clock, v: '4+ Years', l: 'Hands-on experience (2021–Present)', clickable: false },
                { icon: Globe, v: 'GCC · Remote Worldwide', l: 'Open to work', clickable: false },
              ].map(f => (
                <div key={f.l} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  {f.clickable ? (
                    <a href={(f as { href: string }).href} target="_blank" rel="noopener noreferrer"
                      className="font-semibold text-cyan-400 hover:text-cyan-300 text-sm underline underline-offset-2 transition-colors">
                      {f.v}
                    </a>
                  ) : (
                    <span className="font-semibold text-white text-sm">{f.v}</span>
                  )}
                  <span className="text-slate-500 text-xs">· {f.l}</span>
                </div>
              ))}
            </div>

            {/* Mini KPIs */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[['97%', 'Best ML Accuracy'], ['185K+', 'Records Processed'], ['4+', 'Years Experience']].map(([v, l]) => (
                <div key={l} className="glass rounded-xl p-4 border border-[#30363d] hover:border-cyan-500/30 transition-colors text-center">
                  <p className="text-2xl font-black text-cyan-400">{v}</p>
                  <p className="text-xs text-slate-500 mt-1">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image + visuals */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}
            className="relative w-full flex items-center justify-end">
            <div className="relative w-full max-w-3xl">
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-[#30363d] shadow-2xl bg-[#0d1117]">
                <Image src="/For_About.png" alt="Junaid Khan about image" fill className="object-cover object-center" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-8 left-8 hidden lg:block">
                <OrbitDiagram isInView={isInView} size={240} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
