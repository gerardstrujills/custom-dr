import { create } from "zustand";

export type ProductData = {
  titulo: string;
  descripcion: string;
  um: string;
  tipomaterial: string;
};

type ProductStore = {
  products: ProductData[];
  setProducts: (products: ProductData[]) => void;
  addProduct: (product: ProductData) => void;
  clearProducts: () => void;
  removeProduct: (index: number) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  clearProducts: () => set({ products: [] }),
  removeProduct: (index) =>
    set((state) => ({
      products: state.products.filter((_, i) => i !== index),
    })),
}));
