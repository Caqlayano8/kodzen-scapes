import { getCreditTransactions } from "@/app/actions/admin";

export default async function CreditsPage() {
  const transactions = await getCreditTransactions();

  const typeLabels: Record<string, string> = {
    admin_grant: "Admin Tanimi",
    ad_reward: "Reklam Odulu",
    level_spend: "Bolum Harcama",
    level_reward: "Bolum Odulu",
    daily_bonus: "Gunluk Bonus",
    purchase: "Satin Alma",
  };

  const typeColors: Record<string, string> = {
    admin_grant: "text-purple-400",
    ad_reward: "text-blue-400",
    level_spend: "text-red-400",
    level_reward: "text-emerald-400",
    daily_bonus: "text-yellow-400",
    purchase: "text-orange-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Kredi Islemleri</h1>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Kullanici</th>
                <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Tur</th>
                <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Aciklama</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Miktar</th>
                <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{t.user.name}</div>
                    <div className="text-xs text-gray-500">{t.user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${typeColors[t.type] || "text-gray-400"}`}>
                      {typeLabels[t.type] || t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{t.description || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-bold ${t.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {t.amount > 0 ? "+" : ""}{t.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">
                    {new Date(t.createdAt).toLocaleDateString("tr-TR")}{" "}
                    {new Date(t.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Henuz islem yok</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
