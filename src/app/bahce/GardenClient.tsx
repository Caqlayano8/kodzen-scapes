"use client";

import { useState } from "react";
import Link from "next/link";

interface GardenItem {
  id: string;
  name: string;
  emoji: string;
  starsRequired: number;
  category: string;
}

interface PlacedItem {
  id: string;
  itemId: string;
  gridX: number;
  gridY: number;
}

interface GardenClientProps {
  items: GardenItem[];
  placedItems: PlacedItem[];
  userStars: number;
  userCredits: number;
}

const GRID_COLS = 8;
const GRID_ROWS = 6;

export default function GardenClient({ items, placedItems: initialPlaced, userStars, userCredits }: GardenClientProps) {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(initialPlaced);
  const [selectedItem, setSelectedItem] = useState<GardenItem | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [showCharDialog, setShowCharDialog] = useState(true);

  const dialogMessages = [
    "Hosgeldin! Bahcemiz cok guzel olacak!",
    "Yildiz kazanarak yeni esyalar ac!",
    "Bulmaca cozerek bahceni guzellestir!",
  ];
  const [dialogIndex] = useState(Math.floor(Math.random() * dialogMessages.length));

  const handlePlaceItem = async (gridX: number, gridY: number) => {
    if (!selectedItem) return;
    const existing = placedItems.find(p => p.gridX === gridX && p.gridY === gridY);
    if (existing) return;

    try {
      const res = await fetch("/api/game/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: selectedItem.id, gridX, gridY }),
      });
      const data = await res.json();
      if (data.id) {
        setPlacedItems(prev => [...prev, { id: data.id, itemId: selectedItem.id, gridX, gridY }]);
      }
    } catch (err) {
      console.error(err);
    }
    setSelectedItem(null);
  };

  const getItemEmoji = (itemId: string) => {
    return items.find(i => i.id === itemId)?.emoji || "❓";
  };

  return (
    <div className="min-h-screen garden-sky relative">
      {/* Clouds */}
      <div className="absolute top-6 left-[8%] w-28 h-10 bg-white/25 rounded-full blur-sm animate-float" />
      <div className="absolute top-14 right-[12%] w-32 h-11 bg-white/20 rounded-full blur-sm animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-10 left-[45%] w-24 h-9 bg-white/15 rounded-full blur-sm animate-float" style={{ animationDelay: "0.8s" }} />

      {/* Top Bar */}
      <header className="relative z-20 p-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/oyun" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">
              ←
            </div>
            <span className="text-lg font-black text-white drop-shadow-lg">Bahcem</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="resource-badge">
              <div className="icon bg-gradient-to-b from-yellow-400 to-yellow-600">⭐</div>
              <span className="text-white font-bold text-sm">{userStars}</span>
            </div>
            <div className="resource-badge">
              <div className="icon bg-gradient-to-b from-yellow-300 to-amber-500">💰</div>
              <span className="text-white font-bold text-sm">{userCredits}</span>
            </div>
            <button
              onClick={() => setShowShop(!showShop)}
              className="w-10 h-10 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 border-2 border-orange-700 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform"
            >
              🛒
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-8">
        {/* Garden View */}
        <div className="relative bg-gradient-to-b from-green-500/70 to-green-700/70 rounded-3xl p-4 border-4 border-green-900/50 shadow-2xl overflow-hidden mt-4">
          {/* Grass texture */}
          <div className="absolute inset-0 grass-pattern opacity-30" />
          
          {/* Fence */}
          <div className="absolute top-0 left-4 right-4 garden-fence" />
          <div className="absolute bottom-0 left-4 right-4 garden-fence" />

          {/* Garden Grid */}
          <div className="relative grid gap-1 p-2" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
            {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, idx) => {
              const gridX = idx % GRID_COLS;
              const gridY = Math.floor(idx / GRID_COLS);
              const placed = placedItems.find(p => p.gridX === gridX && p.gridY === gridY);

              return (
                <div
                  key={idx}
                  onClick={() => selectedItem ? handlePlaceItem(gridX, gridY) : null}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                    selectedItem && !placed
                      ? "bg-yellow-400/30 border-2 border-dashed border-yellow-400 cursor-pointer hover:bg-yellow-400/50"
                      : placed
                        ? "bg-green-400/20"
                        : "bg-green-600/20 hover:bg-green-500/30"
                  }`}
                >
                  {placed ? (
                    <span className="text-2xl sm:text-3xl garden-tile">{getItemEmoji(placed.itemId)}</span>
                  ) : (
                    selectedItem && <span className="text-lg opacity-40">+</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Character + Dialog */}
          {showCharDialog && (
            <div className="relative flex items-end gap-3 mt-4 px-2">
              <div className="animate-character flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl border-2 border-blue-800 shadow-xl flex items-center justify-center">
                  <span className="text-3xl">🧑‍🌾</span>
                </div>
              </div>
              <div className="speech-bubble flex-1 text-sm">
                <p className="font-semibold">{dialogMessages[dialogIndex]}</p>
                <button onClick={() => setShowCharDialog(false)} className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xs">✕</button>
              </div>
            </div>
          )}
        </div>

        {/* Shop Panel */}
        {showShop && (
          <div className="mt-4 animate-slide-up">
            <div className="wood-panel p-4">
              <h3 className="text-white font-black text-lg mb-3 drop-shadow-lg text-center">🛒 Bahce Dukkani</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {items.map(item => {
                  const canBuy = userStars >= item.starsRequired;
                  const isSelected = selectedItem?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => canBuy ? setSelectedItem(isSelected ? null : item) : null}
                      className={`game-card p-3 text-center transition-all ${
                        isSelected ? "ring-4 ring-yellow-400 scale-105" : ""
                      } ${canBuy ? "hover:scale-105 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                    >
                      <div className="text-3xl mb-1">{item.emoji}</div>
                      <p className="text-xs font-bold truncate">{item.name}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="text-yellow-500 text-xs">⭐</span>
                        <span className={`text-xs font-bold ${canBuy ? "text-green-600" : "text-red-500"}`}>{item.starsRequired}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedItem && (
                <p className="text-yellow-200 text-center text-sm mt-3 font-bold animate-slide-up">
                  📍 &quot;{selectedItem.name}&quot; secildi - bahcede bir yere tiklayarak yerlestirin!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Play Button */}
        <div className="flex justify-center mt-6">
          <Link href="/oyun" className="btn-game px-10 py-3 text-lg">
            🧩 Bulmaca Coz
          </Link>
        </div>
      </main>
    </div>
  );
}
