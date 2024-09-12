import { useEncryptionModeStore } from "@/store/encrpytion-mode.store";
import { Toggle } from "./ui/toggle";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface Props {
  chatTitle: string;
}
export default function ChatHeader({ chatTitle }: Props) {
  const { isEncryptionEnabled, updateEncryptionMode } =
    useEncryptionModeStore();
  return (
    <div className="flex w-full items-center justify-between h-16 ">
      <h2 className="uppercase">{chatTitle}</h2>
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <Toggle
            pressed={isEncryptionEnabled}
            onPressedChange={() => updateEncryptionMode(!isEncryptionEnabled)}
          >
            {isEncryptionEnabled ? (
              <ShieldCheck className="text-primary" />
            ) : (
              <ShieldAlert className="text-destructive" />
            )}
          </Toggle>
        </div>
      </div>
    </div>
  );
}
