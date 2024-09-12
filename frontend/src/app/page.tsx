"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserService } from "@/domain/service/User.serivce";
import { useUserStore } from "@/store/user.store";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const { updateUser } = useUserStore();
  const users = useLiveQuery(() => UserService.getAll());
  const { push } = useRouter();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-[360px] relative">
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const newUser = await UserService.create(username);

            updateUser({
              id: newUser?.id || "",
              username: newUser?.username || "",
            });
            push("/rooms");
          }}
          className="space-y-4 w-full relative"
        >
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <Button className="w-full">Join</Button>
        </form>
        <div className="flex flex-col mt-8 space-y-4">
          <p className="text-muted-foreground text-center">OR SELECT A USER:</p>
          <div className="w-full flex items-center justify-between space-x-4">
            <Select
              onValueChange={(val) => {
                setSelectedUser(val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an user" />
              </SelectTrigger>
              <SelectContent>
                {!!users &&
                  users.map((user) => (
                    <SelectItem
                      key={user.id}
                      className="text-foreground"
                      value={user.id || ""}
                    >
                      {user.username}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              onClick={async () => {
                const user = await UserService.getById(selectedUser);

                if (user) {
                  updateUser({
                    id: user.id ?? "",
                    username: user.username,
                  });

                  push("/rooms");
                }
              }}
              className="w-fit"
            >
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
