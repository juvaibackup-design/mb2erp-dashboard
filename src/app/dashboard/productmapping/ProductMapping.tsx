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
import SelectComponent from '@/components/SelectComponent/SelectComponent';

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
  const [searchText, setSearchText] = useState('');


  const loadCustomers = async (type: string, search = '') => {

    try {
      setLoading(true);

      const apiType =
        type === 'MindBody'
          ? 'MB'
          : 'Foodics';

      const res =
        await makeApiCall.get(
          `ProductMapping/GetProductList?Search=${search}`
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

  // useEffect(() => {
  //   loadCustomers(tab);
  // }, [tab]);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadCustomers(tab, searchText);
    }, 500); // wait 500ms after typing

    return () => clearTimeout(delay);
  }, [searchText, tab]);

  // ✅ Common Column Definition
  const columnDefs: any = useMemo(() => [
    {
      headerName: 'Mindbody ID', field: 'mindBodyId', cellRenderer: (params: any) => {
        return <b>{params.value}</b>
      },
    }, // ✅ FIXED
    { headerName: 'Name', field: 'name' },

    {
      headerName: 'Type',
      field: 'type',
      cellRenderer: (params: any) => {
        const value = params.value;
        let color = '';

        switch (value) {
          case 'Membership': color = 'purple'; break;
          case 'Product': color = 'blue'; break;
          case 'Retail': color = 'green'; break;
          case 'Package': color = 'orange'; break;
          default: color = 'grey';
        }

        return <Tag color={color}>{value}</Tag>;
      }
    },

    {
      headerName: 'D365 Item ID', field: 'd365ItemId', cellRenderer: (params: any) => {
        const value = params.value;

        if (!value) {
          return (
            <span
              style={{
                color: '#9ca3af',     // light grey
                fontStyle: 'italic',  // italic text
                fontSize: 13,
              }}
            >
              Not mapped
            </span>
          );
        }

        return <span>{value}</span>;
      },
    }, // ✅ FIXED

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

  const [statusFilter, setStatusFilter] =
    useState('All');

  // ✅ Data for both tabs



  const getTagColor = (type: any) => {
    switch (type) {
      case 'Membership':
        return 'purple';
      case 'Product':
        return 'blue';
      case 'Retail':
        return 'green';
      case 'Package':
        return 'orange';
      default:
        return 'default'; // Fallback color
    }
  };
  const filteredData =
    statusFilter === 'All'
      ? tableData
      : tableData.filter(
        (x) => x.status === statusFilter
      );

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
          <Card className={styles.kpiCard} styles={{ body: { padding: "14px" } }}
          >
            <div className={styles.kpiTitle}>Total Products</div>
            <div className={styles.kpiValue}>{dashboard.totalProducts}</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard} styles={{ body: { padding: "14px" } }}
          >
            <div className={styles.kpiTitle}>Mapped</div>
            <div className={`${styles.kpiValue} ${styles.successText1}`}>
              {dashboard.mapped}
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard} styles={{ body: { padding: "14px" } }}
          >
            <div className={styles.kpiTitle}>Pending Review</div>
            <div className={`${styles.kpiValue} ${styles.pendingText}`}>  {dashboard.pendingReview}</div>

          </Card>
        </Col>

        <Col span={6}>
          <Card className={styles.kpiCard} styles={{ body: { padding: "14px" } }}
          >
            <div className={styles.kpiTitle}>Blocked/Duplicate</div>
            <div className={`${styles.kpiValue} ${styles.failedText}`}>
              {dashboard.blockedDuplicate}

            </div>
          </Card>
        </Col>

      </Row>




      <Card className={styles.customCard} style={{
        marginTop: 20,
        height: "calc(100% - 250px)"
      }} styles={{ body: { height: "100%", padding: "14px" } }}
      >

        {/* HEADER */}
        <div className={styles.headerRow}>
          <div>
            <div className={styles.cardTitle}>Product/Service List</div>
            <div className={styles.cardSubTitle}>
              {tab === 'MindBody' ? "Manage Mindbody to D365 item  mappings" : "Manage Foodics to D365 item  mappings"}
            </div>
          </div>
          <div className={styles.headerActions}>
            <ButtonComponent icon={<DownloadOutlined />} >
              Import
            </ButtonComponent>

            <ButtonComponent icon={<UploadOutlined />}>
              Export
            </ButtonComponent>
          </div>
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
              value={searchText}
              onChangeEvent={(e: any) => setSearchText(e.target.value)}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  loadCustomers(tab, searchText);
                }
              }}

            />
          </div>

          <SelectComponent
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            style={{ width: 250, marginTop: "20px" }}
            options={[
              { label: 'All Status', value: 'All' },
              { label: 'Posted', value: 'Posted' },
              { label: 'Failed', value: 'Failed' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Blocked', value: 'Blocked' },
            ]}
          />
        </div>


        {/* TABLE */}
        <div className="ag-theme-quartz procurement-aggrid" style={{ height: 'calc(100% - 112px)', width: '100%', marginTop: "15px" }} onContextMenu={() => false}>

          <AgGridReact
            rowData={filteredData}   // ✅ FIXED
            columnDefs={columnDefs}
            // selectionColumnDef={{
            //   pinned: "left",        // ✅ keep checkbox column fixed on the left
            //   width: 50,
            //   lockPosition: true,
            //   sortable: false,
            //   resizable: false,
            // }}
            loading={loading}

            paginationPageSizeSelector={false}
            // getRowId={(params) => params.data.id}
            pagination={true}
            paginationPageSize={100}
            suppressPaginationPanel={false}

            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              flex: 1,
              minWidth: 140,
            }}
          />
        </div>

      </Card >
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
          <Typography.Title level={5}>Mindbody Product</Typography.Title>

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
                <div style={{ color: "#8a8686" }}> ID : {selectedCustomer?.mindBodyId}</div>
              </Col>
            </Row>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Typography.Title level={5}>D365 Item/Service Code  <span style={{ color: "red" }}>*</span></Typography.Title>

          {/* <div className={styles.MappingCard}> */}
          <InputComponent
            type='text'
            value={selectedCustomer?.d365ItemId}
          />
          {/* </div> */}

          <p style={{ color: "#8a8686", paddingTop: "5px" }}>Enter the D365 item or service code</p>
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
    </div >
  );
}