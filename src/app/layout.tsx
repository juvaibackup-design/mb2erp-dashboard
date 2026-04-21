"use client";

import "./globals.css";
import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import i18n from "../i18n";
import {
  LoaderContext,
  SideBarStateContext,
  TabTrackContext,
  TranslationContext,
} from "@/lib/interfaces/Context.interfaces";
import { antdThemeProvider } from "@/lib/helpers/antdThemeProvider";
import Cookies from "js-cookie";
import Chivo from "next/font/local";
import { useRouter } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { logout } from "@/lib/helpers/apiHandlers/login";
import Loader from "@/components/Loader/Loader";
import arEG from "antd/locale/ar_EG";
import type { Locale } from "antd/es/locale";
import enUS from "antd/locale/en_US";
import dayjs from "dayjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import styles from "@/components/Loader/Loader.module.css";

const chivo = Chivo({ src: "./fonts/Chivo-Regular.ttf" });

export interface UserBranchListProps {
  id: number;
  branchName: string;
  isPrimary: true;
  dateFormat: string;
  curruncyID: string;
  curruncyname: string;
  symbol: string;
  decimals: any;
  headOffice: boolean;
}

export interface UserProps {
  userId: number;
  displayName: string;
  userName: string;
  email: string;
  companyId: number;
  branchList: UserBranchListProps[];
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocal] = useState<Locale>(enUS);
  // Language Translation
  // const [selectedLang, setSelectedLang] = useState<string | undefined>("en");
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("language") || "en";
    }
    return "en";
  });
  //Ends

  const [trackMenu, setTrackMenu] = useState([]);
  const [currentActiveMenu, setCurrentActiveMenu] = useState<string | any>();
  const [currentSubActiveMenu, setCurrentSubActiveMenu] = useState<
    string | any
  >();
  const [collapse, setCollapse] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);

  // useEffect(() => {
  //   const token = Cookies.get("token");

  //   try {
  //     if (!token) {
  //       console.log("Token is null or undefined");
  //       router.push("/");
  //       return;
  //     }

  //     // const decodedToken: any = jwt.decode(token);

  //     // if (decodedToken && decodedToken.exp) {
  //     //   const expirationDate = new Date(decodedToken.exp * 1000); // Convert to milliseconds
  //     //   const currentDate = new Date();

  //     //   // Check if the token has expired
  //     //   if (expirationDate < currentDate) {
  //     //     const signOut = logout(token);
  //     //     signOut
  //     //       .then((response) => {
  //     //         if (response.status === 200) {
  //     //           // alert("Session expired. Please Sign in again to continue");
  //     //           Cookies.remove("token");
  //     //           Cookies.remove("userDetails");
  //     //           router.push("/");
  //     //         }
  //     //       })
  //     //       .catch((err) => {
  //     //         console.log(err);
  //     //       });
  //     //   } else {
  //     //     console.log("Token is still valid");
  //     //   }
  //     // } else {
  //     //   console.log("Token does not have an expiration date");
  //     // }
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //     router.push("/");
  //   }
  // });
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker.register("/sw.js")
  //       .then(() => console.log("✅ Service Worker registered"))
  //       .catch(err => console.error("❌ SW registration failed", err));
  //   }
  // }, []);

  useEffect(() => {
    const tabs: any = Cookies.get("tabs");
    console.log("tabs", tabs);
    const parsedTabs = tabs?.split(",");
    console.log("parsedTabs", parsedTabs);
    const filterTrackMenu = parsedTabs?.filter(
      (val: any) => val !== "undefined"
    );
    console.log("filterTrackMenu", filterTrackMenu);
    setTrackMenu(filterTrackMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get("tabs")]);

  // Language Translation
  // useEffect(() => {
  //   const defaultLanguage = localStorage.getItem("language");
  //   i18n.changeLanguage(defaultLanguage ? defaultLanguage : "en");
  //   const localeValue: any = defaultLanguage;
  //   setLocal(localeValue);
  //   if (selectedLang === "en") {
  //     dayjs.locale("en");
  //   } else {
  //     dayjs.locale("ar");
  //   }
  // }, [selectedLang]);

  useEffect(() => {
    const defaultLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(defaultLanguage);
    setSelectedLang(defaultLanguage);

    if (defaultLanguage === "en") {
      dayjs.locale("en");
      setLocal(enUS);
    } else {
      dayjs.locale("ar");
      setLocal(arEG);
    }
  }, []);
  //Ends

  const pageClassName = typeof window !== "undefined" ? window.location.pathname.replace("/dashboard/", "").replace("/", "-") : "";
  const isLogin = typeof window !== "undefined" ? window.location.pathname == "/" : false;

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={antdThemeProvider}
        csp={{ nonce: "YourNonceCode" }}
        locale={selectedLang === "ar" ? arEG : enUS}
        direction={selectedLang === "ar" ? "rtl" : "ltr"}
      >
        <SideBarStateContext.Provider value={{ collapse, setCollapse }}>
          <TranslationContext.Provider
            value={{ selectedLang, setSelectedLang }}
          >
            <TabTrackContext.Provider
              value={{
                trackMenu,
                setTrackMenu,
                currentActiveMenu,
                setCurrentActiveMenu,
                currentSubActiveMenu,
                setCurrentSubActiveMenu,
              }}
            >
              <LoaderContext.Provider value={{ loader, setLoader }}>
                {/* Language Translation */}
                {/* <html lang="en" className={chivo.className}> */}
                <html
                  lang={selectedLang === "ar" ? "ar" : "en"}
                  dir={selectedLang === "ar" ? "rtl" : "ltr"}
                  className={chivo.className}
                >
                  {/* Ends */}
                  <body className={chivo.className}>
                    <ErrorBoundary>
                      {(loader && isLogin) ? <Loader className="middle-center" /> : null}
                      {children}
                    </ErrorBoundary>
                  </body>
                </html>
              </LoaderContext.Provider>
            </TabTrackContext.Provider>
          </TranslationContext.Provider>
        </SideBarStateContext.Provider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
