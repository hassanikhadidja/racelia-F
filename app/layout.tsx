import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RACÈLIA",
  description: "Découvrez une sélection de la collection Métiers d'Art 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
