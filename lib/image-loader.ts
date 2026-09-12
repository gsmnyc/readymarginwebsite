export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src === "/brand/restaurant-pass.webp") {
    const size = [480, 800, 1200, 1536].find((n) => n >= width) || 1536;
    return `/brand/restaurant-pass-${size}.webp`;
  }
  if (src === "/brand/restaurant-team.webp") {
    const size = [480, 800, 1200, 1536].find((n) => n >= width) || 1536;
    return `/brand/restaurant-team-${size}.webp`;
  }
  return src;
}
