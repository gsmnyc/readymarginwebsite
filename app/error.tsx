"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main id="main" className="container utility">
      <p className="eyebrow">Something interrupted this page</p>
      <h1>Let’s try that again.</h1>
      <p>
        The page could not load. Try again, or email contact@readymargin.com.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
