import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  metadataBase: new URL('https://readymargin.com'),
  title: { default: 'Ready Margin | Restaurant Accounting, Payroll & Finance', template: '%s | Ready Margin' },
  description:
    'Done-for-you restaurant accounting, bookkeeping, payroll and tip reporting, cash visibility, and CFO guidance for independent owners and growing groups.',
  keywords: ['managed restaurant financial operations', 'restaurant finance services', 'restaurant accounting services', 'restaurant accounting and bookkeeping', 'restaurant bookkeeping', 'restaurant payroll services', 'restaurant payroll and tips', 'restaurant tip reporting', 'restaurant financial reporting', 'restaurant financial management', 'restaurant cash flow management', 'restaurant CFO services', 'fractional CFO for restaurants', 'multi-location restaurant accounting', 'outsourced finance department for restaurants', 'financial control review'],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: {
    icon: '/ready-margin-mark.svg',
    shortcut: '/ready-margin-mark.svg',
    apple: '/ready-margin-mark.svg',
  },
  manifest: '/site.webmanifest',
  applicationName: 'Ready Margin',
  creator: 'Ready Margin',
  publisher: 'Ready Margin',
  category: 'Business services',
  openGraph: {
    title: 'Ready Margin — Restaurant Accounting, Payroll & Finance',
    description: 'Done-for-you restaurant accounting, bookkeeping, payroll and tip reporting, cash visibility, and CFO guidance for independent owners and growing groups.',
    siteName: 'Ready Margin',
    url: 'https://readymargin.com',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Ready Margin — Know where you stand.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ready Margin — Restaurant Finance, Run for You',
    description: 'Clear numbers, accountable ownership, and fewer financial surprises for independent restaurants and growing groups.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
