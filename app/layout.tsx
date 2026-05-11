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

const siteUrl = 'https://manemori.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'まねもり - 日々の出費を記録',
    template: '%s - まねもり',
  },
  description: '日々の出費を記録し、月の予算からの残額をリアルタイムで確認できるWebアプリ。シンプルに素早く出費を記録できます。',
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/manemori-logo_icon.png',
    shortcut: '/manemori-logo_icon.png',
    apple: '/manemori-logo_square.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteUrl,
    siteName: 'まねもり',
    title: 'まねもり - 日々の出費を記録',
    description: '日々の出費を記録し、月の予算からの残額をリアルタイムで確認できるWebアプリ',
    images: [
      {
        url: '/manemori-logo_square.png',
        width: 1200,
        height: 1200,
        alt: 'まねもり',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'まねもり - 日々の出費を記録',
    description: '日々の出費を記録し、月の予算からの残額をリアルタイムで確認できるWebアプリ',
    images: ['/manemori-logo_square.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
