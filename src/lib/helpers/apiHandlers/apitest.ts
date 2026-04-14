import { CONSTANT } from "@/lib/constants/constant";
import axios from "axios";
import Cookies from "js-cookie";

const createApiCall = (baseUrl: any) => {
  const makeApiCall = axios.create({
    baseURL: baseUrl,
  });

  const controller = new AbortController();

  makeApiCall.interceptors.request.use(
    (config) => {
      const token = Cookies.get("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        config.signal = controller.signal;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  makeApiCall.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error?.response?.data?.code === 401) {
        const event = new Event(CONSTANT.LOGOUT);
        window.dispatchEvent(event);
        controller.abort();
      }
      return Promise.reject(error);
    }
  );

  return makeApiCall;
};

export default createApiCall;
