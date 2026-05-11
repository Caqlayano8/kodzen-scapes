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

    // Simulate ad watching (5 seconds)
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

  // Gate screen - requires ad/credit/wait
  if (gameState === "gate") {
    const isForced = levelNumber >= settings.forceAdLevelStart;

    return (
      <div className="min-h-screen game-gradient flex items-center justify-center px-4">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Bolum {levelNumber}</h2>
          <p className="text-gray-400 mb-6">
            {isForced
              ? "Bu bolumu acmak icin reklam izleyin veya kredi harcayin."
              : "Bu bolumu acmak icin asagidaki seceneklerden birini secin."}
          </p>

          <div className="space-y-3">
            {/* Watch Ad */}
            <button
              onClick={handleWatchAd}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>📺</span> Reklam Izle (+{settings.adRewardCredits} Kredi)
            </button>

            {/* Spend Credits */}
            {credits >= creditCost && (
              <button
                onClick={handleSpendCredits}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>💎</span> {creditCost} Kredi Harca (Mevcut: {credits})
              </button>
            )}

            {/* Wait option (only for optional gate) */}
            {!isForced && waitTimeMinutes > 0 && (
              <button
                onClick={handleWait}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>⏰</span> {waitTimeMinutes} Dakika Bekle
              </button>
            )}
          </div>

          <Link href="/oyun" className="inline-block mt-6 text-gray-400 hover:text-white text-sm">
            ← Bolumlere Don
          </Link>
        </div>
      </div>
    );
  }

  // Watching ad
  if (gameState === "watching_ad") {
    return (
      <div className="min-h-screen game-gradient flex items-center justify-center px-4">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-700 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Reklam Izleniyor...</h2>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-4 rounded-full transition-all duration-100"
              style={{ width: `${adProgress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm">
            {adProgress >= 100 ? `Tebrikler! +${creditsEarned || settings.adRewardCredits} kredi kazandiniz!` : "Lutfen reklamın bitmesini bekleyin..."}
          </p>
          {/* Placeholder for real ad content */}
          <div className="mt-4 bg-gray-800 rounded-xl p-8 border border-gray-600">
            <p className="text-gray-500 text-sm">Reklam Alani</p>
            <p className="text-gray-600 text-xs mt-2">Google Ads burada gosterilecek</p>
          </div>
        </div>
      </div>
    );
  }

  // Waiting
  if (gameState === "waiting") {
    return (
      <div className="min-h-screen game-gradient flex items-center justify-center px-4">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-700 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Bekleme Suresi</h2>
          <p className="text-gray-400 mb-6">
            {waitTimeMinutes} dakika sonra bolum acilacak.
          </p>
          <div className="text-4xl font-bold text-emerald-400 mb-6">⏰</div>
          <p className="text-sm text-gray-500 mb-4">Beklemek istemiyor musunuz?</p>
          <div className="space-y-3">
            <button
              onClick={handleWatchAd}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
            >
              📺 Reklam Izle
            </button>
            {credits >= creditCost && (
              <button
                onClick={handleSpendCredits}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all"
              >
                💎 {creditCost} Kredi Harca
              </button>
            )}
          </div>
          <button
            onClick={() => setGameState("playing")}
            className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm underline"
          >
            Simdiye kadar bekledim, devam et (demo)
          </button>
        </div>
      </div>
    );
  }

  // Won
  if (gameState === "won" && result) {
    return (
      <div className="min-h-screen game-gradient flex items-center justify-center px-4">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-emerald-500/30 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-2">Tebrikler!</h2>
          <p className="text-emerald-300 text-lg mb-4">Bolum {levelNumber} tamamlandi!</p>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <span key={s} className={`text-3xl ${result.stars >= s ? "text-yellow-400" : "text-gray-600"}`}>⭐</span>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <div className="text-gray-400 text-sm">Skor</div>
            <div className="text-2xl font-bold text-white">{result.score.toLocaleString()}</div>
            <div className="text-emerald-400 text-sm mt-2">+{result.stars * 5} Kredi Kazanildi</div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/oyun"
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors"
            >
              Bolumler
            </Link>
            <Link
              href={`/oyun/bolum/${levelNumber + 1}`}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
            >
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
      <div className="min-h-screen game-gradient flex items-center justify-center px-4">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-red-500/30 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-3xl font-bold text-white mb-2">Hamle Bitti!</h2>
          <p className="text-gray-400 mb-6">Bolum {levelNumber} tamamlanamadi.</p>

          <div className="flex gap-3">
            <Link
              href="/oyun"
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors"
            >
              Bolumler
            </Link>
            <button
              onClick={() => {
                setGameState("playing");
                setResult(null);
              }}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
            >
              Tekrar Dene
            </button>
          </div>

          <button
            onClick={handleWatchAd}
            className="w-full mt-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
          >
            📺 Reklam Izle & +5 Hamle
          </button>
        </div>
      </div>
    );
  }

  // Playing
  return (
    <div className="min-h-screen game-gradient flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <Link href="/oyun" className="text-gray-400 hover:text-white text-sm">← Bolumler</Link>
          <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-1.5 rounded-lg">
            <span className="text-yellow-400">💎</span>
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
