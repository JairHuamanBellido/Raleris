import { IChatEvents, IMessages } from "@/domain/interface/IMessages";

export type RalerisChatGroupIndexDBModel = {
  id?: string;
  name: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  messages: (IMessages | IChatEvents)[];
  ownerId: string;
  password:string;
};
