import { serviceProductFor } from "@/content/product";
import type { Page } from "@/lib/content";
import { ProductShot } from "./product-shot";
import styles from "./product.module.css";

export function ServiceProduct({ page }: { page: Pick<Page, "path" | "kind"> }) {
  const product = serviceProductFor(page);
  if (!product) return null;
  return <section className={styles.service} aria-labelledby="service-product-title" data-motion-card>
    <div className={styles.serviceCopy}><p className="eyebrow">The work in practice</p><h2 id="service-product-title">{product.title}</h2><p>{product.body}</p><ul>{product.points.map(point => <li key={point}>{point}</li>)}</ul></div>
    <ProductShot shot={product.shot} />
    <span className={styles.serviceDisclosure}>Demo workspace</span>
  </section>;
}
