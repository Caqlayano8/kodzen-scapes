import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logoutAction } from "@/app/actions/auth";

export default async function GamePage() {
  const session = await getSession();
  if (!session) redirect("/giris");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/giris");

  const levels = await prisma.gameLevel.findMany({
    where: { isActive: true },
    orderBy: { levelNumber: "asc" },
  });

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.id },
    include: { level: true },
  });

  const progressMap = new Map(progress.map(p => [p.level.levelNumber, p]));

  return (
    <div className="min-h-screen game-gradient">
      {/* Top Bar */}
      <header className="p-4 flex justify-between items-center border-b border-gray-700/50">
        <Link href="/" className="text-xl font-bold text-emerald-400">KodZen Scapes</Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-1.5 rounded-lg">
            <span className="text-yellow-400">💎</span>
            <span className="text-white font-bold">{user.credits}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-1.5 rounded-lg">
            <span className="text-yellow-400">⭐</span>
            <span className="text-white font-bold">{user.totalStars}</span>
          </div>
          <Link href="/bahce" className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
            Bahce
          </Link>
          <Link href="/profil" className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
            {user.name}
          </Link>
          <form action={logoutAction}>
            <button className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
              Cikis
            </button>
          </form>
        </div>
      </header>

      {/* Level Grid */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Bolumler</h2>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {levels.map((level) => {
            const prog = progressMap.get(level.levelNumber);
            const isUnlocked = level.levelNumber <= user.currentLevel;
            const isCompleted = prog?.completed;
            const stars = prog?.stars || 0;

            let bgClass = "bg-gray-800 border-gray-700";
            if (isCompleted) {
              bgClass = "bg-emerald-900/50 border-emerald-500/50";
            } else if (isUnlocked) {
              bgClass = "bg-gray-700 border-emerald-400/50";
            }

            const diffColor = level.difficulty === "easy" ? "text-green-400" : level.difficulty === "medium" ? "text-yellow-400" : "text-red-400";

            return (
              <div key={level.id} className="relative">
                {isUnlocked ? (
                  <Link
                    href={`/oyun/bolum/${level.levelNumber}`}
                    className={`block w-full aspect-square rounded-xl border-2 ${bgClass} flex flex-col items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg`}
                  >
                    <span className={`text-lg font-bold ${isCompleted ? "text-emerald-300" : "text-white"}`}>
                      {level.levelNumber}
                    </span>
                    {isCompleted && (
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3].map(s => (
                          <span key={s} className={`text-xs ${stars >= s ? "text-yellow-400" : "text-gray-600"}`}>⭐</span>
                        ))}
                      </div>
                    )}
                    {!isCompleted && level.requiresAd && (
                      <span className="text-xs text-orange-400 mt-1">🔒</span>
                    )}
                  </Link>
                ) : (
                  <div className={`w-full aspect-square rounded-xl border-2 ${bgClass} flex flex-col items-center justify-center opacity-50`}>
                    <span className="text-lg font-bold text-gray-500">{level.levelNumber}</span>
                    <span className="text-xs text-gray-600">🔒</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
