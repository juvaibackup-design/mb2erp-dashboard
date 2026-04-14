import { cookies } from "next/headers";

export const getToken = () => {
  const cookie = cookies();
  const token = cookie.get("token")?.value;

  return token;
};

export const getBranchIdByHeader = (
  id:
    | "companyId"
    | "displayName"
    | "email"
    | "userId"
    | "userName"
    | "roleName"
    | "roleId"
) => {
  const cookie = cookies();
  const user = cookie.get("userDetails")?.value;
  const getParsedUser = user && JSON.parse(`${user}`);

  // const getUserDetails = getParsedUser?.initialData?.userInfo?.[`${id}`];
  // const getUserDetails = getParsedUser?.[`${id}`];
  const getUserDetails = getParsedUser?.[id];
  return getUserDetails;
};

export const getCompanyDetails = (property: string) => {
  const cookie = cookies();
  const user = cookie.get("userDetails")?.value;
  const getParsedUser = user && JSON.parse(`${user}`);

  const getUserDetails = getParsedUser?.branchList?.[0]?.[property];
  // const getUserDetails =
  //   getParsedUser?.initialData?.userInfo?.branchList?.[0]?.[property];
  return getUserDetails;
};

export const getFinancialYearDetails = (property: string) => {
  const cookie = cookies();
  const user = cookie.get("userDetails")?.value;
  const getParsedUser = user && JSON.parse(`${user}`);

  const getFinancialDetails = getParsedUser?.financialYear?.[property];
  return getFinancialDetails;
};
