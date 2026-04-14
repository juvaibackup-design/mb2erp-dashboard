"use client";

import { Button, Carousel, Flex, Table } from "antd";
import InputNumberComponent from "@/components/InputComponent/InputNumberComponent";
import InputComponent from "@/components/InputComponent/InputComponent";
import InputPasswordComponent from "@/app/_components/signInComponents/InputPasswordComponent";
import Password from "antd/lib/input/Password";
import { Suspense, useEffect, useMemo, useState } from "react";
// import makeApiCall, { makeSuperAPICall } from "@/lib/helpers/apiHandlers/api";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { entries } from "lodash";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import DrawerComponent from "@/components/DrawerComponent/DrawerComponent";
import {
  AppstoreOutlined,
  FilterOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import styles from "@/app/dashboard/(inventory)/inventory-logistics/Logistics.module.css";
import Header from "@/components/Header/Header";
import TableComponent from "@/components/TableComponent/TableComponent";
import DragAndDropList from "@/components/DragAndDropList/DragAndDropList";
import { searchFunctionality } from "@/lib/helpers/filterHelpers";
import { ActivationTableColumns } from "./constants";
import Toast from "@/components/CustomToast/Toast";
// import Cookies from "js-cookie";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function ActivationPage({ receivedData }: any) {
  const params = useParams();
  const searchParams = useSearchParams();
  const [userDetails, setUserDetails] = useState<any>();
  const [gridView, setGridView] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>(
    searchParams.get("domain") || ""
  );
  const [openFilterDrawer, setOpenFilterDrawer] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>(receivedData);
  const [detailsTable, setDetailsTable] = useState<any[]>([]);
  const [trialDays, setTrialDays] = useState<any>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [formSubmittedMsg, setFormSubmittedMsg] = useState<string>("");
  // const router = useRouter();

  const columns: any[] = useMemo(() => {
    return ActivationTableColumns;
  }, []);

  console.log("receivedData", receivedData);

  function handleInputSearch(event: React.ChangeEvent<HTMLInputElement>) {
    // router.replace(router.pathname, undefined, { shallow: true });
    const index = receivedData?.findIndex(
      (company: any) => company.domain == event.target.value
    );
    if (index != -1) {
      const data = [];
      for (const [key, value] of Object.entries(receivedData[index])) {
        if (
          key == "zipCode" ||
          key == "isActive" ||
          key == "userName" ||
          key == "password" ||
          key == "dbConnections" ||
          key == "branches"
        )
          continue;
        else if (key == "expiryDate" || key == "createdAt") {
          data.push({ first: key, second: (value as any).split("T")[0] });
          continue;
        }
        data.push({ first: key, second: value });
      }
      setDetailsTable(data);
      setUserDetails(receivedData[index]);
      setTrialDays(receivedData[index].trialDays);
      setDisabled(false);
    } else {
      setDetailsTable([]);
      setUserDetails({});
      setDisabled(true);
    }
    setSearchInput(event.target.value);
  }

  // useEffect(() => {
  //   makeSuperAPICall
  //     .get(`/GetAllRegisteredcompany`, {
  //       headers: {
  //         // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJqdGkiOiIwNDc1YmVmNi00OGZlLTQzY2QtYmM5OC05OTYxN2Q5NjA0ODkiLCJpYXQiOiIxLzExLzIwMjUgMTE6Mjk6NTkgQU0iLCJUaWQiOiIxOGxVU2xlaThaWDFEYkxKOXFtVzRBPT0iLCJFbWFpbCI6IkFkbWluICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIiwiVXNlck5hbWUiOiJTdXBlciBBZG1pbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICIsIkVtcElEIjoiQWRtaW4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIxIiwiZXhwIjoxNzM2NTk1Mjk5LCJpc3MiOiJKV1RBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6IkpXVFNlcnZpY2VQb3N0bWFuQ2xpZW50In0.wdFt-McsYpvI_djMLuviXavkOj4C7D08GEfYn4dJlqw`,
  //         Authorization: `Bearer ${Cookies.get("superToken")}`,
  //       },
  //     })
  //     .then((res) => console.log("res", res))
  //     .catch((err) => console.log(err));
  // });

  // function validatePassword() {
  //   if (!password) return setError("Password is required");
  //   if (password != "Icube@123") return setError("Incorrect password!");
  //   setError("");
  //   makeApiCall
  //     .get("GetAllRegisteredcompany")
  //     .then((res) => {
  //       const data = res.data.data.find(
  //         (user: any) => user.domain == searchParams.get("domain")
  //       );
  //       setUserDetails(data);

  //       let tableData = [];
  //       for (const [key, value] of Object.entries(data)) {
  //         if (
  //           key == "zipCode" ||
  //           key == "isActive" ||
  //           key == "userName" ||
  //           key == "password"
  //         )
  //           continue;
  //         tableData.push({ first: key, second: value });
  //       }
  //       setDetailsTable(tableData);
  //     })
  //     .catch((err) => console.log(err));
  // }

  function toggleActivation() {
    if (!userDetails?.isActive && !trialDays) return;
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/PostDomainStatusUpdate`,
        {
          domain: searchInput,
          status: !userDetails.isActive,
          trailDays: trialDays,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("superToken")}`,
          },
        }
      )
      .then((res) => {
        setFormSubmittedMsg(
          userDetails.isActive
            ? "Company deactivated successfully"
            : "Company activated successfully"
        );
        tagRevalidate("registeredCompanies");
      })
      .catch((err) => console.log(err));
  }

  function onSaveFilter() {}

  function handleResetFilter() {}

  function handleOk() {}

  useEffect(() => {
    setTableData(receivedData);
    const index = receivedData?.findIndex(
      (user: any) => user.domain == searchParams.get("domain")
    );
    if (index != -1 && receivedData.length > 0) {
      setUserDetails(receivedData[index]);
      let tableData1 = [];
      for (const [key, value] of Object.entries(receivedData[index])) {
        if (
          key == "zipCode" ||
          key == "isActive" ||
          key == "userName" ||
          key == "password" ||
          key == "dbConnections" ||
          key == "branches" ||
          key == "trialDays"
        )
          continue;
        else if (key == "expiryDate" || key == "createdAt") {
          tableData1.push({ first: key, second: (value as any).split("T")[0] });
          continue;
        }
        tableData1.push({ first: key, second: value });
      }
      setDetailsTable(tableData1);
      setTrialDays(receivedData[index].trialDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedData]);

  useEffect(() => {
    setTimeout(() => {
      setFormSubmittedMsg("");
    }, 2500);
  }, [formSubmittedMsg]);

  return (
    <Suspense fallback={<div>loading...</div>}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Header
            title={"Activation"}
            description={"Complete list of all registered companies"}
          // buttonLable="Add Tenant"
          // onClick={() => {
          //   setOpenDrawer(true);
          // }}
          // disabled={}
          />
        </div>
        <div className={styles.filter}>
          <Flex
            align="center"
            justify="space-between"
            style={{ margin: "8px 0" }}
          >
            <div>
              <InputComponent
                // ref={inputRef}
                value={searchInput}
                onChangeEvent={handleInputSearch}
                type="search"
                placeholder={"Search Company"}
                size="small"
                addonAfter={<SearchOutlined style={{ color: "#D9D9D9" }} />}
                className="overwrite-inputBox"
              />
            </div>
            {/* <Flex>
              <RangePickerComponent
                className="ow-datepicker-icon-only"
                presets={rangePresets}
                format="YYYY-MM-DD"
                rootClassName="ow-root-datepicker-icon-only"
                value={[
                  date1 ? dayjs(date1, "YYYY-MM-DD") : null,
                  date2 ? dayjs(date2, "YYYY-MM-DD") : null,
                ]}
                onChange={(dates: any[]) => handleDateFilter(dates)}
                // allowClear={false}
                suffixIcon={<CalendarOutlined className={styles.filterIcons} />}
              />
              <ButtonComponent
                onClickEvent={() => setOpenDrawer(true)}
                className={styles.viewButton}
              >
                <FilterOutlined className={styles.filterIcons} />
              </ButtonComponent>
              <DrawerComponent
                open={openFilterDrawer}
                onClose={() => setOpenFilterDrawer(false)}
                closeIcon={false}
                buttonLabel="Save"
                title={<h3>Filter</h3>}
                submit={onSaveFilter}
                reset={handleResetFilter}
              >
                <p></p>
              </DrawerComponent>
              <DrawerComponent
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                closeIcon={false}
                buttonLabel="Save"
                title={<h3>Filter</h3>}
                submit={onSaveFilter}
                reset={handleResetFilter}
              >
                <p></p>
              </DrawerComponent>
              <ButtonComponent
                onClickEvent={() => setGridView(!gridView)}
                className={styles.viewButton}
              >
                {gridView ? (
                  <AppstoreOutlined className={styles.filterIcons} />
                ) : (
                  <UnorderedListOutlined className={styles.filterIcons} />
                )}
              </ButtonComponent>
              <DragAndDropList
                open={openSettings}
                closePopup={() => setOpenSettings(false)}
                listData={columns}
                nameLabel="title"
                idLabel="id"
                onOpenChange={() => setOpenSettings(!openSettings)}
                handleOk={handleOk}
                isHaveFooter={true}
                footerLabel1="Grid"
                footerLabel2="Card"
              />
            </Flex> */}
          </Flex>
        </div>
        <div
          className={`${styles.scrollSection} custom-scroll`}
        // onScroll={handleScroll}
        >
          {/* <TableComponent
            size="small"
            className="ow-custom-table-dropdown"
            dataSource={tableData}
            rootClassName={tableData?.length === 0 ? " ow-emptyTableLayout " : ""}
            columns={columns}
            pagination={false}
          /> */}
          <Flex vertical gap={16}>
            <h3 style={{ textAlign: "center" }}>
              {userDetails?.customer
                ? userDetails?.customer + "'s Company Details"
                : ""}
            </h3>
            <Table
              columns={[
                { dataIndex: "first", title: "Field" },
                { dataIndex: "second", title: "Data" },
              ]}
              dataSource={detailsTable}
              pagination={false}
            />
            <div style={{ alignSelf: "center" }}>
              {!userDetails?.isActive && (
                <InputNumberComponent
                  label="Trial days"
                  style={{ width: "100%" }}
                  value={trialDays}
                  onChange={(value) => setTrialDays(value)}
                  errormsg={!trialDays && "Trial days is required"}
                />
              )}
            </div>
            <Button
              type="primary"
              size="large"
              danger={userDetails?.isActive ?? false}
              style={{ alignSelf: "center" }}
              onClick={toggleActivation}
              disabled={disabled || !userDetails}
            >
              {userDetails?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </Flex>
        </div>
        {formSubmittedMsg && (
          <Toast type="success" message={formSubmittedMsg} delay={2500} />
        )}
      </div>
    </Suspense>
  );
}
