"use client";

import dynamic from "next/dynamic";
const SideBar = dynamic(
  () => import("@/components/SuperSidebar/SuperSidebar"),
  { ssr: false }
);
const AppHeader = dynamic(
  () => import("@/components/SuperAppHeader/SuperAppHeader"),
  { ssr: false }
);
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { useContext, useEffect, useState } from "react";
import styles from "../../dashboard/dashboard.module.css";
import Chivo from "next/font/local";
import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
import { showAlert } from "@/lib/helpers/alert";
import { useLoginStore } from "@/store/login/store";
import Cookies from "js-cookie";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";

const chivo = Chivo({
  src: [
    {
      path: "../../fonts/Chivo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/Chivo-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/Chivo-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/Chivo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/Chivo-ExtraBold.ttf",
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
  const [trackMenu, setTrackMenu] = useState<string[] | any>([]);
  const [ltr, setLtr] = useState<any>("en");
  const router = useRouter();
  const setURLPath = useLoginStore().setURLPath;
  const { loader, setLoader }: any = useContext(LoaderContext);
  useEffect(() => {
    setLoader(false);
    if (typeof window !== "undefined") {
      if (!Cookies.get("superToken")) {
        // setURLPath(window.location.href.replace(window.location.origin, ""));
        // showAlert("Login as Super Admin to enable access");
        // router.push("/super");
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={`${styles.outletHeight} ${chivo.className}`}>
      <div
        className={styles.rootLayout}
        style={
          ltr === "ar"
            ? { flexDirection: "row-reverse" }
            : { flexDirection: "row" }
        }
      >
        <AntdRegistry>
          <div className={styles.sidebar}>
            <SideBar setTrackMenu={setTrackMenu} trackMenu={trackMenu} />
          </div>
          <AppHeader setTrackMenu={setTrackMenu} trackMenu={trackMenu}>
            {children}
          </AppHeader>
        </AntdRegistry>
      </div>
    </main>
  );
}
