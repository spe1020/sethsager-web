import Link from "next/link";
import { SelectedWork } from "@/components/SelectedWork";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <div className="shell">
      <section className="hero">
        <p className="eyebrow">{site.name}</p>
        <h1>{site.thesis}</h1>
        <p className="lede">
          Some of these are practical tools for a business or a plant floor. Others are about
          food, gratitude, community, or a conversation. I want that range to read as one
          practice: simplify the experience, and leave people with more say in it than they
          started with.
        </p>
      </section>

      <SelectedWork />

      <section className="thread" aria-labelledby="thread-title">
        <h2 id="thread-title">One thread</h2>
        <p>The subjects change. The aim does not.</p>
        <div className="thread-grid">
          <article>
            <h3>Practical tools</h3>
            <p>
              Zap Books and LoopSignal are for work that gets messy in the details: the books
              of a business, and a problem on a manufacturing floor. Each one keeps the record,
              the reason, and the next step together.
            </p>
          </article>
          <article>
            <h3>Food and attention</h3>
            <p>
              Zap Cooking and Grateful Day are closer to daily life. One is a place to find,
              keep, and share food with other people. The other is a daily pause for wisdom, an
              affirmation, and gratitude.
            </p>
          </article>
          <article>
            <h3>Conversation</h3>
            <p>
              <Link href="/connection">Connection</Link> is a podcast presented by{" "}
              <Link href="/work/zap-cooking">Zap Cooking</Link>, with its own name and its own
              page. It is where building, technology, community, relationships, and ordinary
              life can be talked about out loud.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
