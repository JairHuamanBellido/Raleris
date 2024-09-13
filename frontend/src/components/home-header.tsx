import { useUserStore } from "@/store/user.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import UserConfigurationDialog from "./dialog/user-configuration-dialog";

export default function HomeHeader() {
  return (
    <header className="w-full h-16 py-4 px-12 flex items-center justify-between">
      <h1>RALERIS</h1>
      <UserDropwDownMenu />
    </header>
  );
}

function UserDropwDownMenu() {
  const { username } = useUserStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="flex items-center space-x-2 px-2 ">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="bottom">
        <DropdownMenuLabel className="flex flex-col">
          <p className="text-muted-foreground text-sm"> Username:</p>
          <p>{username}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <UserConfigurationDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
