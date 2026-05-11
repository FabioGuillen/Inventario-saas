import { create } from "zustand";
interface NavbarState {
  isOpen: boolean;
  toggle: () => void;
}

export const useNavbarStore = create<NavbarState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
