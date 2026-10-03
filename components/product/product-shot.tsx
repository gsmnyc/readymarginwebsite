"use client";

import Image from "next/image";
import { useRef } from "react";
import { Dialog } from "radix-ui";
import { Maximize2, X } from "lucide-react";
import { productShots, productDisclosure, type ProductShotId } from "@/content/product";
import styles from "./product.module.css";

export function ProductShot({ shot, priority = false, compact = false, mobileDetail = false }: { shot: ProductShotId; priority?: boolean; compact?: boolean; mobileDetail?: boolean }) {
  const product = productShots[shot];
  const opener = useRef<HTMLButtonElement | null>(null);
  return <Dialog.Root>
    <figure aria-label={product.title} className={`${styles.shot} ${compact ? styles.compact : ""} ${mobileDetail ? styles.mobileDetail : ""}`}>
      <div className={styles.previewScroll} tabIndex={mobileDetail ? 0 : undefined} role={mobileDetail ? "region" : undefined} aria-label={mobileDetail ? `${product.title} dashboard preview` : undefined}>
      <Dialog.Trigger className={styles.imageButton} aria-label={`Enlarge ${product.title} screenshot`} onClick={event => { opener.current = event.currentTarget; }}>
        <Image src={product.src} alt={product.alt} width={1910} height={1074} priority={priority} sizes={compact ? "(max-width: 850px) 90vw, 600px" : "(max-width: 850px) 90vw, 1100px"} />
        <span className={styles.enlarge}><Maximize2 size={15} aria-hidden="true" /><span>View screenshot</span></span>
      </Dialog.Trigger>
      </div>
      {mobileDetail && <figcaption className={styles.previewActions}><span>Swipe to explore</span><Dialog.Trigger className={styles.previewExpand} onClick={event => { opener.current = event.currentTarget; }}><Maximize2 size={15} aria-hidden="true" />Expand dashboard</Dialog.Trigger></figcaption>}
    </figure>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.dialog} onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus({ preventScroll: true }); }}>
        <div className={styles.dialogHeading}><Dialog.Title>{product.title}</Dialog.Title><Dialog.Close className={styles.close} aria-label="Close screenshot"><X size={22} aria-hidden="true" /></Dialog.Close></div>
        <Dialog.Description className={styles.disclosure}>{productDisclosure} Scroll the image to inspect the detail.</Dialog.Description>
        <div className={styles.imageScroll} tabIndex={0} role="region" aria-label={`${product.title} enlarged screenshot`}><Image src={product.src} alt={product.alt} width={1910} height={1074} sizes="1910px" /></div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
