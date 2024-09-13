import { create } from "zustand";

type State = {
  menuItemActive: string;
};

type Action = {
  updateMenuActive: (mode: State["menuItemActive"]) => void;
};

export const useUserSidebarStore = create<State & Action>((set) => ({
  menuItemActive: "profile",
  updateMenuActive: (menuItem) => set({ menuItemActive: menuItem }),
}));
