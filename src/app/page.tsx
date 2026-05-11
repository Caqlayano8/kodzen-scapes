import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getGameSettings } from "@/app/actions/admin";

export default async function HomePage() {
  const session = await getSession();
  const settings = await getGameSettings();

  return (
    <div className="min-h-screen game-gradient flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-emerald-400">{settings.gameName}</h1>
        <div className="flex gap-3">
          {session ? (
            <>
              <Link href="/oyun" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                Oyna
              </Link>
              <Link href="/profil" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                Profil
              </Link>
              {session.role === "admin" && (
                <Link href="/admin" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/giris" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                Giris Yap
              </Link>
              <Link href="/kayit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                Kayit Ol
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt={settings.gameName} className="w-32 h-32 mx-auto mb-6 rounded-2xl" />
          )}
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            {settings.gameName}
          </h2>
          <p className="text-xl text-emerald-200 mb-8">
            {settings.gameDescription}
          </p>
          <p className="text-lg text-gray-300 mb-12">
            {settings.welcomeMessage}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link
                href="/oyun"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-xl font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 animate-pulse-glow"
              >
                Oynamaya Basla
              </Link>
            ) : (
              <>
                <Link
                  href="/kayit"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-xl font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 animate-pulse-glow"
                >
                  Hemen Basla
                </Link>
                <Link
                  href="/giris"
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xl font-bold border border-gray-600 transition-all hover:scale-105"
                >
                  Giris Yap
                </Link>
              </>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="card-gradient rounded-xl p-6">
              <div className="text-4xl mb-3">🧩</div>
              <h3 className="text-lg font-bold text-white mb-2">60 Bolum</h3>
              <p className="text-gray-400 text-sm">Kolay, orta ve zor seviyelerde 60 heyecanli bolum</p>
            </div>
            <div className="card-gradient rounded-xl p-6">
              <div className="text-4xl mb-3">🌳</div>
              <h3 className="text-lg font-bold text-white mb-2">Bahce Tasarla</h3>
              <p className="text-gray-400 text-sm">Kazandigin yildizlarla bahceni guzellestir</p>
            </div>
            <div className="card-gradient rounded-xl p-6">
              <div className="text-4xl mb-3">💎</div>
              <h3 className="text-lg font-bold text-white mb-2">Kredi Kazan</h3>
              <p className="text-gray-400 text-sm">Bolumleri tamamla, reklam izle, kredi kazan</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-sm">
        {settings.gameName} &copy; 2024 - Tum haklari saklidir.
      </footer>
    </div>
  );
}
