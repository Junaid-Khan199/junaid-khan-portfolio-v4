"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { projects as localProjects } from "@/data/projects"
import { Github, ExternalLink, ChevronRight, Star, Filter, RefreshCw } from "lucide-react"

const GITHUB_USER = "Junaid-Khan199"

// Detect category from repo topics/language
function detectCategory(topics: string[], language: string): string {
  const t = [...topics, language.toLowerCase()]
  if (t.some(x => ["power-bi", "powerbi", "dax", "pbix"].includes(x))) return "Power BI"
  if (t.some(x => ["python", "jupyter", "pandas", "scikit-learn", "ml", "machine-learning"].includes(x))) return "Python"
  if (t.some(x => ["sql", "mysql", "postgresql", "sqlite"].includes(x))) return "SQL"
  if (t.some(x => ["excel", "xlsx", "spreadsheet", "vba"].includes(x))) return "Excel"
  if (language === "Python") return "Python"
  if (language === "Jupyter Notebook") return "Python"
  return "Python"
}

type GHProject = {
  id: string
  title: string
  shortTitle: string
  description: string
  category: string
  tools: string[]
  emoji: string
  color: string
  accentColor: string
  impact: string
  featured: boolean
  status: "published" | "client" | "personal" | null
  github: string
  live: string | null
  insights: string[]
}

async function fetchGitHubProjects(): Promise<GHProject[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    )
    if (!res.ok) return []
    const repos: {
      id: number; name: string; description: string | null; html_url: string;
      topics?: string[]; language: string; homepage?: string; fork: boolean; stargazers_count: number
    }[] = await res.json()

    // Only non-fork, non-profile repos
    const filtered = repos.filter(r =>
      !r.fork &&
      r.name !== GITHUB_USER &&
      !r.name.endsWith(".github.io")
    )

    // Map to our project format — only repos NOT already in localProjects
    const localIds = new Set(localProjects.map(p => p.id))
    const colors = ["#22d3ee", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e", "#06b6d4", "#a78bfa", "#34d399"]
    const emojis = ["📊", "🤖", "📈", "🗄️", "📉", "🔬", "💹", "🧮"]

    return filtered
      .filter(r => {
        // Check if this repo is already in local projects by name match
        const repoNameClean = r.name.toLowerCase().replace(/-/g, "")
        return !localProjects.some(p => {
          const pid = p.id.toLowerCase().replace(/-/g, "")
          return pid.includes(repoNameClean.slice(0, 8)) || repoNameClean.includes(pid.slice(0, 8))
        })
      })
      .slice(0, 6)
      .map((r, i) => ({
        id: r.name,
        title: r.name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        shortTitle: r.name.replace(/-/g, " ").slice(0, 20),
        description: r.description ?? "Data analytics project — click GitHub to view details.",
        category: detectCategory(r.topics ?? [], r.language ?? ""),
        tools: [r.language ?? "Python", ...(r.topics ?? []).slice(0, 3)].filter(Boolean),
        emoji: emojis[i % emojis.length],
        color: colors[i % colors.length],
        accentColor: colors[i % colors.length],
        impact: r.stargazers_count > 0 ? `⭐ ${r.stargazers_count}` : "New",
        featured: false,
        status: null,
        github: r.html_url,
        live: r.homepage ?? null,
        insights: ["View on GitHub for full analysis and results."],
      }))
  } catch {
    return []
  }
}

export default function Projects() {
  const [active, setActive] = useState("All")
  const [ghProjects, setGhProjects] = useState<GHProject[]>([])
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const allProjects = [...localProjects, ...ghProjects]
  const categories = ["All", ...Array.from(new Set(allProjects.map(p => p.category)))]
  const filtered = active === "All" ? allProjects : allProjects.filter(p => p.category === active)

  const loadGitHub = async () => {
    setLoading(true)
    const gh = await fetchGitHubProjects()
    setGhProjects(gh)
    setLoading(false)
  }

  useEffect(() => { loadGitHub() }, [])

  return (
    <section id="projects" ref={ref} className="py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-cyan-500" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Portfolio</span>
            <div className="h-px w-12 bg-cyan-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Featured <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#22d3ee,#10b981)" }}>Projects</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            Real-world analytics with measurable business impact, published research, and client deliverables.
          </p>
        </motion.div>

        {/* Filters + refresh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          <Filter className="w-4 h-4 text-slate-500" />
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${active === cat
                ? "text-[#0d1117] border-transparent"
                : "glass border-[#30363d] text-slate-400 hover:text-white hover:border-cyan-500/30"
                }`}
              style={active === cat ? { background: "linear-gradient(135deg,#22d3ee,#10b981)" } : {}}
            >
              {cat}
            </motion.button>
          ))}
          <button onClick={loadGitHub} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-[#30363d] text-xs text-slate-500 hover:text-cyan-400 transition-colors"
            title="Refresh from GitHub">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            GitHub
          </button>
        </motion.div>

        {/* Cards */}
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="group glass rounded-2xl overflow-hidden border border-[#30363d] hover:border-cyan-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1"
              >
                {/* Thumb */}
                <div
                  className="relative h-44 overflow-hidden flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${"color" in project ? project.color : project.accentColor}, #0d1117)` }}
                >
                  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 300 160" preserveAspectRatio="none">
                    <polyline points="0,130 60,80 120,100 180,40 240,65 300,25" fill="none" stroke="white" strokeWidth="2" />
                    <polyline points="0,150 60,110 120,125 180,65 240,85 300,50" fill="none" stroke="white" strokeWidth="1.2" />
                    <polyline points="0,100 50,70 100,90 150,45 200,60 250,30 300,45" fill="none" stroke="white" strokeWidth="1" />
                  </svg>
                  <motion.div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl glass border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {project.emoji}
                  </motion.div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {"featured" in project && project.featured && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-400 font-semibold">
                        <Star className="w-3 h-3 fill-cyan-400" /> Featured
                      </span>
                    )}
                    {"status" in project && project.status === "published" && (
                      <span className="px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-xs text-violet-400 font-semibold">📄 Published</span>
                    )}
                    {"status" in project && project.status === "client" && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-400 font-semibold">👔 Client</span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: `${project.accentColor}20`, color: project.accentColor, border: `1px solid ${project.accentColor}30` }}>
                      {project.impact}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3.5">
                  <h3 className="font-bold text-white text-sm leading-snug group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tools.slice(0, 4).map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-[#21262d] text-xs text-slate-400 font-mono">{t}</span>
                    ))}
                    {project.tools.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-[#21262d] text-xs text-slate-500">+{project.tools.length - 4}</span>
                    )}
                  </div>

                  {"insights" in project && (
                    <div className="space-y-1">
                      {project.insights.slice(0, 3).map(ins => (
                        <div key={ins} className="flex items-start gap-2 text-xs text-slate-400">
                          <ChevronRight className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                          <span>{ins}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold glass border border-[#30363d] text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all">
                        <Github className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-[#0d1117] transition-all"
                        style={{ background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}bb)` }}>
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </a>
                    )}
                    {!project.github && !project.live && (
                      <span className="flex-1 text-center text-xs text-slate-600 py-2 italic">Files on local machine</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <a href="https://github.com/Junaid-Khan199" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-[#30363d] hover:border-cyan-500/40 text-slate-400 hover:text-white text-sm font-semibold transition-all">
            <Github className="w-4 h-4" /> View All on GitHub <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
