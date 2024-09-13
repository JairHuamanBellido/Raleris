import { socket } from "@/core/socket";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { ChatGroupService } from "@/domain/service/ChatGroup.service";
import { useUserStore } from "@/store/user.store";

export default function SubmitMessage() {
  const params = useParams();
  const chatId = params.id as string;
  const { id, username, usernameColor } = useUserStore();

  const [message, setMessage] = useState<string>("");

  const handleSendMessage = async () => {
    const newMessage = await ChatGroupService.sendMessage(message, chatId, {
      id,
      username,
      colorNickname: usernameColor,
    });

    socket.emit("send-message", {
      message: newMessage,
      roomId: chatId,
    });
    setMessage("");
  };
  return (
    <div className=" h-[96px] py-4 flex  space-x-4 items-center justify-between">
      <Input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={handleSendMessage} className="w-fit" variant={"outline"}>
        Send
      </Button>
    </div>
  );
}
