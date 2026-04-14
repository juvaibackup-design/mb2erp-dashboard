import { ENCRYPTION_KEY } from "@/lib/constants/constant";
import { encrypt1 } from "../utilityHelpers";
import makeApiCall from "./api";

export type LoginCredentials = {
  username?: string;
  password?: string;
  email?: string;
  ip_address?: string;
  current_date: any;
  session_login?: boolean;
};

export const login = async (values: LoginCredentials) => {
  const payload = {
    emailId: values.username,
    password: encrypt1(values.password as string, ENCRYPTION_KEY),
    ip_address: values.ip_address,
    current_date: values.current_date,
    session_login: values.session_login,
    // password: values.password,
  };
  const response = await makeApiCall.post("Userlogin", payload);

  return response;
};

export const logout = async (token: string) => {
  const response = await makeApiCall.post(`UserLogout?token=${token}`);

  return response;
};
