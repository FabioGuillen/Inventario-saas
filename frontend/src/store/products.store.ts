import { create } from "zustand";
import type { Movement } from "../types/types";

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  createdAt: Date;
  movements: Movement[];
}

interface ProductState {
  products: Product[];
  showModal: boolean;
  editProduct: Product | null;
  error: string | null;
  loading: boolean;
  setShowModal: (modal: boolean) => void;
  setEditProduct: (editProduct: Product | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProductLocal: (updatedProduct: Product) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  editProduct: null,
  loading: false,
  error: null,
  showModal: false,
  setEditProduct: (editProduct) => set({ editProduct }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setShowModal: (showModal) => set({ showModal }),
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  updateProductLocal: (updatedProduct) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    })),
}));
