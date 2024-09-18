import { socket } from "@/core/socket";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/user.store";
import SubmitKeysDialog from "./dialog/submit-keys-dialog";
import { RalerisChatGroupIndexDBModel } from "@/infrastructure/model/RalerisChatGroup.model";

export default function ChatNotFound() {
  const params = useParams();
  const chatId = params.id as string;
  const { id: userId } = useUserStore();
  const [isAllowToRequest, setIsAllowToRequest] = useState<boolean>(false);
  const [isRequestedAccepted, setIsRequestAccepted] = useState<boolean>(false);
  const [requestedChat, setRequestedChat] =
    useState<RalerisChatGroupIndexDBModel>();
  useEffect(() => {
    socket.emit("request-is-admin-online", chatId, userId);
    socket.on("admin-online", (data) => {
      setIsAllowToRequest(true);
    });

    socket.on(
      "request-accepted",
      (chat: RalerisChatGroupIndexDBModel, user) => {
        setRequestedChat(chat);
        setIsRequestAccepted(true);
      }
    );
  }, []);

  const onRequestAccess = () => {
    socket.emit("request-to-join", chatId, userId);
  };
  return (
    <div className="w-screen h-screen space-y-2 flex flex-col items-center justify-center">
      <h2 className="text-2xl">CHAT NOT FOUND</h2>
      <p className="text-muted-foreground">
        CHATROOM NOT EXIST OR THE ADMIN IS OFFLINE.
      </p>
      {isAllowToRequest && (
        <Button onClick={onRequestAccess} variant={"outline"}>
          REQUEST TO JOIN
        </Button>
      )}
      {isRequestedAccepted && (
        <SubmitKeysDialog chat={requestedChat!} isOpen={true} />
      )}
    </div>
  );
}
