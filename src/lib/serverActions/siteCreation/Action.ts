"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { InitialValues } from "@/lib/interfaces/admin-interface/siteCreationInterfaces";
import { StockPointInitialValues } from "@/lib/interfaces/admin-interface/stockPointInterface";
import { Floor } from "@/lib/interfaces/admin-interface/floorSetupInterface";

const BaseURL = `${process.env.BASE_URL}`;

const cookie = cookies();
const token = cookie.get("token")?.value;
console.log("token::", token);

export async function getData() {
  revalidateTag("siteDetails");
}

export async function stockpointFormSubmit(formData: StockPointInitialValues) {
  console.log("formData", formData);
  console.log("body", Boolean(formData) ? JSON.stringify(formData) : "");
  try {
    const response = await fetch(`${BaseURL}/PostStockPoint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: Boolean(formData) ? JSON.stringify(formData) : "",
    });
    if (!response.ok) {
      console.log("error res", response);
      const error = await response.json();
      console.log("error.ok", error);
      throw error;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("errorsss::", error);
    return error;
  }
}

export async function floorSetupFormSubmit(formData: Floor) {
  try {
    const response = await fetch(`${BaseURL}/PostFloorInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: Boolean(formData) ? JSON.stringify(formData) : "",
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}

export async function mopFormSubmit(formData: InitialValues) {
  try {
    const response = await fetch(`${BaseURL}/GetSaveMOPSummaryInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: Boolean(formData) ? JSON.stringify(formData) : "",
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
