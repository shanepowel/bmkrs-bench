"use client";

import { useState } from "react";
import { sendMessage } from "@/actions/messages";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  body: string;
  createdAt: Date;
  sender: { id: string; firstName: string; lastName: string; username: string };
};

export function MessagePanel({
  threadId,
  messages,
  currentUserId,
  onSent,
}: {
  threadId: string;
  messages: Message[];
  currentUserId: string;
  onSent?: () => void | Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await sendMessage(formData);
      await onSent?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-96 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No messages yet. Say hello.</p>
        )}
        {messages.map((m) => {
          const isOwn = m.sender.id === currentUserId;
          return (
            <div key={m.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  isOwn ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"
                )}
              >
                {!isOwn && (
                  <p className="mb-0.5 text-xs font-medium text-slate-500">
                    {m.sender.firstName} {m.sender.lastName}
                  </p>
                )}
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className={cn("mt-1 text-[10px]", isOwn ? "text-blue-100" : "text-slate-400")}>
                  {formatDateTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <form action={handleSubmit} className="border-t border-slate-100 bg-slate-50/50 p-4">
        <input type="hidden" name="threadId" value={threadId} />
        <Textarea name="body" required rows={3} placeholder="Write a message…" />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <Button type="submit" className="mt-3">
          Send
        </Button>
      </form>
    </div>
  );
}
