import type { Metadata } from "next";
import { BrandGuide } from "./guide";

export const metadata: Metadata = {
  title: "Brand Guidelines",
  description: "The Ready Margin brand system. Logo use, expanded color palettes, typography, voice and practical applications.",
  alternates: { canonical: "https://readymargin.com/brand-guidelines" },
};

export default function BrandGuidelinesPage() {
  return <BrandGuide />;
}
