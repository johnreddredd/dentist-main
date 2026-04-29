"use client";

import * as React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { waitForCasesPersistWrites, useCasesStore } from "@/lib/stores/cases";
import { formatPatientListName } from "@/lib/cases/patient-utils";
import type { CasePatientRecord } from "@/types";

interface CasePatientRecordCardProps {
  caseId: string;
  patient?: CasePatientRecord;
}

export function CasePatientRecordCard({
  caseId,
  patient,
}: CasePatientRecordCardProps) {
  const updateCase = useCasesStore((s) => s.updateCase);
  const [editing, setEditing] = React.useState(!patient);
  const [firstName, setFirstName] = React.useState(patient?.firstName ?? "");
  const [lastName, setLastName] = React.useState(patient?.lastName ?? "");
  const [patientId, setPatientId] = React.useState(patient?.patientId ?? "");
  const [phone, setPhone] = React.useState(patient?.phone ?? "");
  const [email, setEmail] = React.useState(patient?.email ?? "");
  const [notes, setNotes] = React.useState(patient?.notes ?? "");
  const [savedFlash, setSavedFlash] = React.useState(false);

  React.useEffect(() => {
    if (!patient) return;
    setFirstName(patient.firstName ?? "");
    setLastName(patient.lastName ?? "");
    setPatientId(patient.patientId ?? "");
    setPhone(patient.phone ?? "");
    setEmail(patient.email ?? "");
    setNotes(patient.notes ?? "");
  }, [patient]);

  async function handleSave() {
    const next: CasePatientRecord = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      patientId: patientId.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    };
    if (!next.firstName && !next.lastName) {
      updateCase(caseId, { patient: undefined });
    } else {
      updateCase(caseId, { patient: next });
    }
    await waitForCasesPersistWrites();
    setEditing(false);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  }

  const displayName = formatPatientListName(patient);

  return (
    <section className="rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#0F766E]">
            <User className="size-[18px]" strokeWidth={2} aria-hidden />
          </span>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Patient on file
            </h2>
            {!editing ? (
              <p className="mt-0.5 text-sm font-semibold text-[#0F172A]">
                {displayName}
              </p>
            ) : null}
          </div>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 text-xs font-medium text-[#0F766E] hover:underline"
          >
            Edit
          </button>
        ) : null}
      </div>

      {savedFlash ? (
        <p className="mt-3 text-xs font-medium text-[#0F766E]">Saved.</p>
      ) : null}

      {editing ? (
        <div className="mt-4 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`cp-first-${caseId}`}>First name</Label>
              <Input
                id={`cp-first-${caseId}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`cp-last-${caseId}`}>Last name</Label>
              <Input
                id={`cp-last-${caseId}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`cp-chart-${caseId}`}>Chart / ID</Label>
            <Input
              id={`cp-chart-${caseId}`}
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`cp-phone-${caseId}`}>Phone</Label>
            <Input
              id={`cp-phone-${caseId}`}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`cp-email-${caseId}`}>Email</Label>
            <Input
              id={`cp-email-${caseId}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`cp-notes-${caseId}`}>Notes</Label>
            <textarea
              id={`cp-notes-${caseId}`}
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-y rounded-xl border border-[color:var(--color-warm-200)] bg-white px-3.5 py-2.5 text-base text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-teal-600)]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={handleSave}>
              Save patient
            </Button>
            {patient ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                  setFirstName(patient.firstName ?? "");
                  setLastName(patient.lastName ?? "");
                  setPatientId(patient.patientId ?? "");
                  setPhone(patient.phone ?? "");
                  setEmail(patient.email ?? "");
                  setNotes(patient.notes ?? "");
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      ) : patient &&
        (patient.patientId || patient.phone || patient.email || patient.notes) ? (
        <dl className="mt-3 space-y-1.5 text-xs text-[#334155]">
          {patient.patientId ? (
            <div>
              <dt className="inline text-[#64748B]">Chart: </dt>
              <dd className="inline">{patient.patientId}</dd>
            </div>
          ) : null}
          {patient.phone ? (
            <div>
              <dt className="inline text-[#64748B]">Phone: </dt>
              <dd className="inline">{patient.phone}</dd>
            </div>
          ) : null}
          {patient.email ? (
            <div>
              <dt className="inline text-[#64748B]">Email: </dt>
              <dd className="inline break-all">{patient.email}</dd>
            </div>
          ) : null}
          {patient.notes ? (
            <div>
              <dt className="inline text-[#64748B]">Notes: </dt>
              <dd className="inline">{patient.notes}</dd>
            </div>
          ) : null}
        </dl>
      ) : !editing ? (
        <p className="mt-3 text-xs text-[#64748B]">
          Add a name and contact info for your office library.
        </p>
      ) : null}
    </section>
  );
}
