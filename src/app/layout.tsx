import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KodZen Scapes - Bulmaca Oyunu",
  description: "Bulmaca coz, bahceni guzellestir! Match-3 puzzle oyunu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
