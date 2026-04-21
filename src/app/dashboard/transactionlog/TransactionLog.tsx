'use client';

import {
  Row,
  Col,
  Card,
  Segmented,
  Button,
  Tag,
  Table,
} from 'antd';

import styles from '@/app/dashboard/dashboard.module.css';

import {
  useMemo,
  useState,
  useEffect,
} from 'react';

import {
  DownloadOutlined,
  EyeOutlined,
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
import { ITransactionDashboard, ITransactionLogItem, ITransactionLogResponse } from '@/lib/interfaces/transactionlog-interface/transactionloginterface';
import makeApiCall from '@/lib/helpers/apiHandlers/api';



ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  NumberFilterModule,
  ValidationModule,
  AllCommunityModule, // or AllEnterpriseModule
  SetFilterModule
]);

export default function TransactionLog() {
  const [tab, setTab] =
    useState('MindBody');

  const [loading, setLoading] =
    useState(false);

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [tableData, setTableData] =
    useState<ITransactionLogItem[]>(
      []
    );

  const [dashboard, setDashboard] =
    useState<ITransactionDashboard>({
      total: 0,
      posted: 0,
      failed: 0,
      pending: 0,
      blocked: 0,
    });

  const [modalVisible, setModalVisible] =
    useState(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransactionLogItem | null | any>(
      null
    );

    const [lineItems, setLineItems] = useState<any[]>([]);
const [lineLoading, setLineLoading] = useState(false);
  // =====================================
  // API LOAD
  // =====================================
  const loadTransaction =
    async () => {
      try {
        setLoading(true);

        const res =
          await makeApiCall.get(
            '/SalesSync/GetAllSales'
          );

        const response: ITransactionLogResponse =
          res?.data;

        setTableData(
          response?.data || []
        );

        setDashboard(
          response?.dashbord
        );
      } catch (error) {
        console.log(
          'Transaction API Error',
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadTransaction();
  }, [tab]);

  const loadSaleDetails = async (saleId: number) => {
  try {
    setLineLoading(true);

    const res = await makeApiCall.get(
      `/SalesSync/GetSelectedSales?saleId=${saleId}`
    );

    const data = res?.data?.data || [];

    setLineItems(data);

  } catch (error) {
    console.log("DETAIL API ERROR", error);
    setLineItems([]);
  } finally {
    setLineLoading(false);
  }
};

  // =====================================
  // FILTER DATA
  // =====================================
  const filteredData =
    statusFilter === 'All'
      ? tableData
      : tableData.filter(
        (x) =>
          x.status ===
          statusFilter
      );

  // =====================================
  // GRID COLUMN
  // =====================================
  const columnDefs: any =
    useMemo(
      () => [
        {
          headerName:
            'Sale ID',
          field: 'saleId',
        },

        {
          headerName:
            'Type',
          field: 'type',
          cellRenderer:
            (
              params: any
            ) => (
              <Tag color="blue">
                {
                  params.value
                }
              </Tag>
            ),
        },

        {
          headerName:
            'Customer',
          field:
            'customer',
          valueFormatter:
            (
              params: any
            ) =>
              params.value ||
              '-',
        },

        {
          headerName:
            'Amount',
          field:
            'amount',
          valueFormatter:
            (
              params: any
            ) =>
              `$${Number(
                params.value || 0
              ).toFixed(2)}`,
        },

        {
          headerName:
            'Date',
          field: 'date',
        },

        {
          headerName:
            'Location',
          field:
            'location',
        },

        {
          headerName:
            'Status',
          field:
            'status',
          cellRenderer:
            (
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
                'Failed'
              ) {
                color =
                  '#dc2626';
                bg =
                  '#fee2e2';
              }

              if (
                value ===
                'Blocked'
              ) {
                color =
                  '#7c2d12';
                bg =
                  '#ffedd5';
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
                    fontWeight: 600,
                  }}
                >
                  {value}
                </span>
              );
            },
        },

        {
          headerName:
            'D365 Ref',
          field:
            'd365SalesId',
          valueFormatter:
            (
              params: any
            ) =>
              params.value ||
              '-',
        },

        {
          headerName:
            'Action',
          field:
            'action',
          cellRenderer:
            (
              params: any
            ) => (
              <EyeOutlined
                style={{
                  color:
                    '#1677ff',
                  cursor:
                    'pointer',
                }}
               onClick={() => {
  const row = params.data;

  setSelectedTransaction(row);
  setModalVisible(true);

  loadSaleDetails(row.saleId); // ✅ API call
}}
              />
            ),
        },
      ],
      []
    );

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
        Transaction Log
      </h1>

      <p
        className={
          styles.dashboardSubtitle
        }
      >
        Monitor all synced
        transactions
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
      {/* <Row
        gutter={12}
        style={{
          marginTop: 12,
        }}
      >
        <Col span={5}>
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
              Total
            </div>
            <div
              className={
                styles.kpiValue
              }
            >
              {
                dashboard.total
              }
            </div>
          </Card>
        </Col>

        <Col span={5}>
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
              Posted
            </div>
            <div
              className={`${styles.kpiValue} ${styles.successText1}`}
            >
              {
                dashboard.posted
              }
            </div>
          </Card>
        </Col>

        <Col span={5}>
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
              Failed
            </div>
            <div
              className={`${styles.kpiValue} ${styles.failedText}`}
            >
              {
                dashboard.failed
              }
            </div>
          </Card>
        </Col>

        <Col span={5}>
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
              Pending
            </div>
            <div
              className={`${styles.kpiValue} ${styles.pendingText}`}
            >
              {
                dashboard.pending
              }
            </div>
          </Card>
        </Col>

        <Col span={5}>
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
              Blocked
            </div>
            <div
              className={`${styles.kpiValue} ${styles.failedText}`}
            >
              {
                dashboard.blocked
              }
            </div>
          </Card>
        </Col>
      </Row> */}
      <Row gutter={12} style={{ marginTop: 12 }}>
  {[
    { title: "Total", value: dashboard.total },
    { title: "Posted", value: dashboard.posted, className: styles.successText1 },
    { title: "Failed", value: dashboard.failed, className: styles.failedText },
    { title: "Pending", value: dashboard.pending, className: styles.pendingText },
    { title: "Blocked", value: dashboard.blocked, className: styles.failedText },
  ].map((item, index) => (
    <Col key={index} flex="1">
      <Card className={styles.kpiCard}>
        <div className={styles.kpiTitle}>{item.title}</div>
        <div className={`${styles.kpiValue} ${item.className || ""}`}>
          {item.value}
        </div>
      </Card>
    </Col>
  ))}
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
          Transactions
        </div>

        <div
          className={
            styles.cardSubTitle
          }
        >
          View all sales sync
          records
        </div>

        {/* SEARCH */}
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
              placeholder="Search transaction..."
              prefix={
                <SearchOutlined />
              }
              className={
                styles.searchInput
              }
              type="text"
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

        {/* FILTER */}
        <div
          className={
            styles.filterTabs
          }
        >
          {[
            'All',
            'Posted',
            'Failed',
            'Pending',
            'Blocked',
          ].map(
            (
              item
            ) => (
              <span
                key={
                  item
                }
                onClick={() =>
                  setStatusFilter(
                    item
                  )
                }
                className={`${styles.filterTabItem} ${statusFilter ===
                  item
                  ? styles.activeFilter
                  : ''
                  }`}
              >
                {item}
              </span>
            )
          )}
        </div>

        {/* GRID */}
        <div
          className="ag-theme-quartz procurement-aggrid"
          style={{
            height:
              '265px',
            width:
              '100%',
            marginTop:
              '15px',
          }}
        >
          <AgGridReact
            rowData={
              filteredData
            }
            columnDefs={
              columnDefs
            }
            loading={
              loading
            }
            paginationPageSizeSelector={false}
            // getRowId={(params) => params.data.id}
            pagination={true}
            paginationPageSize={100}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              flex: 1,
              minWidth: 130,
            }}
          />
        </div>
      </Card>

      {/* DETAILS MODAL */}
      <ModalComponent
        customTitle="Transaction Details"
        description={selectedTransaction?.customer}
        showModal={modalVisible}
        setShowModal={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}


        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        style={{ maxWidth: '800px' }}
      >
        {selectedTransaction && (
          <div>
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <div><strong>Transaction Type</strong></div>
                <Tag color="blue" style={{ borderRadius: 8, padding: "2px 10px" }}>
                  {selectedTransaction.type}
                </Tag>
                <div style={{ marginTop: 12 }}>
                  <strong>Customer</strong>
                  <div>{selectedTransaction.customer}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>Date/Time</strong>
                  <div>{selectedTransaction.date}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>Source System</strong>
                  <div>{selectedTransaction.source}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>Retry Count</strong>
                  <div>{selectedTransaction.retry}</div>
                </div>
              </Col>

              <Col span={12}>
                <div><strong>Status</strong></div>
                <Tag color="green" style={{ borderRadius: 8, padding: "2px 10px" }}>
                  {selectedTransaction.status}
                </Tag>
                <div style={{ marginTop: 12 }}>
                  <strong>Total Amount</strong>
                  <div>{selectedTransaction.amount}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>Location</strong>
                  <div>{selectedTransaction.location}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>D365 Reference</strong>
                  <div>{selectedTransaction.d365ref}</div>
                </div>
              </Col>
            </Row>
            {/* Line Items */}
            <Row style={{ marginTop: '20px' }}>
              <div
                style={{
                  // marginTop: 24,
                  // border: "1px solid #f0f0f0",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <strong>Line Items (1)</strong>

                <Table
                  // style={{ marginTop: 12 }}
                 columns={[
  {
    title: 'Product/Service',
    dataIndex: 'item_name',
    render: (val, record) => val || record.item_id || '-',
  },
  { title: 'Qty', dataIndex: 'qty' },
  {
    title: 'Unit Price',
    dataIndex: 'unit_price',
    render: (val) => `$${Number(val || 0).toFixed(2)}`,
  },
  {
    title: 'Total',
    dataIndex: 'total_amount',
    render: (val) => `$${Number(val || 0).toFixed(2)}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => (
      <Tag color="orange">{status}</Tag>
    ),
  },
]}
                 dataSource={lineItems}
loading={lineLoading}
                  pagination={false}
                  rowKey="product"
                />
              </div>
            </Row>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}