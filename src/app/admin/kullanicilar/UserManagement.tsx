"use client";

import { useState } from "react";
import { grantCredits, updateUserRole, deleteUser, resetUserProgress } from "@/app/actions/admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  totalStars: number;
  currentLevel: number;
  createdAt: Date;
}

export default function UserManagement({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditDesc, setCreditDesc] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleGrantCredits = async () => {
    if (!selectedUser || !creditAmount) return;
    setLoading(true);
    const result = await grantCredits(selectedUser.id, parseInt(creditAmount, 10), creditDesc);
    if (result.success) {
      showMessage(`${creditAmount} kredi ${selectedUser.name} kullanicisina tanimlandi`);
      setCreditAmount("");
      setCreditDesc("");
      setSelectedUser(null);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(true);
    await updateUserRole(userId, newRole);
    showMessage("Rol guncellendi");
    setLoading(false);
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`${name} kullanicisini silmek istediginize emin misiniz?`)) return;
    setLoading(true);
    await deleteUser(userId);
    showMessage("Kullanici silindi");
    setLoading(false);
  };

  const handleResetProgress = async (userId: string, name: string) => {
    if (!confirm(`${name} kullanicisinin ilerlemesini sifirlamak istediginize emin misiniz?`)) return;
    setLoading(true);
    await resetUserProgress(userId);
    showMessage("Ilerleme sifirlandi");
    setLoading(false);
  };

  return (
    <div>
      {message && (
        <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}

      {/* Credit Grant Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Kredi Tanimla - {selectedUser.name}</h3>
            <p className="text-sm text-gray-400 mb-4">Mevcut kredi: {selectedUser.credits}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Miktar</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={e => setCreditAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Aciklama (Opsiyonel)</label>
                <input
                  type="text"
                  value={creditDesc}
                  onChange={e => setCreditDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Hosgeldin hediyesi"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Iptal
              </button>
              <button
                onClick={handleGrantCredits}
                disabled={loading || !creditAmount}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? "..." : "Tanimla"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Kullanici</th>
                <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Rol</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Kredi</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Yildiz</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Bolum</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Kayit</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Islemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <div className="text-sm text-white font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                      className="bg-gray-800 border border-gray-600 text-white text-xs rounded-lg px-2 py-1 outline-none"
                    >
                      <option value="user">Kullanici</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-yellow-400 font-bold">{user.credits}</td>
                  <td className="px-4 py-3 text-center text-sm text-yellow-400">{user.totalStars}</td>
                  <td className="px-4 py-3 text-center text-sm text-emerald-400">{user.currentLevel}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs transition-colors"
                        title="Kredi Tanimla"
                      >
                        💎
                      </button>
                      <button
                        onClick={() => handleResetProgress(user.id, user.name)}
                        className="px-2 py-1 bg-orange-700 hover:bg-orange-600 text-white rounded text-xs transition-colors"
                        title="Ilerlemeyi Sifirla"
                      >
                        🔄
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-xs transition-colors"
                        title="Sil"
                      >
                        🗑️
                      </button>
                    </div>
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
