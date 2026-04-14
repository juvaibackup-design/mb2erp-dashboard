import { CONSTANT } from "@/lib/constants/constant";
import axios from "axios";
import Cookies from "js-cookie";

const makeApiCall = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
});

const controller = new AbortController();

makeApiCall.interceptors.request.use(
  (config: any) => {
    const token = Cookies.get("token");
    if (token) {
      console.log("token:::", token);
      config.headers["Authorization"] = `Bearer ${token}`;
      config.signal = controller.signal;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// makeApiCall.interceptors.response.use(
//   (response) => {
//     console.log("token", response);
//     return response;
//   },
//   async (error) => {
//     if (error?.response?.data?.code === 401) {
//       // window
//       const event = new Event(CONSTANT.LOGOUT);
//       window.dispatchEvent(event);
//       controller.abort();
//       // location.assign("/");
//     } else if (error?.response?.data?.code === 402) {
//       const event = new Event(CONSTANT.EXPIREDATE);
//       Cookies.set("expire-date", "True");
//       console.log("heree");
//       window.dispatchEvent(event);
//     }
//     return Promise.reject(error);
//   }
// );

makeApiCall.interceptors.response.use(
  (response) => {
    console.log("token", response);
    return response;
  },
  async (error) => {
    const code = error?.response?.data?.code;
    const errordescription = error?.response?.data?.errordescription;

    if (code === 402) {
      const event = new Event(CONSTANT.EXPIREDATE);
      Cookies.set("expire-date", "True");
      console.log("heree");
      window.dispatchEvent(event);
    } else if (
      (code === 401 && errordescription === "Token is invalid") ||
      errordescription === "Token is invalid"
    ) {
      controller.abort();

      Cookies.remove("token");
      Cookies.remove("superToken");

      if (typeof window !== "undefined") {
        window.location.href = "/sessionexpired";
      }
    }
    // else if (code === 402) {
    //   const event = new Event(CONSTANT.EXPIREDATE);
    //   Cookies.set("expire-date", "True");
    //   console.log("heree");
    //   window.dispatchEvent(event);
    // }

    return Promise.reject(error);
  }
);

export default makeApiCall;


