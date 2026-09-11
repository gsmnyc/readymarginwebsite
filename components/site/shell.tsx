"use client";
import Link from "@/components/site/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Settings } from "@/lib/content";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { track } from "@/lib/analytics";
export function SiteHeader({ settings }: { settings: Settings }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const run = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 40);
        const hero = document.getElementById("home-hero");
        setSettled(!hero || hero.getBoundingClientRect().top < 120);
      });
    };
    run();
    window.addEventListener("scroll", run, { passive: true });
    return () => {
      window.removeEventListener("scroll", run);
      window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <>
      <header
        className={`site-header ${scrolled ? "scrolled" : ""} ${path === "/" ? "home-header" : ""} ${settled ? "settled" : ""}`}
      >
        <div className="header-inner">
          <Link href="/" className="brand-link" aria-label="Ready Margin home">
            <Image
              src={
                path === "/" && !settled
                  ? "/brand/logo_horizontal_primary_dark.svg"
                  : "/brand/logo_horizontal_primary_transparent.svg"
              }
              width={220}
              height={52}
              sizes="(max-width: 1023px) 190px, 220px"
              alt="Ready Margin"
            />
          </Link>
          <nav aria-label="Main navigation" className="desktop-nav">
            {settings.navigation.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={path.startsWith(n.href) ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/book-a-review" className="button header-cta" data-cta>
            {settings.cta}
            <span aria-hidden="true">↗</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="menu-button js-only"
                aria-label="Open navigation"
                aria-controls="ready-margin-mobile-nav"
              >
                <span></span>
                <span></span>
              </button>
            </SheetTrigger>
            <SheetContent id="ready-margin-mobile-nav" className="mobile-drawer">
              <SheetTitle>Ready Margin</SheetTitle>
              <SheetDescription>
                Find the work you need help with.
              </SheetDescription>
              <nav aria-label="Mobile navigation">
                {[
                  ...settings.navigation,
                  { label: "Pricing", href: "/pricing" },
                  {
                    label: "Margin Clarity Check",
                    href: "/margin-clarity-check",
                  },
                  { label: "About", href: "/about" },
                  { label: "Search", href: "/search" },
                ].map((n) => (
                  <SheetClose asChild key={n.href}>
                    <Link href={n.href}>
                      {n.label}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <Link className="button" href="/book-a-review" data-cta>
                  {settings.cta}
                </Link>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <details className="mobile-nav-fallback">
        <summary>Navigation</summary>
        <nav>
          {settings.navigation.map((n) => (
            <Link href={n.href} key={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
      </details>
      {path !== "/book-a-review" && path !== "/contact" && (
        <Link className="mobile-cta" href="/book-a-review" data-cta>
          {settings.cta}
          <span aria-hidden="true">↗</span>
        </Link>
      )}
    </>
  );
}
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const hasConsent = useSyncExternalStore(
    (onStoreChange) => {
      const update = () => onStoreChange();
      window.addEventListener("rm-consent", update);
      window.addEventListener("storage", update);
      return () => {
        window.removeEventListener("rm-consent", update);
        window.removeEventListener("storage", update);
      };
    },
    () => {
      try {
        return Boolean(localStorage.getItem("rm-consent"));
      } catch {
        return false;
      }
    },
    () => true,
  );
  useEffect(() => {
    const openChoices = () => setOpen(true);
    window.addEventListener("rm-cookie-choices", openChoices);
    return () => window.removeEventListener("rm-cookie-choices", openChoices);
  }, []);
  const show = open || !hasConsent;
  function choose(v: string) {
    try {
      localStorage.setItem("rm-consent", v);
      window.dispatchEvent(new Event("rm-consent"));
    } catch {
      // Storage can be unavailable in a locked-down browser.
    }
    setOpen(false);
  }
  return show ? (
    <aside className="cookie-panel" aria-label="Cookie choices">
      <p>
        <strong>Your visit, your choice.</strong> Optional analytics help us
        understand useful journeys. Form details stay out of analytics.
      </p>
      <div>
        <button onClick={() => choose("reject")}>Reject optional</button>
        <button onClick={() => choose("allow")}>Allow optional</button>
        <Link href="/legal/cookies">Details</Link>
      </div>
    </aside>
  ) : null;
}
export function CookieButton() {
  return (
    <button
      className="footer-button"
      onClick={() => window.dispatchEvent(new Event("rm-cookie-choices"))}
    >
      Cookie choices
    </button>
  );
}
export function MotionPreference() {
  useEffect(() => {
    document.documentElement.dataset.ready = "true";
    const url = new URL(location.href);
    if (url.searchParams.get("motion") === "off")
      document.documentElement.dataset.motion = "off";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Tab") document.documentElement.dataset.keyboard = "true";
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  return null;
}
export function AnalyticsListener() {
  const path = usePathname();
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a");
      if (a?.hasAttribute("data-cta")) track("cta_click");
      if (a?.getAttribute("href")?.startsWith("/case-studies/"))
        track("case_open");
      if (a?.hasAttribute("download")) track("resource_download");
    };
    document.addEventListener("click", click);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            track("cta_view");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.7 },
    );
    document.querySelectorAll("[data-cta]").forEach((e) => observer.observe(e));
    return () => {
      document.removeEventListener("click", click);
      observer.disconnect();
    };
  }, [path]);
  return null;
}
