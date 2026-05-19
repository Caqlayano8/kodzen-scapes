import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getGameSettings } from "@/app/actions/admin";

export default async function HomePage() {
  const session = await getSession();
  const settings = await getGameSettings();

  return (
    <div className="min-h-screen garden-sky relative overflow-hidden">
      {/* Clouds */}
      <div className="absolute top-8 left-[10%] w-32 h-12 bg-white/30 rounded-full blur-sm animate-float" />
      <div className="absolute top-16 right-[15%] w-24 h-10 bg-white/25 rounded-full blur-sm animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-6 left-[50%] w-40 h-14 bg-white/20 rounded-full blur-sm animate-float" style={{ animationDelay: "2s" }} />

      {/* Top Bar */}
      <header className="relative z-20 p-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-green-500 to-green-700 border-2 border-green-900 flex items-center justify-center text-2xl shadow-lg">
              🌳
            </div>
            <span className="text-xl font-black text-white drop-shadow-lg">{settings.gameName}</span>
          </div>

          {session ? (
            <div className="flex items-center gap-3">
              {/* Stars */}
              <div className="resource-badge">
                <div className="icon bg-gradient-to-b from-yellow-400 to-yellow-600">⭐</div>
                <span className="text-white font-bold text-sm">0</span>
              </div>
              {/* Coins */}
              <div className="resource-badge">
                <div className="icon bg-gradient-to-b from-yellow-300 to-amber-500">💰</div>
                <span className="text-white font-bold text-sm">100</span>
              </div>
              {/* Settings */}
              <Link href="/profil" className="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">
                ⚙️
              </Link>
              {session.role === "admin" && (
                <Link href="/admin" className="w-10 h-10 rounded-full bg-gradient-to-b from-purple-500 to-purple-700 border-2 border-purple-400 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">
                  👑
                </Link>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/giris" className="btn-game px-5 py-2 text-sm">Giris Yap</Link>
              <Link href="/kayit" className="btn-gold px-5 py-2 text-sm">Kayit Ol</Link>
            </div>
          )}
        </div>
      </header>

      {/* Garden Scene */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-4 pb-8" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Garden Area - Isometric Feel */}
        <div className="relative w-full max-w-2xl">
          {/* Garden Ground */}
          <div className="relative bg-gradient-to-b from-green-600/80 to-green-800/80 rounded-3xl p-6 border-4 border-green-900/50 shadow-2xl overflow-hidden">
            {/* Grass texture overlay */}
            <div className="absolute inset-0 grass-pattern opacity-30" />
            
            {/* Fence top */}
            <div className="absolute top-0 left-4 right-4 garden-fence" />

            {/* Garden Items */}
            <div className="relative grid grid-cols-5 gap-3 mb-6 min-h-[200px]">
              {/* Fountain */}
              <div className="col-span-1 col-start-3 flex flex-col items-center justify-center">
                <div className="text-5xl animate-float">⛲</div>
                <div className="w-12 h-2 bg-blue-400/30 rounded-full mt-1 blur-sm" />
              </div>
              {/* Trees */}
              <div className="col-start-1 row-start-1 flex items-end justify-center">
                <div className="text-4xl">🌳</div>
              </div>
              <div className="col-start-5 row-start-1 flex items-end justify-center">
                <div className="text-4xl">🌲</div>
              </div>
              {/* Flowers */}
              <div className="col-start-2 row-start-2 flex items-center justify-center">
                <div className="text-3xl">🌸</div>
              </div>
              <div className="col-start-4 row-start-2 flex items-center justify-center">
                <div className="text-3xl">🌷</div>
              </div>
              {/* Benches */}
              <div className="col-start-1 row-start-2 flex items-center justify-center">
                <div className="text-2xl">🪑</div>
              </div>
              <div className="col-start-5 row-start-2 flex items-center justify-center">
                <div className="text-2xl">🪑</div>
              </div>
              {/* Path stones */}
              <div className="col-span-3 col-start-2 row-start-3 flex items-center justify-center gap-4">
                <div className="w-8 h-4 bg-stone-400/40 rounded-full" />
                <div className="w-10 h-5 bg-stone-400/50 rounded-full" />
                <div className="w-8 h-4 bg-stone-400/40 rounded-full" />
              </div>
              {/* Lights */}
              <div className="col-start-1 row-start-3 flex items-center justify-center">
                <div className="text-2xl">💡</div>
              </div>
              <div className="col-start-5 row-start-3 flex items-center justify-center">
                <div className="text-2xl">💡</div>
              </div>
            </div>

            {/* Character + Speech Bubble */}
            <div className="relative flex items-end gap-4 mt-2">
              {/* Character (Austin-like) */}
              <div className="animate-character flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl border-3 border-blue-800 shadow-xl flex items-center justify-center overflow-hidden relative">
                  <div className="text-4xl">🧑‍🌾</div>
                </div>
              </div>

              {/* Speech Bubble */}
              <div className="speech-bubble flex-1 animate-slide-up">
                <p className="font-semibold">{settings.welcomeMessage}</p>
                <p className="text-sm text-gray-500 mt-1">Bulmaca coz, bahceni guzellestir!</p>
              </div>
            </div>
          </div>

          {/* Task Card */}
          <div className="task-card p-4 mt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-2xl border-2 border-orange-700 shadow-md">
                📋
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Gorevler</h3>
                <p className="text-sm text-amber-800">Bulmaca cozerek yildiz kazan ve bahceni yenile!</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="font-bold text-lg">0/3</span>
              </div>
            </div>
          </div>

          {/* Play Button */}
          <div className="flex justify-center mt-6">
            {session ? (
              <Link href="/oyun" className="btn-game px-12 py-4 text-xl animate-pulse-glow">
                🎮 Oyna!
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Link href="/kayit" className="btn-game px-12 py-4 text-xl animate-pulse-glow">
                  🎮 Hemen Basla!
                </Link>
                <p className="text-white/70 text-sm">
                  Zaten hesabin var mi?{" "}
                  <Link href="/giris" className="text-yellow-300 underline font-bold">Giris Yap</Link>
                </p>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            <div className="game-card p-3 text-center animate-pop-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-3xl mb-2">🧩</div>
              <h4 className="font-bold text-sm">60 Bolum</h4>
              <p className="text-xs text-amber-700">Kolay, Orta, Zor</p>
            </div>
            <div className="game-card p-3 text-center animate-pop-in" style={{ animationDelay: "0.5s" }}>
              <div className="text-3xl mb-2">🌳</div>
              <h4 className="font-bold text-sm">Bahce Tasarla</h4>
              <p className="text-xs text-amber-700">Esyalar & Dekor</p>
            </div>
            <div className="game-card p-3 text-center animate-pop-in" style={{ animationDelay: "0.6s" }}>
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-bold text-sm">Kredi Kazan</h4>
              <p className="text-xs text-amber-700">Odul & Bonuslar</p>
            </div>
          </div>

          {/* New Features Row */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="game-card p-3 text-center animate-pop-in" style={{ animationDelay: "0.7s" }}>
              <div className="text-3xl mb-2">🐱</div>
              <h4 className="font-bold text-sm">Hayvanlar</h4>
              <p className="text-xs text-amber-700">Sev & Besle</p>
            </div>
            <div className="game-card p-3 text-center animate-pop-in" style={{ animationDelay: "0.8s" }}>
              <div className="text-3xl mb-2">🎮</div>
              <h4 className="font-bold text-sm">Mini Oyunlar</h4>
              <p className="text-xs text-amber-700">Balik & Hazine</p>
            </div>
            <div className="game-card p-3 text-center animate-pop-in" style={{ animationDelay: "0.9s" }}>
              <div className="text-3xl mb-2">🌙</div>
              <h4 className="font-bold text-sm">Canli Dunya</h4>
              <p className="text-xs text-amber-700">Gunduz & Gece</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
