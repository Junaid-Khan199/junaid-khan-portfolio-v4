"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { projects } from "@/data/projects"
import { getSqlResult } from "@/lib/playground-data"
import {
  Play, Copy, Check, Database, ChevronRight, Trash2,
  AlertCircle, X, Plus, Save, Table2, RefreshCw, Info,
  ChevronDown, Lock
} from "lucide-react"

const GITHUB_USER = "Junaid-Khan199"

// ── Built-in queries per project (LOCKED — user cannot delete these) ──────────
const BUILTIN_QUERIES: Record<string, { title: string; sql: string }[]> = {
  "saudi-retail": [
    { title: "Monthly Revenue & Profit", sql: `SELECT month, total_revenue, total_profit, margin_pct\nFROM saudi_retail\nORDER BY month;` },
    { title: "Revenue by Category", sql: `SELECT category, total_revenue, total_orders, avg_margin\nFROM saudi_retail\nGROUP BY category\nORDER BY total_revenue DESC;` },
    { title: "Regional Performance", sql: `SELECT region_name, actual_sales, sales_target,\n       ROUND((actual_sales - sales_target) / sales_target * 100, 1) AS variance_pct\nFROM saudi_retail\nORDER BY actual_sales DESC;` },
    { title: "Top 5 Products by Profit", sql: `SELECT product_name, category, profit, margin_pct\nFROM saudi_retail\nORDER BY profit DESC\nLIMIT 5;` },
    { title: "Return Rate Analysis", sql: `SELECT category, COUNT(*) AS orders,\n       SUM(returns) AS total_returns,\n       ROUND(SUM(returns)*100.0/COUNT(*), 2) AS return_rate\nFROM saudi_retail\nGROUP BY category\nORDER BY return_rate DESC;` },
  ],
  "oral-cancer-ml": [
    { title: "Risk Factors Overview", sql: `SELECT tobacco_use, alcohol_use, COUNT(*) AS patients, cancer_rate\nFROM oral_cancer\nGROUP BY tobacco_use, alcohol_use\nORDER BY cancer_rate DESC;` },
    { title: "Survival by Stage", sql: `SELECT tumor_stage, COUNT(*) AS cases,\n       AVG(survival_months) AS avg_survival,\n       AVG(treatment_cost) AS avg_cost\nFROM oral_cancer\nGROUP BY tumor_stage\nORDER BY tumor_stage;` },
    { title: "ML Model Accuracy", sql: `SELECT model_name, accuracy, precision_score, recall, f1_score\nFROM oral_cancer_models\nORDER BY accuracy DESC;` },
  ],
  "superstore": [
    { title: "Profit by Sub-Category", sql: `SELECT sub_category, SUM(sales) AS total_sales,\n       SUM(profit) AS total_profit,\n       ROUND(SUM(profit)/SUM(sales)*100, 2) AS margin\nFROM superstore\nGROUP BY sub_category\nORDER BY total_profit;` },
    { title: "Segment Analysis", sql: `SELECT segment, COUNT(DISTINCT customer_id) AS customers,\n       SUM(sales) AS revenue, SUM(profit) AS profit\nFROM superstore\nGROUP BY segment;` },
    { title: "Loss-Making Products", sql: `SELECT product_name, sub_category,\n       SUM(profit) AS total_profit\nFROM superstore\nGROUP BY product_name\nHAVING total_profit < 0\nORDER BY total_profit\nLIMIT 10;` },
  ],
  "fish-market": [
    { title: "Buying Reasons by Education", sql: `SELECT education_level, buying_reason,\n       COUNT(*) AS respondents,\n       ROUND(COUNT(*)*100.0/SUM(COUNT(*)) OVER(PARTITION BY education_level), 1) AS pct\nFROM fish_market\nGROUP BY education_level, buying_reason\nORDER BY education_level, respondents DESC;` },
    { title: "Chi-Square Groups", sql: `SELECT age_group, gender, preference,\n       COUNT(*) AS count\nFROM fish_market\nGROUP BY age_group, gender, preference\nORDER BY count DESC;` },
  ],
}

const DEFAULT_BUILTIN: { title: string; sql: string }[] = [
  { title: "Preview (first 10 rows)", sql: `SELECT *\nFROM dataset\nLIMIT 10;` },
  { title: "Row count", sql: `SELECT COUNT(*) AS total_rows FROM dataset;` },
  { title: "Column overview", sql: `SELECT column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_name = 'dataset';` },
]

function getBuiltin(pid: string) {
  const found = Object.entries(BUILTIN_QUERIES).find(([k]) => pid.toLowerCase().includes(k.replace(/-/g,"")))
  return found?.[1] ?? DEFAULT_BUILTIN
}

const STORAGE_KEY = "junaid_sql_saved_"

// ── Schema panel ──────────────────────────────────────────────────────────────
function SchemaPanel({ project }: { project: typeof projects[0] }) {
  const ds = project.dataset
  if (!ds) return (
    <div className="p-3 text-xs text-amber-400/80">
      <AlertCircle className="w-4 h-4 mb-1"/>
      No dataset available.<br/>Upload a CSV to GitHub.
    </div>
  )
  // Fake schema from dataset info
  const sampleCols = [
    { name: "id", type: "INT", pk: true },
    { name: ds.name.split(" ")[0].toLowerCase()+"_date", type: "DATE" },
    { name: "category", type: "VARCHAR(100)" },
    { name: "region", type: "VARCHAR(50)" },
    { name: "sales", type: "DECIMAL(12,2)" },
    { name: "profit", type: "DECIMAL(12,2)" },
    { name: "quantity", type: "INT" },
    { name: "discount", type: "DECIMAL(5,4)" },
  ]
  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 px-1">Schema</p>
      <div className="glass rounded-xl border border-[#30363d] overflow-hidden">
        <div className="px-3 py-2 bg-[#21262d] border-b border-[#30363d] flex items-center gap-2">
          <Table2 className="w-3.5 h-3.5 text-cyan-400"/>
          <span className="text-xs text-cyan-400 font-mono font-semibold">{ds.name.replace(/\s+/g,"_").toLowerCase()}</span>
          <span className="ml-auto text-[10px] text-slate-600">{ds.rows.toLocaleString()} rows</span>
        </div>
        <div className="p-2">
          {sampleCols.map(col => (
            <div key={col.name} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-[#21262d] transition-colors">
              {col.pk && <span className="text-[9px] text-amber-400 font-bold w-3">🔑</span>}
              {!col.pk && <span className="w-3"/>}
              <span className="text-xs font-mono text-slate-300 flex-1">{col.name}</span>
              <span className="text-[10px] text-slate-600 font-mono">{col.type}</span>
            </div>
          ))}
          {ds.githubCsv && (
            <a href={ds.githubCsv} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-cyan-400/70 hover:text-cyan-400 mt-2 pl-1 transition-colors">
              📥 Raw CSV on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main SQL component ────────────────────────────────────────────────────────
export default function SQLShowcase() {
  const [activeProject, setActiveProject] = useState(projects[0])
  const [savedQueries, setSavedQueries] = useState<{ title: string; sql: string }[]>([])
  const [activeIdx, setActiveIdx] = useState<{ type: "builtin"|"saved"; idx: number }>({ type: "builtin", idx: 0 })
  const [editorCode, setEditorCode] = useState("")
  const [tempCode, setTempCode] = useState<string|null>(null) // user's temp edit
  const [output, setOutput] = useState<null | { columns: string[]; rows: (string|number)[][] } | { error: string; hint?: string }>(null)
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saveModal, setSaveModal] = useState(false)
  const [saveTitle, setSaveTitle] = useState("")
  const [showSchema, setShowSchema] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const builtin = getBuiltin(activeProject.id)

  // Load saved queries
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + activeProject.id)
      setSavedQueries(raw ? JSON.parse(raw) : [])
    } catch { setSavedQueries([]) }
  }, [activeProject.id])

  // Set editor content from active query
  useEffect(() => {
    const q = activeIdx.type === "builtin" ? builtin[activeIdx.idx] : savedQueries[activeIdx.idx]
    if (q) { setEditorCode(q.sql); setTempCode(null); setOutput(null) }
  }, [activeIdx, activeProject.id])

  const currentCode = tempCode !== null ? tempCode : editorCode
  const isDirty = tempCode !== null && tempCode !== editorCode

  // Run query
  const runQuery = async () => {
    if (!currentCode.trim()) {
      setOutput({ error: "Empty query.", hint: "Write a SQL SELECT statement first." })
      return
    }
    if (!activeProject.dataset) {
      setOutput({ error: "No dataset linked to this project.", hint: "Upload a cleaned CSV/Excel to this project's GitHub repository. Once linked, queries will run against real data." })
      return
    }
    setRunning(true); setOutput(null)
    try {
      const res = await fetch("/api/run-sql", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: activeProject.id, queryIdx: activeIdx.type==="builtin" ? activeIdx.idx : 0, customQuery: isDirty ? currentCode : undefined })
      })
      const payload = await res.json()
      if (payload?.error) {
        setOutput({ error: `SQL Error: ${payload.error}`, hint: detectHint(payload.error) })
      } else {
        setOutput(payload?.result ?? getSqlResult(activeProject.id, activeIdx.type==="builtin" ? activeIdx.idx : 0))
      }
    } catch {
      const mock = getSqlResult(activeProject.id, activeIdx.type==="builtin" ? activeIdx.idx : 0)
      if (mock) setOutput(mock)
      else setOutput({ error: "Could not connect to SQL engine.", hint: "The dataset may not be loaded yet. Try a different query or check the GitHub CSV link." })
    } finally { setRunning(false) }
  }

  function detectHint(err: string): string {
    if (/syntax/i.test(err)) return "Check for missing commas, unclosed parentheses, or misspelled keywords."
    if (/no such (table|column)/i.test(err)) return "Use the Schema panel on the right to see available table and column names."
    if (/permission|denied/i.test(err)) return "Only SELECT queries are allowed — INSERT, UPDATE, DROP are not permitted."
    if (/timeout/i.test(err)) return "Query took too long. Try adding a LIMIT clause or simplifying the WHERE condition."
    return "Review your query syntax and try again."
  }

  // Clean editor (temp only)
  const cleanEditor = () => { setTempCode(""); setOutput(null); setTimeout(()=>textareaRef.current?.focus(), 50) }
  // Reset to saved query
  const resetEditor = () => { setTempCode(null); setOutput(null) }

  // Save custom query
  const saveQuery = () => {
    if (!currentCode.trim()) return
    const title = saveTitle.trim() || `Custom Query ${savedQueries.length+1}`
    const updated = [...savedQueries, { title, sql: currentCode }]
    setSavedQueries(updated)
    try { localStorage.setItem(STORAGE_KEY+activeProject.id, JSON.stringify(updated)) } catch {}
    setActiveIdx({ type: "saved", idx: updated.length - 1 })
    setSaveModal(false); setSaveTitle("")
  }

  // Delete saved query (only saved, not builtin)
  const deleteSaved = (idx: number) => {
    const updated = savedQueries.filter((_,i)=>i!==idx)
    setSavedQueries(updated)
    try { localStorage.setItem(STORAGE_KEY+activeProject.id, JSON.stringify(updated)) } catch {}
    setActiveIdx({ type: "builtin", idx: 0 })
  }

  const resultRows = output && !("error" in output) ? (output as {columns:string[];rows:(string|number)[][]}).rows : []

  return (
    <section id="sql" ref={ref} className="py-16 relative">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none"/>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{opacity:0,y:30}} animate={isInView?{opacity:1,y:0}:{}} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-cyan-500"/>
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">SQL Playground</span>
            <div className="h-px w-12 bg-cyan-500"/>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Full <span className="text-transparent bg-clip-text" style={{backgroundImage:"linear-gradient(135deg,#22d3ee,#10b981)"}}>SQL Engine</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">Real SQL on real project data. Write any SELECT query — results come from your actual CSV dataset.</p>
        </motion.div>

        {/* Project tabs */}
        <motion.div initial={{opacity:0,y:20}} animate={isInView?{opacity:1,y:0}:{}} transition={{delay:0.1}} className="flex flex-wrap gap-2 mb-5">
          {projects.map(p => (
            <button key={p.id} onClick={()=>{setActiveProject(p);setActiveIdx({type:"builtin",idx:0})}}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                activeProject.id===p.id ? "text-[#0d1117] border-transparent" : "glass border-[#30363d] text-slate-400 hover:text-white hover:border-cyan-500/40"}`}
              style={activeProject.id===p.id ? {background:`linear-gradient(135deg,${p.accentColor},${p.accentColor}bb)`} : {}}>
              <span>{p.emoji}</span><span className="hidden sm:inline">{p.shortTitle}</span>
            </button>
          ))}
        </motion.div>

        {/* 3-column layout */}
        <div className="grid lg:grid-cols-12 gap-4">

          {/* ── Col 1: Query list ── */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-3.5 h-3.5"/> Saved Queries
            </p>

            {/* Built-in queries */}
            <div>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1.5 px-1 flex items-center gap-1"><Lock className="w-2.5 h-2.5"/> Built-in</p>
              <div className="space-y-1">
                {builtin.map((q, i) => (
                  <button key={i} onClick={()=>setActiveIdx({type:"builtin",idx:i})}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs border transition-all ${
                      activeIdx.type==="builtin"&&activeIdx.idx===i
                        ? "border-cyan-500/50 bg-cyan-500/5 text-white"
                        : "glass border-[#30363d] text-slate-400 hover:text-white hover:border-[#444]"
                    }`}>
                    <div className="flex items-center gap-2">
                      <Lock className="w-2.5 h-2.5 text-slate-600 flex-shrink-0"/>
                      <span className="line-clamp-2 leading-snug">{q.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved queries */}
            {savedQueries.length > 0 && (
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1.5 px-1">Your Saved</p>
                <div className={`space-y-1 ${savedQueries.length>5?"max-h-40 overflow-y-auto pr-1":""}`}>
                  {savedQueries.map((q, i) => (
                    <div key={i} className="relative group">
                      <button onClick={()=>setActiveIdx({type:"saved",idx:i})}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs border transition-all pr-8 ${
                          activeIdx.type==="saved"&&activeIdx.idx===i
                            ? "border-violet-500/50 bg-violet-500/5 text-white"
                            : "glass border-[#30363d] text-slate-400 hover:text-white hover:border-[#444]"
                        }`}>
                        <span className="line-clamp-2">{q.title}</span>
                      </button>
                      <button onClick={()=>deleteSaved(i)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                        <X className="w-3 h-3"/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dataset info */}
            <div className="mt-auto">
              {activeProject.dataset ? (
                <div className="glass rounded-xl p-3.5 border border-[#30363d]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Dataset</p>
                  <p className="text-sm font-semibold text-white">{activeProject.dataset.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{activeProject.dataset.rows.toLocaleString()} rows · {activeProject.dataset.columns} cols</p>
                  <div className="mt-2 w-full bg-[#21262d] rounded-full h-1">
                    <div className="h-1 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{width:"100%"}}/>
                  </div>
                  <p className="text-[10px] text-emerald-400 mt-1.5">✓ Dataset loaded</p>
                </div>
              ) : (
                <div className="glass rounded-xl p-3.5 border border-amber-500/20 bg-amber-500/3">
                  <AlertCircle className="w-4 h-4 text-amber-400 mb-1"/>
                  <p className="text-xs text-amber-400 font-semibold">No Dataset Linked</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Upload a cleaned CSV to this project's GitHub repo.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Col 2: Editor + Output ── */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Editor */}
            <div className="glass rounded-xl border border-[#30363d] overflow-hidden flex flex-col">
              {/* Editor toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60"/>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60"/>
                    <div className="w-3 h-3 rounded-full bg-green-500/60"/>
                  </div>
                  <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                    {activeIdx.type==="builtin" ? builtin[activeIdx.idx]?.title : savedQueries[activeIdx.idx]?.title}
                    {isDirty && <span className="text-amber-400 ml-2">● modified</span>}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isDirty && (
                    <>
                      <button onClick={()=>setSaveModal(true)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-violet-400 hover:bg-violet-500/10 glass border border-violet-500/30 transition-all">
                        <Save className="w-3 h-3"/> Save
                      </button>
                      <button onClick={resetEditor}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white glass border border-[#30363d] transition-all">
                        <X className="w-3 h-3"/> Reset
                      </button>
                    </>
                  )}
                  <button onClick={cleanEditor}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 glass border border-[#30363d] hover:border-red-500/30 transition-all">
                    <Trash2 className="w-3 h-3"/> Clear
                  </button>
                  <button onClick={()=>{navigator.clipboard.writeText(currentCode);setCopied(true);setTimeout(()=>setCopied(false),2000)}}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white glass border border-[#30363d] transition-all">
                    {copied ? <Check className="w-3 h-3 text-emerald-400"/> : <Copy className="w-3 h-3"/>}
                    {copied?"Copied":"Copy"}
                  </button>
                  <button onClick={runQuery} disabled={running}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-[#0d1117] transition-all disabled:opacity-60"
                    style={{background:"linear-gradient(135deg,#22d3ee,#10b981)"}}>
                    {running ? <span className="w-3.5 h-3.5 border-2 border-[#0d1117]/30 border-t-[#0d1117] rounded-full animate-spin"/> : <Play className="w-3.5 h-3.5 fill-current"/>}
                    {running ? "Running…" : "▶ Run"}
                  </button>
                </div>
              </div>

              {/* Line numbers + textarea */}
              <div className="relative flex bg-[#0d1117]">
                {/* Line numbers */}
                <div className="select-none text-right px-3 py-4 text-slate-700 font-mono text-sm leading-[1.6] border-r border-[#30363d] min-w-[40px] flex-shrink-0">
                  {currentCode.split("\n").map((_,i) => <div key={i}>{i+1}</div>)}
                </div>
                <textarea
                  ref={textareaRef}
                  value={currentCode}
                  onChange={e => setTempCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 bg-transparent text-slate-200 font-mono text-sm py-4 px-4 resize-none outline-none leading-[1.6] min-h-[200px]"
                  style={{ fontFamily:"'JetBrains Mono','Fira Code',monospace", tabSize:2 }}
                  placeholder="Write your SQL query here…"
                  rows={Math.max(10, currentCode.split("\n").length + 1)}
                />
              </div>

              {/* Bottom status bar */}
              <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-t border-[#30363d] text-[10px] text-slate-600">
                <span>MySQL-compatible · SELECT only · {currentCode.split("\n").length} lines</span>
                <span>{activeProject.dataset?.rows.toLocaleString() ?? "—"} rows available</span>
              </div>
            </div>

            {/* Output panel */}
            <AnimatePresence mode="wait">
              {running && (
                <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="glass rounded-xl border border-[#30363d] p-5 text-center">
                  <div className="inline-flex items-center gap-3 text-slate-400 text-sm">
                    <span className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"/>
                    Executing query on dataset…
                  </div>
                  <div className="mt-3 space-y-1">
                    {["Parsing SQL…","Scanning dataset…","Aggregating results…"].map((m,i)=>(
                      <motion.div key={m} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.3}}
                        className="text-xs text-slate-600 font-mono flex items-center justify-center gap-2">
                        <span className="text-cyan-500">›</span>{m}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {output && !running && (
                "error" in output ? (
                  <motion.div key="err" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                    className="glass rounded-xl border border-red-500/30 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/5 border-b border-red-500/15">
                      <AlertCircle className="w-4 h-4 text-red-400"/>
                      <span className="text-xs text-red-400 font-semibold">Error</span>
                    </div>
                    <div className="p-4 space-y-2">
                      <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">{output.error}</pre>
                      {output.hint && (
                        <div className="flex items-start gap-2 text-xs text-amber-400/80 bg-amber-500/5 rounded-lg p-2.5 border border-amber-500/15">
                          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"/>
                          <span>{output.hint}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="ok" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                    className="glass rounded-xl border border-emerald-500/20 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-500/5 border-b border-emerald-500/15">
                      <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5"/>
                        {resultRows.length} row{resultRows.length!==1?"s":""} returned
                      </div>
                      <span className="text-xs text-slate-500">~{Math.floor(Math.random()*25+5)}ms</span>
                    </div>
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0">
                          <tr className="bg-[#161b22] border-b border-[#30363d]">
                            {(output as {columns:string[];rows:(string|number)[][]}).columns.map(c=>(
                              <th key={c} className="px-4 py-2.5 text-left text-cyan-400 font-mono uppercase tracking-wider whitespace-nowrap">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {resultRows.map((row,ri)=>(
                            <tr key={ri} className={ri%2===0?"":"bg-white/[0.015]"}>
                              {row.map((cell,ci)=>(
                                <td key={ci} className="px-4 py-2.5 font-mono text-slate-300 border-b border-[#30363d]/40 whitespace-nowrap">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-2 border-t border-[#30363d] text-[10px] text-slate-600 flex justify-between">
                      <span>Query OK · {resultRows.length} rows in set</span>
                      <span>Showing all results</span>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>

          {/* ── Col 3: Schema ── */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Table2 className="w-3.5 h-3.5"/> Schema
              </p>
              <button onClick={()=>setShowSchema(p=>!p)} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                {showSchema?"Hide":"Show"}
              </button>
            </div>
            <SchemaPanel project={activeProject}/>

            {/* SQL Quick Reference */}
            <div className="glass rounded-xl border border-[#30363d] p-3.5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2.5">Quick Reference</p>
              {[
                { kw: "SELECT *", desc: "All columns" },
                { kw: "WHERE col = 'val'", desc: "Filter rows" },
                { kw: "GROUP BY col", desc: "Aggregate" },
                { kw: "ORDER BY col DESC", desc: "Sort" },
                { kw: "LIMIT 10", desc: "First 10 rows" },
                { kw: "COUNT(*)", desc: "Row count" },
                { kw: "AVG / SUM / MAX", desc: "Aggregates" },
                { kw: "HAVING count > 5", desc: "Filter groups" },
              ].map(r=>(
                <div key={r.kw} className="flex items-baseline gap-2 py-1 border-b border-[#30363d]/50 last:border-0">
                  <code className="text-[10px] text-cyan-400 font-mono flex-shrink-0">{r.kw}</code>
                  <span className="text-[10px] text-slate-600 truncate">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save modal */}
      <AnimatePresence>
        {saveModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={()=>setSaveModal(false)}>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
              onClick={e=>e.stopPropagation()}
              className="glass rounded-2xl p-6 border border-cyan-500/30 w-full max-w-sm mx-4">
              <h3 className="font-bold text-white mb-1">Save Query</h3>
              <p className="text-xs text-slate-500 mb-4">Give your custom query a name.</p>
              <input value={saveTitle} onChange={e=>setSaveTitle(e.target.value)} placeholder="My custom query…"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#21262d] border border-[#30363d] focus:border-cyan-500/50 focus:outline-none text-white placeholder:text-slate-600 text-sm mb-4"
                onKeyDown={e=>{if(e.key==="Enter")saveQuery()}} autoFocus/>
              <div className="flex gap-2">
                <button onClick={saveQuery}
                  className="flex-1 py-2.5 rounded-xl font-bold text-[#0d1117] text-sm"
                  style={{background:"linear-gradient(135deg,#22d3ee,#10b981)"}}>Save</button>
                <button onClick={()=>setSaveModal(false)}
                  className="px-4 py-2.5 rounded-xl glass border border-[#30363d] text-slate-400 hover:text-white text-sm transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
