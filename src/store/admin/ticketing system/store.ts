// "use client";
// import { create } from "zustand";

// export type TicketType = {
//   id: string;
//   ticketId: string;
//   date?: string;
//   companyName?: string;
//   userName: string;
//   priority: string;
//   status: string;
//   summary?: string;
//   department?: string;
//   order?: number;
// };

// type TicketStore = {
//   tickets: TicketType[];
//   setTickets: (
//     updater: TicketType[] | ((prev: TicketType[]) => TicketType[])
//   ) => void;
// };

// export const useTicketStore = create<TicketStore>((set) => ({
//   tickets: [],
//   setTickets: (updater) =>
//     set((state) => ({
//       tickets: typeof updater === "function" ? updater(state.tickets) : updater,
//     })),
    
// }));

// "use client";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export type TicketType = {
//   assignee: string;
//   type: string;
//   resolution: string;
//   id: string;
//   ticketId: string;
//   date?: string;
//   companyName?: string;
//   userName: string;
//   priority: string;
//   status: string;
//   summary?: string;
//   department?: string;
//   order?: number;
// };

// type TicketStore = {
//   tickets: TicketType[];
//   selectedTicket: TicketType | null;
//   setTickets: (
//     updater: TicketType[] | ((prev: TicketType[]) => TicketType[])
//   ) => void;
//   setSelectedTicket: (ticket: TicketType | null) => void;
//     addTicket: (ticket: TicketType) => void;

// };

// export const useTicketStore = create(
//   persist<TicketStore>(
//     (set, get) => ({
//       tickets: [],
//       selectedTicket: null,

//       setTickets: (updater) =>
//         set((state) => ({
//           tickets:
//             typeof updater === "function"
//               ? updater(state.tickets)
//               : updater,
//         })),

//       setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
//       addTicket: (ticket) =>
//   set((state) => ({
//     tickets: [...state.tickets, ticket]
//   })),

//     }),

//     {
//       name: "ticket-storage", 
//     }
//   )
// );









// store.ts (Zustand)
import { create } from "zustand";

export type TicketType = {
  ticketUserId: any;
  createdAt: string;
  companyId: number;
  branchId: number;
  labels: string;
  estimatedHours: number;
  description: string;
  projectPhaseId: number;
  title: string;
  projectResourceId: number;
  userId: any;
  assignee: string;
  type: string;
  resolution: string;
  id: string;
  ticketId: string;
  date?: string;
  companyName?: string;
  userName: string;
  priority: string;
  status: string;
  summary?: string;
  department?: string;
  order?: number;
};

type TicketStore = {
  tickets: TicketType[];
  selectedTicket: TicketType | null;

  setAllTickets: (
    update: TicketType[] | ((prev: TicketType[]) => TicketType[])
  ) => void;

  setSelectedTicket: (ticket: TicketType | null) => void;

  addTicket: (ticket: TicketType) => void;
  updateTicket: (id: string, data: Partial<TicketType>) => void;
};

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [],
  selectedTicket: null,

  setAllTickets: (update) =>
    set((state) => ({
      tickets:
        typeof update === "function" ? update(state.tickets) : update,
    })),

  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),

  addTicket: (ticket) =>
    set((state) => ({
      tickets: [...state.tickets, ticket],
    })),

  updateTicket: (id, data) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, ...data } : t
      ),
    })),
}));

