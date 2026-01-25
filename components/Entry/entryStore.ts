import { create } from "zustand";

export type EntryData = {
  price: number;
  productId: number;
  quantity: number;
  ruc: string;
  startTime: Date;
};

type EntryStore = {
  entries: EntryData[];
  setEntries: (entries: EntryData[]) => void;
  addEntry: (entry: EntryData) => void;
  clearEntries: () => void;
  removeEntry: (index: number) => void;
};

export const useEntryStore = create<EntryStore>((set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) =>
    set((state) => ({
      entries: [...state.entries, entry],
    })),
  clearEntries: () => set({ entries: [] }),
  removeEntry: (index) =>
    set((state) => ({
      entries: state.entries.filter((_, i) => i !== index),
    })),
}));
