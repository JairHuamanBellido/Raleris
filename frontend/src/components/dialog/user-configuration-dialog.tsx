import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { ColorPicker, useColor } from "react-color-palette";

import { useUserSidebarStore } from "@/store/user-sidebar.store";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user.store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserService } from "@/domain/service/User.serivce";
import { useToast } from "@/hooks/use-toast";

export default function UserConfigurationDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-full h-fit  hover:bg-accent px-2 py-1.5 text-left justify-start"
        >
          SETTINGS
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[800px] h-[600px] max-w-full sm:rounded-none p-0">
        <Container />
      </DialogContent>
    </Dialog>
  );
}

function SidebarItem({
  children,
  keyLabel,
}: {
  children: React.ReactNode;
  keyLabel: string;
}) {
  const { menuItemActive, updateMenuActive } = useUserSidebarStore();
  return (
    <div
      onClick={() => updateMenuActive(keyLabel)}
      className={cn(
        "flex transition-all items-center space-x-2 text-base p-1.5 px-2 cursor-pointer hover:bg-gradient-to-r hover:from-primary/20 hover:to-background",
        {
          "text-primary bg-gradient-to-r from-primary/10 to-background ":
            menuItemActive === keyLabel,
        }
      )}
    >
      {children}
    </div>
  );
}
function Sidebar() {
  return (
    <div className="w-[240px] flex flex-col p-4 bg-background space-y-2">
      <SidebarItem keyLabel="profile">
        <p>PROFILE</p>
      </SidebarItem>
      <SidebarItem keyLabel="settings">
        <p>SETTINGS</p>
      </SidebarItem>
    </div>
  );
}

function Container() {
  const { menuItemActive } = useUserSidebarStore();
  return (
    <div className="w-full flex h-full relative">
      <Sidebar />
      <div className="p-8 w-[calc(100%_-_240px)]">
        {menuItemActive === "profile" && <ProfileContainer />}
      </div>
    </div>
  );
}

function ProfileContainer() {
  const { id, username, usernameColor, updateUser } = useUserStore();
  const [color, setColor] = useColor(usernameColor || "#fff");
  const { toast } = useToast();
  const [usernameModified, setUsernameModified] = useState<string>(username);
  const [colorModified, setColorModified] = useState<string>(color.hex);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await UserService.update({
      id,
      username: usernameModified,
      colorNickname: colorModified,
    }).then(() => {
      toast({
        description: "USER UPDATED!",
      });
    });

    updateUser({
      id,
      username: usernameModified,
      usernameColor: colorModified,
    });
  };

  useEffect(() => {
    setColorModified(color.hex);
  }, [color]);
  return (
    <div className="w-full ">
      <form onSubmit={onSubmit} className="w-full space-y-6">
        <div className="flex flex-col space-y-2">
          <Label>ID</Label>
          <Input disabled value={id} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>USERNAME</Label>
          <Input
            value={usernameModified}
            onChange={(e) => setUsernameModified(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>CHAT USERNAME COLOR</Label>
          <div className="flex items-center space-x-1">
            <p className="text-muted-foreground py-1 bg-muted">
              {[new Date().toLocaleString()]}
            </p>
            <p style={{ color: colorModified }}>
              {"<"}
              {username}
              {">: "}
            </p>
            <p>HELLO WORLD!</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="">
              <div className="text-muted-foreground space-x-2 flex items-center">
                <p>Pick a color: </p>
                <div
                  style={{ background: colorModified }}
                  className="w-4 h-4"
                ></div>
                <p className="text-foreground">{colorModified}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px]">
              <ColorPicker hideAlpha color={color} onChange={setColor} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
