"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getWorldState, getNPCState, getAnimals, getWeatherIcon, getTimeIcon, getSeasonIcon, getSeasonName } from "@/lib/world-systems";
import type { WorldState, Animal } from "@/lib/world-systems";

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

function WeatherParticles({ type }: { type: string | null }) {
  if (!type) return null;

  if (type === "rain") {
    return (
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] bg-blue-300/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              height: `${12 + Math.random() * 8}px`,
              animation: `rain-fall ${0.6 + Math.random() * 0.4}s linear infinite`,
              animationDelay: `${Math.random() * 1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "snow") {
    return (
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 10}%`,
              width: `${3 + Math.random() * 5}px`,
              height: `${3 + Math.random() * 5}px`,
              animation: `snow-fall ${3 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "fog") {
    return (
      <div className="absolute inset-0 pointer-events-none z-25">
        <div className="absolute inset-0 bg-white/10" style={{ animation: "fog-drift 8s ease-in-out infinite" }} />
        <div className="absolute inset-0 bg-white/5" style={{ animation: "fog-drift 12s ease-in-out infinite 2s" }} />
      </div>
    );
  }

  if (type === "storm") {
    return (
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] bg-blue-200/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              height: `${15 + Math.random() * 10}px`,
              animation: `rain-fall ${0.4 + Math.random() * 0.3}s linear infinite`,
              animationDelay: `${Math.random() * 0.5}s`,
              transform: "rotate(-15deg)",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-white/30 opacity-0" style={{ animation: "lightning 5s linear infinite" }} />
      </div>
    );
  }

  return null;
}

function AnimalLayer({ animals }: { animals: Animal[] }) {
  return (
    <>
      {animals.map(animal => (
        <div
          key={animal.id}
          className="absolute transition-all duration-1000"
          style={{
            left: `${animal.x}%`,
            top: `${animal.y}%`,
            animation: animal.animation === "float" ? "float 3s ease-in-out infinite"
              : animal.animation === "bounce" ? "bounce-node 2s ease-in-out infinite"
              : animal.animation === "hop" ? "hop 1.5s ease-in-out infinite"
              : animal.animation === "sparkle" ? "sparkle 2s ease-in-out infinite"
              : animal.animation === "butterfly" ? "butterfly 4s ease-in-out infinite"
              : animal.animation === "sleeping" ? "sleeping 3s ease-in-out infinite"
              : "none",
            filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.3))",
            zIndex: 15,
          }}
          title={animal.name ? `${animal.name} - ${animal.activity}` : undefined}
        >
          <span className="text-lg sm:text-xl cursor-pointer hover:scale-125 transition-transform inline-block">
            {animal.emoji}
          </span>
        </div>
      ))}
    </>
  );
}

export default function GardenClient({ items, placedItems: initialPlaced, userStars, userCredits }: GardenClientProps) {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(initialPlaced);
  const [selectedItem, setSelectedItem] = useState<GardenItem | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [showCharDialog, setShowCharDialog] = useState(true);
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [fishingActive, setFishingActive] = useState(false);
  const [fishCaught, setFishCaught] = useState<string | null>(null);
  const [treasureFound, setTreasureFound] = useState<string | null>(null);

  // World systems
  const [worldState, setWorldState] = useState<WorldState>(() => getWorldState());

  useEffect(() => {
    const interval = setInterval(() => {
      setWorldState(getWorldState());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const npcState = useMemo(() => getNPCState(worldState, placedItems.length), [worldState, placedItems.length]);
  const animals = useMemo(() => getAnimals(worldState.timeOfDay, worldState.weather), [worldState.timeOfDay, worldState.weather]);
  const isNight = worldState.timeOfDay === "night";

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

  // Mini game: Fishing
  const handleFishing = () => {
    setFishingActive(true);
    setFishCaught(null);
    setTimeout(() => {
      const fishes = ["🐟", "🐠", "🐡", "🦐", "🦀", "🐙", "🦑", "🐳"];
      const rareFishes = ["🐉", "⭐", "💎"];
      const pool = Math.random() < 0.1 ? rareFishes : fishes;
      setFishCaught(pool[Math.floor(Math.random() * pool.length)]);
      setFishingActive(false);
    }, 2000 + Math.random() * 2000);
  };

  // Mini game: Treasure Hunt
  const handleTreasureHunt = () => {
    setTreasureFound(null);
    const treasures = [
      { emoji: "💰", name: "+10 Kredi" },
      { emoji: "⭐", name: "+1 Yildiz" },
      { emoji: "🎁", name: "Gizemli Kutu" },
      { emoji: "🌹", name: "Nadir Gul" },
      { emoji: "💎", name: "Elmas" },
      { emoji: "🗝️", name: "Altin Anahtar" },
    ];
    const t = treasures[Math.floor(Math.random() * treasures.length)];
    setTimeout(() => {
      setTreasureFound(`${t.emoji} ${t.name}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: worldState.skyGradient }}>
      {/* Ambient overlay for time of day */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{ background: worldState.ambientOverlay }} />

      {/* Weather particles */}
      <WeatherParticles type={worldState.particleType} />

      {/* Stars at night */}
      {isNight && (
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: `${2 + Math.random() * 25}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          {/* Moon */}
          <div className="absolute top-[3%] right-[15%] w-10 h-10 rounded-full" style={{ background: "radial-gradient(circle at 35% 35%, #fffde7 0%, #fdd835 50%, #f9a825 100%)", boxShadow: "0 0 20px rgba(253, 216, 53, 0.4)" }} />
        </div>
      )}

      {/* Clouds */}
      <div className="absolute top-4 left-[5%] w-32 h-10 rounded-full blur-sm" style={{ background: `rgba(255,255,255,${worldState.cloudOpacity})`, animation: "float 6s ease-in-out infinite" }} />
      <div className="absolute top-8 right-[10%] w-40 h-12 rounded-full blur-sm" style={{ background: `rgba(255,255,255,${worldState.cloudOpacity * 0.8})`, animation: "float 8s ease-in-out infinite 1s" }} />
      <div className="absolute top-12 left-[40%] w-28 h-9 rounded-full blur-sm" style={{ background: `rgba(255,255,255,${worldState.cloudOpacity * 0.7})`, animation: "float 7s ease-in-out infinite 2s" }} />

      {/* Top Bar */}
      <header className="relative z-30 p-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/oyun" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">←</div>
            <span className="text-lg font-black text-white drop-shadow-lg">Bahcem</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Weather/Time/Season indicators */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(0,0,0,0.3)" }}>
              <span>{getTimeIcon(worldState.timeOfDay)}</span>
              <span>{getWeatherIcon(worldState.weather)}</span>
              <span>{getSeasonIcon(worldState.season)}</span>
              <span className="text-white/80">{getSeasonName(worldState.season)}</span>
            </div>
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

      {/* Garden Scene */}
      <div className="relative z-10 max-w-3xl mx-auto mt-2 px-2">
        <div className="relative w-full" style={{ paddingBottom: "85%", perspective: "800px" }}>
          <div className="absolute inset-0" style={{ transform: "rotateX(25deg)", transformOrigin: "center bottom", filter: worldState.lightingFilter }}>

            {/* Ground */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ background: isNight ? "linear-gradient(180deg, #2d5a20 0%, #1e4415 30%, #15330f 100%)" : "linear-gradient(180deg, #6db33f 0%, #4a8c2a 30%, #3d7a22 100%)", boxShadow: "inset 0 0 60px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4)" }}>

              {/* Grass pattern */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #8bc34a 1px, transparent 1px), radial-gradient(circle at 60% 50%, #7cb342 1px, transparent 1px), radial-gradient(circle at 80% 20%, #9ccc65 1px, transparent 1px), radial-gradient(circle at 40% 70%, #8bc34a 1px, transparent 1px)", backgroundSize: "30px 30px, 25px 25px, 35px 35px, 20px 20px" }} />

              {/* Stone Walls */}
              <div className="absolute top-0 left-0 right-0 h-[8%]" style={{ background: "linear-gradient(180deg, #a0937a 0%, #8b7d66 40%, #6d6050 100%)", borderBottom: "3px solid #5a5040", boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2)" }}>
                <div className="absolute inset-0 flex items-center justify-around opacity-50">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-[7%] h-[80%] rounded-sm" style={{ background: "linear-gradient(180deg, #bfb49a 0%, #a09378 100%)", borderRight: "1px solid #8b7d66", borderLeft: "1px solid #d4c9b0" }} />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[8%]" style={{ background: "linear-gradient(180deg, #8b7d66 0%, #6d6050 100%)", borderTop: "3px solid #a0937a" }}>
                <div className="absolute inset-0 flex items-center justify-around opacity-50">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-[7%] h-[80%] rounded-sm" style={{ background: "linear-gradient(180deg, #a09378 0%, #8b7d66 100%)" }} />
                  ))}
                </div>
              </div>
              <div className="absolute top-[8%] bottom-[8%] left-0 w-[4%]" style={{ background: "linear-gradient(90deg, #a0937a 0%, #8b7d66 100%)", borderRight: "2px solid #6d6050" }} />
              <div className="absolute top-[8%] bottom-[8%] right-0 w-[4%]" style={{ background: "linear-gradient(90deg, #8b7d66 0%, #a0937a 100%)", borderLeft: "2px solid #6d6050" }} />

              {/* Stone Paths */}
              <div className="absolute left-[15%] right-[15%] top-[46%] h-[8%]" style={{ background: "linear-gradient(180deg, #d4c4a0 0%, #c4b48e 50%, #b8a880 100%)", borderRadius: "4px", boxShadow: "inset 0 1px 3px rgba(255,255,255,0.3), inset 0 -2px 3px rgba(0,0,0,0.2)" }} />
              <div className="absolute top-[15%] bottom-[15%] left-[46%] w-[8%]" style={{ background: "linear-gradient(90deg, #d4c4a0 0%, #c4b48e 50%, #b8a880 100%)", borderRadius: "4px", boxShadow: "inset 1px 0 3px rgba(255,255,255,0.3), inset -2px 0 3px rgba(0,0,0,0.2)" }} />

              {/* Central Fountain */}
              <div className="absolute left-[35%] top-[35%] w-[30%] h-[30%] rounded-full" style={{ background: isNight ? "radial-gradient(circle, #7ab8cc 0%, #5a98a8 30%, #4a8898 60%, #3a7888 100%)" : "radial-gradient(circle, #d4e6f0 0%, #b8d4e3 30%, #94b8c8 60%, #7aa8b8 100%)", boxShadow: "inset 0 4px 12px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.3)", border: "4px solid #a09378" }}>
                <div className="absolute inset-[15%] rounded-full" style={{ background: isNight ? "radial-gradient(circle, #8ac8d8 0%, #6ab0c0 50%, #4a98a8 100%)" : "radial-gradient(circle, #e8f4f8 0%, #b0dae8 50%, #80c4d8 100%)", animation: "pulse 3s ease-in-out infinite" }} />
                <div className="absolute left-[38%] top-[20%] w-[24%] h-[40%] flex flex-col items-center">
                  <div className="w-full h-[30%] rounded-full" style={{ background: "linear-gradient(180deg, #e8e0d0 0%, #c8b898 100%)" }} />
                  <div className="w-[40%] h-[40%]" style={{ background: "linear-gradient(90deg, #d8d0c0 0%, #e8e0d0 50%, #d8d0c0 100%)" }} />
                  <div className="w-[80%] h-[30%] rounded-b-full" style={{ background: "linear-gradient(180deg, #c8b898 0%, #e8e0d0 100%)" }} />
                </div>
                <div className="absolute left-[42%] top-[8%] w-[16%] h-[20%] opacity-60" style={{ background: "radial-gradient(ellipse, #e0f4ff 0%, transparent 70%)", animation: "float 2s ease-in-out infinite" }} />
              </div>

              {/* Trees */}
              <div className="absolute left-[6%] top-[12%] text-3xl sm:text-4xl" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.4))" }}>🌳</div>
              <div className="absolute right-[6%] top-[12%] text-3xl sm:text-4xl" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.4))" }}>🌲</div>
              <div className="absolute left-[6%] bottom-[12%] text-3xl sm:text-4xl" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.4))" }}>🌳</div>
              <div className="absolute right-[6%] bottom-[12%] text-3xl sm:text-4xl" style={{ filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.4))" }}>🌲</div>

              {/* Bushes */}
              <div className="absolute left-[18%] top-[10%] text-xl opacity-80">🌿</div>
              <div className="absolute left-[30%] top-[10%] text-xl opacity-70">🌿</div>
              <div className="absolute right-[18%] top-[10%] text-xl opacity-80">🌿</div>
              <div className="absolute right-[30%] top-[10%] text-xl opacity-70">🌿</div>
              <div className="absolute left-[18%] bottom-[10%] text-xl opacity-80">🌿</div>
              <div className="absolute right-[18%] bottom-[10%] text-xl opacity-70">🌿</div>

              {/* Flowers */}
              <div className="absolute left-[20%] top-[38%] text-lg">🌸</div>
              <div className="absolute right-[20%] top-[38%] text-lg">🌷</div>
              <div className="absolute left-[20%] bottom-[38%] text-lg">🌺</div>
              <div className="absolute right-[20%] bottom-[38%] text-lg">🌻</div>

              {/* Lamps - glow at night */}
              <div className="absolute left-[12%] top-[45%] text-lg" style={isNight ? { filter: "drop-shadow(0 0 8px rgba(255,200,50,0.8))" } : undefined}>
                {isNight ? "💡" : "🏮"}
              </div>
              <div className="absolute right-[12%] top-[45%] text-lg" style={isNight ? { filter: "drop-shadow(0 0 8px rgba(255,200,50,0.8))" } : undefined}>
                {isNight ? "💡" : "🏮"}
              </div>

              {/* Benches */}
              <div className="absolute left-[22%] top-[52%] text-lg" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.3))" }}>🪑</div>
              <div className="absolute right-[22%] top-[52%] text-lg" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.3))" }}>🪑</div>

              {/* Interactive Animals */}
              <AnimalLayer animals={animals} />

              {/* Decoration Spots */}
              {SPOTS.map(spot => {
                const content = getSpotContent(spot.id);
                const isCenter = spot.id === 4;
                if (isCenter) return null;

                return (
                  <div
                    key={spot.id}
                    onClick={() => selectedItem ? handlePlaceItem(spot.id) : null}
                    className={`absolute flex items-center justify-center rounded-xl transition-all duration-300 ${
                      selectedItem && !content ? "cursor-pointer ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent animate-pulse" : ""
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
                      <span className="text-3xl sm:text-4xl md:text-5xl" style={{ filter: "drop-shadow(2px 4px 4px rgba(0,0,0,0.4))" }}>{content}</span>
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

      {/* NPC Character + AI Dialogue */}
      {showCharDialog && (
        <div className="relative z-20 max-w-3xl mx-auto px-4 -mt-6">
          <div className="flex items-end gap-3">
            <div className="flex-shrink-0" style={{ animation: "character-idle 3s ease-in-out infinite" }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 border-blue-800 shadow-xl flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #5b9bd5 0%, #2e75b6 100%)" }}>
                <span className="text-3xl sm:text-4xl">{npcState.emoji}</span>
                {/* Mood indicator */}
                <span className="absolute -top-1 -right-1 text-sm">
                  {npcState.mood === "happy" ? "😊" : npcState.mood === "excited" ? "🤩" : npcState.mood === "sleepy" ? "😴" : "🙂"}
                </span>
              </div>
            </div>
            <div className="speech-bubble flex-1 py-3 px-4 relative">
              <p className="text-[10px] text-blue-600 font-bold mb-0.5">{npcState.name} - {npcState.activity}</p>
              <p className="font-bold text-gray-800 text-sm sm:text-base">{npcState.dialogue}</p>
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
                    className={`game-card p-2 sm:p-3 text-center transition-all ${isSelected ? "ring-4 ring-yellow-400 scale-105" : ""} ${canBuy ? "hover:scale-105 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
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
              <p className="text-yellow-200 text-center text-xs sm:text-sm mt-3 font-bold">
                📍 &quot;{selectedItem.name}&quot; secildi - bahcede bir yere tiklayarak yerlestirin!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mini Games Panel */}
      {showMiniGames && (
        <div className="relative z-20 max-w-3xl mx-auto px-4 mt-4 animate-slide-up">
          <div className="wood-panel p-4">
            <h3 className="text-white font-black text-lg mb-3 drop-shadow-lg text-center">🎮 Mini Oyunlar</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              {/* Fishing */}
              <button
                onClick={handleFishing}
                disabled={fishingActive}
                className="game-card p-3 text-center hover:scale-105 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-1">{fishingActive ? "🎣" : "🐟"}</div>
                <p className="text-xs font-bold">Balikcilik</p>
                <p className="text-[10px] text-gray-500">{fishingActive ? "Bekleniyor..." : "Balik Tut!"}</p>
              </button>

              {/* Treasure Hunt */}
              <button
                onClick={handleTreasureHunt}
                className="game-card p-3 text-center hover:scale-105 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-1">🗺️</div>
                <p className="text-xs font-bold">Hazine Avi</p>
                <p className="text-[10px] text-gray-500">Gizli hazine bul!</p>
              </button>

              {/* Greenhouse */}
              <button className="game-card p-3 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="text-3xl mb-1">🌱</div>
                <p className="text-xs font-bold">Sera</p>
                <p className="text-[10px] text-gray-500">Bitki yetistir!</p>
              </button>

              {/* Pet Care */}
              <button className="game-card p-3 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="text-3xl mb-1">🐱</div>
                <p className="text-xs font-bold">Evcil Hayvan</p>
                <p className="text-[10px] text-gray-500">Mimi&apos;yi sev!</p>
              </button>

              {/* Cafe */}
              <button className="game-card p-3 text-center hover:scale-105 transition-all cursor-pointer opacity-60">
                <div className="text-3xl mb-1">☕</div>
                <p className="text-xs font-bold">Kafe</p>
                <p className="text-[10px] text-gray-500">🔒 Level 45</p>
              </button>

              {/* Garden Race */}
              <button className="game-card p-3 text-center hover:scale-105 transition-all cursor-pointer opacity-60">
                <div className="text-3xl mb-1">🏆</div>
                <p className="text-xs font-bold">Yarisma</p>
                <p className="text-[10px] text-gray-500">🔒 Level 30</p>
              </button>
            </div>

            {/* Fish caught result */}
            {fishCaught && (
              <div className="mt-3 text-center animate-pop-in">
                <p className="text-yellow-200 font-bold text-sm">
                  {fishCaught === "⭐" || fishCaught === "💎" || fishCaught === "🐉"
                    ? `🎉 Nadir yakaladın! ${fishCaught}`
                    : `${fishCaught} Balik yakaladin!`}
                </p>
              </div>
            )}

            {/* Treasure found result */}
            {treasureFound && (
              <div className="mt-3 text-center animate-pop-in">
                <p className="text-yellow-200 font-bold text-sm">🎉 Hazine buldun: {treasureFound}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="relative z-20 flex flex-wrap justify-center gap-3 mt-4 pb-8 px-4">
        <Link href="/oyun" className="btn-game px-6 py-3 text-sm sm:text-base">
          🧩 Bulmaca Coz
        </Link>
        <button onClick={() => { setShowShop(!showShop); setShowMiniGames(false); }} className="btn-gold px-5 py-3 text-sm sm:text-base">
          🛒 Dukkan
        </button>
        <button onClick={() => { setShowMiniGames(!showMiniGames); setShowShop(false); }} className="btn-game px-5 py-3 text-sm sm:text-base" style={{ background: "linear-gradient(180deg, #9c27b0 0%, #7b1fa2 50%, #6a1b9a 100%)", borderColor: "#4a148c" }}>
          🎮 Mini Oyunlar
        </button>
        {!showCharDialog && (
          <button onClick={() => setShowCharDialog(true)} className="btn-game px-5 py-3 text-sm sm:text-base" style={{ background: "linear-gradient(180deg, #42a5f5 0%, #1e88e5 50%, #1565c0 100%)", borderColor: "#0d47a1" }}>
            💬 Sohbet
          </button>
        )}
      </div>
    </div>
  );
}
