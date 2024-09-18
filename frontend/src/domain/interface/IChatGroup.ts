import { IChatEvents, IMessages } from "./IMessages";
import { IUser } from "./IUser";

export interface ICreateChatGroup
  extends Omit<IChatGroup, "messages" | "members"> {
  admin: IUser;
}

export interface IChatGroup {
  readonly messages: (IMessages | IChatEvents)[];
  readonly id?: string;
  readonly name: string;
  readonly privateKey: CryptoKey;
  readonly publicKey: CryptoKey;
  readonly ownerId: string;
  readonly password: string;
  readonly members: IUser[];
}
