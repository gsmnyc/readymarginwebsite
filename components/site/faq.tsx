"use client";

import type { FaqItem } from "@/lib/content";
import { track } from "@/lib/analytics";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Accordion
      type="single"
      collapsible
      onValueChange={(value) => {
        if (value) track("faq_open");
      }}
      className="faq"
    >
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={String(index)}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent forceMount>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
