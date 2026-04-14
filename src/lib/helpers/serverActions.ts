"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateCG() {
  revalidatePath("/dashboard/inventory-creategroup");
}

export const tagRevalidate = async (tag: string) => {
  revalidateTag(tag);
};


export async function revalidateTerms() {
  revalidatePath("/dashboard/procurement-terms/[id]");
}

