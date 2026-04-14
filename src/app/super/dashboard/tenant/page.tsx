import { fetchSuperAPI } from "@/lib/middleware/server/apiMiddleware";
import dynamic from "next/dynamic";
const TenantPage = dynamic(() => import("./TenantPage"), {
  ssr: false,
});

async function getAllTenants() {
  try {
    // const res = await axios.get(
    //   `${process.env.BASE_URL}/GetAllRegisteredcompany`
    // );
    const res = await fetchSuperAPI("GetAllRegisteredcompany", "GET", null, [
      "registeredCompanies",
    ]);
    return res.data;
  } catch (err) {
    console.log("err", err);
    return [];
  }
}

function addIndexToDBs(tableData: any) {
  if (tableData.length == 0) return tableData;
  return tableData.map((row: any) => {
    let index = -1;
    return {
      ...row,
      dbConnections: row.dbConnections?.map((conn: any) => {
        let int = null;
        if (conn.attributeValue.includes(";")) {
          index = Number(index) + 1;
          int = index;
        }
        return { ...conn, seqno: int };
      }),
    };
  });
}

export default async function page() {
  const data = await getAllTenants();
  const result = addIndexToDBs(data);
  return <TenantPage receivedData={result} />;
}
