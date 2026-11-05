import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell page-intro">
      <h1>This page is not on the site.</h1>
      <p className="lede">
        Try the <Link href="/work">work</Link>, the <Link href="/writing">writing</Link>, or{" "}
        <Link href="/">start at the beginning</Link>.
      </p>
    </div>
  );
}
