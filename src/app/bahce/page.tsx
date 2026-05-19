import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import GardenClient from "./GardenClient";

export default async function GardenPage() {
  const session = await getSession();
  if (!session) redirect("/giris");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/giris");

  const gardenItems = await prisma.gardenItem.findMany({
    where: { isActive: true },
    orderBy: { cost: "asc" },
  });

  const userGardenItems = await prisma.userGardenItem.findMany({
    where: { userId: session.id },
    include: { item: true },
  });

  const items = gardenItems.map(gi => ({
    id: gi.id,
    name: gi.name,
    emoji: gi.emoji,
    starsRequired: gi.cost,
    category: gi.category,
  }));

  const placedItems = userGardenItems
    .filter(ui => ui.placed)
    .map(ui => ({
      id: ui.id,
      itemId: ui.itemId,
      gridX: ui.posX,
      gridY: ui.posY,
    }));

  return (
    <GardenClient
      items={items}
      placedItems={placedItems}
      userStars={user.totalStars}
      userCredits={user.credits}
    />
  );
}
