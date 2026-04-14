import Cookies from "js-cookie";
import { cookies } from "next/headers";
import { CONSTANT } from "@/lib/constants/constant";

const BaseURL = `${process.env.BASE_URL}`;

export async function fetchAPI(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  data: Record<string, any> | null = null,
  tag: string[] | undefined = []
): Promise<any> {
  try {
    const cookie = cookies();
    const token = cookie.get("token")?.value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: method,
      headers: myHeaders,
      cache: "no-cache",
      next: { tags: tag },
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    const apiUrl = `${BaseURL}/${endpoint}`;
    const response = await fetch(apiUrl, requestOptions);
    console.log("error899", response);

    if (!response.ok) {
      const json = await response.json();
      console.log("error899", json);
      // console.log(json);
      if (json?.code === 402) {
        // const event = new Event(CONSTANT.EXPIREDATE);
        // Cookies.set("expire-date", "True");
        console.log("heree");
        // window.dispatchEvent(event);
        return;
      }
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error89", error);

    throw error; // Re-throw the error to propagate it to the caller
  }
}

// import { cookies } from "next/headers";

// const BaseURL = `${process.env.BASE_URL}`;

// export async function fetchAPI(
//   endpoint: string,
//   method: "GET" | "POST" = "GET",
//   data: Record<string, any> | null = null,
//   tag: string[] | undefined = []
// ): Promise<any> {
//   try {
//     const cookie = cookies();
//     const token = cookie.get("token")?.value;

//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     if (token) {
//       myHeaders.append("Authorization", `Bearer ${token}`);
//     }

//     const requestOptions: RequestInit = {
//       method: method,
//       headers: myHeaders,
//       cache: "no-cache",
//       next: { tags: tag },
//     };

//     if (data) {
//       requestOptions.body = JSON.stringify(data);
//     }

//     const apiUrl = `${BaseURL}/${endpoint}`;
//     const response = await fetch(apiUrl, requestOptions);

//     if (!response.ok) {
//       // Handle specific error codes
//       if (response.status === 401) {
//         // Unauthorized
//         return { error: "Unauthorized access. Please log in." };
//       } else if (response.status === 500) {
//         // Internal Server Error
//         return { error: "Internal server error. Please try again later." };
//       } else {
//         // Other errors
//         const errorData = await response.json();
//         return { error: errorData.message || "An unexpected error occurred." };
//       }
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     // Handle network errors or other unexpected errors
//     return { error: "Network error. Please check your connection." };
//   }
// }

export async function fetchSuperAPI(
  //   endpoint,
  //   method,
  //   data,
  //   tag,
  // :
  endpoint: string,
  method: "GET" | "POST" = "GET",
  data?: any,
  tag?: string[]
) {
  const cookie = cookies();
  const token = cookie.get("superToken")?.value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: method,
    headers: myHeaders,
    cache: "no-cache",
    next: { tags: tag },
  };

  if (data) requestOptions.body = JSON.stringify(data);
  const apiUrl = `${process.env.BASE_URL}/${endpoint}`;
  return fetch(apiUrl, requestOptions)
    .then(async (res) => {
      if (!res.ok) throw new Error(`issue ${res.status}`);
      const result = await res.json();
      return result;
    })
    .catch((err) => {
      throw err;
    });
}
