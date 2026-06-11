"use client";

import { useCallback, useEffect, useState } from "react";
import { sendMessage } from "@/actions/messages";
import { fetchThreadMessages } from "@/actions/messages-client";
import { C, mono, PrimaryButton, TextArea } from "@/lib/bench-ui";
import { formatDateTime } from "@/lib/format";

type Message = {
  id: string;
  body: string;
  createdAt: Date;
  sender: { id: string; firstName: string; lastName: string; username: string };
};

export function BenchMessagePanel({
  threadId,
  initialMessages,
  currentUserId,
}: {
  threadId: string;
  initialMessages: Message[];
  currentUserId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const next = await fetchThreadMessages(threadId);
    if (next) setMessages(next);
  }, [threadId]);

  useEffect(() => {
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await sendMessage(formData);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to send");
    }
  }

  return (
    <div style={{ border: `1px solid ${C.paperRule}` }}>
      <div className="max-h-[28rem] space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p style={{ ...mono, color: C.paperFaint }} className="py-8 text-center text-[12px]">
            no messages yet. say hello.
          </p>
        )}
        {messages.map((m) => {
          const isOwn = m.sender.id === currentUserId;
          return (
            <div key={m.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[85%] px-4 py-2.5 text-[14px]"
                style={
                  isOwn
                    ? { background: C.ink, color: C.paper }
                    : { background: "#FFFFFF", color: C.paperText, border: `1px solid ${C.paperRule}` }
                }
              >
                {!isOwn && (
                  <p style={{ ...mono, color: C.paperFaint }} className="mb-1 text-[11px]">
                    {m.sender.firstName} {m.sender.lastName}
                  </p>
                )}
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p
                  style={{ ...mono, color: isOwn ? C.inkFaint : C.paperFaint }}
                  className="mt-1 text-[10px]"
                >
                  {formatDateTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <form
        action={handleSubmit}
        className="space-y-3 p-4"
        style={{ borderTop: `1px solid ${C.paperRule}`, background: "rgba(255,255,255,0.5)" }}
      >
        <input type="hidden" name="threadId" value={threadId} />
        <TextArea name="body" required rows={3} placeholder="write a message…" />
        {error && (
          <p className="text-[13px]" style={{ color: C.orange }}>
            {error}
          </p>
        )}
        <PrimaryButton type="submit">send</PrimaryButton>
      </form>
    </div>
  );
}
