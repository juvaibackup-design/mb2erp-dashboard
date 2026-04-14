// "use client";
// import dynamic from "next/dynamic";

// const AccessPrivilegePage = dynamic(
//   () => import("./AccessPrivilegePage"),
//   { ssr: false }
// );

// export default function Page() {
//   return <AccessPrivilegePage />;
// }

import React from "react";
import AccessPrivilegePage from "./AccessPrivilegePage";
import { fetchSuperAPI } from "@/lib/middleware/server/apiMiddleware";

export default async function Page() {
  const roleRes = await fetchSuperAPI("GetRoles", "GET", null, ["accessData"]);

  const userRes = await fetchSuperAPI("GetAccessUserDropdown", "GET", null, ["access-privilege-users"]);

  const roleData = Array.isArray(roleRes?.data) ? roleRes.data : [];
  const userData = Array.isArray(userRes?.data) ? userRes.data : [];

  return (
    <AccessPrivilegePage
      roleData={roleData}
      tableData={userData}
    />
  );
}
