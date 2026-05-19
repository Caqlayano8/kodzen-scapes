"use client";

import { useState } from "react";
import { createAd, updateAd, deleteAd } from "@/app/actions/admin";

interface Ad {
  id: string;
  name: string;
  adType: string;
  provider: string;
  adUnitId: string | null;
  customVideoUrl: string | null;
  customImageUrl: string | null;
  customLinkUrl: string | null;
  rewardCredits: number;
  isActive: boolean;
  placement: string;
  views: number;
  clicks: number;
}

export default function AdManagement({ ads }: { ads: Ad[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCreate = async (formData: FormData) => {
    setLoading(true);
    const result = await createAd(formData);
    if (result.success) {
      showMessage("Reklam eklendi");
      setShowForm(false);
    }
    setLoading(false);
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingAd) return;
    setLoading(true);
    const result = await updateAd(editingAd.id, formData);
    if (result.success) {
      showMessage("Reklam guncellendi");
      setEditingAd(null);
    }
    setLoading(false);
  };

  const handleDelete = async (adId: string, name: string) => {
    if (!confirm(`"${name}" reklamini silmek istediginize emin misiniz?`)) return;
    await deleteAd(adId);
    showMessage("Reklam silindi");
  };

  const AdForm = ({ ad, onSubmit, onCancel }: { ad?: Ad; onSubmit: (fd: FormData) => void; onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-gray-700 my-8">
        <h3 className="text-lg font-bold text-white mb-4">{ad ? "Reklam Duzenle" : "Yeni Reklam"}</h3>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Reklam Adi</label>
            <input type="text" name="name" defaultValue={ad?.name} required className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Reklam Turu</label>
              <select name="adType" defaultValue={ad?.adType || "video"} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none">
                <option value="banner">Banner</option>
                <option value="video">Video</option>
                <option value="interstitial">Tam Ekran</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Saglayici</label>
              <select name="provider" defaultValue={ad?.provider || "google"} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none">
                <option value="google">Google Ads</option>
                <option value="custom">Ozel</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Google Ad Unit ID</label>
            <input type="text" name="adUnitId" defaultValue={ad?.adUnitId || ""} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" placeholder="ca-app-pub-xxxx/yyyy" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Ozel Video URL</label>
            <input type="url" name="customVideoUrl" defaultValue={ad?.customVideoUrl || ""} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Ozel Gorsel URL</label>
            <input type="url" name="customImageUrl" defaultValue={ad?.customImageUrl || ""} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Link URL</label>
            <input type="url" name="customLinkUrl" defaultValue={ad?.customLinkUrl || ""} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Odul Kredi</label>
              <input type="number" name="rewardCredits" defaultValue={ad?.rewardCredits || 10} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Yerlesim</label>
              <select name="placement" defaultValue={ad?.placement || "level_gate"} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none">
                <option value="level_gate">Bolum Kapisi</option>
                <option value="bonus_reward">Bonus Odul</option>
                <option value="shop">Magaza</option>
                <option value="between_levels">Bolumler Arasi</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="isActive" defaultChecked={ad?.isActive ?? true} className="rounded" />
            Aktif
          </label>

          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
              Iptal
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors">
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      {message && (
        <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
      >
        + Yeni Reklam Ekle
      </button>

      {showForm && <AdForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      {editingAd && <AdForm ad={editingAd} onSubmit={handleUpdate} onCancel={() => setEditingAd(null)} />}

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Reklam</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Tur</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Saglayici</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Yerlesim</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Odul</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Izlenme</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Durum</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Islem</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => (
                <tr key={ad.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <div className="text-sm text-white font-medium">{ad.name}</div>
                    {ad.adUnitId && <div className="text-xs text-gray-500">{ad.adUnitId}</div>}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-300">{ad.adType}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-300">{ad.provider}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-300">{ad.placement}</td>
                  <td className="px-4 py-3 text-center text-sm text-yellow-400">{ad.rewardCredits}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-300">{ad.views}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${ad.isActive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                      {ad.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <button onClick={() => setEditingAd(ad)} className="px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs transition-colors">
                        Duzenle
                      </button>
                      <button onClick={() => handleDelete(ad.id, ad.name)} className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-xs transition-colors">
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ads.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Henuz reklam eklenmemis</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
