export class EnquiryBodyTooLarge extends Error {}
export class EnquiryBodyTimeout extends Error {}
// Bound time as well as bytes, including streams that never send their next chunk.
export async function readEnquiryBody(
  request: Request | Response,
  maximum = 16000,
  timeoutMs = 5000,
  signal?: AbortSignal,
): Promise<string> {
  if (!request.body) return "";
  const reader = request.body.getReader(), chunks: Uint8Array[] = [];
  let size = 0, completed = false;
  const abortSignal = signal ?? (request instanceof Request ? request.signal : undefined);
  let onAbort: () => void = () => {};
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    onAbort = () => reject(new EnquiryBodyTimeout("Body read interrupted."));
    timer = setTimeout(() => reject(new EnquiryBodyTimeout("Body read timed out.")), timeoutMs);
    abortSignal?.addEventListener("abort", onAbort, { once: true });
    if (abortSignal?.aborted) onAbort();
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) { completed = true; break; }
      size += value.byteLength;
      if (size > maximum) {
        throw new EnquiryBodyTooLarge("Enquiry exceeds the size limit.");
      }
      chunks.push(value);
    }
    const body = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    return new TextDecoder().decode(body);
  } finally {
    clearTimeout(timer);
    abortSignal?.removeEventListener("abort", onAbort);
    // Cancellation itself can stall; do not let it defeat the deadline.
    if (!completed) void reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
