'use client';

import {
  Row,
  Col,
  Card,
  Segmented,
  Button,
  Typography,
} from 'antd';
import styles from '@/app/dashboard/dashboard.module.css';
import {
  useMemo,
  useState,
  useEffect,
} from 'react';

import {
  DownloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { AgGridReact } from 'ag-grid-react';

import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  ValidationModule,
  DateFilterModule,
  NumberFilterModule,
  AllCommunityModule,
} from 'ag-grid-community';

import "@/lib/antdOverwrittenCss/global.css";
import { SetFilterModule } from 'ag-grid-enterprise';
import ModalComponent from '@/components/ModalComponent/ModalComponent';
import InputComponent from '@/components/InputComponent/InputComponent';
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent';
import makeApiCall from '@/lib/helpers/apiHandlers/api';
import { CustomerRow, DashboardSummary } from '@/lib/interfaces/customermapping-interface/customermappinginterface';


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


/* =========================================
   COMPONENT
========================================= */

export default function CustomerMappingPage() {
  const [tab, setTab] =
    useState<string>('MindBody');

  const [loading, setLoading] =
    useState<boolean>(false);

  const [dashboard, setDashboard] =
    useState<DashboardSummary>({
      totalCustomers: 0,
      mapped: 0,
      pendingReview: 0,
      blockedOrDuplicate: 0,
    });

  const [tableData, setTableData] =
    useState<CustomerRow[]>([]);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerRow | null>(null);

  /* =========================================
     API LOAD FUNCTION
  ========================================= */

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
          `Customer/GetAllCustomer?type='${apiType}'`
        );

      const data = res?.data?.data;

      setDashboard(
        data?.dashboard || {
          totalCustomers: 0,
          mapped: 0,
          pendingReview: 0,
          blockedOrDuplicate: 0,
        }
      );

      setTableData(
        data?.customer || []
      );
    } catch (error) {
      console.log(
        'Customer API Error',
        error
      );

      setDashboard({
        totalCustomers: 0,
        mapped: 0,
        pendingReview: 0,
        blockedOrDuplicate: 0,
      });

      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     FIRST LOAD + TAB CHANGE
  ========================================= */

  useEffect(() => {
    loadCustomers(tab);
  }, [tab]);

  /* =========================================
     GRID DATA
  ========================================= */

  const rowData = tableData.map(
    (item) => ({
      ...item,
      account:
        item.d365account &&
          item.d365account !== ''
          ? item.d365account
          : 'Not mapped',
    })
  );

  /* =========================================
     GRID COLUMN
  ========================================= */

  const columnDefs: any = useMemo(
    () => [
      {
        headerName: 'Mindbody ID',
        field: 'mindbody_client_id',
      },
      {
        headerName: 'Name',
        field: 'customer_name',
      },
      {
        headerName: 'Email',
        field: 'email',
      },
      {
        headerName: 'Phone',
        field: 'phone',
      },
      {
        headerName: 'D365 Account',
        field: 'account',
      },
      {
        headerName: 'Location',
        field: 'location',
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: (
          params: any
        ) => {
          const value =
            params.value;

          let color =
            '#16a34a';
          let bg =
            '#dcfce7';

          if (
            value ===
            'Pending'
          ) {
            color =
              '#d97706';
            bg =
              '#fef3c7';
          }

          if (
            value ===
            'Duplicate' ||
            value ===
            'Blocked'
          ) {
            color =
              '#dc2626';
            bg =
              '#fee2e2';
          }

          return (
            <span
              style={{
                padding:
                  '4px 10px',
                borderRadius: 20,
                background:
                  bg,
                color:
                  color,
                fontSize: 12,
              }}
            >
              {value}
            </span>
          );
        },
      },
      {
        headerName:
          'Action',
        field: 'action',
        cellRenderer: (
          params: any
        ) => (
          <span
            style={{
              color:
                '#2563eb',
              cursor:
                'pointer',
              fontWeight: 600,
            }}
            onClick={() => {
              setSelectedCustomer(
                params.data
              );
              setModalVisible(
                true
              );
            }}
          >
            Map
          </span>
        ),
      },
    ],
    []
  );

  /* =========================================
     UI
  ========================================= */

  return (
    <div
      className={
        styles.dashboardContainer
      }
    >
      {/* HEADER */}
      <h1
        className={
          styles.dashboardTitle
        }
      >
        Customer Mapping
      </h1>

      <p
        className={
          styles.dashboardSubtitle
        }
      >
        Map external
        customers to D365
        customer accounts
      </p>

      {/* TAB */}
      <Segmented
        value={tab}
        onChange={(val) =>
          setTab(
            val as string
          )
        }
        options={[
          {
            label:
              'MindBody',
            value:
              'MindBody',
          },
          {
            label:
              'Foodics',
            value:
              'Foodics',
          },
        ]}
        className={
          styles.customSegment
        }
      />

      {/* KPI */}
      <Row
        gutter={16}
        style={{
          marginTop: 20,
        }}
      >
        <Col span={6}>
          <Card
            className={
              styles.kpiCard
            }
          >
            <div
              className={
                styles.kpiTitle
              }
            >
              Total Customers
            </div>

            <div
              className={
                styles.kpiValue
              }
            >
              {
                dashboard.totalCustomers
              }
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card
            className={
              styles.kpiCard
            }
          >
            <div
              className={
                styles.kpiTitle
              }
            >
              Mapped
            </div>

            <div
              className={`${styles.kpiValue} ${styles.successText1}`}
            >
              {
                dashboard.mapped
              }
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card
            className={
              styles.kpiCard
            }
          >
            <div
              className={
                styles.kpiTitle
              }
            >
              Pending Review
            </div>

            <div
              className={`${styles.kpiValue} ${styles.pendingText}`}
            >
              {
                dashboard.pendingReview
              }
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card
            className={
              styles.kpiCard
            }
          >
            <div
              className={
                styles.kpiTitle
              }
            >
              Blocked /
              Duplicate
            </div>

            <div
              className={`${styles.kpiValue} ${styles.failedText}`}
            >
              {
                dashboard.blockedOrDuplicate
              }
            </div>
          </Card>
        </Col>
      </Row>

      {/* TABLE CARD */}
      <Card
        className={
          styles.customCard
        }
        style={{
          marginTop: 20,
        }}
      >
        <div
          className={
            styles.cardTitle
          }
        >
          Customer List
        </div>

        <div
          className={
            styles.cardSubTitle
          }
        >
          {tab ===
            'MindBody'
            ? 'Manage Mindbody to D365 mappings'
            : 'Manage Foodics to D365 mappings'}
        </div>

        {/* ACTION BAR */}
        <div
          className={
            styles.actionBar
          }
        >
          <div
            className={
              styles.searchContainer
            }
          >
            <InputComponent
              placeholder="Search by name, email, or customer id..."
              prefix={
                <SearchOutlined />
              }
              className={
                styles.searchInput
              }
              type="text"
              rootClassName="owsearchInput"
            />
          </div>

          <div
            className={
              styles.buttonGroup
            }
          >
            <ButtonComponent
              icon={
                <UploadOutlined />
              }
            >
              Import
            </ButtonComponent>

            <ButtonComponent
              icon={
                <DownloadOutlined />
              }
            >
              Export
            </ButtonComponent>
          </div>
        </div>

        {/* GRID */}
        <div
          className="ag-theme-quartz procurement-aggrid"
          style={{
            height:
              '300px',
            width:
              '100%',
            marginTop:
              '15px',
          }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
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
      </Card>

      {/* MODAL */}
      <ModalComponent
        customTitle="Map Customer to D365"
        description={`Map ${selectedCustomer?.customer_name} to a D365 customer account`}
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
                <div className={styles.MappingName}> {selectedCustomer?.customer_name}</div>
              </Col>
              <Col span={24}>
                <div style={{ color: "#8a8686" }}> {selectedCustomer?.email}</div>
              </Col>
              <Col span={24}>
                <div style={{ color: "#8a8686" }}> {selectedCustomer?.phone}</div>
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
            value={'CUST-001'}
          />
          {/* </div> */}

          <p style={{ color: "#8a8686", paddingTop: "5px" }}>Enter the D365 customer account number</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Typography.Title level={5}>Auto-Match Suggestions</Typography.Title>
          <div className={styles.SuggesstionCard}>
            <Col span={24}>
              <div className={styles.SuggestionName}> {"CUST-AUTO-001"}</div>
            </Col>
            <Col span={24}>
              <div style={{ color: "#1c398e" }}>Email Match : {selectedCustomer?.email}</div>
            </Col>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}