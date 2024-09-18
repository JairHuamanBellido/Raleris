import { IChatEvents, IMessages } from "@/domain/interface/IMessages";
import { RalerisUserDB } from "./RalerisUser.model";

export type RalerisChatGroupIndexDBModel = {
  id?: string;
  name: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  messages: (IMessages | IChatEvents)[];
  ownerId: string;
  password:string;
  members: RalerisUserDB[]
};
