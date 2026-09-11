import Link from "@/components/site/link";
export default function NotFound() {
  return (
    <main id="main" className="container utility">
      <p className="eyebrow">404 · A missing handoff</p>
      <h1>Let’s get you to the right place.</h1>
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
