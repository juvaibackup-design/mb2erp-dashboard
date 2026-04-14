"use client";

import React, { useEffect, useRef, useState } from 'react';
import Header from "@/components/Header/Header";
import InputComponent from '@/components/InputComponent/InputComponent';
import { SearchOutlined } from '@ant-design/icons';
import AccessPrivilegeTable from './AccessPrivilegeTable';
import { useUserStore } from "@/store/userInfo/store";
import { useRouter } from "next/navigation";
import sidebarStore from "@/store/sidebar/store";
import CreateRole from './CreateRole';
import Toast from "@/components/CustomToast/Toast";
import Cookies from "js-cookie";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import { superindexList } from "@/components/SideBar/Constants";
import { useSuperUserStore } from '@/store/superuserinfo/store';

export default function AccessPrivilegePage({ roleData, tableData }: any) {
  const newOrderBtnRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const userData = tableData;
  const [initialUserData, setInitialUserData] = useState(tableData);
  const [initialRoleData, setInitialRoleData] = useState(roleData);
  const [access, setAccess] = useState<any>(null);
  const router = useRouter();
  const accessRef = useRef(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const sideStore: any = sidebarStore.getState();
  const [roleCreated, setRoleCreated] = useState(false);
  const roleNameRef = useRef(null);
  const userRoleRef = useRef(null);
  const resetModalRef = useRef(null);
  const createModalRef = useRef(null);
  const userRef = useRef(null);
  const [roleEdited, setRoleEdited] = useState(false);
  const roleEditedStatus = Cookies.get("roleCreated");
  const superuserDetails = useSuperUserStore((state: any) => JSON.parse(state?.user));
  const [p_index, c_index, gc_index] = superindexList["Access Privilege"];

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
    setInitialRoleData(roleData);
  }, [roleData]);
  useEffect(() => {
    setInitialUserData(tableData);
  }, [tableData]);


  useEffect(() => {
    if (roleEditedStatus === "success") {
      Cookies.remove("roleCreated");
      setRoleEdited(true);
      setTimeout(() => {
        setRoleEdited(false);
      }, 2000);
    }
  }, [roleEditedStatus]);

  useEffect(() => {
    return () => {
      tagRevalidate("accessData");
    };
  }, []);

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredItems = initialRoleData?.filter((item: any) =>
    item?.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredUserItems = initialUserData?.filter((item: any) =>
    item?.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // useEffect(() => {
  //   if (!userDetails) return;
  //   const accessList = userDetails?.accessPrivilegeList || [];
  //   const foundAccess = accessList.find(
  //     (item: any) => item.form_name === "Access Privilege"
  //   );
  //   setAccess(foundAccess);
  //   if (!Boolean(foundAccess?.is_view)) {
  //     alert(`You don't have access to this page`);
  //     router.back();
  //   }
  // }, [userDetails?.accessPrivilegeList?.length]);

  useEffect(() => {
    setInitialUserData(tableData);
  }, [tableData]);

  useEffect(() => {
    if (sideStore.openComp == "admin-accessprivilege") {
      setOpenDrawer(true);
      sidebarStore.setState({ openComp: "" })
    }
  }, [sideStore.openComp]);

  return (
    <>
      <div className="padding" style={{ height: "60px" }}>
        <Header
          title={("Access Privilege")}
          description={("A descriptive body text comes here")}
          buttonLable={<div ref={newOrderBtnRef}>{("Create Role")}</div>}
          onClick={() => setOpenDrawer(true)}
          disabled={!access?.isAdd}
        />
      </div>

      <div
        className="padding"
        style={{ height: "60px", display: "flex", alignItems: "center", width: 220 }}
        ref={searchInputRef}
      >
        <InputComponent
          placeholder={("Search")}
          type="text"
          addonAfter={<SearchOutlined style={{ color: "#D9D9D9" }} />}

          value={searchTerm}
          onChangeEvent={(e) => onSearch(e.target.value)}
          style={{ width: 200 }}
        />
      </div>

      <div
        style={{
          height: "calc(100% - 60px - 60px - 16px)",
          overflow: "auto",
          marginBottom: "16px",
        }}
        className="custom-scroll"
      >
        <AccessPrivilegeTable
          tableData={filteredItems}
          // userData={userData}
          userData={filteredUserItems}
          setInitialRoleData={setInitialRoleData}
          initialRoleData={initialRoleData}
          access={access}
          setAccess={setAccess}
          roleList={roleData}
          accessRef={accessRef}
          searchInputRef={searchInputRef}
        />
      </div>

      <CreateRole
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        userList={userData}
        roleList={roleData}
        type={"Create"}
        title={("Create Role")}
        buttonLabel={("Create")}
        showNotification={setRoleCreated}
        access={access}
        setAccess={setAccess}
        roleNameRef={roleNameRef}
        userRef={userRef}
        userRoleRef={userRoleRef}
        resetModalRef={resetModalRef}
        createModalRef={createModalRef}
      />

      {roleCreated && (
        <Toast message={("New Role created successfully")} delay={2000} />
      )}
    </>
  )
}

