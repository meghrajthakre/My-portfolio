import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

function PreviewTab({ active, children, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "text-[var(--color-text)]"
          : "text-[var(--color-secondary-text)] hover:text-[var(--color-text)]"
      }`}
    >
      {children}
      {active && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-text)]" />
      )}
    </button>
  );
}

export default function ComponentPreview({ children, sourceLoader }) {
  const [tab, setTab] = useState("preview");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceError, setSourceError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (tab !== "code" || !sourceLoader || source || sourceError) return undefined;
    let active = true;
    setLoading(true);
    sourceLoader()
      .then((code) => {
        if (active) setSource(code);
      })
      .catch((error) => {
        console.error("Unable to load component source.", error);
        if (active) setSourceError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [sourceError, source, sourceLoader, tab]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
    } catch (error) {
      console.error("Unable to copy component source.", error);
      setCopied(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-preview-frame-bg)] p-1.5">
      <div
        role="tablist"
        aria-label="Component preview"
        className="flex items-center gap-1 px-2"
      >
        <PreviewTab active={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </PreviewTab>
        <PreviewTab active={tab === "code"} onClick={() => setTab("code")}>
          Code
        </PreviewTab>
      </div>

      <div
        role="tabpanel"
        className="relative mt-1 min-h-80 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] bg-[var(--color-preview-bg)]"
      >
        {tab === "preview" ? (
          <div className="min-h-80 px-4 py-8 sm:px-6">{children}</div>
        ) : (
          <div className="relative min-h-80">
            {source && (
              <button
                type="button"
                onClick={copySource}
                className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--color-text)_14%,transparent)] bg-[var(--color-card-bg)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-text)_10%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
            {loading ? (
              <p className="grid min-h-80 place-items-center text-sm text-[var(--color-secondary-text)]" role="status">
                Loading source...
              </p>
            ) : source ? (
              <pre className="max-h-[36rem] min-h-80 overflow-auto p-5 pt-16 text-xs leading-6 text-[var(--color-text)] sm:text-sm">
                <code>{source}</code>
              </pre>
            ) : (
              <p
                className="grid min-h-80 place-items-center px-6 text-center text-sm text-[var(--color-secondary-text)]"
                role={sourceError ? "alert" : undefined}
              >
                {sourceError
                  ? "Could not load this component's source."
                  : "Source code is not available for this component yet."}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
