"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/oyun");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen garden-sky flex items-center justify-center px-4 relative">
      {/* Clouds */}
      <div className="absolute top-8 left-[10%] w-32 h-12 bg-white/30 rounded-full blur-sm animate-float" />
      <div className="absolute top-16 right-[15%] w-24 h-10 bg-white/25 rounded-full blur-sm animate-float" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-md relative z-10">
        {/* Character greeting */}
        <div className="flex items-end gap-3 mb-4">
          <div className="animate-character">
            <div className="w-16 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl border-2 border-blue-800 shadow-xl flex items-center justify-center">
              <span className="text-3xl">🧑‍🌾</span>
            </div>
          </div>
          <div className="speech-bubble flex-1 animate-slide-up">
            <p className="font-semibold text-sm">Tekrar hosgeldin! Bahcen seni bekliyor!</p>
          </div>
        </div>

        {/* Login card */}
        <div className="game-card p-8 animate-pop-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-green-500 to-green-700 border-2 border-green-900 flex items-center justify-center text-3xl shadow-lg mx-auto mb-3">
              🌳
            </div>
            <h1 className="text-2xl font-black">Giris Yap</h1>
            <p className="text-amber-700 text-sm mt-1">KodZen Scapes hesabina giris yap</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-300 rounded-xl text-red-700 text-sm font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-amber-800">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-gray-800 font-medium focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                placeholder="ornek@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-amber-800">Sifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-gray-800 font-medium focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                placeholder="••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-game w-full py-4 text-lg disabled:opacity-50"
            >
              {loading ? "Giris Yapiliyor..." : "🎮 Giris Yap"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-amber-700 text-sm">
              Hesabin yok mu?{" "}
              <Link href="/kayit" className="text-green-600 font-black hover:underline">
                Kayit Ol
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-white/70 hover:text-white text-sm font-bold">
            ← Ana Sayfaya Don
          </Link>
        </div>
      </div>
    </div>
  );
}
