"use client";
import React, { useState, useContext, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AutoComplete, Dropdown, Flex, Input } from "antd";
import Image from "next/image";
import styles from "./SuperAppHeader.module.css";
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
  UserOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
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
import SideBar from "../SideBar/SideBar";
import { useUserStore } from "@/store/userInfo/store";
import { CONSTANT, ENCRYPTION_KEY } from "@/lib/constants/constant";
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
import axios from "axios";
import { decrypt, encrypt, encrypt1 } from "@/lib/helpers/utilityHelpers";
import SelectComponent from "../SelectComponent/SelectComponent";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "antd";
import InputPasswordComponent from "@/app/_components/signInComponents/InputPasswordComponent";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import {
  getUUIDId,
  createUUIDId,
  getDeviceDetails,
  getLocationFromIP,
} from "@/lib/helpers/apiHandlers/ipId";
import dayjs from "dayjs";

export interface AppHeaderProps {
  children: React.ReactNode;
  paths?: string[];
  trackMenu: any;
  setTrackMenu: Function;
}
interface InvoiceTable {
  formName: string;
  invoiceNo: string;
  id: number;
  status: string;
  invoiceDate: string;
}

function AppHeader({ children, setTrackMenu, trackMenu }: AppHeaderProps) {
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useTabStore(); // Zustand store

  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const TabContext: any = useContext(TabTrackContext); // to track the selected sub menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [password, setPassword] = useState("");
  // const [VoiceRecord, setVoiceRecord] = useState(false);
  // const { status, startRecording, stopRecording, mediaBlobUrl, error } =
  //   useReactMediaRecorder({ audio: true, screen: true });
  // const [showCameraIcon, setShowCameraIcon] = useState(false);

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
  const [showLoginModal, setShowLoginModal] = useState<boolean>(
    !Cookies.get("superToken")
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
  const Loader = useContext(LoaderContext);
  const trackMenuRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(-1);


  const normalizeMenuName = (menuName: string): string => {
    return menuName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
  };


  useEffect(() => {
    if (trackMenuRef.current)
      trackMenuRef.current[currentTabIndex]?.scrollIntoView();
    console.log("currentTabIndex", currentTabIndex);
  }, [currentTabIndex]);


  useEffect(() => {
    if (!pathname) return;

    const parts = pathname.split("/").filter(Boolean);

    if (parts[0] === "super" && parts[1] === "dashboard" && parts[2]) {
      const formattedName = parts[2]
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      if (!trackMenu.includes(formattedName)) {
        setTrackMenu((prev: string[]) => [...prev, formattedName]);
      }
    }
  }, [pathname]);


  const formik = useFormik({
    initialValues: {
      // username: decrypt(Cookies.get("icube_saas_username1") || "") ?? "",
      // username: JSON.parse(Cookies.get("userDetails") ?? "{}")?.email,
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string(),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values) => {
      Loader?.setLoader(true);
      // reLogin(values);
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/SuperLogin`,
          {
            emailId: values.username,
            password: encrypt1(values.password, ENCRYPTION_KEY),
          }
        );
        if (res.status == 200) {
          // Cookies.set("AccessSuper", "true");
          const expiryDate = new Date(
            new Date().getTime() + 24 * 60 * 60 * 1000
          );
          Cookies.set("superToken", res.data.accessToken, {
            expires: expiryDate,
          });
          Cookies.set("superRefreshToken", res.data.refreshToken, {
            expires: expiryDate,
          });
          Loader?.setLoader(false);
          setShowLoginModal(false);
          setShowToast(true);
          tagRevalidate("registeredCompanies");
          // router.push("super/dashboard");
          // router.push(urlPath);
        }
      } catch (err: any) {
        console.log(err);
        if (err?.response?.status == 500)
          showAlert(err.response.data.errordescription);
        else if (err?.response?.data?.errordescription?.includes("Password"))
          formik.setFieldError("password", "Invalid password");
        else formik.setFieldError("username", "Domain not register");
        Loader?.setLoader(false);
      }
    },
  });

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

  const handleCloseTab = (index: number) => {
    setTrackMenu((prevTabs: string[]) => {
      const updatedTabs = [...prevTabs];
      const closedTab = updatedTabs[index]; // Get the closed tab

      // if (closedTab.includes("Reports-Report")) {
      //   // Check if there are any opened report tabs
      //   if (tabs.length > 0) {
      //     const confirmation = window.confirm(
      //       "You have opened reports tabs. Are you sure you want to close all report tabs?"
      //     );

      //     if (!confirmation) {
      //       return prevTabs; // Return the original array of tabs without modifications
      //     }

      //     // If confirmed, clear Zustand tabs and activeTab
      //     useTabStore.setState({
      //       tabs: [], // Clear Zustand tabs
      //       activeTab: null, // Clear Zustand activeTab
      //     });
      //   }
      // }

      updatedTabs.splice(index, 1);

      // Determine the next tab to activate if any remain
      if (updatedTabs.length > 0) {
        const newActiveTabIndex = index === 0 ? 0 : index - 1;
        handleClickTab(updatedTabs[newActiveTabIndex]);
      } else {
        // If no more trackMenu tabs are available, check for report tabs
        if (tabs.length > 0) {
          const lastReportTab = tabs[tabs.length - 1]; // Open the last report tab
          setActiveTab(lastReportTab);
          router.push(`/dashboard/reports-report/${lastReportTab.id}`);
        } else {
          // If no report tabs are available, navigate to the dashboard
          setTrackMenu([]); // Clear the trackMenu state
          router.push("/super/dashboard");
        }
      }

      return updatedTabs;
    });
  };

  console.log("showLoginModal", showLoginModal);

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
  
  const handleClickTab = (
    name: string,
    tab?: { menuName: string; id: string }
  ) => {

    const normalizedSubMenuName = normalizeMenuName(name);

    const path = `/super/dashboard/${normalizedSubMenuName}`;

    if (!trackMenu.includes(name)) {
      setTrackMenu((prev: string[]) => [...prev, name]);
    }

    router.push(path);
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

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -100, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 100, behavior: "smooth" });
  };
  const handleCloseReportTab = (index: number, menuName: string, id: any) => {
    const getLocalStorageKey = (id: string, key: string) => `${id}_${key}`;

    // Clear local storage for the closed tab
    localStorage.removeItem(getLocalStorageKey(id, "fromDate"));
    localStorage.removeItem(getLocalStorageKey(id, "toDate"));
    localStorage.removeItem(getLocalStorageKey(id, "conditions"));
    localStorage.removeItem(getLocalStorageKey(id, "appearanceSettings"));
    localStorage.removeItem(`pivotGridState_${id}`); // Remove the pivotGridState for the closed tab

    // Remove the tab from Zustand store
    removeTab(menuName);

    const remainingTabs = tabs.filter((tab) => tab.menuName !== menuName); // Get remaining tabs

    if (remainingTabs.length > 0) {
      // If there are remaining tabs, activate the next appropriate tab
      const newActiveTabIndex = index === 0 ? 0 : index - 1; // Ensure valid index
      const nextTab = remainingTabs[newActiveTabIndex]; // Get the next tab to activate
      setActiveTab(nextTab);
      router.push(`/dashboard/reports-report/${nextTab.id}`);
    } else if (trackMenu.length > 0) {
      // If no report tabs remain but trackMenu has items, open the first item in trackMenu
      const lastTrackMenuItem = trackMenu[trackMenu.length - 1]; // Get the last item in trackMenu
      handleClickTab(lastTrackMenuItem);
    } else {
      // If no tabs and no trackMenu items, navigate to the dashboard
      setActiveTab(null);
      router.push("/dashboard");
    }
  };

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

  //functionality for global search
  function handleDashboardSearch(value: string) {
    // if (!globalSearch) return;
    console.log("handling global search");
    makeApiCall
      .post("GetDashBoardSearch", {
        invoiceNo: value,
      })
      .then((res) => {
        // if (res.data.data.invoice.length > 1) {
        //   setMultipleInvoice(res.data.data.invoice);
        //   setFormName(res.data.data.accessPrivilegeList.form_name);
        //   setIsMultipleResult(true);
        //   setShowModal(true);
        // } else
        //   router.push(
        //     myForm[res.data.data.accessPrivilegeList.form_name](
        //       res.data.data.invoice[0].id
        //     )
        //   );
        if (res.data.data.accessPrivileges.length === 0) {
          // showAlert("Invoice number does not exist!");
          // setGlobalSearch("");
          console.log("Entering if");
          axios
            .post("https://icube.fouz.chat/include/api.php", {
              function: "search-articles",
              token: "126bc89bc1701acfbb9343aaf620e81d2fc47fb7",
              search: globalSearch.toLowerCase(),
            })
            .then((res1: any) => {
              console.log(res1);
              setAutoCompleteOptions(
                res1.data.response.map((article: any) => ({
                  label: article.title,
                  value: article.link,
                }))
              );
            })
            .catch((err1) => console.log(err1));
        } else if (
          res.data.data.accessPrivileges.length === 1 &&
          res.data.data.accessPrivileges[0].invoiceDetails.length === 1
        ) {
          console.log("Entering else if");
          router.push(
            myForm[res.data.data.accessPrivileges[0].form_name][
              res.data.data.accessPrivileges[0].invoiceDetails[0].type
            ](
              res.data.data.accessPrivileges[0].invoiceDetails[0].id,
              res.data.data.accessPrivileges[0].invoiceDetails[0].status
            )
          );
          setGlobalSearch("");
        } else {
          console.log("else");
          setMultipleInvoice(res.data.data.accessPrivileges);
          // setFormName(res.data.data.accessPrivilegeList.form_name);
          // setIsMultipleResult(true);
          setShowModal(true);
        }
      });
    // .catch((err) => showAlert(err.response.data.errordescription));
  }

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

  async function reLogin(values: any) {
    console.log("values1", values);
    // let values = {
    //   username: decrypt(Cookies.get("icube_saas_username1") || ""),
    //   // password: decrypt(Cookies.get("icube_saas_password1") || ""),
    //   password: password
    // };
    try {
      const currDate = dayjs()?.format("MM-DD-YY");
      const getIPDetail = await getLocationFromIP();
      console.log("dataaa", getIPDetail);
      let deviceUUID = getUUIDId();
      const deviceOS = getDeviceDetails();
      console.log("deviceOS", deviceOS);
      if (!deviceUUID) {
        console.log("innn");
        deviceUUID = createUUIDId();
      }
      const finalIP = getIPDetail?.ip + "/" + deviceUUID;
      console.log("deviceUUID", deviceUUID);
      // const res: any = await login(values);
      // const res: any = await login({
      //   username: JSON.parse(Cookies.get("userDetails") ?? "{}")?.email,
      //   password: values.password,
      // });
      const res: any = await login({
        username: decrypt(Cookies.get("icube_saas_username1") || ""),
        password: values.password,
        ip_address: finalIP,
        current_date: currDate,
      });
      console.log("res", res);
      if (res.status == 200) {
        // if (Cookies.get("idleMinutes")) {
        //   const expiryDate = new Date(
        //     new Date().getTime() +
        //       Number(Cookies.get("idleMinutes")) * 60 * 1000
        //   );
        //   Cookies.set("token1", res?.data?.accessToken, {
        //     expires: expiryDate,
        //   });
        // }
        // Cookies.set("refreshToken", res?.data?.refreshToken);
        Cookies.set("token", res?.data?.accessToken);
        // setShowLoginModal(false);
        Cookies.set("allowAccess123", "false");
        setShowToast(true);
        formik.resetForm();
      }
    } catch (err: any) {
      console.log(err);
      if (err?.response?.status === 500) {
        alert(`${err?.response?.data?.errordescription}`);
      } else {
        if (err?.response?.data?.errordescription?.includes("Password")) {
          formik.setFieldError("password", "Invalid password");
        } else {
          formik.setFieldError("username", "Domain not register");
        }
      }
    }
  }

  useEffect(() => {
    setTimeout(() => setShowToast(false), 3000);
  }, [showToast]);

  let idleTime = useRef<number>(0);

  // useEffect(() => {
  //   idleTime.current = 0;
  // }, []);

  useEffect(() => {
    // Reset idle time on user activity
    function resetIdleTime() {
      idleTime.current = 0;
    }

    // let warningModal: any = null;

    // Increment idle time every second
    // const interval = setInterval(() => {
    //   idleTime.current += 1; // Increase the idle time counter every second
    //   if (isWarningVisible) setWarningSec(warningSec - 1);
    //   if (
    //     Cookies.get("idleMinutes") &&
    //     ((Number(Cookies.get("idleMinutes")) * 60 < idleTime.current &&
    //       !showLoginModal) ||
    //       (warningSec - 1 == 0 && isWarningVisible))
    //   ) {
    //     setisWarningVisible(false);
    //     setShowLoginModal(true);
    //     Cookies.set("allowAccess123", "true");
    //   }
    //   if (
    //     Cookies.get("idleMinutes") &&
    //     Number(Cookies.get("idleMinutes")) * 60 - 30 < idleTime.current &&
    //     !showLoginModal &&
    //     !isWarningVisible
    //   ) {
    //     setisWarningVisible(true);
    //     setWarningSec(30);
    //   }
    // }, 1000);

    // Listen for activity and reset idle time
    window.addEventListener("mousemove", resetIdleTime);
    window.addEventListener("click", resetIdleTime);
    window.addEventListener("keydown", resetIdleTime);
    window.addEventListener("scroll", resetIdleTime);

    // You can then check `idleTime` to know how long the user has been idle

    // const cookieChecker = setInterval(() => {
    //   if (!Cookies.get("token1") && !showLoginModal) {
    //     Cookies.remove("token1");
    //     Cookies.remove("token");
    //     setShowLoginModal(true);
    //     Cookies.set("allowAccess123","true");
    //   }
    // }, 2000);

    // return () => clearInterval(cookieChecker);
    // return () => clearInterval(interval); // Cleanup interval on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLoginModal, isWarningVisible, warningSec]);
  useEffect(() => {
    console.log("gloval", globalSearch);
  }, [globalSearch]);

  useEffect(() => {
    console.log("isWarningVisible", isWarningVisible);
  }, [isWarningVisible]);

  useEffect(() => {
    console.log("showLoginModal", showLoginModal);
  }, [showLoginModal]);

  const handleLogout = () => {
    // const token: any = Cookies.get("token");
    // const signOut = logout(token);
    // signOut
    //   .then((response) => {
    //     if (response.status === 200) {
    //       Cookies.remove("token");
    //       Cookies.remove("userDetails");
    //       router.push("/");
    //       Loader?.setLoader(false);
    //     }
    //   })
    //   .catch((err) => {
    //     Loader?.setLoader(false);
    //   });
    setTimeout(() => {
      setisWarningVisible(false);
      // setShowLoginModal(false);
      Loader?.setLoader(true);
      Cookies.remove("token");
      Cookies.remove("userDetails");
      Cookies.remove("openTabs");
      Cookies.remove("sb-login");
      Cookies.remove("idleMinutes");
      localStorage.clear();
      useUserStore.setState({
        user: null,
      });

      // Reset Zustand tab store (if necessary)
      useTabStore.setState({
        tabs: [], // Clear opened tabs in Zustand store
        activeTab: null, // Reset the active tab
      });
      Loader?.setLoader(false);
    }, 2000);
    router.push("/");

    // const event = new Event(CONSTANT.LOGOUT);
    // window.dispatchEvent(event);
  };

  return (
    <div className={styles.container}>
      <Modal
        className="reloginWarningModal"
        title={
          <Flex align="center" gap={8}>
            {/* <Image
              src={"/assets/warning.svg"}
              alt="warning_icon"
              width={22}
              height={22}
              unoptimized={true}
              unselectable="off"
              blurDataURL={"/assets/warning.svg"}
            /> */}
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="exclamation-circle"
              width="1em"
              height="1em"
              fill="#faad14"
              aria-hidden="true"
              style={{ fontSize: "1.5rem" }}
            >
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
            </svg>
            Alert
          </Flex>
        }
        open={isWarningVisible}
        // onCancel={() => setisWarningVisible(false)}
        onOk={() => setisWarningVisible(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        // closable={false}
        closeIcon={false}
        zIndex={100000}
      >
        You are reaching idle time. You have {warningSec} seconds to avoid
        re-signing in.
      </Modal>
      <ConfirmModal
        openModal={openDirtyModal}
        onClose={() => {
          setFormDirty(false);
          setOpenDirtyModal(false);
          router.push(routePath);
        }}
        onCancel={() => {
          setOpenDirtyModal(false);
        }}
      />
      {/* <Flex justify="center" style={{ marginTop: "0.25rem" }}>
        <AutoComplete
          //             popupClassName="certain-category-search-dropdown"
          // popupMatchSelectWidth={500}
          // style={{ width: 250 }}
          value={globalSearch}
          options={autoCompleteOptions}
          // size="large"
          onSelect={(value) => {
            // if (autoCompleteOptions.length > 0) {
            //   const label = autoCompleteOptions?.find(
            //     (option) => option.value == value
            //   )?.label;
            //   console.log("label", label);
            //   setGlobalSearch(label || "");
            // }
            window.open(value, "_blank");
          }}
          style={{ width: "50%" }}
        >
          <Input.Search
            placeholder="Ask me anything..."
            value={globalSearch}
            onChange={(event) => {
              setGlobalSearch(event.target.value);
              if (event.target.value.length === 0) setAutoCompleteOptions([]);
            }}
            onSearch={handleDashboardSearch}
          />
        </AutoComplete>
      </Flex> */}
      <div className={styles.sub_container}>
        <MobSideBar trackMenu={trackMenu} setTrackMenu={setTrackMenu} />
        {/* <div className={styles.headerWrapper}>
          <h2 className={styles.headerTitle}>
            {t(headerTitle)}
          </h2>
        </div> */}
        <div className={`${styles.centered} ${styles.tab_overflow}`}>
          <>
            {trackMenu?.map((each: string, index: number) => {
              const s = (each ?? "").trim();
              const dash = s.indexOf("-");
              const parentLabel = dash > -1 ? s.slice(0, dash).trim() : "";
              const childLabel = dash > -1 ? s.slice(dash + 1).trim() : s;
              const _sword = each.replace(/\s+/g, "");
              const normalizedName = normalizeMenuName(each);
              // const isActive = pathname?.toLowerCase().includes(normalizedName);
              const lastSegment = pathname?.split("/").pop()?.toLowerCase();
              const isActive = lastSegment === normalizedName;
              if (isActive && currentTabIndex != index)
                setCurrentTabIndex(index);
              return (
                <React.Fragment key={index}>
                  {each !== "undefined" && (
                    <>
                      <div
                        key={index}
                        className={`${styles.centered} ${styles.tab_container
                          } ${isActive ? styles.active_tab : ""}`}
                        ref={(el) => (trackMenuRef.current[index] = el)}
                      >
                        <button
                          className={styles.tab}
                          onClick={() => handleClickTab(each)}

                          // Shortcuts - 
                          // title={t(each)} // Show full menu-submenu name on hover
                          title={parentLabel ? `${t(parentLabel)} - ${t(childLabel)}` : t(childLabel)}
                          // Shortcuts Ends - 

                          style={{ color: isActive ? "#1677ff" : "black" }}
                        >
                          {/* Shortcuts -  */}
                          {/* {t(each.split("-")[1])} */}
                          {t(childLabel)}
                          {/* Shortcuts Ends -  */}
                        </button>
                        <button
                          className={styles.closeTab}
                          type="button"
                          title="close"
                          onClick={() => handleCloseTab(index)}
                          style={{ color: isActive ? "#1677ff" : "black" }}
                        >
                          <CloseOutlined
                            style={{}}
                            className={styles.closeTabIcon}
                          />
                        </button>
                      </div>
                      {index != trackMenu.length - 1 && (
                        <div className={styles.divider} />
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}
            {/* {tabs.map((tab: any, index: any) => {
              return (
                <React.Fragment key={index}>
                  {tab !== "undefined" && (
                    <div
                      key={index}
                      className={`${styles.centered} ${styles.tab_container}`}
                    >
                      <button
                        className={styles.tab}
                        style={{
                          color: tab.menuName?.includes(
                            TabContext?.currentSubActiveMenu
                          )
                            ? "#3661FF"
                            : "#000",
                        }}
                        onClick={() => handleClickReportTab(tab)}
                        title={t(tab)} // Show full menu-submenu name on hover
                      >
                        {tab.menuName}
                      </button>
                      <button
                        className={styles.closeTab}
                        type="button"
                        title="close"
                        style={{
                          color: tab.menuName.includes(
                            TabContext?.currentSubActiveMenu
                          )
                            ? "#3661FF"
                            : "#000",
                        }}
                        onClick={() =>
                          handleCloseReportTab(index, tab.menuName, tab.id)
                        }
                      >
                        <CloseOutlined
                          style={{}}
                          className={styles.closeTabIcon}
                        />
                      </button>
                    </div>
                  )}
                </React.Fragment>
              );
            })} */}
          </>
        </div>

        {/* login in code */}
        <ModalComponent
          showModal={showLoginModal}
          setShowModal={setShowLoginModal}
          footer={[]}
          customCancelButton={false}
          onClose={() => { }}
          zIndex={100000}
        >
          {/* <LoginForm setShowModal={setShowLoginModal} /> */}
          <form onSubmit={formik.handleSubmit}>
            <Flex vertical gap={16} align="center">
              <h3 style={{ textAlign: "center" }}>Login to access</h3>
              <Flex vertical gap={8}>
                <label>Username</label>
                <InputComponent
                  type="text"
                  name="username"
                  // value={
                  //   JSON.parse(Cookies.get("userDetails") ?? "{}")?.email ||
                  //   userDetails?.email
                  // }
                  prefix={<UserOutlined style={{ color: "#0d39fe" }} />}
                  value={formik.values.username}
                  onChangeEvent={(e) =>
                    formik.setFieldValue("username", e.target.value)
                  }
                  errormsg={formik.errors.username}
                  isFromPos
                />
              </Flex>
              {/* <InputComponent
                type="text"
                label={t("Password")}
                className={styles.passwordInputBox}
                name="password"
                // value={password}
                // onChangeEvent={(e)=>setPassword(e.target.value)}
                value={formik.values.password}
                onChangeEvent={formik.handleChange}
                errormsg={formik.touched.password && formik.errors.password}
                placeholder="password"
                isFromPos
                autoFocus
              /> */}
              <InputPasswordComponent
                label={t("Password")}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                errormsg={formik.touched.password && formik.errors.password}
                placeholder="password"
                autoFocus
              />
              <Flex gap={16}>
                <ButtonComponent
                  type="primary"
                  htmlType="submit"
                //  onClickEvent={getRenewedToken}
                // onClickEvent={reLogin}
                >
                  Sign In
                </ButtonComponent>
              </Flex>
            </Flex>
          </form>
        </ModalComponent>
        {showToast && (
          <Toast
            type="success"
            message="Signed in successfully"
            delay={150000}
          />
        )}

        {/* global search */}
        <ModalComponent
          showModal={showModal}
          setShowModal={setShowModal}
          customTitle="Available Forms"
          footer={false}
        >
          <TableComponent
            dataSource={tableData}
            columns={tableColumns}
            pagination={false}
            // style={{ overflow: "auto" }}
            scroll={{ y: 350 }}
          />
        </ModalComponent>

        <div className={styles.centered}>
          {/* <Search
            // className={styles.gap}
            className={styles.search}
            placeholder="Search"
            onChange={(event) =>
              setGlobalSearch(event.target.value.toUpperCase())
            }
            value={globalSearch}
            onSearch={handleDashboardSearch}
            // allowClear
            // style={{ height: "32px" }}
          />
          {isMobile && (
            <button
              title="Search"
              onClick={() => {}}
              className={styles.MobtopNavButtons}
            >
              <SearchOutlined className={styles.searchicon} />
            </button>
          )} */}
          {/* <AutoComplete
            //             popupClassName="certain-category-search-dropdown"
            // popupMatchSelectWidth={500}
            // style={{ width: 250 }}
            value={globalSearch}
            options={autoCompleteOptions}
            // size="large"
            onSelect={(value) => {
              // if (autoCompleteOptions.length > 0) {
              //   const label = autoCompleteOptions?.find(
              //     (option) => option.value == value
              //   )?.label;
              //   console.log("label", label);
              //   setGlobalSearch(label || "");
              // }
              window.open(value, "_blank");
            }}
          >
            <Input.Search
              placeholder="Search..."
              value={globalSearch}
              onChange={(event) => {
                setGlobalSearch(event.target.value);
                if (event.target.value.length === 0) setAutoCompleteOptions([]);
                else {
                  handleDashboardSearch(event.target.value);
                }
              }}
              // onPressEnter={handleDashboardSearch}
              onSearch={(value) => handleDashboardSearch(value)}
            />
          </AutoComplete> */}

          {/* <button
            title="BellOutlined"
            onClick={() => {}}
            className={styles.topNavButtons}
          >
            <BellOutlined className={styles.topNavButtonsIcon} />
          </button>
          <button
            title="SettingOutlined"
            onClick={() => {}}
            className={styles.topNavButtons}
          >
            <SettingOutlined className={styles.topNavButtonsIcon} />
          </button>
          <Dropdown
            menu={{
              items: Languages,
              onClick: (e) => onSelectLanguage(e),
            }}
            trigger={["click"]}
            arrow={{ pointAtCenter: true }}
          >
            <button
              title="TranslationOutlined"
              onClick={() => {}}
              className={styles.topNavButtons}
            >
              <TranslationOutlined className={styles.topNavButtonsIcon} />
            </button>
          </Dropdown> */}

          {/****coding for screen recording starts here****/}
          {/* {(status === "idle" || status === "stopped") && (
            <button onClick={handlePlayClick} className={styles.topNavButtons}>
              <PlayCircleOutlined
                style={{ fontSize: "20px" }}
                className={styles.topNavButtonsIcon}
              />
            </button>
          )}
          {status === "recording" && (
            <button onClick={handleStopClick} className={styles.topNavButtons}>
              <PauseCircleOutlined
                style={{ fontSize: "20px" }}
                className={styles.topNavButtonsIcon}
              />
            </button>
          )}
          {showCameraIcon && (
            <button
              onClick={() => setVoiceRecord(!VoiceRecord)}
              className={styles.topNavButtons}
            >
              {(VoiceRecord && (
                <VideoCameraOutlined
                  style={{ fontSize: "30px" }}
                  className={styles.topNavButtonsIcon}
                />
              )) || (
                <VideoCameraAddOutlined
                  style={{ fontSize: "30px" }}
                  className={styles.topNavButtonsIcon}
                />
              )}
            </button>
          )}

          {VoiceRecord && status !== "stopped" && (
            <Draggable>
              <Webcam
                className={styles.camera}
                audio={false}
                width={300}
                height={300}
                videoConstraints={{
                  width: 300,
                  height: 300,
                  facingMode: "user",
                }}
              />
            </Draggable>
          )}
          {mediaBlobUrl && status === "stopped" && (
            <a
              href={mediaBlobUrl}
              download={"video.mp4"}
              className={styles.topNavButtons}
            >
              <DownloadOutlined className={styles.topNavButtonsIcon} />
            </a>
          )} */}
          {/**** coding for screen recording ends here****/}
        </div>
      </div>
      <div className={styles.pageRenderContainer}>{children}</div>
    </div>
  );
}

export default AppHeader;
