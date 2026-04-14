"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Avatar } from "antd";
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

import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import DrawerComponent from "@/components/DrawerComponent/DrawerComponent";
import ConfirmModal from "@/components/ModalComponent/ConfirmModal";
import ExtinctSwitch from "@/components/ExtinctSwitch/ExtinctSwitch";
import SuperUserForm from "./SuperUserForm";
import { CrownOutlined } from "@ant-design/icons";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import { decrypt1 } from "@/lib/helpers/utilityHelpers";
import { ENCRYPTION_KEY } from "@/lib/constants/constant";
import Toast from "@/components/CustomToast/Toast";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";
import { handleApiError } from "@/lib/helpers/handleApiError";
import { superindexList } from "@/components/SideBar/Constants";
import { useSuperUserStore } from "@/store/superuserinfo/store";

// Register Modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  SetFilterModule,
]);

export interface SuperUserRow {
  id: number;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  user_name?: string;
  role_name?: string;
  remarks?: string;
  profile_image_data?: string;
  profile_image_type?: string;
  isActive: boolean;
  [key: string]: any;
}

type Props = {
  tableData: SuperUserRow[];
  superUserTableData: SuperUserRow[];
  setSuperUserTableData: React.Dispatch<React.SetStateAction<SuperUserRow[]>>;
  roleList: any[];
  branchList: any[];
  userList: any[];
  userTableData: any[];
  access: any;
  setAccess: Function;
  host: any;
  setNotificationDisplayed: Function;
  setRefKey: Function;
  onEdit?: (record: SuperUserRow) => void;
};

export default function SuperUserTable({
  tableData,
  superUserTableData,
  setSuperUserTableData,
  roleList,
  branchList,
  userList,
  userTableData,
  access,
  setAccess,
  host,
  setNotificationDisplayed,
  // setRefKey,
  onEdit
}: Props) {
  const gridRef = useRef<any>(null);

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<SuperUserRow | null>(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [rowData, setRowData] = useState<any>();
  const [editNotificationDisplayed, setEditNotificationDisplayed] =
    useState(false);
  const [refKey, setRefKey] = useState(0);
  const [p_index, c_index, gc_index] = superindexList["Users"];
  const [tablecolumnChooserData, setTableColumnChooserData] = useState<any[]>(
    []
  );
  const [columnList, setColumnList] = useState<any>([]);

  const userDetails = useSuperUserStore(
    useCallback((state: any) => {
      try {
        return state.user ? JSON.parse(state.user) : null;
      } catch (error) {
        console.error("Error parsing user details:", error);
        return null;
      }
    }, [])
  );

  console.log("userDetails", userDetails)

  const handleEdit = (record: any) => {
    setEditDrawerOpen(true);
    tagRevalidate("superuser");
    setRowData(record);
  };


  const onClose = () => {
    if (formDirty) {
      setIsConfirmModal(true);
    } else {
      setIsConfirmModal(false);
      setEditDrawerOpen(false);
    }
  };

  const columnDefs = useMemo<ColDef<SuperUserRow>[]>(() => {
    return [
      {
        headerName: "Name",
        // field: "firstName",
        filter: "agSetColumnFilter",
        filterParams: {
          suppressMiniFilter: false,
        },
        flex: 1,

        cellRenderer: (params: ICellRendererParams<SuperUserRow>) => {
          const record = params.data;
          if (!record) return "-";

          const fullName =
            `${record.firstName ?? ""} ${record.lastName ?? ""}`.trim() || "-";

          const avatar = record.profile_image_data ? (
            <Avatar
              shape="circle"
              size={28}
              src={`data:${record.profile_image_type};base64,${record.profile_image_data}`}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Avatar
              shape="circle"
              size={28}
              style={{
                backgroundColor: "#d9d9d9",
                color: "#595959",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
          );

          return (
            <ButtonComponent
              type="link"
              onClickEvent={() => handleEdit(record)}
              style={{
                paddingLeft: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {avatar}
              <span style={{ fontWeight: 500 }}>{fullName}</span>

              {record.remarks === "Primary Admin" && (
                <CrownOutlined style={{ color: "#B59410", fontSize: 18 }} />
              )}
            </ButtonComponent>
          );
        }

      },

      {
        headerName: "User Name",
        field: "userName",
        filter: "agSetColumnFilter",
        filterParams: {
          suppressMiniFilter: false,
        },
        flex: 1,
      },

      {
        headerName: "Role",
        field: "roleName",
        filter: "agSetColumnFilter",
        filterParams: {
          suppressMiniFilter: false,
        },
        flex: 1,
      },

      {
        headerName: "Extinct",
        field: "isActive",
        cellRenderer: (params: ICellRendererParams<SuperUserRow>) => {
          const record = params.data;
          if (!record) return "-";

          const extinctValue = record.isActive === true ? false : true;

          return (
            <ExtinctSwitch
              size="small"
              checked={extinctValue}
              style={{ backgroundColor: extinctValue ? "#F5222D" : "" }}
              onChange={(extinctChecked: boolean) =>
                handleExtinct(extinctChecked, record)
              }
              disabled={!access?.isDelete}
            />
          );
        },
      },
    ];
  }, [handleEdit, setSuperUserTableData]);




  const handleExtinct = async (
    checked: boolean,
    rowData: SuperUserRow
  ) => {
    const newIsActive = !checked;

    setSuperUserTableData(prev =>
      prev.map(row =>
        row.id === rowData.id
          ? { ...row, isActive: newIsActive }
          : row
      )
    );

    const {
      id,
      roleId,
      firstName,
      middleName,
      lastName,
      primaryPhoneNumber,
      loginName,
      emailId,
      password,
      isAllowSavePassword,
      idleMinutes,
      customerList,
      add,
      view,
      edit,
      delete: canDelete
    } = rowData;

    const values = {
      id,
      roleId,
      firstName,
      middleName,
      lastName,
      primaryPhoneNumber,
      loginName,
      emailId,
      password,
      isAllowSavePassword,
      idleMinutes,
      isActive: newIsActive,
      updatedBy: 1,
      customerList,
      add,
      view,
      edit,
      delete: canDelete
    };

    try {
      await makeSuperAPICall.post("SaveSuperUser", values);
    } catch (error) {
      console.error("Extinct toggle failed", error);

      setSuperUserTableData(prev =>
        prev.map(row =>
          row.id === rowData.id
            ? { ...row, isActive: rowData.isActive }
            : row
        )
      );
    }
  };


  //Column Chooser
  useEffect(() => {
    const fetchData = async () => {
      try {
        const payloadValues = {
          roleId: userDetails.userInfo.roleId,
          pIndex: p_index,
          cIndex: c_index,
          gcIndex: gc_index,
        };

        const response = await makeSuperAPICall.post(
          "GetwebtablecolumnconfigurationSA",
          payloadValues
        );

        console.log("responseTable", response, payloadValues);

        if (response?.data?.data) {
          const fields = response.data.data[0].group.flatMap((group: any) =>
            group.fields
              .filter((field: any) => field.isRequired)
              .map((field: any) => ({
                id: field.columnId,
                title: (field.columnName),
                isVisible: field.isVisible,
                isMandatory: field.isMandatory,
                isFreezeLeft: field.isFreezeLeft,
                isFreezeRight: field.isFreezeRight,
                fixed: field.isFreezeRight
                  ? "right"
                  : field.isFreezeLeft
                    ? "left"
                    : undefined,
              }))
          );

          setTableColumnChooserData(fields);

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  //   useEffect(() => {
  //     if (!tablecolumnChooserData || tablecolumnChooserData.length === 0) {
  //       console.warn("tablecolumnChooserData is empty or undefined");
  //       return;
  //     }

  //     // console.log("tablecolumnChooserData", tablecolumnChooserData)


  //     // Merge matched records with specific properties from allInvoiceTypeColumns
  //     const matchedFields = tablecolumnChooserData.map((chooser: any) => {


  //       const matchedField = columnDefs.find((field) => {
  //         console.log("fieldchoosers", "headerName" in field, typeof field.headerName === "string")

  //         if ("headerName" in field && typeof field.headerName === "string") {
  //           // console.log("matchedFields", matchedFields)
  //           console.log("fieldchooser", field, chooser)
  //           return (
  //             field.headerName.trim().toLowerCase() ===
  //             chooser.title.trim().toLowerCase()
  //           );
  //         }
  //         return false;
  //       });

  // console.log("matchedField",matchedField)

  //       if (matchedField && "field" in matchedField) {
  //         return {
  //           ...chooser, // Retain properties from tablecolumnChooserData
  //           key: matchedField.field, // Use `dataIndex` as `key`
  //           dataIndex: matchedField.field,
  //           // align: matchedField.align,
  //           render: matchedField.cellRenderer || undefined,
  //           title: (matchedField?.headerName || chooser?.title || "")     //Added by sk for translation
  //         };
  //       }

  //       console.warn("No match found for:", chooser.title);
  //       return {
  //         ...chooser,
  //         title: (chooser.title),
  //       } // Keep original chooser if no match is found
  //     });

  //     console.log("Matched Fields with Additional Properties", matchedFields);

  //     setColumnList([
  //       ...matchedFields,
  //     ]);
  //   }, [tablecolumnChooserData]);


  useEffect(() => {
    if (!tablecolumnChooserData?.length) return;

    const finalColumns: ColDef[] = tablecolumnChooserData.map((chooser: any) => {
      const matchedField = columnDefs.find(
        col =>
          typeof col.headerName === "string" &&
          col.headerName.trim().toLowerCase() ===
          chooser.title.trim().toLowerCase()
      );

      // ✅ If column exists in UI config
      if (matchedField) {
        return {
          ...matchedField,
          hide: !chooser.isVisible,
          pinned: chooser.fixed,
        };
      }

      // ✅ API-only column → create dynamically
      return {
        headerName: chooser.title,
        field: chooser.title
          .replace(/\s+/g, "")
          .replace(/^[A-Z]/, (c: string) => c.toLowerCase()),
        hide: !chooser.isVisible,
        filter: "agSetColumnFilter",
        flex: 1,
      };
    });

    setColumnList(finalColumns);
  }, [tablecolumnChooserData]);

  return (
    <>
      <ConfirmModal
        openModal={isConfirmModal}
        onClose={() => {
          setIsConfirmModal(false);
          setEditDrawerOpen(false);
        }}
        onCancel={() => setIsConfirmModal(false)}
      />

      <div
        className="ag-theme-quartz procurement-aggrid"
        style={{ width: "100%", height: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={tableData}
          columnDefs={columnList}
          pagination={false}
          rowSelection="multiple"
        />
      </div>

      <DrawerComponent
        key={refKey}
        open={editDrawerOpen}
        onClose={onClose}
        closeIcon={false}
        footer={[]}
        className="ow-taxmaster-drawer"
        rootClass="ow-content-wrapper"
        header1="Edit Super Users"
        header2="Edit Super Users and save"
      >
        {rowData && (
          <SuperUserForm
            initData={{
              ...rowData,
              id: rowData?.id ?? 0,

              roleId: rowData?.roleId ?? null,

              firstName: rowData?.firstName ?? "",
              middleName: rowData?.middleName ?? "",
              lastName: rowData?.lastName ?? "",
              customerList: Array.isArray(rowData?.customerList)
                ? rowData.customerList
                : [],



              // primaryPhoneNumber: rowData?.primaryPhoneNumber ?? "",

              password: decrypt1(rowData?.password, ENCRYPTION_KEY),

              emailId: rowData?.emailId ?? "",

              loginName:
                host && host[0] && rowData?.loginName
                  ? rowData.loginName.split("@")[0]
                  : rowData?.loginName ?? "",

              isAllowSavePassword: rowData?.isAllowSavePassword ?? false,

              // idleMinutes: rowData?.idleMinutes ?? 0,

              isActive: rowData?.isActive ?? true,

              createdBy: rowData?.createdBy ?? 1,
              updatedBy: 1,
              imageData: {
                imageFileName: rowData?.profileImageName || "",
                imageFileType: rowData?.profileImageType || "",
                imageFileData: rowData?.profileImageData || "",
              },
            }}
            record={rowData}
            type="edit"
            userList={userList}
            roleList={roleList}
            branchList={branchList}
            userTableData={superUserTableData}
            setFormDirty={setFormDirty}
            setOpenDrawer={setEditDrawerOpen}
            open={editDrawerOpen}
            setNotificationDisplayed={setEditNotificationDisplayed}
            setSuperUserTableData={setSuperUserTableData}
            formDirty={formDirty}
            access={access}
            setAccess={setAccess}
            host={host}
            setRefKey={setRefKey}
            setIsConfirmModal={setIsConfirmModal}
            rowData={rowData}
          />
        )}
      </DrawerComponent>

      {editNotificationDisplayed && (
        <Toast message="Saved User successfully" delay={1500} />
      )}
    </>
  );
}
