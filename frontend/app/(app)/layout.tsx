import Navbar from "@/components/shared/Navbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-app className="min-h-screen bg-[#09090b] text-[#e4e4e7]">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
