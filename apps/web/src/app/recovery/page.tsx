"use client";

import { useEffect, useState } from "react";
import { STORAGE_KEY, SCHEMA_VERSION } from "@florify/shared";

/**
 * Emergency recovery page — minimal dependencies, no Zustand, no hydration.
 * Reads raw localStorage and lets the user copy/download their save data.
 * Accessible via /recovery or secret gesture (5 taps on top-left corner).
 */
export default function RecoveryPage() {
  const [raw, setRaw] = useState<string | null>(null);
  const [exportStr, setExportStr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{
    species: number;
    schemaVersion: number;
    updatedAt: string;
  } | null>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      setRaw(data);
      if (data) {
        const parsed = JSON.parse(data);
        setInfo({
          species: Array.isArray(parsed.collection)
            ? parsed.collection.length
            : 0,
          schemaVersion: parsed.schemaVersion ?? 0,
          updatedAt: parsed.updatedAt
            ? new Date(parsed.updatedAt).toLocaleString()
            : "unknown",
        });
        // Build export string (florify1: + base64(gzip(json)))
        buildExportString(parsed)
          .then(setExportStr)
          .catch(() => {
            // Fallback: just base64 the raw JSON without gzip
            setExportStr(
              "florify-raw:" + btoa(unescape(encodeURIComponent(data))),
            );
          });
      }
    } catch (e) {
      setError(
        `Failed to read localStorage: ${e instanceof Error ? e.message : "unknown"}`,
      );
    }
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for iOS
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `florify-save-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildVersion = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>Florify Recovery</h1>
      <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
        Build: <strong>{buildVersion}</strong> · Schema:{" "}
        <strong>v{SCHEMA_VERSION}</strong>
      </p>

      {error && (
        <div
          style={{
            background: "#fee",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            color: "#c00",
          }}
        >
          {error}
        </div>
      )}

      {raw === null && !error && (
        <div
          style={{
            background: "#fff3cd",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          ไม่มี save data ใน localStorage
        </div>
      )}

      {info && (
        <div
          style={{
            background: "#f0f7f0",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <div>
            Species collected: <strong>{info.species}</strong>
          </div>
          <div>
            Save schema: <strong>v{info.schemaVersion}</strong>
          </div>
          <div>
            Last updated: <strong>{info.updatedAt}</strong>
          </div>
        </div>
      )}

      {exportStr && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={() => handleCopy(exportStr)}
            style={{
              padding: "14px 20px",
              fontSize: 16,
              fontWeight: 600,
              background: copied ? "#4caf50" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            {copied ? "Copied!" : "Copy Save Code"}
          </button>
          <button
            onClick={() => handleDownload(exportStr)}
            style={{
              padding: "14px 20px",
              fontSize: 16,
              fontWeight: 600,
              background: "#f5f5f5",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            Download as File
          </button>
        </div>
      )}

      {raw && (
        <details style={{ marginTop: 24 }}>
          <summary style={{ cursor: "pointer", fontSize: 14, color: "#666" }}>
            Raw JSON (debug)
          </summary>
          <button
            onClick={() => handleCopy(raw)}
            style={{
              marginTop: 8,
              padding: "8px 12px",
              fontSize: 13,
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fafafa",
              cursor: "pointer",
            }}
          >
            Copy Raw JSON
          </button>
          <pre
            style={{
              marginTop: 8,
              fontSize: 11,
              background: "#f5f5f5",
              padding: 12,
              borderRadius: 8,
              overflow: "auto",
              maxHeight: 300,
            }}
          >
            {raw.slice(0, 5000)}
            {raw.length > 5000 ? "\n...(truncated)" : ""}
          </pre>
        </details>
      )}

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <a href="/" style={{ color: "#2563eb", fontSize: 14 }}>
          Back to Florify
        </a>
      </div>
    </div>
  );
}

/** Compress and encode save data — same format as saveTransfer.ts but standalone. */
async function buildExportString(
  state: Record<string, unknown>,
): Promise<string> {
  const envelope = {
    format: "florify-save",
    formatVersion: 1,
    exportedAt: Date.now(),
    schemaVersion: state.schemaVersion,
    state,
  };
  const json = JSON.stringify(envelope);
  const encoded = new TextEncoder().encode(json);
  const stream = new Blob([encoded])
    .stream()
    .pipeThrough(new CompressionStream("gzip"));
  const buf = await new Response(stream).arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return "florify1:" + btoa(binary);
}
