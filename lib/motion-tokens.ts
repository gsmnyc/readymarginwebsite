import type { CSSProperties } from "react";

export const motionTokens = {
  duration: { instant: 0.08, fast: 0.18, normal: 0.35, slow: 0.6 },
  easing: { smooth: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  distance: { xs: 4, sm: 8, md: 16, lg: 24 },
  scale: { subtle: 0.98, press: 0.98 },
  stagger: 0.03,
};

export const motionVariables = {
  "--motion-instant": `${motionTokens.duration.instant}s`,
  "--motion-fast": `${motionTokens.duration.fast}s`,
  "--motion-normal": `${motionTokens.duration.normal}s`,
  "--motion-slow": `${motionTokens.duration.slow}s`,
  "--motion-ease": `cubic-bezier(${motionTokens.easing.smooth.join(",")})`,
  "--motion-step": `${motionTokens.stagger}s`,
  "--motion-distance": `${motionTokens.distance.sm}px`,
  "--motion-press": motionTokens.scale.press,
  "--fast": `${motionTokens.duration.fast}s`,
  "--standard": `${motionTokens.duration.normal}s`,
  "--reveal": `${motionTokens.duration.slow}s`,
  "--ease": `cubic-bezier(${motionTokens.easing.smooth.join(",")})`,
} as CSSProperties;
