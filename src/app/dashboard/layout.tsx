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
import { useRouter } from "next/navigation";
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


const router = useRouter();

useEffect(() => {
  const token = Cookies.get('token');

  if (!token) {
    router.replace('/');
  }
}, []);









  return (
    <main className={`${styles.outletHeight} ${chivo.className}`}
     >


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
          <ConfigProvider >
            {/* Ends */}


            <div className={styles.sidebar}>
              <SideBar
              />
            </div>





            <AppHeader
            >
              {children}
            </AppHeader>


          </ConfigProvider>
        </AntdRegistry>
      </div>
    </main>
  );
}