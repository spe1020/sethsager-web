"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell page-intro">
      <h1>Something went wrong.</h1>
      <p className="lede">
        That one is on the site, not you.{" "}
        <button type="button" className="text-button" onClick={reset}>
          Try again
        </button>{" "}
        or <Link href="/">go home</Link>.
      </p>
    </div>
  );
}
