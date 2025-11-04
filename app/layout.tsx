import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/constants";
import { AuthProvider } from "@/contexts/AuthContext";
import { DonationCartProvider } from "@/contexts/DonationCartContext";
import DemoBanner from "@/components/ui/DemoBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_CONFIG.NAME,
  description: APP_CONFIG.DESCRIPTION,
  keywords: ["crowdfunding", "charity", "donations", "causes", "fundraising"],
  authors: [{ name: "CauseHive Team" }],
  creator: "CauseHive",
  publisher: "CauseHive",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: APP_CONFIG.NAME,
    description: APP_CONFIG.DESCRIPTION,
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: APP_CONFIG.NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.NAME,
    description: APP_CONFIG.DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <AuthProvider>
          <DonationCartProvider>
            <DemoBanner />
            {children}
          </DonationCartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
