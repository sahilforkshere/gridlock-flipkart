import Navbar from "@/components/shared/Navbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-app className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
