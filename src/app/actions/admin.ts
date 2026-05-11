"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ============ SETTINGS ============

export async function getGameSettings() {
  let settings = await prisma.gameSettings.findUnique({ where: { id: "default" } });
  if (!settings) {
    settings = await prisma.gameSettings.create({ data: { id: "default" } });
  }
  return settings;
}

export async function updateGameSettings(formData: FormData) {
  await requireAdmin();

  const data: Record<string, any> = {};
  const fields = [
    "gameName", "gameDescription", "logoUrl", "welcomeMessage",
    "primaryColor", "secondaryColor", "googleAdsClientId",
  ];
  const intFields = [
    "initialCredits", "dailyBonusCredits", "adRewardCredits",
    "adGateLevelStart", "forceAdLevelStart", "waitTimeMinutes",
    "maxLives", "lifeRegenMinutes",
  ];
  const boolFields = ["googleAdsEnabled", "maintenanceMode"];

  for (const field of fields) {
    const val = formData.get(field);
    if (val !== null) data[field] = val as string;
  }
  for (const field of intFields) {
    const val = formData.get(field);
    if (val !== null && val !== "") data[field] = parseInt(val as string, 10);
  }
  for (const field of boolFields) {
    data[field] = formData.get(field) === "on";
  }

  await prisma.gameSettings.update({ where: { id: "default" }, data });
  revalidatePath("/admin/ayarlar");
  return { success: true };
}

// ============ USERS ============

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      credits: true,
      totalStars: true,
      currentLevel: true,
      createdAt: true,
    },
  });
}

export async function grantCredits(userId: string, amount: number, description: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
  });

  await prisma.creditTransaction.create({
    data: {
      userId,
      amount,
      type: "admin_grant",
      description: description || "Admin tarafindan verildi",
    },
  });

  revalidatePath("/admin/kullanicilar");
  return { success: true };
}

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/kullanicilar");
  return { success: true };
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/kullanicilar");
  return { success: true };
}

export async function resetUserProgress(userId: string) {
  await requireAdmin();
  await prisma.userProgress.deleteMany({ where: { userId } });
  await prisma.user.update({
    where: { id: userId },
    data: { currentLevel: 1, totalStars: 0 },
  });
  revalidatePath("/admin/kullanicilar");
  return { success: true };
}

// ============ LEVELS ============

export async function getLevels() {
  return prisma.gameLevel.findMany({ orderBy: { levelNumber: "asc" } });
}

export async function updateLevel(levelId: string, formData: FormData) {
  await requireAdmin();

  const data: Record<string, any> = {};
  const intFields = ["moves", "targetScore", "gemTypes", "gridRows", "gridCols", "blockerCount", "waitTimeMinutes", "creditCost"];
  const boolFields = ["hasBlockers", "requiresAd", "requiresCredit", "isActive"];

  const difficulty = formData.get("difficulty");
  if (difficulty) data.difficulty = difficulty as string;

  const starThresholds = formData.get("starThresholds");
  if (starThresholds) data.starThresholds = starThresholds as string;

  for (const field of intFields) {
    const val = formData.get(field);
    if (val !== null && val !== "") data[field] = parseInt(val as string, 10);
  }
  for (const field of boolFields) {
    data[field] = formData.get(field) === "on";
  }

  await prisma.gameLevel.update({ where: { id: levelId }, data });
  revalidatePath("/admin/bolumler");
  return { success: true };
}

// ============ ADS ============

export async function getAds() {
  return prisma.adConfig.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createAd(formData: FormData) {
  await requireAdmin();

  await prisma.adConfig.create({
    data: {
      name: formData.get("name") as string,
      adType: formData.get("adType") as string,
      provider: formData.get("provider") as string || "google",
      adUnitId: formData.get("adUnitId") as string || null,
      customVideoUrl: formData.get("customVideoUrl") as string || null,
      customImageUrl: formData.get("customImageUrl") as string || null,
      customLinkUrl: formData.get("customLinkUrl") as string || null,
      rewardCredits: parseInt(formData.get("rewardCredits") as string || "10", 10),
      placement: formData.get("placement") as string,
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidatePath("/admin/reklamlar");
  return { success: true };
}

export async function updateAd(adId: string, formData: FormData) {
  await requireAdmin();

  await prisma.adConfig.update({
    where: { id: adId },
    data: {
      name: formData.get("name") as string,
      adType: formData.get("adType") as string,
      provider: formData.get("provider") as string || "google",
      adUnitId: formData.get("adUnitId") as string || null,
      customVideoUrl: formData.get("customVideoUrl") as string || null,
      customImageUrl: formData.get("customImageUrl") as string || null,
      customLinkUrl: formData.get("customLinkUrl") as string || null,
      rewardCredits: parseInt(formData.get("rewardCredits") as string || "10", 10),
      placement: formData.get("placement") as string,
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidatePath("/admin/reklamlar");
  return { success: true };
}

export async function deleteAd(adId: string) {
  await requireAdmin();
  await prisma.adConfig.delete({ where: { id: adId } });
  revalidatePath("/admin/reklamlar");
  return { success: true };
}

// ============ CREDITS ============

export async function getCreditTransactions(userId?: string) {
  const where = userId ? { userId } : {};
  return prisma.creditTransaction.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

// ============ STATS ============

export async function getAdminStats() {
  const totalUsers = await prisma.user.count();
  const totalLevels = await prisma.gameLevel.count();
  const totalCreditsSpent = await prisma.creditTransaction.aggregate({
    _sum: { amount: true },
    where: { amount: { lt: 0 } },
  });
  const totalAdViews = await prisma.adView.count();
  const activeAds = await prisma.adConfig.count({ where: { isActive: true } });
  const completedLevels = await prisma.userProgress.count({ where: { completed: true } });

  return {
    totalUsers,
    totalLevels,
    totalCreditsSpent: Math.abs(totalCreditsSpent._sum.amount || 0),
    totalAdViews,
    activeAds,
    completedLevels,
  };
}
