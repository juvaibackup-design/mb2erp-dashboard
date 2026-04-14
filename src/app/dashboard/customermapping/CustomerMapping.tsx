'use client';

import { Row, Col, Card, Tabs, Segmented, Input, Button } from 'antd';
import styles from '@/app/dashboard/dashboard.module.css'; // reuse same css
import { useMemo, useState } from 'react';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';

import { ModuleRegistry, ClientSideRowModelModule, TextFilterModule, ValidationModule, DateFilterModule, NumberFilterModule,  } from 'ag-grid-community';
import "@/lib/antdOverwrittenCss/global.css";


ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,

]);

export default function CustomerMappingPage() {

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
  // ✅ Common Column Definition
  const columnDefs: any = useMemo(() => [
    { headerName: 'Mindbody ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Phone', field: 'phone' },
    { headerName: 'D365 Account', field: 'account' },
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
    { id: 'MB-10001', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-555-0101', account: 'CUST-001', location: 'Downtown', status: 'Mapped' },
    { id: 'MB-10002', name: 'Michael Chen', email: 'mchen@email.com', phone: '+1-555-0102', account: 'CUST-002', location: 'Uptown', status: 'Mapped' },
    { id: 'MB-10003', name: 'Emma Williams', email: 'emma@email.com', phone: '+1-555-0103', account: 'Not mapped', location: 'Downtown', status: 'Pending' },
    { id: 'MB-10004', name: 'James Brown', email: 'jbrown@email.com', phone: '+1-555-0104', account: 'Not mapped', location: 'Midtown', status: 'Duplicate' },
  ];

  const foodicsData = [
    { id: 'FD-20001', name: 'Ali', email: 'ali@email.com', phone: '999999', account: 'CUST-010', location: 'Riyadh', status: 'Mapped' },
  ];

  const rowData = tab === 'MindBody' ? mindbodyData : foodicsData;

  return (
    <div className={styles.dashboardContainer}>

      {/* HEADER */}
      <h1 className={styles.dashboardTitle}>Customer Mapping</h1>
      <p className={styles.dashboardSubtitle}>
        Map Mindbody clients to D365 customer accounts
      </p>

      {/* KPI CARDS */}
      <Row gutter={16} style={{ marginTop: 20 }}>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Total Customers</div>
            <div className={styles.kpiValue}>5</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Mapped</div>
            <div className={`${styles.kpiValue} ${styles.successText1}`}>
              3
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Pending Review</div>
            <div className={`${styles.kpiValue} ${styles.pendingText}`}>3</div>

          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Blocked/Duplicate</div>
            <div className={`${styles.kpiValue} ${styles.failedText}`}>
              1
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
          <div className={styles.cardTitle}>Customer List</div>
          <div className={styles.cardSubTitle}>
            {tab === 'MindBody' ? "Manage Mindbody to D365 customer mappings":"Manage Foodics to D365 customer mappings"}
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
              <Button icon={<UploadOutlined />}>Import</Button>
              <Button icon={<DownloadOutlined />}>Export</Button>
            </div>
          </div>

          {/* TABLE */}
          <div className="ag-theme-quartz procurement-aggrid" style={{ height: "300px", width: '100%', marginTop: "15px" }} onContextMenu={() => false}>

            <AgGridReact
              rowData={mindbodyData}
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