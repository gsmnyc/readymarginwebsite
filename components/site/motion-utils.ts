export function motionAllowed() {
  if (typeof window === "undefined") return false;
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    document.documentElement.dataset.motion !== "off" &&
    document.documentElement.dataset.keyboard !== "true" &&
    new URLSearchParams(window.location.search).get("motion") !== "off"
  );
}

export function lightMotion() {
  if (typeof navigator === "undefined") return true;
  const device = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return Boolean(
    device.connection?.saveData ||
      (device.deviceMemory && device.deviceMemory < 4),
  );
}
