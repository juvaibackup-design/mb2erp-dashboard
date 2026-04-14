// import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/api";
import axios from "axios";
import { fetchSuperAPI } from "@/lib/middleware/server/apiMiddleware";
import dynamic from "next/dynamic";
const ActivationPage = dynamic(() => import("./ActivationPage"), {
  ssr: false,
});
function getAllCompanies() {
  // return axios
  //   .get("http://192.168.10.92:82/api/GetAllRegisteredcompany", {
  //     headers: {
  //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJqdGkiOiI3YTJiMzM1YS0yNWVjLTQ1ZDEtYTM4Yi1iNDc2NmU0ODkwNDkiLCJpYXQiOiIxLzExLzIwMjUgMTA6NDM6NDUgQU0iLCJUaWQiOiIxOGxVU2xlaThaWDFEYkxKOXFtVzRBPT0iLCJFbWFpbCI6IkFkbWluICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIiwiVXNlck5hbWUiOiJTdXBlciBBZG1pbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICIsIkVtcElEIjoiQWRtaW4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIxIiwiZXhwIjoxNzM2NTkyNTI1LCJpc3MiOiJKV1RBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6IkpXVFNlcnZpY2VQb3N0bWFuQ2xpZW50In0.vcelVdFsp4pqQ7GdBkdfRDxLXIAJz205XDJyXPpZkgk`,
  //     },
  //   })
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     console.log(err);
  //     return [];
  //   });
  // return makeSuperAPICall
  //   .get(`/GetAllRegisteredcompany`, {
  //     headers: {
  //       // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJqdGkiOiIwNDc1YmVmNi00OGZlLTQzY2QtYmM5OC05OTYxN2Q5NjA0ODkiLCJpYXQiOiIxLzExLzIwMjUgMTE6Mjk6NTkgQU0iLCJUaWQiOiIxOGxVU2xlaThaWDFEYkxKOXFtVzRBPT0iLCJFbWFpbCI6IkFkbWluICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIiwiVXNlck5hbWUiOiJTdXBlciBBZG1pbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICIsIkVtcElEIjoiQWRtaW4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIxIiwiZXhwIjoxNzM2NTk1Mjk5LCJpc3MiOiJKV1RBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6IkpXVFNlcnZpY2VQb3N0bWFuQ2xpZW50In0.wdFt-McsYpvI_djMLuviXavkOj4C7D08GEfYn4dJlqw`,
  //       Authorization: `Bearer ${Cookies.get("superToken")}`,
  //     },
  //   })
  //   .then((res) => res.data.data)
  //   .catch((err) => {
  //     console.log(err);
  //     return [];
  //   });

  return fetchSuperAPI("GetAllRegisteredcompany", "GET", null, [
    "registeredCompanies",
  ])
    .then((res: any) => res.data)
    .catch((err) => {
      console.log("err", err);
      return [];
    });
}

export default async function page() {
  const companies = await getAllCompanies();
  const result = await companies;
  // const companies = await axios.get(
  //   "http://192.168.10.92:82/api/GetAllRegisteredcompany",
  //   {
  //     headers: {
  //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJqdGkiOiJhNTUxMmJjNC0wNWExLTQ2MDQtODlhNi02MWYwNDE2MDNkMmQiLCJpYXQiOiIxLzExLzIwMjUgMTI6MTA6MTMgUE0iLCJUaWQiOiIxOGxVU2xlaThaWDFEYkxKOXFtVzRBPT0iLCJFbWFpbCI6IkFkbWluICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIiwiVXNlck5hbWUiOiJTdXBlciBBZG1pbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICIsIkVtcElEIjoiQWRtaW4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIxIiwiZXhwIjoxNzM2NTk3NzEzLCJpc3MiOiJKV1RBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6IkpXVFNlcnZpY2VQb3N0bWFuQ2xpZW50In0.uhkcGyIF0qzAUhwlIXGVnitrdeGVxizyHitYT2MGHsI`,
  //     },
  //   }
  // );
  return <ActivationPage receivedData={result} />;
}
