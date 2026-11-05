"use client";

import Link from "next/link";
import { PrimaryAction } from "@/components/Actions";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell page-intro">
      <h1>Something went wrong.</h1>
      <p className="lede">
        That one is on the site, not you.
      </p>
      <div className="cta-row">
        <PrimaryAction onClick={reset}>Try again</PrimaryAction>
        <Link className="inline-link" href="/">
          Go home
        </Link>
      </div>
    </div>
  );
}
