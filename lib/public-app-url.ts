/**
 * Canonical public URL for the deployed app (Railway, Vercel, custom domain).
 * Set `NEXT_PUBLIC_APP_URL` in production (e.g. https://your-app.up.railway.app).
 * Client-side fallback: current origin when env is unset (local dev).
 */
export function getPublicAppOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) {
    const withProto = raw.startsWith("http") ? raw : `https://${raw}`;
    try {
      return new URL(withProto).origin;
    } catch {
      return "";
    }
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

/**
 * `host/preview/:id` for UI display and copy as `https://${path}` (see ReviewSuccessState).
 */
export function previewLinkDisplayPath(caseId: string): string {
  const origin = getPublicAppOrigin();
  if (!origin) {
    return `preview/${caseId}`;
  }
  const { host } = new URL(origin);
  return `${host}/preview/${caseId}`;
}
