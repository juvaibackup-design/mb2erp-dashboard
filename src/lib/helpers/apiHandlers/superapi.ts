import { CONSTANT } from "@/lib/constants/constant";
import axios from "axios";
import Cookies from "js-cookie";

export const makeSuperAPICall = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  headers: {
    Authorization: `Bearer ${Cookies.get("superToken")}`,
  },
});

const controller = new AbortController();

makeSuperAPICall.interceptors.request.use(
  (config: any) => {
    const token = Cookies.get("superToken");
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
