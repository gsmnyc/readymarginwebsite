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

const popularRoutes = [
  { label: "Restaurant finance services", href: "/restaurant-finance-services" },
  { label: "Restaurant accounting", href: "/restaurant-accounting-services" },
  { label: "Restaurant payroll", href: "/restaurant-payroll-services" },
  { label: "Tax & compliance support", href: "/restaurant-tax-services" },
  { label: "Turnaround consulting", href: "/restaurant-turnaround-consulting" },
  { label: "Problems we help solve", href: "/restaurant-finance-solutions" },
  { label: "Useful reading", href: "/insights" },
] as const;

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

  const drawerLinks = [
    ...settings.navigation,
    ...popularRoutes,
    { label: "Pricing", href: "/pricing" },
    { label: "Margin Clarity Check", href: "/margin-clarity-check" },
    { label: "About", href: "/about" },
    { label: "Search", href: "/search" },
  ].filter((item, index, all) => all.findIndex((candidate) => candidate.href === item.href) === index);

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
            {settings.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={path.startsWith(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/book-a-review" className="button header-cta" data-cta>
            {settings.cta}<span aria-hidden="true">↗</span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <button
                className="menu-button js-only"
                aria-label="Open navigation"
                aria-controls="ready-margin-mobile-nav"
              >
                <span />
                <span />
              </button>
            </SheetTrigger>
            <SheetContent id="ready-margin-mobile-nav" className="mobile-drawer">
              <SheetTitle>Ready Margin</SheetTitle>
              <SheetDescription>Find the work, problem or guide you need.</SheetDescription>
              <nav aria-label="Mobile navigation">
                {drawerLinks.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href}>
                      {item.label}<span aria-hidden="true">↗</span>
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
          {drawerLinks.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
      </details>

      {path !== "/book-a-review" && path !== "/contact" && (
        <Link className="mobile-cta" href="/book-a-review" data-cta>
          {settings.cta}<span aria-hidden="true">↗</span>
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
  function choose(value: string) {
    try {
      localStorage.setItem("rm-consent", value);
      window.dispatchEvent(new Event("rm-consent"));
    } catch {
      // Storage can be unavailable in a locked-down browser.
    }
    setOpen(false);
  }

  return show ? (
    <aside className="cookie-panel" aria-label="Cookie choices">
      <p>
        <strong>Your visit, your choice.</strong> Optional analytics help us understand useful journeys. Form details stay out of analytics.
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
    if (url.searchParams.get("motion") === "off") document.documentElement.dataset.motion = "off";
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab") document.documentElement.dataset.keyboard = "true";
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  return null;
}

export function AnalyticsListener() {
  const path = usePathname();
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest("a");
      if (anchor?.hasAttribute("data-cta")) track("cta_click");
      if (anchor?.getAttribute("href")?.startsWith("/case-studies/")) track("case_open");
      if (anchor?.hasAttribute("download")) track("resource_download");
    };
    document.addEventListener("click", click);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            track("cta_view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.7 },
    );
    document.querySelectorAll("[data-cta]").forEach((element) => observer.observe(element));

    return () => {
      document.removeEventListener("click", click);
      observer.disconnect();
    };
  }, [path]);
  return null;
}
