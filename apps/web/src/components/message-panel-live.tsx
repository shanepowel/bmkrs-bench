"use client";

import { useCallback, useEffect, useState } from "react";
import { sendMessage } from "@/actions/messages";
import { fetchThreadMessages } from "@/actions/messages-client";
import { MessagePanel } from "@/components/message-panel";

type Message = {
  id: string;
  body: string;
  createdAt: Date;
  sender: { id: string; firstName: string; lastName: string; username: string };
};

export function MessagePanelLive({
  threadId,
  initialMessages,
  currentUserId,
}: {
  threadId: string;
  initialMessages: Message[];
  currentUserId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);

  const refresh = useCallback(async () => {
    const next = await fetchThreadMessages(threadId);
    if (next) setMessages(next);
  }, [threadId]);

  useEffect(() => {
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <MessagePanel
      threadId={threadId}
      messages={messages}
      currentUserId={currentUserId}
      onSent={refresh}
    />
  );
}
