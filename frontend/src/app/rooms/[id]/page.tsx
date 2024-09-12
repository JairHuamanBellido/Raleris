"use client";

import RequestToJoinAlert from "@/components/alert/request-to-join-alert";
import ChatNotFound from "@/components/chat-not-found";
import ChatHeader from "@/components/header";
import Messages from "@/components/messages";
import SubmitMessage from "@/components/submit-message";
import { socket } from "@/core/socket";
import { ChatGroupService } from "@/domain/service/ChatGroup.service";
import { RalerisChatGroupIndexDBModel } from "@/infrastructure/model/RalerisChatGroup.model";
import { useUserStore } from "@/store/user.store";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const chat = useLiveQuery(() => ChatGroupService.getById(params.id));
  if (!chat) {
    return <p>Cargando...</p>;
  } else if ("error" in chat) {
    return <ChatNotFound />;
  }

  return (
    <div className="px-8">
      <RequestToJoinAlert chat={chat} />
      <SocketChatEventsManager chat={chat} />
      <ChatHeader chatTitle={chat.name} />
      <Messages
        ownerId={chat.ownerId}
        messages={chat.messages}
        privateKey={chat.privateKey}
      />
      <SubmitMessage />
    </div>
  );
}

function SocketChatEventsManager({
  chat,
}: {
  chat: RalerisChatGroupIndexDBModel;
}) {
  const { id: userId } = useUserStore();
  useEffect(() => {
    if (chat.ownerId === userId) {
      socket.emit("join-chat-admin", chat.id);

      socket.on("verify-admin-online", (userId) => {
        socket.emit("confirmation-admin-online", chat.id, userId);
      });
    }

    socket.emit("join-chat", chat.id, userId);
  }, []);

  return <></>;
}
