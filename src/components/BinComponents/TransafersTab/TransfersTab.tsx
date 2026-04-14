"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import Header from '../../Header/Header';
import { t } from 'i18next';
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import InputComponent from '../../InputComponent/InputComponent';
import Tooltip from 'antd/lib/tooltip';
import { SearchOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
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
  AllCommunityModule,
} from "ag-grid-community";
import { useRouter } from 'next/navigation';
import { ColDef, CellStyle } from 'ag-grid-community';
import { Button, Dropdown, Menu, message } from 'antd';
import makeApiCall from '@/lib/helpers/apiHandlers/api';

// ✅ Register modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,
  AllCommunityModule,
  SetFilterModule,
]);

type BinTabProps = {
  binTabData?: any;
  binTransferTabData: any
}

interface TransferItem {
  icode: string;
  product_name: string;
  quantity: number;
}

interface TransferData {
  id: number;
  from_bin_code: string;
  to_bin_code: string;
  route: string;
  transfer_type: string;
  priority: string;
  initiated_by: string;
  created_at: string;
  status: string;
  total_items: number;
  items_json: string;
  items?: TransferItem[];
}

const TransferTab = ({ binTabData, binTransferTabData }: BinTabProps) => {
  const addNewBtnRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All Status");
  const gridRef = useRef<any>(null);
  const router = useRouter();

  console.log("binTransferTabData", binTransferTabData);

  // 🌙 Dark mode support
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault();
            // Navigate to create bin page
            router.push("/dashboard/admin-bins/createTransfer");
            break;

          case 'f':
            event.preventDefault();
            // Focus on search input
            const searchInput = document.querySelector('.searchInput input');
            if (searchInput instanceof HTMLInputElement) {
              searchInput.focus();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);
  useEffect(() => {
    const onThemeChanged = (e: any) => {
      setTheme((e?.detail as "light" | "dark") ?? "light");
    };
    window.addEventListener("icube-theme-changed", onThemeChanged);
    return () =>
      window.removeEventListener("icube-theme-changed", onThemeChanged);
  }, []);

  // ✅ Process the data from props
  const processedData = useMemo(() => {
    if (!binTransferTabData?.data || !binTransferTabData.success) return [];

    return binTransferTabData.data.map((record: any) => {
      // Parse items_json if it's a string
      let items: TransferItem[] = [];
      try {
        items = typeof record.items_json === 'string'
          ? JSON.parse(record.items_json)
          : record.items_json || [];
      } catch (e) {
        console.error("Error parsing items_json:", e);
        items = [];
      }

      return {
        id: record.id,
        transferId: `#${record.id}`,
        items: items,
        route: record.route || `${record.from_bin_code} → ${record.to_bin_code}`,
        type: record.transfer_type,
        priority: record.priority,
        initiatedBy: record.initiated_by,
        created: new Date(record.created_at).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }),
        status: record.status,
        total_items: record.total_items,
        from_bin_code: record.from_bin_code,
        to_bin_code: record.to_bin_code,
      };
    });
  }, [binTransferTabData]);

  // Calculate status counts from actual data
  const statusCounts = useMemo(() => {
    const data = processedData;
    return {
      total: data.length,
      pending: data.filter((t: { status: string; }) => t.status?.toLowerCase() === "pending").length,
      inProgress: data.filter((t: { status: string; }) => t.status?.toLowerCase().includes("progress")).length,
      completed: data.filter((t: { status: string; }) => t.status?.toLowerCase() === "completed").length,
      cancelled: data.filter((t: { status: string; }) => t.status?.toLowerCase() === "cancelled").length,
    };
  }, [processedData]);

  // Status cards data
  const statusCards = [
    { label: "All Status", value: statusCounts.total },
    { label: "Pending", value: statusCounts.pending },
    { label: "In Progress", value: statusCounts.inProgress },
    { label: "Completed", value: statusCounts.completed },
    { label: "Cancelled", value: statusCounts.cancelled },
  ];

  // Handle status card click
  // Handle status card click
  // Handle status card click
  // Handle status card click
  const handleStatusClick = (status: string) => {
    console.log("Status clicked:", status);
    setActiveStatus(status);

    if (!gridRef.current?.api) return;

    try {
      // CRITICAL: First check what filter type is being used
      const column = gridRef.current.api.getColumn('status');
      const colDef = column?.getColDef();
      console.log("Column filter type:", colDef?.filter);

      // Clear all filters first
      gridRef.current.api.setFilterModel(null);

      if (status === "All Status") return;

      // Small delay to ensure filter is cleared
      setTimeout(() => {
        try {
          if (!gridRef.current?.api) return;

          const filterValue = String(status).trim();

          // Try different filter model formats based on column config
          const filterModel: any = {};

          // Check if it's using Set Filter
          if (colDef?.filter === 'agSetColumnFilter' || colDef?.filter?.startsWith?.('agSet')) {
            // Set Filter format
            filterModel.status = {
              filterType: 'set',
              values: [filterValue]
            };
          } else {
            // Text Filter format
            filterModel.status = {
              filterType: 'text',
              type: 'equals',
              filter: filterValue
            };
          }

          console.log("Applying filter model:", filterModel);
          gridRef.current.api.setFilterModel(filterModel);

        } catch (innerError) {
          console.error("Filter application error:", innerError);
        }
      }, 100);

    } catch (error) {
      console.error("Error in handleStatusClick:", error);
    }
  };
  const onEdit = (rowData: any) => {
    console.log("Viewing transfer: ", rowData);
    router.push(`/dashboard/admin-bins/transfers/edit/${rowData.id}`);
  };

  // ✅ Items Cell Renderer with Tooltip
  const itemsCellRendererWithTooltip = (params: any) => {
    if (!params.data || !params.data.items || params.data.items.length === 0) return null;

    const items = params.data.items;
    const totalItems = items.length;

    const tooltipContent = items.map((item: any, index: number) => (
      <div key={index} style={{ fontSize: '12px', margin: '2px 0' }}>
        {item.product_name || item.icode} ({item.quantity})
      </div>
    ));

    return (
      <Tooltip
        title={
          <div>
            <div style={{ fontWeight: 500, marginBottom: '4px' }}>All Items:</div>
            {tooltipContent}
          </div>
        }
        placement="right"
        overlayStyle={{ maxWidth: '300px' }}
      >
        <div style={{ padding: '2px 0', cursor: 'pointer' }}>
          <div style={{
            color: theme === 'dark' ? '#d9d9d9' : '#595959',
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: '2px',
            lineHeight: '1.2',
          }}>
            {totalItems} item(s)
          </div>

          {/* Show only first 2 items in the cell */}
          {items.slice(0, 2).map((item: any, index: number) => (
            <div key={index} style={{
              fontSize: '11px',
              color: theme === 'dark' ? '#bfbfbf' : '#666666',
              lineHeight: '1.2',
              marginTop: '1px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {item.product_name || item.icode} ({item.quantity})
            </div>
          ))}

          {totalItems > 2 && (
            <div style={{
              fontSize: '10px',
              color: theme === 'dark' ? '#8c8c8c' : '#999999',
              fontStyle: 'italic',
              marginTop: '2px',
            }}>
              Hover to see all {totalItems} items...
            </div>
          )}
        </div>
      </Tooltip>
    );
  };

  // ✅ AG GRID COLUMN DEFINITIONS
  const columnDefs: ColDef[] = [

    {
      headerName: "Items",
      field: "items",
      width: 250,
      sortable: false,
      filter: false,
      resizable: true,
      cellRenderer: itemsCellRendererWithTooltip,
    },
    {
      headerName: "Route",
      field: "route",
      width: 250,
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: {
        display: 'flex',
        padding: '2px 0',
      } as CellStyle,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        return (
          <div style={{
            fontSize: '12px',
            color: theme === 'dark' ? '#d9d9d9' : '#262626',
            padding: '4px 0',
            whiteSpace: 'nowrap',
            lineHeight: '1.2',
          }}>
            {params.value}
          </div>
        );
      },
    },
    {
      headerName: "Type",
      field: "type",
      width: 200,
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: {
        display: 'flex',
        padding: '2px 0',
      } as CellStyle,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const typeConfig: Record<string, { color: string, bgColor: string, label: string }> = {
          restock: {
            color: theme === 'dark' ? '#73d13d' : '#389e0d',
            bgColor: theme === 'dark' ? '#162312' : '#f6ffed',
            label: 'Restock'
          },
          'floor-display': {
            color: theme === 'dark' ? '#597ef7' : '#1d39c4',
            bgColor: theme === 'dark' ? '#131629' : '#f0f5ff',
            label: 'Floor Display'
          },
          return: {
            color: theme === 'dark' ? '#ff7a45' : '#d4380d',
            bgColor: theme === 'dark' ? '#2b1a14' : '#fff2e8',
            label: 'Return'
          },
          adjustment: {
            color: theme === 'dark' ? '#722ed1' : '#531dab',
            bgColor: theme === 'dark' ? '#1e182a' : '#f9f0ff',
            label: 'Adjustment'
          },
          transfer: {
            color: theme === 'dark' ? '#13c2c2' : '#08979c',
            bgColor: theme === 'dark' ? '#142a2a' : '#e6fffb',
            label: 'Transfer'
          },
        };
        const config = typeConfig[params.value] || {
          color: theme === 'dark' ? '#d9d9d9' : '#8c8c8c',
          bgColor: theme === 'dark' ? '#262626' : '#f5f5f5',
          label: params.value
        };
        return (
          <span
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
              padding: "3px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              display: "inline-block",
              textAlign: "center",
              border: `1px solid ${config.color}20`,
              fontWeight: 500,
              lineHeight: '1.2',
              minWidth: '80px',
              textTransform: 'capitalize',
            }}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      headerName: "Priority",
      field: "priority",
      width: 200,
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: {
        display: 'flex',

        padding: '2px 0',
      } as CellStyle,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const priorityConfig: Record<string, { color: string, bgColor: string }> = {
          high: { color: "#f5222d", bgColor: theme === 'dark' ? '#2a1215' : '#fff1f0' },
          medium: { color: "#fa8c16", bgColor: theme === 'dark' ? '#2b1d11' : '#fff7e6' },
          normal: { color: "#1890ff", bgColor: theme === 'dark' ? '#111d2c' : '#e6f7ff' },
          low: { color: "#52c41a", bgColor: theme === 'dark' ? '#162312' : '#f6ffed' },
        };
        const config = priorityConfig[params.value?.toLowerCase()] || {
          color: theme === 'dark' ? '#d9d9d9' : '#8c8c8c',
          bgColor: theme === 'dark' ? '#262626' : '#f5f5f5'
        };
        return (
          <span
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
              padding: "3px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              display: "inline-block",
              textAlign: "center",
              border: `1px solid ${config.color}20`,
              fontWeight: 500,
              lineHeight: '1.2',
              minWidth: '70px',
              textTransform: 'capitalize',
            }}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      headerName: "Initiated By",
      field: "initiatedBy",
      width: 200,
      sortable: true,
      filter: true,
      resizable: true,

      cellStyle: {
        fontSize: '14px',
        fontWeight: 400,
        padding: '6px 8px',
      } as CellStyle,
    },
    {
      headerName: "Created",
      field: "created",
      width: 200,
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: {
        fontSize: '14px',
        fontWeight: 400,
        padding: '4px 0',
      } as CellStyle,
    },
    {
      headerName: "Status",
      field: "status",
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',  // ← MAKE SURE THIS IS SET
      resizable: true,
      cellStyle: {
        display: 'flex',
        padding: '2px 0',
      } as CellStyle,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const statusConfig: Record<string, { color: string, bgColor: string }> = {
          pending: {
            color: theme === 'dark' ? '#faad14' : '#d48806',
            bgColor: theme === 'dark' ? '#2b2111' : '#fffbe6'
          },
          'in-progress': {
            color: theme === 'dark' ? '#1890ff' : '#096dd9',
            bgColor: theme === 'dark' ? '#111d2c' : '#e6f7ff'
          },
          completed: {
            color: theme === 'dark' ? '#52c41a' : '#389e0d',
            bgColor: theme === 'dark' ? '#162312' : '#f6ffed'
          },
          cancelled: {
            color: theme === 'dark' ? '#ff4d4f' : '#cf1322',
            bgColor: theme === 'dark' ? '#2a1215' : '#fff1f0'
          },
        };
        const statusKey = params.value?.toLowerCase();
        const config = statusConfig[statusKey] || {
          color: theme === 'dark' ? '#d9d9d9' : '#8c8c8c',
          bgColor: theme === 'dark' ? '#262626' : '#f5f5f5'
        };
        return (
          <span
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
              padding: "3px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              display: "inline-block",
              textAlign: "center",
              border: `1px solid ${config.color}20`,
              fontWeight: 500,
              lineHeight: '1.2',
              minWidth: '85px',
              textTransform: 'capitalize',
            }}
          >
            {params.value === 'in-progress' ? 'In Progress' : params.value}
          </span>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 80,
      sortable: false,
      filter: false,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;

        const [visible, setVisible] = useState(false);

        const handleMenuClick = async (newStatus: string) => {
          setVisible(false);
          try {
            const response = await makeApiCall.post("UpdateTransferStatus", {
              transferId: params.data.id,
              status: newStatus
            });

            if (response?.data?.success) {
              const rowNode = gridRef.current.api.getRowNode(params.data.id.toString());
              if (rowNode) {
                rowNode.setDataValue('status', newStatus);
                message.success(`Status updated to ${newStatus}`);
              }
            }
          } catch (error) {
            console.error('Error updating status:', error);
            message.error('Error updating status');
          }
        };

        const menu = (
          <Menu
            onClick={({ key }) => handleMenuClick(key)}
            items={[
              { key: 'Pending', label: 'Pending' },
              { key: 'In Progress', label: 'In Progress' },
              { key: 'Completed', label: 'Completed' },
              { key: 'Cancelled', label: 'Cancelled' },
            ]}
          />
        );

        return (
          <Dropdown
            overlay={menu}
            trigger={['click']}
            open={visible}
            onOpenChange={(flag) => setVisible(flag)}
          >
            <Button
              type="text"
              size="small"
              style={{
                fontSize: '18px',
                padding: '0 8px',
                height: '32px'
              }}
            >
              ⋮
            </Button>
          </Dropdown>
        );
      }
    }
  ];
  console.log("columnDefs", columnDefs)
  return (
    <>
      <div>
        <Header
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {t("Transfer Management")}
            </span>
          }
          description={t("Create and manage multi-item transfers between bins")}
          buttonLable={<div ref={addNewBtnRef}>{t("Create Transfer")}</div>}
          onClick={() => router.push("/dashboard/admin-bins/createTransfer")}
          buttonTooltip="Alt + N"
        />
      </div>

      {/* ✅ Status Cards */}
      <div className={styles.statusCardsContainer}>
        <div className={styles.statusCardsRow}>
          {statusCards.map((item) => (
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
      <div className={styles.filterContainer} style={{ justifyContent: 'space-between' }}>
        <SelectComponent
          placeholder={t("All Status")}
          className={styles.selectComponent}
          style={{ width: '250px' }}
          value={activeStatus}
          onChange={(value) => handleStatusClick(value)}
          options={[
            { label: t("All Status"), value: "All Status" },
            { label: t("Pending"), value: "Pending" },
            { label: t("In Progress"), value: "In Progress" },
            { label: t("Completed"), value: "Completed" },
            { label: t("Cancelled"), value: "Cancelled" },
          ]}
        />
      </div>

      {/* ✅ AG Grid Container */}
      <div
        className={`ag-theme-quartz procurement-aggrid ${theme === 'dark' ? 'ag-theme-quartz-dark' : ''}`}
        style={{
          height: "calc(80vh - 280px)",
          width: "100%",
          marginTop: "16px"
        }}
        onContextMenu={() => false}
      >
        <AgGridReact
          ref={gridRef}
          rowData={processedData}
          columnDefs={columnDefs}

          // ✅ Row height
          rowHeight={60}
          headerHeight={45}

          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            filterParams: {
              buttons: ['apply', 'reset', 'clear'],
              closeOnApply: true,
            },
          }}
          getRowId={(params) => params.data.id.toString()}

          suppressRowHoverHighlight
          suppressClickEdit
          animateRows={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}

          // ✅ Row click functionality
          // onRowClicked={(params) => {
          //   const e = params.event as any;
          //   if (e?.target?.closest?.("button")) {
          //     return;
          //   }
          //   onEdit(params.data);
          // }}

          // ✅ Grid ready callback
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </div>
    </>
  );
};

export default TransferTab;