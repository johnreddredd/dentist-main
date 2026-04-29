/**
 * Resolve an image URL to a data URL for server-side model calls.
 * Supports existing `data:image/...;base64,...` inputs and http(s) fetches.
 */

const FETCH_TIMEOUT_MS = 20_000;

export async function resolveImageToDataUrl(url: string): Promise<string> {
  const trimmed = url.trim();
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Invalid image URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http(s) or data URLs are supported");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    /^127\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^192\.168\.\d+\.\d+$/.test(hostname) ||
    /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname)
  ) {
    throw new Error("Refusing to fetch private network URLs");
  }

  const res = await fetch(parsed.toString(), {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { Accept: "image/*,*/*;q=0.8" },
  });

  if (!res.ok) {
    throw new Error(`Image fetch failed (${res.status})`);
  }

  const mime =
    res.headers.get("content-type")?.split(";")[0]?.trim() ?? "image/jpeg";
  if (!mime.startsWith("image/")) {
    throw new Error("URL did not return an image");
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const b64 = buf.toString("base64");
  return `data:${mime};base64,${b64}`;
}
