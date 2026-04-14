'use client';

import { Row, Col, Card, Tabs, Segmented, Input, Button } from 'antd';
import styles from '@/app/dashboard/dashboard.module.css'; // reuse same css
import { useMemo, useState } from 'react';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';

import { ModuleRegistry, ClientSideRowModelModule, TextFilterModule, ValidationModule, DateFilterModule, NumberFilterModule } from 'ag-grid-community';
import { SetFilterModule } from 'ag-grid-enterprise';
import "@/lib/antdOverwrittenCss/global.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,

]);

export default function Reconciliation() {



  // ✅ Common Column Definition
  const chartData = [
    { date: 'Feb 19', mindbody: 900, d365: 100, variance: 800 },
    { date: 'Feb 18', mindbody: 5200, d365: 0, variance: 5200 },
    { date: 'Feb 17', mindbody: 3800, d365: 0, variance: 3800 },
    { date: 'Feb 16', mindbody: 3200, d365: 0, variance: 3200 },
    { date: 'Feb 15', mindbody: 4500, d365: 0, variance: 4500 },
  ];
  const locationData = [
    {
      location: 'Downtown Branch',
      mindbody: 450,
      d365: 350,
      variance: 100,
      unposted: 2,
      status: 'Variance'
    },
    {
      location: 'Uptown Branch',
      mindbody: 270,
      d365: 270,
      variance: 0,
      unposted: 0,
      status: 'Matched'
    },
    {
      location: 'Midtown Branch',
      mindbody: 184.44,
      d365: 28.48,
      variance: 155.96,
      unposted: 1,
      status: 'Variance'
    }
  ];


  const locationColumnDefs: any = [
    { headerName: 'Location', field: 'location', flex: 1 },

    {
      headerName: 'Mindbody Total',
      field: 'mindbody',
      valueFormatter: (p: any) => `$${p.value.toFixed(2)}`
    },

    {
      headerName: 'D365 Posted',
      field: 'd365',
      valueFormatter: (p: any) => `$${p.value.toFixed(2)}`
    },

    {
      headerName: 'Variance',
      field: 'variance',
      valueFormatter: (p: any) => `$${p.value.toFixed(2)}`,
      cellStyle: (params: any) => ({
        color: params.value === 0 ? '#16a34a' : '#dc2626',
        fontWeight: 500
      })
    },

    {
      headerName: 'Unposted Txns',
      field: 'unposted'
    },

    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        const value = params.value;

        const isMatched = value === 'Matched';

        return (
          <span style={{
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 12,
            background: isMatched ? '#dcfce7' : '#fee2e2',
            color: isMatched ? '#16a34a' : '#dc2626'
          }}>
            {value}
          </span>
        );
      }
    }
  ];
  const paymentData = [
    {
      method: 'Credit Card',
      mindbody: 654.44,
      d365: 498.48,
      variance: 155.96,
      count: 5
    },
    {
      method: 'Cash',
      mindbody: 150.00,
      d365: 150.00,
      variance: 0,
      count: 2
    },
    {
      method: 'Bank Transfer',
      mindbody: 100.00,
      d365: 0,
      variance: 100.00,
      count: 1
    }
  ];
  const paymentColumnDefs: any = [
    { headerName: 'Payment Method', field: 'method', flex: 1 },

    {
      headerName: 'Mindbody Total',
      field: 'mindbody',
      valueFormatter: (p: any) => `$${p.value.toFixed(2)}`
    },

    {
      headerName: 'D365 Posted',
      field: 'd365',
      valueFormatter: (p: any) => `$${p.value.toFixed(2)}`
    },

    {
      headerName: 'Variance',
      field: 'variance',
      valueFormatter: (p: any) => `$${p.value.toFixed(2)}`,
      cellStyle: (params: any) => ({
        color: params.value === 0 ? '#16a34a' : '#dc2626',
        fontWeight: 500
      })
    },

    {
      headerName: 'Txn Count',
      field: 'count'
    }
  ];
  const rootCauseData = [
  {
    title: 'Customer mapping missing',
    sub: '1 transaction blocked',
    amount: 79.99,
    percent: '31.2% of variance'
  },
  {
    title: 'D365 API timeout',
    sub: '1 transaction blocked',
    amount: 199.99,
    percent: '78.1% of variance'
  },
  {
    title: 'Pending validation',
    sub: '1 transaction blocked',
    amount: 99.99,
    percent: 'Processing'
  }
];
  return (
    <div className={styles.dashboardContainer}>

      <h1 className={styles.dashboardTitle}>Reconciliation</h1>
      <p className={styles.dashboardSubtitle}>
        Compare Mindbody totals with D365 posted amounts
      </p>

      {/* KPI CARDS */}
      <Row gutter={16} style={{ marginTop: 20 }}>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Mindbody Total</div>
            <div className={styles.kpiValue}>$904.44</div>
            <div className={styles.kpiSub}>Source system</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>D365 Posted Total</div>
            <div className={styles.kpiValue}>$648.48</div>
            <div className={styles.kpiSub}>ERP posted</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Variance</div>
            <div className={`${styles.kpiValue} ${styles.failedText}`}>
              $255.96
            </div>
            <div className={styles.kpiSub}>28.3% difference</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Match Rate</div>
            <div className={`${styles.kpiValue} ${styles.successText1}`}>
              62.5%
            </div>
            <div className={styles.successText1}>↑ Target: 95%+</div>
          </Card>
        </Col>

      </Row>


      <Card className={styles.customCard} style={{ marginTop: 20 }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          <div>
            <div className={styles.cardTitle}>Daily Reconciliation Trend</div>
            <div className={styles.cardSubTitle}>
              5-day comparison of Mindbody vs D365 totals
            </div>
          </div>

          {/* DROPDOWN */}
          <select className={styles.dropdown}>
            <option>All Locations</option>
            <option>Downtown</option>
            <option>Uptown</option>
          </select>

        </div>

        {/* CHART */}
        <div style={{ marginTop: 20 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="mindbody" fill="#3b82f6" name="Mindbody Total" />
              <Bar dataKey="d365" fill="#10b981" name="D365 Posted" />
              <Bar dataKey="variance" fill="#ef4444" name="Variance" />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </Card>
      <Card className={styles.customCard} style={{ marginTop: 20 }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          <div>
            <div className={styles.cardTitle}>Reconciliation by Location</div>
            <div className={styles.cardSubTitle}>
              Branch-level variance analysis
            </div>
          </div>

          <Button icon={<DownloadOutlined />}>Export</Button>

        </div>

        {/* AG GRID */}
        <div
          className="ag-theme-quartz procurement-aggrid"
          style={{ height: 250, width: '100%', marginTop: 20 }}
        >
          <AgGridReact
            rowData={locationData}
            columnDefs={locationColumnDefs}
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
      <Card className={styles.customCard} style={{ marginTop: 20 }}>

        {/* HEADER */}
        <div>
          <div className={styles.cardTitle}>Reconciliation by Payment Method</div>
          <div className={styles.cardSubTitle}>
            Payment type breakdown and variance
          </div>
        </div>

        {/* TABLE */}
        <div
          className="ag-theme-quartz procurement-aggrid"
          style={{ height: 220, width: '100%', marginTop: 20 }}
        >
          <AgGridReact
            rowData={paymentData}
            columnDefs={paymentColumnDefs}
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
      <Card className={styles.customCard} style={{ marginTop: 20 }}>

  {/* HEADER */}
  <div>
    <div className={styles.cardTitle}>Variance Root Causes</div>
    <div className={styles.cardSubTitle}>
      Breakdown of unreconciled amounts
    </div>
  </div>

  {/* LIST */}
  <div style={{ marginTop: 20 }}>

    {rootCauseData.map((item, index) => (
      <div key={index} className={styles.rootCauseItem}>

        {/* LEFT */}
        <div>
          <div className={styles.rootTitle}>{item.title}</div>
          <div className={styles.rootSub}>{item.sub}</div>
        </div>

        {/* RIGHT */}
        <div style={{ textAlign: 'right' }}>
          <div className={styles.rootAmount}>
            ${item.amount.toFixed(2)}
          </div>
          <div className={styles.rootPercent}>
            {item.percent}
          </div>
        </div>

      </div>
    ))}

  </div>

</Card>
    </div>
  );
}