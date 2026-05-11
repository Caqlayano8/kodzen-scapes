"use server";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Tum alanlar zorunludur" };
  }

  if (password.length < 6) {
    return { error: "Sifre en az 6 karakter olmalidir" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Bu email zaten kayitli" };
  }

  const hashedPassword = await hashPassword(password);

  const settings = await prisma.gameSettings.findUnique({ where: { id: "default" } });
  const initialCredits = settings?.initialCredits || 100;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      credits: initialCredits,
    },
  });

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    credits: user.credits,
  });

  redirect("/oyun");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email ve sifre zorunludur" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Email veya sifre hatali" };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { error: "Email veya sifre hatali" };
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    credits: user.credits,
  });

  if (user.role === "admin") {
    redirect("/admin");
  }
  redirect("/oyun");
}

export async function logoutAction() {
  await destroySession();
  redirect("/giris");
}
