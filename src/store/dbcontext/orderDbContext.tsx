import React, { Context, createContext, ReactNode, useContext } from "react";

export interface OrderDbContextProps {
  entId: string | null;
  setEntId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const OrderContext = createContext<OrderDbContextProps | null>(null);
