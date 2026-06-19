"use client"
import { useEffect, useState } from "react"
import { HistoryEntry } from "@/types"
import { getHistory, clearHistory } from "@/lib/history"
import SeverityBadge from "@/components/shared/SeverityBadge"
import { Trash2, History, Radar } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => { setHistory(getHistory()) }, [])

  const handleClear = () => { clearHistory(); setHistory([]) }

  if (history.length === 0) {
    return (
      <div className="bg-grid min-h-full p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
            <Radar size={28} className="text-orange-400" />
          </div>
          <p className="text-white font-semibold mb-2">No history yet</p>
          <p className="text-gray-500 text-sm mb-6">Your prediction history will appear here.</p>
          <Link href="/predict" className="btn-shimmer inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
            Make a Prediction
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-grid min-h-full">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History size={14} className="text-orange-400" />
              <span className="text-orange-400 text-xs uppercase tracking-widest font-semibold">Prediction Log</span>
            </div>
            <h1 className="text-2xl font-bold text-white">History</h1>
            <p className="text-gray-500 text-sm">{history.length} predictions stored locally</p>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all"
          >
            <Trash2 size={13} /> Clear All
          </button>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl border border-white/8 overflow-hidden animate-fade-in-up delay-100 opacity-0" style={{ animationFillMode: "forwards" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-white/8 bg-white/3">
                  {["Time", "Event Cause", "Type", "Location", "Corridor", "Severity", "Confidence", "Officers"].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-gray-500 text-xs uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((e, i) => (
                  <tr
                    key={e.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-gray-300 whitespace-nowrap">
                      <span className="text-xs">{new Date(e.timestamp).toLocaleDateString()}</span>
                      <br />
                      <span className="text-gray-600 text-xs">{new Date(e.timestamp).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-4 py-3.5 text-white font-medium capitalize">{e.input.event_cause.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3.5 text-gray-400 capitalize">{e.input.event_type}</td>
                    <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">
                      {e.input.latitude.toFixed(4)}, {e.input.longitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400">{e.input.corridor ?? <span className="text-gray-700">—</span>}</td>
                    <td className="px-4 py-3.5"><SeverityBadge label={e.severity_label} size="sm" /></td>
                    <td className="px-4 py-3.5 text-white font-semibold">{(e.confidence * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3.5 text-white">{e.recommendations.manpower_min}–{e.recommendations.manpower_max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
