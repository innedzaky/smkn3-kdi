"use client";

export interface ToastMessage {
  id: number;
  type: "success" | "error" | "info";
  text: string;
}

export function ToastStack({ toasts }: { toasts: ToastMessage[] }) {
  if (!toasts.length) return null;
  return (
    <div className="admin-toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`admin-toast admin-toast-${t.type}`}>
          {t.type === "success" ? "✅ " : t.type === "error" ? "⚠️ " : "ℹ️ "}
          {t.text}
        </div>
      ))}
    </div>
  );
}
