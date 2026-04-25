"use client";

import * as React from "react";
import { Camera, Check, RefreshCw, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGenerateForm } from "@/lib/stores/generate-form";

type Mode = "idle" | "webcam";

export function PhotoUpload() {
  const photo = useGenerateForm((s) => s.form.photoDataUrl);
  const confirmed = useGenerateForm((s) => s.form.photoConfirmed);
  const setPhoto = useGenerateForm((s) => s.setPhoto);
  const confirmPhoto = useGenerateForm((s) => s.confirmPhoto);

  const [mode, setMode] = React.useState<Mode>("idle");
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fileRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  React.useEffect(() => {
    return () => stopWebcam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFile(file: File | null) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large (max 10 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function startWebcam() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setMode("webcam");
      // wait a tick for the video element to mount
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setError("Unable to access webcam. Check browser permissions.");
    }
  }

  function stopWebcam() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setMode("idle");
  }

  function captureFromWebcam() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg", 0.92));
    stopWebcam();
  }

  function clearPhoto() {
    setPhoto(null);
    confirmPhoto(false);
  }

  // RENDER

  if (photo) {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-warm-200)] bg-[color:var(--color-warm-100)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt="Patient photo preview"
            className="mx-auto max-h-[420px] w-auto"
          />
          <button
            onClick={clearPhoto}
            className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
            aria-label="Remove photo"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="rounded-xl border border-[color:var(--color-warm-200)] bg-white p-4">
          <p className="mb-3 text-sm text-[color:var(--color-warm-600)]">
            Confirm the photo meets clinical quality:
            <span className="ml-1 font-medium text-[color:var(--color-warm-900)]">
              face centered, mouth clearly visible, good lighting.
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={confirmed ? "primary" : "outline"}
              size="md"
              onClick={() => confirmPhoto(!confirmed)}
            >
              <Check className="size-4" />
              {confirmed ? "Photo confirmed" : "Confirm photo"}
            </Button>
            <Button variant="secondary" size="md" onClick={clearPhoto}>
              <RefreshCw className="size-4" /> Replace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "webcam") {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-warm-200)] bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className="mx-auto aspect-[4/3] w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3">
            <Button variant="secondary" onClick={stopWebcam}>
              Cancel
            </Button>
            <Button onClick={captureFromWebcam}>
              <Camera className="size-4" /> Capture
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // idle
  return (
    <div className="space-y-4">
      <label
        htmlFor="photo-input"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors",
          dragOver
            ? "border-[color:var(--color-teal-600)] bg-[color:var(--color-teal-50)]"
            : "border-[color:var(--color-warm-300)] bg-white hover:border-[color:var(--color-teal-500)] hover:bg-[color:var(--color-teal-50)]",
        )}
      >
        <div className="rounded-full bg-[color:var(--color-teal-50)] p-3 text-[color:var(--color-teal-700)]">
          <Upload className="size-6" />
        </div>
        <div>
          <p className="font-medium text-[color:var(--color-warm-900)]">
            Drop a patient photo here, or click to upload
          </p>
          <p className="text-sm text-[color:var(--color-warm-500)]">
            JPG or PNG, up to 10 MB. Face centered, smile visible.
          </p>
        </div>
        <input
          id="photo-input"
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[color:var(--color-warm-200)]" />
        <span className="text-xs uppercase tracking-wide text-[color:var(--color-warm-500)]">
          or
        </span>
        <div className="h-px flex-1 bg-[color:var(--color-warm-200)]" />
      </div>

      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={startWebcam}
      >
        <Camera className="size-4" /> Capture with webcam
      </Button>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
