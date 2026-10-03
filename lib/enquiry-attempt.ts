export type EnquiryAttempt = { id: string; fingerprint: string };
/** Memory-only: never put enquiry content in analytics or persistent storage. */
export function nextEnquiryAttempt(previous: EnquiryAttempt | null, payload: unknown, createId: () => string): EnquiryAttempt {
  const fingerprint = JSON.stringify(payload) ?? "";
  return previous?.fingerprint === fingerprint ? previous : { id: createId(), fingerprint };
}
