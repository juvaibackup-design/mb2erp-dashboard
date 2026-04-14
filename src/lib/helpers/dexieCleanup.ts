// src/lib/utils/dexieCleanup.ts
import { localDB } from "@/store/localStorage/store";

export async function clearAllDexieData() {
  try {
    await localDB.state.clear(); // nuke everything in Dexie 'state'
    console.log("[Dexie] cleared all state data on logout");
  } catch (err) {
    console.error("Dexie clear failed, fallback sweep:", err);
    try {
      const all = await localDB.state.toArray();
      await Promise.all(all.map((row: any) => localDB.state.delete(row.key)));
    } catch (e2) {
      console.error("Dexie fallback sweep failed:", e2);
    }
  }
}
