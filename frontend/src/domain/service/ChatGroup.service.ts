import { v4 as uuidv4 } from "uuid";
import { IChatGroup, ICreateChatGroup } from "../interface/IChatGroup";
import { RalerisRepository } from "@/infrastructure/db/Raleris.database";
import {
  IChatEvents,
  ICreateChatEvent,
  IMessages,
} from "../interface/IMessages";
import { EncryptionService } from "./Encryption.service";
import { IUser } from "../interface/IUser";

export class ChatGroupService {
  static async create(payload: ICreateChatGroup) {
    const encryptedPassword = await EncryptionService.encryptText(
      payload.password,
      payload.publickey
    );

    const newChatGroup: IChatGroup = {
      id: payload.id || uuidv4(),
      messages: [],
      name: payload.name,
      privateKey: payload.privateKey,
      publicKey: payload.publickey,
      ownerId: payload.ownerId,
      password: encryptedPassword,
    };

    return await RalerisRepository.add(newChatGroup);
  }

  static async getById(id: string) {
    const chatRoom = await RalerisRepository.getById(id);

    if (!chatRoom) {
      return {
        error: true,
        message: "Room not found",
      };
    }
    return chatRoom;
  }

  static async getAll() {
    return await RalerisRepository.getAll();
  }

  static async sendMessage(message: string, chatGroupId: string, user: IUser) {
    const chatGroup = await RalerisRepository.getById(chatGroupId);
    const publicKey = chatGroup?.publicKey!;

    const [encrpytedText, encryptedDate] = await Promise.all([
      await EncryptionService.encryptText(message, publicKey),
      await EncryptionService.encryptText(
        new Date().toISOString(),
        publicKey
      ),
    ]);

    const newMessage: IMessages = {
      id: uuidv4(),
      text: encrpytedText,
      created_at: encryptedDate,
      sender: user,
    };

    await RalerisRepository.addMessage(
      [...chatGroup?.messages!, newMessage],
      chatGroupId
    );

    return newMessage;
  }

  static async saveChatEvent(event: ICreateChatEvent, chatGroupId: string) {
    const chatGroup = await RalerisRepository.getById(chatGroupId);
    const publicKey = chatGroup?.publicKey!;

    const [encryptedEventType, encryptedEventMessage, encryptedEventDate] =
      await Promise.all([
        await EncryptionService.encryptText(event.type, publicKey),
        await EncryptionService.encryptText(event.message, publicKey),
        await EncryptionService.encryptText(
          new Date().toISOString(),
          publicKey
        ),
      ]);

    const newChatEvent: IChatEvents = {
      id: uuidv4(),
      type: encryptedEventType,
      message: encryptedEventMessage,
      created_at: encryptedEventDate,
    };

    await RalerisRepository.addMessage(
      [...chatGroup?.messages!, newChatEvent],
      chatGroupId
    );

    return newChatEvent;
  }
}
