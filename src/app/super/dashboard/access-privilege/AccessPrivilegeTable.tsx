"use client";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Modal, Table } from "antd";
import TableComponent from "@/components/TableComponent/TableComponent";
import { ColumnsType } from "antd/es/table/interface";
import { getBranchIdByHeader } from "@/lib/helpers/getCookiesClient";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import { CrownOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import ExtinctSwitch from "@/components/ExtinctSwitch/ExtinctSwitch";
import CreateRole from "./CreateRole";
import Toast from "@/components/CustomToast/Toast";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import { handleApiError } from "@/lib/helpers/handleApiError";
import { AgGridReact } from "ag-grid-react";
import { SetFilterModule } from 'ag-grid-enterprise';
import { ModuleRegistry, ClientSideRowModelModule, TextFilterModule, ValidationModule, DateFilterModule, NumberFilterModule, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,
  AllCommunityModule,
  SetFilterModule
]);

export default function AccessPrivilegeTable({
  userData,
  tableData,
  initialRoleData,
  setInitialRoleData,
  accessRef,
  access,
  roleList,
  setAccess,
}: any) {
  const rawRole = getBranchIdByHeader("roleName");
  const router = useRouter();
  const [dataSource, setDataSource] = useState(tableData);
  const [userDataSource, setUserDataSource] = useState(userData);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rowData, setRowData] = useState({});
  const [roleEdited, setRoleEdited] = useState(false);
  const role = (getBranchIdByHeader("roleName") || '').toLowerCase();
  const gridRef = useRef<any>(null);
  console.log('role', role)

  useEffect(() => {
    setDataSource(tableData);
  }, [tableData]);

  useEffect(() => {
    setUserDataSource(userData);
  }, [userData]);

  const handleEdit = (record: any) => {
    console.log("record", record);
    setRowData(record);
    setOpenDrawer(true);
  };

  const columnDefs = [
    {
      headerName: "Role Name",
      field: "roleName",
      flex: 1,
      cellRenderer: (params: any) => {
        const record = params.data;
        const roleNameVal = record.roleName ?? record.role_name ?? "";
        const isAdmin = roleNameVal === "ADMIN";
        const disableAdminRow = isAdmin && role !== "admin";

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ButtonComponent
              type="link"
              onClickEvent={() => !disableAdminRow && handleEdit(record)}
              style={{
                paddingLeft: 0,
                cursor: disableAdminRow ? "not-allowed" : "pointer",
              }}
            >
              {roleNameVal}
            </ButtonComponent>

            {isAdmin && (
              <CrownOutlined
                style={{
                  color: "#B59410",
                  marginLeft: -10,
                  fontSize: 18,
                }}
              />
            )}
          </div>
        );
      },
    },

    {
      headerName: "Super User",
      field: "users",
      // width: 200,
      flex: 1,
      cellRenderer: (params: any) => {
        const record = params.data;
        const roleNameVal = record.roleName ?? record.role_name ?? "";
        const disableAdminRow = roleNameVal === "ADMIN" && role !== "admin";

        return (
          <Avatar.Group
            maxCount={6}
            maxStyle={{
              backgroundColor: disableAdminRow ? "#E0E0E0" : "#FDE3CF",
              cursor: disableAdminRow ? "not-allowed" : "pointer",
            }}
          >
            {(record.users ?? []).map((_: any, i: number) => (
              <Avatar
                key={i}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: disableAdminRow ? "#D3D3D3" : "#87D068",
                }}
              />
            ))}
          </Avatar.Group>
        );
      },
    },

    {
      headerName: "Access",
      // width: 120,
      flex: 1,
      cellRenderer: (params: any) => {
        const record = params.data;
        const roleNameVal = record.roleName ?? record.role_name ?? "";
        const disableAdminRow = roleNameVal === "ADMIN" && role !== "admin";

        return (
          <SettingOutlined
            style={{
              cursor: disableAdminRow ? "not-allowed" : "pointer",
              color: disableAdminRow ? "gray" : "inherit",
            }}
            onClick={() => {
              if (!disableAdminRow) {
                router.push(
                  `/super/dashboard/access-privilege/${record.id}?roleName=${encodeURIComponent(
                    record.roleName
                  )}`
                );
              }
            }}
          />
        );
      },
    },

    {
      headerName: "Extinct",
      field: "isActive",
      // width: 120,
      cellRenderer: (params: any) => {
        const record = params.data;
        const roleNameVal = record.roleName ?? record.role_name ?? "";
        const isAdminRow = roleNameVal?.toLowerCase() === "admin";
        // const disabled = isAdminRow || !access?.is_delete;

        const value =
          typeof record.isActive !== "undefined"
            ? !record.isActive
            : false;

        return (
          <ExtinctSwitch
            checked={value}
            size="small"
            // disabled={disabled}
            disabled={!access?.isDelete}
            onChange={(checked) =>
              handleExtinct(checked, record, params.rowIndex)
            }
          />
        );
      },
    },
  ];



  async function handleExtinct(checked: boolean, rowData: any, index: number) {
    if (checked && (rowData.users ?? []).length > 0) {
      Modal.warning({
        title: "Action Not Allowed",
        content: "This role has users assigned. Re-assign or remove them to proceed.",
      });
      return;
    }

    const isChecked = checked ? false : true;
    const updatedLocal = dataSource?.map((item: any) =>
      (item.id ?? item.ent_id) === (rowData.id ?? rowData.ent_id) ? { ...item, isActive: isChecked } : item
    );
    setDataSource(updatedLocal);
    setInitialRoleData((prev: any[]) =>
      prev?.map((item: any) =>
        (item.id ?? item.ent_id) === (rowData.id ?? rowData.ent_id) ? { ...item, isActive: isChecked } : item
      )
    );

    try {
      const body = {
        action: "U",
        id: rowData?.ent_id ?? rowData?.id,
        roleName: rowData?.roleName ?? rowData?.role_name,
        isActive: isChecked,
      };
      await makeSuperAPICall.post("RoleIUD", body);
    } catch (error) {
      tagRevalidate("accessData");
      handleApiError(error);
    }
  }


  return (
    <>
      {/* <TableComponent
        columns={columns}
        dataSource={dataSource}
        className=" ow-custom-table-dropdown padding"
        pagination={false}
        size="small"
      /> */}
      <div
        className="ag-theme-quartz procurement-aggrid"
        style={{ height: "100%", width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={dataSource}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          rowSelection="multiple"
        />
      </div>

      <CreateRole
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        rowData={rowData}
        userList={userDataSource}
        roleList={roleList}
        title={("Edit Role")}
        buttonLabel={("Save")}
        showNotification={setRoleEdited}
        access={access}
        setAccess={setAccess}
        type={"edit"}
      />
      {roleEdited && (
        <Toast message={("Role updated successfully")} delay={1500} />
      )}
    </>
  );
}
