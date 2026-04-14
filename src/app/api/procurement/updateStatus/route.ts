import { cookies } from "next/headers";

export async function POST(req: Request) {
  const request = await req.json();
  const token = cookies().get("token")?.value;
  try {
    const res = await fetch(`${process.env.BASE_URL}/poSaveApproval`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
      cache: "no-cache",
    });
    if (res.status === 200) {
      const data = await res.json();
      return Response.json(data);
    }
  } catch (error) {
    return Response.json(error);
  }
}
