"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { projects } from "@/data/projects"
import { getPythonOutput } from "@/lib/playground-data"
import {
  Play, Copy, Check, Code2, ChevronRight, Terminal,
  Trash2, Save, X, BookOpen, AlertCircle, Plus,
  FolderOpen, Settings, Maximize2, Minimize2, Lock,
  BarChart3
} from "lucide-react"
import { LogoCorner } from "./LogoCorner"

const GITHUB_USER = "Junaid-Khan199"
const STORAGE_KEY = "junaid_py_snippets_"

// ── Built-in locked snippets per project ────────────────────────────────────
const BUILTIN_SNIPPETS: Record<string, { title: string; code: string }[]> = {
  "oral-cancer-ml": [
    {
      title: "Load & Preview Dataset", code: `# Load & Preview Dataset
import pandas as pd
import numpy as np

df = pd.read_csv('oral_cancer_dataset.csv')
print("Shape:", df.shape)
print("\\nFirst 5 rows:")
print(df.head())
print("\\nData types:")
print(df.dtypes)
print("\\nMissing values:")
print(df.isnull().sum())` },
    {
      title: "Descriptive Statistics", code: `# Descriptive Statistics
import pandas as pd

df = pd.read_csv('oral_cancer_dataset.csv')
print("Summary Statistics:")
print(df.describe())
print("\\nCancer rate by tobacco use:")
print(df.groupby('tobacco_use')['cancer_diagnosis'].mean().round(4))` },
    {
      title: "ML Model — Random Forest", code: `# ML Model — Random Forest (97% Accuracy)
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd

df = pd.read_csv('oral_cancer_dataset.csv')
features = ['age','tobacco_use','alcohol_use','tumor_size','tumor_stage']
X = df[features]
y = df['cancer_diagnosis']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
preds = model.predict(X_test)

print("=== Random Forest Results ===")
print(f"  Accuracy: {accuracy_score(y_test, preds)*100:.2f}%")
print("\\nClassification Report:")
print(classification_report(y_test, preds))
print("\\nTop 3 Features:")
for feat, imp in sorted(zip(features, model.feature_importances_), key=lambda x:-x[1])[:3]:
    print(f"  {feat}: {imp:.4f}")` },
    {
      title: "Survival Analysis", code: `# Survival Analysis by Tumor Stage
import pandas as pd

df = pd.read_csv('oral_cancer_dataset.csv')
survival = df.groupby('tumor_stage').agg(
    cases=('patient_id','count'),
    avg_survival=('survival_months','mean'),
    avg_cost=('treatment_cost','mean')
).round(2)
print("Survival Analysis by Stage:")
print(survival.to_string())` },
  ],
  "saudi-retail": [
    {
      title: "Load & Preview Dataset", code: `# Load Saudi Retail Dataset
import pandas as pd
import numpy as np

df = pd.read_excel('saudi_retail_dataset.xlsx')
print("Shape:", df.shape)
print("\\nColumns:", list(df.columns))
print("\\nFirst 5 rows:")
print(df.head())` },
    {
      title: "Revenue Analysis", code: `# Revenue & Profit Analysis
import pandas as pd

df = pd.read_excel('saudi_retail_dataset.xlsx')
monthly = df.groupby('month').agg({
    'gross_sales': 'sum',
    'net_revenue': 'sum',
    'profit': 'sum'
}).round(2)
print("Monthly Revenue Summary (SAR):")
print(monthly.to_string())
print(f"\\nTotal Gross Sales: {df['gross_sales'].sum():,.2f}")
print(f"Total Orders: {len(df):,}")` },
    {
      title: "Category Performance", code: `# Category Performance Analysis
import pandas as pd

df = pd.read_excel('saudi_retail_dataset.xlsx')
cat = df.groupby('category').agg(
    revenue=('gross_sales','sum'),
    orders=('order_id','count'),
    avg_margin=('profit_margin','mean')
).sort_values('revenue', ascending=False).round(2)
print("Category Performance:")
print(cat.to_string())` },
  ],
  "superstore": [
    {
      title: "Load & Preview Dataset", code: `# Load Superstore Dataset
import pandas as pd

df = pd.read_csv('superstore_sales.csv')
print("Shape:", df.shape)
print("\\nFirst 5 rows:")
print(df.head())
print("\\nSegments:", df['Segment'].unique())` },
    {
      title: "Profit Analysis", code: `# Profit & Loss by Sub-Category
import pandas as pd

df = pd.read_csv('superstore_sales.csv')
result = df.groupby('Sub-Category').agg(
    Sales=('Sales','sum'), Profit=('Profit','sum')
)
result['Margin%'] = (result['Profit']/result['Sales']*100).round(2)
result = result.sort_values('Profit')
print("Sub-Category P&L:")
print(result.to_string())
print("\\nLoss-Making:")
print(result[result['Profit']<0])` },
  ],
  "fish-market": [
    {
      title: "Load & Preview Dataset", code: `# Load Fish Market Survey Data
import pandas as pd

df = pd.read_csv('fish_market_survey.csv')
print("Shape:", df.shape)
print("\\nFirst 5 rows:")
print(df.head())
print("\\nBuying reasons:", df['buying_reason'].value_counts())` },
    {
      title: "Chi-Square Test", code: `# Chi-Square Test — Education vs Buying Reason
from scipy.stats import chi2_contingency
import pandas as pd

df = pd.read_csv('fish_market_survey.csv')
ct = pd.crosstab(df['education_level'], df['buying_reason'])
chi2, p, dof, expected = chi2_contingency(ct)
print("Chi-Square Test Results:")
print(f"  Chi2 Statistic : {chi2:.4f}")
print(f"  P-value        : {p:.6f}")
print(f"  Degrees of Freedom: {dof}")
print(f"\\nSignificant difference: {'YES (p < 0.05)' if p < 0.05 else 'NO'}")` },
    {
      title: "ANOVA Analysis", code: `# One-Way ANOVA — Income vs Purchase Freq
from scipy.stats import f_oneway
import pandas as pd

df = pd.read_csv('fish_market_survey.csv')
groups = [g['purchase_frequency'].values for _, g in df.groupby('income_level')]
f_stat, p_value = f_oneway(*groups)
print("One-Way ANOVA Results:")
print(f"  F-statistic : {f_stat:.4f}")
print(f"  P-value     : {p_value:.6f}")
print(f"  Result      : {'Significant difference (p < 0.05)' if p_value < 0.05 else 'No significant difference'}")` },
  ],
}

function getBuiltins(pid: string) {
  const found = Object.entries(BUILTIN_SNIPPETS).find(([k]) => pid.toLowerCase().replace(/-/g, "").includes(k.replace(/-/g, "")))
  return found?.[1] ?? [
    { title: "Load Dataset", code: `# Load Dataset\nimport pandas as pd\n\ndf = pd.read_csv('dataset.csv')\nprint("Shape:", df.shape)\nprint("\\nFirst 5 rows:")\nprint(df.head())\nprint("\\nSummary:")\nprint(df.describe())` },
    { title: "Missing Values", code: `# Check Missing Values\nimport pandas as pd\n\ndf = pd.read_csv('dataset.csv')\nprint("Missing values per column:")\nprint(df.isnull().sum())\nprint(f"\\nTotal missing: {df.isnull().sum().sum()}")` },
  ]
}

function isChartCode(code: string): boolean {
  return /plt\.|matplotlib|seaborn|sns\.|plotly|\.plot\(|\.bar\(|\.hist\(|\.scatter\(/.test(code)
}

function colorLine(line: string): string {
  if (line.trim().startsWith("#")) return "text-slate-500 italic"
  if (/\bdef \b|\bclass \b/.test(line)) return "text-violet-400"
  if (/\bimport \b|\bfrom \b/.test(line)) return "text-cyan-400"
  if (/\bprint\(/.test(line)) return "text-emerald-400"
  if (/Traceback|Error:|Exception:/.test(line)) return "text-red-400 font-semibold"
  if (/^\s+(Accuracy|F-stat|P-value|Chi2|ROC|Significant)/.test(line)) return "text-cyan-300"
  if (/^\s*={3,}/.test(line)) return "text-violet-400 font-semibold"
  return "text-slate-300"
}

export default function PythonEditor() {
  const [activeProject, setActiveProject] = useState(projects[1] ?? projects[0])
  const [savedSnippets, setSavedSnippets] = useState<{ title: string; code: string }[]>([])
  const [activeIdx, setActiveIdx] = useState<{ type: "builtin" | "saved"; idx: number }>({ type: "builtin", idx: 0 })
  const [editorCode, setEditorCode] = useState("")
  const [tempCode, setTempCode] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saveModal, setSaveModal] = useState(false)
  const [saveTitle, setSaveTitle] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(true)
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const builtins = getBuiltins(activeProject.id)

  // Load saved snippets
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + activeProject.id)
      setSavedSnippets(raw ? JSON.parse(raw) : [])
    } catch { setSavedSnippets([]) }
  }, [activeProject.id])

  // Set editor from active snippet
  useEffect(() => {
    const s = activeIdx.type === "builtin" ? builtins[activeIdx.idx] : savedSnippets[activeIdx.idx]
    if (s) { setEditorCode(s.code); setTempCode(null); setOutput(null) }
  }, [activeIdx, activeProject.id])

  const currentCode = tempCode !== null ? tempCode : editorCode
  const isDirty = tempCode !== null && tempCode !== editorCode

  const runCode = async () => {
    if (!currentCode.trim()) { setOutput("Error: No code to run. Write something first."); return }
    setRunning(true); setOutput(null)
    try {
      const res = await fetch("/api/run-python", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: activeProject.id, snippetIdx: activeIdx.type === "builtin" ? activeIdx.idx : 0, customCode: isDirty ? currentCode : undefined })
      })
      const payload = await res.json()
      if (payload?.error) setOutput(`Traceback (most recent call last):\n  ...\n${payload.error}`)
      else setOutput(payload?.output ?? getPythonOutput(activeProject.id, activeIdx.type === "builtin" ? activeIdx.idx : 0))
    } catch {
      setOutput(getPythonOutput(activeProject.id, activeIdx.type === "builtin" ? activeIdx.idx : 0))
    } finally { setRunning(false) }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key → insert 4 spaces
    if (e.key === "Tab") {
      e.preventDefault()
      const ta = textareaRef.current!
      const start = ta.selectionStart; const end = ta.selectionEnd
      const newVal = currentCode.slice(0, start) + "    " + currentCode.slice(end)
      setTempCode(newVal)
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4 }, 0)
    }
    // Ctrl+Enter → run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runCode() }
    // Ctrl+S → save modal
    if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); if (isDirty) setSaveModal(true) }
  }

  const saveSnippet = () => {
    if (!currentCode.trim()) return
    const title = saveTitle.trim() || `Custom ${savedSnippets.length + 1}`
    const updated = [...savedSnippets, { title, code: currentCode }]
    setSavedSnippets(updated)
    try { localStorage.setItem(STORAGE_KEY + activeProject.id, JSON.stringify(updated)) } catch { }
    setActiveIdx({ type: "saved", idx: updated.length - 1 })
    setSaveModal(false); setSaveTitle("")
  }

  const deleteSaved = (idx: number) => {
    const updated = savedSnippets.filter((_, i) => i !== idx)
    setSavedSnippets(updated)
    try { localStorage.setItem(STORAGE_KEY + activeProject.id, JSON.stringify(updated)) } catch { }
    setActiveIdx({ type: "builtin", idx: 0 })
  }

  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) { try { await editorRef.current?.requestFullscreen(); } catch { } setIsFullscreen(true) }
    else { try { await document.exitFullscreen(); } catch { } setIsFullscreen(false) }
  }, [isFullscreen])

  useEffect(() => {
    const h = () => { if (!document.fullscreenElement) setIsFullscreen(false) }
    document.addEventListener("fullscreenchange", h)
    return () => document.removeEventListener("fullscreenchange", h)
  }, [])

  const hasError = output?.toLowerCase().includes("traceback") || output?.toLowerCase().includes("error:")
  const lineCount = currentCode.split("\n").length

  return (
    <section id="python" ref={ref} className="py-16 relative">
      <LogoCorner />
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-violet-500" />
            <span className="text-xs uppercase tracking-widest text-violet-400 font-semibold">Python Lab</span>
            <div className="h-px w-12 bg-violet-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            VS Code–Style <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>Python Editor</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">Full code editor with real dataset snippets. Tab to indent, Ctrl+Enter to run, Ctrl+S to save.</p>
        </motion.div>

        {/* Project selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-5">
          {projects.map(p => (
            <button key={p.id} onClick={() => { setActiveProject(p); setActiveIdx({ type: "builtin", idx: 0 }) }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${activeProject.id === p.id ? "text-[#0d1117] border-transparent" : "glass border-[#30363d] text-slate-400 hover:text-white hover:border-violet-500/40"}`}
              style={activeProject.id === p.id ? { background: `linear-gradient(135deg,${p.accentColor},${p.accentColor}bb)` } : {}}>
              <span>{p.emoji}</span><span className="hidden sm:inline">{p.shortTitle}</span>
            </button>
          ))}
        </motion.div>

        {/* VS Code layout */}
        <div ref={editorRef}
          className={`${isFullscreen ? "fixed inset-0 z-[100] bg-[#0d1117] flex flex-col" : "glass rounded-2xl border border-[#30363d] overflow-hidden"}`}
          style={{ minHeight: isFullscreen ? "100vh" : "680px" }}>

          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-[#30363d] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Code2 className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-slate-500">{activeProject.shortTitle} /</span>
                <span className="text-white">{activeIdx.type === "builtin" ? builtins[activeIdx.idx]?.title.replace(/\s+/g, "_").toLowerCase() : savedSnippets[activeIdx.idx]?.title.replace(/\s+/g, "_").toLowerCase()}.py</span>
                {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 hidden sm:inline">Ln {lineCount} · Python 3.11</span>
              {isDirty && (
                <button onClick={() => setSaveModal(true)} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-violet-400 hover:bg-violet-500/10 transition-all border border-violet-500/30">
                  <Save className="w-3 h-3" /> Save
                </button>
              )}
              <button onClick={toggleFullscreen} className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Main body */}
          <div className="flex flex-1 min-h-0 overflow-hidden">

            {/* ── Sidebar: file/snippet explorer ── */}
            <div className="w-52 flex-shrink-0 bg-[#1e1e2e] border-r border-[#30363d] flex flex-col overflow-hidden">
              <div className="px-3 py-2 border-b border-[#30363d] flex items-center gap-2">
                <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Explorer</span>
              </div>

              {/* Project files */}
              <div className="flex-1 overflow-y-auto py-1">
                {/* Built-in snippets */}
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-1 text-[10px] text-slate-600 uppercase tracking-wider mb-1 px-1">
                    <Lock className="w-2.5 h-2.5" /> Built-in
                  </div>
                  {builtins.map((s, i) => (
                    <button key={i} onClick={() => setActiveIdx({ type: "builtin", idx: i })}
                      className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all ${activeIdx.type === "builtin" && activeIdx.idx === i
                          ? "bg-[#2d2d3e] text-white"
                          : "text-slate-500 hover:text-white hover:bg-[#2a2a3e]"
                        }`}>
                      <span className="text-violet-400 flex-shrink-0">🐍</span>
                      <span className="truncate leading-snug">{s.title}</span>
                    </button>
                  ))}
                </div>

                {/* Saved snippets */}
                {savedSnippets.length > 0 && (
                  <div className="px-2 py-1.5 border-t border-[#30363d] mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-slate-600 uppercase tracking-wider mb-1 px-1">
                      <Save className="w-2.5 h-2.5" /> Saved
                    </div>
                    {savedSnippets.map((s, i) => (
                      <div key={i} className="relative group">
                        <button onClick={() => setActiveIdx({ type: "saved", idx: i })}
                          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all pr-7 ${activeIdx.type === "saved" && activeIdx.idx === i
                              ? "bg-[#2d2d3e] text-white"
                              : "text-slate-500 hover:text-white hover:bg-[#2a2a3e]"
                            }`}>
                          <span className="text-emerald-400 flex-shrink-0">📄</span>
                          <span className="truncate">{s.title}</span>
                        </button>
                        <button onClick={() => deleteSaved(i)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Libraries */}
                <div className="px-2 py-1.5 border-t border-[#30363d] mt-1">
                  <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1.5 px-1">Libraries</div>
                  {activeProject.tools.map(t => (
                    <div key={t} className="flex items-center gap-2 px-2 py-1 text-xs text-slate-600">
                      <span className="text-violet-400 text-[10px]">📦</span>
                      <span className="font-mono">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom dataset info */}
              <div className="px-3 py-2.5 border-t border-[#30363d] bg-[#161b22]">
                {activeProject.dataset ? (
                  <div>
                    <p className="text-[10px] text-emerald-400 font-semibold">✓ Dataset loaded</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{activeProject.dataset.name}</p>
                    <p className="text-[10px] text-slate-700">{activeProject.dataset.rows.toLocaleString()} rows</p>
                  </div>
                ) : (
                  <p className="text-[10px] text-amber-400/80">⚠ No dataset linked</p>
                )}
              </div>
            </div>

            {/* ── Editor + Terminal ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

              {/* Code editor area */}
              <div className="flex-1 relative overflow-hidden flex" style={{ minHeight: "300px" }}>
                {/* Gutter */}
                <div className="select-none text-right pr-3 pl-2 py-4 font-mono text-xs leading-[1.7] text-slate-700 bg-[#1a1a2a] border-r border-[#30363d] flex-shrink-0 min-w-[44px]">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} className="h-[1.7em]">{i + 1}</div>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={currentCode}
                  onChange={e => setTempCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  className="flex-1 bg-[#1a1a2a] text-slate-200 font-mono text-sm py-4 px-4 resize-none outline-none leading-[1.7] overflow-auto"
                  style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", tabSize: 4 }}
                  placeholder="# Write Python code here…"
                />
              </div>

              {/* Run bar */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#252535] border-t border-[#30363d] flex-shrink-0">
                <span className="text-[10px] text-slate-600 hidden sm:inline">Ctrl+Enter to run · Tab to indent · Ctrl+S to save</span>
                <div className="ml-auto flex items-center gap-2">
                  {isDirty && (
                    <button onClick={() => setTempCode(null)} className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                      <X className="w-3 h-3" /> Reset
                    </button>
                  )}
                  <button onClick={() => { navigator.clipboard.writeText(currentCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-slate-500 hover:text-white glass border border-[#30363d] transition-all">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button onClick={() => { setTempCode(""); setOutput(null); setTimeout(() => textareaRef.current?.focus(), 50) }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-slate-500 hover:text-red-400 glass border border-[#30363d] transition-all">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                  {isChartCode(currentCode) && (
                    <span className="text-[10px] text-violet-400 hidden sm:inline">📊 Chart → popup</span>
                  )}
                  <button onClick={runCode} disabled={running}
                    className="flex items-center gap-1.5 px-5 py-1.5 rounded font-bold text-xs text-[#0d1117] transition-all disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>
                    {running ? <span className="w-3.5 h-3.5 border-2 border-[#0d1117]/30 border-t-[#0d1117] rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    {running ? "Running…" : "▶ Run"}
                  </button>
                </div>
              </div>

              {/* Terminal */}
              <div className={`flex flex-col border-t border-[#30363d] bg-[#0f0f1a] transition-all flex-shrink-0 ${terminalOpen ? "h-64" : "h-9"}`}>
                {/* Terminal title bar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d] flex-shrink-0 cursor-pointer"
                  onClick={() => setTerminalOpen(p => !p)}>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-slate-400 font-semibold">Terminal</span>
                    {output && !running && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${hasError ? "text-red-400 bg-red-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>
                        {hasError ? "Error" : "Exit 0"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {running && <span className="text-[10px] text-violet-400 animate-pulse">● Running</span>}
                    <span className="text-slate-600 text-xs">{terminalOpen ? "▼" : "▲"}</span>
                  </div>
                </div>

                {/* Terminal output */}
                {terminalOpen && (
                  <div className="flex-1 overflow-auto p-4">
                    {running && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          <span className="w-3.5 h-3.5 border border-violet-500/30 border-t-violet-500 rounded-full animate-spin flex-shrink-0" />
                          python {activeIdx.type === "builtin" ? builtins[activeIdx.idx]?.title.replace(/\s+/g, "_").toLowerCase() : "custom"}.py
                        </div>
                        {["Importing libraries…", "Loading dataset…", "Executing script…"].map((m, i) => (
                          <motion.div key={m} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.35 }}
                            className="text-[11px] text-slate-600 font-mono pl-5">
                            {m}
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {!running && !output && (
                      <p className="text-slate-600 text-xs font-mono">Press ▶ Run or Ctrl+Enter to execute</p>
                    )}
                    {!running && output && (
                      <div className="font-mono text-xs leading-relaxed">
                        <div className="text-slate-600 mb-2">&gt; python script.py</div>
                        {output.split("\n").map((line, i) => (
                          <div key={i} className={colorLine(line)}>{line || " "}</div>
                        ))}
                        <div className="text-slate-700 mt-2">
                          &gt; Process finished with exit code {hasError ? 1 : 0}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save modal */}
      <AnimatePresence>
        {saveModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSaveModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass rounded-2xl p-6 border border-violet-500/30 w-full max-w-sm mx-4">
              <h3 className="font-bold text-white mb-1">Save Snippet</h3>
              <p className="text-xs text-slate-500 mb-4">Name your snippet to add it to the explorer.</p>
              <input value={saveTitle} onChange={e => setSaveTitle(e.target.value)} placeholder="My analysis…"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#21262d] border border-[#30363d] focus:border-violet-500/50 focus:outline-none text-white placeholder:text-slate-600 text-sm mb-4"
                onKeyDown={e => { if (e.key === "Enter") saveSnippet() }} autoFocus />
              <div className="flex gap-2">
                <button onClick={saveSnippet}
                  className="flex-1 py-2.5 rounded-xl font-bold text-[#0d1117] text-sm"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#22d3ee)" }}>Save</button>
                <button onClick={() => setSaveModal(false)}
                  className="px-4 py-2.5 rounded-xl glass border border-[#30363d] text-slate-400 hover:text-white text-sm">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
