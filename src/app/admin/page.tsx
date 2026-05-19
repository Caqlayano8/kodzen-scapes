import { getAdminStats } from "@/app/actions/admin";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Toplam Kullanici", value: stats.totalUsers, icon: "👥", href: "/admin/kullanicilar" },
    { label: "Toplam Bolum", value: stats.totalLevels, icon: "🎮", href: "/admin/bolumler" },
    { label: "Tamamlanan Bolum", value: stats.completedLevels, icon: "⭐", href: "/admin/bolumler" },
    { label: "Aktif Reklam", value: stats.activeAds, icon: "📺", href: "/admin/reklamlar" },
    { label: "Reklam Izlenme", value: stats.totalAdViews, icon: "👁️", href: "/admin/reklamlar" },
    { label: "Harcanan Kredi", value: stats.totalCreditsSpent, icon: "💰", href: "/admin/krediler" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-yellow-300 mb-6 drop-shadow-lg">📊 Yonetim Paneli</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <Link key={card.label} href={card.href} className="block">
            <div className="game-card p-5 hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-bold">{card.label}</p>
                  <p className="text-3xl font-black mt-1">{card.value.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 wood-panel flex items-center justify-center text-2xl">
                  {card.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-black text-yellow-300 mb-4 drop-shadow-lg">⚡ Hizli Islemler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link href="/admin/kullanicilar" className="game-card p-4 hover:scale-105 transition-transform text-center">
          <div className="text-3xl mb-2">➕</div>
          <div className="text-sm font-black">Kredi Tanimla</div>
        </Link>
        <Link href="/admin/reklamlar" className="game-card p-4 hover:scale-105 transition-transform text-center">
          <div className="text-3xl mb-2">📺</div>
          <div className="text-sm font-black">Reklam Ekle</div>
        </Link>
        <Link href="/admin/bolumler" className="game-card p-4 hover:scale-105 transition-transform text-center">
          <div className="text-3xl mb-2">🎮</div>
          <div className="text-sm font-black">Bolum Duzenle</div>
        </Link>
        <Link href="/admin/ayarlar" className="game-card p-4 hover:scale-105 transition-transform text-center">
          <div className="text-3xl mb-2">⚙️</div>
          <div className="text-sm font-black">Ayarlar</div>
        </Link>
      </div>
    </div>
  );
}
