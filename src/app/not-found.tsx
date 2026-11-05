import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell page-intro">
      <h1>This page is not on the site.</h1>
      <p className="lede">
        <Link href="/work">Browse the work</Link>
      </p>
    </div>
  );
}
