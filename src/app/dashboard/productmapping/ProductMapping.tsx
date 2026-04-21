'use client';

import { Row, Col, Card, Tabs, Segmented, Input, Button, Typography, Tag } from 'antd';
import styles from '@/app/dashboard/dashboard.module.css'; // reuse same css
import { useEffect, useMemo, useState } from 'react';
import { DownloadOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';

import { ModuleRegistry, ClientSideRowModelModule, TextFilterModule, ValidationModule, DateFilterModule, NumberFilterModule, AllCommunityModule, } from 'ag-grid-community';
import "@/lib/antdOverwrittenCss/global.css";
import InputComponent from '@/components/InputComponent/InputComponent';
import ModalComponent from '@/components/ModalComponent/ModalComponent';
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent';
import { SetFilterModule } from 'ag-grid-enterprise';
import { Product, ProductDashboard } from '@/lib/interfaces/productmapping-interface/productmappinginterface';
import makeApiCall from '@/lib/helpers/apiHandlers/api';

/* =========================================
   AG GRID MODULES
========================================= */
// ✅ v34 needs a row model registered
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,
  AllCommunityModule, // or AllEnterpriseModule
  SetFilterModule
]);

export default function ProductMappingPage() {

  const [tab, setTab] = useState<string>('MindBody');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false); // To control modal visibility
  const [selectedCustomer, setSelectedCustomer] = useState<Product | null>(null); // Store selected customer
  const [dashboard, setDashboard] = useState<ProductDashboard>({
    totalProducts: 0,
    mapped: 0,
    pendingReview: 0,
    blockedDuplicate: 0,
  });
  const [tableData, setTableData] = useState<Product[]>([]);


  const loadCustomers = async (
    type: string
  ) => {
    try {
      setLoading(true);

      const apiType =
        type === 'MindBody'
          ? 'MB'
          : 'Foodics';

      const res =
        await makeApiCall.get(
          `ProductMapping/GetProductList`
        );

      const data = res?.data?.data;

      setDashboard(
        data?.productDashboard || {
          totalProducts: 0,
          mapped: 0,
          pendingReview: 0,
          blockedDuplicate: 0,
        }
      );

      setTableData(
        data?.product?.data || []
      );
    } catch (error) {
      console.log(
        'Customer API Error',
        error
      );

      setDashboard({
        totalProducts: 0,
        mapped: 0,
        pendingReview: 0,
        blockedDuplicate: 0,
      });

      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(tab);
  }, [tab]);



  // ✅ Common Column Definition
  const columnDefs: any = useMemo(() => [
    { headerName: 'Mindbody ID', field: 'mindBodyId' }, // ✅ FIXED
    { headerName: 'Name', field: 'name' },

    {
      headerName: 'Type',
      field: 'type',
      cellRenderer: (params: any) => {
        const value = params.value;
        let color = '';

        switch (value) {
          case 'Membership': color = 'purple'; break;
          case 'Service': color = 'blue'; break;
          case 'Retail': color = 'green'; break;
          case 'Package': color = 'orange'; break;
          default: color = 'grey';
        }

        return <Tag color={color}>{value}</Tag>;
      }
    },

    { headerName: 'D365 Item ID', field: 'd365ItemId' }, // ✅ FIXED

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
      cellRenderer: (params: any) => (
        <span
          style={{ color: '#2563eb', cursor: 'pointer' }}
          onClick={() => {
            setSelectedCustomer(params.data);
            setModalVisible(true);
          }}
        >
          Map
        </span>
      ),
    },
  ], []);

  // ✅ Data for both tabs
  const mindbodyData = [
    { id: 'MB-PROD-001', name: 'Monthly Membership - Premium', type: 'Membership', itemid: 'ITEM-MEM-001', location: 'Downtown', status: 'Mapped' },
    { id: 'MB-PROD-002', name: 'Personal Training Session', type: 'Service', itemid: 'ITEM-SRV-002', location: 'Uptown', status: 'Mapped' },
    { id: 'MB-PROD-003', name: 'Yoga Mat - Premium', type: 'Retail', itemid: 'Not mapped', location: 'Downtown', status: 'Pending' },
    { id: 'MB-PROD-004', name: '10 Session Package', type: 'Package', itemid: 'ITEM-PKG-004', location: 'Midtown', status: 'Duplicate' },
  ];

  const foodicsData = [
    { id: 'FD-20001', name: 'Ali', email: 'ali@email.com', phone: '999999', account: 'CUST-010', location: 'Riyadh', status: 'Mapped' },
  ];

  const rowData = tab === 'MindBody' ? mindbodyData : foodicsData;
  const getTagColor = (type: any) => {
    switch (type) {
      case 'Membership':
        return 'purple';
      case 'Service':
        return 'blue';
      case 'Retail':
        return 'green';
      case 'Package':
        return 'orange';
      default:
        return 'default'; // Fallback color
    }
  };
  return (
    <div className={styles.dashboardContainer}>

      {/* HEADER */}
      <h1 className={styles.dashboardTitle}>Product/Service Mapping</h1>
      <p className={styles.dashboardSubtitle}>
        Map Mindbody products and services to D365 items
      </p>

      <Segmented
        value={tab}
        onChange={(val) => setTab(val)}
        options={[
          { label: 'MindBody', value: 'MindBody' },
          { label: 'Foodics', value: 'Foodics' },
        ]}
        className={styles.customSegment}
      />

      {/* KPI CARDS */}
      <Row gutter={16} style={{ marginTop: 20 }}>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Total Products</div>
            <div className={styles.kpiValue}>{dashboard.totalProducts}</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Mapped</div>
            <div className={`${styles.kpiValue} ${styles.successText1}`}>
              {dashboard.mapped}
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Pending Review</div>
            <div className={`${styles.kpiValue} ${styles.pendingText}`}>  {dashboard.pendingReview}</div>

          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Blocked/Duplicate</div>
            <div className={`${styles.kpiValue} ${styles.failedText}`}>
              {dashboard.blockedDuplicate}

            </div>
          </Card>
        </Col>

      </Row>




      <Card className={styles.customCard} style={{ marginTop: 20 }}>

        {/* HEADER */}
        <div className={styles.cardTitle}>Product/Service List</div>
        <div className={styles.cardSubTitle}>
          {tab === 'MindBody' ? "Manage Mindbody to D365 item  mappings" : "Manage Foodics to D365 item  mappings"}
        </div>

        {/* ACTION BAR */}
        <div className={styles.actionBar}>
          <div className={styles.searchContainer}>
            <InputComponent
              placeholder="Search by name, email, or Mindbody ID..."
              prefix={<SearchOutlined />}
              className={styles.searchInput}
              type='text'
              rootClassName='owsearchInput'

            />
          </div>

          <div className={styles.buttonGroup}>
            <ButtonComponent icon={<UploadOutlined />}>Import</ButtonComponent>
            <ButtonComponent icon={<DownloadOutlined />}>Export</ButtonComponent>
          </div>
        </div>


        {/* TABLE */}
        <div className="ag-theme-quartz procurement-aggrid" style={{ height: "300px", width: '100%', marginTop: "15px" }} onContextMenu={() => false}>

          <AgGridReact
            rowData={tableData}   // ✅ FIXED
            columnDefs={columnDefs}
            selectionColumnDef={{
              pinned: "left",        // ✅ keep checkbox column fixed on the left
              width: 50,
              lockPosition: true,
              sortable: false,
              resizable: false,
            }}
            paginationPageSizeSelector={false}
            // getRowId={(params) => params.data.id}
            pagination={true}
            paginationPageSize={100}

            className="ag-theme-quartz"
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
          />
        </div>

      </Card>
      <ModalComponent
        customTitle="Map Product  to D365"
        description={`Map ${selectedCustomer?.name} to a D365 item/service code`}
        showModal={modalVisible}
        setShowModal={() => {
          setModalVisible(false)
        }}
        onClose={() => setModalVisible(false)}

        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>Cancel</Button>,
          <Button key="submit" type="primary">Save Mapping</Button>,
        ]}
        style={{ maxWidth: '900px' }}
      >
        <div style={{ marginBottom: '20px' }}>
          <Typography.Title level={5}>Mindbody Customer</Typography.Title>

          <div className={styles.MappingCard}>
            <Row gutter={16}>
              <Col span={24}>
                <div className={styles.MappingName}> {selectedCustomer?.name}</div>
              </Col>
              <Col span={24}>
                <Tag color={getTagColor(selectedCustomer?.type)}>
                  {selectedCustomer?.type}
                </Tag>                <div style={{ color: "#8a8686" }}> {selectedCustomer?.location}</div>
              </Col>
              <Col span={24}>
                {/* <div style={{ color: "#8a8686" }}> {selectedCustomer?.}</div> */}
              </Col>
              <Col span={24}>
                <div style={{ color: "#8a8686" }}> {selectedCustomer?.id}</div>
              </Col>
            </Row>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Typography.Title level={5}>D365 Customer Account  <span style={{ color: "red" }}>*</span></Typography.Title>

          {/* <div className={styles.MappingCard}> */}
          <InputComponent
            type='text'
            value={'ITEM-MEM-001'}
          />
          {/* </div> */}

          <p style={{ color: "#8a8686", paddingTop: "5px" }}>Enter the D365 customer account number</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Typography.Title level={5}>Suggessted Mappings</Typography.Title>
          <div className={styles.SuggesstionCard}>
            <Col span={24}>
              <div className={styles.SuggestionName}> {"ITEM-MEM-PREMIUM"}</div>
            </Col>
            <Col span={24}>
              <div style={{ color: "#1c398e" }}>Standard membership item code</div>
            </Col>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}