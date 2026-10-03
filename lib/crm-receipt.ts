/** A CRM transport success is insufficient: the receiver must confirm its commit. */
export function hasDurableCrmReceipt(value: unknown, submissionId: string, status: number): boolean {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Record<string, unknown>;
  return receipt.ok === true &&
    ((status === 201 && receipt.created === true) || (status === 200 && receipt.created === false)) &&
    typeof receipt.receiptId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(receipt.receiptId) &&
    receipt.submissionId === submissionId;
}
