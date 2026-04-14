"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import Header from '../../Header/Header';
import { t } from 'i18next';
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import InputComponent from '../../InputComponent/InputComponent';
import Tooltip from 'antd/lib/tooltip';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
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

// ✅ Register same modules as VoucherTypeTable
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,

]);

type BinTabProps = {
  binTabData?: any;
  binAllocationTabData: any;
}

const BinAllocationTab = ({ binTabData, binAllocationTabData }: BinTabProps) => {
  console.log("binAllocationTabData", binAllocationTabData)
  const addNewBtnRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("Total Allocations");
  const gridRef = useRef<any>(null);
  const router = useRouter();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLDivElement>(null);
  // 🌙 Dark mode support (same as VoucherTypeTable)
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  // Fix: Ensure tableData is always an array
  const [tableData, setTableData] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);

  useEffect(() => {
    console.log("binAllocationTabData received:", binAllocationTabData);

    //  Do nothing if data not ready
    if (!binAllocationTabData) return;

    let initialData: any[] = [];

    if (
      binAllocationTabData?.binAllocationList &&
      Array.isArray(binAllocationTabData.binAllocationList)
    ) {
      initialData = binAllocationTabData.binAllocationList;
    } else if (Array.isArray(binAllocationTabData)) {
      initialData = binAllocationTabData;
    }

    console.log("Setting tableData to:", initialData);

    //  FIX: Always update, even if empty
    setTableData(initialData);

    if (
      binAllocationTabData?.statusDropDown &&
      Array.isArray(binAllocationTabData.statusDropDown)
    ) {
      setStatusOptions(binAllocationTabData.statusDropDown);
    }
    console.log("calling")
  }, [binAllocationTabData]);

  const filterByStatus = (statusLabel: string) => {
    console.log("Filtering by status:", statusLabel, tableData);

    if (!tableData || tableData.length === 0) return [];

    // Map status labels to filter logic
    if (statusLabel === "Total Allocations") {
      return [...tableData];
    }

    if (statusLabel === "Allocated") {
      return tableData.filter((x: any) =>
        x.used_qty > 0 && x.used_qty < x.total_capacity
      );
    }

    if (statusLabel === "Full") {
      return tableData.filter((x: any) =>
        x.used_qty >= x.total_capacity && x.total_capacity > 0
      );
    }

    if (statusLabel === "Available") {
      return tableData.filter((x: any) =>
        x.used_qty === 0 || !x.used_qty
      );
    }

    return [];
  };

  useEffect(() => {
    console.log("calling")

    const onThemeChanged = (e: any) => {
      setTheme((e?.detail as "light" | "dark") ?? "light");
    };
    window.addEventListener("icube-theme-changed", onThemeChanged);
    return () =>
      window.removeEventListener("icube-theme-changed", onThemeChanged);

  }, []);

  const onEdit = (rowData: any) => {
    console.log("Editing bin allocation: ", rowData);
    // Navigate to edit page with the bin allocation ID
    router.push(`/dashboard/admin-bins/editAllocation?id=${rowData.bin_id}`);

  };

  const onDelete = (rowData: any) => {
    console.log("Deleting bin allocation: ", rowData);
    // Show confirmation and remove from table
    if (window.confirm(`Are you sure you want to delete allocation ${rowData.bin_code}?`)) {
      const newData = tableData.filter(item => item.allocation_id !== rowData.allocation_id);
      setTableData(newData);
      const result = filterByStatus(activeStatus);
      setFilteredData(result);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault();
            createNewAllocation();
            break;

          case 'f':
            event.preventDefault();
            // Try multiple selectors to find the input
            const searchInput = document.querySelector('.searchInput input') ||
              document.querySelector('input[placeholder*="Search"]');
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
  }, []); // Empty dependency array
  // Update filtered data when activeStatus or tableData changes
  // Update filtered data when activeStatus or tableData changes
  // Update filtered data when activeStatus, tableData, or searchTerm changes
  useEffect(() => {
    console.log("activeStatus changed:", activeStatus);
    console.log("tableData changed:", tableData);
    console.log("searchTerm changed:", searchTerm);
    console.log("calling")

    // Get status-filtered data first
    const statusFilteredData = filterByStatus(activeStatus);

    // If there's a search term, apply it
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = statusFilteredData.filter((item: any) => {
        return (
          (item.bin_code?.toLowerCase() || '').includes(searchLower) ||
          (item.locationName?.toLowerCase() || '').includes(searchLower) ||
          (item.assignedCategory?.toLowerCase() || '').includes(searchLower) ||
          (getStatusName(item.status)?.toLowerCase() || '').includes(searchLower)
        );
      });
      setFilteredData(filtered);
    }
    else {
      setFilteredData(statusFilteredData);
    }
  }, [activeStatus, tableData, searchTerm]);

  // Helper function to get status name by ID
  const getStatusName = (statusId: number) => {
    if (!statusOptions || statusOptions.length === 0) return "Unknown";
    const status = statusOptions.find(s => s.id === statusId);
    return status ? status.name : "Unknown";
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // ✅ AG GRID COLUMN DEFINITIONS matching your data structure
  const columnDefs = [
    {
      headerName: t("Bin Number"),
      field: "bin_code",
      width: 200,
      // flex: 1,
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
      headerName: t("Location"),
      field: "locationName",
      width: 200,
      // flex: 1.5,
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: t("Category"),
      field: "assignedCategory",
      width: 200,
      // flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data || !params.value) return null;
        const category = params.value?.toLowerCase();
        const categoryColors: Record<string, string> = {
          "test dept": "blue",
          "recycling": "green",
          "general waste": "volcano",
          "organic": "orange",
          "plastic": "blue",
          "paper": "geekblue",
          "metal": "cyan",
        };

        return (
          <Tag
            color={categoryColors[category] || "default"}
            style={{ textAlign: "center", padding: "2px 8px", minWidth: "80px" }}
          >
            {params.value}
          </Tag>
        );
      }
    },

    {
      headerName: t("Capacity"),
      field: "total_capacity",
      width: 200,
      // flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params?.data) return null;
        return (
          <span style={{ fontWeight: 500 }}>
            {params.value}
          </span>
        );
      }
    },

    {
      headerName: t("Used Qty"),
      field: "used_qty",
      width: 200,
      // flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params?.data) return null;
        return (
          <span style={{ fontWeight: 500, color: params.value > 0 ? "#f5222d" : "#52c41a" }}>
            {params.value}
          </span>
        );
      }
    },
    {
      headerName: t("Status"),
      field: "status",
      width: 200,
      // flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      // Remove valueGetter - we'll calculate in cellRenderer
      cellRenderer: (params: any) => {
        if (!params.data) return null;

        const usedQty = params.data.used_qty || 0;
        const capacity = params.data.total_capacity || 0;

        // Determine status based on used_qty vs capacity
        let statusType = "";
        let statusText = "";

        if (usedQty === 0) {
          statusType = "available";
          statusText = "Available";
        } else if (usedQty >= capacity && capacity > 0) {
          statusType = "full";
          statusText = "Full";
        } else if (usedQty > 0 && usedQty < capacity) {
          statusType = "allocated";
          statusText = "Allocated";
        } else {
          statusType = "unknown";
          statusText = "Unknown";
        }

        const statusConfig: Record<string, { color: string, bgColor: string }> = {
          "allocated": { color: "#1677ff", bgColor: "rgba(22, 119, 255, 0.1)" },
          "full": { color: "#f5222d", bgColor: "rgba(245, 34, 45, 0.1)" },
          "available": { color: "#fa8c16", bgColor: "rgba(250, 140, 22, 0.1)" },
          "unknown": { color: "#8c8c8c", bgColor: "#f5f5f5" },
        };

        const config = statusConfig[statusType];

        return (
          <div
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
              padding: "4px 10px",
              borderRadius: "16px",
              display: "inline-block",
              fontSize: "12px",
              fontWeight: 500,
              textAlign: "center",
              lineHeight: "16px",
              border: `1px solid ${config.color}`,
              width: "90px",
            }}
          >
            {statusText}
          </div>
        );
      }
    },
    {
      headerName: t("Allocation Date"),
      field: "allocation_date",
      width: 240,
      // flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      valueGetter: (params: any) => {
        return formatDate(params.data?.allocation_date);
      },
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        return (
          <span style={{ fontSize: "13px" }}>
            {params.value}
          </span>
        );
      }
    },

  ];
  console.log("columnDefs", columnDefs)
  // Status data for cards - updated to use your status IDs
  // Status data for cards - based on used_qty vs capacity
  const statusData = useMemo(() => {
    if (!Array.isArray(tableData) || tableData.length === 0) {
      return [
        { label: "Total Allocations", value: 0, statusId: -1 },
        { label: "Allocated", value: 0, statusId: 3 },
        { label: "Full", value: 0, statusId: 4 },
        { label: "Available", value: 0, statusId: 5 },
      ];
    }

    const total = tableData.length;

    // Calculate based on used_qty vs total_capacity
    const allocated = tableData.filter((x: any) =>
      x.used_qty > 0 && x.used_qty < x.total_capacity
    ).length;

    const full = tableData.filter((x: any) =>
      x.used_qty >= x.total_capacity && x.total_capacity > 0
    ).length;

    const available = tableData.filter((x: any) =>
      x.used_qty === 0 || !x.used_qty
    ).length;

    return [
      { label: "Total Allocations", value: total, statusId: -1 },
      { label: "Allocated", value: allocated, statusId: 3 },
      { label: "Full", value: full, statusId: 4 },
      { label: "Available", value: available, statusId: 5 },
    ];
  }, [tableData]);

  // Function to handle search input change
  // Function to handle search input change
  const onSearch = (value: string) => {
    setSearchTerm(value);

    // First, get the status-filtered data
    const statusFilteredData = filterByStatus(activeStatus);

    if (!value.trim()) {
      // If search is empty, just show status-filtered data
      setFilteredData(statusFilteredData);
      return;
    }

    // Apply search filter on top of status-filtered data
    const searchLower = value.toLowerCase();
    const filtered = statusFilteredData.filter((item: any) => {
      return (
        (item.bin_code?.toLowerCase() || '').includes(searchLower) ||
        (item.locationName?.toLowerCase() || '').includes(searchLower) ||
        (item.assignedCategory?.toLowerCase() || '').includes(searchLower) ||
        (getStatusName(item.status)?.toLowerCase() || '').includes(searchLower)
      );
    });

    setFilteredData(filtered);
  };

  // Function to handle status click
  // Function to handle status click
  const handleStatusClick = (status: string) => {
    setActiveStatus(status);

    // Get status-filtered data
    const statusFilteredData = filterByStatus(status);

    // If there's an active search term, apply it to the status-filtered data
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = statusFilteredData.filter((item: any) => {
        return (
          (item.bin_code?.toLowerCase() || '').includes(searchLower) ||
          (item.locationName?.toLowerCase() || '').includes(searchLower) ||
          (item.assignedCategory?.toLowerCase() || '').includes(searchLower) ||
          (getStatusName(item.status)?.toLowerCase() || '').includes(searchLower)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(statusFilteredData);
    }
  };

  // Function to create new allocation
  const createNewAllocation = () => {
    router.push("/dashboard/admin-bins/createAllocation");
  };

  return (
    <>
      <div>
        <Header
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {t("Bin Allocations")}
            </span>
          }
          description={t("View and manage all bin allocations")}
          onClick={createNewAllocation}
          buttonTooltip="Alt + N"  // This adds tooltip to the main button
          customRightSideButton={
            <div style={{ display: "flex", gap: "20px" }}>
              <Tooltip title="Alt + E" placement="bottom">
                <ButtonComponent type="default">
                  {t("Export")}
                </ButtonComponent>
              </Tooltip>
              <Tooltip title="Alt + N" placement="bottom">
                <ButtonComponent type="primary" onClickEvent={() => createNewAllocation()}>
                  {t("Create New Allocation")}
                </ButtonComponent>
              </Tooltip>
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

      {/* Search Bar */}
      <div className={styles.filterContainer}>
        <Tooltip title="Alt + F" placement="top">
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
            animateRows={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
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

export default BinAllocationTab;