import Dexie, { Table } from "dexie";
class AppDB extends Dexie {
  [x: string]: any;
  state!: Table<any, string>; // Use key as the primary key
  constructor() {
    super("localDB");
    this.version(1).stores({
      state: "&key", // unique key like 'pos-state'
    });
  }
}
export const localDB = new AppDB();
