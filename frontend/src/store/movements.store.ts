import { create } from "zustand";
interface Form {
  productId: string;
  type: string;
  quantity: string;
}
interface MovementState {
  form: Form;
  movements: any[];
  modal: boolean;
  loading: boolean;
  setForm: (form: Form) => void;
  setModal: (modal: boolean) => void;
  setLoading: (loading: boolean) => void;
  setMovements: (movements: any[]) => void;
}
export const useMovementStore = create<MovementState>((set) => ({
  form: { productId: "", type: "IN", quantity: "" },
  modal: false,
  loading: false,
  movements: [],
  setForm: (form) => set({ form }),
  setLoading: (loading) => set({ loading }),
  setModal: (modal) => set({ modal }),
  setMovements: (movements) => set({ movements }),
}));
