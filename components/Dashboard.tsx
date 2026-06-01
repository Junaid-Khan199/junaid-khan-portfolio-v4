"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { projects } from "@/data/projects"
import {
  Maximize2, Minimize2, X, BarChart2, TrendingUp, PieChart as PieIcon,
  Activity, Grid, Plus, Trash2, RefreshCw, Filter, ChevronDown,
  LayoutDashboard, Table2, BarChart3
} from "lucide-react"
import { LogoCorner } from "./LogoCorner"

const GITHUB_USER = "Junaid-Khan199"

const TIP = {
  contentStyle: {
    background: "#161b22", border: "1px solid #30363d",
    borderRadius: "10px", color: "#e6edf3", fontSize: "12px",
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────
type ColType = "numeric" | "categorical" | "date"
type CardType = "kpi" | "bar" | "line" | "area" | "pie" | "donut" | "table" | "scatter"

interface ColInfo { name: string; type: ColType; values: (string | number)[]; min?: number; max?: number; mean?: number; unique?: string[] }
interface DashCard {
  id: string; colName: string; cardType: CardType
  title: string; w: number; h: number
  data?: Record<string, string | number>[]; color: string
  kpiValue?: string; kpiChange?: string
  filteredBy?: { col: string; val: string }
}

// ─── Colour palette ───────────────────────────────────────────────────────────
const PALETTE = ["#22d3ee", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e", "#06b6d4", "#a78bfa", "#34d399", "#fbbf24", "#fb7185"]

// ─── Parse dataset columns from project data ──────────────────────────────────
function inferColumnsFromProject(proj: typeof projects[0]): ColInfo[] {
  const cols: ColInfo[] = []
  if (!proj.charts.length) return cols

  // Infer from chart data
  const sample = proj.charts[0].data
  if (!sample?.length) return cols

  Object.keys(sample[0]).forEach(key => {
    const vals = sample.map(r => r[key])
    const numeric = vals.every(v => typeof v === "number" || !isNaN(Number(v)))
    if (numeric) {
      const nums = vals.map(Number)
      cols.push({
        name: key, type: "numeric", values: nums,
        min: Math.min(...nums), max: Math.max(...nums),
        mean: Math.round(nums.reduce((a, b) => a + b, 0) / nums.length * 100) / 100
      })
    } else {
      const unique = [...new Set(vals.map(String))]
      cols.push({ name: key, type: "categorical", values: vals.map(String), unique })
    }
  })

  // Also add KPI-derived columns
  proj.kpis.forEach(kpi => {
    const val = parseFloat(kpi.value.replace(/[^0-9.]/g, ""))
    if (!isNaN(val) && !cols.find(c => c.name === kpi.label)) {
      cols.push({ name: kpi.label, type: "numeric", values: [val], min: 0, max: val * 1.5, mean: val })
    }
  })
  return cols
}

// ─── Build card data ───────────────────────────────────────────────────────────
function buildCardData(col: ColInfo, proj: typeof projects[0], filterCol?: string, filterVal?: string): {
  cardType: CardType; data?: Record<string, string | number>[]; kpiValue?: string; kpiChange?: string
} {
  // Find matching chart
  const matchChart = proj.charts.find(c =>
    c.xKey === col.name || c.yKeys?.some(y => y.key === col.name)
  ) ?? proj.charts[0]

  let data = matchChart?.data ?? []
  if (filterCol && filterVal) {
    data = data.filter(r => String(r[filterCol]) === filterVal)
    if (!data.length) data = matchChart?.data ?? []
  }

  if (col.type === "numeric") {
    // Check if it's a single KPI value
    if (col.values.length === 1) {
      const kpi = proj.kpis.find(k => k.label === col.name)
      return { cardType: "kpi", kpiValue: kpi?.value ?? String(col.mean), kpiChange: kpi?.change }
    }
    // Multi-value: line chart
    const xKey = matchChart?.xKey ?? "index"
    return {
      cardType: "line",
      data: data.map((r, i) => ({ ...r, [xKey]: r[xKey] ?? i }))
    }
  }

  if (col.type === "categorical") {
    // Value counts → bar/pie
    const counts: Record<string, number> = {}
    col.values.forEach(v => { counts[String(v)] = (counts[String(v)] ?? 0) + 1 })
    const chartData = Object.entries(counts).slice(0, 8).map(([name, value]) => ({ name, value }))
    return { cardType: chartData.length <= 5 ? "pie" : "bar", data: chartData }
  }

  return { cardType: "bar", data }
}

// ─── Individual card renderer ────────────────────────────────────────────────
function DashCardView({ card, onRemove, accentColor, onCategoryClick, activeCategoryFilter }: {
  card: DashCard; onRemove: (id: string) => void; accentColor: string
  onCategoryClick?: (col: string, val: string) => void; activeCategoryFilter?: { col: string; val: string } | null
}) {
  const [chartMode, setChartMode] = useState<CardType>(card.cardType)
  const modes: { m: CardType; icon: React.ReactNode }[] = [
    { m: "bar", icon: <BarChart2 className="w-3 h-3" /> },
    { m: "line", icon: <TrendingUp className="w-3 h-3" /> },
    { m: "area", icon: <Activity className="w-3 h-3" /> },
    { m: "pie", icon: <PieIcon className="w-3 h-3" /> },
    { m: "donut", icon: <PieIcon className="w-3 h-3 opacity-60" /> },
  ]

  const renderChart = () => {
    if (card.cardType === "kpi") return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-2">
        <p className="text-4xl font-black" style={{ color: card.color }}>{card.kpiValue}</p>
        {card.kpiChange && <p className={`text-xs mt-1.5 font-semibold ${card.kpiChange.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{card.kpiChange}</p>}
      </div>
    )

    if (chartMode === "pie" || chartMode === "donut") {
      const pieData = (card.data ?? []).slice(0, 8)
      return (
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={chartMode === "donut" ? 45 : 0} outerRadius={68} paddingAngle={3} dataKey="value"
              onClick={(d) => onCategoryClick?.(card.colName, d.name)}>
              {pieData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}
                style={{ cursor: onCategoryClick ? "pointer" : "default" }} />)}
            </Pie>
            <Tooltip {...TIP} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      )
    }
    if (chartMode === "line") {
      const yKeys = Object.keys(card.data?.[0] ?? {}).filter(k => k !== (card.data?.[0] ? Object.keys(card.data[0])[0] : ""))
      const xKey = card.data?.[0] ? Object.keys(card.data[0])[0] : "x"
      return (
        <ResponsiveContainer width="100%" height={170}>
          <LineChart data={card.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" opacity={0.4} />
            <XAxis dataKey={xKey} stroke="#7d8590" fontSize={10} />
            <YAxis stroke="#7d8590" fontSize={10} />
            <Tooltip {...TIP} />
            {yKeys.slice(0, 3).map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={PALETTE[i]} strokeWidth={2} dot={false} />)}
          </LineChart>
        </ResponsiveContainer>
      )
    }
    if (chartMode === "area") {
      const yKeys = Object.keys(card.data?.[0] ?? {}).filter(k => k !== (card.data?.[0] ? Object.keys(card.data[0])[0] : ""))
      const xKey = card.data?.[0] ? Object.keys(card.data[0])[0] : "x"
      return (
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={card.data}>
            <defs>{yKeys.slice(0, 3).map((k, i) => (
              <linearGradient key={k} id={`g${k}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PALETTE[i]} stopOpacity={0.25} />
                <stop offset="95%" stopColor={PALETTE[i]} stopOpacity={0} />
              </linearGradient>
            ))}</defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" opacity={0.4} />
            <XAxis dataKey={xKey} stroke="#7d8590" fontSize={10} />
            <YAxis stroke="#7d8590" fontSize={10} />
            <Tooltip {...TIP} />
            {yKeys.slice(0, 3).map((k, i) => <Area key={k} type="monotone" dataKey={k} stroke={PALETTE[i]} fill={`url(#g${k})`} strokeWidth={2} />)}
          </AreaChart>
        </ResponsiveContainer>
      )
    }
    // bar (default)
    const hasNameVal = card.data?.[0] && "name" in card.data[0] && "value" in card.data[0]
    return (
      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={card.data} onClick={(e) => {
          if (onCategoryClick && e?.activePayload?.[0]) {
            const name = e.activePayload[0].payload?.name ?? e.activePayload[0].payload?.["name"]
            if (name) onCategoryClick(card.colName, String(name))
          }
        }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" opacity={0.4} />
          <XAxis dataKey={hasNameVal ? "name" : (card.data?.[0] ? Object.keys(card.data[0])[0] : "x")} stroke="#7d8590" fontSize={10} tick={{ fontSize: 9 }} />
          <YAxis stroke="#7d8590" fontSize={10} />
          <Tooltip {...TIP} />
          <Bar dataKey={hasNameVal ? "value" : (card.data?.[0] ? Object.keys(card.data[0])[1] : "value")} fill={card.color} radius={[4, 4, 0, 0]}
            style={{ cursor: onCategoryClick ? "pointer" : "default" }} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const isKpi = card.cardType === "kpi"
  const isActive = activeCategoryFilter?.col === card.colName

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
      className={`bg-[#161b22] border rounded-2xl flex flex-col overflow-hidden transition-all ${isActive ? "border-cyan-500/60 shadow-lg shadow-cyan-500/10" : "border-[#30363d] hover:border-[#444]"}`}
      style={{ gridColumn: `span ${card.w}`, gridRow: `span ${card.h}` }}>
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#30363d] flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: card.color }} />
          <p className="text-xs font-semibold text-slate-300 truncate">{card.title}</p>
          {isActive && <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded-full flex-shrink-0">filtered</span>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!isKpi && modes.map(m => (
            <button key={m.m} onClick={() => setChartMode(m.m)}
              className={`w-5 h-5 rounded flex items-center justify-center transition-all ${chartMode === m.m ? "text-[#0d1117]" : "text-slate-600 hover:text-slate-400"}`}
              style={chartMode === m.m ? { background: card.color } : {}}>
              {m.icon}
            </button>
          ))}
          <button onClick={() => onRemove(card.id)} className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors ml-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col min-h-0">{renderChart()}</div>
    </motion.div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeProject, setActiveProject] = useState(projects[0])
  const [columns, setColumns] = useState<ColInfo[]>([])
  const [cards, setCards] = useState<DashCard[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<{ col: string; val: string } | null>(null)
  const [colFilter, setColFilter] = useState("")
  const dashRef = useRef<HTMLDivElement>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // When project changes, infer columns and build initial cards
  useEffect(() => {
    const cols = inferColumnsFromProject(activeProject)
    setColumns(cols)
    setCategoryFilter(null)
    // Auto-add first 3 cards
    const initial: DashCard[] = []
    activeProject.kpis.slice(0, 3).forEach((kpi, i) => {
      const val = parseFloat(kpi.value.replace(/[^0-9.]/g, ""))
      initial.push({
        id: `kpi-${i}`, colName: kpi.label, cardType: "kpi",
        title: kpi.label, w: 1, h: 1, color: PALETTE[i],
        kpiValue: kpi.value, kpiChange: kpi.change
      })
    })
    activeProject.charts.slice(0, 2).forEach((chart, i) => {
      initial.push({
        id: `chart-${i}`, colName: chart.xKey ?? "value", cardType: chart.type as CardType,
        title: chart.title, w: 2, h: 2, color: PALETTE[i + 3],
        data: chart.data
      })
    })
    setCards(initial)
  }, [activeProject])

  // Add card from column click
  const addCard = useCallback((col: ColInfo) => {
    if (cards.find(c => c.colName === col.name && !c.filteredBy)) return
    const { cardType, data, kpiValue, kpiChange } = buildCardData(col, activeProject, categoryFilter?.col, categoryFilter?.val)
    const id = `${col.name}-${Date.now()}`
    const isKpi = col.values.length === 1 || cardType === "kpi"
    setCards(prev => [...prev, {
      id, colName: col.name, cardType,
      title: col.type === "numeric" && isKpi ? col.name : `${col.name} distribution`,
      w: isKpi ? 1 : 2, h: isKpi ? 1 : 2,
      color: PALETTE[prev.length % PALETTE.length],
      data, kpiValue, kpiChange
    }])
  }, [cards, activeProject, categoryFilter])

  // Category click → filter whole dashboard
  const handleCategoryClick = useCallback((col: string, val: string) => {
    setCategoryFilter(prev => prev?.col === col && prev?.val === val ? null : { col, val })
    // Rebuild chart cards with filter
    setCards(prev => prev.map(card => {
      if (card.cardType === "kpi") return card
      const colInfo = columns.find(c => c.name === card.colName)
      if (!colInfo) return card
      const { data } = buildCardData(colInfo, activeProject,
        (col !== card.colName) ? col : undefined,
        (col !== card.colName) ? val : undefined)
      return { ...card, data: data ?? card.data, filteredBy: col !== card.colName ? { col, val } : undefined }
    }))
  }, [columns, activeProject])

  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      try { await dashRef.current?.requestFullscreen(); setIsFullscreen(true) } catch { setIsFullscreen(true) }
    } else {
      try { await document.exitFullscreen(); setIsFullscreen(false) } catch { setIsFullscreen(false) }
    }
  }, [isFullscreen])

  useEffect(() => {
    const h = () => { if (!document.fullscreenElement) setIsFullscreen(false) }
    document.addEventListener("fullscreenchange", h)
    return () => document.removeEventListener("fullscreenchange", h)
  }, [])

  const filteredCols = columns.filter(c => c.name.toLowerCase().includes(colFilter.toLowerCase()))

  const kpiCards = cards.filter(c => c.cardType === "kpi")
  const chartCards = cards.filter(c => c.cardType !== "kpi")

  return (
    <section id="dashboard" ref={ref} className="py-16 relative">
      <LogoCorner />
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-cyan-500" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Live Analytics</span>
            <div className="h-px w-12 bg-cyan-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Power BI–Style <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#22d3ee,#10b981)" }}>Dashboard Builder</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">Click any column on the left to add a card. Click a bar/slice to filter the whole dashboard by that category.</p>
        </motion.div>

        {/* Project selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-6">
          {projects.map(p => (
            <button key={p.id} onClick={() => setActiveProject(p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${activeProject.id === p.id ? "text-[#0d1117] border-transparent" : "glass border-[#30363d] text-slate-400 hover:text-white hover:border-cyan-500/40"
                }`}
              style={activeProject.id === p.id ? { background: `linear-gradient(135deg,${p.accentColor},${p.accentColor}bb)` } : {}}>
              <span>{p.emoji}</span><span className="hidden sm:inline">{p.shortTitle}</span>
            </button>
          ))}
        </motion.div>

        {/* Main panel */}
        <div ref={dashRef} className={`${isFullscreen ? "fixed inset-0 z-[100] bg-[#0d1117] flex flex-col p-4 overflow-hidden" : "glass rounded-2xl border border-[#30363d] overflow-hidden"}`}>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-sm text-slate-400 font-mono hidden sm:inline">{activeProject.emoji} {activeProject.shortTitle} — Dashboard</span>
              {categoryFilter && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <Filter className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-cyan-400">{categoryFilter.col}: {categoryFilter.val}</span>
                  <button onClick={() => { setCategoryFilter(null); setCards(prev => prev.map(c => ({ ...c, filteredBy: undefined }))) }}
                    className="text-slate-500 hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCards([])} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 glass border border-[#30363d] transition-all">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
              <button onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Body: sidebar + canvas */}
          <div className={`flex gap-0 ${isFullscreen ? "flex-1 min-h-0" : "h-[680px]"}`}>

            {/* ── Left sidebar: column list ── */}
            <div className="w-52 flex-shrink-0 bg-[#0d1117] border-r border-[#30363d] flex flex-col">
              <div className="px-3 py-2.5 border-b border-[#30363d]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Fields</p>
                <div className="relative">
                  <input value={colFilter} onChange={e => setColFilter(e.target.value)} placeholder="Search..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {/* Numeric fields */}
                {filteredCols.filter(c => c.type === "numeric").length > 0 && (
                  <div className="px-3 py-1.5">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1.5">📊 Measures</p>
                    {filteredCols.filter(c => c.type === "numeric").map((col, i) => {
                      const added = cards.some(c => c.colName === col.name && !c.filteredBy)
                      return (
                        <button key={col.name} onClick={() => addCard(col)} disabled={added}
                          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-xs transition-all group ${added ? "text-slate-600 cursor-default" : "text-slate-400 hover:text-white hover:bg-[#21262d] cursor-pointer"}`}>
                          <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
                          <span className="truncate">{col.name}</span>
                          {!added && <Plus className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 flex-shrink-0" />}
                          {added && <span className="ml-auto text-[9px] text-slate-600">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
                {/* Categorical fields */}
                {filteredCols.filter(c => c.type === "categorical").length > 0 && (
                  <div className="px-3 py-1.5 mt-1">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1.5">🏷️ Dimensions</p>
                    {filteredCols.filter(c => c.type === "categorical").map((col, i) => {
                      const added = cards.some(c => c.colName === col.name && !c.filteredBy)
                      return (
                        <button key={col.name} onClick={() => addCard(col)} disabled={added}
                          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-xs transition-all group ${added ? "text-slate-600 cursor-default" : "text-slate-400 hover:text-white hover:bg-[#21262d] cursor-pointer"}`}>
                          <div className="w-2 h-2 rounded-sm flex-shrink-0 border" style={{ borderColor: PALETTE[(i + 5) % PALETTE.length] }} />
                          <span className="truncate">{col.name}</span>
                          {!added && <Plus className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 flex-shrink-0" />}
                          {added && <span className="ml-auto text-[9px] text-slate-600">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
                {filteredCols.length === 0 && (
                  <p className="text-xs text-slate-600 text-center py-8 px-3">No fields found</p>
                )}
              </div>
              {/* Tip */}
              <div className="px-3 py-3 border-t border-[#30363d]">
                <p className="text-[10px] text-slate-600 leading-relaxed">💡 Click field → adds card<br />Click bar/slice → filters dashboard</p>
              </div>
            </div>

            {/* ── Canvas ── */}
            <div className="flex-1 overflow-auto bg-[#0d1117] p-4">
              {cards.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <LayoutDashboard className="w-16 h-16 text-slate-700" />
                  <div>
                    <p className="text-slate-400 font-semibold">Dashboard is empty</p>
                    <p className="text-slate-600 text-sm mt-1">Click any field on the left to add a card</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 h-full">
                  {/* KPI row */}
                  {kpiCards.length > 0 && (
                    <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${Math.min(kpiCards.length, 6)}, 1fr)` }}>
                      <AnimatePresence>
                        {kpiCards.map(card => (
                          <DashCardView key={card.id} card={card} onRemove={id => setCards(p => p.filter(c => c.id !== id))}
                            accentColor={activeProject.accentColor} onCategoryClick={handleCategoryClick} activeCategoryFilter={categoryFilter} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                  {/* Chart grid — auto-fill, responsive */}
                  {chartCards.length > 0 && (
                    <div className={`grid gap-3 ${isFullscreen ? "flex-1" : ""}`}
                      style={{
                        gridTemplateColumns: chartCards.length === 1 ? "1fr" : "repeat(4, 1fr)",
                        gridAutoRows: isFullscreen ? "1fr" : "240px",
                        flex: isFullscreen ? 1 : undefined,
                      }}>
                      <AnimatePresence>
                        {chartCards.map(card => (
                          <DashCardView key={card.id} card={card} onRemove={id => setCards(p => p.filter(c => c.id !== id))}
                            accentColor={activeProject.accentColor} onCategoryClick={handleCategoryClick} activeCategoryFilter={categoryFilter} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
