import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { socket } from "@/core/socket";
import { RalerisChatGroupIndexDBModel } from "@/infrastructure/model/RalerisChatGroup.model";

export default function RequestToJoinAlert({
  chat,
}: {
  chat: RalerisChatGroupIndexDBModel;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userRequest, setUserRequest] = useState<string>("");

  const onAcceptRequest = () => {
    socket.emit("request-accepted", chat, userRequest);
    setIsOpen(false);
  };

  useEffect(() => {
    socket.on("request-to-join", (message) => {
      setUserRequest(message.userId);
      setIsOpen(true);
    });
  }, []);
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>REQUEST ACCESS!</AlertDialogTitle>
          <AlertDialogDescription>
            USER {userRequest.toUpperCase()} WANT TO JOIN TO THE CHATGROUP
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            DENY
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAcceptRequest}>
            ACCEPT
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
