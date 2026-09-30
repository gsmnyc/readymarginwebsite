"use client";

import Image from "next/image";
import { Dialog } from "radix-ui";
import { Maximize2, X } from "lucide-react";
import { productShots, productDisclosure, type ProductShotId } from "@/content/product";
import styles from "./product.module.css";

export function ProductShot({ shot, priority = false, compact = false }: { shot: ProductShotId; priority?: boolean; compact?: boolean }) {
  const product = productShots[shot];
  return <Dialog.Root>
    <figure aria-label={product.title} className={`${styles.shot} ${compact ? styles.compact : ""}`}>
      <Dialog.Trigger className={styles.imageButton} aria-label={`Enlarge ${product.title} screenshot`}>
        <Image src={product.src} alt={product.alt} width={1910} height={1074} priority={priority} sizes={compact ? "(max-width: 850px) 90vw, 600px" : "(max-width: 850px) 90vw, 1100px"} />
        <span className={styles.enlarge}><Maximize2 size={15} aria-hidden="true" /><span>View screenshot</span></span>
      </Dialog.Trigger>
    </figure>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.dialog}>
        <div className={styles.dialogHeading}><Dialog.Title>{product.title}</Dialog.Title><Dialog.Close className={styles.close} aria-label="Close screenshot"><X size={22} aria-hidden="true" /></Dialog.Close></div>
        <Dialog.Description className={styles.disclosure}>{productDisclosure} Scroll the image to inspect the detail.</Dialog.Description>
        <div className={styles.imageScroll} tabIndex={0} role="region" aria-label={`${product.title} enlarged screenshot`}><Image src={product.src} alt={product.alt} width={1910} height={1074} sizes="1910px" /></div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
