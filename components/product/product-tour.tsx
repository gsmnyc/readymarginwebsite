"use client";

import { Tabs } from "radix-ui";
import Link from "@/components/site/link";
import { productWorkflows, dashboardUrl } from "@/content/product";
import { ProductShot } from "./product-shot";
import styles from "./product.module.css";

export function ProductTour() {
  return <section id="the-method" className={`home-wrap home-panel ${styles.tour}`} aria-labelledby="product-tour-title">
    <div className="home-section-heading"><div><p className="eyebrow">Inside the demo workspace</p><h2 id="product-tour-title">Follow a record<br />through the review.</h2></div><p>Choose attendance, tips, bills or accounts to see the preparation involved. These sample views show the sources checked and the answers needed before the next approval.</p></div>
    <Tabs.Root defaultValue="attendance" className={styles.tabs}>
      <Tabs.List className={styles.tabList} aria-label="Explore Ready Margin service workflows">{productWorkflows.map(view => <Tabs.Trigger key={view.id} value={view.id}>{view.label}</Tabs.Trigger>)}</Tabs.List>
      {productWorkflows.map(view => <Tabs.Content key={view.id} value={view.id} className={styles.tabContent}>
        <div className={styles.workflowCopy}><p className="eyebrow">{view.label}</p><h3>{view.title}</h3><p>{view.body}</p><ul>{view.points.map(point => <li key={point}>{point}</li>)}</ul><Link className="text-link" href={view.href}>{view.link}</Link></div>
        <ProductShot shot={view.shot} />
      </Tabs.Content>)}
    </Tabs.Root>
    <div className={styles.tourTail}><span>Demo workspace</span><a href={dashboardUrl} target="_blank" rel="noopener noreferrer">Open the workspace <span aria-hidden="true">↗</span></a></div>
    <div className={styles.workingPrinciples}><article><span>01 / PREPARE</span><h3>Collect and check.</h3><p>Obtain the period’s documents and investigate missing or unmatched entries.</p></article><article><span>02 / REVIEW</span><h3>Explain the result.</h3><p>Show the relevant financial change and the records supporting it.</p></article><article><span>03 / FOLLOW UP</span><h3>Confirm the next action.</h3><p>Name the person, required approval and date for the outstanding work.</p></article></div>
  </section>;
}
