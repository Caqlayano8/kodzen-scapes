import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import GameClient from "./GameClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LevelPage({ params }: PageProps) {
  const { id } = await params;
  const levelNumber = parseInt(id, 10);

  const session = await getSession();
  if (!session) redirect("/giris");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/giris");

  if (levelNumber > user.currentLevel) {
    redirect("/oyun");
  }

  const level = await prisma.gameLevel.findUnique({ where: { levelNumber } });
  if (!level) redirect("/oyun");

  const settings = await prisma.gameSettings.findUnique({ where: { id: "default" } });

  const ads = await prisma.adConfig.findMany({
    where: { isActive: true, placement: "level_gate" },
  });

  const thresholds = level.starThresholds.split(",").map(Number);

  return (
    <GameClient
      levelNumber={levelNumber}
      levelConfig={{
        rows: level.gridRows,
        cols: level.gridCols,
        moves: level.moves,
        targetScore: level.targetScore,
        gemTypes: level.gemTypes,
        starThresholds: thresholds,
        hasBlockers: level.hasBlockers,
        blockerCount: level.blockerCount,
      }}
      userCredits={user.credits}
      requiresAd={level.requiresAd}
      requiresCredit={level.requiresCredit}
      creditCost={level.creditCost}
      waitTimeMinutes={level.waitTimeMinutes}
      ads={ads.map(a => ({ id: a.id, name: a.name, rewardCredits: a.rewardCredits }))}
      settings={{
        adGateLevelStart: settings?.adGateLevelStart || 15,
        forceAdLevelStart: settings?.forceAdLevelStart || 20,
        adRewardCredits: settings?.adRewardCredits || 15,
      }}
    />
  );
}
