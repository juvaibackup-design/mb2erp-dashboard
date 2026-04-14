"use server";

import {
  getBranchIdByHeader,
  getCompanyDetails,
} from "@/lib/helpers/getCookiesServer";
import { cookies } from "next/headers";

const BaseURL = `${process.env.BASE_URL}`;

const cookie = cookies();
const token = cookie.get("token")?.value;
const companyId = getBranchIdByHeader("companyId");
const branchId = getCompanyDetails("id");
console.log("token::", token);

export async function dropdownData() {
  try {
    const response = await fetch(
      `${BaseURL}/getIncentiveDropdowns?branch_id=${branchId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

export async function salesmanFormSubmitCreate(formData: any) {
  try {
    const response = await fetch(`${BaseURL}/createIncentive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: Boolean(formData) ? JSON.stringify(formData) : "",
    });
    if (!response.ok) {
      const error = await response.json();
      console.log("error::", error);
      throw error;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log("catch errorss::", error);
    return error;
  }
}

export async function salesmanFormSubmitEdit(formData: any) {
  try {
    const response = await fetch(
      `${BaseURL}/updateIncentive/${formData?.inc_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: Boolean(formData) ? JSON.stringify(formData) : "",
      }
    );
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

export async function approveIncentive(formData: any) {
  try {
    const response = await fetch(`${BaseURL}/updateStatus`, {
      method: "PUT",
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

export async function deleteIncentive(formData: any) {
  try {
    const response = await fetch(`${BaseURL}/deleteIncentive`, {
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

export async function assortmentDropdownData() {
  try {
    const response = await fetch(
      `${BaseURL}/getAssortmentDropdowns?branch_id=${branchId}&company_id=${companyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
