import { v4 as uuidv4 } from "uuid";
import { IUser } from "../interface/IUser";
import { RalerisRepository } from "@/infrastructure/db/Raleris.database";

export class UserService {
  static async create(username: string) {
    const newUser: IUser = {
      id: uuidv4(),
      username,
    };

    const createdUserId = await RalerisRepository.ralerisUserDatabase.add(
      newUser,
      "id"
    );
    return RalerisRepository.ralerisUserDatabase.get(createdUserId);
  }

  static async getAll() {
    return await RalerisRepository.ralerisUserDatabase.toArray();
  }

  static async getById(id: string) {
    return await RalerisRepository.ralerisUserDatabase.get(id);
  }
}
