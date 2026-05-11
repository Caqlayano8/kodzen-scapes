"use client";

import { useState } from "react";
import { updateGameSettings } from "@/app/actions/admin";

interface Settings {
  gameName: string;
  gameDescription: string;
  logoUrl: string | null;
  initialCredits: number;
  dailyBonusCredits: number;
  adRewardCredits: number;
  adGateLevelStart: number;
  forceAdLevelStart: number;
  waitTimeMinutes: number;
  maxLives: number;
  lifeRegenMinutes: number;
  googleAdsClientId: string | null;
  googleAdsEnabled: boolean;
  maintenanceMode: boolean;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await updateGameSettings(formData);
    if (result.success) {
      setMessage("Ayarlar kaydedildi");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      {message && (
        <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}

      <form action={handleSubmit} className="space-y-8">
        {/* Genel Ayarlar */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Genel Ayarlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Oyun Adi</label>
              <input type="text" name="gameName" defaultValue={settings.gameName} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Logo URL</label>
              <input type="url" name="logoUrl" defaultValue={settings.logoUrl || ""} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Oyun Aciklamasi</label>
              <input type="text" name="gameDescription" defaultValue={settings.gameDescription} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Karsilama Mesaji</label>
              <input type="text" name="welcomeMessage" defaultValue={settings.welcomeMessage} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        {/* Renk Ayarlari */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Renk Ayarlari</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Ana Renk</label>
              <div className="flex gap-2">
                <input type="color" name="primaryColor" defaultValue={settings.primaryColor} className="w-12 h-10 bg-gray-800 border border-gray-600 rounded cursor-pointer" />
                <input type="text" defaultValue={settings.primaryColor} className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" readOnly />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Ikincil Renk</label>
              <div className="flex gap-2">
                <input type="color" name="secondaryColor" defaultValue={settings.secondaryColor} className="w-12 h-10 bg-gray-800 border border-gray-600 rounded cursor-pointer" />
                <input type="text" defaultValue={settings.secondaryColor} className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" readOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Kredi Ayarlari */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Kredi Ayarlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Baslangic Kredisi</label>
              <input type="number" name="initialCredits" defaultValue={settings.initialCredits} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <p className="text-xs text-gray-500 mt-1">Yeni kullanicilara verilen kredi</p>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Gunluk Bonus Kredi</label>
              <input type="number" name="dailyBonusCredits" defaultValue={settings.dailyBonusCredits} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <p className="text-xs text-gray-500 mt-1">Her gun verilen bonus</p>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Reklam Odul Kredisi</label>
              <input type="number" name="adRewardCredits" defaultValue={settings.adRewardCredits} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <p className="text-xs text-gray-500 mt-1">Reklam basina verilen kredi</p>
            </div>
          </div>
        </div>

        {/* Reklam/Kapi Ayarlari */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Bolum Kapisi Ayarlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Opsiyonel Kapi Baslangic</label>
              <input type="number" name="adGateLevelStart" defaultValue={settings.adGateLevelStart} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <p className="text-xs text-gray-500 mt-1">Bu bolumden sonra reklam/kredi/bekleme secenegi</p>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Zorunlu Kapi Baslangic</label>
              <input type="number" name="forceAdLevelStart" defaultValue={settings.forceAdLevelStart} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <p className="text-xs text-gray-500 mt-1">Bu bolumden sonra reklam/kredi zorunlu</p>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Bekleme Suresi (dk)</label>
              <input type="number" name="waitTimeMinutes" defaultValue={settings.waitTimeMinutes} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <p className="text-xs text-gray-500 mt-1">Opsiyonel kapida bekleme suresi</p>
            </div>
          </div>
        </div>

        {/* Can Ayarlari */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Can Sistemi</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Maksimum Can</label>
              <input type="number" name="maxLives" defaultValue={settings.maxLives} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Can Yenilenme (dk)</label>
              <input type="number" name="lifeRegenMinutes" defaultValue={settings.lifeRegenMinutes} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        {/* Google Ads */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Google Ads Entegrasyonu</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Google Ads Client ID</label>
              <input type="text" name="googleAdsClientId" defaultValue={settings.googleAdsClientId || ""} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ca-pub-xxxxxxxxxxxx" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" name="googleAdsEnabled" defaultChecked={settings.googleAdsEnabled} className="rounded" />
              Google Ads Aktif
            </label>
          </div>
        </div>

        {/* Sistem */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Sistem</h2>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="maintenanceMode" defaultChecked={settings.maintenanceMode} className="rounded" />
            Bakim Modu (Oyuncular giremez)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-xl font-bold text-lg transition-colors"
        >
          {loading ? "Kaydediliyor..." : "Tum Ayarlari Kaydet"}
        </button>
      </form>
    </div>
  );
}
