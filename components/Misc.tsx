"use client"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Github, Linkedin, Mail, Download, Award, GraduationCap, Briefcase, ExternalLink, Send, CheckCircle, BarChart3, ArrowUp, Menu, X, Database, Code2, RefreshCw } from "lucide-react"

// ── GitHub KPI AUTO-FETCH ──────────────────────────────────────────
const GITHUB_USER = "Junaid-Khan199"

// Baseline KPIs (existing known values before GitHub auto-update)
const BASE_KPI = {
  projects: 7,
  totalRecords: 185000,  // 85K oral cancer + 100K saudi retail
  mlAccuracy: 97,
  papers: 1,
  tools: 12,
  certifications: 3,
}

// Per-project known record counts (to sum with new projects)
const KNOWN_PROJECT_RECORDS: Record<string, number> = {
  "saudi-retail-analytics-project": 100000,
  "oral-cancer-ml": 85000,
  "superstore-sales": 10000,
  "fish-market-analysis": 400,
}

async function fetchGitHubKPIs(): Promise<typeof BASE_KPI> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
      headers: { Accept: "application/vnd.github.v3+json" }
    })
    if (!res.ok) return BASE_KPI

    const repos: { name: string; topics?: string[] }[] = await res.json()
    // Count repos that look like portfolio projects (exclude .github, etc.)
    const projectRepos = repos.filter(r =>
      !r.name.startsWith(".") &&
      r.name !== GITHUB_USER &&
      r.name !== `${GITHUB_USER}.github.io`
    )

    // Sum known records + any new repos not in our map
    let totalRecords = 0
    projectRepos.forEach(r => {
      const key = r.name.toLowerCase()
      const known = Object.entries(KNOWN_PROJECT_RECORDS).find(([k]) => key.includes(k.toLowerCase()))
      if (known) {
        totalRecords += known[1]
      }
    })
    totalRecords = Math.max(totalRecords, BASE_KPI.totalRecords)

    return {
      ...BASE_KPI,
      projects: Math.max(projectRepos.length, BASE_KPI.projects),
      totalRecords,
    }
  } catch {
    return BASE_KPI
  }
}

function formatRecords(n: number): { value: number; suffix: string } {
  if (n >= 1000000) return { value: Math.round(n / 100000) / 10, suffix: "M+" }
  if (n >= 1000) return { value: Math.round(n / 1000), suffix: "K+" }
  return { value: n, suffix: "+" }
}

// ── KPI COUNTERS ──────────────────────────────────────────────────
function Counter({ target, suffix, color, inView }: { target: number; suffix: string; color: string; inView: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let n = 0
    const step = Math.max(target / 60, 1)
    const t = setInterval(() => {
      n = Math.min(n + step, target)
      setCount(Math.floor(n))
      if (n >= target) clearInterval(t)
    }, 20)
    return () => clearInterval(t)
  }, [inView, target])
  return <span style={{ color }}>{count}{suffix}</span>
}

export function KPISection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [kpiData, setKpiData] = useState(BASE_KPI)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const loadKPIs = async () => {
    setLoading(true)
    const data = await fetchGitHubKPIs()
    setKpiData(data)
    setLastUpdated(new Date().toLocaleDateString())
    setLoading(false)
  }

  useEffect(() => { loadKPIs() }, [])

  const recs = formatRecords(kpiData.totalRecords)

  const kpis = [
    { icon: BarChart3, label: "Projects", target: kpiData.projects, suffix: "+", color: "#22d3ee", bg: "#22d3ee18" },
    { icon: Database, label: "Records Processed", target: recs.value, suffix: recs.suffix, color: "#10b981", bg: "#10b98118" },
    { icon: Code2, label: "Best ML Accuracy", target: kpiData.mlAccuracy, suffix: "%", color: "#8b5cf6", bg: "#8b5cf618" },
    { icon: Award, label: "Published Papers", target: kpiData.papers, suffix: "", color: "#f59e0b", bg: "#f59e0b18" },
    { icon: GraduationCap, label: "Tools Mastered", target: kpiData.tools, suffix: "+", color: "#f43f5e", bg: "#f43f5e18" },
    { icon: Award, label: "Certifications", target: kpiData.certifications, suffix: "", color: "#06b6d4", bg: "#06b6d418" },
  ]

  return (
    <div ref={ref} className="py-10 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/3 via-transparent to-emerald-500/3" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top KPIs heading */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-cyan-500" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Top KPIs</span>
            <div className="h-px w-8 bg-cyan-500" />
          </div>
          <button
            onClick={loadKPIs}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
            title="Refresh from GitHub"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            {lastUpdated ? `Updated ${lastUpdated}` : "Live from GitHub"}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map((k, i) => (
            <motion.div key={k.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, type: "spring" }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="glass rounded-2xl p-4 border border-[#30363d] hover:border-cyan-500/25 transition-all text-center cursor-default"
            >
              <motion.div whileHover={{ rotate: 8, scale: 1.15 }}
                className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: k.bg }}>
                <k.icon className="w-5 h-5" style={{ color: k.color }} />
              </motion.div>
              <p className="text-2xl font-black mb-0.5">
                <Counter target={k.target} suffix={k.suffix} color={k.color} inView={isInView} />
              </p>
              <p className="text-xs text-slate-500">{k.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── RESUME ─────────────────────────────────────────────────────────
export function Resume() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [cvUrl, setCvUrl] = useState("/junaid_khan_CV.pdf")

  // Try to get CV from GitHub
  useEffect(() => {
    const ghCvUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_USER}/main/junaid_khan_CV.pdf`
    fetch(ghCvUrl, { method: "HEAD" })
      .then(r => { if (r.ok) setCvUrl(ghCvUrl) })
      .catch(() => { })
  }, [])

  return (
    <section id="resume" ref={ref} className="py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-cyan-500" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Career</span>
            <div className="h-px w-12 bg-cyan-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Resume & <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#22d3ee,#10b981)" }}>Experience</span>
          </h2>
          <motion.a href={cvUrl} download="Junaid_Khan_CV.pdf"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[#0d1117] mt-4"
            style={{ background: "linear-gradient(135deg,#22d3ee,#10b981)" }}>
            <Download className="w-4 h-4" /> Download Full CV
          </motion.a>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Experience + Publication */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center"><Briefcase className="w-4 h-4 text-cyan-400" /></div>
              <h3 className="font-bold text-white">Experience</h3>
            </div>
            <div className="glass rounded-2xl p-5 border border-[#30363d] hover:border-cyan-500/25 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">Freelance Data Analyst</h4>
                  <p className="text-xs text-cyan-400 mt-0.5">Independent Clients · Remote</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-xs text-cyan-400">2021 – Present</span>
              </div>
              <ul className="space-y-2">
                {["Delivered 7+ end-to-end analytics projects across retail, healthcare & consumer research over 4+ years — 100% on-time delivery.", "Managed full lifecycle: requirements → ETL → statistical modeling → executive reporting.", "Fish Market Consumer Behavior Analysis — client-assigned ANOVA & Chi-Square project.", "Managed 5+ concurrent client relationships; delivered data-driven pricing and inventory recommendations."].map(r => (
                  <li key={r} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Publication */}
            <div className="glass rounded-2xl p-5 border border-violet-500/25 bg-violet-500/3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0 text-lg">📄</div>
                <div>
                  <p className="text-xs text-violet-400 font-bold uppercase tracking-wider mb-1">Published Research</p>
                  <h4 className="font-bold text-white text-sm mb-1">Leveraging ML for Oral Cancer Early Detection</h4>
                  <p className="text-xs text-slate-400">Journal of Multidisciplinary Applications in Statistical Science, Vol. 1 No. 1 (2025)</p>
                  <a href="https://journals.rtsolz.com/index.php/JMASS/article/view/5" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-violet-400 hover:underline mt-2">
                    View Publication <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education + Certs */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }} className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center"><GraduationCap className="w-4 h-4 text-emerald-400" /></div>
              <h3 className="font-bold text-white">Education</h3>
            </div>
            {[{
              degree: "BS — Statistics", uni: "KUST", period: "2021–2025", gpa: "CGPA 3.02",
              note: "Published peer-reviewed research as final year project.", color: "#22d3ee"
            }, {
              degree: "FSc — Computer Science", uni: "GDC Gumbat, Kohat", period: "2018–2020", gpa: "768 Marks",
              note: "", color: "#10b981"
            }].map(e => (
              <div key={e.degree} className="glass rounded-xl p-4 border border-[#30363d] hover:border-cyan-500/25 transition-colors">
                <h4 className="font-bold text-white text-sm">{e.degree}</h4>
                <p className="text-xs mt-0.5" style={{ color: e.color }}>{e.uni}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500">{e.period}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: `${e.color}18`, color: e.color }}>{e.gpa}</span>
                </div>
                {e.note && <p className="text-xs text-emerald-400 mt-2 font-medium">✓ {e.note}</p>}
              </div>
            ))}

            <div className="flex items-center gap-3 mt-6 mb-2">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center"><Award className="w-4 h-4 text-amber-400" /></div>
              <h3 className="font-bold text-white">Certifications</h3>
            </div>
            {[
              { n: "Data Analytics & Business Intelligence", i: "DigiSkills Pakistan", y: "2025–2026", sk: "Excel, SQL, Power BI", img: null },
              { n: "Diploma in Information Technology", i: "Institute of Computer Expert", y: "2024", sk: "IT fundamentals", img: null },
              { n: "Basic Python Programming", i: "Kaggle", y: "Dec 2025", sk: "Python fundamentals", img: null },
            ].map(c => (
              <div key={c.n} className="glass rounded-xl p-3.5 border border-[#30363d] hover:border-amber-500/25 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {c.img ? (
                      <a href={c.img} target="_blank" rel="noopener noreferrer"
                        className="font-bold text-amber-400 hover:underline text-xs">{c.n}</a>
                    ) : (
                      <p className="font-bold text-white text-xs">{c.n}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-0.5">{c.i}</p>
                    <p className="text-xs text-amber-400/70 mt-0.5">{c.sk}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-xs text-amber-400 whitespace-nowrap flex-shrink-0">{c.y}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── CONTACT ────────────────────────────────────────────────────────
export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section id="contact" ref={ref} className="py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-cyan-500" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Get in Touch</span>
            <div className="h-px w-12 bg-cyan-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            {"Let's"} <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#22d3ee,#10b981)" }}>Connect</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">Open to Data Analyst roles in Saudi Arabia, UAE, Qatar, and remote worldwide.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}>
            <div className="glass rounded-2xl p-6 lg:p-8 border border-[#30363d]">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400 text-sm">{"I'll"} get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[{ id: "name", label: "Name", type: "text", ph: "Your name" }, { id: "email", label: "Email", type: "email", ph: "your@email.com" }].map(f => (
                      <div key={f.id} className="space-y-1.5">
                        <label htmlFor={f.id} className="text-sm font-semibold text-slate-300">{f.label}</label>
                        <input id={f.id} type={f.type} placeholder={f.ph} required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#21262d] border border-[#30363d] focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 text-white placeholder:text-slate-600 text-sm transition-all" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-sm font-semibold text-slate-300">Subject</label>
                    <input id="subject" type="text" placeholder="Job opportunity / collaboration" required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#21262d] border border-[#30363d] focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 text-white placeholder:text-slate-600 text-sm transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-sm font-semibold text-slate-300">Message</label>
                    <textarea id="message" rows={5} placeholder="Tell me about the role or project..." required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#21262d] border border-[#30363d] focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 text-white placeholder:text-slate-600 text-sm resize-none transition-all" />
                  </div>
                  <motion.button type="submit" disabled={submitting}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[#0d1117] transition-all disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#22d3ee,#10b981)" }}>
                    {submitting ? <span className="w-4 h-4 border-2 border-[#0d1117]/30 border-t-[#0d1117] rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? "Sending..." : "Send Message"}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }} className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "junaidkhaan455@gmail.com", href: "mailto:junaidkhaan455@gmail.com" },
              { icon: Github, label: "GitHub", value: "github.com/Junaid-Khan199", href: "https://github.com/Junaid-Khan199" },
              { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/junaid-khan-199j", href: "https://www.linkedin.com/in/junaid-khan-199j" },
            ].map(item => (
              <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                className="flex items-center gap-4 glass rounded-xl p-4 border border-[#30363d] hover:border-cyan-500/30 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  <item.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{item.value}</p>
                </div>
              </a>
            ))}
            <div className="glass rounded-xl p-5 border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent mt-4">
              <h3 className="font-bold text-white mb-2">Ready to collaborate?</h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">Available for on-site GCC roles (Saudi Arabia, UAE, Qatar) and remote opportunities worldwide.</p>
              <a href="mailto:junaidkhaan455@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[#0d1117] text-sm"
                style={{ background: "linear-gradient(135deg,#22d3ee,#10b981)" }}>
                <Mail className="w-4 h-4" /> Hire Me
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── NAVIGATION ─────────────────────────────────────────────────────
export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [logoOpen, setLogoOpen] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])
  const links = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#sql", label: "SQL" },
    { href: "#python", label: "Python" },
    { href: "#resume", label: "Resume + Experience" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <>
      {logoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
          <div className="relative w-full max-w-3xl h-full max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-700 bg-[#0d1117] shadow-2xl">
            <button type="button" onClick={() => setLogoOpen(false)}
              className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 text-slate-100 hover:bg-slate-800 transition-colors">
              ✕
            </button>
            <div className="absolute inset-0 p-6">
              <div className="relative h-full w-full rounded-[28px] overflow-hidden border border-slate-700 bg-[#0f1720]">
                <Image src="/My_Logo.png" alt="Junaid Khan logo preview" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0d1117]/90 backdrop-blur-xl border-b border-[#30363d]" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.button type="button" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} onClick={() => setLogoOpen(true)}
            className="flex-1 flex items-center gap-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
            <span className="font-bold text-base"><span className="text-cyan-400">Junaid</span><span className="text-white">Khan</span></span>
          </motion.button>
          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="mailto:junaidkhaan455@gmail.com"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-[#0d1117]"
              style={{ background: "linear-gradient(135deg,#22d3ee,#10b981)" }}>
              Hire Me
            </a>
            <button onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 rounded-lg glass border border-[#30363d] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-[#0d1117]/95 backdrop-blur-xl border-b border-[#30363d] px-6 pb-4">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-slate-400 hover:text-white transition-colors border-b border-[#30363d]/50 last:border-0">
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </nav>
      {/* Floating logo moved out of header: clickable, fixed on page just below the header */}
      <button onClick={() => setLogoOpen(true)} aria-label="Open logo preview"
        className="fixed left-6 z-50"
        style={{ top: 'calc(4rem + 0.4rem)', width: '3in', height: '3in', padding: 0 }}>
        <div style={{ width: '3in', height: '3in', position: 'relative' }} className="overflow-hidden">
          <Image src="/My_Logo.png" alt="Junaid Khan logo" fill className="object-contain" />
        </div>
      </button>
    </>
  )
}

// ── FOOTER ─────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="border-t border-[#30363d] py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-bold"><span className="text-cyan-400">Junaid</span><span className="text-white">Khan</span></span>
            </div>
            <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed mb-4">Data Analyst transforming raw data into actionable business insights. Open to GCC & remote roles.</p>
            <div className="flex gap-2">
              {[{ icon: Github, href: "https://github.com/Junaid-Khan199" }, { icon: Linkedin, href: "https://www.linkedin.com/in/junaid-khan-199j" }, { icon: Mail, href: "mailto:junaidkhaan455@gmail.com" }].map((s, i) => (
                <a key={i} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg glass border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Navigate", links: [["About", "#about"], ["Skills", "#skills"], ["Projects", "#projects"], ["Dashboard", "#dashboard"]] },
            { title: "Tools", links: [["SQL Runner", "#sql"], ["Python Lab", "#python"], ["Resume", "#resume"], ["Contact", "#contact"]] },
            { title: "Contact", links: [["junaidkhaan455@gmail.com", "mailto:junaidkhaan455@gmail.com"], ["GitHub", "https://github.com/Junaid-Khan199"], ["LinkedIn", "https://www.linkedin.com/in/junaid-khan-199j"]] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-cyan-400 transition-colors truncate block">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-[#30363d]">
          <p className="text-xs text-slate-600">© 2026 Junaid Khan · Data Analyst · All rights reserved.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-9 h-9 rounded-lg glass border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
