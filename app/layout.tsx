import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./micro-interactions.css";
import "./form-responsive.css";
import "./editorial.css";
import { getContent } from "@/lib/content";
import {
  SiteHeader,
  CookieConsent,
  AnalyticsListener,
  MotionPreference,
} from "@/components/site/shell";
import { ChoreographyLoader } from "@/components/site/choreography-loader";
import { Footer } from "@/components/site/static";
import { Telemetry } from "@/components/site/telemetry";

const jakarta = localFont({
  src: "../public/fonts/PlusJakartaSans-variable.woff2",
  weight: "400 800",
  display: "swap",
  variable: "--font-jakarta",
  preload: true,
});

export const metadata: Metadata = {
  title: { default: "Ready Margin", template: "%s | Ready Margin" },
  description:
    "Managed restaurant finance, accounting, payroll, tax workflow and operations support.",
  manifest: "/manifest.webmanifest?v=20260912",
  icons: {
    icon: [
      { url: "/favicon.ico?v=20260912", type: "image/x-icon" },
      { url: "/favicon_16.png?v=20260912", sizes: "16x16", type: "image/png" },
      { url: "/favicon_32.png?v=20260912", sizes: "32x32", type: "image/png" },
      { url: "/favicon_48.png?v=20260912", sizes: "48x48", type: "image/png" },
      { url: "/favicon_64.png?v=20260912", sizes: "64x64", type: "image/png" },
    ],
    apple: [{ url: "/favicon_180.png?v=20260912", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var n=navigator,d=document.documentElement;var off=new URLSearchParams(location.search).get('motion')==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches||(n.connection&&n.connection.saveData);if(off||sessionStorage.getItem('rm-motion')==='off')d.dataset.motion='off'}catch(e){}`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader settings={content.settings} />
        {children}
        <Footer content={content} />
        <CookieConsent />
        <MotionPreference />
        <ChoreographyLoader />
        <AnalyticsListener />
        {process.env.VERCEL === "1" && <Telemetry />}
        <noscript>
          <style>{".reveal,.motion-step{opacity:1!important;transform:none!important}.mobile-nav-fallback{display:block!important}.js-only,.desk-phases{display:none!important}.operating-desk *{animation:none!important}.faq [data-slot=accordion-content]{display:block!important}.carousel-track{display:grid!important;grid-template-columns:1fr!important;transform:none!important}.carousel-viewport{overflow:visible!important}"}</style>
        </noscript>
      </body>
    </html>
  );
}
