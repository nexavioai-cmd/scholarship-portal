import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scholarship-portal-coral.vercel.app"),

  title: {
    default: "Scholarship Hub",
    template: "%s | Scholarship Hub",
  },

  description:
    "Temukan beasiswa internasional, fully funded scholarship, beasiswa S1, S2, S3, dan peluang studi luar negeri terbaru.",

  keywords: [
    "scholarship",
    "beasiswa",
    "fully funded scholarship",
    "beasiswa luar negeri",
    "study abroad",
    "scholarship indonesia",
    "master scholarship",
    "phd scholarship",
  ],

  authors: [
    {
      name: "Scholarship Hub",
    },
  ],

  creator: "Scholarship Hub",

  openGraph: {
    title: "Scholarship Hub",
    description:
      "Temukan beasiswa internasional dan peluang studi luar negeri terbaru.",
    url: "https://scholarship-portal-coral.vercel.app",
    siteName: "Scholarship Hub",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scholarship Hub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Scholarship Hub",
    description:
      "Temukan beasiswa internasional dan peluang studi luar negeri.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}