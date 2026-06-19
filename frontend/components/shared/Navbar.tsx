"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Radar, History, Zap } from "lucide-react"

const links = [
  { href: "/",        label: "Dashboard", icon: LayoutDashboard },
  { href: "/predict", label: "Predict",   icon: Radar },
  { href: "/history", label: "History",   icon: History },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-white/10 px-4 sm:px-8 h-[60px] flex items-center justify-between">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30">
          <Zap size={16} className="text-orange-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-500 animate-live-pulse" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-white text-sm tracking-tight">ASTRAM Gridlock</span>
          <span className="hidden sm:block text-[10px] text-orange-400/70 tracking-widest uppercase">Bengaluru Traffic Intel</span>
        </div>
      </Link>

      {/* Links */}
      <div className="flex gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${active
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/25"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
