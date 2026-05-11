import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logoutAction } from "@/app/actions/auth";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/giris");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/giris");

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.id, completed: true },
  });

  const transactions = await prisma.creditTransaction.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="min-h-screen game-gradient">
      <header className="p-4 flex justify-between items-center border-b border-gray-700/50">
        <Link href="/" className="text-xl font-bold text-emerald-400">KodZen Scapes</Link>
        <div className="flex items-center gap-3">
          <Link href="/oyun" className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
            Oyna
          </Link>
          <form action={logoutAction}>
            <button className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
              Cikis
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Profil</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-700 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-yellow-400 text-2xl mb-1">💎</div>
                <div className="text-xl font-bold text-white">{user.credits}</div>
                <div className="text-xs text-gray-400">Kredi</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-yellow-400 text-2xl mb-1">⭐</div>
                <div className="text-xl font-bold text-white">{user.totalStars}</div>
                <div className="text-xs text-gray-400">Toplam Yildiz</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-emerald-400 text-2xl mb-1">🎮</div>
                <div className="text-xl font-bold text-white">{user.currentLevel - 1}</div>
                <div className="text-xs text-gray-400">Tamamlanan</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-emerald-400 text-2xl mb-1">🌳</div>
                <div className="text-xl font-bold text-white">{user.gardenLevel}</div>
                <div className="text-xs text-gray-400">Bahce Seviye</div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Son Islemler</h3>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-sm">Henuz islem yok</p>
              ) : (
                transactions.map(t => (
                  <div key={t.id} className="flex justify-between items-center bg-gray-800 rounded-lg p-3">
                    <div>
                      <div className="text-sm text-white">{t.description || t.type}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                    <div className={`font-bold ${t.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {t.amount > 0 ? "+" : ""}{t.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
