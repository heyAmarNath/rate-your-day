"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { exportAll, importAll } from "@/lib/entries";
import { todayKey } from "@/lib/dates";

const THEMES = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const card = "rounded-2xl border border-border bg-surface p-5";
const btn = "rounded-lg border border-border px-4 py-2 text-sm hover:bg-empty";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const onExport = async () => {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rate-your-day-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ kind: "ok", text: `Exported ${data.entries.length} entries.` });
  };

  const onImport = async (file: File) => {
    try {
      const res = await importAll(JSON.parse(await file.text()));
      const parts = [`${res.added} added`, `${res.updated} updated`, `${res.skipped} unchanged`];
      if (res.invalid) parts.push(`${res.invalid} invalid skipped`);
      setMessage({ kind: "ok", text: `Import done: ${parts.join(", ")}.` });
    } catch (e) {
      setMessage({ kind: "error", text: e instanceof Error ? e.message : "Import failed" });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="mb-5 text-xl font-semibold tracking-tight sm:text-2xl">Settings</h1>

      <section className={card}>
        <h2 className="mb-3 font-medium">Theme</h2>
        <div className="inline-flex rounded-lg border border-border p-1" role="radiogroup" aria-label="Theme">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={mounted && theme === t.value}
              onClick={() => setTheme(t.value)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                mounted && theme === t.value ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className={card}>
        <h2 className="mb-1 font-medium">Backup</h2>
        <p className="mb-4 text-sm text-muted">
          Your ratings are stored only in this browser. Export a backup file now and then, and import it to restore or
          move to another device. When a day exists in both, the most recently edited version is kept.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={onExport}>
            Export JSON
          </button>
          <button type="button" className={btn} onClick={() => fileRef.current?.click()}>
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])}
          />
        </div>
        {message && (
          <p className={`mt-3 text-sm ${message.kind === "error" ? "text-red-500" : "text-muted"}`} role="status">
            {message.text}
          </p>
        )}
      </section>
    </div>
  );
}
