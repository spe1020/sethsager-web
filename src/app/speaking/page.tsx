import type { Metadata } from "next";
import { ExternalLink, PrimaryAction } from "@/components/Actions";
import { Band } from "@/components/Band";
import { Photo } from "@/components/Photo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Speaking",
  description: `Conversations and talks with ${site.name} on building in the open, AI and human agency, systems and continuous improvement, and community.`,
  alternates: { canonical: "/speaking" },
};

/** Starting points for a conversation, not a record of past engagements. */
const topics = [
  {
    title: "Building in the Open",
    body: "Lessons from developing products, experimenting with open technology, and building communities.",
  },
  {
    title: "AI, Technology & Human Agency",
    body: "How emerging technologies are changing the way we work, create, and connect.",
  },
  {
    title: "Systems, Leadership & Continuous Improvement",
    body: "Lessons from more than 20 years working in manufacturing, supply chain, and operations.",
  },
  {
    title: "Community & Connection",
    body: "Why human relationships still matter in an increasingly digital world.",
  },
] as const;

const inquirySubject = "Speaking Inquiry — Seth Sager";

export default function SpeakingPage() {
  const inquiryHref = site.email
    ? `mailto:${site.email}?subject=${encodeURIComponent(inquirySubject)}`
    : "/connect/";

  return (
    <>
      <div className="shell page-intro speaking-intro">
        <p className="eyebrow">Speaking &amp; conversations</p>
        <h1>
          Ideas worth sharing. <em>Conversations worth having.</em>
        </h1>
        <p className="lede">
          I enjoy sharing what I’ve learned through building products, working in manufacturing,
          and bringing people together. From technology and entrepreneurship to leadership and
          community, I’m interested in conversations that challenge assumptions and explore better
          ways forward.
        </p>
      </div>

      <section className="shell speaking-feature" aria-labelledby="featured-title">
        <figure className="speaking-photo">
          <Photo id="speaking-nostr-valley" priority sizes="(max-width: 860px) 100vw, 700px" />
        </figure>
        <div className="speaking-details">
          <p className="eyebrow">Featured engagement</p>
          <h2 id="featured-title">Nostr Valley</h2>
          <p className="speaking-where">State College, Pennsylvania</p>
          <dl className="speaking-facts">
            <div>
              <dt>Role</dt>
              <dd>Co-founder and speaker</dd>
            </div>
            <div>
              <dt>Talk</dt>
              <dd>“Nobody Joins a Protocol — What We Learned Building Zap Cooking”</dd>
            </div>
          </dl>
          <ExternalLink href="https://nostrvalley.com">Visit Nostr Valley</ExternalLink>
        </div>
      </section>

      <section className="shell speaking-topics" aria-labelledby="topics-title">
        <h2 id="topics-title">What I like talking about</h2>
        <p className="lede">
          Starting points for a conversation. Not a program, and not a list of past talks.
        </p>
        <div className="topic-grid">
          {topics.map((topic) => (
            <section key={topic.title} className="topic">
              <h3>{topic.title}</h3>
              <p>{topic.body}</p>
            </section>
          ))}
        </div>
      </section>

      <Band
        id="speaking-contact"
        eyebrow="Speaking inquiries"
        title="Let’s have a conversation."
        compact
        action={
          <PrimaryAction href={inquiryHref} tone="dark">
            Get in touch about speaking
          </PrimaryAction>
        }
      >
        <p>
          Hosting an event, podcast, panel, or conversation where my experience might be a fit? I’d
          be happy to connect.
        </p>
      </Band>
    </>
  );
}
