import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@kodzenscapes.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@kodzenscapes.com",
      password: adminPassword,
      role: "admin",
      credits: 99999,
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash("user123", 12);
  await prisma.user.upsert({
    where: { email: "test@kodzenscapes.com" },
    update: {},
    create: {
      name: "Test Oyuncu",
      email: "test@kodzenscapes.com",
      password: userPassword,
      role: "user",
      credits: 100,
    },
  });

  // Create 60 levels
  for (let i = 1; i <= 60; i++) {
    let difficulty = "easy";
    let moves = 30;
    let targetScore = 1000;
    let gemTypes = 5;
    let hasBlockers = false;
    let blockerCount = 0;
    let requiresAd = false;
    let requiresCredit = false;
    let waitTimeMinutes = 0;
    let creditCost = 0;

    if (i <= 15) {
      difficulty = "easy";
      moves = 30 - Math.floor(i / 5);
      targetScore = 800 + i * 100;
      gemTypes = 5;
      if (i > 10) {
        hasBlockers = true;
        blockerCount = (i - 10) * 2;
      }
    } else if (i <= 40) {
      difficulty = "medium";
      moves = 25 - Math.floor((i - 15) / 10);
      targetScore = 1500 + (i - 15) * 150;
      gemTypes = 6;
      hasBlockers = true;
      blockerCount = 5 + Math.floor((i - 15) / 3);
      if (i >= 15 && i < 20) {
        requiresAd = false;
        waitTimeMinutes = 120;
      }
      if (i >= 20) {
        requiresAd = true;
        requiresCredit = true;
        creditCost = 5 + Math.floor((i - 20) / 5);
      }
    } else {
      difficulty = "hard";
      moves = 20 - Math.floor((i - 40) / 10);
      targetScore = 3000 + (i - 40) * 200;
      gemTypes = 7;
      hasBlockers = true;
      blockerCount = 10 + Math.floor((i - 40) / 2);
      requiresAd = true;
      requiresCredit = true;
      creditCost = 10 + Math.floor((i - 40) / 3);
    }

    moves = Math.max(moves, 12);

    const star1 = targetScore;
    const star2 = Math.floor(targetScore * 1.5);
    const star3 = targetScore * 2;

    await prisma.gameLevel.upsert({
      where: { levelNumber: i },
      update: {},
      create: {
        levelNumber: i,
        difficulty,
        gridRows: i > 50 ? 9 : 8,
        gridCols: i > 50 ? 9 : 8,
        moves,
        targetScore,
        gemTypes,
        starThresholds: `${star1},${star2},${star3}`,
        hasBlockers,
        blockerCount,
        requiresAd,
        requiresCredit,
        waitTimeMinutes,
        creditCost,
      },
    });
  }

  // Create game settings
  await prisma.gameSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      gameName: "KodZen Scapes",
      gameDescription: "Bulmaca coz, bahceni guzellestir!",
      initialCredits: 100,
      dailyBonusCredits: 10,
      adRewardCredits: 15,
      adGateLevelStart: 15,
      forceAdLevelStart: 20,
      waitTimeMinutes: 120,
    },
  });

  // Create sample ads
  const adData = [
    { name: "Seviye Arasi Reklam", adType: "video", provider: "google", rewardCredits: 15, placement: "level_gate", isActive: true },
    { name: "Bonus Odul Reklam", adType: "video", provider: "google", rewardCredits: 20, placement: "bonus_reward", isActive: true },
    { name: "Banner Reklam", adType: "banner", provider: "google", rewardCredits: 5, placement: "between_levels", isActive: true },
  ];
  for (const ad of adData) {
    const existing = await prisma.adConfig.findFirst({ where: { name: ad.name } });
    if (!existing) await prisma.adConfig.create({ data: ad });
  }

  // Create garden items
  const gardenData = [
    { name: "Gul Bahcesi", category: "flower", imageUrl: "/garden/rose.svg", cost: 3, unlockLevel: 1 },
    { name: "Lale Tarlasi", category: "flower", imageUrl: "/garden/tulip.svg", cost: 5, unlockLevel: 3 },
    { name: "Cinar Agaci", category: "tree", imageUrl: "/garden/tree.svg", cost: 8, unlockLevel: 5 },
    { name: "Havuz", category: "fountain", imageUrl: "/garden/pool.svg", cost: 15, unlockLevel: 10 },
    { name: "Bank", category: "bench", imageUrl: "/garden/bench.svg", cost: 4, unlockLevel: 2 },
    { name: "Heykel", category: "statue", imageUrl: "/garden/statue.svg", cost: 20, unlockLevel: 15 },
    { name: "Yol", category: "path", imageUrl: "/garden/path.svg", cost: 2, unlockLevel: 1 },
    { name: "Fener", category: "light", imageUrl: "/garden/light.svg", cost: 6, unlockLevel: 7 },
    { name: "Salincak", category: "bench", imageUrl: "/garden/swing.svg", cost: 10, unlockLevel: 8 },
    { name: "Cicek Kemeri", category: "flower", imageUrl: "/garden/arch.svg", cost: 12, unlockLevel: 12 },
  ];
  for (const item of gardenData) {
    const existing = await prisma.gardenItem.findFirst({ where: { name: item.name } });
    if (!existing) await prisma.gardenItem.create({ data: item });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
