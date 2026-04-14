// import dynamic from "next/dynamic";

// const SuperUserPage = dynamic(() => import("./SuperUserPage"), {
//   ssr: false,
// });

// export default function page() {
//   return <SuperUserPage superUserList={[]} roleList={[]} branchList={[]} />;
// }

import SuperUserPage from "./SuperUserPage";
import { fetchSuperAPI } from "@/lib/middleware/server/apiMiddleware";

export default async function Page() {
  
  const response = await fetchSuperAPI("GetSuperUserTable", "GET", null, ["superuser"]);

  const superUserList = Array.isArray(response?.data)
    ? response.data
    : [];

  return (
    <SuperUserPage
      superUserList={superUserList}
      roleList={[]}
      branchList={[]}
    />
  );
}



