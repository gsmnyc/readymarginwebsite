"use client";

import { Tabs } from "radix-ui";
import Link from "@/components/site/link";
import { productWorkflows, dashboardUrl } from "@/content/product";
import { ProductShot } from "./product-shot";
import styles from "./product.module.css";

export function ProductTour() {
  return <section id="the-method" className={`home-wrap home-panel ${styles.tour}`} aria-labelledby="product-tour-title">
    <div className="home-section-heading"><div><p className="eyebrow">Inside the workspace</p><h2 id="product-tour-title">See the work.<br />Know the next step.</h2></div><p>Explore the tools behind the service. Each view brings the records and outstanding questions together for the people handling them.</p></div>
    <Tabs.Root defaultValue="attendance" className={styles.tabs}>
      <Tabs.List className={styles.tabList} aria-label="Explore Ready Margin service workflows">{productWorkflows.map(view => <Tabs.Trigger key={view.id} value={view.id}>{view.label}</Tabs.Trigger>)}</Tabs.List>
      {productWorkflows.map(view => <Tabs.Content key={view.id} value={view.id} className={styles.tabContent}>
        <div className={styles.workflowCopy}><p className="eyebrow">{view.label}</p><h3>{view.title}</h3><p>{view.body}</p><ul>{view.points.map(point => <li key={point}>{point}</li>)}</ul><Link className="text-link" href={view.href}>{view.link}</Link></div>
        <ProductShot shot={view.shot} />
      </Tabs.Content>)}
    </Tabs.Root>
    <div className={styles.tourTail}><span>Demo workspace</span><a href={dashboardUrl} target="_blank" rel="noopener noreferrer">Open the workspace <span aria-hidden="true">↗</span></a></div>
    <div className={styles.workingPrinciples}><article><span>01 / RUN</span><h3>Handle the recurring work.</h3><p>Keep records current and complete the checks your service covers.</p></article><article><span>02 / EXPLAIN</span><h3>Explain the movement.</h3><p>Show what changed and which records support the finding.</p></article><article><span>03 / IMPROVE</span><h3>Act on the finding.</h3><p>Agree the next action, assign responsibility and review the result.</p></article></div>
  </section>;
}
