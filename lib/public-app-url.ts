/**
 * Canonical public URL for the deployed app (Railway, Vercel, custom domain).
 * Set `NEXT_PUBLIC_APP_URL` in production (e.g. https://your-app.up.railway.app).
 * Client-side fallback: current origin when env is unset (local dev only).
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

function parseEnvAppOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return "";
  const withProto = raw.startsWith("http") ? raw : `https://${raw}`;
  try {
    return new URL(withProto).origin;
  } catch {
    return "";
  }
}

function isLoopbackOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname.endsWith(".localhost")
    );
  } catch {
    return false;
  }
}

/**
 * OAuth and email-confirm redirects. In **production**, only `NEXT_PUBLIC_APP_URL`
 * is used, and localhost is never accepted so users are not sent to local dev.
 */
export function getAuthRedirectOrigin(): string {
  const fromEnv = parseEnvAppOrigin();
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    if (!fromEnv || isLoopbackOrigin(fromEnv)) {
      return "";
    }
    return fromEnv;
  }

  if (fromEnv) return fromEnv;
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
