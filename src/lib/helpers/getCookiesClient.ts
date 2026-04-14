import Cookies from "js-cookie";

export const getToken = () => {
  const token = Cookies.get("token");

  return token;
};

export const getBranchIdByHeader = (
  field:
    | "companyId"
    | "displayName"
    | "email"
    | "userId"
    | "userName"
    | "branchList"
    | "roleName"
    | "companyDomain"
    | "salesmanId"
    | "isFinanceEnable",
) => {
  const user = Cookies.get("userDetails");
  const getParsedUser = user && JSON.parse(`${user}`);

  const getUserDetails = getParsedUser?.[`${field}`];
  // const getUserDetails = getParsedUser?.initialData?.userInfo?.[`${field}`];
  return getUserDetails;
};

// const branch = getBranchIdByHeader("branchList")
// branch[0]?.headOffice ? "" : ""

export const getCompanyDetails = (property: string) => {
  const user = Cookies.get("userDetails");
  const getParsedUser = user && JSON.parse(`${user}`);

  const getUserDetails =
    // getParsedUser?.initialData?.userInfo?.branchList?.[0]?.[property];
    getParsedUser?.branchList?.[0]?.[property];
  return getUserDetails;
};

export const getFinancialYearDetails = (property: string) => {
  const user = Cookies.get("userDetails");
  const getParsedUser = user && JSON.parse(`${user}`);

  const getFinancialDetails = getParsedUser?.financialYear?.[property];
  // const getUserDetails =
  //   getParsedUser?.initialData?.userInfo?.branchList?.[0]?.[property];
  return getFinancialDetails;
};
