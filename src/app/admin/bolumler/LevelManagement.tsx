"use client";

import { useState } from "react";
import { updateLevel } from "@/app/actions/admin";

interface Level {
  id: string;
  levelNumber: number;
  difficulty: string;
  gridRows: number;
  gridCols: number;
  moves: number;
  targetScore: number;
  gemTypes: number;
  starThresholds: string;
  hasBlockers: boolean;
  blockerCount: number;
  requiresAd: boolean;
  requiresCredit: boolean;
  waitTimeMinutes: number;
  creditCost: number;
  isActive: boolean;
}

export default function LevelManagement({ levels }: { levels: Level[] }) {
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredLevels = filter === "all" ? levels : levels.filter(l => l.difficulty === filter);

  const handleSave = async (formData: FormData) => {
    if (!editingLevel) return;
    setLoading(true);
    const result = await updateLevel(editingLevel.id, formData);
    if (result.success) {
      setMessage("Bolum guncellendi");
      setEditingLevel(null);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const diffColors: Record<string, string> = {
    easy: "text-green-400 bg-green-900/30",
    medium: "text-yellow-400 bg-yellow-900/30",
    hard: "text-red-400 bg-red-900/30",
  };

  return (
    <div>
      {message && (
        <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {["all", "easy", "medium", "hard"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {f === "all" ? "Tumunu" : f === "easy" ? "Kolay" : f === "medium" ? "Orta" : "Zor"}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editingLevel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-gray-700 my-8">
            <h3 className="text-lg font-bold text-white mb-4">Bolum {editingLevel.levelNumber} Duzenle</h3>
            <form action={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Zorluk</label>
                  <select name="difficulty" defaultValue={editingLevel.difficulty} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none">
                    <option value="easy">Kolay</option>
                    <option value="medium">Orta</option>
                    <option value="hard">Zor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Hamle</label>
                  <input type="number" name="moves" defaultValue={editingLevel.moves} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Hedef Skor</label>
                  <input type="number" name="targetScore" defaultValue={editingLevel.targetScore} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tas Turu Sayisi</label>
                  <input type="number" name="gemTypes" defaultValue={editingLevel.gemTypes} min="3" max="7" className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Izgara Satir</label>
                  <input type="number" name="gridRows" defaultValue={editingLevel.gridRows} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Izgara Sutun</label>
                  <input type="number" name="gridCols" defaultValue={editingLevel.gridCols} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Engel Sayisi</label>
                  <input type="number" name="blockerCount" defaultValue={editingLevel.blockerCount} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Kredi Maliyeti</label>
                  <input type="number" name="creditCost" defaultValue={editingLevel.creditCost} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Bekleme (dk)</label>
                  <input type="number" name="waitTimeMinutes" defaultValue={editingLevel.waitTimeMinutes} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Yildiz Esikleri</label>
                  <input type="text" name="starThresholds" defaultValue={editingLevel.starThresholds} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none" placeholder="1000,2000,3000" />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" name="hasBlockers" defaultChecked={editingLevel.hasBlockers} className="rounded" />
                  Engeller
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" name="requiresAd" defaultChecked={editingLevel.requiresAd} className="rounded" />
                  Reklam Gerekli
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" name="requiresCredit" defaultChecked={editingLevel.requiresCredit} className="rounded" />
                  Kredi Gerekli
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" name="isActive" defaultChecked={editingLevel.isActive} className="rounded" />
                  Aktif
                </label>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setEditingLevel(null)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                  Iptal
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Levels Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">#</th>
                <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Zorluk</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Hamle</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Hedef</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Tas</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Engel</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Reklam</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Kredi</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Durum</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Islem</th>
              </tr>
            </thead>
            <tbody>
              {filteredLevels.map(level => (
                <tr key={level.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-sm text-white font-bold">{level.levelNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${diffColors[level.difficulty] || ""}`}>
                      {level.difficulty === "easy" ? "Kolay" : level.difficulty === "medium" ? "Orta" : "Zor"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-300">{level.moves}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-300">{level.targetScore.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-300">{level.gemTypes}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-300">{level.hasBlockers ? level.blockerCount : "-"}</td>
                  <td className="px-4 py-3 text-center text-sm">{level.requiresAd ? <span className="text-orange-400">Evet</span> : <span className="text-gray-600">-</span>}</td>
                  <td className="px-4 py-3 text-center text-sm">{level.requiresCredit ? <span className="text-purple-400">{level.creditCost}</span> : <span className="text-gray-600">-</span>}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${level.isActive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                      {level.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setEditingLevel(level)}
                      className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs transition-colors"
                    >
                      Duzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
