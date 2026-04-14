"use client";

import React, { useEffect, useState, useMemo, useContext } from "react";
import { Table, Checkbox, Tabs, Tooltip, Flex } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SettingOutlined, InfoCircleOutlined } from "@ant-design/icons";
import TableComponent from "@/components/TableComponent/TableComponent";
import DrawerComponent from "@/components/DrawerComponent/DrawerComponent";
import AccDrawerDrag from "@/components/Drag/AccDrawerDrag";
import AccDragTable from "@/components/AccDragTable/AccDragTable";
import styles from "./TabContent.module.css";
import Toast from "@/components/CustomToast/Toast";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";
// import makeSuperAPICall from "@/lib/helpers/apiHandlers/api";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";
import Cookies from "js-cookie";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useFormik } from "formik";


export type PermissionRow = {
  id: number;
  name: string;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  allowAll: boolean;
  createdBy: string;
};

interface AccountMasterProps {
  moduleName: string;
  data: PermissionRow[];
  roleId: any;
  onChange: (payload: { module_name: string; forms: PermissionRow[] }) => void;
}

export default function AccountMaster({
  moduleName,
  data,
  onChange,
  roleId
}: AccountMasterProps) {
  const [rows, setRows] = useState<PermissionRow[]>([]);
  const [selectedForm, setSelectedForm] = useState<PermissionRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [isShowAll, setIsShowAll] = useState(false);
  const [isTableShowAll, setIsTableShowAll] = useState(false);
  const [notificationDisplayed, setNotificationDisplayed] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [listData, setListData] = useState<any[]>([]);
  const [tableListData, setTableListData] = useState<any[]>([]);
  const [drag, setDrag] = useState<boolean>(false);


  interface SelectedRecord {
    p_index?: number; 
    c_index?: number; 
    gc_index?: number; 
    [key: string]: any;
  }

  const [selectedRecord, setSelectedRecord] = useState<SelectedRecord | null>(
    null
  );

  const handleFieldsClick = (record: PermissionRow) => {
    setSelectedForm(record);
    setDrawerOpen(true);
  };

  useEffect(() => {
    console.log("FORM DRAWER DATA", listData);
  }, [listData]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  useEffect(() => {
    setListData(listData);
  }, [listData, drawerOpen]);

  useEffect(() => {
    setTableListData(tableListData);
  }, [tableListData, drawerOpen]);


  const Loader = useContext(LoaderContext);

  const handleDrawerOpen = async (record: any) => {
    setDrawerOpen(true); // Open the drawer
    console.log("record", record);
    Loader?.setLoader(true);

    const { p_index, c_index, gc_index } = record;

    const payloadValues = {
      pIndex: p_index,
      cIndex: c_index,
      gcIndex: gc_index,
      roleId: roleId,
    };
    // const payloadValues = {
    //   pIndex: 4,
    //   cIndex: 1,
    //   gcIndex: 0,
    //   roleId: 8,
    // };

    try {
      // Make both API calls in parallel
      const [fieldResponse, tableResponse] = await Promise.all([
        makeSuperAPICall.post("GetwebfieldconfigurationSA", payloadValues),
        makeSuperAPICall.post("GetwebtablecolumnconfigurationSA", payloadValues),
      ]);

      console.log("fieldResponse", fieldResponse?.data);
      console.log("tableResponse", tableResponse?.data);

      let extractedFormTitle =
        fieldResponse?.data?.data?.[0]?.form?.trim() ||
        tableResponse?.data?.data?.[0]?.form?.trim();

      setFormTitle(extractedFormTitle);
      Loader?.setLoader(false);

      // Handle fieldResponse for Getwebfieldconfiguration
      if (fieldResponse?.data?.data?.length > 0) {
        const fields: any[] = fieldResponse.data.data[0].group.flatMap(
          (group: any) => {
            return group.fields
              .filter((field: any) => field.isVisible) // Filter only visible fields
              .map((field: any) => ({
                ...field,
                id: field.columnId,
                title: field.field,
                form: fieldResponse.data.data[0].form,
                groupName: group.groupName,
                pIndex: fieldResponse.data.data[0].pIndex,
                cIndex: fieldResponse.data.data[0].cIndex,
                gcIndex: fieldResponse.data.data[0].gcIndex,
              }));
          }
        );

        console.log("Extracted fields:", fields);
        setListData(fields); // Set list data
      } else {
        console.warn("fieldResponse is empty or invalid.");
        setListData([]);
      }

      // Handle tableResponse for Getwebtablecolumnconfiguration
      if (
        // Array.isArray(tableResponse?.data?.data) &&
        tableResponse.data.data.length > 0
      ) {
        const tableFields: any[] = tableResponse.data.data[0].group.flatMap(
          (group: any) => {
            return group.fields
              .filter((field: any) => field.isVisible) // Filter only visible fields
              .map((field: any) => ({
                ...field,
                id: field.columnId,
                // title: field.columnName,
                title: field.categoryName,
                form: tableResponse.data.data[0].form,
                groupName: group.groupName,
                pIndex: tableResponse.data.data[0].pIndex,
                cIndex: tableResponse.data.data[0].cIndex,
                gcIndex: tableResponse.data.data[0].gcIndex,
              }));
          }
        );

        console.log("Extracted tableFields:", tableFields);
        setTableListData(tableFields.length > 0 ? tableFields : []);
      } else {
        console.warn(
          "Invalid or empty tableResponse data. Clearing tableListData."
        );
        setTableListData([]);
      }
    } catch (error) {
      console.error("Error during API calls:", error);
    }
  };




  useEffect(() => {
    setRows(data);
  }, [data]);

  const togglePermission = (
    rowId: number,
    field: string,
    checked: boolean
  ) => {
    const updatedRows = rows.map((row) => {
      if (row.id !== rowId) return row;

      if (field === "allowAll") {
        return {
          ...row,
          allowAll: checked,
          view: checked,
          add: checked,
          edit: checked,
          delete: checked,
        };
      }

      if (
        field === "view" &&
        checked === false &&
        (row.add || row.edit || row.delete)
      ) {
        return row;
      }

      const updatedRow = {
        ...row,
        [field]: checked,
      };

      if (
        (field === "add" || field === "edit" || field === "delete") &&
        checked
      ) {
        updatedRow.view = true;
      }

      updatedRow.allowAll =
        updatedRow.view &&
        updatedRow.add &&
        updatedRow.edit &&
        updatedRow.delete;

      return updatedRow;
    });

    setRows(updatedRows);

    onChange({
      module_name: moduleName,
      forms: updatedRows,
    });
  };

  const columns: ColumnsType<PermissionRow> = [
    {
      title: "Form Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Allow All",
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={record.allowAll}
          onChange={(e) =>
            togglePermission(record.id, "allowAll", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Add",
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={record.add}
          onChange={(e) =>
            togglePermission(record.id, "add", e.target.checked)
          }
        />
      ),
    },
        {
      title: "View",
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={record.view}
          onChange={(e) =>
            togglePermission(record.id, "view", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Edit",
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={record.edit}
          onChange={(e) =>
            togglePermission(record.id, "edit", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Delete",
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={record.delete}
          onChange={(e) =>
            togglePermission(record.id, "delete", e.target.checked)
          }
        />
      ),
    },
    {
      title: "Fields",
      dataIndex: "fields",
      align: "center",
      render: (_, record) => (
        <SettingOutlined
          onClick={() => {
            handleDrawerOpen(record);
          }}
        />
      ),
    },
  ];

  const initialValues: any = listData?.map((form: any) => ({
    pIndex: form.pIndex,
    cIndex: form.cIndex,
    gcIndex: form.gcIndex,
    module: form.module,
    form: form.form,
    groupName: form.groupName,
    field: form.field,
    caption: form.caption,
    type: form.type,
    description: form.description,
    isRequired: form.isRequired,
    isMandatory: form.isMandatory,
    isVisible: form.isVisible,
    orderNo: form.orderNo,
    // companyId: getBranchIdByHeader("companyId"),
    // branchId: getBranchIdByHeader("companyId"), // Ensure this is correct
    // userId: getBranchIdByHeader("userId"),
    roleId: roleId,
    columnId: form.columnId,
    isActive: form.isActive,
  }));

  const initialValuesTableList: any = tableListData?.map((form: any) => ({
    pIndex: form.pIndex,
    cIndex: form.cIndex,
    gcIndex: form.gcIndex,
    module: form.module,
    form: form.form,
    groupName: form.groupName,
    columnName: form.columnName,
    caption: form.caption,
    type: form.type,
    description: form.description,
    isRequired: form.isRequired,
    isMandatory: form.isMandatory,
    isVisible: form.isVisible,
    isFreezeLeft: form.isFreezeLeft,
    isFreezeRight: form.isFreezeRight,
    isEditable: form.isEditable,
    isDefaultEditable: form.isDefaultEditable,
    orderNo: form.orderNo,
    // companyId: getBranchIdByHeader("companyId"),
    // branchId: getBranchIdByHeader("companyId"), // Ensure this is correct
    // userId: getBranchIdByHeader("userId"),
    roleId: roleId,
    columnId: form.columnId,
    isActive: form.isActive,
  }));

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const [fieldResponse, tableResponse] = await Promise.all([
          makeSuperAPICall.post("PostWebFieldConfigurationSA", values), // First API call
          makeSuperAPICall.post(
            "PostWebTableColumnConfigurationSA",
            initialValuesTableList
          ), // Second API call
        ]);

        if (fieldResponse.status === 200 && tableResponse.status === 200) {
          // Both API calls succeeded
          setNotificationDisplayed(true);
          setDrawerOpen(false);
          setTimeout(() => setNotificationDisplayed(false), 3000);
        } else {
          console.error("One of the API calls failed");
        }
      } catch (error) {
        console.error("Error during submission:", error);
      }
    },
  });

  const handleShowAllChange = (event: CheckboxChangeEvent) => {
    const isChecked = event.target.checked;
    console.log("isChecked", isChecked, activeTab);

    if (activeTab === "1") {
      // Updating Form Tab only
      const updatedListData = listData.map((item: any) => {
        if (item.isDefault) return item;
        return { ...item, isRequired: isChecked };
      });

      setListData(updatedListData);
      // setIsTableShowAll(false); // Prevent affecting Table Tab
      setIsShowAll(false);
      setIsShowAll(isChecked);
      // setIsTableShowAll(isChecked);
    } else if (activeTab === "2") {
      // Updating Table Tab only
      const updatedTableListData = tableListData.map((item: any) => {
        if (item.isDefault) return item;
        return { ...item, isRequired: isChecked };
      });

      setTableListData(updatedTableListData);
      setIsTableShowAll(false); // Prevent affecting Form Tab
      setIsTableShowAll(isChecked);
      // setIsShowAll(isChecked);
    }
  };

  const updateCheckboxValue = (
    id: any,
    field: any,
    value: any,
    type: "listData" | "tableListData"
  ) => {
    console.log("updateCheckboxValue", id, field, value, type);
    if (type === "listData") {
      // Update listData
      const updatedListData = listData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );
      console.log("Updated listData", updatedListData);
      const item = updatedListData.find((item: any) => !item.isRequired);
      setIsShowAll(!item);
      setListData(updatedListData);
    } else if (type === "tableListData") {
      // Update tableListData
      const updatedTableListData = tableListData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );
      console.log("Updated tableListData", updatedTableListData);
      const item = updatedTableListData.find((item: any) => !item.isRequired);
      setIsTableShowAll(!item);
      setTableListData(updatedTableListData);
    }
  };

  const updateOrder = (
    updatedList: any,
    type: "listData" | "tableListData"
  ) => {
    const reorderedList = updatedList.map((item: any, index: any) => ({
      ...item,
      orderNo: index + 1,
    }));

    if (type === "listData") {
      setListData(reorderedList);
    } else if (type === "tableListData") {
      setTableListData(reorderedList);
    }
  };

  const handleTableCheckboxChange = (
    id: number,
    field: "isFreezeLeft" | "isFreezeRight",
    value: boolean
  ) => {
    console.log("handleTableCheckboxChangetriggered", id, field, value);
    const updatedTableListData = tableListData.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isFreezeLeft: field === "isFreezeLeft" ? value : false,
          isFreezeRight: field === "isFreezeRight" ? value : false,
        };
      }
      return item;
    });

    setTableListData(updatedTableListData);
  };

  const handleEditCheckboxChange = (id: number, field: any, value: boolean) => {
    console.log("✅ handleEditCheckboxChange triggered:", id, field, value);

    const updatedTableListData = tableListData.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isEditable: value,
        };
      }
      return item;
    });

    setTableListData(updatedTableListData);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false); // Close the drawer
    setSelectedRecord(null); // Clear the selected record
    setListData([]);
    setTableListData([]);
  };

  const tabItems = useMemo(
    () => [
      {
        key: "1",
        label: "Form",
        children: (
          <Flex vertical gap={8}>
            <Flex gap={115}>
              <div className={styles.headerContainer}>
                <div className={styles.headerCheckbox}>
                  <Checkbox
                    checked={isShowAll}
                    onChange={handleShowAllChange}
                    className={styles.checkbox}
                  />
                </div>
                <div className={styles.header1}>
                  <h4>Fields</h4>
                  <Tooltip title="If selected, these fields will be displayed at the form level.">
                    <InfoCircleOutlined className={styles.infoIcon} />
                  </Tooltip>
                </div>
                <div className={styles.header}>
                  <h4>Mandatory</h4>
                  <Tooltip title="If selected, these fields will be mandatory for submission.">
                    <InfoCircleOutlined className={styles.infoIcon} />
                  </Tooltip>
                </div>
              </div>
            </Flex>
            <div className={`${styles.form1} custom-scroll-access`}>
              {/* <AccDrawerDrag
                open={drawerOpen}
                closePopup={() => setDrawerOpen(false)}
                // listData={rows}
                listData={listData}
                nameLabel={"name"}
                idLabel={"id"}
                onOpenChange={() => setDrawerOpen(!drawerOpen)}
                updateCheckboxValue={(id, field, value) =>
                  togglePermission(id, field, value)
                }
                updateOrder={(updatedList) => setRows(updatedList)}
                setIsShowAll={setIsShowAll}
              /> */}
              <AccDrawerDrag
                // open={drawerOpen}
                open={drag}
                // closePopup={handleDrawerClose}
                closePopup={() => setDrag(false)}
                listData={listData}
                nameLabel={"title"}
                idLabel="id"
                onOpenChange={() => setDrag(!drag)}
                // updateCheckboxValue={(id, field, value) => {
                //   setListData(prev =>
                //     prev.map(item =>
                //       item.id === id ? { ...item, [field]: value } : item
                //     )
                //   );
                // }}
                updateCheckboxValue={(id, field, value) =>
                  updateCheckboxValue(id, field, value, "listData")
                }
                // updateOrder={updateOrder}
                updateOrder={(updatedList) =>
                  updateOrder(updatedList, "listData")
                }
                // updateOrder={(updatedList) => setListData(updatedList)}
                setIsShowAll={setIsShowAll}
              />

            </div>
          </Flex>
        ),
      },
      {
        key: "2",
        label: "Table",
        children: (
          <Flex vertical gap={8}>
            <Flex gap={115}>
              <div className={styles.headerContainer}>
                <div className={styles.headerCheckbox}>
                  <Checkbox
                    checked={isTableShowAll}
                    onChange={handleShowAllChange}
                    className={styles.checkbox}
                  />
                </div>
                <div className={styles.tableheaderCol}>
                  <h4>Columns</h4>
                  <Tooltip title="If selected, these columns will be displayed at the table level.">
                    <InfoCircleOutlined className={styles.infoIcon} />
                  </Tooltip>
                </div>
                <div className={styles.tableheaderPoss}>
                  <h4>Position</h4>
                  <Tooltip title="If 'L' is selected, the column will be fixed to the left at the table level. If 'R' is selected, it will be fixed to the right.">
                    <InfoCircleOutlined className={styles.infoIcon} />
                  </Tooltip>
                </div>
                <div className={styles.tableheaderEdit}>
                  <h4>Editable</h4>
                  <Tooltip title="If selected, the column will be editable.">
                    <InfoCircleOutlined className={styles.infoIcon} />
                  </Tooltip>
                </div>
              </div>
            </Flex>
            <div className={styles.freezeHeader}>
              <p className={styles.freezeLeft}>L</p>
              <p className={styles.freezeRight}>R</p>
            </div>
            <div className={`${styles.form1} custom-scroll-access`}>
              <AccDragTable
                open={drag}
                closePopup={() => setDrag(false)}
                // listData={rows}
                listData={tableListData}
                nameLabel={"title"}
                idLabel={"id"}
                onOpenChange={() => setDrag(!drag)}

                updateCheckboxValue={(id, field, value) =>
                  updateCheckboxValue(id, field, value, "tableListData")
                }
                updateFreezeCheckboxValue={handleTableCheckboxChange}
                // updateEditCheckboxValue={handleEditCheckboxChange}
                updateEditCheckboxValue={(id, field, value) =>
                  handleEditCheckboxChange(id, field, value)
                }
                // updateOrder={updateOrder}
                updateOrder={(updatedList) =>
                  updateOrder(updatedList, "tableListData")
                }
                setIsShowAll={setIsTableShowAll}
              />
            </div>
          </Flex>
        ),
      },
    ],
    [rows, isShowAll, isTableShowAll, listData, tableListData]
  );

  return (
    <>
      <TableComponent
        rowKey="id"
        dataSource={rows}
        columns={columns}
        pagination={false}
        size="small"
        className="ow-custom-table-dropdown"
      />
      <DrawerComponent
        open={drawerOpen}
        onClose={handleDrawerClose}
        buttonLabel="Save"
        submit={() => formik.handleSubmit()}
        width={400}
        // header1={selectedForm?.name || selectedForm?.name}
        header1={formTitle}
        header2="Form Fields & Table Column Chooser"
        closeIcon={false}
        className={`${styles.form} accDragTableScroll`}
        resetDisable={true}
      >
        <Tabs
          items={tabItems}
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={handleTabChange}
          style={{ marginTop: "-20px" }}
        />
      </DrawerComponent>
      {notificationDisplayed && (
        <Toast message={"Fields saved successfully"} delay={1500} />
      )}
    </>
  );
}
