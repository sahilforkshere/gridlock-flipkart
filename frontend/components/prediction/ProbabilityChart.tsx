"use client"
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { SEVERITY_COLORS } from "@/lib/severity"
import { BarChart2 } from "lucide-react"

export default function ProbabilityChart({ probs }: { probs: Record<string, number> }) {
  const data = Object.entries(probs).map(([name, value]) => ({
    name,
    value: parseFloat((value * 100).toFixed(1)),
    fill: SEVERITY_COLORS[name] ?? "#888",
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs border border-white/10">
        <p className="text-gray-400 mb-0.5">{label}</p>
        <p className="text-white font-bold">{payload[0].value}%</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-5 border border-white/8 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={14} className="text-orange-400" />
        <h3 className="text-white font-semibold">Class Probabilities</h3>
      </div>
      <ResponsiveContainer width="100%" height={175}>
        <BarChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 4 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false} tickLine={false}
            domain={[0, 100]} unit="%"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" radius={[6, 6, 2, 2]} maxBarSize={48}>
            {data.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v: any) => Number(v) > 5 ? `${v}%` : ""}
              style={{ fill: "#9ca3af", fontSize: 10 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
