import Link from "@/components/site/link";
export default function NotFound() {
  return (
    <main id="main" className="container utility">
      <p className="eyebrow">404 · Page not found</p>
      <h1>Page not found.</h1>
      <p>
        This page is not available. Explore the services or search for the
        question you came with.
      </p>
      <div className="actions">
        <Link className="button" href="/what-we-handle">
          See what we handle
        </Link>
        <Link className="text-link" href="/search">
          Search the site ↗
        </Link>
      </div>
    </main>
  );
}
