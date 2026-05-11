import { redirect } from "next/navigation";
import Link from "next/link";
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

  return (
    <div className="min-h-screen game-gradient">
      <header className="p-4 flex justify-between items-center border-b border-gray-700/50">
        <Link href="/" className="text-xl font-bold text-emerald-400">KodZen Scapes</Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800/80 px-3 py-1.5 rounded-lg">
            <span className="text-yellow-400">⭐</span>
            <span className="text-white font-bold">{user.totalStars}</span>
          </div>
          <Link href="/oyun" className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
            Oyna
          </Link>
        </div>
      </header>

      <GardenClient
        totalStars={user.totalStars}
        gardenItems={gardenItems}
        userItems={userGardenItems.map(ui => ({
          id: ui.id,
          itemId: ui.itemId,
          name: ui.item.name,
          category: ui.item.category,
          posX: ui.posX,
          posY: ui.posY,
          placed: ui.placed,
        }))}
        userId={user.id}
      />
    </div>
  );
}
