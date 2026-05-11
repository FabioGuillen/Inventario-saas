import { create } from "zustand";
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
interface UserState {
  users: User[];

  setUsers: (user: User[]) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  clearUser: () => set({ users: [] }),
}));
