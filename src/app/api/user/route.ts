import { cookies } from "next/headers";

export async function GET(req: Request) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${process.env.BASE_URL}/GetUserDetails`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-cache",
  });

  const data = await res.json();

  return Response.json(data);
}
