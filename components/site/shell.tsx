"use client";

import Link from "@/components/site/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Settings } from "@/lib/content";
import { track } from "@/lib/analytics";
import { Moon, Sun, X } from "lucide-react";
import { HomeLink } from "./home-link";
import { motionTokens } from "@/lib/motion-tokens";
import { lightMotion, motionAllowed } from "./motion-utils";
import { serviceGroups } from "@/content/service-navigation";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const update = () => setDark(document.documentElement.dataset.theme === "dark");
    update();
    window.addEventListener("rm-theme-change", update);
    return () => window.removeEventListener("rm-theme-change", update);
  }, []);
  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("rm-theme", next); } catch { /* Keep the current visit usable without storage. */ }
    window.dispatchEvent(new Event("rm-theme-change"));
  }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun size={19} strokeWidth={1.7} aria-hidden="true" /> : <Moon size={19} strokeWidth={1.7} aria-hidden="true" />}</button>;
}

const companyRoutes = [
  { label: "About Ready Margin", href: "/about" },
  { label: "New York restaurants", href: "/new-york" },
  { label: "Contact us", href: "/contact" },
] as const;

export function SiteHeader({ settings }: { settings: Settings }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); document.body.style.overflow = ""; }, []);
  useEffect(() => {
    const footer = document.querySelector("footer");
    const observer = new IntersectionObserver(entries => setFooterVisible(entries[0]?.isIntersecting ?? false));
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, [path]);

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
    ...serviceGroups.flatMap(group => group.links),
    { label: "All restaurant finance services", href: "/restaurant-finance-services" },
    ...companyRoutes,
  ].filter((item, index, all) => all.findIndex((candidate) => candidate.href === item.href) === index);

  function openMenu() {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (!menu.current?.open) menu.current?.showModal();
    document.body.style.overflow = "hidden";
    setMenuOpen(true);
  }

  function closeMenu() {
    if (!menu.current?.open || closeTimer.current) return;
    setMenuOpen(false);
    if (!motionAllowed() || lightMotion()) { menu.current.close(); return; }
    closeTimer.current = setTimeout(() => {
      menu.current?.close();
      closeTimer.current = null;
    }, motionTokens.duration.fast * 1000);
  }

  return (
    <>
      <header
        className={`site-header ${scrolled ? "scrolled" : ""}`}
      >
        <div className="header-inner">
          <HomeLink className="brand-link" aria-label="Ready Margin home">
            <Image
              className="logo-light"
              src="/brand/logo_horizontal_primary_transparent.svg"
              width={220}
              height={52}
              sizes="(max-width: 1023px) 190px, 220px"
              alt="Ready Margin"
            />
            <Image className="logo-dark" src="/brand/logo_horizontal_primary_mono_white.svg" width={220} height={52} sizes="(max-width: 1023px) 190px, 220px" alt="Ready Margin" />
          </HomeLink>

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

          <div className="header-actions">
          <Link href="/book-a-review" className="button header-cta" data-cta>
            {settings.cta}<span aria-hidden="true">↗</span>
          </Link>

          <ThemeToggle />

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
        </div>
      </header>

      <dialog
        ref={menu}
        id="ready-margin-mobile-nav"
        className="mobile-drawer"
        aria-labelledby="mobile-nav-title"
        aria-describedby="mobile-nav-description"
        data-state={menuOpen ? "open" : "closed"}
        onCancel={(event) => { event.preventDefault(); closeMenu(); }}
        onClose={() => {
          document.body.style.overflow = "";
          setMenuOpen(false);
          menuTrigger.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
        }}
      >
        <button className="mobile-drawer-close" type="button" aria-label="Close navigation" onClick={closeMenu}><X size={20} strokeWidth={1.7} aria-hidden="true" /></button>
        <h2 id="mobile-nav-title">Ready Margin</h2>
        <p id="mobile-nav-description">Find the support your restaurant needs.</p>
        <nav aria-label="Main menu" className="drawer-primary">
          {settings.navigation.map(item => <Link href={item.href} key={item.href} onClick={closeMenu}>{item.label}<span aria-hidden="true">↗</span></Link>)}
        </nav>
        <div className="drawer-services">
          <Link className="drawer-all-services" href="/restaurant-finance-services" onClick={closeMenu}>All restaurant finance services <span aria-hidden="true">↗</span></Link>
          {serviceGroups.map((group,index) => <details key={group.title} className="drawer-group" open={index === 0}><summary>{group.title}<span aria-hidden="true">+</span></summary><nav aria-label={group.title + " services"}>{group.links.map(item => <Link key={item.href} href={item.href} onClick={closeMenu}>{item.label}<span aria-hidden="true">↗</span></Link>)}</nav></details>)}
        </div>
        <nav aria-label="Ready Margin company" className="drawer-company">
          {companyRoutes.map(item => <Link href={item.href} key={item.href} onClick={closeMenu}>{item.label}<span aria-hidden="true">↗</span></Link>)}
        </nav>
        <Link className="button drawer-primary-cta" href="/book-a-review" data-cta onClick={closeMenu}>
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
        <Link className="mobile-cta" href="/book-a-review" data-cta data-footer-visible={footerVisible}>
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
