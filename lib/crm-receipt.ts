/** A CRM transport success is insufficient: the receiver must confirm its commit. */
export function hasDurableCrmReceipt(value: unknown, submissionId: string): boolean {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Record<string, unknown>;
  return receipt.ok === true &&
    typeof receipt.receiptId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(receipt.receiptId) &&
    receipt.submissionId === submissionId;
}
