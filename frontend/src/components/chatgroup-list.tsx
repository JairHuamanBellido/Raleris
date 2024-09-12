import { ChatGroupService } from "@/domain/service/ChatGroup.service";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "./ui/button";
import Link from "next/link";

export default function ChatGroupList() {
  const chatGroup = useLiveQuery(() => ChatGroupService.getAll());

  return (
    <>
      {!!chatGroup &&
        chatGroup.map((chat) => (
          <div className="border w-[400px] p-4 space-y-4">
            <p className="text-xl">{chat.name}</p>
            <Button variant={"ghost"} asChild>
              <Link href={`/rooms/${chat.id}`}>JOIN</Link>
            </Button>
          </div>
        ))}
    </>
  );
}
