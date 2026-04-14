"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ICellRendererParams,
  ColDef,
} from "ag-grid-community";
import { SetFilterModule } from "ag-grid-enterprise";
import ExtinctSwitch from "@/components/ExtinctSwitch/ExtinctSwitch";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Tag } from "antd";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  SetFilterModule,
]);

export interface PackageRow {
  id: number;
  packageName: string;
  aliasName: string;
  noOfScreens: number;
  // formList: string[];
  totalTenants: number;
  isActive: boolean;
}

export default function PackageTable({ packageTableData }: any) {
  const gridRef = useRef<any>(null);
  const router = useRouter();

  // const rowData = packageTableData;
  const [packageData, setPackageData] = useState<PackageRow[]>([]);

  useEffect(() => {
    setPackageData(packageTableData);
  }, [packageTableData]);

  const columnDefs = useMemo<ColDef<PackageRow>[]>(() => [
    {
      headerName: "Package Name",
      field: "packageName",
      flex: 1,
      cellRenderer: (params: ICellRendererParams<PackageRow>) => (
        <span
          style={{
            color: "#1677ff",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onClick={() =>
            router.push(`/super/dashboard/package/${params.data?.id}`)
          }
        >
          {params.value}
        </span>
      ),
    },
    {
      headerName: "Alias Name",
      field: "aliasName",
      flex: 1,
    },
    {
      headerName: "No of Screens",
      field: "noOfScreens",
      flex: 1,
    },
    {
      headerName: "Total Tenants",
      field: "totalTenants",
      flex: 1,
      cellRenderer: (params: ICellRendererParams<PackageRow>) => {
        const record = params.data;
        if (!record) return "-";

        const count = record.totalTenants;

        return (
          <Avatar.Group
            maxCount={3}
            maxStyle={{
              color: "#F56A00",
              backgroundColor: "#FDE3CF",
              cursor: "pointer",
            }}
          >
            {Array.from({ length: Math.min(count, 2) }).map((_, index) => (
              <Avatar
                key={index}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#87D068" }}
              />
            ))}

            {count > 2 && (
              <Avatar
                style={{
                  backgroundColor: "#bebbbbff",
                  border: "2px solid #f4f7f2ff",
                }}
              >
                +{count - 2}
              </Avatar>
            )}
          </Avatar.Group>
        );
      },
    },
    // {
    //   headerName: "Extinct",
    //   field: "isActive",
    //   flex: 1,
    //   cellRenderer: (params: ICellRendererParams<PackageRow>) => {
    //     const record = params.data;
    //     if (!record) return "-";

    //     const extinctValue = record.isActive ? false : true;

    //     return (
    //       <ExtinctSwitch
    //         size="small"
    //         checked={extinctValue}
    //         onChange={(checked: boolean) => {
    //           record.isActive = !checked;
    //           gridRef.current?.api.refreshCells();
    //         }}
    //       />
    //     );
    //   },
    // },
    {
      headerName: "Extinct",
      field: "isActive",
      flex: 1,
      cellRenderer: (params: ICellRendererParams<PackageRow>) => {
        const record = params.data;
        if (!record) return "-";

        const extinctValue = record.isActive === true ? false : true;

        return (
          <ExtinctSwitch
            size="small"
            checked={extinctValue}
            style={{ backgroundColor: extinctValue ? "#F5222D" : "" }}
            onChange={(checked: boolean) =>
              handleExtinct(checked, record)
            }
          />
        );
      },
    }
  ], [router]);


  //   const handleExtinct = async (
  //   checked: boolean,
  //   rowData: PackageRow
  // ) => {
  //   const newIsActive = !checked;

  //   // optimistic update
  //   setPackageData(prev =>
  //     prev.map(row =>
  //       row.id === rowData.id
  //         ? { ...row, isActive: newIsActive }
  //         : row
  //     )
  //   );

  //   const values = {
  //     id: rowData.id,
  //     packageName: rowData.packageName,
  //     aliasName: rowData.aliasName,
  //     noOfScreens: rowData.noOfScreens,
  //     isActive: newIsActive,
  //     updatedBy: 1,
  //   };

  //   try {
  //     await makeSuperAPICall.post("PostSavePackage", values);
  //   } catch (error) {
  //     console.error("Extinct toggle failed", error);

  //     // rollback
  //     setPackageData(prev =>
  //       prev.map(row =>
  //         row.id === rowData.id
  //           ? { ...row, isActive: rowData.isActive }
  //           : row
  //       )
  //     );
  //   }
  // };

  const handleExtinct = async (
    checked: boolean,
    rowData: PackageRow
  ) => {
    const newIsActive = !checked;

    try {
      // 1️⃣ Fetch full package (important!)
      const response = await makeSuperAPICall.get(
        `GetPackageById/${rowData.id}`
      );

      const fullPackage = response.data.data;

      // 2️⃣ Modify only isActive
      const payload = {
        ...fullPackage,
        isActive: newIsActive,
        updatedBy: 1,
      };

      // 3️⃣ Call save API with COMPLETE object
      await makeSuperAPICall.post("PostSavePackage", payload);

      // 4️⃣ Update UI after success
      setPackageData(prev =>
        prev.map(row =>
          row.id === rowData.id
            ? { ...row, isActive: newIsActive }
            : row
        )
      );

    } catch (error) {
      console.error("Extinct toggle failed", error);
    }
  };

  return (
    <div
      className="ag-theme-quartz procurement-aggrid"
      style={{ width: "100%", height: "500px" }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={packageData}
        columnDefs={columnDefs}
        pagination={false}
        rowSelection="multiple"
      />
    </div>
  );
}
