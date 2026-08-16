import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://racelia.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "RACÈLIA",
  description: "Découvrez une sélection de la collection Métiers d'Art 2026.",
  openGraph: {
    title: "RACÈLIA",
    description: "Découvrez une sélection de la collection Métiers d'Art 2026.",
    siteName: "RACÈLIA",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 512,
        height: 512,
        alt: "Logo RACÈLIA",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "RACÈLIA",
    description: "Découvrez une sélection de la collection Métiers d'Art 2026.",
    images: ["/og.png"],
  },
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
