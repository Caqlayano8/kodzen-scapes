"use server";

import { prisma } from "@/lib/db";
import { getSession, refreshSession } from "@/lib/auth";

export async function completeLevel(levelNumber: number, score: number, stars: number) {
  const session = await getSession();
  if (!session) return { error: "Giris yapmaniz gerekiyor" };

  const level = await prisma.gameLevel.findUnique({ where: { levelNumber } });
  if (!level) return { error: "Bolum bulunamadi" };

  const existingProgress = await prisma.userProgress.findUnique({
    where: { userId_levelId: { userId: session.id, levelId: level.id } },
  });

  if (existingProgress) {
    await prisma.userProgress.update({
      where: { id: existingProgress.id },
      data: {
        completed: true,
        stars: Math.max(existingProgress.stars, stars),
        highScore: Math.max(existingProgress.highScore, score),
        attempts: existingProgress.attempts + 1,
        completedAt: new Date(),
      },
    });
  } else {
    await prisma.userProgress.create({
      data: {
        userId: session.id,
        levelId: level.id,
        completed: true,
        stars,
        highScore: score,
        attempts: 1,
        completedAt: new Date(),
      },
    });
  }

  // Update user's current level and stars
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (user) {
    const newLevel = Math.max(user.currentLevel, levelNumber + 1);
    const allProgress = await prisma.userProgress.findMany({ where: { userId: session.id } });
    const totalStars = allProgress.reduce((sum, p) => sum + p.stars, 0);

    await prisma.user.update({
      where: { id: session.id },
      data: { currentLevel: newLevel, totalStars },
    });
  }

  // Award credits for completion
  const creditReward = stars * 5;
  if (creditReward > 0) {
    await prisma.user.update({
      where: { id: session.id },
      data: { credits: { increment: creditReward } },
    });
    await prisma.creditTransaction.create({
      data: {
        userId: session.id,
        amount: creditReward,
        type: "level_reward",
        description: `Bolum ${levelNumber} tamamlandi - ${stars} yildiz`,
      },
    });
  }

  await refreshSession(session.id);
  return { success: true, creditsEarned: creditReward };
}

export async function spendCredits(amount: number, reason: string) {
  const session = await getSession();
  if (!session) return { error: "Giris yapmaniz gerekiyor" };

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || user.credits < amount) {
    return { error: "Yetersiz kredi" };
  }

  await prisma.user.update({
    where: { id: session.id },
    data: { credits: { decrement: amount } },
  });

  await prisma.creditTransaction.create({
    data: {
      userId: session.id,
      amount: -amount,
      type: "level_spend",
      description: reason,
    },
  });

  await refreshSession(session.id);
  return { success: true, remainingCredits: user.credits - amount };
}

export async function watchAd(adId: string) {
  const session = await getSession();
  if (!session) return { error: "Giris yapmaniz gerekiyor" };

  const ad = await prisma.adConfig.findUnique({ where: { id: adId } });
  if (!ad) return { error: "Reklam bulunamadi" };

  // Record ad view
  await prisma.adView.create({
    data: {
      userId: session.id,
      adId: ad.id,
      rewarded: true,
    },
  });

  // Update ad view count
  await prisma.adConfig.update({
    where: { id: ad.id },
    data: { views: { increment: 1 } },
  });

  // Reward credits
  await prisma.user.update({
    where: { id: session.id },
    data: { credits: { increment: ad.rewardCredits } },
  });

  await prisma.creditTransaction.create({
    data: {
      userId: session.id,
      amount: ad.rewardCredits,
      type: "ad_reward",
      description: `Reklam izlendi: ${ad.name}`,
    },
  });

  await refreshSession(session.id);
  return { success: true, creditsEarned: ad.rewardCredits };
}

export async function getLevelData(levelNumber: number) {
  const level = await prisma.gameLevel.findUnique({ where: { levelNumber } });
  if (!level) return null;

  const session = await getSession();
  let progress = null;
  if (session) {
    progress = await prisma.userProgress.findUnique({
      where: { userId_levelId: { userId: session.id, levelId: level.id } },
    });
  }

  return { level, progress };
}

export async function getUserProgress() {
  const session = await getSession();
  if (!session) return [];

  return prisma.userProgress.findMany({
    where: { userId: session.id },
    include: { level: true },
    orderBy: { level: { levelNumber: "asc" } },
  });
}

export async function getAvailableAds(placement: string) {
  return prisma.adConfig.findMany({
    where: { isActive: true, placement },
  });
}
