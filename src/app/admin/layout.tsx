import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/giris");

  const navItems = [
    { href: "/admin", label: "Panel", icon: "📊" },
    { href: "/admin/kullanicilar", label: "Kullanicilar", icon: "👥" },
    { href: "/admin/bolumler", label: "Bolumler", icon: "🎮" },
    { href: "/admin/reklamlar", label: "Reklamlar", icon: "📺" },
    { href: "/admin/krediler", label: "Krediler", icon: "💎" },
    { href: "/admin/ayarlar", label: "Ayarlar", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-amber-950 flex">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col" style={{ background: "linear-gradient(180deg, #5c3a1e 0%, #3a2010 100%)" }}>
        <div className="p-4 border-b border-amber-800/50">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌳</span>
            <span className="text-lg font-black text-yellow-300 drop-shadow-lg">KodZen Scapes</span>
          </Link>
          <p className="text-xs text-amber-400 mt-1 font-bold">👑 Yonetim Paneli</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-amber-200 hover:text-white hover:bg-amber-800/50 rounded-xl transition-colors text-sm font-bold"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-amber-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-b from-purple-500 to-purple-700 rounded-xl border-2 border-purple-400 flex items-center justify-center text-sm font-bold text-white shadow-lg">
              {session.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm text-white font-bold">{session.name}</div>
              <div className="text-xs text-amber-400">Admin</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/oyun" className="btn-game flex-1 py-1.5 text-xs text-center">
              Oyuna Git
            </Link>
            <form action={logoutAction} className="flex-1">
              <button className="btn-red w-full py-1.5 text-xs">
                Cikis
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto" style={{ background: "linear-gradient(180deg, #4a2c14 0%, #2d1a0a 100%)" }}>
        {children}
      </main>
    </div>
  );
}
