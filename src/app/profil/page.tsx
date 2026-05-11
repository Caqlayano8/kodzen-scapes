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
    <div className="min-h-screen garden-sky relative">
      <div className="absolute top-6 left-[8%] w-28 h-10 bg-white/25 rounded-full blur-sm animate-float" />
      <div className="absolute top-14 right-[12%] w-32 h-11 bg-white/20 rounded-full blur-sm animate-float" style={{ animationDelay: "1.5s" }} />

      <header className="relative z-20 p-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-green-500 to-green-700 border-2 border-green-900 flex items-center justify-center text-xl shadow-lg">
              🌳
            </div>
            <span className="text-lg font-black text-white drop-shadow-lg">KodZen Scapes</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/oyun" className="btn-game px-4 py-2 text-sm">🎮 Oyna</Link>
            <Link href="/bahce" className="w-10 h-10 rounded-full bg-gradient-to-b from-green-500 to-green-700 border-2 border-green-900 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">🏡</Link>
            <form action={logoutAction}>
              <button className="btn-red px-4 py-2 text-sm">Cikis</button>
            </form>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-8 pt-4">
        {/* Player Card */}
        <div className="game-card p-6 mb-6 animate-pop-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-b from-green-500 to-green-700 rounded-2xl border-3 border-green-900 flex items-center justify-center text-4xl shadow-xl">
              🧑‍🌾
            </div>
            <div>
              <h2 className="text-2xl font-black">{user.name}</h2>
              <p className="text-amber-600 text-sm">{user.email}</p>
              <p className="text-amber-500 text-xs mt-1">Bahce Seviyesi: {user.gardenLevel}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="wood-panel p-3 text-center">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-xl font-black text-white drop-shadow-lg">{user.credits}</div>
              <div className="text-xs text-yellow-200 font-bold">Kredi</div>
            </div>
            <div className="wood-panel p-3 text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-xl font-black text-white drop-shadow-lg">{user.totalStars}</div>
              <div className="text-xs text-yellow-200 font-bold">Yildiz</div>
            </div>
            <div className="wood-panel p-3 text-center">
              <div className="text-2xl mb-1">🧩</div>
              <div className="text-xl font-black text-white drop-shadow-lg">{progress.length}</div>
              <div className="text-xs text-yellow-200 font-bold">Tamamlanan</div>
            </div>
            <div className="wood-panel p-3 text-center">
              <div className="text-2xl mb-1">🏡</div>
              <div className="text-xl font-black text-white drop-shadow-lg">{user.gardenLevel}</div>
              <div className="text-xs text-yellow-200 font-bold">Bahce</div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="game-card p-6 animate-slide-up">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">📋 Son Islemler</h3>
          <div className="space-y-2">
            {transactions.length === 0 ? (
              <p className="text-amber-600 text-sm text-center py-4">Henuz islem yok</p>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="flex justify-between items-center bg-amber-50 rounded-xl p-3 border border-amber-200">
                  <div>
                    <div className="text-sm font-bold">{t.description || t.type}</div>
                    <div className="text-xs text-amber-500">
                      {new Date(t.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                  <div className={`font-black text-lg ${t.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                    {t.amount > 0 ? "+" : ""}{t.amount} 💰
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
