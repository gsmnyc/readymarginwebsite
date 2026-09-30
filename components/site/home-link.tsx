"use client";
import Link from "./link";
import type { ComponentProps } from "react";
import { motionAllowed } from "./motion-utils";

export function HomeLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  return <Link {...props} href="/" onClick={event => {
    props.onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || window.location.pathname !== "/") return;
    event.preventDefault();
    window.history.replaceState(window.history.state, "", "/");
    window.scrollTo({ top: 0, behavior: motionAllowed() ? "smooth" : "instant" });
    document.querySelector<HTMLElement>("#main")?.focus({ preventScroll: true });
  }} />;
}
