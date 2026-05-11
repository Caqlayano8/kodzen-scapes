import { getAdminStats } from "@/app/actions/admin";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Toplam Kullanici", value: stats.totalUsers, icon: "👥", color: "bg-blue-600", href: "/admin/kullanicilar" },
    { label: "Toplam Bolum", value: stats.totalLevels, icon: "🎮", color: "bg-emerald-600", href: "/admin/bolumler" },
    { label: "Tamamlanan Bolum", value: stats.completedLevels, icon: "✅", color: "bg-green-600", href: "/admin/bolumler" },
    { label: "Aktif Reklam", value: stats.activeAds, icon: "📺", color: "bg-purple-600", href: "/admin/reklamlar" },
    { label: "Reklam Izlenme", value: stats.totalAdViews, icon: "👁️", color: "bg-orange-600", href: "/admin/reklamlar" },
    { label: "Harcanan Kredi", value: stats.totalCreditsSpent, icon: "💎", color: "bg-pink-600", href: "/admin/krediler" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Yonetim Paneli</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <Link key={card.label} href={card.href} className="block">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{card.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{card.value.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold text-white mb-4">Hizli Islemler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link href="/admin/kullanicilar" className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-500/50 transition-colors text-center">
          <div className="text-2xl mb-2">➕</div>
          <div className="text-sm text-white font-medium">Kredi Tanimla</div>
        </Link>
        <Link href="/admin/reklamlar" className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-500/50 transition-colors text-center">
          <div className="text-2xl mb-2">📺</div>
          <div className="text-sm text-white font-medium">Reklam Ekle</div>
        </Link>
        <Link href="/admin/bolumler" className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-500/50 transition-colors text-center">
          <div className="text-2xl mb-2">🎮</div>
          <div className="text-sm text-white font-medium">Bolum Duzenle</div>
        </Link>
        <Link href="/admin/ayarlar" className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-500/50 transition-colors text-center">
          <div className="text-2xl mb-2">⚙️</div>
          <div className="text-sm text-white font-medium">Ayarlar</div>
        </Link>
      </div>
    </div>
  );
}
