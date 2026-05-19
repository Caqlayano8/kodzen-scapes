"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GameBoard from "@/components/game/GameBoard";
import { LevelConfig } from "@/lib/game-engine";
import { completeLevel, spendCredits, watchAd } from "@/app/actions/game";

interface GameClientProps {
  levelNumber: number;
  levelConfig: LevelConfig;
  userCredits: number;
  requiresAd: boolean;
  requiresCredit: boolean;
  creditCost: number;
  waitTimeMinutes: number;
  ads: { id: string; name: string; rewardCredits: number }[];
  settings: {
    adGateLevelStart: number;
    forceAdLevelStart: number;
    adRewardCredits: number;
  };
}

type GameState = "gate" | "playing" | "won" | "lost" | "watching_ad" | "waiting";

export default function GameClient({
  levelNumber,
  levelConfig,
  userCredits,
  requiresAd,
  requiresCredit,
  creditCost,
  waitTimeMinutes,
  ads,
  settings,
}: GameClientProps) {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>(
    (requiresAd || requiresCredit) && levelNumber >= settings.adGateLevelStart ? "gate" : "playing"
  );
  const [result, setResult] = useState<{ score: number; stars: number } | null>(null);
  const [credits, setCredits] = useState(userCredits);
  const [waitEnd, setWaitEnd] = useState<Date | null>(null);
  const [adProgress, setAdProgress] = useState(0);
  const [creditsEarned, setCreditsEarned] = useState(0);

  const handleComplete = useCallback(async (score: number, stars: number) => {
    setResult({ score, stars });
    setGameState("won");
    await completeLevel(levelNumber, score, stars);
  }, [levelNumber]);

  const handleFail = useCallback(() => {
    setGameState("lost");
  }, []);

  const handleWatchAd = async () => {
    setGameState("watching_ad");
    setAdProgress(0);

    const interval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    setTimeout(async () => {
      clearInterval(interval);
      setAdProgress(100);

      if (ads.length > 0) {
        const result = await watchAd(ads[0].id);
        if (result.creditsEarned) {
          setCreditsEarned(result.creditsEarned);
          setCredits(prev => prev + result.creditsEarned!);
        }
      }

      setTimeout(() => {
        setGameState("playing");
      }, 1000);
    }, 5000);
  };

  const handleSpendCredits = async () => {
    const result = await spendCredits(creditCost, `Bolum ${levelNumber} acma`);
    if (result.error) {
      alert(result.error);
      return;
    }
    setCredits(result.remainingCredits!);
    setGameState("playing");
  };

  const handleWait = () => {
    const end = new Date(Date.now() + waitTimeMinutes * 60 * 1000);
    setWaitEnd(end);
    setGameState("waiting");
  };

  // Gate screen
  if (gameState === "gate") {
    const isForced = levelNumber >= settings.forceAdLevelStart;

    return (
      <div className="min-h-screen garden-sky flex items-center justify-center px-4">
        <div className="game-overlay fixed inset-0" />
        <div className="game-card p-8 max-w-md w-full text-center relative z-10 animate-pop-in">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-black mb-2">Bolum {levelNumber}</h2>
          <p className="text-amber-700 mb-6">
            {isForced
              ? "Bu bolumu acmak icin reklam izleyin veya kredi harcayin."
              : "Bu bolumu acmak icin asagidaki seceneklerden birini secin."}
          </p>

          <div className="space-y-3">
            <button onClick={handleWatchAd} className="btn-game w-full py-4 text-base flex items-center justify-center gap-2">
              📺 Reklam Izle (+{settings.adRewardCredits} Kredi)
            </button>

            {credits >= creditCost && (
              <button onClick={handleSpendCredits} className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2">
                💎 {creditCost} Kredi Harca (Mevcut: {credits})
              </button>
            )}

            {!isForced && waitTimeMinutes > 0 && (
              <button onClick={handleWait} className="w-full py-4 bg-gradient-to-b from-gray-400 to-gray-500 border-3 border-gray-600 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2">
                ⏰ {waitTimeMinutes} Dakika Bekle
              </button>
            )}
          </div>

          <Link href="/oyun" className="inline-block mt-6 text-amber-600 hover:text-amber-800 font-bold text-sm">
            ← Bolumlere Don
          </Link>
        </div>
      </div>
    );
  }

  // Watching ad
  if (gameState === "watching_ad") {
    return (
      <div className="min-h-screen garden-sky flex items-center justify-center px-4">
        <div className="game-overlay fixed inset-0" />
        <div className="game-card p-8 max-w-md w-full text-center relative z-10 animate-pop-in">
          <div className="text-5xl mb-4">📺</div>
          <h2 className="text-xl font-black mb-4">Reklam Izleniyor...</h2>
          <div className="w-full bg-amber-200 rounded-full h-5 mb-4 border-2 border-amber-400 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-100 relative"
              style={{ width: `${adProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>
          <p className="text-amber-700 text-sm">
            {adProgress >= 100 ? `Tebrikler! +${creditsEarned || settings.adRewardCredits} kredi kazandiniz! 🎉` : "Lutfen reklamın bitmesini bekleyin..."}
          </p>
          <div className="mt-4 bg-amber-50 rounded-xl p-8 border-2 border-amber-200">
            <p className="text-amber-400 text-sm">🎬 Reklam Alani</p>
            <p className="text-amber-300 text-xs mt-2">Google Ads burada gosterilecek</p>
          </div>
        </div>
      </div>
    );
  }

  // Waiting
  if (gameState === "waiting") {
    return (
      <div className="min-h-screen garden-sky flex items-center justify-center px-4">
        <div className="game-overlay fixed inset-0" />
        <div className="game-card p-8 max-w-md w-full text-center relative z-10 animate-pop-in">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-xl font-black mb-4">Bekleme Suresi</h2>
          <p className="text-amber-700 mb-6">{waitTimeMinutes} dakika sonra bolum acilacak.</p>
          
          <p className="text-sm text-amber-600 mb-4 font-bold">Beklemek istemiyor musunuz?</p>
          <div className="space-y-3">
            <button onClick={handleWatchAd} className="btn-game w-full py-3 text-sm flex items-center justify-center gap-2">
              📺 Reklam Izle
            </button>
            {credits >= creditCost && (
              <button onClick={handleSpendCredits} className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2">
                💎 {creditCost} Kredi Harca
              </button>
            )}
          </div>
          <button onClick={() => setGameState("playing")} className="mt-4 text-amber-500 hover:text-amber-700 text-sm underline font-bold">
            Simdiye kadar bekledim, devam et
          </button>
        </div>
      </div>
    );
  }

  // Won
  if (gameState === "won" && result) {
    return (
      <div className="min-h-screen garden-sky flex items-center justify-center px-4">
        <div className="game-overlay fixed inset-0" />
        <div className="game-card p-8 max-w-md w-full text-center relative z-10 animate-pop-in">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-black mb-2">Tebrikler!</h2>
          <p className="text-amber-700 text-lg mb-4">Bolum {levelNumber} tamamlandi!</p>

          <div className="flex justify-center gap-3 mb-4">
            {[1, 2, 3].map(s => (
              <span key={s} className={`text-4xl transition-all ${result.stars >= s ? "star-filled animate-pop-in" : "star-empty"}`} style={{ animationDelay: `${s * 0.2}s` }}>⭐</span>
            ))}
          </div>

          <div className="wood-panel p-4 mb-6">
            <div className="text-yellow-200 text-sm font-bold">SKOR</div>
            <div className="text-3xl font-black text-white drop-shadow-lg">{result.score.toLocaleString()}</div>
            <div className="text-yellow-300 text-sm mt-2 font-bold">+{result.stars * 5} Kredi Kazanildi 💰</div>
          </div>

          <div className="flex gap-3">
            <Link href="/oyun" className="flex-1 py-3 bg-gradient-to-b from-gray-400 to-gray-500 border-3 border-gray-600 rounded-xl text-white font-bold shadow-lg text-center">
              Bolumler
            </Link>
            <Link href={`/oyun/bolum/${levelNumber + 1}`} className="btn-game flex-1 py-3 text-center">
              Sonraki →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Lost
  if (gameState === "lost") {
    return (
      <div className="min-h-screen garden-sky flex items-center justify-center px-4">
        <div className="game-overlay fixed inset-0" />
        <div className="game-card p-8 max-w-md w-full text-center relative z-10 animate-pop-in">
          <div className="text-7xl mb-4">😢</div>
          <h2 className="text-3xl font-black mb-2">Hamle Bitti!</h2>
          <p className="text-amber-700 mb-6">Bolum {levelNumber} tamamlanamadi.</p>

          <div className="flex gap-3 mb-3">
            <Link href="/oyun" className="flex-1 py-3 bg-gradient-to-b from-gray-400 to-gray-500 border-3 border-gray-600 rounded-xl text-white font-bold shadow-lg text-center">
              Bolumler
            </Link>
            <button
              onClick={() => { setGameState("playing"); setResult(null); }}
              className="btn-game flex-1 py-3"
            >
              Tekrar Dene
            </button>
          </div>

          <button onClick={handleWatchAd} className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2">
            📺 Reklam Izle & +5 Hamle
          </button>
        </div>
      </div>
    );
  }

  // Playing
  return (
    <div className="min-h-screen garden-bg flex flex-col items-center justify-center px-4 py-4">
      {/* Top bar */}
      <div className="w-full max-w-lg mb-4">
        <div className="flex justify-between items-center">
          <Link href="/oyun" className="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">
            ←
          </Link>
          <div className="resource-badge">
            <div className="icon bg-gradient-to-b from-yellow-300 to-amber-500">💰</div>
            <span className="text-white font-bold text-sm">{credits}</span>
          </div>
        </div>
      </div>

      <GameBoard
        levelConfig={levelConfig}
        levelNumber={levelNumber}
        onComplete={handleComplete}
        onFail={handleFail}
      />
    </div>
  );
}
