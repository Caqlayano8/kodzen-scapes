import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Giris yapmaniz gerekiyor" }, { status: 401 });
  }

  const { itemId } = await request.json();

  const item = await prisma.gardenItem.findUnique({ where: { id: itemId } });
  if (!item) {
    return NextResponse.json({ error: "Esya bulunamadi" }, { status: 404 });
  }

  const existing = await prisma.userGardenItem.findFirst({
    where: { userId: session.id, itemId },
  });
  if (existing) {
    return NextResponse.json({ error: "Bu esyaya zaten sahipsiniz" }, { status: 400 });
  }

  const userGardenItem = await prisma.userGardenItem.create({
    data: {
      userId: session.id,
      itemId,
      placed: true,
    },
  });

  return NextResponse.json({ success: true, id: userGardenItem.id });
}
