"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPublicAppOrigin } from "@/lib/public-app-url";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("error") === "auth") {
      setError("Sign-in failed. Try again or use another method.");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Could not start Supabase client.");
      return;
    }
    setLoading(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signErr) {
      setError(signErr.message);
      return;
    }
    router.push("/generate");
    router.refresh();
  }

  async function onGoogle() {
    setError(null);
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      return;
    }
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    setLoading(true);
    const origin = getPublicAppOrigin();
    if (!origin) {
      setLoading(false);
      setError("Could not resolve app URL. Set NEXT_PUBLIC_APP_URL in production.");
      return;
    }
    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/generate`,
      },
    });
    setLoading(false);
    if (oauthErr) setError(oauthErr.message);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Welcome back. Access your case library and create new previews.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@practice.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[color:var(--color-warm-200)]" />
          <span className="text-xs uppercase text-[color:var(--color-warm-500)]">
            or
          </span>
          <div className="h-px flex-1 bg-[color:var(--color-warm-200)]" />
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="mt-4 w-full"
          loading={loading}
          onClick={() => void onGoogle()}
        >
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-[color:var(--color-warm-500)]">
          New to SmileAI?{" "}
          <Link
            href="/signup"
            className="font-medium text-[color:var(--color-teal-800)] hover:underline"
          >
            Start free trial
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
