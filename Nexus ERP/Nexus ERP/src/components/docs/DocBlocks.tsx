import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "text", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      // Fallback for iframes / non-secure contexts (e.g. preview sandbox)
      try {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-border bg-background/60 shadow-card-soft">
      <div className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-md bg-primary/15 px-2 py-0.5 font-mono font-semibold text-primary">
            {language}
          </span>
          {filename && <span className="font-mono text-muted-foreground">{filename}</span>}
        </div>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
          aria-label="Copiar código"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" /> Copiado
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copiar
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  );
}

export function DocSection({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90">{children}</div>;
}

export function DocH3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-xl font-bold tracking-tight text-foreground">{children}</h3>;
}

export function DocH4({ children }: { children: ReactNode }) {
  return <h4 className="mt-6 text-base font-semibold text-foreground">{children}</h4>;
}

export function DocP({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-muted-foreground">{children}</p>;
}

export function DocList({ items, ordered = false }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={cn(
        "ml-5 space-y-2 text-[15px] text-muted-foreground",
        ordered ? "list-decimal" : "list-disc",
      )}
    >
      {items.map((it, i) => (
        <li key={i} className="pl-1">
          {it}
        </li>
      ))}
    </Tag>
  );
}

export function Callout({
  title,
  children,
  variant = "info",
}: {
  title: string;
  children: ReactNode;
  variant?: "info" | "warning" | "success";
}) {
  const tone = {
    info: "border-primary/40 bg-primary/5",
    warning: "border-warning/40 bg-warning/5",
    success: "border-success/40 bg-success/5",
  }[variant];
  return (
    <div className={cn("my-4 rounded-xl border p-4", tone)}>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
