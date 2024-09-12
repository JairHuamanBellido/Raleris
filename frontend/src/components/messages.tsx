import { useEffect, useRef, useState } from "react";

import { useEncryptionModeStore } from "@/store/encrpytion-mode.store";
import { EncryptionService } from "@/domain/service/Encryption.service";
import { IChatEvents, IMessages } from "@/domain/interface/IMessages";
import { socket } from "@/core/socket";
import { ChatGroupService } from "@/domain/service/ChatGroup.service";
import { useParams } from "next/navigation";

interface Props {
  messages: (IMessages | IChatEvents)[];
  privateKey: CryptoKey;
  ownerId: string;
}
export default function Messages({ messages, privateKey, ownerId }: Props) {
  const [dynamicMessages, setDynamicMessages] =
    useState<(IMessages | IChatEvents)[]>(messages);

  const params = useParams();
  const chatId = params.id as string;
  const ref = useRef(null);
  const { isEncryptionEnabled } = useEncryptionModeStore();
  useEffect(() => {
    socket.on("send-message", async (data) => {
      const decryptedMessage = await EncryptionService.decryptText(
        data.text,
        privateKey
      );
      await ChatGroupService.sendMessage(decryptedMessage, chatId, data.sender);
    });
  }, []);

  useEffect(() => {
    if (isEncryptionEnabled) {
      setDynamicMessages(messages);
    } else {
      onDecryptMessage();
    }
    scrollToBottom();
  }, [messages, isEncryptionEnabled]);

  const onDecryptMessage = async () => {
    const decryptedMessages: (IMessages | IChatEvents)[] = [];
    for await (const message of messages!) {
      if (!("type" in message)) {
        const decryptedMessage = await EncryptionService.decryptText(
          message.text,
          privateKey
        );
        const decryptedCreatedAt = await EncryptionService.decryptText(
          message.created_at,
          privateKey
        );
        decryptedMessages.push({
          text: decryptedMessage,
          id: message.id,
          created_at: decryptedCreatedAt,
          sender: message.sender,
        });
      } else {
        const decryptedEventMessage = await EncryptionService.decryptText(
          message.message,
          privateKey
        );
        const decryptedEventType = await EncryptionService.decryptText(
          message.type,
          privateKey
        );

        const decryptedCreatedAt = await EncryptionService.decryptText(
          message.created_at,
          privateKey
        );
        decryptedMessages.push({
          id: message.id,
          type: decryptedEventType,
          message: decryptedEventMessage,
          created_at: decryptedCreatedAt,
        });
      }
    }

    setDynamicMessages(decryptedMessages);
  };

  const scrollToBottom = () => {
    if (ref.current) {
      (ref.current as HTMLDivElement).scrollTop = (
        ref.current as HTMLDivElement
      ).scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [dynamicMessages]);

  return (
    <div
      ref={ref}
      className="flex  flex-col space-y-2 w-full h-[calc(100vh_-_160px)] overflow-auto"
    >
      {dynamicMessages!.map((message) => {
        if ("type" in message) {
          return (
            <div
              key={message.id}
              className="flex bg-blue-900/90 py-0 flex-col space-y-1 w-fit"
            >
              <div className="w-full flex items-center">
                <div className="text-primary space-x-2">
                  <span className="text-muted-foreground py-1">
                    {!isEncryptionEnabled &&
                      new Date(message.created_at).toLocaleTimeString()}
                  </span>
                  <span className="text-blue-300">EVENT: {message.type}</span>
                </div>
                <p className="break-words ml-2">{message.message}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div key={message.id} className="flex flex-col space-y-1">
              <div className="w-full flex items-center">
                <div className="text-foreground">
                  <span className="text-muted-foreground py-1 bg-muted">
                    [
                    {!isEncryptionEnabled &&
                      new Date(message.created_at).toLocaleString()}
                    ]
                  </span>

                  {ownerId === message.sender.id ? (
                    <>
                      <span
                        style={{
                          textShadow: `0px 0px 10px hsl(var(--primary))`,
                        }}
                        className="text-primary"
                      >
                        {"["}ADMIN{"]"}
                      </span>
                      {"<"}
                      {message.sender.username}
                      {">"}
                    </>
                  ) : (
                    <>
                      {"<"}
                      {message.sender.username}
                      {">"}
                    </>
                  )}
                  {": "}
                </div>
                <p className="break-words ml-1">{message.text}</p>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
