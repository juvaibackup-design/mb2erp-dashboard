"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import { SearchOutlined } from "@ant-design/icons";
import styles from "@/app/super/dashboard/package/package.module.css";
import { useTranslation } from "react-i18next";
import InputComponent from "@/components/InputComponent/InputComponent";
import PackageTable from "./packageTable";
import { tagRevalidate } from "@/app/dashboard/(admin)/admin-accessprivilege/[id]/Actions";

export interface PackageRow {
  id: number;
  packageName: string;
  aliasName: string;
  noOfScreens: number;
  // formList: string[];
  totalTenants: number;
  isActive: boolean;
}

interface PackagePageProps {
  packageTableData: PackageRow[];
}

const PackagePage = ({ packageTableData }: PackagePageProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [ltr] = useState("en");
  const [searchTerm, setSearchTerm] = useState("");

  //   const filteredData = packageTableData?.filter((item) =>
  //   item.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const normalizedData = packageTableData?.map((item: any) => ({
    id: item.packageId,
    packageName: item.packageName,
    aliasName: item.aliasName,
    noOfScreens: item.noOfScreens,
    totalTenants: item.totalTenants,
    isActive: item.isActive,
  }));

  const filteredData = normalizedData?.filter((item: any) =>
    item.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    tagRevalidate("package");
  }, []);

  return (
    <>
      <div className={styles.header}>
        <Header
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {t("Package")}
            </span>
          }
          description={t("Manage your packages")}
          buttonLable={<div>{t("Create New")}</div>}
          onClick={() =>
            router.push("/super/dashboard/package/create")
          }
          autoFocus
        />
      </div>

      <div
        className={styles.analytics}>
        <div style={{ width: 240 }}>
          <InputComponent
            placeholder={t("Search")}
            value={searchTerm}
            onChangeEvent={(e: any) =>
              setSearchTerm(e.target.value)
            }
            style={{ width: 240 }}
            addonAfter={
              <SearchOutlined style={{ color: "#D9D9D9" }} />
            }
            type="search"
          />
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <PackageTable
          packageTableData={filteredData}
        />
      </div>
    </>
  );
};

export default PackagePage;
