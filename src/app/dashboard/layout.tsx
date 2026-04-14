"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import styles from "./dashboard.module.css";
import Chivo from "next/font/local";
import SideBar from "@/components/SideBar/SideBar";
import MobSideBar from "@/components/MobSideBar/MobSideBar";
import { useCallback, useContext, useEffect, useState } from "react";
import { TranslationContext } from "@/lib/interfaces/Context.interfaces";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Script from "next/dist/client/script";
import Link from 'next/link';
import { useUserStore } from "@/store/userInfo/store";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// Dark Mode Changes - Sherin 
import { ConfigProvider, Switch, theme as antdTheme } from "antd";
import type { ThemeConfig } from "antd";
// Ends

// Dark Mode Changes - Sherin 
const { darkAlgorithm, defaultAlgorithm } = antdTheme;
// Ends


const AppHeader = dynamic(() => import("@/components/AppHeader/AppHeader"), {
  ssr: false,
});
// import AppHeader from "@/components/AppHeader/AppHeader";
const chivo = Chivo({
  src: [
    {
      path: "../fonts/Chivo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Chivo-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Chivo-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Chivo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Chivo-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [user, setUser] = useState(null);
  const [trackMenu, setTrackMenu] = useState<string[] | any>([]);
  const [ltr, setLtr] = useState<any>("en");
  const lang = useContext(TranslationContext);


  // Dark Mode Changes - Sherin 
  // const [theme, setTheme] = useState<"light" | "dark">("light");
  // const [theme, setTheme] = useState<"light" | "dark">(() => {
  //   if (localStorage && typeof localStorage != undefined)
  //     return (localStorage.getItem("theme") as "light" | "dark") || "light";
  //   return "light"
  // });
  console.log('localStorage.getItem("theme")')

  const userDetails = useUserStore(
    useCallback((state: any) => {
      try {
        return state.user ? JSON.parse(state.user) : null;
      } catch (error) {
        console.error("Error parsing user details:", error);
        return null;
      }
    }, [])
  );

  console.log('localStorage.getItem("theme")2', userDetails)
  // useEffect(() => {
  //   if (userDetails) {
  //     localStorage.setItem("theme", userDetails?.isLightTheme ? "light" : "dark");
  //   }
  // }, [userDetails])

  const [theme, setTheme] = useState<"light" | "dark">(
    typeof window !== "undefined"
      ? (localStorage.getItem("theme") as "light" | "dark") || "light"
      : "light"
  );

  // useEffect(() => {
  //   setTheme(userDetails?.isLightTheme ? "light" : "dark")
  // }, [userDetails?.isLightTheme])

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    console.log('theme34', theme)

    if (theme === "dark") {
      html.classList.add("dark-mode");
      body.classList.add("dark-mode");
    } else {
      html.classList.remove("dark-mode");
      body.classList.remove("dark-mode");
    }
  }, [theme]);

  // Load theme from localStorage
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme") as "light" | "dark";
  //   if (savedTheme) setTheme(savedTheme);
  // }, []);

  // Save theme to localStorage
  // useEffect(() => {
  //   localStorage.setItem("theme", theme);
  // }, [theme]);
  // Ends


  useEffect(() => {
    // getUserDetailsByDecodeCookie();
    const tab = Cookies.get("tabs");
    const parsedTab = tab?.split(",");
    // setTrackMenu(parsedTab);
    Cookies.set("tabs", `${parsedTab}`);
  }, []);
  useEffect(() => {
    if (lang?.selectedLang) {
      setLtr(lang?.selectedLang);
    } else {
      const fromLocal = localStorage.getItem("language");
      setLtr(fromLocal);
    }
  }, [lang?.selectedLang]);


  // Dark Mode Changes - Sherin 
  // Ant Design theme tokens (+ algorithm for consistent dark palette)
  const antdThemeConfig: ThemeConfig = {
    token: {
      colorTextBase: theme === "dark" ? "#f0f0f0" : "#000000",
      colorPrimary: "#e7dff1ff",
    },
    algorithm: theme === "dark" ? [darkAlgorithm] : [defaultAlgorithm],
  };

  // Inline styles for light/dark mode
  const themeStyles: React.CSSProperties =
    theme === "dark"
      ? { backgroundColor: "#141414", color: "#f0f0f0", minHeight: "100vh" }
      : { backgroundColor: "#ffffff", color: "#000000", minHeight: "100vh" };

  const isRtl = ltr === "ar";

  // Listen to theme changes coming from the Sidebar switch
  useEffect(() => {
    console.log("inn78");

    const onThemeChanged = (e: any) => {
      const next = (e?.detail as "light" | "dark") ?? "light";
      setTheme(next); // this will run your existing "add/remove class" effect
    };

    // Also react if localStorage('theme') changes from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue as "light" | "dark");
      }
    };

    window.addEventListener("icube-theme-changed", onThemeChanged as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("icube-theme-changed", onThemeChanged as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  // Ends


  // useEffect(() => {
  //   const loadScripts = async () => {
  //     // Load jQuery first
  //     await new Promise((resolve) => {
  //       const script = document.createElement("script");
  //       script.src = "https://icube.fouz.chat/js/min/jquery.min.js";
  //       script.onload = resolve;
  //       document.body.appendChild(script);
  //     });

  //     // Then load main.js
  //     await new Promise((resolve) => {
  //       const script = document.createElement("script");
  //       script.src = "https://icube.fouz.chat/js/main.js";
  //       script.onload = resolve;
  //       document.body.appendChild(script);
  //     });

  //     console.log("Scripts loaded in sequence");
  //   };

  //   setTimeout(()=>loadScripts(),5000)
  // }, []);

  // const getUserDetailsByDecodeCookie = () => {
  //   const userEncodedData = Cookies.get("userDetails");
  //   const userDetailsFromCookie =
  //     userEncodedData && JSON.parse(`${userEncodedData}`);
  //   setUser(userDetailsFromCookie?.initialData?.userInfo);
  // };

  return (
    <main className={`${styles.outletHeight} ${chivo.className}`}
      style={themeStyles} >


      <Script
        src="https://icube.fouz.chat/js/min/jquery.min.js"
        strategy="beforeInteractive"
      ></Script>
      <Script
        id="sbinit"
        src="https://icube.fouz.chat/js/main.js"
        strategy="afterInteractive"
      ></Script>
      <Link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-grid.css" />
      <Link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-theme-quartz.css" />
      <div
        className={styles.rootLayout}
        style={
          ltr === "ar"
            ? { flexDirection: "row-reverse" }
            : { flexDirection: "row" }
        }
      >
        <AntdRegistry>


          {/* Dark Mode Changes - Sherin  */}
          <ConfigProvider theme={antdThemeConfig}>
            {/* Ends */}


            <div className={styles.sidebar}>
              <SideBar
              //  setTrackMenu={setTrackMenu} trackMenu={trackMenu}
              />
            </div>


            {/* Dark Mode Changes - Sherin  */}
            {/* Header + Theme switch */}
            {/* <div style={{ flex: 1, position: "relative" }}> */}

            {/* <div
                  style={{
                    position: "absolute",
                    top: 120,
                    right: 24,
                    zIndex: 1000,
                    insetInlineEnd: isRtl ? "auto" : 24,
                    insetInlineStart: isRtl ? 24 : "auto",
                  }}
                >
                  <Switch
                    checked={theme === "dark"}
                    onChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div> */}
            {/* Ends */}


            <AppHeader
            //  setTrackMenu={setTrackMenu} trackMenu={trackMenu}
            >
              {children}
            </AppHeader>
            {/* </div> */}
            {/* above div Sherin */}


          </ConfigProvider>
        </AntdRegistry>
      </div>
    </main>
  );
}