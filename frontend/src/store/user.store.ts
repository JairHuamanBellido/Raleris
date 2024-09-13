import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  username: string;
  id: string;
  usernameColor?: string;
};

type Action = {
  updateUser: (mode: State) => void;
};

export const useUserStore = create<State & Action, any>(
  persist(
    (set) => ({
      id: "",
      username: "",
      updateUser: (payload) =>
        set({
          id: payload.id,
          username: payload.username,
          usernameColor: payload.usernameColor,
        }),
    }),
    {
      name: "raleris-user-storage",
    }
  )
);
