"use client";
import React, { useState, useContext, useRef, useEffect, createContext } from "react";
import { useTranslation } from "react-i18next";
import { AutoComplete, Divider, Dropdown, Flex, Input, notification } from "antd";
import Image from "next/image";
import styles from "./AppHeader.module.css";
import {
  BellOutlined,
  SettingOutlined,
  CloseOutlined,
  TranslationOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  DownloadOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname, useParams } from "next/navigation";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import CollapseComponent from "../CollapseComponent/CollapseComponent";
import { Languages, Languages1 } from "@/lib/constants/dashboard";
import {
  LoaderContext,
  TabTrackContext,
  TranslationContext,
} from "@/lib/interfaces/Context.interfaces";
import { login, logout } from "@/lib/helpers/apiHandlers/login";
import Cookies from "js-cookie";
import "@/lib/antdOverwrittenCss/global.css";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import MobSideBar from "@/components/MobSideBar/MobSideBar";
import { useUserStore } from "@/store/userInfo/store";
import { CONSTANT } from "@/lib/constants/constant";
import useIsMobile from "@/lib/customHooks/useIsMobile";
import { useTabStore } from "@/store/report/tab/store";
import { useFormStore } from "@/store/formdirty/store";
// import { useReactMediaRecorder } from "react-media-recorder";
// import Webcam from "react-webcam";
// import Draggable from "react-draggable";
import formPaths from "./constants";
import ModalComponent from "../ModalComponent/ModalComponent";
import InputComponent from "../InputComponent/InputComponent";
import TableComponent from "../TableComponent/TableComponent";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import { showAlert } from "@/lib/helpers/alert";
import Toast from "../CustomToast/Toast";
import ConfirmModal from "../ModalComponent/ConfirmModal";
import { useLoginStore } from "@/store/login/store";
import { decrypt, encrypt } from "@/lib/helpers/utilityHelpers";
import SelectComponent from "../SelectComponent/SelectComponent";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "antd";
import InputPasswordComponent from "@/app/_components/signInComponents/InputPasswordComponent";

import dayjs from "dayjs";
import { useProductStore } from "@/store/inventory/product/store";

export interface AppHeaderProps {
  children: React.ReactNode;
  paths?: string[];
  // trackMenu: any;
  // setTrackMenu: Function;
}
interface InvoiceTable {
  formName: string;
  invoiceNo: string;
  id: number;
  status: string;
  invoiceDate: string;
}
// --- Tab close cleanup (module-scope) ---
// const SESSION_FLAG_BY_MENU: Record<string, string> = {
//   "procurement-order": "ORDER_TAB_SESSION",
//   "procurement-receive": "RECEIVE_TAB_SESSION",
//   "procurement-invoice": "INVOICE_TAB_SESSION",
//   "procurement-debitnote": "DEBIT_TAB_SESSION",
//   "procurement-return": "RETURN_TAB_SESSION",
//   "sales-salesorder": "SALESORDER_TAB_SESSION",
//   "sales-salesinvoice": "SALESINVOICE_TAB_SESSION",
//   "sales-deliverychallan": "DELIVERYCHELLAAN_TAB_SESSION",
//   "inventory-stockaudit": "STOCKAUDIT_TAB_SESSION",
//   "inventory-stockadjustment": "STOCKADJUST_TAB_SESSION",
//   "sales-invoice": "SALES_TAB_SESSION",
//   "sales-salesreturn": "SALESRETURN_TAB_SESSION",
//   "sales-creditnote": "CREDITNOTE_TAB_SESSION",
//   "production-designandstyles": "DESIGNPAGE_TAB_SESSION",
//   "inventory-productlist": "PRODUCTLIST_TAB_SESSION",
//   "inventory-category": "CATEGORY_TAB_SESSION"
//   // add more as your screens use their own flag
// };

// async function deleteDexieForMenu(menuKey: string) {
//   const canonicalPrefix = `barcode-products-${menuKey}-`;
//   try {
//     await localDB.state.where("key").startsWith(canonicalPrefix).delete();
//   } catch {
//     const all = await localDB.state.toArray();
//     const keysToDelete: string[] = [];
//     for (const row of all) {
//       const k = row?.key;
//       if (typeof k !== "string") continue;
//       if (k.startsWith(canonicalPrefix) || k.includes(`-${menuKey}-`)) {
//         keysToDelete.push(k);
//       }
//     }
//     if (keysToDelete.length) {
//       await Promise.all(keysToDelete.map(k => localDB.state.delete(k)));
//     }
//   }
// }
// --- end helpers ---

















const Context = createContext(null);

function AppHeader({ children }: AppHeaderProps) {
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useTabStore(); // Zustand store

  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  console.log("pathname", pathname);
  const { slug } = useParams();  //Arun
  const TabContext: any = useContext(TabTrackContext); // to track the selected sub menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [password, setPassword] = useState("");
  // const [VoiceRecord, setVoiceRecord] = useState(false);
  // const { status, startRecording, stopRecording, mediaBlobUrl, error } =
  //   useReactMediaRecorder({ audio: true, screen: true });
  // const [showCameraIcon, setShowCameraIcon] = useState(false);
  const { trackMenu, setTrackMenu } = useContext<any>(TabTrackContext);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(-1);
  const userDetails = useUserStore((state: any) => JSON.parse(state?.user));

  const handleLogoClick = () => {
    setMenuOpen(!menuOpen);
  };
  const { Search } = Input;
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [multipleInvoice, setMultipleInvoice] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [tableData, setTableData] = useState<InvoiceTable[]>();
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [showLoginModal, setShowLoginModal] = useState<any>(
    Cookies.get("allowAccess123") == "true" || false
  );
  const [showToast, setShowToast] = useState<boolean>(false);
  const formDirty: boolean = useLoginStore((state: any) => state.formDirty);
  const setFormDirty: (fact: boolean) => void = useLoginStore(
    (state: any) => state.setFormDirty
  );
  const [openDirtyModal, setOpenDirtyModal] = useState<boolean>(false);
  const [routePath, setRoutePath] = useState<string>("");
  const [isWarningVisible, setisWarningVisible] = useState<boolean>(false);
  const [warningSec, setWarningSec] = useState<number>(30);
  const trackMenuRef = useRef<(HTMLDivElement | null)[]>([]);
  const [message, setMessage] = useState<string>("");
  const expireDate = Cookies.get("expire-date");

  useEffect(() => {
    if (expireDate === "True") {
      const event = new Event(CONSTANT.EXPIREDATE);
      window.dispatchEvent(event);
      Cookies.remove("expire-date");
    }
  })

  // const trackMenuData
  const Loader = useContext(LoaderContext);


  const [api, contextHolder] = notification.useNotification();
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const currentUser = useRef<any>({});

  const showNotification = (type: "private" | "group", channel: "internal" | "whatsapp" | "support", data: any) => {
    console.log("Data123", data, type, currentUser.current.partyId);
    if (type == "group" && data[3] == currentUser.current.partyId)
      return;
    api.info({
      message: type == "group" ? (data[1] + " - " + data[2]) : data[1],
      description: <Context.Consumer>{() => type == "group" ? (data[4] || "Media") : (data[2] || "Media")}</Context.Consumer>,
      placement: "topRight",
    });
    if (Notification.permission == "granted") {
      // new Notification(`New ${type} message from ${type == "group" ? (data[1] + " - " + data[2]) : data[1]}`, {
      //   body: (type == "group" ? (data[4] || "Media") : (data[2] || "Media")),
      //   icon: "/icons/icube logo cropped quality.png"
      // })
      const notification = new Notification(`New ${type} message from ${type == "group" ? (data[1] + " - " + data[2]) : data[1]}`, {
        body: (type == "group" ? (data[4] || "Media") : (data[2] || "Media")),
        icon: "/icons/icube logo cropped quality.png",
        data: {
          // url: `${location.origin}/dm/hello`,
          url: `${location.origin}/dashboard/apps-supportboard`,
        },
      })
      notification.onclick = (event) => {
        Cookies.set("for-notification", JSON.stringify({ userId: data[0], type }))
        console.log("Data123", event, channel);

        event.preventDefault();
        window.focus(); // focus current tab
        // window.location.href = notification.data.url;
        router.push("/dashboard/apps-supportboard");

        notification.close();
      };
    }
  }






  // console.log("userDetails", JSON.parse(Cookies.get("userDetails") ?? "{}"));
  // console.log("userDetails", JSON.parse(Cookies.get("userDetails") ?? "{}"));

  // console.log("Boolean(Cookies.get('allowAccess'))",Boolean(Cookies.get("allowAccess123")));
  const tableColumns: any[] = [
    { title: t("Type"), dataIndex: "formName", key: "formName" },
    {
      title: t("Invoice No."),
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      render: (value: string, record: any) => (
        <ButtonComponent
          type="link"
          onClickEvent={() => {
            setShowModal(false);
            setGlobalSearch("");
            router.push(
              myForm[record.formName][record.type](record.id, record.status)
            );
          }}
        >
          {value}
        </ButtonComponent>
      ),
    },
    { title: t("Invoice Date"), dataIndex: "invoiceDate", key: "invoiceDate" },
  ];

  const myForm: Record<string, any> = formPaths;

 


  useEffect(() => {  //Arun
    if (!pathname) return;

    // expect /dashboard/<menuKey>/...
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "dashboard") return;

    const menuKey = parts[1]; // e.g., "procurement-order"
    if (!menuKey) return;

    // persist full path (including query string)
    const fullPath =
      typeof window !== "undefined"
        ? pathname + window.location.search
        : pathname;

    localStorage.setItem(`lastPath_${menuKey}`, fullPath);
  }, [pathname]);

  // const handleCloseTab = (index: number) => {
  //   setTrackMenu((prevTabs: string[]) => {
  //     const updatedTabs = [...prevTabs];
  //     updatedTabs.splice(index, 1);

  //     // Determine the next tab to activate
  //     if (updatedTabs.length > 0) {
  //       const newActiveTabIndex = index === 0 ? 0 : index - 1;
  //       handleClickTab(updatedTabs[newActiveTabIndex]);
  //     }
  //     if (updatedTabs.includes("Reports-Report")) {
  //       useTabStore.setState({
  //         tabs: [], // Clear Zustand tabs
  //         activeTab: null, // Clear the active tab in Zustand
  //       });
  //     }
  //     return updatedTabs;
  //   });
  // };
  const { isTransactionDirty, setTransactionDirty } = useFormStore();
  const normalizeMenuName = (menuName: string): string => {
    let normalizedName =
      menuName.split(" ").length > 1
        ? menuName.split(" ").join("").toLocaleLowerCase()
        : menuName.toLocaleLowerCase();

    const mappings: Record<string, string> = {
      "admin-site": "admin-sitecreation",
      "inventory-productgroup": "inventory-creategroup",
      "reports-businessinsights": "reports-report",
      "reports-inventoryreport": "reports-report",
      "inventory-requisition": "inventory-request",
      "production-serviceorderhistory": "production-orderhistory",
      "retail-loyaltycardform": "retail-loyaltycard-form",
      "inventory-product": "inventory-productlist",
      "reports-dashboardviewer": "dashboard-viewer",
      "reports-dashboarddesigner": "dashboard-designer",
      "production-maketoorder": "production-orderhistory",
      "inventory-aging": "inventory-agingmaster",
      "finance-ledgers": "finance-generalledger",

      "admin-tax": "admin-taxmaster",
      "inventory-qctemplate": "inventory-qctemplatemaster",
      "admin-currencyexchange": "admin-currencyexchangerate",
      "inventory-creategroup": "inventory-creategroup",
      "knowhow": "userfaq",
      "apps-apps": "notification-apps",
      "admin-printtemplate": "admin-extrareport",
      "apps-chat": "apps-supportboard",
      "apps-chatbot": "apps-supportboard",
      "finance-naration": "finance-narration",
      "procurement-printbarcode": "procurement-printbarcode",
      "admin-bins": "admin-bins",  // Keep it as admin-bins, not admin-bin
      "admin-bin": "admin-bins",
      "apps-feedback": "apps-feedbackform",
      "payroll-attendancemanagement": "payroll-attendance",
      "payroll-loan&advance": "payroll-loanAdvance",
      "payroll-employeegroup": "payroll-empgroup"
    };

    return mappings[normalizedName] || normalizedName;
  };

  const handleClickTab = (
    name: string,
    tab?: { menuName: string; id: string }
  ) => {

    // // Handle the trackMenu logic
    // // Access the isDirty state from Zustand
    // if (isTransactionDirty) {
    //   // Show confirmation if the form is dirty
    //   const confirmation = window.confirm(
    //     "You have unsaved changes. Are you sure you want to leave this page?"
    //   );
    //   if (!confirmation) {
    //     return; // If the user doesn't confirm, do nothing
    //   } else {
    //     setTransactionDirty(false);
    //   }
    // }
    const normalized = normalizeMenuName(name);//Arun
    const remembered = localStorage.getItem(`lastPath_${normalized}`);//Arun
    const targetPath = remembered || `/dashboard/${normalized}`;//Arun
    setRoutePath(targetPath);//Arun
    router.push(targetPath);//Arun  

    var normalizedSubMenuName =
      name.split(" ").length > 1
        ? name.split(" ").join("").toLocaleLowerCase()
        : name.toLocaleLowerCase();

    if (normalizedSubMenuName == "admin-site")
      normalizedSubMenuName = "admin-sitecreation";
    else if (normalizedSubMenuName == "inventory-productgroup")
      normalizedSubMenuName = "inventory-creategroup";
    else if (normalizedSubMenuName == "reports-businessinsights")
      normalizedSubMenuName = "reports-report";
    else if (normalizedSubMenuName == "inventory-product")
      normalizedSubMenuName = "inventory-productlist";
    else if (normalizedSubMenuName == "admin-currencyexchange")
      normalizedSubMenuName = "admin-currencyexchangerate";
    else if (normalizedSubMenuName == "inventory-qctemplate")
      normalizedSubMenuName = "inventory-qctemplatemaster";
    else if (normalizedSubMenuName == "admin-tax")
      normalizedSubMenuName = "admin-taxmaster";
    else if (normalizedSubMenuName == "inventory-aging")
      normalizedSubMenuName = "inventory-agingmaster";
    else if (normalizedSubMenuName == "inventory-requisition")
      normalizedSubMenuName = "inventory-request";
    else if (normalizedSubMenuName == "production-maketoorder")
      normalizedSubMenuName = "production-orderhistory";
    else if (normalizedSubMenuName == "reports-dashboarddesigner")
      normalizedSubMenuName = "dashboard-designer";
    else if (normalizedSubMenuName == "reports-dashboardviewer")
      normalizedSubMenuName = "dashboard-viewer";
    else if (normalizedSubMenuName == "apps-apps")
      normalizedSubMenuName = "notification-apps";
    else if (normalizedSubMenuName == "finance-ledgers")
      normalizedSubMenuName = "finance-generalledger";
    else if (normalizedSubMenuName == "admin-printtemplate")
      normalizedSubMenuName = "admin-extrareport";
    else if (normalizedSubMenuName == "knowhow")
      normalizedSubMenuName = "userfaq";
    else if (normalizedSubMenuName == "apps-chat")
      normalizedSubMenuName = "apps-supportboard";
    else if (normalizedSubMenuName == "apps-feedback")
      normalizedSubMenuName = "apps-feedbackform"
    else if (normalizedSubMenuName == "payroll-attendancemanagement")
      normalizedSubMenuName = "payroll-attendance";
    else if (normalizedSubMenuName == "payroll-loan&advance")
      normalizedSubMenuName = "payroll-loanAdvance";
    else if (normalizedSubMenuName == "payroll-employeegroup")
      normalizedSubMenuName = "payroll-empgroup";

    const path = `/dashboard/${normalizedSubMenuName}`;

    setRoutePath(path);

    // if (formDirty || isTransactionDirty) {
    //   setOpenDirtyModal(true);
    // } else {
    //   router.push(path);
    //   setFormDirty(false);
    // }
  };
  const handleClickReportTab = (tab: { menuName: string; id: string }) => {
    // Check if the tab already exists in the list
    const existingTab = tabs.find((t: any) => t.id === tab.id);
    if (isTransactionDirty) {
      // Show confirmation if the form is dirty
      const confirmation = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );
      if (!confirmation) {
        return; // If the user doesn't confirm, do nothing
      } else {
        setTransactionDirty(false);
      }
    }
    if (existingTab) {
      // If the tab exists, set it as active
      setActiveTab(existingTab);
    } else {
      // If the tab doesn't exist, add it and set it as active
      addTab(tab);
      setActiveTab(tab);
    }

    // Navigate to the correct route using the `id` of the tab
    router.push(`/dashboard/reports-report/${tab.id}`);
  };
  useEffect(() => {
    // On component mount, check for any stored tabs in cookies
    const storedTabs = Cookies.get("openTabs");

    if (storedTabs) {
      try {
        const parsedTabs = JSON.parse(storedTabs);
        // Add each stored tab to Zustand state
        parsedTabs.forEach((tab: any) => addTab(tab));
      } catch (error) {
        console.error("Error parsing stored tabs from cookies:", error);
      }
    }
  }, [addTab]);
  // const handlePlayClick = () => {
  //   startRecording();
  //   setShowCameraIcon(true);
  // };

  // const handleStopClick = () => {
  //   stopRecording();
  //   setShowCameraIcon(false);
  // };

  const scrollRef = useRef<any>(null);



  // const handleCloseReportTab = (index: number, menuName: string, id: any) => {
  //   const getLocalStorageKey = (id: string, key: string) => `${id}_${key}`;

  //   // Clear local storage for the closed tab
  //   localStorage.removeItem(getLocalStorageKey(id, "fromDate"));
  //   localStorage.removeItem(getLocalStorageKey(id, "toDate"));
  //   localStorage.removeItem(getLocalStorageKey(id, "conditions"));
  //   localStorage.removeItem(getLocalStorageKey(id, "appearanceSettings"));
  //   localStorage.removeItem(`pivotGridState_${id}`); // Remove the pivotGridState for the closed tab

  //   // Add other keys if there are more stored items
  //   // Remove the tab from Zustand store
  //   removeTab(menuName);

  //   const remainingTabs = tabs.filter((tab) => tab.menuName !== menuName); // Get remaining tabs

  //   if (remainingTabs.length > 0) {
  //     // If there are remaining tabs, activate the next appropriate tab
  //     const newActiveTabIndex = index === 0 ? 0 : index - 1; // Ensure valid index
  //     const nextTab = remainingTabs[newActiveTabIndex]; // Get the next tab to activate
  //     setActiveTab(nextTab);
  //     router.push(`/dashboard/reports-report/${nextTab.id}`);
  //   } else {
  //     // If no tabs are left, clear the active tab
  //     setActiveTab(null);
  //     router.push("/dashboard/reports-report"); // Navigate to a default route or dashboard if no tabs remain
  //   }
  // };


  useEffect(() => {  //Arun
    if (!pathname) return;

    // expect /dashboard/<menuKey>/...
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "dashboard") return;

    const menuKey = parts[1]; // e.g., "procurement-order"
    if (!menuKey) return;

    // persist full path (including query string)
    const fullPath =
      typeof window !== "undefined"
        ? pathname + window.location.search
        : pathname;

    localStorage.setItem(`lastPath_${menuKey}`, fullPath);
  }, [pathname]);    //Arun
  window.addEventListener(CONSTANT.EXPIREDATE, (event) => {
    console.log("window::event", event);
    console.log("window::event", event?.type);
    console.log("innnn");
    setMessage(
      "This User is currently signed in on another device. Please enter your password to sign out from the other device and continue here."
    );

    setShowLoginModal(true);
    Cookies.remove("expire-date");
  });

  useEffect(() => {
    const invoices = multipleInvoice?.reduce((acc: any[], privilige: any) => {
      const invoiceDetails = privilige.invoiceDetails.map((invoice: any) => ({
        formName: invoice.menuName,
        type: invoice.type,
        invoiceNo: invoice.no,
        id: invoice.id,
        status: invoice.status,
        invoiceDate: invoice.date.split("T")[0],
      }));
      return acc.concat(invoiceDetails);
    }, []);

    setTableData(invoices);
  }, [multipleInvoice]);
  const lastSegment = pathname?.split("/").filter(Boolean).pop();
  console.log("lastSegment", lastSegment);

  // login form function starts
  // function getRenewedToken() {
  //   makeApiCall
  //     .post("RefreshToken", {
  //       emailId: JSON.parse(Cookies.get("userDetails") || "").email,
  //       refreshToken: Cookies.get("refreshToken"),
  //     })
  //     .then((res) => {
  //       const expiryDate = new Date(new Date().getTime() + 10 * 1000);
  //       Cookies.set("token1", res.data.accessToken, {
  //         expires: expiryDate,
  //       });
  //       Cookies.set("token", res.data.accessToken);
  //       Cookies.set("refreshToken", res.data.refreshtoken);
  //       setisWarningVisible(false);
  //       setShowLoginModal(false);
  //       Cookies.set("allowAccess123", "false");
  //       setShowToast(true);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       showAlert("Something went wrong re-signing in");
  //     });
  // }

  

  useEffect(() => {
    setTimeout(() => setShowToast(false), 3000);
  }, [showToast]);

  let idleTime = useRef<number>(0);




  


  useEffect(() => {
    if (trackMenuRef.current)
      trackMenuRef.current[currentTabIndex]?.scrollIntoView();
    console.log("currentTabIndex", currentTabIndex);
  }, [currentTabIndex]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const [ltr, setLtr] = useState<any>("en");
  const lang = useContext(TranslationContext);

  //Lang Translation
  useEffect(() => {
    if (lang?.selectedLang) {
      setLtr(lang?.selectedLang);
    } else {
      const fromLocal = localStorage.getItem("language");
      setLtr(fromLocal);
    }
  }, [lang?.selectedLang]);


  return (
    <Context.Provider value={null}>
      {contextHolder}
      <div className={styles.container}>



        <div className={styles.pageRenderContainer}>
          {children}
        </div>

      </div>
    </Context.Provider >
  );
}

export default AppHeader;
