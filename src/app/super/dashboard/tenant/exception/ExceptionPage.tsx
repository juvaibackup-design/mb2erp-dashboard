"use client";

import styles from "@/app/dashboard/(inventory)/inventory-logistics/Logistics.module.css";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import DrawerComponent from "@/components/DrawerComponent/DrawerComponent";
import Header from "@/components/Header/Header";
import InputComponent from "@/components/InputComponent/InputComponent";
import RangePickerComponent from "@/components/RangePickerComponent/RangePickerComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import TableComponent from "@/components/TableComponent/TableComponent";
import { searchFunctionality } from "@/lib/helpers/filterHelpers";
import {
  CalendarOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Flex, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

interface DatePicker {
  date1: string | null;
  date2: string | null;
}

export default function ExceptionPage({
  receivedData,
}: {
  receivedData: any[];
}) {
  const [tableData, setTableData] = useState<any[]>([]);
  const [dates, setDates] = useState<DatePicker>({
    date1: null,
    date2: null,
  });
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [state1, setState1] = useState<string>("");
  const [state2, setState2] = useState<string>("");
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs().add(0, "d"), dayjs()] },
    { label: "Last Week", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last Month", value: [dayjs().add(-30, "d"), dayjs()] },
  ];
  console.log("console out state1", state1, "state2", state2);

  function handleDateFilter(dates: any) {
    console.log("dates", dates);
    if (dates) setDates({ date1: dates[0], date2: dates[1] });
    else setDates({ date1: null, date2: null });
  }

  function handleResetFilter() {}

  function onSaveFilter() {}

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header
          title={"Exceptions"}
          description={"List of all exceptions occurred"}
        />
      </div>
      <Flex vertical style={{ height: "calc( 100% - 70px )" }}>
        <div className={styles.filter}>
          <Flex
            align="center"
            justify="space-between"
            style={{ margin: "8px 0" }}
          >
            <div>
              <InputComponent
                onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) => {
                  // setFilteredData(
                  //   searchFunctionality(event.target.value, receivedData)
                  // );
                  setTableData(
                    searchFunctionality(event.target.value, receivedData)?.map(
                      (data) => {
                        return { ...data, key: data.id };
                      }
                    )
                  );
                }}
                type="search"
                placeholder={"Search Exception"}
                size="small"
                addonAfter={<SearchOutlined style={{ color: "#D9D9D9" }} />}
                className="overwrite-inputBox"
              />
            </div>
            <Flex>
              <RangePickerComponent
                className="ow-datepicker-icon-only"
                presets={rangePresets}
                format="YYYY-MM-DD"
                rootClassName="ow-root-datepicker-icon-only"
                value={[
                  dates.date1 ? dayjs(dates.date1, "YYYY-MM-DD") : null,
                  dates.date2 ? dayjs(dates.date2, "YYYY-MM-DD") : null,
                ]}
                onChange={(dates: any[] | any) => handleDateFilter(dates)}
                // allowClear={false}
                suffixIcon={<CalendarOutlined className={styles.filterIcons} />}
              />
              <ButtonComponent
                onClickEvent={() => setOpenDrawer(true)}
                className={styles.viewButton}
              >
                <FilterOutlined className={styles.filterIcons} />
              </ButtonComponent>
            </Flex>
            <DrawerComponent
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
              closeIcon={false}
              buttonLabel="Save"
              title={<h3>Filter</h3>}
              submit={onSaveFilter}
              reset={handleResetFilter}
            >
              <Flex vertical gap={8}>
                <button
                  onClick={() => {
                    setState1("abc");
                    console.log("console in state1", state1, "state2", state2);
                    setState2("xyz");
                  }}
                ></button>
                <SelectComponent
                  placeholder="Branch"
                  label="Branch"
                ></SelectComponent>
                <SelectComponent
                  placeholder="Username"
                  label="Username"
                ></SelectComponent>
                <SelectComponent
                  placeholder="Api URL"
                  label="Api URL"
                ></SelectComponent>
                <SelectComponent
                  placeholder="Controller"
                  label="Controller"
                ></SelectComponent>
                <SelectComponent
                  placeholder="Action"
                  label="Action"
                ></SelectComponent>
                <SelectComponent
                  placeholder="Exception Type"
                  label="Exception Type"
                ></SelectComponent>
              </Flex>
            </DrawerComponent>
          </Flex>
        </div>
        <ErrorBoundary>
          <TableComponent
            // rowSelection={{
            //   selectedRowKeys: selectedRowKeys,
            //   onChange: (keys: any[]) => setSelectedRowKeys(keys),
            // }}
            rowKey={"id"}
            columns={[
              {
                title: "Branch",
                dataIndex: "branch",
                fixed: "left",
              },
              {
                title: "Username",
                dataIndex: "username",
                // filterSearch: true,
                // filterMode: "menu",
                // filters: [
                //   {
                //     text: "Joe",
                //     value: "Joe",
                //   },
                // ],
              },
              {
                title: "Api URL",
                dataIndex: "apiURL",
              },
              {
                title: "Controller",
                dataIndex: "controller",
              },
              {
                title: "Action",
                dataIndex: "action",
              },
              {
                title: "Exception Type",
                dataIndex: "exceptionType",
              },
              {
                title: "Date and time",
                dataIndex: "date_stamp",
                fixed: "right",
                width: "20%",
              },
              {
                title: "Message",
                dataIndex: "message",
                fixed: "right",
                width: "10%",
              },
            ]}
            size="small"
            dataSource={[
              {
                id: 0,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 1,

                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 2,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 3,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 4,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 5,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 6,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 7,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 8,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 9,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 10,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 11,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 12,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 13,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 14,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 15,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 16,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 17,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 18,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 19,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
              {
                id: 20,
                branch: "Anna Nagar",
                username: "Ameer",
                apiURL: "/api/Userlogin",
                controller: "Authenticate",
                action: "Login",
                exceptionType: "System.NullReferenceException",
                date_stamp: "24-12-2024 12:30 PM",
              },
              {
                id: 21,
                branch: "Ashok Nagar",
                username: "Mubarak",
                apiURL: "/api/GetAllInvoiceCashVerify",
                controller: "POS",
                action: "GetAllInvoiceCashVerify",
                exceptionType: "Npgsql.PostgresException",
                message: "Boolean async",
                date_stamp: "03-12-2024 08:30 AM",
              },
            ]}
            pagination={false}
            scroll={{ x: "max-content" }}
            // style={{ flexGrow: 1 }}
            className="exception-table"
            // className="ow-custom-table-dropdown"
          />
        </ErrorBoundary>
      </Flex>
    </div>
  );
}
