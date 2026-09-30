"use client";

import { useRef, useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { Dialog, Tabs } from "radix-ui";

const views = [
  {
    id: "books", label: "Books", title: "The weekly close", summary: "One question before the next review.",
    count: "01", attention: "Supplier question", next: "Confirm the price on a produce invoice.",
    rows: [{ title: "Sales & deposits", status: "Matched", done: true }, { title: "Supplier invoice", status: "Needs review", done: false }, { title: "Owner report", status: "Draft", done: false }],
    detail: { title: "A supplier price has changed", source: "Produce invoice · sample record", status: "Needs supplier confirmation", finding: "The invoice shows $28 per case against an agreed price of $24. The quantity is unchanged. Confirm the price before treating the difference as a new recurring cost.", fields: [{ label: "Agreed unit price", value: "$24.00 / case" }, { label: "Invoiced unit price", value: "$28.00 / case" }, { label: "Difference", value: "$4.00 / case" }], action: "Ask the supplier whether this is an invoice error or a price change. Record the answer and check the next delivery.", owner: "Restaurant manager", approval: "The restaurant approves any payment or purchasing change." },
  },
  {
    id: "payroll", label: "Payroll", title: "Ready for the payroll cutoff?", summary: "Corrections stay visible until approved.",
    count: "03", attention: "Time corrections", next: "Get the manager’s answer before approval.",
    rows: [{ title: "Attendance exceptions", status: "3 to confirm", done: false }, { title: "Tips & adjustments", status: "In review", done: false }, { title: "Payroll run", status: "Not approved", done: false }],
    detail: { title: "Hours need manager confirmation", source: "Attendance review · sample record", status: "Blocked: manager answer needed", finding: "Three time records have an unconfirmed end time. The scheduled shift provides context, but the manager must confirm the hours actually worked.", fields: [{ label: "Records affected", value: "3 sample time records" }, { label: "Required before", value: "Payroll approval" }, { label: "Current state", value: "Awaiting confirmation" }], action: "Confirm the end times against attendance records, document each correction and return the approved hours for payroll preparation.", owner: "Restaurant manager → payroll approver", approval: "The restaurant approves the hours and payroll run." },
  },
  {
    id: "costs", label: "Food cost", title: "Make the cost change visible", summary: "A purchasing decision starts with the record.",
    count: "01", attention: "Price to confirm", next: "Review the supplier answer before reordering.",
    rows: [{ title: "Invoice comparison", status: "Price changed", done: false }, { title: "Food-cost review", status: "Provisional", done: false }, { title: "Next delivery check", status: "Follow-up set", done: true }],
    detail: { title: "Check the price before the next order", source: "Food-cost review · sample record", status: "Provisional until confirmed", finding: "A produce invoice has a higher unit price. That does not, by itself, explain the restaurant’s overall food cost. The supplier answer and comparable purchasing records come first.", fields: [{ label: "Record to check", value: "Produce invoice" }, { label: "Question", value: "Error or new agreed price?" }, { label: "Next check", value: "The following delivery" }], action: "Confirm the unit price, compare like-for-like purchasing records and agree whether the next action is a correction or a purchasing review.", owner: "Restaurant manager + Ready Margin", approval: "The restaurant decides any supplier, ordering or menu changes." },
  },
] as const;

type Detail = (typeof views)[number]["detail"];

export function FinancePreview() {
  const [active, setActive] = useState("books");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [open, setOpen] = useState(false);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <figure className="finance-preview">
        <div className="preview-top"><div className="preview-symbol" aria-hidden="true"><i /><i /><i /></div><span>READY MARGIN</span><span className="preview-date">Workflow preview</span></div>
        <Tabs.Root value={active} onValueChange={setActive} className="preview-tabs">
          <Tabs.List aria-label="Explore an example finance workflow">{views.map(view => <Tabs.Trigger key={view.id} value={view.id}>{view.label}</Tabs.Trigger>)}</Tabs.List>
          {views.map(view => <Tabs.Content key={view.id} value={view.id} className="preview-content">
            <div className="preview-heading"><h2>{view.title}</h2><p>{view.summary}</p></div>
            <div className="preview-attention"><strong>{view.count}</strong><div><span>{view.attention}</span><p>{view.next}</p></div></div>
            <div className="preview-worklist"><div className="preview-list-heading"><span>This week’s work</span><span>Status</span></div><ul>{view.rows.map((row,index) => <li key={row.title}><span className="preview-task-mark" aria-hidden="true">{row.done ? <Check size={13} /> : <span />}</span><span>{row.title}</span><span className={`preview-status ${row.done ? "preview-status-done" : ""}`}>{row.status}</span>{index === (view.id === "books" ? 1 : 0) ? <button type="button" aria-label={`View ${row.title.toLowerCase()} example`} onClick={(event) => { returnFocus.current = event.currentTarget; setDetail(view.detail); setOpen(true); }}><ChevronRight size={16} aria-hidden="true" /></button> : <span className="preview-row-spacer" />}</li>)}</ul></div>
            <div className="preview-close"><span>Weekly close</span><ol aria-label="Example weekly close progress">{["Collect", "Reconcile", "Explain", "Review"].map((step,i) => <li key={step} data-current={i === 1 ? "true" : undefined}><span aria-hidden="true">{i === 0 ? <Check size={11} /> : i + 1}</span>{step}</li>)}</ol></div>
          </Tabs.Content>)}
        </Tabs.Root>
        <figcaption><span className="preview-sample-label">Sample data</span>Illustrative workflows. Providers are not connected in this preview.</figcaption>
      </figure>
      <Dialog.Portal>
        <Dialog.Overlay className="preview-drawer-overlay" />
        <Dialog.Content className="preview-drawer" onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus.current?.focus({ preventScroll: true }); }}>
          <div className="preview-drawer-top"><p className="eyebrow">Ready Margin / sample workflow</p><Dialog.Close className="preview-drawer-close" aria-label="Close task details"><X size={21} aria-hidden="true" /></Dialog.Close></div>
          <Dialog.Title>{detail?.title}</Dialog.Title>
          <Dialog.Description>{detail?.source}</Dialog.Description>
          <p className="preview-drawer-status">{detail?.status}</p>
          <section><h3>What we found</h3><p>{detail?.finding}</p><dl>{detail?.fields.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></section>
          <section className="preview-drawer-action"><p className="eyebrow">The next action</p><h3>{detail?.owner}</h3><p>{detail?.action}</p></section>
          <p className="preview-drawer-approval">{detail?.approval}</p>
          <p className="caption">Sample records only. This preview does not send approvals, change records or connect to a provider.</p>
          <Dialog.Close className="button secondary">Close example</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
