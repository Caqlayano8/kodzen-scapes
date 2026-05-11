"use client";

import { useState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await registerAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen game-gradient flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-emerald-400">KodZen Scapes</Link>
          <p className="text-gray-400 mt-2">Yeni hesap olusturun</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ad Soyad</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Adiniz Soyadiniz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sifre</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="En az 6 karakter"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg font-bold text-lg transition-colors"
            >
              {loading ? "Kayit yapiliyor..." : "Kayit Ol"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            Zaten hesabiniz var mi?{" "}
            <Link href="/giris" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Giris Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
