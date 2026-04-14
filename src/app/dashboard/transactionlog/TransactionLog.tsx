'use client';

import { Row, Col, Card, Tabs, Segmented, Input, Button } from 'antd';
import styles from '@/app/dashboard/dashboard.module.css'; // reuse same css
import { useMemo, useState } from 'react';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';

import { ModuleRegistry, ClientSideRowModelModule, TextFilterModule, ValidationModule, DateFilterModule, NumberFilterModule } from 'ag-grid-community';
import { SetFilterModule } from 'ag-grid-enterprise';
import "@/lib/antdOverwrittenCss/global.css";


ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,

]);

export default function TransactionLog() {

  const items = [
    {
      key: '1',
      label: 'MindBody',
      children: <div>MindBody Content</div>,
    },
    {
      key: '2',
      label: 'Foodics',
      children: <div>Foodics Content</div>,
    },
  ];
  const [tab, setTab] = useState('MindBody');
  const [statusFilter, setStatusFilter] = useState('All');
  // ✅ Common Column Definition
  const columnDefs: any = useMemo(() => [
    { headerName: 'Mindbody ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Type', field: 'type' },
    { headerName: 'D365 Item ID', field: 'itemid' },

    { headerName: 'Location', field: 'location' },

    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        const value = params.value;

        let color = '#16a34a';
        let bg = '#dcfce7';

        if (value === 'Pending') {
          color = '#d97706';
          bg = '#fef3c7';
        }
        if (value === 'Duplicate') {
          color = '#dc2626';
          bg = '#fee2e2';
        }

        return (
          <span style={{
            padding: '4px 10px',
            borderRadius: 20,
            background: bg,
            color: color,
            fontSize: 12
          }}>
            {value}
          </span>
        );
      }
    },

    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: () => (
        <span style={{ color: '#2563eb', cursor: 'pointer' }}>
          Map
        </span>
      )
    }
  ], []);

  // ✅ Data for both tabs
  const mindbodyData = [
    { id: 'MB-PROD-001', name: 'Monthly Membership - Premium', type: 'Membership', itemid: 'ITEM-MEM-001', location: 'Downtown', status: 'Posted' },

    { id: 'MB-PROD-002', name: 'Personal Training Session', type: 'Membership', itemid: 'ITEM-SRV-002', location: 'Uptown', status: 'Posted' },

    { id: 'MB-PROD-003', name: 'Yoga Mat - Premium', type: 'Membership', itemid: 'Not mapped', location: 'Downtown', status: 'Pending' },

    { id: 'MB-PROD-004', name: '10 Session Package', type: 'Membership', itemid: 'ITEM-PKG-004', location: 'Midtown', status: 'Blocked' },

    { id: 'MB-PROD-005', name: 'Refund Item', type: 'Membership', itemid: 'ITEM-REF-005', location: 'Downtown', status: 'Failed' },
  ];

  const foodicsData = [
    { id: 'FD-20001', name: 'Ali', email: 'ali@email.com', phone: '999999', account: 'CUST-010', location: 'Riyadh', status: 'Mapped' },
  ];

  const rowData = tab === 'MindBody' ? mindbodyData : foodicsData;

  const filteredData =
    statusFilter === 'All'
      ? mindbodyData
      : mindbodyData.filter((row) => row.status === statusFilter);

  return (
    <div className={styles.dashboardContainer}>

      {/* HEADER */}
      <h1 className={styles.dashboardTitle}>Transaction Log</h1>
      <p className={styles.dashboardSubtitle}>
        Monitor and manage all integration transactions
      </p>

      {/* KPI CARDS */}
      <Row gutter={16} style={{ marginTop: 20 }}>

        <Col span={4}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Total</div>
            <div className={styles.kpiValue}>5</div>
          </Card>
        </Col>

        <Col span={5}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Posted</div>
            <div className={`${styles.kpiValue} ${styles.successText1}`}>
              4
            </div>
          </Card>
        </Col>
        <Col span={5}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Failed</div>
            <div className={`${styles.kpiValue} ${styles.failedText}`}>
              1
            </div>
          </Card>
        </Col>
        <Col span={5}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Pending</div>
            <div className={`${styles.kpiValue} ${styles.pendingText}`}>1</div>

          </Card>
        </Col>

        <Col span={5}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Blocked</div>
            <div className={`${styles.kpiValue} ${styles.failedText}`}>
              2
            </div>
          </Card>
        </Col>

      </Row>


      <Segmented
        value={tab}
        onChange={(val) => setTab(val)}
        options={[
          { label: 'MindBody', value: 'MindBody' },
          { label: 'Foodics', value: 'Foodics' },
        ]}
        className={styles.customSegment}
      />

      <Card className={styles.customCard} style={{ marginTop: 20 }}>

        {/* HEADER */}
        <div className={styles.cardTitle}>Product/Service List</div>
        <div className={styles.cardSubTitle}>
          {tab === 'MindBody' ? "View and manage Mindbody transaction status" : "View and manage Foodics transaction status"}
        </div>

        {/* ACTION BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 20
        }}>
          <Input
            placeholder="Search by name, email, or Mindbody ID..."
            style={{ width: 350 }}
          />

          <div style={{ display: 'flex', gap: 10 }}>
            <Button icon={<DownloadOutlined />}>Export Log</Button>
          </div>
        </div>

        <div className={styles.filterTabs}>
          {['All', 'Posted', 'Failed', 'Pending', 'Blocked'].map((item) => (
            <span
              key={item}
              onClick={() => setStatusFilter(item)}
              className={`${styles.filterTabItem} ${statusFilter === item ? styles.activeFilter : ''
                }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* TABLE */}
        <div className="ag-theme-quartz procurement-aggrid" style={{ height: "300px", width: '100%', marginTop: "15px" }} onContextMenu={() => false}>

          <AgGridReact
            rowData={filteredData}
            columnDefs={columnDefs}
            selectionColumnDef={{
              pinned: "left",        // ✅ keep checkbox column fixed on the left
              width: 50,
              lockPosition: true,
              sortable: false,
              resizable: false,
            }}

            className="ag-theme-quartz"
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
          />
        </div>

      </Card>

    </div>
  );
}