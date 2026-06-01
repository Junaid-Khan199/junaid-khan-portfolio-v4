"use client"
import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"

// Base skill categories — static known skills
const BASE_SKILL_CATEGORIES = [
  {
    name: "Data Analysis", icon: "📊", color: "#22d3ee",
    skills: [["Statistical Analysis", 90], ["Data Cleaning & ETL", 95], ["Exploratory Data Analysis", 88], ["Regression Analysis", 85], ["Hypothesis Testing", 88]]
  },
  {
    name: "Visualization & BI", icon: "📈", color: "#10b981",
    skills: [["Power BI & DAX", 88], ["Dashboard Design", 92], ["Excel Charts & Pivot", 95], ["Matplotlib / Seaborn", 82], ["Power Query", 90]]
  },
  {
    name: "Databases & SQL", icon: "🗄️", color: "#f59e0b",
    skills: [["SQL", 88], ["MySQL", 85], ["Query Optimisation", 80], ["Data Extraction", 85], ["SPSS", 75]]
  },
  {
    name: "Programming", icon: "💻", color: "#8b5cf6",
    skills: [["Python", 85], ["Pandas", 88], ["NumPy", 82], ["Scikit-learn", 78], ["R (basics)", 70]]
  },
  {
    name: "Tools & Platforms", icon: "🛠", color: "#f43f5e",
    skills: [["Excel (Advanced)", 95], ["Power Pivot", 88], ["GitHub", 80], ["Jupyter Notebook", 85], ["MS Office Suite", 90]]
  },
  {
    name: "Statistics & ML", icon: "🧪", color: "#06b6d4",
    skills: [["Hypothesis Testing", 88], ["Time Series Analysis", 78], ["Forecasting", 75], ["ML Algorithms (7+)", 80], ["PCA", 72]]
  },
]

// Skill keyword → category map for GitHub auto-detection
const SKILL_CATEGORY_MAP: Record<string, string> = {
  "tensorflow": "Statistics & ML", "keras": "Statistics & ML", "pytorch": "Statistics & ML",
  "lightgbm": "Statistics & ML", "xgboost": "Statistics & ML", "catboost": "Statistics & ML",
  "plotly": "Visualization & BI", "streamlit": "Visualization & BI", "dash": "Visualization & BI",
  "fastapi": "Programming", "flask": "Programming", "django": "Programming",
  "postgresql": "Databases & SQL", "sqlite": "Databases & SQL", "mongodb": "Databases & SQL",
  "azure": "Tools & Platforms", "docker": "Tools & Platforms", "aws": "Tools & Platforms",
  "spark": "Tools & Platforms", "airflow": "Tools & Platforms",
  "statsmodels": "Statistics & ML", "scipy": "Statistics & ML",
}

const GITHUB_USER = "Junaid-Khan199"

async function fetchGitHubSkills(): Promise<typeof BASE_SKILL_CATEGORIES> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
    if (!res.ok) return BASE_SKILL_CATEGORIES
    const repos: { topics?: string[]; language?: string }[] = await res.json()

    const newSkillsFound: Record<string, Set<string>> = {}
    BASE_SKILL_CATEGORIES.forEach(c => { newSkillsFound[c.name] = new Set() })

    repos.forEach(repo => {
      const topics = repo.topics ?? []
      const lang = repo.language?.toLowerCase() ?? ""
      const allTags = [...topics, lang]

      allTags.forEach(tag => {
        const categoryName = SKILL_CATEGORY_MAP[tag.toLowerCase()]
        if (categoryName && newSkillsFound[categoryName]) {
          const display = tag.charAt(0).toUpperCase() + tag.slice(1)
          newSkillsFound[categoryName].add(display)
        }
      })
    })

    // Merge new skills into categories, avoid duplicates
    return BASE_SKILL_CATEGORIES.map(cat => {
      const existingNames = new Set(cat.skills.map(s => (s[0] as string).toLowerCase()))
      const additions = [...(newSkillsFound[cat.name] ?? [])].filter(
        s => !existingNames.has(s.toLowerCase())
      )
      const newSkills: [string, number][] = additions.slice(0, 3).map(s => [s, 70])
      return {
        ...cat,
        skills: [...cat.skills, ...newSkills] as [string, number][],
      }
    })
  } catch {
    return BASE_SKILL_CATEGORIES
  }
}

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-500">{level}%</span>
      </div>
      <div className="h-1.5 bg-[#21262d] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState(0)
  const [skillCategories, setSkillCategories] = useState(BASE_SKILL_CATEGORIES)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    fetchGitHubSkills().then(setSkillCategories)
  }, [])

  const cat = skillCategories[active]
  const avg = Math.round(cat.skills.reduce((a, b) => a + (b[1] as number), 0) / cat.skills.length)

  // Tabs wrap into new row automatically (flex-wrap)
  return (
    <section id="skills" ref={ref} className="py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-cyan-500" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Technical Skills</span>
            <div className="h-px w-12 bg-cyan-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            My <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#22d3ee,#10b981)" }}>Technical</span> Arsenal
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">Built through real projects — 185K-record pipelines, automated Power Query ETL, and published research.</p>
        </motion.div>

        {/* Category tabs — auto-wrap to new rows when categories grow */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-8">
          {skillCategories.map((c, i) => (
            <motion.button key={c.name} onClick={() => setActive(i)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${active === i ? "text-[#0d1117] border-transparent" : "glass border-[#30363d] text-slate-400 hover:text-white hover:border-cyan-500/30"
                }`}
              style={active === i ? { background: `linear-gradient(135deg, ${c.color}, ${c.color}bb)` } : {}}>
              <span>{c.icon}</span><span>{c.name}</span>
            </motion.button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active panel */}
          <motion.div key={active} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-6 border border-[#30363d] relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle at 30% 50%, ${cat.color}, transparent 70%)` }} />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${cat.color}18` }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-500">Average proficiency: <span style={{ color: cat.color }}>{avg}%</span></p>
                </div>
              </div>
              <div className="space-y-4">
                {cat.skills.map(([n, l], i) => (
                  <SkillBar key={n as string} name={n as string} level={l as number} color={cat.color} delay={i * 0.08} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Overview list */}
          <div className="space-y-2.5">
            {skillCategories.map((c, i) => {
              const a = Math.round(c.skills.reduce((s, b) => s + (b[1] as number), 0) / c.skills.length)
              return (
                <motion.div key={c.name}
                  initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  onClick={() => setActive(i)}
                  className={`glass rounded-xl p-4 border cursor-pointer transition-all ${active === i ? "border-cyan-500/40 bg-cyan-500/3" : "border-[#30363d] hover:border-[#444]"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: `${c.color}15` }}>
                        {c.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.skills.length} skills</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: c.color, width: `${a}%` }}
                          initial={{ width: 0 }} animate={isInView ? { width: `${a}%` } : {}} transition={{ duration: 1, delay: 0.5 + i * 0.08 }} />
                      </div>
                      <span className="text-xs text-slate-500 w-8 text-right">{a}%</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
