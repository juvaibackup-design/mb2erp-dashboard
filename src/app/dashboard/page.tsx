import React from "react";
import DashboardPage from "./DashboardPage";
import { fetchAPI } from "@/lib/middleware/server/apiMiddleware";

async function Dashboard() {
  const requestUserDetail = await fetchAPI(`GetUserDetails`, "GET", null, [
    "UserDetails",
  ]);
  const result = await requestUserDetail;

  return <DashboardPage initialData={result} />;
}

export default Dashboard;
