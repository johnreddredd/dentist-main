"use client";

import { Check, RotateCcw, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  onApprove: () => void;
  onRegenerate: () => void;
  onAdjust: () => void;
  regenerating?: boolean;
  approving?: boolean;
  regenerationCount?: number;
}

export function ApprovalGate({
  onApprove,
  onRegenerate,
  onAdjust,
  regenerating,
  approving,
  regenerationCount = 0,
}: Props) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-[color:var(--color-warm-900)]">
              Dentist approval required
            </p>
            <p className="text-sm text-[color:var(--color-warm-500)]">
              Patient never sees this image until you approve it.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              size="lg"
              onClick={onApprove}
              loading={approving}
              className="flex-1"
            >
              <Check className="size-4" /> Approve &amp; Show Patient
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={onRegenerate}
              loading={regenerating}
              className="flex-1"
            >
              <RotateCcw className="size-4" /> Regenerate
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onAdjust}
              className="flex-1"
            >
              <Settings2 className="size-4" /> Adjust &amp; Regenerate
            </Button>
          </div>

          {regenerationCount > 0 && (
            <p className="text-xs text-[color:var(--color-warm-500)]">
              Regenerated {regenerationCount} time
              {regenerationCount === 1 ? "" : "s"} on this case.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
