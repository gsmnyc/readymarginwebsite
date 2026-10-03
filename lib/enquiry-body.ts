export class EnquiryBodyTooLarge extends Error {}
export async function readEnquiryBody(request: Request, maximum = 16000): Promise<string> {
  if (!request.body) return "";
  const reader = request.body.getReader(), chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        await reader.cancel().catch(() => {});
        throw new EnquiryBodyTooLarge("Enquiry exceeds the size limit.");
      }
      chunks.push(value);
    }
    const body = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    return new TextDecoder().decode(body);
  } finally { reader.releaseLock(); }
}
