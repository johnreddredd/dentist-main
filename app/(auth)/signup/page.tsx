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
import { getAuthRedirectOrigin } from "@/lib/public-app-url";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = React.useState({
    practice: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Could not start Supabase client.");
      return;
    }
    const origin = getAuthRedirectOrigin();
    if (!origin) {
      setError(
        "Set NEXT_PUBLIC_APP_URL on Railway to your live https URL (not localhost), redeploy. For local dev, run without NODE_ENV=production or set the env to http://localhost:3000.",
      );
      return;
    }
    setLoading(true);
    const { data, error: signErr } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { practice_name: form.practice.trim() },
        emailRedirectTo: `${origin}/auth/callback?next=/generate`,
      },
    });
    setLoading(false);
    if (signErr) {
      setError(signErr.message);
      return;
    }
    if (data.session) {
      router.push("/generate");
      router.refresh();
      return;
    }
    setNotice(
      "Check your email to confirm your account, then sign in. You can close this tab.",
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Start 14-day trial</CardTitle>
        <CardDescription>
          No credit card required. Cancel anytime.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-900">
              {notice}
            </p>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="practice">Practice name</Label>
            <Input
              id="practice"
              required
              value={form.practice}
              onChange={(e) =>
                setForm((f) => ({ ...f, practice: e.target.value }))
              }
              placeholder="Preview Dental"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
          </div>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[color:var(--color-warm-500)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[color:var(--color-teal-800)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
