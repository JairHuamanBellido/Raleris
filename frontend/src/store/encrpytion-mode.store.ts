import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  isEncryptionEnabled: boolean;
};

type Action = {
  updateEncryptionMode: (mode: State["isEncryptionEnabled"]) => void;
};

export const useEncryptionModeStore = create<State & Action, any>(
  persist(
    (set, get) => ({
      isEncryptionEnabled: true,
      updateEncryptionMode: () =>
        set({ isEncryptionEnabled: !get().isEncryptionEnabled }),
    }),
    {
      name: "raleris-storage",
    }
  )
);
