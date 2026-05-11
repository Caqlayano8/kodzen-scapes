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
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="text-xl font-bold text-emerald-400">KodZen Scapes</Link>
          <p className="text-xs text-gray-500 mt-1">Yonetim Paneli</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {session.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm text-white font-medium">{session.name}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/oyun" className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium text-center transition-colors">
              Oyuna Git
            </Link>
            <form action={logoutAction} className="flex-1">
              <button className="w-full py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors">
                Cikis
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
