"use client";
import { useEffect, useRef, useState } from "react";
import SuperUserTable, { SuperUserRow } from "./SuperUserTable";
import styles from "./superuser.module.css";
import Header from "@/components/Header/Header";
import DrawerComponent from "@/components/DrawerComponent/DrawerComponent";
import SuperUserForm from "./SuperUserForm";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "@/components/InputComponent/InputComponent";
import ConfirmModal from "@/components/ModalComponent/ConfirmModal";
import { decrypt1 } from "@/lib/helpers/utilityHelpers";
import { ENCRYPTION_KEY } from "@/lib/constants/constant";
import { tagRevalidate } from "@/app/dashboard/(admin)/admin-accessprivilege/[id]/Actions";
import { useSuperUserStore } from "@/store/superuserinfo/store";
import { superindexList } from "@/components/SideBar/Constants";


interface SuperUserPage {
  superUserList: any[];
  roleList: any[];
  branchList: any[];
}

export default function SuperUserPage({
  superUserList,
  roleList,
  branchList,
}: SuperUserPage) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  // const [selectedUser, setSelectedUser] = useState<any>(null);
  const [superUserTableData, setSuperUserTableData] = useState<any[]>(superUserList || []);
  const searchinputRef = useRef(null);
  const router = useRouter();
  const [host, setHost] = useState<any>([""]);
  const [refKey, setRefKey] = useState(0);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const isEdit = !!editingRecord;
  const [formDirty, setFormDirty] = useState<boolean>(false);
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
    const [rowData, setRowData] = useState<any>();
  // const [tableData, setTableData] = useState(superUserList || []);
  const addnewRef = useRef(null);
  const superuserDetails = useSuperUserStore((state: any) => JSON.parse(state?.user));
  const [access, setAccess] = useState<any>(null);
  const [p_index, c_index, gc_index] = superindexList["Users"];

  console.log("API DATA:", superuserDetails);

  useEffect(() => {
    if (!superuserDetails) return;
    const accessList = superuserDetails?.accessPrivilegeList || [];
    const foundAccess = accessList.find(
      (item: any) => item.pIndex == p_index && item.cIndex == c_index
    );
    console.log("foundAccess", foundAccess, accessList)
    setAccess(foundAccess);
    if (!Boolean(foundAccess?.isView)) {
      alert(`You don't have access to this page`);
      router.back();
    }
  }, [superuserDetails?.accessPrivilegeList?.length]);

  useEffect(() => {
    setSuperUserTableData(superUserList || []);
  }, [superUserList]);

  useEffect(() => {
    tagRevalidate("superuser");
  }, []);


  const onClose = () => {
    if (formDirty) {
      setIsConfirmModal(true);
    } else {
      setIsConfirmModal(false);
      setOpenDrawer(false);
    }
  };

  const onEditUser = (record: any) => {
    setEditingRecord(record);
    setOpenDrawer(true);
  };


  // const handleAddNewUser = () => {
  //   setSelectedUser(null);
  //   setOpenDrawer(true);
  // };


  const searchFunctionality = (value: string, data: any[]) => {
    const lowercasedValue = value.toLowerCase().trim();

    if (!lowercasedValue) return data;

    return data?.filter((item) => {
      const firstName =
        item?.firstName?.toString().toLowerCase() ?? "";

      return firstName.includes(lowercasedValue);
    });
  };

  const rows = searchFunctionality(searchInput, superUserTableData);
  console.log("rows", rows);


  return (
    <>
      <ConfirmModal
        openModal={isConfirmModal}
        onClose={() => {
          setIsConfirmModal(false);
          setOpenDrawer(false);
        }}
        onCancel={() => setIsConfirmModal(false)}
      />
      <div className={styles.header}>
        <Header
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              Super Users </span>}
          description={"Complete list of all Super Users"}
          buttonLable={<div ref={addnewRef}>Add New</div>}
          onClick={() => {
            setEditingRecord(null);
            setOpenDrawer(true);
          }}
          disabled={!access?.isAdd}
        />
      </div>
      <div className={styles.filter_container}>
        <div ref={searchinputRef}>
          <InputComponent
            onChangeEvent={(e: any) => {
              setSearchInput(e.target.value);
            }}
            type="search"
            size="middle"
            placeholder={"Search"}
            className="overwrite-inputBox"
            addonAfter={<SearchOutlined style={{ color: "#D9D9D9" }} />}
            style={{ width: 240 }}
          />
        </div>
      </div>
      <div className={`${styles.scrollCont} custom-scroll`}>
        <SuperUserTable
          tableData={searchFunctionality(searchInput, superUserTableData)}
          superUserTableData={superUserTableData}
          setSuperUserTableData={setSuperUserTableData}
          roleList={roleList}
          branchList={branchList}
          userList={superUserList}
          userTableData={superUserTableData}
          // access={{ isEdit: true }}
          access={access}
          setAccess={setAccess}
          // setAccess={() => { }}
          host={host}
          setNotificationDisplayed={() => { }}
          setRefKey={setRefKey}
          onEdit={onEditUser}
        />
      </div>

      <DrawerComponent
        key={refKey}
        open={openDrawer}
        onClose={onClose}
        footer={[]}
        className="ow-taxmaster-drawer"
        rootClass="ow-content-wrapper"
        header1={isEdit ? "Edit Super Users" : "Super Users"}
        header2={isEdit ? "Edit Super Users" : "Add Super Users"}
        closeIcon={false}
      >
        <SuperUserForm
          initData={
            isEdit
              ? {
                ...editingRecord,

                id: editingRecord?.id ?? 0,
                roleId: editingRecord?.roleId ?? null,

                firstName: editingRecord?.firstName ?? "",
                middleName: editingRecord?.middleName ?? "",
                lastName: editingRecord?.lastName ?? "",
                customerList: Array.isArray(editingRecord?.customerList)
                  ? editingRecord.customerList
                  : [],



                userName: editingRecord?.loginName
                  ? editingRecord.loginName.split("@")[0]
                  : "",

                password: decrypt1(editingRecord?.password, ENCRYPTION_KEY),

                isAllowSavePassword: editingRecord?.isAllowSavePassword ?? false,

                // idleMinutes: editingRecord?.idleMinutes ?? 0,
                // isActive: editingRecord?.isActive ?? true,
                isActive: Boolean(editingRecord?.isActive),

                createdBy: editingRecord?.createdBy ?? 1,
                updatedBy: 1,
                imageData: {
                  imageFileName: editingRecord?.profileImageName || "",
                  imageFileType: editingRecord?.profileImageType || "",
                  imageFileData: editingRecord?.profileImageData || "",
                },
              }
              : {
                id: 0,
                roleId: null,

                firstName: "",
                middleName: "",
                lastName: "",
                customerList: "",

                primaryPhoneNumber: null,

                userName: "",
                password: "",

                isAllowSavePassword: false,
                // idleMinutes: 0,
                isActive: true,

                createdBy: 1,
                updatedBy: 1,
                imageData: {
                  imageFileName: "",
                  imageFileType: "",
                  imageFileData: "",
                },
              }
          }
          type={isEdit ? "edit" : "create"}
          userList={superUserList}
          roleList={roleList}
          branchList={branchList}
          userTableData={superUserList}
          setOpenDrawer={setOpenDrawer}
          open={openDrawer}
          record={editingRecord}
          setNotificationDisplayed={() => { }}
          setSuperUserTableData={setSuperUserTableData}
          access={{ is_edit: true }}
          setAccess={() => { }}
          host={host}
          setRefKey={setRefKey}
          setIsConfirmModal={setIsConfirmModal}
          setFormDirty={setFormDirty}
          formDirty={formDirty}
          rowData={rowData}
        />
      </DrawerComponent>
    </>
  );
}
