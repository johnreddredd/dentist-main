import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--color-warm-50)]">
      <header className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[color:var(--color-teal-700)] text-white">
            <Sparkles className="size-5" />
          </div>
          <span className="text-base font-semibold">SmileAI</span>
        </Link>
      </header>
      <div className="flex flex-1 items-start justify-center px-6 pb-16 pt-6 sm:items-center">
        {children}
      </div>
    </div>
  );
}
