"use client";

import Header from "@/components/Header/Header";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import Access from "./Access";
import styles from "./Access.module.css";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userInfo/store";
import Cookies from "js-cookie";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";

export default function CreateAccessPage({
  roleId,
  roleName,
  // pIndex
}: {
  roleId: number;
  roleName?: string;
  // pIndex: any;
}) {
  const router = useRouter();
  const userDetails = useUserStore((state: any) => JSON.parse(state?.user));
  const [accessPrivilegeData, setAccessPrivilegeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState<any>(null);


  useEffect(() => {
    if (!roleId) {
      console.warn("roleId not available yet");
      setLoading(false);
      return;
    }

    // const fetchAccess = async () => {
    //   try {
    //     console.log("token", `Bearer ${Cookies.get("superToken")}`)

    //     const res = await makeSuperAPICall.post("AgentMenuModules", { roleId });
    //     setAccessPrivilegeData(res?.data?.data ?? []);
    //   } catch (err) {
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const normalizeAndMergeForms = (data: any[]) => {
      const map = new Map<string, any>();

      data.forEach(item => {
        const key = `${item.formId}_${item.pIndex}_${item.cIndex}`;

        if (!map.has(key)) {
          map.set(key, {
            ...item,
            view: !!item.view,
            add: !!item.add,
            edit: !!item.edit,
            delete: !!item.delete,
            allowAll: !!item.allowAll,
          });
        } else {
          const prev = map.get(key);

          map.set(key, {
            ...prev,
            view: prev.view || item.view,
            add: prev.add || item.add,
            edit: prev.edit || item.edit,
            delete: prev.delete || item.delete,
            allowAll: prev.allowAll || item.allowAll,
          });
        }
      });

      return Array.from(map.values());
    };



    const fetchAccess = async () => {
      try {
        const res = await makeSuperAPICall.post("AgentMenuModules", { roleId });

        const onlyForms = (res?.data?.data ?? []).filter(
          (item: any) => item.cIndex > 0
        );

        // setAccessPrivilegeData(onlyForms);
        setAccessPrivilegeData(
          normalizeAndMergeForms(onlyForms)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };


    fetchAccess();
  }, [roleId]);


  // useEffect(() => {
  //   if (!userDetails) return;

  //   const foundAccess = userDetails?.accessPrivilegeList?.find(
  //     (item: any) => item.form_name === "Access Privilege"
  //   );

  //   setAccess(foundAccess);

  //   if (!foundAccess?.is_view) {
  //     alert("You don't have access to this page");
  //     router.back();
  //   }
  // }, [userDetails]);

  const items = [
    {
      label: "Access Privilege",
      key: "1",
      children: (
        <Access
          accessPrivilegeData={accessPrivilegeData}
          // access={access}
          // setAccess={setAccess}
          roleId={roleId}
        />
      ),
    },
  ];


  return (
    <>
      <div className={`${styles.create_access_header} padding`}>
        <Header
          title={roleName || ""}
          description="A descriptive body text comes here"
        />
      </div>

      <div className={styles.create_access_tabs}>
        <Tabs
          type="card"
          items={items}
          className="padding ow-access-tabs"
        />
      </div>
    </>
  );
}
