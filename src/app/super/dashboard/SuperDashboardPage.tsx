// "use client";

// // import { useContext, useEffect } from "react";
// import styles from "./SuperDashboardPage.module.css";
// // import { LoaderContext } from "@/lib/interfaces/Context.interfaces";

// export default function SuperDashboardPage() {
//   // const { loader, setLoader }: any = useContext(LoaderContext);
//   // useEffect(() => {
//   //   setLoader(false);
//   // }, []);
//   return (
//     <div className={styles.container}>
//       <h3>Super Admin Dashboard</h3>
//     </div>
//   );
// }


"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "./SuperDashboardPage.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";
import { useUserStore } from "@/store/userInfo/store";
import { CONSTANT } from "@/lib/constants/constant";
// import makeSuperAPICall from "@/lib/helpers/apiHandlers/api";
import { useSuperUserStore } from "@/store/superuserinfo/store";

const SuperDashboardPage = (initialData: any) => {
  console.log("initialData", initialData);


  const router = useRouter();
  const { setLoader }: any = useContext(LoaderContext);
  const [matchedPrivilege, setMatchedPrivilege] = useState<any>(null);
  const userDetails = useSuperUserStore((state: any) => JSON.parse(state?.user));


  useEffect(() => {
    if (initialData?.initialData) {
      const { userInfo, accessPrivilegeList } = initialData.initialData;

      /* ---------------- COOKIE STRUCTURE ---------------- */
      const superUserCookie = {
        userId: userInfo?.id,
        roleId: userInfo?.roleId,
        roleName: userInfo?.roleName,
        firstName: userInfo?.firstName?.trim(),
        lastName: userInfo?.lastName?.trim(),
        email: userInfo?.email,
        idleMinutes: userInfo?.idleMinutes,
        isAllowSavePassword: userInfo?.isAllowSavePassword,
        isActive: userInfo?.isActive,
      };

      Cookies.set("idleMinutes", String(userInfo?.idleMinutes ?? 0));
      Cookies.set("superUserDetails", JSON.stringify(superUserCookie));

      useSuperUserStore.setState({
        user: JSON.stringify({
          userInfo,
          accessPrivilegeList,
        }),
      });

      /* ---------------- DEFAULT LANDING (FIRST ACCESSIBLE MENU) ---------------- */
      // const firstAccessible = accessPrivilegeList?.find(
      //   (item: any) => item.isAccessPrivilege === true && item.isActive === true
      // );

      // setMatchedPrivilege(firstAccessible);

      // if (firstAccessible) {
      //   const routePath = `/super/${firstAccessible.menuName
      //     .toLowerCase()
      //     .replace(/\s+/g, "")}`;

      //   setTimeout(() => {
      //     router.push(routePath);
      //   }, 100);
      // }
    }

    setLoader(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  /* ---------------- LOGOUT HANDLER ---------------- */
  window.addEventListener(CONSTANT.LOGOUT, () => {
    Cookies.remove("token");
    Cookies.remove("superUserDetails");

    useUserStore.setState({
      user: null,
    });

    router.push("/");
  });

  return (
    <div className={styles.container}>
      <div className={styles.initialDashboardImage}>
        {/* <Image
          src={"/assets/dashboard.png"}
          alt="iCube-Dashboard"
          width={180}
          height={180}
          unoptimized={true}
        /> */}
        <p className={styles.title}>Super Admin Dashboard</p>
      </div>
    </div>
  );
};

export default SuperDashboardPage;
