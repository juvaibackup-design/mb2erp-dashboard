// import dynamic from "next/dynamic";

// const SuperDashboardPage = dynamic(() => import("./SuperDashboardPage"), {
//   ssr: false,
// });

// export default function page() {
//   return <SuperDashboardPage />;
// }


import React from "react";
import SuperDashboardPage from "./SuperDashboardPage";
import { fetchAPI, fetchSuperAPI } from "@/lib/middleware/server/apiMiddleware";

async function SuperUserPage() {
  const requestSuperUserDetail = await fetchSuperAPI(
    `GetSuperUserDetails`,
    "GET",
    null,
    ["SuperUserDetails"]
  );

  const result = await requestSuperUserDetail;

  return <SuperDashboardPage initialData={result} />;
}

export default SuperUserPage;
