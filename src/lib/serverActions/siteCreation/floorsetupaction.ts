"use server"

import { cookies } from "next/headers";


const BaseURL = `${process.env.BASE_URL}`;


export async function getFloorData (id: string | string[]) {

  const cookie = cookies();
  const token = cookie.get("token")?.value;
  console.log('token', token)
  const fetchData = await fetch(`${BaseURL}/GetFloorInfo?BranchID=${id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    next: {
      tags: ["floor"]
    }
  });

  const data = fetchData.status === 200 ? await fetchData.json() : fetchData;

  console.log('data::', data)

  return data

}