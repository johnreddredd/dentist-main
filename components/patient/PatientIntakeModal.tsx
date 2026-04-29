"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CasePatientRecord } from "@/types";

interface PatientIntakeModalProps {
  open: boolean;
  /** Persist with patient details (first + last required). */
  onSave: (patient: CasePatientRecord) => void;
  /** Add case without patient row (editable later on case page). */
  onSkip: () => void;
}

export function PatientIntakeModal({
  open,
  onSave,
  onSkip,
}: PatientIntakeModalProps) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [patientId, setPatientId] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setFirstName("");
    setLastName("");
    setPatientId("");
    setPhone("");
    setEmail("");
    setNotes("");
  }, [open]);

  if (!open) return null;

  const canSave =
    firstName.trim().length > 0 && lastName.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      patientId: patientId.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0F172A]/45 p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-intake-title"
    >
      <div className="max-h-[min(92vh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-xl sm:p-6">
        <h2
          id="patient-intake-title"
          className="text-lg font-semibold text-[#0F172A]"
        >
          Save to patient library
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Link this preview to a patient so you can find them by name later.
          Stored on this device until your practice database is connected.
        </p>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pi-first">First name</Label>
              <Input
                id="pi-first"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Required"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pi-last">Last name</Label>
              <Input
                id="pi-last"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Required"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pi-chart">Chart / ID</Label>
            <Input
              id="pi-chart"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Optional — MRN or office #"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pi-phone">Phone</Label>
            <Input
              id="pi-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pi-email">Email</Label>
            <Input
              id="pi-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pi-notes">Notes</Label>
            <textarea
              id="pi-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional — allergies, recalls, etc."
              className="w-full resize-y rounded-xl border border-[color:var(--color-warm-200)] bg-white px-3.5 py-2.5 text-base text-[#0F172A] placeholder:text-[color:var(--color-warm-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-teal-600)]"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onSkip}>
            Skip — no patient details
          </Button>
          <Button type="button" onClick={handleSave} disabled={!canSave}>
            Save &amp; open preview
          </Button>
        </div>
      </div>
    </div>
  );
}
