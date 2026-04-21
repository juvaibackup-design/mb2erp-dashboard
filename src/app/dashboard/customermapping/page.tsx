
import React from "react";
import { fetchAPI } from "@/lib/middleware/server/apiMiddleware";
import dynamic from "next/dynamic";

// import UserPage from "./UserPage";
const CustomerMapping = dynamic(() => import("./CustomerMapping"), {
  ssr: false,
});

export default async function page() {
 

  return <CustomerMapping  />;
}
