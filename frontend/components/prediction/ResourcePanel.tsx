import { Recommendations } from "@/types"
import { Users, Navigation, Clock, AlertTriangle, Zap, Shield } from "lucide-react"

const Card = ({ icon: Icon, label, value, accent = "orange" }: {
  icon: any; label: string; value: string; accent?: string
}) => {
  const colors: Record<string, string> = {
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    blue:   "text-blue-400 bg-blue-500/10 border-blue-500/20",
    green:  "text-green-400 bg-green-500/10 border-green-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  }
  const cls = colors[accent] ?? colors.orange
  const [iconCls, ...rest] = cls.split(" ")

  return (
    <div className={`rounded-xl p-4 border ${rest.join(" ")} card-hover transition-all`}>
      <div className={`flex items-center gap-1.5 text-xs uppercase tracking-wide mb-2 ${iconCls}`}>
        <Icon size={12} />
        <span>{label}</span>
      </div>
      <p className="text-white font-semibold text-sm leading-snug">{value}</p>
    </div>
  )
}

export default function ResourcePanel({ rec }: { rec: Recommendations }) {
  return (
    <div className="glass rounded-2xl p-6 border border-white/8 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={15} className="text-orange-400" />
        <h3 className="text-white font-semibold">Deployment Recommendations</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card icon={Users}      label="Manpower"   value={`${rec.manpower_min}–${rec.manpower_max} officers`} accent="orange" />
        <Card icon={Clock}      label="Est. Delay" value={`~${rec.impact_minutes} min`}                        accent="blue" />
        <Card icon={Shield}     label="Barricading" value={rec.barricading}                                    accent="purple" />
        <Card icon={Navigation} label="Diversion"  value={rec.diversion}                                       accent="green" />
      </div>

      <div className="space-y-2.5">
        {rec.pre_deploy && (
          <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-3.5 flex gap-2.5 items-start animate-fade-in">
            <Zap size={13} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-blue-300 text-sm">{rec.pre_deploy}</p>
          </div>
        )}
        {rec.peak_note && (
          <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-3.5 flex gap-2.5 items-start animate-fade-in">
            <AlertTriangle size={13} className="text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-yellow-300 text-sm">{rec.peak_note}</p>
          </div>
        )}
        {rec.special_action && (
          <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-3.5 flex gap-2.5 items-start animate-fade-in">
            <AlertTriangle size={13} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm">{rec.special_action}</p>
          </div>
        )}
      </div>
    </div>
  )
}
