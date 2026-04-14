"use client";

import React, { useRef, useState, useEffect } from 'react';
import Header from '../../Header/Header';
import { t } from 'i18next';
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import InputComponent from '../../InputComponent/InputComponent';
import Tooltip from 'antd/lib/tooltip';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SelectComponent from '../../SelectComponent/SelectComponent';
import styles from "@/app/dashboard/(admin)/admin-bins/BinManagement.module.css";
import { AgGridReact } from 'ag-grid-react';
import { SetFilterModule } from "ag-grid-enterprise";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  ValidationModule,
  DateFilterModule,
  NumberFilterModule,
} from "ag-grid-community";
import { useRouter } from 'next/navigation';
import ExtinctSwitch from '@/components/ExtinctSwitch/ExtinctSwitch';

// ✅ Register same modules as VoucherTypeTable
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,

]);

const BinTab = () => {
  const addNewBtnRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("Total Rules");
  const gridRef = useRef<any>(null);
  const router = useRouter();

  // 🌙 Dark mode support (same as VoucherTypeTable)
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    const onThemeChanged = (e: any) => {
      setTheme((e?.detail as "light" | "dark") ?? "light");
    };
    window.addEventListener("icube-theme-changed", onThemeChanged);
    return () =>
      window.removeEventListener("icube-theme-changed", onThemeChanged);
  }, []);

  const onEdit = (rowData: any) => {
    console.log("Editing rule: ", rowData);
    // Navigate to edit page
    router.push(`/dashboard/admin-bins/editRule?id=${rowData.id}`);
  };

  const toggleStatus = (id: number) => {
    setTableData(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'active' ? 'inactive' : 'active'
        };
      }
      return item;
    }));
  };

  const [tableData, setTableData] = useState<any[]>([
    {
      id: 1,
      ruleName: "Mens Formal Shirts - Hanging",
      category: "Shirts",
      department: "mens",
      season: "all-season",
      preferredZone: "Zone A",
      binType: "hanging",
      priority: 1,
      status: "active",
    },
    {
      id: 2,
      ruleName: "Womens Dresses - Hanging",
      category: "Dresses",
      department: "womens",
      season: "spring",
      preferredZone: "Zone B",
      binType: "hanging",
      priority: 1,
      status: "active",
    },
    {
      id: 2,
      ruleName: "Womens Dresses - Hanging",
      category: "Dresses",
      department: "womens",
      season: "spring",
      preferredZone: "Zone B",
      binType: "hanging",
      priority: 1,
      status: "active",
    },
    {
      id: 2,
      ruleName: "Womens Dresses - Hanging",
      category: "Dresses",
      department: "womens",
      season: "spring",
      preferredZone: "Zone B",
      binType: "hanging",
      priority: 1,
      status: "active",
    },
    {
      id: 2,
      ruleName: "Womens Dresses - Hanging",
      category: "Dresses",
      department: "womens",
      season: "spring",
      preferredZone: "Zone B",
      binType: "hanging",
      priority: 1,
      status: "active",
    },
    {
      id: 3,
      ruleName: "Denim - Folded Storage",
      category: "Denim",
      department: "mens",
      season: "all-season",
      preferredZone: "Zone A",
      binType: "folded",
      priority: 1,
      status: "active",
    },
    {
      id: 4,
      ruleName: "Kids Apparel - Folded",
      category: "Kids Apparel",
      department: "kids",
      season: "all-season",
      preferredZone: "Zone C",
      binType: "folded",
      priority: 1,
      status: "active",
    },
    {
      id: 5,
      ruleName: "Accessories - Shelf Storage",
      category: "Accessories",
      department: "accessories",
      season: "all-season",
      preferredZone: "Zone D",
      binType: "shelf",
      priority: 1,
      status: "active",
    },
    {
      id: 6,
      ruleName: "Winter Collection - Display",
      category: "Outerwear",
      department: "mens",
      season: "winter",
      preferredZone: "Retail",
      binType: "retail-display",
      priority: 2,
      status: "active",
    },
  ]);

  // ✅ AG GRID COLUMN DEFINITIONS - Simple design matching first image
  const columnDefs = [
    {
      headerName: t("Rule Name"),
      field: "ruleName",
      minWidth: 240,
      flex: 2,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        return (
          <ButtonComponent
            type="link"
            onClickEvent={() => onEdit(params.data)}
            style={{
              padding: 0,
              height: "auto",
              justifyContent: "flex-start",
              color: theme === "dark" ? "rgb(125 149 255)" : "#262626",
              fontWeight: 500,
              fontSize: "13px",
              textDecoration: "none",
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {params.value}
          </ButtonComponent>
        );
      },
    },
    {
      headerName: t("Category"),
      field: "category",
      minWidth: 100,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        return (
          <span style={{
            color: "#595959",
            fontSize: "13px",
            display: "inline-block",
            lineHeight: "20px",
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {params.value}
          </span>
        );
      },
    },
    {
      headerName: t("Department"),
      field: "department",
      minWidth: 100,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const deptNames: Record<string, string> = {
          "mens": "Mens",
          "womens": "Womens",
          "kids": "Kids",
          "accessories": "Accessories"
        };
        return (
          <span style={{
            color: "#595959",
            fontSize: "13px",
            display: "inline-block",
            lineHeight: "20px",
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {deptNames[params.value] || params.value}
          </span>
        );
      },
    },
    {
      headerName: t("Season"),
      field: "season",
      minWidth: 100,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const seasonNames: Record<string, string> = {
          "all-season": "All-season",
          "spring": "Spring",
          "winter": "Winter"
        };
        return (
          <span style={{
            color: "#595959",
            fontSize: "13px",
            display: "inline-block",
            lineHeight: "20px",
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {seasonNames[params.value] || params.value}
          </span>
        );
      },
    },
    {
      headerName: t("Preferred Zone"),
      field: "preferredZone",
      minWidth: 110,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        return (
          <span style={{
            color: "#595959",
            fontSize: "13px",
            display: "inline-block",
            lineHeight: "20px",
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {params.value}
          </span>
        );
      },
    },
    {
      headerName: t("Bin Type"),
      field: "binType",
      minWidth: 110,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const typeNames: Record<string, string> = {
          "hanging": "Hanging",
          "folded": "Folded",
          "shelf": "Shelf",
          "retail-display": "Retail Display"
        };

        return (
          <span style={{
            color: "#595959",
            fontSize: "13px",
            display: "inline-block",
            lineHeight: "20px",
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {typeNames[params.value] || params.value}
          </span>
        );
      },
    },
    {
      headerName: t("Priority"),
      field: "priority",
      minWidth: 70,
      flex: 0.5,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        return (
          <span style={{
            color: "#595959",
            fontSize: "13px",
            display: "inline-block",
            lineHeight: "20px",
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 400
          }}>
            {params.value}
          </span>
        );
      },
    },
    {
      headerName: t("Status"),
      field: "status",
      minWidth: 80,
      flex: 0.5,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const isActive = params.value === "active";

        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus(params.data.id);
            }}
            style={{
              cursor: "pointer",
              width: "40px",
              height: "20px",
              position: "relative",
              display: "inline-block"
            }}
          >
            <ExtinctSwitch ></ExtinctSwitch>
          </div>
        );
      },
    },
    {
      headerName: t("Actions"),
      field: "actions",
      minWidth: 80,
      flex: 0.5,
      sortable: false,
      filter: false,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        return (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Tooltip title={t("Edit")} placement="top">
              <ButtonComponent
                type="text"
                onClickEvent={() => onEdit(params.data)}
                style={{
                  padding: "0",
                  minWidth: "24px",
                  height: "24px",
                  color: "#1890ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <EditOutlined style={{ fontSize: '14px' }} />
              </ButtonComponent>
            </Tooltip>
            <Tooltip title={t("Delete")} placement="top">
              <ButtonComponent
                type="text"
                onClickEvent={() => console.log("Delete", params.data)}
                style={{
                  padding: "0",
                  minWidth: "24px",
                  height: "24px",
                  color: "#f5222d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <DeleteOutlined style={{ fontSize: '14px' }} />
              </ButtonComponent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // Status data - Simple design matching first image
  const statusData = [
    { label: "Total Rules", value: 6 },
    { label: "Active Rules", value: 6 },
    { label: "Inactive Rules", value: 0 },
  ];

  // Function to handle search input change
  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Function to handle status click
  const handleStatusClick = (status: string) => {
    setActiveStatus(status);
    console.log(`Filtering rules by: ${status}`);
  };

  return (
    <>
      <div>
        <Header
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {t("Allocation Rules")}
            </span>
          }
          description={t("Define automatic bin assignment rules for apparel inventory")}
          buttonLable={<div ref={addNewBtnRef}>{t("Add Rule")}</div>}
          onClick={() => router.push("/dashboard/admin-bins/createRule")}
          buttonTooltip="Alt + N"


        />
      </div>

      {/* Status Cards - Updated design */}
      <div className={styles.statusCardsContainer}>
        <div className={styles.statusCardsRow}>
          {statusData.map((item) => (
            <div
              key={item.label}
              className={`${styles.statusCard} ${activeStatus === item.label ? styles.activeCard : ''}`}
              onClick={() => handleStatusClick(item.label)}
              style={{
                backgroundColor: activeStatus === item.label ? '#f0f7ff' : 'white',
                border: activeStatus === item.label ? '1px solid #1890ff' : '1px solid #f0f0f0',
                borderRadius: '8px',
                // padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div className={styles.statusTextContainer}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>

                  <div className={styles.statusLabel} style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#262626'
                  }}>
                    {t(item.label)}
                  </div>
                </div>
              </div>
              <div className={styles.statusValue} style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#1890ff'
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* ✅ AG Grid Container - Simple design */}
      <div
        className={`ag-theme-quartz procurement-aggrid ${theme === 'dark' ? 'ag-theme-quartz-dark' : ''}`}
        style={{
          height: "calc(90vh - 280px)",
          width: "100%",
          marginTop: "16px",
          borderRadius: "4px",
          overflow: "hidden",
          border: "1px solid #e8e8e8",
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
        onContextMenu={() => false}
      >
        <AgGridReact
          ref={gridRef}
          rowData={tableData}
          columnDefs={columnDefs}

          // ✅ Simple design matching first image
          rowHeight={40}
          headerHeight={36}

          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            filterParams: {
              buttons: ['apply', 'reset', 'clear'],
              closeOnApply: true,
            },
          }}

          suppressRowHoverHighlight
          suppressClickEdit
          animateRows={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}

          // ✅ Row click functionality
          onRowClicked={(params) => {
            const e = params.event as any;
            // Ignore clicks on buttons and other interactive elements
            if (e?.target?.closest?.("button")) {
              return;
            }
            onEdit(params.data);
          }}

          // ✅ Grid ready callback
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}


        />
      </div>
    </>
  );
};

export default BinTab;