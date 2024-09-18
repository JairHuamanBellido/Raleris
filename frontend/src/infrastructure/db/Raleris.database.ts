import Dexie, { Table } from "dexie";

import { IChatEvents, IMessages } from "@/domain/interface/IMessages";
import { RalerisChatGroupIndexDBModel } from "../model/RalerisChatGroup.model";
import { IChatGroup } from "@/domain/interface/IChatGroup";
import { RalerisUserDB } from "../model/RalerisUser.model";

class RalerisDatabase extends Dexie {
  ralerisChatGroupDatabase!: Table<RalerisChatGroupIndexDBModel, string>;
  ralerisUserDatabase!: Table<RalerisUserDB, string>;
  constructor() {
    super("raleris");
    this.version(1).stores({
      ralerisChatGroupDatabase: "id",
      ralerisUserDatabase: "id",
    });
  }

  async add(payload: IChatGroup) {
    return await this.ralerisChatGroupDatabase.add({
      id: payload.id,
      messages: [],
      name: payload.name,
      privateKey: payload.privateKey,
      publicKey: payload.publicKey,
      ownerId: payload.ownerId,
      password: payload.password,
      members: payload.members
    });
  }

  async getById(id: string) {
    return await this.ralerisChatGroupDatabase.get(id);
  }

  async getAll() {
    return await this.ralerisChatGroupDatabase.toArray();
  }

  async addMessage(message: (IMessages | IChatEvents)[], chatId: string) {
    return await this.ralerisChatGroupDatabase.update(chatId, {
      messages: message,
    });
  }
}

export const RalerisRepository = new RalerisDatabase();
