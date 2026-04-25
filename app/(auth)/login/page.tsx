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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Scaffold: no real auth yet. Supabase auth wires in Part 8.
    await new Promise((r) => setTimeout(r, 400));
    router.push("/generate");
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
          variant="secondary"
          size="lg"
          className="mt-4 w-full"
          onClick={() => router.push("/generate")}
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
