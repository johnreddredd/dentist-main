"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  buildCasesBackupPayload,
  casesWithBlobRefs,
  parseCasesBackupJson,
} from "@/lib/cases/backup";
import {
  useCasesStore,
  waitForCasesPersistWrites,
} from "@/lib/stores/cases";
import { Download, Upload } from "lucide-react";

export function CasesBackupCard() {
  const cases = useCasesStore((s) => s.cases);
  const setCases = useCasesStore((s) => s.setCases);
  const mergeCases = useCasesStore((s) => s.mergeCases);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function onExport() {
    setError(null);
    setMessage(null);
    if (cases.length === 0) {
      setError("No cases to export.");
      return;
    }
    const blobUrls = casesWithBlobRefs(cases);
    if (blobUrls.length > 0) {
      const ok = window.confirm(
        `${blobUrls.length} case(s) use temporary blob: image links. Those previews usually will not work after import on another site. Export this file anyway?`,
      );
      if (!ok) return;
    }
    const payload = buildCasesBackupPayload(cases);
    const blob = new Blob([JSON.stringify(payload, null, 0)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `smileai-cases-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMessage(`Exported ${cases.length} case(s). Move this file to the other computer or open Railway and import there.`);
    await waitForCasesPersistWrites();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setMessage(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const text = await file.text();
    const parsed = parseCasesBackupJson(text);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    const incoming = parsed.data.cases;
    const blobBad = casesWithBlobRefs(incoming);
    if (blobBad.length > 0) {
      setError(
        `This backup references ${blobBad.length} blob: URL(s). Those images cannot load on another site. Export again from a session that used data URLs or file upload.`,
      );
      return;
    }

    const replace = window.confirm(
      `Import ${incoming.length} case(s)?\n\nOK = replace your entire library on this device with this file.\nCancel = merge (update matching IDs, keep other local cases).`,
    );

    if (replace) {
      setCases(incoming);
      setMessage(`Replaced library with ${incoming.length} case(s).`);
    } else {
      mergeCases(incoming);
      setMessage(`Merged ${incoming.length} case(s).`);
    }
    await waitForCasesPersistWrites();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient library backup</CardTitle>
        <CardDescription>
          Cases and previews are stored in this browser only — not on Railway.
          Export a JSON file on{" "}
          <span className="font-medium text-[color:var(--color-warm-700)]">
            localhost
          </span>
          , then import it on{" "}
          <span className="font-medium text-[color:var(--color-warm-700)]">
            your live site
          </span>{" "}
          to move data. Large backups can take a moment.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={onFileSelected}
        />
        <Button
          type="button"
          variant="outline"
          className="gap-2 border-[color:var(--color-warm-200)]"
          onClick={onExport}
        >
          <Download className="size-4" />
          Download backup
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2 border-[color:var(--color-warm-200)]"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4" />
          Import backup…
        </Button>
        {message ? (
          <p className="w-full text-sm text-[color:var(--color-teal-800)] sm:w-auto">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="w-full text-sm text-red-700 sm:w-auto">{error}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
