import { IUser } from "./IUser";

export type TChatEvents = "JOIN" | "LEAVE";
export interface IMessages {
  id: string;
  text: string;
  created_at: string;
  sender: IUser;
}

export interface ICreateChatEvent {
  type: TChatEvents | string;
  message: string;
}

export interface IChatEvents extends ICreateChatEvent {
  id: string;
  created_at:string;
}
