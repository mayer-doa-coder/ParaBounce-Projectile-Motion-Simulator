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
  title: "ParaBounce | Projectile Motion Simulator",
  description: "An interactive projectile motion simulation by the KUET_KOBE_KHULBE team",
  icons: {
    icon: [
      { url: "/images/app_icon.png", sizes: "32x32", type: "image/png" },
      { url: "/images/app_icon.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/images/app_icon.png",
    apple: "/images/app_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
