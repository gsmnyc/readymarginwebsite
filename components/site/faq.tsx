import type { FaqItem } from "@/lib/content";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((item, index) => (
        <details key={item.question} name="ready-margin-faq">
          <summary data-slot="accordion-trigger">
            <span>{item.question}</span>
            <span className="faq-toggle" aria-hidden="true" />
          </summary>
          <div data-slot="accordion-content" id={`faq-answer-${index}`}>
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
