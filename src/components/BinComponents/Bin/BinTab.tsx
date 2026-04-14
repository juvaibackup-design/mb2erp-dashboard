"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import Header from '../../Header/Header';
import { t } from 'i18next';
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import InputComponent from '../../InputComponent/InputComponent';
import Tooltip from 'antd/lib/tooltip';
import { SearchOutlined } from '@ant-design/icons';
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
import { Flex, Tag } from 'antd';
import StatusBadge from '@/components/StatusBadge/StatusBadge';

// ✅ Register same modules as VoucherTypeTable
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,

]);

type BinTabProps = {
  binTabData: any;
  tourRefs?: {
    searchInputRef: React.RefObject<any>;
    statusCardsRef: React.RefObject<any>;
    addNewBtnRef: React.RefObject<any>;
    tableRowRef: React.RefObject<any>;
  };
}

const BinTab = ({ binTabData }: BinTabProps) => {
  console.log("binTabData", binTabData)
  const addNewBtnRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("Total Bins");
  const gridRef = useRef<any>(null);
  const router = useRouter();
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // 🌙 Dark mode support (same as VoucherTypeTable)
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  const filterByStatus = (statusLabel: string, dataToFilter = tableData) => {
    if (!dataToFilter || dataToFilter.length === 0) return [];

    switch (statusLabel) {
      case "Total Bins":
        return dataToFilter;

      case "Active":
        return dataToFilter.filter((x: any) =>
          (x.statusName ?? "").toLowerCase() === "active"
        );

      case "Hanging":
        return dataToFilter.filter((x: any) =>
          (x.storageTypeName ?? "").toLowerCase() === "hanging"
        );

      case "Folded":
        return dataToFilter.filter((x: any) =>
          (x.storageTypeName ?? "").toLowerCase() === "folded"
        );

      case "Retail Display":
        return dataToFilter.filter((x: any) =>
          (x.storageTypeName ?? "").toLowerCase() === "retail display"
        );

      default:
        return dataToFilter;
    }
  };


  // ✅ JUST ADD THIS ONE USE EFFECT - nothing else changes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault();
            // Navigate to create bin page
            router.push("/dashboard/admin-bins/createBin");
            break;

          case 'f':
            event.preventDefault();
            // Focus on search input
            const searchInput = document.querySelector('.searchInput input') || document.querySelector('input[placeholder*="Search"]');
            if (searchInput instanceof HTMLInputElement) {
              searchInput.focus();
              searchInput.select();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]); // Only depends on router



  useEffect(() => {
    const onThemeChanged = (e: any) => {
      setTheme((e?.detail as "light" | "dark") ?? "light");
    };
    window.addEventListener("icube-theme-changed", onThemeChanged);
    return () =>
      window.removeEventListener("icube-theme-changed", onThemeChanged);
  }, []);

  const onEdit = (rowData: any) => {
    console.log("Editing bin: ", rowData);
    // Navigate to edit page with the bin ID
    router.push(`/dashboard/admin-bins/editBin?id=${rowData.id}`);
  };

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (!binTabData?.binListData) return;

    const mapped = binTabData.binListData
      .map((x: any) => ({
        ...x,
        capacity: `${x.current_quantity ?? 0}/${x.total_capacity ?? x.capacity ?? 0}`,
        // Add a timestamp for sorting
        _sortTimestamp: x.updated_at || x.created_at || Date.now()
      }))
      // Sort by timestamp in descending order (newest first)
      .sort((a: any, b: any) => {
        // Handle string dates
        const timeA = typeof a._sortTimestamp === 'string'
          ? new Date(a._sortTimestamp).getTime()
          : a._sortTimestamp;
        const timeB = typeof b._sortTimestamp === 'string'
          ? new Date(b._sortTimestamp).getTime()
          : b._sortTimestamp;

        return timeB - timeA;
      });

    setTableData(mapped);
  }, [binTabData]);

  // Update filtered data when activeStatus, tableData, or searchTerm changes
  useEffect(() => {
    console.log("activeStatus changed:", activeStatus);
    console.log("tableData changed:", tableData);
    console.log("searchTerm changed:", searchTerm);

    if (!tableData || tableData.length === 0) {
      setFilteredData([]);
      return;
    }

    // Get status-filtered data first
    const statusFilteredData = filterByStatus(activeStatus, tableData);

    // If there's a search term, apply it
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = statusFilteredData.filter((item: any) => {
        return (
          (item.bin_code?.toLowerCase() || '').includes(searchLower) ||
          (item.zone?.toLowerCase() || '').includes(searchLower) ||
          (item.locationName?.toLowerCase() || '').includes(searchLower) ||
          (item.grp_name?.toLowerCase() || '').includes(searchLower) ||
          (item.storageTypeName?.toLowerCase() || '').includes(searchLower) ||
          (item.assignedCategory?.toLowerCase() || '').includes(searchLower) ||
          (item.statusName?.toLowerCase() || '').includes(searchLower)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(statusFilteredData);
    }
  }, [activeStatus, tableData, searchTerm]);

  // ✅ AG GRID COLUMN DEFINITIONS with consistent styling
  const columnDefs = [
    {
      headerName: t("Bin Code"),
      field: "bin_code",
      minWidth: 160,
      flex: 1,
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
              color: theme === "dark" ? "rgb(125 149 255)" : "#1677ff",
            }}
          >
            {params.value}
          </ButtonComponent>
        );
      },
    },
    {
      headerName: t("Zone"),
      field: "zone",
      minWidth: 200,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
    },

    {
      headerName: t("Location"),
      field: "locationName",
      minWidth: 200,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: t("Department"),
      field: "grp_name",
      minWidth: 160,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;

        let items = params.value;

        // Convert comma separated → array
        if (typeof items === "string") {
          items = items.split(",").map((x) => x.trim());
        }

        if (!Array.isArray(items)) return items;

        return (
          <Flex wrap="wrap" gap={4} style={{ marginTop: "10px" }}>
            {items.map((d: string, idx: number) => (
              <Tag key={idx}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </Tag>
            ))}
          </Flex>
        );
      }

    },
    {
      headerName: t("Type"),
      field: "storageTypeName",
      minWidth: 160,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;

        let type = params.value;

        // If API gives comma separated list → convert to array
        if (typeof type === "string") {
          type = type.split(",").map(x => x.trim().toLowerCase());
        }

        if (!Array.isArray(type)) {
          type = [String(type).toLowerCase()];
        }

        const typeColors: Record<string, string> = {
          "hanging": "blue",
          "folded": "green",
          "retail display": "magenta",
          "shelf": "purple",
          "rack": "orange",
        };

        return (
          <Flex wrap="wrap" gap={4} style={{ marginTop: "10px" }}>
            {type.map((x: string, idx: number) => (
              <Tag key={idx} color={typeColors[x] || "default"} style={{ textAlign: "center", padding: "2px 6px", width: "80px", }}>
                {x.charAt(0).toUpperCase() + x.slice(1)}
              </Tag>
            ))
            }
          </Flex >
        );
      },
    },

    {
      headerName: t("Category"),
      field: "assignedCategory",
      minWidth: 180,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: t("Capacity"),
      field: "total_capacity",
      minWidth: 180,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params?.data) return null;
        console.log("CAPACITY RAW:", params.value, typeof params.value);

        const raw = String(params?.value ?? "0/0");

        if (!raw.includes('/')) {
          return raw; // fallback for numeric capacity like "100"
        }

        const [used, total] = raw.split('/').map(n => Number(n) || 0);
        const percentage = total > 0 ? (used / total) * 100 : 0;


        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{raw}</span>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: theme === 'dark' ? '#434343' : '#f5f5f5',
              borderRadius: '2px',
              marginTop: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: percentage > 80 ? '#f5222d'
                  : percentage > 50 ? '#fa8c16'
                    : '#52c41a'
              }} />
            </div>
          </div>
        );
      }

    },
    {
      headerName: t("Current Qty"),
      field: "current_quantity",
      minWidth: 140,
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params?.data) return null;
        const qty = params.value || 0;
        const totalCapacity = params.data.total_capacity || 0;

        // Color coding based on capacity utilization
        let color = "#52c41a"; // green
        if (totalCapacity > 0) {
          const utilization = (qty / totalCapacity) * 100;
          if (utilization > 80) {
            color = "#f5222d"; // red
          } else if (utilization > 50) {
            color = "#fa8c16"; // orange
          }
        }

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              fontWeight: 600,
              color: color,
              fontSize: "14px"
            }}>
              {qty}
            </span>
            <span style={{
              fontSize: "12px",
              color: "#8c8c8c"
            }}>
              pcs
            </span>
          </div>
        );
      }
    },
    {
      headerName: t("Utilization"),
      field: "utilization",
      minWidth: 180,
      flex: 1,
      sortable: true,
      filter: false,
      resizable: true,

      valueGetter: (params: any) => {
        const used = Number(params.data?.current_quantity ?? 0);
        const total = Number(params.data?.total_capacity ?? 0);

        if (!total || total === 0) return "0%";

        const percentage = ((used / total) * 100).toFixed(2);
        return `${percentage}%`;
      },

      cellRenderer: (params: any) => {
        if (!params.data) return null;

        const used = Number(params.data?.current_quantity ?? 0);
        const total = Number(params.data?.total_capacity ?? 0);
        const percentage = total > 0 ? (used / total) * 100 : 0;

        let color = "#52c41a"; // Green
        if (percentage > 80) color = "#f5222d"; // Red
        else if (percentage > 50) color = "#fa8c16"; // Orange

        return (
          <span style={{ color, fontWeight: 600 }}>
            {percentage.toFixed(2)}%
          </span>
        );
      },
    },

    {
      headerName: t("Status"),
      field: "statusName",
      minWidth: 180,
      cellRenderer: (params: any) => {
        if (!params.data) return null;

        const value = (params.value ?? "").toLowerCase();

        const colors: Record<string, string> = {
          active: "#52c41a",      // green
          inactive: "#f5222d",    // red
          maintenance: "#faad14", // yellow
        };

        const color = colors[value] || "#1677ff"; // fallback blue

        return (
          <div
            style={{
              border: `1px solid ${color}`,
              color: color,
              padding: "4px 10px",
              borderRadius: "16px",
              display: "inline-block",
              fontSize: "12px",
              fontWeight: 500,
              textAlign: "center",
              lineHeight: "16px",
              background: "transparent",     // important (no fill)
              width: "80px",                 // consistent width
            }}
          >
            {params.value?.charAt(0)?.toUpperCase() + params.value?.slice(1)}
          </div>
        );
      }
    }
  ];

  // Status data
  const statusData = useMemo(() => {
    const total = tableData.length;

    const active = tableData.filter(
      (x: any) => (x.statusName ?? "").toLowerCase() === "active"
    ).length;

    const hanging = tableData.filter((x: any) =>
      (x.storageTypeName ?? "").toLowerCase() === "hanging"
    ).length;

    const folded = tableData.filter((x: any) =>
      (x.storageTypeName ?? "").toLowerCase() === "folded"
    ).length;

    const retail = tableData.filter((x: any) =>
      (x.storageTypeName ?? "").toLowerCase() === "retail display"
    ).length;

    return [
      { label: "Total Bins", value: total },
      { label: "Active", value: active },
      { label: "Hanging", value: hanging },
      { label: "Folded", value: folded },
      { label: "Retail Display", value: retail },
    ];
  }, [tableData]);

  // Function to handle search input change
  const onSearch = (value: string) => {
    setSearchTerm(value);
    // No need to manually filter here - the useEffect will handle it
  };

  // Function to handle status click
  const handleStatusClick = (status: string) => {
    setActiveStatus(status);
    // No need to manually filter here - the useEffect will handle it
  };

  return (
    <>
      <div>
        <Header
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {t("Bin Master Configuration")}
            </span>
          }
          description={t("Configure and manage all storage bins for apparel inventory")}
          buttonLable={<div ref={addNewBtnRef}>
            <span className="add-bin-button">  {/* 👈 ADD THIS CLASS HERE */}
              {t("Add Bin")}
            </span></div>}
          buttonTooltip="Alt + N"
          onClick={() => router.push("/dashboard/admin-bins/createBin")}

          customRightSideButton={
            <div style={{ display: "flex", gap: "8px" }}>
              <ButtonComponent type="text">
                {t("Export")}
              </ButtonComponent>
              <ButtonComponent type="text">
                {t("Import")}
              </ButtonComponent>
            </div>
          }
        />
      </div>

      {/* Status Cards */}
      <div className={styles.statusCardsContainer}>
        <div className={styles.statusCardsRow}>
          {statusData.map((item) => (
            <div
              key={item.label}
              className={`${styles.statusCard} ${activeStatus === item.label ? styles.activeCard : ''}`}
              onClick={() => handleStatusClick(item.label)}
            >
              <div className={styles.statusTextContainer}>
                <div className={styles.statusLabel}>{t(item.label)}</div>
              </div>
              <div className={styles.statusValue}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Container */}
      <div className={styles.filterContainer}>
        <Tooltip title="Alt + F" placement="top" trigger={["hover"]}>
          <div ref={searchInputRef} className={styles.searchInput}>
            <InputComponent
              placeholder={t("Search bins...")}
              value={searchTerm}
              onChangeEvent={(e) => onSearch(e.target.value)}
              addonAfter={<SearchOutlined style={{ color: "#D9D9D9" }} />}
              type="text"
            />
          </div>
        </Tooltip>
      </div>

      {/* ✅ AG Grid Container */}
      <div
        style={{
          height: "calc(100vh - 420px)",
          overflow: "auto",
          marginTop: "8px",
        }}
      >
        <div
          className={`ag-theme-quartz procurement-aggrid ${theme === "dark" ? "ag-theme-quartz-dark" : ""
            }`}
          style={{ height: "100%", width: "100%" }}
          onContextMenu={() => false}
        >
          <AgGridReact
            ref={gridRef}
            rowData={filteredData}
            columnDefs={columnDefs}
            rowHeight={44}
            headerHeight={44}
            domLayout="normal"
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              filterParams: {
                buttons: ["apply", "reset", "clear"],
                closeOnApply: true,
              },
            }}
            suppressRowHoverHighlight
            suppressClickEdit
            animateRows
            enableCellTextSelection
            ensureDomOrder
            // onRowClicked={(params) => {
            //   const e = params.event as any;
            //   if (e?.target?.closest?.("button")) return;
            //   onEdit(params.data);
            // }}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BinTab;