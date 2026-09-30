import { metadataFor } from "@/lib/seo";
import { BrandGuide } from "./guide";

export const generateMetadata = () => metadataFor({
  title: "Brand Guidelines",
  description: "Ready Margin’s logo, color, typography and writing guidelines, with examples and downloadable brand assets.",
  path: "/brand-guidelines", kind: "brand", indexable: false,
});

export default function BrandGuidelinesPage() {
  return <BrandGuide />;
}
