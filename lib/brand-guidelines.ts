import guidelines from "@/content/brand-guidelines.json";

export const brandGuidelines = guidelines;

export function contrastRatio(a: string, b: string) {
  const luminance = (hex: string) => {
    const rgb = hex.replace("#", "").match(/.{2}/g)!.map((part) => {
      const value = parseInt(part, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export function swatchText(hex: string) {
  return contrastRatio(hex, "#222222") >= 4.5 ? "#222222" : "#F4F1E8";
}
