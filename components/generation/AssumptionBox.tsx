import { Info } from "lucide-react";
import type { AssumptionBox as AssumptionBoxType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssumptionBox({ box }: { box: AssumptionBoxType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <Info className="size-4 text-[color:var(--color-teal-700)]" />
          This preview assumes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {box.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm text-[color:var(--color-warm-700)]"
            >
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--color-teal-600)]"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-[color:var(--color-warm-200)] pt-3 text-xs italic text-[color:var(--color-warm-500)]">
          {box.disclaimerFooter}
        </p>
      </CardContent>
    </Card>
  );
}
