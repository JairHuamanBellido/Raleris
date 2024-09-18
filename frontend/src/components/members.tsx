import { socket } from "@/core/socket";
import { IUser } from "@/domain/interface/IUser";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user.store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UsersWithPresence extends IUser {
  isOnline: boolean;
}

interface Props {
  members: IUser[];
}

export default function Members({ members }: Props) {
  const [users, setUsers] = useState<UsersWithPresence[]>(
    members.map((member) => ({ ...member, isOnline: false }))
  );
  const params = useParams();
  const roomId = params.id as string;

  const { id } = useUserStore();

  useEffect(() => {
    socket.on("user-joined", (userId) => {
      setUsers((prevUsers) =>
        prevUsers.map((member) =>
          member.id === userId ? { ...member, isOnline: true } : member
        )
      );

      socket.emit("member-presence",  id, roomId);
    });

    socket.on("member-presence", (activeUserId: string) => {
      setUsers((prevUsers) =>
        prevUsers.map((member) =>
          member.id === activeUserId ? { ...member, isOnline: true } : member
        )
      );
    });

    socket.on("leave-room", (userId: string) => {
      setUsers((prevUsers) =>
        prevUsers.map((member) =>
          member.id === userId ? { ...member, isOnline: false } : member
        )
      );
    });

    return () => {
      socket.off("user-joined");
      socket.off("member-presence");
      socket.emit("leave-room", roomId, id);
      socket.off("leave-room");
    };
  }, []);

  return (
    <div>
      <h2>Members: </h2>
      {users.map((user) => (
        <Member key={`member-${user.id}`} {...user} />
      ))}
    </div>
  );
}

function Member(member: UsersWithPresence) {
  const { id } = useUserStore();

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn("w-2 h-2 transition-all rounded-full", {
          "bg-green-500": member.isOnline || member.id === id,
          "bg-white/50": !member.isOnline,
        })}
      ></div>
      <p> {member.username}</p>
    </div>
  );
}
