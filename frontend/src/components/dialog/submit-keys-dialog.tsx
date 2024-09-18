import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { VaultService } from "@/domain/service/Vault.service";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { RalerisChatGroupIndexDBModel } from "@/infrastructure/model/RalerisChatGroup.model";
import { EncryptionService } from "@/domain/service/Encryption.service";
import { ChatGroupService } from "@/domain/service/ChatGroup.service";
import { useUserStore } from "@/store/user.store";
import { socket } from "@/core/socket";

interface Props {
  isOpen: boolean;
  chat: RalerisChatGroupIndexDBModel;
}
export default function SubmitKeysDialog({ chat }: Props) {
  const [privatePem, setPrivatePem] = useState<CryptoKey>();

  const [privatePemSign, setPrivatePemSign] = useState<CryptoKey>();
  const [publicPemVerify, setPublicPemVerify] = useState<CryptoKey>();
  const [publicPem, setPublicPem] = useState<CryptoKey>();
  const [password, setPassword] = useState<string>();
  const [errorState, setErrorState] = useState<{
    isError: boolean;
    message: string;
  }>({ isError: false, message: "" });

  const { id, username } = useUserStore();
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogTitle>VALIDATE INFORMATION</DialogTitle>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              const decryptedPassword = await EncryptionService.decryptText(
                chat.password,
                privatePem!
              );

              const signature = await EncryptionService.signMessage(
                password!,
                privatePemSign!
              );

              const verifySignMessage = await EncryptionService.verifySignature(
                password!,
                publicPemVerify!,
                signature
              );

              if (!verifySignMessage) {
                setErrorState({
                  isError: true,
                  message: "PUBLIC KEY INCOMPATIBLE WITH PRIVATE KEY!",
                });
                return;
              }

              if (password !== decryptedPassword) {
                setErrorState({ isError: true, message: "INVALID PASSWORD!" });
                return;
              }

              await ChatGroupService.import({
                id: chat.id,
                name: chat.name,
                ownerId: chat.ownerId,
                password: password,
                publicKey: publicPem!,
                privateKey: privatePem!,
                messages: [],
                members: [...chat.members, { id, username }],
              });

              socket.emit("new-user-joined", { id, username }, chat.id!);

              window.location.reload();
            } catch (error: Error | any) {
              if (error instanceof Error) {
                setErrorState({ isError: true, message: error.message });
              }
            }
          }}
          className="space-y-8 mt-8"
        >
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

                const privateKeySign =
                  await VaultService.importSignedPrivateKey(privatePemText);

                setPrivatePemSign(privateKeySign);

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

                const publicKeyVerify =
                  await VaultService.importVerifiedPublicKey(publicPemText);
                setPublicPemVerify(publicKeyVerify);
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
          {errorState.isError && (
            <p className="w-full p-1 border-destructive border-[1px] bg-destructive/20 text-destructive">
              {errorState.message}
            </p>
          )}
          <div className="w-full flex justify-end space-x-4">
            <Button type="submit">SUBMIT</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
