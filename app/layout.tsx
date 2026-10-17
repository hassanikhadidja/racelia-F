import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://racelia.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "RACÈLIA",
  description: "Découvrez une sélection de L’ART DU GESTE Collection 2026.",
  openGraph: {
    title: "RACÈLIA",
    description: "Découvrez une sélection de L’ART DU GESTE Collection 2026.",
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
    description: "Découvrez une sélection de L’ART DU GESTE Collection 2026.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("raceliaHighContrast")==="1")document.documentElement.classList.add("high-contrast")}catch(e){}try{var h=location.hash.replace(/^#/,"");if(h&&h!=="home")document.documentElement.classList.add("lcp-off")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
