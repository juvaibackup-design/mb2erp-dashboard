import create from "zustand";

interface NumberStore {
  number: number; // State to store the single number
  setNumber: (value: any) => void; // Function to update the number
}

const useTransactionValue = create<NumberStore>((set) => ({
  number: 0, // Initial state value
  setNumber: (value) => set(() => ({ number: value })), // Update the number state
}));

export default useTransactionValue;
