import Link from "@/components/site/link";
import styles from "./operating-story.module.css";

const chapters = [
  { verb: "RUN", title: "Get the record right.", body: "Check the supplier invoice against the agreed price. Record the difference and keep the question visible until it has an answer.", label: "01 / The record", fields: [{ label: "Agreed price", value: "$24 / case" }, { label: "Invoice price", value: "$28 / case" }], note: "A $4 difference to confirm.", owner: "Ready Margin · invoice check" },
  { verb: "EXPLAIN", title: "Make the change clear.", body: "Establish whether this is an invoice error or a new cost. Explain what the answer means before it becomes a purchasing decision.", label: "02 / The explanation", fields: [{ label: "Quantity", value: "Unchanged" }, { label: "Unit price", value: "Higher" }], note: "Same quantity. Different unit cost.", owner: "Ready Margin + restaurant manager" },
  { verb: "IMPROVE", title: "Follow the decision through.", body: "Agree who contacts the supplier, record the answer and check the next delivery. Use the confirmed cost in the next review.", label: "03 / The next action", fields: [{ label: "Owner", value: "Restaurant manager" }, { label: "Next check", value: "Following delivery" }], note: "Confirm the price before reordering.", owner: "Restaurant approval stays with you" },
] as const;

export function OperatingStory() {
  return <section id="the-method" className={`${styles.section} home-wrap home-panel`} aria-labelledby="story-title">
    <header className={styles.introduction}><p className="eyebrow">How the work connects</p><h2 id="story-title">One invoice.<br /><span>A useful next step.</span></h2><p>Run the work. Explain the numbers. Improve what happens next. Here’s how that looks when a supplier price changes.</p></header>
    <div className={styles.chapters}>
      {chapters.map(chapter => <article className={styles.chapter} key={chapter.verb} data-motion-card>
        <div className={styles.copy}><p className={styles.verb}>{chapter.verb}</p><h3>{chapter.title}</h3><p>{chapter.body}</p></div>
        <figure className={styles.paper}><figcaption>{chapter.label}</figcaption><dl>{chapter.fields.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl><p className={styles.note}>{chapter.note}</p><p className={styles.owner}>{chapter.owner}</p></figure>
      </article>)}
    </div>
    <div className={styles.ending}><p>Illustrative example with sample prices. A confirmed supplier answer comes before a change to purchasing.</p><Link className="text-link" href="/how-it-works">See how we work together</Link></div>
  </section>;
}
