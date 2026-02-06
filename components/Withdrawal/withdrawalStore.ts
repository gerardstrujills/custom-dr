import { create } from "zustand";

export type WithdrawalData = {
  endTime: string | Date;
  productId: number;
  quantity: number;
  title: string;
};

type WithdrawalStore = {
  withdrawals: WithdrawalData[];
  setWithdrawals: (withdrawals: WithdrawalData[]) => void;
  addWithdrawal: (w: WithdrawalData) => void;
  clearWithdrawal: () => void;
  removeWithdrawal: (index: number) => void;
};

export const useWithdrawalStore = create<WithdrawalStore>((set) => ({
  withdrawals: [],
  setWithdrawals: (withdrawals) => set({ withdrawals }),
  addWithdrawal: (w) =>
    set((state) => ({
      withdrawals: [...state.withdrawals, w],
    })),
  clearWithdrawal: () => set({ withdrawals: [] }),
  removeWithdrawal: (index) =>
    set((state) => ({
      withdrawals: state.withdrawals.filter((_, i) => i !== index),
    })),
}));
