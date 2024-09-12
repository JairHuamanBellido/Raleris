import { IMessages } from "./IMessages";

export interface ICreateChatGroup {
  readonly id?: string;
  readonly name: string;
  readonly privateKey: CryptoKey;
  readonly publickey: CryptoKey;
  readonly ownerId: string;
  readonly password: string;
}

export interface IChatGroup extends ICreateChatGroup {
  readonly messages: IMessages[];
}
