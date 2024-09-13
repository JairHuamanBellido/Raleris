import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { VaultService } from "@/domain/service/Vault.service";
import { ChatGroupService } from "@/domain/service/ChatGroup.service";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user.store";

export default function CreateGroupChatDialog() {
  const [privatePem, setPrivatePem] = useState<CryptoKey>();
  const [publicPem, setPublicPem] = useState<CryptoKey>();
  const [password, setPassword] = useState<string>("");
  const { id: userId } = useUserStore();
  const [name, setName] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { push } = useRouter();
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>CREATE CHAT</Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={() => {
          setIsOpen(false);
        }}
        className="bg-background/5 backdrop-blur-md sm:rounded-none"
      >
        <DialogHeader>
          <DialogTitle>CREATE CHAT GROUP</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const roomId = await ChatGroupService.create({
              name,
              privateKey: privatePem!,
              publicKey: publicPem!,
              ownerId: userId,
              password,
            });

            setIsOpen(false);
            push(`/rooms/${roomId}`);
          }}
          className="space-y-8 mt-8"
        >
          <div className="flex flex-col space-y-4">
            <Label>NAME</Label>
            <Input
              type="text"
              required
              onChange={async (e) => {
                setName(e.target.value);
              }}
              value={name}
              name="name"
              id="name"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <Label>PRIVATE KEY</Label>
            <Input
              type="file"
              required
              onChange={async (e) => {
                const files = (e.target.files as FileList)[0];
                const privatePemText = await files.text();

                const privateKey = await VaultService.importPrivateKey(
                  privatePemText
                );

                setPrivatePem(privateKey);
              }}
              name="private_key"
              id="private_key"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <Label>PUBLIC KEY</Label>
            <Input
              type="file"
              required
              onChange={async (e) => {
                const files = (e.target.files as FileList)[0];
                const publicPemText = await files.text();

                const publicKey = await VaultService.importPublicKey(
                  publicPemText
                );
                setPublicPem(publicKey);
              }}
              name="public_key"
              id="public_key"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <Label>PASSWORD</Label>
            <Input
              type="password"
              required
              onChange={async (e) => {
                setPassword(e.target.value);
              }}
              value={password}
              name="password"
              id="password"
            />
          </div>
          <div className="w-full flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant={"outline"}
            >
              CLOSE
            </Button>
            <Button type="submit">SUBMIT</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
