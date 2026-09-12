import Link from "@/components/site/link";

const chapters = [
  { verb: "Run", title: "Start with the bill.", body: "A delivery arrives. The invoice looks familiar, but the unit price has changed. We check it against the agreed price and flag the difference.", label: "Supplier invoice", note: "Same ingredient. Different price.", action: "Check against the agreed price", owner: "Ready Margin · invoice check" },
  { verb: "Explain", title: "Find what it means.", body: "Is it a one-off error or a new cost? We connect the change to ordering and food cost, so the conversation starts with evidence—not a guess.", label: "Review note", note: "A price change needs an explanation.", action: "Confirm the reason with the supplier", owner: "Ready Margin + restaurant manager" },
  { verb: "Improve", title: "Keep the next step moving.", body: "Agree who will contact the supplier and what needs approval. Track the answer, check the next invoice and keep unresolved work on the list.", label: "Follow-up", note: "A clear owner. A next check.", action: "Check the response and next invoice", owner: "Agreed owner · follow-through" },
] as const;

export function OperatingStory() {
  return <section className="operating-story home-wrap" aria-labelledby="story-title">
    <header className="story-introduction"><p className="eyebrow">One bill. More than bookkeeping.</p><h2 id="story-title">Don’t just file it.<br /><span>Follow it through.</span></h2><p>This is what taking responsibility looks like. One illustrative supplier-price question, from the record to the next check.</p></header>
    <div className="story-chapters">
      {chapters.map((chapter, i) => <article className="story-chapter" data-story-chapter key={chapter.verb}>
        <div className="story-copy"><p className="story-verb"><span aria-hidden="true">0{i + 1}</span>{chapter.verb}</p><h3>{chapter.title}</h3><p>{chapter.body}</p></div>
        <figure className="working-paper"><div className="paper-clip" aria-hidden="true"/><figcaption>{chapter.label}<span>Illustrative example</span></figcaption><div className="paper-rules" aria-hidden="true"><i/><i/><i/></div><p className="paper-note">{chapter.note}</p><div className="paper-action"><span>The next check</span><strong>{chapter.action}</strong></div><p className="paper-owner">{chapter.owner}</p><span className="paper-stage" aria-hidden="true">0{i + 1}</span></figure>
      </article>)}
    </div>
    <div className="story-ending"><p>Software gives you tools.<br /><strong>We take responsibility for agreed work.</strong></p><Link className="text-link" href="/how-it-works">See how we work together</Link></div>
  </section>;
}
