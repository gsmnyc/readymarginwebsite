"use client";

import Link from "@/components/site/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Settings } from "@/lib/content";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const run = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 40);
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

  function openMenu() {
    if (!menu.current?.open) menu.current?.showModal();
    setMenuOpen(true);
  }

  function closeMenu() {
    if (menu.current?.open) menu.current.close();
  }

  return (
    <>
      <header
        className={`site-header ${scrolled ? "scrolled" : ""}`}
      >
        <div className="header-inner">
          <Link href="/" className="brand-link" aria-label="Ready Margin home">
            <Image
              src="/brand/logo_horizontal_primary_transparent.svg"
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

          <button
            className="menu-button js-only"
            ref={menuTrigger}
            type="button"
            aria-label="Open navigation"
            aria-controls="ready-margin-mobile-nav"
            aria-expanded={menuOpen}
            data-state={menuOpen ? "open" : "closed"}
            onClick={openMenu}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <dialog
        ref={menu}
        id="ready-margin-mobile-nav"
        className="mobile-drawer"
        aria-labelledby="mobile-nav-title"
        aria-describedby="mobile-nav-description"
        data-state={menuOpen ? "open" : "closed"}
        onClose={() => {
          setMenuOpen(false);
          menuTrigger.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <button className="mobile-drawer-close" type="button" aria-label="Close navigation" onClick={closeMenu}>×</button>
        <h2 id="mobile-nav-title">Ready Margin</h2>
        <p id="mobile-nav-description">Find the work, problem or guide you need.</p>
        <nav aria-label="Mobile navigation">
          {drawerLinks.map((item) => (
            <Link href={item.href} key={item.href} onClick={closeMenu}>
              {item.label}<span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <Link className="button" href="/book-a-review" data-cta onClick={closeMenu}>
          {settings.cta}
        </Link>
      </dialog>

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
        <Link href="/legal/cookies">Cookie details</Link>
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
