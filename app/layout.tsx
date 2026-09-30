import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./micro-interactions.css";
import "./form-responsive.css";
import "./editorial.css";
import "./brand-colors.css";
import "./site-refresh.css";
import "./motion-polish.css";
import "./site-refinement.css";
import { motionVariables } from "@/lib/motion-tokens";
import { getContent, siteOrigin } from "@/lib/content";
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
  metadataBase: new URL(siteOrigin()),
  applicationName: "Ready Margin",
  title: { default: "Restaurant Accounting & Payroll Services | Ready Margin", template: "%s | Ready Margin" },
  description:
    "Ready Margin handles restaurant bookkeeping, accounting and payroll preparation, with financial review for owners and operators.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon_16.png", sizes: "16x16" },
      { url: "/favicon_32.png", sizes: "32x32" },
      { url: "/favicon_48.png", sizes: "48x48" },
      { url: "/favicon_64.png", sizes: "64x64" },
    ],
    apple: "/favicon_180.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="en" className={jakarta.variable} style={motionVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var saved=localStorage.getItem('rm-theme');document.documentElement.dataset.theme=saved==='light'||saved==='dark'?saved:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}` }} />
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
