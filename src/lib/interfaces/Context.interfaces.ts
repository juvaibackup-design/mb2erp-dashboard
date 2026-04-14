import { UserProps } from "@/app/layout";
import { createContext } from "react";

export interface TranslationContextProps {
  selectedLang: string | undefined;
  setSelectedLang: Function;
}

export interface TrackMenuContextProps {
  setTrackMenu: Function;
  trackMenu: string[];
  setCurrentActiveMenu: Function;
  currentActiveMenu: string;
  setCurrentSubActiveMenu: Function;
  currentSubActiveMenu: string;
}

export interface SideBarStateContextProps {
  setCollapse: Function;
  collapse: boolean;
}

export interface LoaderContextProps {
  setLoader: Function;
  loader: boolean;
}

export interface User {
  user: UserProps | undefined;
  setUser: Function;
}

export const TranslationContext = createContext<TranslationContextProps | null>(
  null
);
export const TabTrackContext = createContext<TrackMenuContextProps | null>(
  null
);

export const LoaderContext = createContext<LoaderContextProps | null>(null);
export const SideBarStateContext =
  createContext<SideBarStateContextProps | null>(null);

export const UserContext = createContext<User | null>(null);
