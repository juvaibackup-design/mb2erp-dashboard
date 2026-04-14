"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import styles from "./Tenant.module.css";
import Header from "@/components/Header/Header";
import { Flex, Input, Table, Tag } from "antd";
import InputComponent from "@/components/InputComponent/InputComponent";
import {
  AppstoreOutlined,
  FilterOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import DrawerComponent from "@/components/DrawerComponent/DrawerComponent";
import DragAndDropList from "@/components/DragAndDropList/DragAndDropList";
import Toast from "@/components/CustomToast/Toast";
import { searchFunctionality } from "@/lib/helpers/filterHelpers";
import TableComponent from "@/components/TableComponent/TableComponent";
import {
  branchTableColumns,
  dbTypes,
  ModalTableColumns,
  TenantTableColumns,
} from "./constants";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePickerComponent from "@/components/DatepickerComponent/DatepickerComponent";
import dayjs from "dayjs";
import ExtinctSwitch from "@/components/ExtinctSwitch/ExtinctSwitch";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/store/login/store";
import axios from "axios";
import SwitchComponent from "@/components/SwitchComponent/SwitchComponent";
import ModalComponent from "@/components/ModalComponent/ModalComponent";
import TextAreaComponent from "@/components/TextAreaComponent/TextAreaComponent";
import InputPasswordComponent from "@/app/_components/signInComponents/InputPasswordComponent";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";
import { tagRevalidate } from "@/lib/helpers/serverActions";
// import { tagRevalidate } from "@/app/dashboard/(admin)/admin-accessprivilege/[id]/Actions";
import { showAlert } from "@/lib/helpers/alert";
import Cookies from "js-cookie";
import { MasterDetailModule } from "ag-grid-enterprise";
import ConfirmModal from "@/components/ModalComponent/ConfirmModal";
import { superindexList } from "@/components/SideBar/Constants";
import { useSuperUserStore } from "@/store/superuserinfo/store";
import { AgGridReact } from "ag-grid-react";
import { SetFilterModule } from "ag-grid-enterprise";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  ColDef,
  ICellRendererParams,
} from "ag-grid-community";


ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  SetFilterModule,
  ValidationModule,
  MasterDetailModule
]);

type TenantRow = {
  id: number;
  name: string;
  hasBranches?: boolean;
  branches?: any[];
};

export default function TenantPage({ receivedData }: { receivedData: any[] }) {
  const [gridView, setGridView] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [openTenantDrawer, setOpenTenantDrawer] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [modalIndex, setModalIndex] = useState<number>(-1);
  const inputRefs = useRef<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  // const [tableData, setTableData] = useState<any[]>(
  //   receivedData?.map((data) => {
  //     return { ...data, key: data.id };
  //   })
  // );

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { TextArea } = Input;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formSubmittedMsg, setFormSubmittedMsg] = useState<string>("");
  const setPreferredAction = useLoginStore().setPreferredAction;
  const router = useRouter();
  const [packageList, setPackageList] = useState<any[]>([]);
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [formDirty, setFormDirty] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [p_index, c_index, gc_index] = superindexList["Tenant"];
  const [columnChooserData, setColumnChooserData] = useState<any[]>([]);
  const [tablecolumnChooserData, setTableColumnChooserData] = useState<any[]>(
    []
  );
  const [columnList, setColumnList] = useState<any>([]);
  const [loadingRows, setLoadingRows] = useState<number[]>([]);
  const [storageLoading, setStorageLoading] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const mapped = receivedData.map((d) => ({ ...d, key: d.id }));
    setAllData(mapped);
    setTableData(mapped);
  }, [receivedData]);

  const gridRef = useRef<any>(null);
  const modeOptions = [
    { value: "Demo", label: "Demo" },
    { value: "Trail", label: "Trail" },
    { value: "Test", label: "Test" }
  ];

  useEffect(() => {
    tagRevalidate("registeredCompanies");
  }, []);

  const fetchBranches = async (tenantId: number) => {
    try {
      const res = await makeSuperAPICall.get(
        `GetTenantBranches?tenantId=${tenantId}`
      );

      const branches = res?.data?.data || [];

      return {
        hasBranches: branches.length > 0,
        branches,
      };
    } catch (err) {
      console.error("Branch fetch error", err);
      return {
        hasBranches: false,
        branches: [],
      };
    }
  };

  const fetchStorageDetails = async (tenantId: number) => {
    try {
      setStorageLoading(true);

      const res = await makeSuperAPICall.get(
        `GetTenantStorageDetails?tenantId=${tenantId}`
      );

      return res?.data?.data || [];
    } catch (err) {
      console.error("Storage fetch error", err);
      return [];
    } finally {
      setStorageLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!tableData.length) return;

  //   const enrichTenants = async () => {
  //     const updated = await Promise.all(
  //       tableData.map(async (t) => {
  //         const result = await fetchBranches(t.id);

  //         return {
  //           ...t,
  //           hasBranches: result.hasBranches,
  //           branches: result.branches,
  //         };
  //       })
  //     );

  //     setTableData(updated);
  //   };

  //   enrichTenants();
  // }, [tableData.length]);

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: "",
      width: 60,
      cellRenderer: "agGroupCellRenderer",
    },
    {
      headerName: "Customer",
      field: "customer",
      flex: 1,
      minWidth: 160,
      filter: "agSetColumnFilter",
      cellRenderer: (params: ICellRendererParams) => {
        const record = params.data;
        console.log("AG GRID RECORD", record);
        if (!record) return "-";

        return (
          <ButtonComponent
            type="link"
            onClickEvent={() => {
              setFormDirty(false);
              setOpenTenantDrawer(true);

              const mapped = {
                id: record.id,
                country: record.country,
                countryId: record.countryId,
                state: record.state,
                stateId: record.stateId,
                cityId: record.cityId,
                city: record.city,
                packageId: record.packageId,
                // packageId: Number(record.packageId),
                packageCode: record.packageCode,
                expiryDate: record.expiryDate,
                renewalDate: record.renewalDate,
                mode: record.mode,
                userName: record.userName ?? "",
                validity: "",
                noOfUsers: record.noOfUsers,
                noOfSites: record.noOfSites,
                accountManager: record.accountManager,
                spoc: record.spoc,
                phoneNumber: record.phoneNumber,
                customer: record.customer,
                host: record.host,
                domain: record.domain,
                isActive: record.isActive
              };
              console.log("Mapped Values", mapped);
              setInitialValues(mapped);
            }}
          >
            {record.customer}
          </ButtonComponent>
        );
      },
    },

    {
      headerName: "Domain",
      field: "domain",
      flex: 1,
      minWidth: 160,
      filter: "agSetColumnFilter",
    },

    {
      headerName: "Industry",
      field: "industry",
      flex: 1,
      minWidth: 160,
      filter: "agSetColumnFilter",
    },

    {
      headerName: "Package Id",
      field: "packageId",
      flex: 1,
      minWidth: 160,
      filter: "agNumberColumnFilter",
    },

    {
      headerName: "Package Code",
      field: "packageCode",
      flex: 1,
      minWidth: 160,
      filter: "agSetColumnFilter",
    },

    {
      headerName: "Mode",
      field: "mode",
      flex: 1,
      minWidth: 160,
      filter: "agSetColumnFilter",
    },

    {
      headerName: "DB Connections",
      field: "dbConnections",
      flex: 1,
      minWidth: 160,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <ButtonComponent
            type="link"
            onClickEvent={() => handleOpenModal(params.data.id)}
          >
            Storage
          </ButtonComponent>
        );
      },
    },

    {
      headerName: "Start Date",
      field: "startDate",
      flex: 1,
      minWidth: 160,
      filter: "agDateColumnFilter",
      valueFormatter: (params) =>
        params.value ? params.value.split("T")[0] : "",
    },

    {
      headerName: "Expiry Date",
      field: "expiryDate",
      flex: 1,
      minWidth: 160,
      filter: "agDateColumnFilter",
      valueFormatter: (params) =>
        params.value ? params.value.split("T")[0] : "",
    },

    {
      headerName: "Renewal Date",
      field: "renewalDate",
      flex: 1,
      minWidth: 160,
      filter: "agDateColumnFilter",
      valueFormatter: (params) =>
        params.value ? params.value.split("T")[0] : "",
    },

    {
      headerName: "Payment Status",
      field: "paymentStatus",
      flex: 1,
      minWidth: 160,
      filter: "agSetColumnFilter",
    },

    {
      headerName: "Last Paid Date",
      field: "lastPaidDate",
      flex: 1,
      minWidth: 160,
      filter: "agDateColumnFilter",
      valueFormatter: (params) =>
        params.value ? params.value.split("T")[0] : "",
    },

    {
      headerName: "Mode of Payment",
      field: "modeOfPayment",
      flex: 1,
      minWidth: 160,
      filter: "agSetColumnFilter",
    },

    {
      headerName: "Account Manager",
      field: "accountManager",
      flex: 1,
      minWidth: 160,
      filter: "agSetColumnFilter",
    },

    {
      headerName: "SPOC",
      field: "spoc",
      flex: 1,
      minWidth: 150,
      filter: "agSetColumnFilter",
    },

    {
      headerName: "No. of Users",
      field: "noOfUsers",
      flex: 1,
      minWidth: 150,
      cellStyle: { textAlign: "center" },
      filter: "agNumberColumnFilter",
    },

    {
      headerName: "No. of Sites",
      field: "noOfSites",
      flex: 1,
      minWidth: 150,
      cellStyle: { textAlign: "center" },
      filter: "agNumberColumnFilter",
    },

    {
      headerName: "Extinct",
      field: "isActive",
      flex: 1,
      minWidth: 140,
      cellRenderer: (params: ICellRendererParams) => {
        const record = params.data;
        if (!record) return "-";

        return (
          <ExtinctSwitch
            size="small"
            checked={!record.isActive}
            onChange={() => {
              if (params.node.rowIndex !== null) {
                handleExtinct(params.node.rowIndex, !record.isActive);
              }
            }}
          />
        );
      },
    }
  ], []);

  const [initialValues, setInitialValues] = useState({
    id: 0,
    country: null,
    state: null,
    city: null,
    packageId: null,
    packageCode: "",
    expiryDate: null,
    renewalDate: null,
    mode: null,
    userName: "",
    validity: "",
    noOfUsers: "",
    noOfSites: "",
    accountManager: "",
    spoc: "",
    phoneNumber: null,
    customer: "",
    host: "",
    domain: "",
    isActive: true
  });
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      country: Yup.string().required("This field is required"),
      state: Yup.string().required("This field is required"),
      city: Yup.string().required("This field is required"),
      // country: Yup.number().required("Country is required"),
      // state: Yup.number().required("State is required"),
      // city: Yup.number().required("City is required"),
      // plan: Yup.string().required("This field is required"),
      expiryDate: Yup.string().required("This field is required"),
      mode: Yup.string().required("This field is required"),
      // user: Yup.string().required("This field is required"),
      // validity: Yup.string().required("This field is required"),
      // branch: Yup.string().required("This field is required"),
    }),
    onSubmit: (values: any) => {
      console.log("valuesssssssss", values);
      console.log("Tenant Update Payload:", values);
      console.log("token", `Bearer ${Cookies.get("superToken")}`)
      makeSuperAPICall
        .post("PostTenantUpdate", values)
        .then((res) => {
          const updatedTenant = {
            ...values,
            noOfUsers: values.noOfUsers ? Number(values.noOfUsers) : 0,
            noOfSites: values.noOfSites ? Number(values.noOfSites) : 0,
          };

          setAllData((prev) =>
            prev.map((item) =>
              item.id === values.id
                ? { ...item, ...updatedTenant }
                : item
            )
          );

          setTableData((prev) =>
            prev.map((item) =>
              item.id === values.id
                ? { ...item, ...updatedTenant }
                : item
            )
          );
          console.log(res);
          tagRevalidate("registeredCompanies");
          setFormDirty(false);
          setOpenTenantDrawer(false);
          setFormSubmittedMsg("Saved successfully");
        })
        .catch((err) => console.log(err));
    },
  });
  console.log("formik.err", formik);
  const [initialModalValues, setInitialModalValues] = useState<any>({
    connectionString: [
      {
        Server: "",
        Database: "",
        Port: "",
        UserId: "",
        Password: "",
        Timeout: "",
        CommandTimeout: "",
      },
    ],
    file_storage_location: "",
  });
  const itemSchema = Yup.object().shape({
    Server: Yup.string().required("Server name is required"),
    Database: Yup.string().required("Database name is required"),
    Port: Yup.string()
      .required("Port number is required")
      .matches(/^(?!0)\d+$/, "Port Number can only be a real number"),
    UserId: Yup.string().required("User Id is required"),
    Password: Yup.string().required("Password is required"),
    Timeout: Yup.number(),
    CommandTimeout: Yup.number(),
  });
  const modalFormik = useFormik({
    initialValues: initialModalValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      connectionString: Yup.array().of(itemSchema),
      file_storage_location: Yup.string().required(
        "File Storage Location is required"
      ),
    }),
    onSubmit: (values: any) => {
      const index = tableData.findIndex((company) => company.id == modalIndex);
      const company = tableData[index];
      //old
      // for (let i = 0; i < company.dbConnections.length; i++) {
      //   if (company.dbConnections[i].attributeKey.includes(";")) {
      //     const connString = company.dbConnections[i].attributeValue
      //       .split(";")
      //       .filter((value: string) => value);
      //     let value = "";
      //     for (let j = 0; j < connString.length; j++) {
      //       value =
      //         value +
      //         connString[j].split("=")[0].replace(/\s/g, "") +
      //         "=" +
      //         values.connectionString[i][
      //         connString[j].split("=")[0].replace(/\s/g, "")
      //         ] +
      //         ";";
      //     }
      //     company.dbConnections[i].attributeValue = value;
      //   } else {
      //     company.dbConnections[i].attributeValue =
      //       values[company.dbConnections[i].attributeKey];
      //   }
      // }
      //New
      for (let i = 0; i < company.dbConnections.length; i++) {
        const conn = company.dbConnections[i];

        if (conn.attributeValue?.includes(";")) {
          const connString = conn.attributeValue
            .split(";")
            .filter((value: string) => value);

          let value = "";

          for (let j = 0; j < connString.length; j++) {
            const key = connString[j].split("=")[0].replace(/\s/g, "");

            value +=
              key +
              "=" +
              values.connectionString[conn.seqno]?.[key] +
              ";";
          }

          conn.attributeValue = value;
        } else {
          if (conn.attributeKey === "file_storage_location") {
            conn.attributeValue = values.file_storage_location;
          } else {
            conn.attributeValue = conn.attributeValue ?? "";
          }
        }
      }
      //
      for (let i = 0; i < company.dbConnections.length; i++)
        makeSuperAPICall
          .post("PostTenantConfigUpdate", company.dbConnections[i])
          .then((res) => {
            console.log(res);
            setFormSubmittedMsg("DB Connections successfully updated");
            tagRevalidate("registeredCompanies");
          })
          .catch((err) => {
            console.log(err);
            showAlert("Something went wrong saving the storages!");
          });
      // const data = [...tableData];
      // data.splice(index, 1, company);
      // setTableData(data);
      setOpenModal(false);
      for (let i = 0; i < Object.keys(inputRefs).length - 1; i++) {
        (inputRefs as any)[i].hideText();
      }
    },
  });
  const formikIndex = useRef<number>(-1);
  console.log("receivedData", receivedData);
  useEffect(() => {
    if (modalIndex != -1)
      setInitialModalValues(() =>
        tableData
          .find((company) => company.id == modalIndex)
          .dbConnections?.reduce(
            (acc1: any, conn: any) => {
              console.log("conn", conn);
              // if (conn.attributeKey == "file_storage_location")
              //   return conn.attributeValue;
              let acc: any = {};
              if (conn.attributeValue.includes(";")) {
                acc = conn.attributeValue
                  .split(";")
                  .reduce((acc: any, attr_val: any) => {
                    const name = attr_val.split("=")[0].replace(/\s/g, "");
                    const value = attr_val.split("=")[1];
                    acc[name] = value;
                    return acc;
                  }, {});
                acc1.connectionString.push(acc);
              }
              if (!conn.attributeValue.includes(";")) {
                // return (acc[conn.attributeKey] = conn.attributeValue);
                acc1[conn.attributeKey] = conn.attributeValue;
              }
              return acc1;
            },
            { connectionString: [], file_storage_location: "" }
          )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIndex]);

  console.log("modalFormik", modalFormik);


  useEffect(() => {
    makeSuperAPICall
      .get("GetCompanyRegistrationDropDown/country")
      .then((res) => {
        const countries = res.data.data.country.map((country: any, index: number) => ({
          value: country.id,
          label: country.countryName,
          key: index,
        }));

        setCountriesList(countries);
      })
      .catch((err) => console.log(err));

    makeSuperAPICall
      .get("GetPackageDropdown")
      .then((res) => {
        if (res?.data?.status === "success") {
          const packages = res.data.data.map((pkg: any, index: number) => ({
            value: pkg.id,
            label: pkg.packageName,
            code: pkg.code,
            key: index,
          }));

          setPackageList(packages);
        }
      });
  }, []);

  function handleCountryChange(value: number, option: any) {
    formik.setFieldValue("countryId", value);
    formik.setFieldValue("country", option.label);
    formik.setFieldValue("state", null);
    formik.setFieldValue("stateId", null);
    formik.setFieldValue("city", null);
    formik.setFieldValue("cityId", null);
  }

  function handleStateChange(value: number, option: any) {
    formik.setFieldValue("stateId", value);
    formik.setFieldValue("state", option.label);
    formik.setFieldValue("city", null);
    formik.setFieldValue("cityId", null);
  }

  function handleCityChange(value: number, option: any) {
    formik.setFieldValue("cityId", value);
    formik.setFieldValue("city", option.label);
  }
  useEffect(() => {
    if (formik.values.countryId) {
      loadStates(formik.values.countryId);
    }
  }, [formik.values.countryId]);

  useEffect(() => {
    if (formik.values.stateId) {
      loadCities(formik.values.stateId);
    }
  }, [formik.values.stateId]);

  // function handleOpenModal(id: number) {
  //   setOpenModal(true);
  //   setModalIndex(id);
  // }

  async function handleOpenModal(id: number) {
    setModalIndex(id);
    setOpenModal(true);

    const existing = tableData.find((t) => t.id === id);

    if (existing?.dbConnections?.some((c: any) => c.database)) {
      return;
    }

    const storageData = await fetchStorageDetails(id);

    setTableData((prev) =>
      prev.map((tenant) =>
        tenant.id === id
          ? {
            ...tenant,
            dbConnections: tenant.dbConnections.map((conn: any) => {
              const match = storageData.find(
                (s: any) => s.id === conn.id
              );

              return match
                ? {
                  ...conn,
                  database: match.database ?? match.Database,
                  totalTenants: match.totalTenants ?? match.TotalTenants,
                  storageUsed: match.storageUsed ?? match.StorageUsed,
                  storageUnit: match.storageUnit ?? match.StorageUnit,
                }
                : conn;
            }),
          }
          : tenant
      )
    );
  }

  const modalTableColumns = ModalTableColumns.map((col) => {

    // if (col.key == "totalTenants")
    //   return {
    //     ...col,
    //     render: (value: any, record: any) =>
    //       record.attributeKey === "file_storage_location"
    //         ? "-"
    //         : value,
    //   };

    // if (col.key == "storageUsed")
    //   return {
    //     ...col,
    //     render: (value: any, record: any) =>
    //       record.attributeKey === "file_storage_location"
    //         ? "-"
    //         : `${value ?? 0} MB`,
    //   };

    if (col.key == "totalTenants")
      return {
        ...col,
        render: (value: any) => value ?? 0,
      };

    if (col.key == "storageUsed")
      return {
        ...col,
        render: (_: any, record: any) =>
          `${record.storageUsed ?? 0} ${record.storageUnit ?? "MB"}`,
      };

    if (col.key == "attributeKey")
      return {
        ...col,
        render: (text: any, record: any) => dbTypes[text],
      };
    if (col.key == "isActive")
      return {
        ...col,
        render: (checked: boolean, record: any, index: number) => (
          <ExtinctSwitch
            size="small"
            checked={checked}
            onChange={(checked) => handleModalExtinct(checked, index)}
          />
        ),
      };
    // <TextArea
    //   defaultValue={text}
    //   onChange={() => null}
    //   autoSize
    // />
    else if (col.key == "attributeValue")
      return {
        ...col,
        title: (
          <Flex gap={16}>
            <p style={{ width: "100%" }}>Server</p>
            <p style={{ width: "100%" }}>Database</p>
            <p style={{ width: "100%" }}>Port</p>
            <p style={{ width: "100%" }}>User Id</p>
            <p style={{ width: "100%" }}>Password</p>
          </Flex>
        ),
        render: (attr_value: string, record: any, index: number) => (
          <ModalFields
            attr_value={attr_value}
            formik={modalFormik}
            attributeKey={record.attributeKey}
            rowIndex={index}
            connIndex={record.seqno}
            refs={inputRefs}
          />
        ),
      };

    return col;
  });

  function handleExtinct(index: number, checked: boolean) {
    const company = tableData[index];
    if (!company) return;

    const updatedCompany = {
      ...company,
      isActive: checked,
    };

    makeSuperAPICall
      .post("PostTenantUpdate", updatedCompany)
      .then(() => {
        setAllData((prev) =>
          prev.map((item) =>
            item.id === updatedCompany.id ? updatedCompany : item
          )
        );

        setTableData((prev) =>
          prev.map((item, i) =>
            i === index ? updatedCompany : item
          )
        );
      })
      .catch((err) => {
        console.log(err);
        tagRevalidate("registeredCompanies");
      });
  }


  function handleBranchExtinct(
    checked: boolean,
    branchIndex: number,
    companyId: number
  ) {
    const data = [...tableData];

    const companyIndex = data.findIndex((c) => c.id === companyId);
    if (companyIndex === -1) return;

    data[companyIndex].branches[branchIndex].isActive = checked;

    setTableData([...data]);
  }

  function handleModalExtinct(checked: boolean, index: number) {
    const data = [...tableData];
    const i = data.findIndex((company) => company.id == modalIndex);
    data[i].dbConnections[index].isActive = checked;
    makeSuperAPICall
      .post("PostTenantConfigUpdate", data[i].dbConnections)
      .then((res) => {
        console.log(res);
        tagRevalidate("registeredCompanies");
      })
      .catch((err) => console.log(err));
    // setTableData([...data]);
  }

  const handleOk = (val: { mode: string; reOrderedArray: any[] }) => {
    if (val.mode === "vertical") {
      setGridView(false);
    } else {
      setGridView(true);
    }
    setColumns(val.reOrderedArray);
  };

  function onSaveFilter() { }

  function handleResetFilter() { }

  // Function to handle scroll event
  const handleScroll = (e: any) => {
    console.log("scrolling");
    const scrollTop = e?.target.scrollTop;
    const scrollHeight = e?.target.scrollHeight;
    const clientHeight = e?.target.clientHeight;
    // Check if the user has scrolled to the bottom
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      clientHeight != scrollHeight
    ) {
      // handlePaginationLoad();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setFormSubmittedMsg("");
    }, 2500);
  }, [formSubmittedMsg]);

  useEffect(() => {
    const cols = TenantTableColumns.map((col) => {
      if (col.dataIndex == "customer")
        return {
          ...col,
          render: (text: string, record: any) => (
            <ButtonComponent
              type="link"
              onClickEvent={() => {
                setOpenTenantDrawer(true);
                setInitialValues(record);
              }}
            >
              {text}
            </ButtonComponent>
          ),
        };
      else if (col.key == "dbConnections")
        return {
          ...col,
          render: (value: any, record: any, index: number) => (
            <ButtonComponent
              type="link"
              onClickEvent={() => handleOpenModal(record.id)}
            >
              Storage
            </ButtonComponent>
          ),
        };
      else if (col.key == "exceptions")
        return {
          ...col,
          render: (value: any, record: any, index: number) => (
            <ButtonComponent
              type="link"
              // onClickEvent={() => handleOpenModal(record.id)}
              onClickEvent={() =>
                router.push("/super/dashboard/tenant/exception")
              }
            >
              Exception
            </ButtonComponent>
          ),
        };
      else if (col.key == "isActive")
        return {
          ...col,
          render: (value: any, record: any, index: number) => (
            <ExtinctSwitch
              size="small"
              checked={!value}
              onChange={() => handleExtinct(index, !value)}
            />
          ),
        };
      return col;
    });
    setColumns(cols);
  }, [TenantTableColumns]);

  function loadStates(countryId: number) {
    makeSuperAPICall
      .get(`GetCompanyRegistrationDropDown/state/${countryId}`)
      .then((res) => {
        const states = res.data.data.state.map((state: any, index: number) => ({
          value: state.id,
          label: state.stateName,
          key: index,
        }));

        setStateList(states);
      })
      .catch((err) => console.log(err));
  }

  function loadCities(stateId: number) {
    makeSuperAPICall
      .get(`GetCompanyRegistrationDropDown/city/${stateId}`)
      .then((res) => {
        const cities = res.data.data.city.map((city: any, index: number) => ({
          value: city.id,
          label: city.cityName,
          key: index,
        }));

        setCityList(cities);
      })
      .catch((err) => console.log(err));
  }

  //Column chooser
  const isFieldVisible = (label: string) =>
    columnChooserData.some(
      (col) => col.label === label && col.isVisible
    );

  const isFieldMandatory = (label: string) =>
    columnChooserData.find((col) => col.label === label)?.isMandatory ?? false;

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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          roleId: userDetails.userInfo.roleId,
          pIndex: p_index,
          cIndex: c_index,
          gcIndex: gc_index,
        };

        const response = await makeSuperAPICall.post(
          "GetWebFieldConfigurationSA",
          payload
        );

        if (response?.data?.data) {
          const fields = response.data.data[0].group.flatMap((group: any) =>
            group.fields.map((field: any) => ({
              id: field.columnId,
              label: field.field,
              isVisible: field.isVisible,
              isMandatory: field.isMandatory,
            }))
          );

          const mappedFields = fields.map((field: any) => {
            let value = "";

            switch (field.label) {
              case "Country":
                value = "country";
                break;
              case "State":
                value = "state";
                break;
              case "City":
                value = "city";
                break;
              case "Package":
                value = "packageId";
                break;
              case "Expiry Date":
                value = "expiryDate";
                break;
              case "Renewal Date":
                value = "renewalDate";
                break;
              case "Mode":
                value = "mode";
                break;
              case "No of Users":
                value = "noOfUsers";
                break;
              case "No of Sites":
                value = "noOfSites";
                break;
              case "Account Manager":
                value = "accountManager";
                break;
              case "SPOC":
                value = "spoc";
                break;
              default:
                value = field.label.toLowerCase().replace(/\s+/g, "_");
            }

            return { ...field, value };
          });

          setColumnChooserData(mappedFields);
        }
      } catch (error) {
        console.error("Tenant column chooser error", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchTableColumns = async () => {
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

        if (response?.data?.data) {
          const fields = response.data.data[0].group.flatMap((group: any) =>
            group.fields
              .filter((field: any) => field.isRequired)
              .map((field: any) => ({
                id: field.columnId,
                title: field.columnName,
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
        console.error("Tenant table column config error", error);
      }
    };

    fetchTableColumns();
  }, []);


  useEffect(() => {
    if (!tablecolumnChooserData?.length) return;

    const finalColumns: ColDef[] = tablecolumnChooserData.map((chooser: any) => {
      const matchedField = columnDefs.find(
        (col) =>
          typeof col.headerName === "string" &&
          col.headerName.replace(/\./g, "").trim().toLowerCase() ===
          chooser.title.trim().toLowerCase()
      );

      if (matchedField) {
        return {
          ...matchedField,
          hide: !chooser.isVisible,
          pinned: chooser.fixed,
        };
      }

      // return {
      //   headerName: chooser.title,
      //   field: chooser.title
      //     .replace(/\s+/g, "")
      //     .replace(/^[A-Z]/, (c: string) => c.toLowerCase()),
      //   hide: !chooser.isVisible,
      //   filter: "agSetColumnFilter",
      //   flex: 1,
      // };
      const fieldMap: any = {
        "Customer": "customer",
        "Domain": "domain",
        "Industry": "industry",
        "Package Id": "packageId",
        "Package Code": "packageCode",
        "Mode": "mode",
        "DB Connections": "dbConnections",
        "Start Date": "startDate",
        "Expiry Date": "expiryDate",
        "Renewal Date": "renewalDate",
        "Payment Status": "paymentStatus",
        "Last Paid Date": "lastPaidDate",
        "Mode of Payment": "modeOfPayment",
        "Account Manager": "accountManager",
        "SPOC": "spoc",
        "No of Users": "noOfUsers",
        "No of Sites": "noOfSites",
        "Extinct": "isActive"
      };

      return {
        headerName: chooser.title,
        field: fieldMap[chooser.title],
        hide: !chooser.isVisible,
        filter: "agSetColumnFilter",
        flex: 1,
        minWidth: 150
      };
    });

    setColumnList([
      {
        headerName: "",
        width: 60,
        cellRenderer: "agGroupCellRenderer",
        // pinned: "left"
      },
      ...finalColumns
    ]);
  }, [tablecolumnChooserData]);


  console.log("formik.values.packageId", formik.values);
  console.log("packageList", packageList);

  const detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        {
          headerName: "Branch Name",
          field: "branchName",
          flex: 1.2,
          cellRenderer: (params: any) => (
            <Flex justify="space-between" align="center">
              {params.value}
              {params.data.headOffice ? <Tag>Head Office</Tag> : ""}
            </Flex>
          ),
        },

        {
          headerName: "Alias Name",
          field: "aliasName",
          flex: 1,
        },

        {
          headerName: "Email",
          field: "email",
          flex: 1.5,
        },

        {
          headerName: "Contact Person",
          field: "contactPerson",
          flex: 1,
        },

        {
          headerName: "Phone Number",
          field: "primaryNumber",
          flex: 1,
          cellRenderer: (params: any) =>
            "+" + params.data.mobileCode + " " + params.value,
        },

        {
          headerName: "City",
          field: "city",
          flex: 1,
        },

        {
          headerName: "Financial Year",
          field: "financialYear",
          flex: 1.3,
          cellRenderer: (params: any) =>
            params.data.financialStart?.split("T")[0] +
            " - " +
            params.data.financialEnd?.split("T")[0],
        },

        {
          headerName: "Extinct",
          field: "isActive",
          flex: 0.8,
          cellRenderer: (params: any) => {
            const branchIndex = params.node.rowIndex;
            const companyId = params.data.companyId;

            return (
              <ExtinctSwitch
                size="small"
                // checked={params.value}
                // onChange={(checked: boolean) =>
                //   handleBranchExtinct(checked, branchIndex, companyId)
                // }
                checked={!params.value}
                onChange={(checked: boolean) =>
                  handleBranchExtinct(!checked, branchIndex, companyId)
                }
              />
            );
          },
        },
      ],
    },

    getDetailRowData: (params: any) => {
      const branches =
        params.data.branches?.map((b: any) => ({
          ...b,
          companyId: params.data.id,
        })) || [];

      params.successCallback(branches);
    },
  };

  const handleTenantDrawerClose = () => {
    if (formDirty) {
      setIsConfirmModal(true);
    } else {
      setOpenTenantDrawer(false);
    }
  };

  useEffect(() => {
    if (!allData.length) return;

    const enrichTenants = async () => {
      const updated = await Promise.all(
        allData.map(async (t) => {
          const result = await fetchBranches(t.id);

          return {
            ...t,
            hasBranches: result.hasBranches,
            branches: result.branches,
          };
        })
      );

      setAllData(updated);
      setTableData(updated);
    };

    enrichTenants();
  }, [receivedData]);


  const renderFieldByValue = (field: any) => {
    switch (field.value) {

      case "country":
        return (
          <SelectComponent
            showSearch
            optionFilterProp="label"
            label="Country"
            isrequired={isFieldMandatory("Country")}
            options={countriesList}
            value={formik.values.countryId}
            onChange={(value, option) => {
              handleCountryChange(value, option);
              setFormDirty(true);
            }}
          />
        );

      case "state":
        return (
          <SelectComponent
            showSearch
            optionFilterProp="label"
            label="State"
            isrequired={isFieldMandatory("State")}
            options={stateList}
            value={formik.values.stateId}
            onChange={(value, option) => {
              handleStateChange(value, option);
              setFormDirty(true);
            }}
          />
        );

      case "city":
        return (
          <SelectComponent
            showSearch
            optionFilterProp="label"
            label="City"
            isrequired={isFieldMandatory("City")}
            options={cityList}
            value={formik.values.cityId}
            onChange={(value, option) => {
              handleCityChange(value, option);
              setFormDirty(true);
            }}
          />
        );

      case "packageId":
        return (
          <SelectComponent
            label="Package"
            options={packageList}
            value={formik.values.packageId}
            // onChange={(value) => {
            //   formik.setFieldValue("packageId", value);
            //   setFormDirty(true);
            // }}
            onChange={(value: any) => {

              const selectedPackage = packageList.find(
                (pkg: any) => Number(pkg.value) === Number(value)
              );

              formik.setFieldValue("packageId", Number(value));
              formik.setFieldValue("packageCode", selectedPackage?.code || "");

              setFormDirty(true);
            }}
          />
        );

      case "expiryDate":
        return (
          <DatePickerComponent
            label="Expiry Date"
            isrequired={isFieldMandatory("Expiry Date")}
            value={
              formik.values.expiryDate
                ? dayjs(formik.values.expiryDate)
                : null
            }
            onChange={(value) => {
              formik.setFieldValue(
                "expiryDate",
                value ? value.format("YYYY-MM-DD") : null
              );
              setFormDirty(true);
            }}
          />
        );

      case "renewalDate":
        return (
          <DatePickerComponent
            label="Renewal Date"
            value={
              formik.values.renewalDate
                ? dayjs(formik.values.renewalDate)
                : null
            }
            onChange={(value) => {
              formik.setFieldValue(
                "renewalDate",
                value ? value.format("YYYY-MM-DD") : null
              );
              setFormDirty(true);
            }}
          />
        );

      case "mode":
        return (
          <SelectComponent
            label="Mode"
            options={modeOptions}
            value={formik.values.mode}
            onChange={(value) => {
              formik.setFieldValue("mode", value);
              setFormDirty(true);
            }}
          />
        );

      case "noOfUsers":
        return (
          <InputComponent
            label="No of Users"
            type="text"
            value={formik.values.noOfUsers}
            onChangeEvent={(e) => {
              formik.setFieldValue("noOfUsers", e.target.value);
              setFormDirty(true);
            }}
          />
        );

      case "noOfSites":
        return (
          <InputComponent
            label="No of Sites"
            type="text"
            value={formik.values.noOfSites}
            onChangeEvent={(e) => {
              formik.setFieldValue("noOfSites", e.target.value);
              setFormDirty(true);
            }}
          />
        );

      case "accountManager":
        return (
          <InputComponent
            label="Account Manager"
            type="text"
            value={formik.values.accountManager}
            onChangeEvent={(e) => {
              formik.setFieldValue("accountManager", e.target.value);
              setFormDirty(true);
            }}
          />
        );

      case "spoc":
        return (
          <InputComponent
            label="SPOC"
            type="text"
            value={formik.values.spoc}
            onChangeEvent={(e) => {
              formik.setFieldValue("spoc", e.target.value);
              setFormDirty(true);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ConfirmModal
        openModal={isConfirmModal}
        onClose={() => {
          setIsConfirmModal(false);
          formik.resetForm();
          setFormDirty(false);
          setOpenTenantDrawer(false);
        }}
        onCancel={() => setIsConfirmModal(false)}
      />

      <div className={styles.container}>
        <div className={styles.header}>
          <Header
            title={"Tenants"}
            description={"Complete list of all tenants"}
            buttonLable="Add Tenant"
            onClick={() => {
              setPreferredAction("register");
              router.push("/");
            }}
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
                value={searchInput}
                // onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) => {
                //   setTableData(
                //     searchFunctionality(event.target.value, receivedData)?.map(
                //       (data) => {
                //         return { ...data, key: data.id };
                //       }
                //     )
                //   );
                //   setSearchInput(event.target.value);
                // }}
                onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;

                  const filtered = searchFunctionality(value, allData);

                  setTableData(filtered);
                  setSearchInput(value);
                }}
                type="search"
                placeholder={"Search Company"}
                size="small"
                addonAfter={<SearchOutlined style={{ color: "#D9D9D9" }} />}
                className="overwrite-inputBox"
              />
            </div>
            <Flex>
              <ButtonComponent
                onClickEvent={() => setOpenDrawer(true)}
                className={styles.viewButton}
              >
                <FilterOutlined className={styles.filterIcons} />
              </ButtonComponent>
              <DrawerComponent
                open={openDrawer}
                onClose={handleTenantDrawerClose}
                closeIcon={false}
                buttonLabel="Save"
                title={<h3>Filter</h3>}
                submit={onSaveFilter}
                reset={handleResetFilter}
              >
                <div></div>
              </DrawerComponent>
              <ModalComponent
                showModal={openModal}
                setShowModal={setOpenModal}
                onCloseModalCustom={() => {
                  setOpenModal(false);
                  console.log("inputRefs", inputRefs);
                  for (let i = 0; i < Object.keys(inputRefs).length - 1; i++) {
                    (inputRefs as any)[i]?.hideText();
                  }
                }}
                width="1100px"
                footer={
                  <Flex gap={16} justify="end">
                    <ButtonComponent
                      type="text"
                      onClickEvent={() => {
                        modalFormik.resetForm();
                        for (
                          let i = 0;
                          i < Object.keys(inputRefs).length - 1;
                          i++
                        ) {
                          (inputRefs as any)[i].hideText();
                        }
                      }}
                    >
                      Reset
                    </ButtonComponent>
                    <ButtonComponent
                      type="primary"
                      disabled={
                        tableData?.find((company) => company.id == modalIndex)
                          ?.dbConnections.length == 0
                      }
                      onClickEvent={() => modalFormik.handleSubmit()}
                    >
                      Submit
                    </ButtonComponent>
                  </Flex>
                }
              >
                <TableComponent
                  loading={storageLoading}
                  dataSource={
                    tableData?.find((company) => company.id == modalIndex)
                      ?.dbConnections
                  }
                  columns={modalTableColumns}
                  pagination={false}
                />
              </ModalComponent>

              <DrawerComponent
                rootClass="ow-content-wrapper"
                open={openTenantDrawer}
                // onClose={() => setOpenTenantDrawer(false)}
                onClose={handleTenantDrawerClose}
                closeIcon={false}
                buttonLabel="Save"
                // title={<h3>Edit Tenant</h3>}
                // title="Edit Tenant"
                header1="Edit Tenant"
                header2="Edit Tenant and Save"
                // title={
                //   <div className={styles.drawerHeader}>
                //     <p className={styles.drawerTitle}>Edit Tenant</p>
                //     <p className={styles.drawerDescription}>Edit Tenant and Save</p>
                //   </div>
                // }
                submit={() => formik.handleSubmit()}
                reset={() => formik.resetForm()}
              >
                <div className={styles.drawerBodyScroll}>
                  {/* <Flex vertical gap={16}> */}
                  {columnChooserData
                    .filter((field) => field.isVisible)
                    .map((field) => (
                      <div key={field.id} className={styles.formField}>
                        {renderFieldByValue(field)}
                      </div>
                    ))}
                  {/* </Flex> */}
                </div>
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
            </Flex>
          </Flex>
        </div>
        <div
          className={`${styles.scrollSection} custom-scroll`}
        // onScroll={handleScroll}
        >
          {/* <TableComponent
          size="small"
          className="ow-custom-table-dropdown"
          rowClassName={(record, index) =>
            expandedRowKeys[0] === record.id ? styles.rowBold : ""
          }
          dataSource={tableData}
          expandable={{
            expandedRowRender: expandedRowRender,
            // rowExpandable: (record) => record.branches?.length > 0,             //For Tree Structure
            rowExpandable: () => true,
            // defaultExpandedRowKeys: [1]
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded: boolean, record: any) => {
              if (expanded) {
                setExpandedRowKeys([record.id]);
              } else {
                setExpandedRowKeys([]);
              }
            },
            // expandIconColumnIndex: 0, // Ensure the expander is in the first column
            expandIconColumnIndex: 0,
          }}
          rootClassName={tableData?.length === 0 ? " ow-emptyTableLayout " : ""}
          // columns={columns}
           columns={columns.filter(col => col.isVisible)}
          pagination={false}
        /> */}

          <div
            className="ag-theme-quartz procurement-aggrid"
            style={{ width: "100%", height: "100%" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={tableData}
              // columnDefs={columnDefs}
              columnDefs={columnList.length ? columnList : columnDefs}
              masterDetail={true}
              detailCellRendererParams={detailCellRendererParams}
              getRowId={(params) => params.data.id}
              keepDetailRows={true}
              // isRowMaster={(dataItem: any) =>
              //   dataItem?.branches && dataItem.branches.length > 0
              // }
              isRowMaster={(dataItem: any) => dataItem?.hasBranches === true}
              // isRowMaster={() => true}
              onRowGroupOpened={async (params) => {
                if (!params.node.expanded) return;

                const rowData = params.data;

                // already fetched → skip
                if (rowData.branches) return;

                const result = await fetchBranches(rowData.id);

                setTableData((prev) =>
                  prev.map((item) =>
                    item.id === rowData.id
                      ? {
                        ...item,
                        hasBranches: result.hasBranches,
                        branches: result.branches,
                      }
                      : item
                  )
                );
              }}
            // onRowGroupOpened={async (params) => {
            //   if (!params.node.expanded) return;

            //   const rowData = params.data;

            //   // already fetched → skip
            //   if (rowData.branches) return;

            //   const result = await fetchBranches(rowData.id);

            //   setTableData((prev) =>
            //     prev.map((item) =>
            //       item.id === rowData.id
            //         ? {
            //           ...item,
            //           hasBranches: result.hasBranches,
            //           branches: result.branches,
            //         }
            //         : item
            //     )
            //   );

            //   if (!result.hasBranches) {
            //     setTimeout(() => {
            //       params.node.setExpanded(false);
            //     }, 100);
            //   }
            // }}
            />
          </div>

        </div>
        {formSubmittedMsg && (
          <Toast type="success" message={formSubmittedMsg} delay={2500} />
        )}
      </div>
    </>
  );
}

function ModalFields({
  attr_value,
  formik,
  attributeKey,
  rowIndex,
  connIndex,
  refs,
}: {
  attr_value: string;
  formik: any;
  attributeKey: string;
  rowIndex: number;
  connIndex: any;
  refs: any;
}) {
  console.log(
    "attr_value",
    attr_value,
    rowIndex,
    formik.values.connectionString,
    "formikIndex.current",
    connIndex
  );
  // if (attr_value.split(";").length > 0)
  //   formikIndex.current = Number(formikIndex.current) + 1;

  // useEffect(() => {
  //   attr_value.split(";").map((key_value, index) => {
  //     const name = key_value.split("=")[0].replace(/\s/g, "");
  //     const value = key_value.split("=")[1];
  //     console.log("key", name, value, {
  //       ...initialValues,
  //       [name]: value,
  //     });
  //     setInitialValues({
  //       ...initialValues,
  //       [name]: value,
  //     });
  //   });
  // }, [attr_value]);

  return (
    <Flex gap={16}>
      {attr_value
        .split(";")
        .filter((value) => value)
        .map((key_value, index) => {
          const name = key_value.split("=")[0].replace(/\s/g, "");
          const value = key_value.split("=")[1];
          // setInitialValues({
          //   ...initialValues,
          //   name: value,
          // });
          if (["Server", "Database", "Port", "UserId"].includes(name))
            return (
              <InputComponent
                key={index}
                type="text"
                // label={key_value.split("=")[0]}
                name={`connectionString[${connIndex}].${name}`}
                value={formik.values.connectionString?.[connIndex]?.[name]}
                onChangeEvent={(e) =>
                  formik.setFieldValue(
                    `connectionString[${connIndex}].${name}`,
                    e.target.value
                  )
                }
                onBlur={(event) => formik.handleBlur(event)}
                errormsg={
                  formik.touched.connectionString?.[connIndex]?.[name] &&
                  formik.errors.connectionString?.[connIndex]?.[name]
                }
              />
            );
          else if (name == "Password")
            return (
              <InputPasswordComponent
                ref={(ele) => (refs[connIndex] = ele)}
                key={index}
                // label={name}
                fullWidth
                name={`connectionString[${connIndex}].${name}`}
                value={formik.values.connectionString?.[connIndex]?.[name]}
                onChange={(e) =>
                  formik.setFieldValue(
                    `connectionString[${connIndex}].${name}`,
                    e.target.value
                  )
                }
                onBlur={(event) => formik.handleBlur(event)}
                errormsg={
                  formik.touched.connectionString?.[connIndex]?.[name] &&
                  formik.errors.connectionString?.[connIndex]?.[name]
                }
              />
            );
          //  else if (attributeKey == "file_storage_location")
          else if (!["Timeout", "CommandTimeout"].includes(name)) {
            console.log("attributeKey", attributeKey, name);
            return (
              <InputComponent
                key={index}
                type="text"
                // label={"File Storage Location"}
                name={attributeKey}
                value={formik.values[attributeKey]}
                onChangeEvent={(e) =>
                  formik.setFieldValue(attributeKey, e.target.value)
                }
                onBlur={(event) => formik.handleBlur(event)}
                errormsg={
                  formik.touched[attributeKey] && formik.errors[attributeKey]
                }
              />
            );
          }
        })}
    </Flex>
  );
}