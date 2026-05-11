import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
  });

  const progressMap = new Map(progress.map(p => [p.levelId, p]));

  return (
    <div className="min-h-screen garden-sky relative">
      {/* Clouds */}
      <div className="absolute top-4 left-[5%] w-28 h-10 bg-white/25 rounded-full blur-sm animate-float" />
      <div className="absolute top-12 right-[10%] w-36 h-12 bg-white/20 rounded-full blur-sm animate-float" style={{ animationDelay: "1.5s" }} />

      {/* Top Bar */}
      <header className="relative z-20 p-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-green-500 to-green-700 border-2 border-green-900 flex items-center justify-center text-xl shadow-lg">
              🌳
            </div>
            <span className="text-lg font-black text-white drop-shadow-lg">KodZen Scapes</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="resource-badge">
              <div className="icon bg-gradient-to-b from-yellow-400 to-yellow-600">⭐</div>
              <span className="text-white font-bold text-sm">{user.totalStars}</span>
            </div>
            <div className="resource-badge">
              <div className="icon bg-gradient-to-b from-yellow-300 to-amber-500">💰</div>
              <span className="text-white font-bold text-sm">{user.credits}</span>
            </div>
            <Link href="/bahce" className="w-10 h-10 rounded-full bg-gradient-to-b from-green-500 to-green-700 border-2 border-green-900 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">
              🏡
            </Link>
            <Link href="/profil" className="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">
              ⚙️
            </Link>
          </div>
        </div>
      </header>

      {/* Level Map */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 pb-8 pt-4">
        {/* Difficulty Sections */}
        {[
          { title: "Kolay Bolumler", range: [1, 15], color: "from-green-500 to-green-600", emoji: "🌱" },
          { title: "Orta Bolumler", range: [16, 40], color: "from-yellow-500 to-orange-500", emoji: "🌿" },
          { title: "Zor Bolumler", range: [41, 60], color: "from-red-500 to-red-600", emoji: "🔥" },
        ].map(section => {
          const sectionLevels = levels.filter(
            l => l.levelNumber >= section.range[0] && l.levelNumber <= section.range[1]
          );
          if (sectionLevels.length === 0) return null;

          return (
            <div key={section.title} className="mb-8">
              <div className="wood-panel px-4 py-2 mb-4 inline-block">
                <span className="text-white font-black text-sm drop-shadow-lg">
                  {section.emoji} {section.title} ({section.range[0]}-{section.range[1]})
                </span>
              </div>

              {/* Path with level nodes */}
              <div className="relative">
                {/* Winding path background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-2 bg-amber-800/30 rounded-full" />
                </div>

                <div className="relative grid grid-cols-5 sm:grid-cols-8 gap-4 py-4">
                  {sectionLevels.map(level => {
                    const prog = progressMap.get(level.id);
                    const isCompleted = prog?.completed;
                    const isCurrent = level.levelNumber === user.currentLevel;
                    const isUnlocked = level.levelNumber <= user.currentLevel;
                    const stars = prog?.stars || 0;

                    return (
                      <div key={level.id} className="flex flex-col items-center gap-1">
                        {isUnlocked ? (
                          <Link href={`/oyun/bolum/${level.levelNumber}`}>
                            <div className={`level-node ${isCompleted ? "completed" : isCurrent ? "current" : "completed"}`}>
                              {level.levelNumber}
                            </div>
                          </Link>
                        ) : (
                          <div className="level-node locked">
                            🔒
                          </div>
                        )}
                        {/* Stars below level */}
                        {isCompleted && (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map(s => (
                              <span key={s} className={`text-xs ${stars >= s ? "star-filled" : "star-empty"}`}>⭐</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
