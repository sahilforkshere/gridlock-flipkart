"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  IconLayoutDashboard,
  IconScanEye,
  IconHistory,
  IconChartBar,
} from "@tabler/icons-react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/predict", label: "Predict", icon: IconScanEye },
  { href: "/history", label: "History", icon: IconHistory },
  { href: "/model", label: "Model", icon: IconChartBar },
]

export default function Navbar() {
  const path = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/dashboard") return path === "/dashboard"
    return path === href || path.startsWith(href + "/")
  }

  return (
    <>
      {/* Desktop header */}
      <div className="sticky top-4 z-50 flex justify-center px-4 md:px-6 mb-6 pointer-events-none w-full">
        <header
          className="pointer-events-auto flex items-center justify-between px-5 h-[52px] w-full max-w-5xl rounded-full border border-[var(--border-subtle)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            background: scrolled ? "rgba(21, 23, 27, 0.85)" : "rgba(21, 23, 27, 0.65)",
          }}
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--data-live)] shadow-[0_0_8px_rgba(45,212,212,0.6)]" />
              <span className="text-[var(--text-primary)] font-semibold text-[15px] tracking-tight">ASTRAM</span>

            </div>
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1.5 bg-black/20 p-1 rounded-full border border-white/[0.04]">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200
                    ${active
                      ? "text-[var(--text-primary)] bg-[var(--bg-elevated-2)] shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated-2)]"
                    }`}
                >
                  <Icon size={15} stroke={active ? 2 : 1.75} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </header>
      </div>

      {/* Mobile bottom tab bar — visible only on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-elevated)]/90 backdrop-blur-md border-t border-[var(--border-subtle)] flex">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors
                ${active ? "text-[var(--accent-signal)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
            >
              <Icon size={20} stroke={active ? 2 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Spacer so mobile content isn't hidden behind the tab bar */}
      <div className="md:hidden h-[60px]" aria-hidden />
    </>
  )
}
