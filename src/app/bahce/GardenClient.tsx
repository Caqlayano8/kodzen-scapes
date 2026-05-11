"use client";

import { useState } from "react";

interface GardenItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  cost: number;
  unlockLevel: number;
}

interface UserItem {
  id: string;
  itemId: string;
  name: string;
  category: string;
  posX: number;
  posY: number;
  placed: boolean;
}

interface GardenClientProps {
  totalStars: number;
  gardenItems: GardenItem[];
  userItems: UserItem[];
  userId: string;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  flower: "🌸",
  tree: "🌳",
  fountain: "⛲",
  bench: "🪑",
  statue: "🗿",
  path: "🛤️",
  light: "💡",
};

export default function GardenClient({ totalStars, gardenItems, userItems, userId }: GardenClientProps) {
  const [ownedItems, setOwnedItems] = useState(userItems);
  const [starsLeft, setStarsLeft] = useState(totalStars - userItems.reduce((sum, item) => {
    const gardenItem = gardenItems.find(g => g.id === item.itemId);
    return sum + (gardenItem?.cost || 0);
  }, 0));
  const [message, setMessage] = useState("");

  const handleBuy = async (item: GardenItem) => {
    if (starsLeft < item.cost) {
      setMessage("Yetersiz yildiz!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    try {
      const res = await fetch("/api/game/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, userId }),
      });
      const data = await res.json();
      if (data.success) {
        setOwnedItems(prev => [...prev, {
          id: data.id,
          itemId: item.id,
          name: item.name,
          category: item.category,
          posX: 0,
          posY: 0,
          placed: true,
        }]);
        setStarsLeft(prev => prev - item.cost);
        setMessage(`${item.name} bahceye eklendi!`);
      } else {
        setMessage(data.error || "Hata olustu");
      }
    } catch {
      setMessage("Bir hata olustu");
    }
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Bahcem</h2>
        <div className="text-gray-400">Kullanilabilir Yildiz: <span className="text-yellow-400 font-bold">{Math.max(0, starsLeft)}</span></div>
      </div>

      {message && (
        <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}

      {/* Garden View */}
      <div className="bg-gradient-to-b from-emerald-900/40 to-emerald-950/40 rounded-2xl p-6 border border-emerald-500/20 mb-8 min-h-[300px]">
        <h3 className="text-lg font-bold text-white mb-4">Bahce Gorunumu</h3>
        {ownedItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-400">Bahceniz bos! Asagidan esya satin alin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
            {ownedItems.map(item => (
              <div key={item.id} className="bg-emerald-800/30 rounded-xl p-3 text-center border border-emerald-500/20">
                <div className="text-3xl mb-1">{CATEGORY_EMOJIS[item.category] || "🌿"}</div>
                <div className="text-xs text-emerald-200 truncate">{item.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shop */}
      <h3 className="text-xl font-bold text-white mb-4">Bahce Dukkani</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {gardenItems.map(item => {
          const owned = ownedItems.some(o => o.itemId === item.id);
          const canAfford = starsLeft >= item.cost;

          return (
            <div key={item.id} className="bg-gray-900/80 rounded-xl p-4 border border-gray-700 text-center">
              <div className="text-4xl mb-2">{CATEGORY_EMOJIS[item.category] || "🌿"}</div>
              <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
              <div className="text-yellow-400 text-sm mb-3">⭐ {item.cost}</div>
              {owned ? (
                <span className="text-emerald-400 text-xs font-medium">Sahipsiniz</span>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                  className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${
                    canAfford
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Satin Al
                </button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
