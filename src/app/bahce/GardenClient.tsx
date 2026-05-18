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

const SPOTS = [
  { id: 0, x: 12, y: 18, w: 14, h: 14, label: "Sol Ust" },
  { id: 1, x: 38, y: 8, w: 24, h: 18, label: "Orta Ust" },
  { id: 2, x: 74, y: 18, w: 14, h: 14, label: "Sag Ust" },
  { id: 3, x: 6, y: 40, w: 14, h: 14, label: "Sol Orta" },
  { id: 4, x: 38, y: 34, w: 24, h: 26, label: "Merkez" },
  { id: 5, x: 80, y: 40, w: 14, h: 14, label: "Sag Orta" },
  { id: 6, x: 12, y: 65, w: 14, h: 14, label: "Sol Alt" },
  { id: 7, x: 38, y: 68, w: 24, h: 14, label: "Orta Alt" },
  { id: 8, x: 74, y: 65, w: 14, h: 14, label: "Sag Alt" },
];

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

  const handlePlaceItem = async (spotId: number) => {
    if (!selectedItem) return;
    const existing = placedItems.find(p => p.gridX === spotId);
    if (existing) return;

    try {
      const res = await fetch("/api/game/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: selectedItem.id, gridX: spotId, gridY: 0 }),
      });
      const data = await res.json();
      if (data.id) {
        setPlacedItems(prev => [...prev, { id: data.id, itemId: selectedItem.id, gridX: spotId, gridY: 0 }]);
      }
    } catch (err) {
      console.error(err);
    }
    setSelectedItem(null);
  };

  const getItemEmoji = (itemId: string) => {
    return items.find(i => i.id === itemId)?.emoji || "❓";
  };

  const getSpotContent = (spotId: number) => {
    const placed = placedItems.find(p => p.gridX === spotId);
    if (placed) return getItemEmoji(placed.itemId);
    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(180deg, #87ceeb 0%, #a8d8ea 30%, #7ab648 45%, #5a9e32 100%)" }}>
      {/* Sky & Clouds */}
      <div className="absolute top-4 left-[5%] w-32 h-10 bg-white/40 rounded-full blur-sm" style={{ animation: "float 6s ease-in-out infinite" }} />
      <div className="absolute top-8 right-[10%] w-40 h-12 bg-white/30 rounded-full blur-sm" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
      <div className="absolute top-12 left-[40%] w-28 h-9 bg-white/25 rounded-full blur-sm" style={{ animation: "float 7s ease-in-out infinite 2s" }} />

      {/* Top Bar */}
      <header className="relative z-30 p-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/oyun" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">←</div>
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
            <button onClick={() => setShowShop(!showShop)} className="w-10 h-10 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 border-2 border-orange-700 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">🛒</button>
          </div>
        </div>
      </header>

      {/* Garden Scene - Isometric View */}
      <div className="relative z-10 max-w-3xl mx-auto mt-2 px-2">
        <div className="relative w-full" style={{ paddingBottom: "85%", perspective: "800px" }}>
          <div className="absolute inset-0" style={{ transform: "rotateX(25deg)", transformOrigin: "center bottom" }}>

            {/* Ground / Lawn */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(180deg, #6db33f 0%, #4a8c2a 30%, #3d7a22 100%)", boxShadow: "inset 0 0 60px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4)" }}>

              {/* Grass pattern overlay */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #8bc34a 1px, transparent 1px), radial-gradient(circle at 60% 50%, #7cb342 1px, transparent 1px), radial-gradient(circle at 80% 20%, #9ccc65 1px, transparent 1px), radial-gradient(circle at 40% 70%, #8bc34a 1px, transparent 1px)", backgroundSize: "30px 30px, 25px 25px, 35px 35px, 20px 20px" }} />

              {/* Stone Wall / Fence - Top */}
              <div className="absolute top-0 left-0 right-0 h-[8%]" style={{ background: "linear-gradient(180deg, #a0937a 0%, #8b7d66 40%, #6d6050 100%)", borderBottom: "3px solid #5a5040", boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2)" }}>
                <div className="absolute inset-0 flex items-center justify-around opacity-50">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-[7%] h-[80%] rounded-sm" style={{ background: "linear-gradient(180deg, #bfb49a 0%, #a09378 100%)", borderRight: "1px solid #8b7d66", borderLeft: "1px solid #d4c9b0" }} />
                  ))}
                </div>
              </div>

              {/* Stone Wall - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[8%]" style={{ background: "linear-gradient(180deg, #8b7d66 0%, #6d6050 100%)", borderTop: "3px solid #a0937a", boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.2)" }}>
                <div className="absolute inset-0 flex items-center justify-around opacity-50">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-[7%] h-[80%] rounded-sm" style={{ background: "linear-gradient(180deg, #a09378 0%, #8b7d66 100%)", borderRight: "1px solid #6d6050" }} />
                  ))}
                </div>
              </div>

              {/* Stone Wall - Left */}
              <div className="absolute top-[8%] bottom-[8%] left-0 w-[4%]" style={{ background: "linear-gradient(90deg, #a0937a 0%, #8b7d66 100%)", borderRight: "2px solid #6d6050" }} />

              {/* Stone Wall - Right */}
              <div className="absolute top-[8%] bottom-[8%] right-0 w-[4%]" style={{ background: "linear-gradient(90deg, #8b7d66 0%, #a0937a 100%)", borderLeft: "2px solid #6d6050" }} />

              {/* Decorative Stone Path - Cross pattern */}
              <div className="absolute left-[15%] right-[15%] top-[46%] h-[8%]" style={{ background: "linear-gradient(180deg, #d4c4a0 0%, #c4b48e 50%, #b8a880 100%)", borderRadius: "4px", boxShadow: "inset 0 1px 3px rgba(255,255,255,0.3), inset 0 -2px 3px rgba(0,0,0,0.2)" }} />
              <div className="absolute top-[15%] bottom-[15%] left-[46%] w-[8%]" style={{ background: "linear-gradient(90deg, #d4c4a0 0%, #c4b48e 50%, #b8a880 100%)", borderRadius: "4px", boxShadow: "inset 1px 0 3px rgba(255,255,255,0.3), inset -2px 0 3px rgba(0,0,0,0.2)" }} />

              {/* Central Fountain Area - Decorative stone circle */}
              <div className="absolute left-[35%] top-[35%] w-[30%] h-[30%] rounded-full" style={{ background: "radial-gradient(circle, #d4e6f0 0%, #b8d4e3 30%, #94b8c8 60%, #7aa8b8 100%)", boxShadow: "inset 0 4px 12px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.3)", border: "4px solid #a09378" }}>
                {/* Water ripples */}
                <div className="absolute inset-[15%] rounded-full" style={{ background: "radial-gradient(circle, #e8f4f8 0%, #b0dae8 50%, #80c4d8 100%)", animation: "pulse 3s ease-in-out infinite" }} />
                {/* Fountain center */}
                <div className="absolute left-[38%] top-[20%] w-[24%] h-[40%] flex flex-col items-center">
                  <div className="w-full h-[30%] rounded-full" style={{ background: "linear-gradient(180deg, #e8e0d0 0%, #c8b898 100%)", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }} />
                  <div className="w-[40%] h-[40%]" style={{ background: "linear-gradient(90deg, #d8d0c0 0%, #e8e0d0 50%, #d8d0c0 100%)" }} />
                  <div className="w-[80%] h-[30%] rounded-b-full" style={{ background: "linear-gradient(180deg, #c8b898 0%, #e8e0d0 100%)" }} />
                </div>
                {/* Water spray effect */}
                <div className="absolute left-[42%] top-[8%] w-[16%] h-[20%] opacity-60" style={{ background: "radial-gradient(ellipse, #e0f4ff 0%, transparent 70%)", animation: "float 2s ease-in-out infinite" }} />
              </div>

              {/* Garden Corner Trees */}
              <div className="absolute left-[6%] top-[12%] text-3xl sm:text-4xl" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.4))" }}>🌳</div>
              <div className="absolute right-[6%] top-[12%] text-3xl sm:text-4xl" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.4))" }}>🌲</div>
              <div className="absolute left-[6%] bottom-[12%] text-3xl sm:text-4xl" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.4))" }}>🌳</div>
              <div className="absolute right-[6%] bottom-[12%] text-3xl sm:text-4xl" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.4))" }}>🌲</div>

              {/* Bushes along walls */}
              <div className="absolute left-[18%] top-[10%] text-xl opacity-80">🌿</div>
              <div className="absolute left-[30%] top-[10%] text-xl opacity-70">🌿</div>
              <div className="absolute right-[18%] top-[10%] text-xl opacity-80">🌿</div>
              <div className="absolute right-[30%] top-[10%] text-xl opacity-70">🌿</div>
              <div className="absolute left-[18%] bottom-[10%] text-xl opacity-80">🌿</div>
              <div className="absolute right-[18%] bottom-[10%] text-xl opacity-70">🌿</div>

              {/* Small flowers near paths */}
              <div className="absolute left-[20%] top-[38%] text-lg">🌸</div>
              <div className="absolute right-[20%] top-[38%] text-lg">🌷</div>
              <div className="absolute left-[20%] bottom-[38%] text-lg">🌺</div>
              <div className="absolute right-[20%] bottom-[38%] text-lg">🌻</div>

              {/* Lamp posts */}
              <div className="absolute left-[12%] top-[45%] text-lg">🏮</div>
              <div className="absolute right-[12%] top-[45%] text-lg">🏮</div>

              {/* Benches on paths */}
              <div className="absolute left-[22%] top-[52%] text-lg" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.3))" }}>🪑</div>
              <div className="absolute right-[22%] top-[52%] text-lg" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.3))" }}>🪑</div>

              {/* Decorative placement spots */}
              {SPOTS.map(spot => {
                const content = getSpotContent(spot.id);
                const isCenter = spot.id === 4;
                if (isCenter) return null;

                return (
                  <div
                    key={spot.id}
                    onClick={() => selectedItem ? handlePlaceItem(spot.id) : null}
                    className={`absolute flex items-center justify-center rounded-xl transition-all duration-300 ${
                      selectedItem && !content
                        ? "cursor-pointer ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent animate-pulse"
                        : ""
                    }`}
                    style={{
                      left: `${spot.x}%`,
                      top: `${spot.y}%`,
                      width: `${spot.w}%`,
                      height: `${spot.h}%`,
                      background: content
                        ? "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)"
                        : selectedItem
                          ? "radial-gradient(circle, rgba(255,235,59,0.2) 0%, transparent 70%)"
                          : "transparent",
                    }}
                  >
                    {content ? (
                      <span className="text-3xl sm:text-4xl md:text-5xl" style={{ filter: "drop-shadow(2px 4px 4px rgba(0,0,0,0.4))", animation: "pop-in 0.3s ease-out" }}>{content}</span>
                    ) : selectedItem ? (
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-yellow-400/60 flex items-center justify-center">
                        <span className="text-yellow-400/60 text-2xl">+</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Character + Speech Bubble */}
      {showCharDialog && (
        <div className="relative z-20 max-w-3xl mx-auto px-4 -mt-6">
          <div className="flex items-end gap-3">
            <div className="flex-shrink-0" style={{ animation: "character-idle 3s ease-in-out infinite" }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 border-blue-800 shadow-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5b9bd5 0%, #2e75b6 100%)" }}>
                <span className="text-3xl sm:text-4xl">🧑‍🌾</span>
              </div>
            </div>
            <div className="speech-bubble flex-1 py-3 px-4 relative">
              <p className="font-bold text-gray-800 text-sm sm:text-base">{dialogMessages[dialogIndex]}</p>
              <button onClick={() => setShowCharDialog(false)} className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Shop Panel */}
      {showShop && (
        <div className="relative z-20 max-w-3xl mx-auto px-4 mt-4 animate-slide-up">
          <div className="wood-panel p-4">
            <h3 className="text-white font-black text-lg mb-3 drop-shadow-lg text-center">🛒 Bahce Dukkani</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {items.map(item => {
                const canBuy = userStars >= item.starsRequired;
                const isSelected = selectedItem?.id === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => canBuy ? setSelectedItem(isSelected ? null : item) : null}
                    className={`game-card p-2 sm:p-3 text-center transition-all ${
                      isSelected ? "ring-4 ring-yellow-400 scale-105" : ""
                    } ${canBuy ? "hover:scale-105 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                  >
                    <div className="text-2xl sm:text-3xl mb-1">{item.emoji}</div>
                    <p className="text-[10px] sm:text-xs font-bold truncate">{item.name}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-yellow-500 text-[10px]">⭐</span>
                      <span className={`text-[10px] sm:text-xs font-bold ${canBuy ? "text-green-600" : "text-red-500"}`}>{item.starsRequired}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedItem && (
              <p className="text-yellow-200 text-center text-xs sm:text-sm mt-3 font-bold animate-slide-up">
                📍 &quot;{selectedItem.name}&quot; secildi - bahcede bir yere tiklayarak yerlestirin!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="relative z-20 flex justify-center gap-4 mt-4 pb-8 px-4">
        <Link href="/oyun" className="btn-game px-8 py-3 text-base sm:text-lg">
          🧩 Bulmaca Coz
        </Link>
        <button onClick={() => setShowShop(!showShop)} className="btn-gold px-6 py-3 text-base sm:text-lg">
          🛒 Dukkan
        </button>
      </div>
    </div>
  );
}
