import React from 'react'
import { fetchSuperAPI } from "@/lib/middleware/server/apiMiddleware";
import dynamic from "next/dynamic";
import PackagePage from "./PackagePage";

export default async function Page() {

  const packageTableData = await 
  // fetchSuperAPI(
  //   "GetPackageList",
  //   "GET",
  //   ["package"]
  // );
  fetchSuperAPI("GetPackageList?type=package", "GET");


  return (
    <PackagePage
      packageTableData={packageTableData?.data}
    />
  );
}
