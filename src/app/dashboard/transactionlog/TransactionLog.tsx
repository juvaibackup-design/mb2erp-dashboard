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
import SelectComponent from '@/components/SelectComponent/SelectComponent';



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
  const [typeFilter, setTypeFilter] = useState('All');

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
  const [searchText, setSearchText] = useState('');

  // =====================================
  // API LOAD
  // =====================================
  const loadTransaction =
    async (type: string, search = '') => {
      try {
        setLoading(true);

        const res =
          await makeApiCall.get(
            `/SalesSync/GetAllSales?Search=${search}`
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

  // useEffect(() => {
  //   loadTransaction();
  // }, [tab]);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadTransaction(tab, searchText);
    }, 500); // wait 500ms after typing

    return () => clearTimeout(delay);
  }, [searchText, tab]);

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
  const filteredData = tableData.filter((x) => {
    const matchType =
      typeFilter === 'All' || x.type === typeFilter;

    const matchStatus =
      statusFilter === 'All' || x.status === statusFilter;

    return matchType && matchStatus;
  });
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
          cellRenderer: (params: any) => {
            return <b>{params.value}</b>
          },
        },

        {
          headerName: 'Type',
          field: 'type',
          cellRenderer: (params: any) => {
            const value = params.value;

            let color = '#1677ff';
            let bg = '#e6f4ff';

            if (value === 'Payment') {
              color = '#15803d';
              bg = '#dcfce7';
            }

            if (value === 'Refund') {
              color = '#dc2626';
              bg = '#fee2e2';
            }

            if (value === 'Deferred Revenue') {
              color = '#7c3aed';
              bg = '#ede9fe';
            }

            if (value === 'Sale') {
              color = '#2563eb';
              bg = '#dbeafe';
            }

            return (
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: bg,
                  color: color,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {value}
              </span>
            );
          },
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


  const getTypeStyles = (value: string) => {
    switch (value) {
      case 'Payment':
        return { color: '#15803d', bg: '#dcfce7' };

      case 'Refund':
        return { color: '#dc2626', bg: '#fee2e2' };

      case 'Deferred Revenue':
        return { color: '#7c3aed', bg: '#ede9fe' };

      case 'Sale':
        return { color: '#2563eb', bg: '#dbeafe' };

      default:
        return { color: '#1677ff', bg: '#e6f4ff' };
    }
  };

  const getStatusStyles = (value: string) => {
    switch (value) {
      case 'Posted':
        return { color: '#16a34a', bg: '#dcfce7' };

      case 'Pending':
        return { color: '#d97706', bg: '#fef3c7' };

      case 'Failed':
        return { color: '#dc2626', bg: '#fee2e2' };

      case 'Blocked':
        return { color: '#7c2d12', bg: '#ffedd5' };

      default:
        return { color: '#374151', bg: '#f3f4f6' };
    }
  };

  const lineColumnDefs = [
    {
      headerName: 'Product/Service',
      field: 'item_name',
      valueGetter: (params: any) =>
        params.data.item_name || params.data.item_id || '-',
    },
    {
      headerName: 'Qty',
      field: 'qty',
    },
    {
      headerName: 'Unit Price',
      field: 'unit_price',
      valueFormatter: (params: any) =>
        `$${Number(params.value || 0).toFixed(2)}`,
    },
    {
      headerName: 'Total',
      field: 'total_amount',
      valueFormatter: (params: any) =>
        `$${Number(params.value || 0).toFixed(2)}`,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 20,
            background: '#ffedd5',
            color: '#ea580c',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {params.value}
        </span>
      ),
    },
  ];
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
        Monitor and manage all integration transactions
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

      <Row gutter={12} style={{ marginTop: 12 }}>
        {[
          { title: "Total", value: dashboard.total },
          { title: "Posted", value: dashboard.posted, className: styles.successText1 },
          { title: "Failed", value: dashboard.failed, className: styles.failedText },
          { title: "Pending", value: dashboard.pending, className: styles.pendingText },
          { title: "Blocked", value: dashboard.blocked, className: styles.failedText },
        ].map((item, index) => (
          <Col key={index} flex="1">
            <Card className={styles.kpiCard} styles={{ body: { padding: "14px" } }}
            >
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
          height: "calc(100% - 220px)"

        }}
        styles={{ body: { height: "100%", padding: "14px" } }}

      >
        <div className={styles.headerRow}>

          <div>
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
          </div>
          <div className={styles.headerActions}>
            {/* <ButtonComponent icon={<UploadOutlined />}>
              Import
            </ButtonComponent> */}

            <ButtonComponent icon={<DownloadOutlined />}>
              Export Log
            </ButtonComponent>
          </div>
        </div>
        {/* SEARCH */}
        <div className={styles.actionBar}>

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
              rootClassName="owsearchInput"
              value={searchText}
              onChangeEvent={(e: any) => setSearchText(e.target.value)}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  loadTransaction(tab, searchText);
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
        {/* FILTER */}
        <div
          className={
            styles.filterTabs
          }
        >
          {['All', 'Sale', 'Payment', 'Refund', 'Deferred Revenue'].map(
            (
              item
            ) => (
              <span
                key={
                  item
                }
                onClick={() => setTypeFilter(item)}
                className={`${styles.filterTabItem} ${typeFilter === item ? styles.activeFilter : ''}`}
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
              'calc(100% - 170px)',
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
            headerHeight={50}
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

      {/* DETAILS MODAL */}
      <ModalComponent
        customTitle="Transaction Details"
        description={selectedTransaction?.customer}
        showModal={modalVisible}
        setShowModal={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}

        footer={[
          // <Button key="close" onClick={() => setModalVisible(false)}>
          //   Close
          // </Button>
        ]}
        width={1000}
      >
        {selectedTransaction && (
          <div>


            <Row gutter={[16, 14]} style={{ marginTop: 10 }}>
              {/* Row 1 */}
              <Col span={6}>
                <div className={styles.label}>Customer</div>
                <div className={styles.value}>{selectedTransaction.customer || '-'}</div>
              </Col>

              <Col span={6}>
                <div className={styles.label}>Location</div>
                <div className={styles.value}>{selectedTransaction.location || '-'}</div>
              </Col>

              <Col span={6}>
                <div className={styles.label}>Status</div>
                {(() => {
                  const style = getStatusStyles(selectedTransaction.status);
                  return (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      background: style.bg,
                      color: style.color,
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'inline-block',
                    }}>
                      {selectedTransaction.status}
                    </span>
                  );
                })()}
              </Col>

              {/* Row 2 */}
              <Col span={6}>
                <div className={styles.label}>Transaction Type</div>
                {(() => {
                  const style = getTypeStyles(selectedTransaction.type);
                  return (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      background: style.bg,
                      color: style.color,
                      fontSize: 12,
                      fontWeight: 500,
                      display: 'inline-block',
                    }}>
                      {selectedTransaction.type}
                    </span>
                  );
                })()}
              </Col>

              <Col span={6}>
                <div className={styles.label}>Date / Time</div>
                <div className={styles.value}>{selectedTransaction.date || '-'}</div>
              </Col>

              <Col span={6}>
                <div className={styles.label}>Total Amount</div>
                <div className={styles.value}>
                  ${Number(selectedTransaction.amount || 0).toFixed(2)}
                </div>
              </Col>

              {/* Row 3 */}
              <Col span={6}>
                <div className={styles.label}>D365 Reference</div>
                <div className={styles.value}>{selectedTransaction.d365ref || '-'}</div>
              </Col>

              <Col span={6}>
                <div className={styles.label}>Retry Count</div>
                <div className={styles.value}>{selectedTransaction.retry ?? '-'}</div>
              </Col>

              {/* <Col span={6}>
                <div className={styles.label}>Source System</div>
                <div className={styles.value}>
                  {tab === 'MindBody' ? 'MindBody' : 'Foodics'}
                </div>
              </Col> */}
            </Row>
            {/* LINE ITEMS HEADER */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>
                {tab} ({lineItems.length})
              </div>
            </div>

            {/* AG GRID */}
            <div
              className="ag-theme-quartz"
              style={{
                height: 250,
                width: '100%',
                marginTop: 10,
              }}
            >
              <AgGridReact
                rowData={lineItems}
                columnDefs={lineColumnDefs}
                loading={lineLoading}
                defaultColDef={{
                  flex: 1,
                  minWidth: 120,
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
              />
            </div>
          </div>
          // <div>
          //   <Row gutter={[24, 16]}>
          //     <Col span={8}>
          //       <div className={styles.transactionModelNames}>Transaction Type</div>
          //       <div style={{ borderRadius: 8, padding: "2px 10px" }}>
          //         {(() => {
          //           const style = getTypeStyles(selectedTransaction.type);

          //           return (
          //             <span
          //               style={{
          //                 padding: '4px 10px',
          //                 borderRadius: 8,
          //                 background: style.bg,
          //                 color: style.color,
          //                 fontSize: 12,
          //                 fontWeight: 500,
          //                 display: 'inline-block',
          //               }}
          //             >
          //               {selectedTransaction.type}
          //             </span>
          //           );
          //         })()}
          //       </div>


          //       <div style={{ marginTop: 17 }}>
          //         <div className={styles.transactionModelNames}>Date/Time</div>
          //         <div className={styles.modelValues}>{selectedTransaction.date}</div>
          //       </div>

          //       <div style={{ marginTop: 17 }}>
          //         <div className={styles.transactionModelNames}>  Source System</div>
          //         <div className={styles.modelValues}>{tab === 'MindBody' ? 'MindBody' : 'Foodics'}</div>
          //         {/* <div>{selectedTransaction.source}</div> */}
          //       </div>


          //       <div style={{ marginTop: 17 }}>
          //         <div className={styles.transactionModelNames}> Retry Count</div>

          //         <div className={styles.modelValues}>{selectedTransaction.retry ?? "-"}</div>
          //       </div>
          //     </Col>

          //     <Col span={8}>
          //       <div className={styles.transactionModelNames}>Status</div>
          //       <div style={{ borderRadius: 8, padding: "2px 0px" }}>
          //         {(() => {
          //           const style = getStatusStyles(selectedTransaction.status);

          //           return (
          //             <span
          //               style={{
          //                 padding: '4px 10px',
          //                 borderRadius: 20,
          //                 background: style.bg,
          //                 color: style.color,
          //                 fontSize: 12,
          //                 fontWeight: 600,
          //                 display: 'inline-block',
          //               }}
          //             >
          //               {selectedTransaction.status}
          //             </span>
          //           );
          //         })()}                </div>
          //       <div style={{ marginTop: 17 }}>
          //         <div className={styles.transactionModelNames}>Total Amount</div>

          //         <div>{selectedTransaction.amount}</div>
          //       </div>

          //       <div style={{ marginTop: 17 }}>
          //         <div className={styles.transactionModelNames}>Location</div>

          //         <div>{selectedTransaction.location}</div>
          //       </div>

          //       <div style={{ marginTop: 17 }}>
          //         <div className={styles.transactionModelNames}>D365 Reference</div>

          //         <div>{selectedTransaction.d365ref ?? "-"}</div>
          //       </div>
          //     </Col>
          //     <Col span={8}>
          //       <div>
          //         <div className={styles.transactionModelNames}> Customer</div>
          //         <div className={styles.modelValues}>{selectedTransaction.customer}</div>
          //       </div>
          //     </Col>
          //   </Row>
          //   {/* Line Items */}
          //   <div

          //   >
          //     <strong>Line Items ({lineItems.length})</strong>
          //     <div
          //       className="ag-theme-quartz procurement-aggrid"
          //       style={{
          //         height: 250,
          //         width: '100%',
          //         marginTop: 10,
          //       }}
          //     >
          //       <AgGridReact
          //         rowData={lineItems}
          //         columnDefs={lineColumnDefs}
          //         loading={lineLoading}
          //         // domLayout="autoHeight"
          //         paginationPageSizeSelector={false}
          //         // getRowId={(params) => params.data.id}
          //         pagination={true}
          //         paginationPageSize={100}
          //         headerHeight={50}
          //         suppressPaginationPanel={false}
          //         defaultColDef={{
          //           sortable: true,
          //           filter: true,
          //           resizable: true,
          //           flex: 1,
          //           minWidth: 140,
          //         }}
          //       />
          //     </div>
          //   </div>
          // </div>
        )}
      </ModalComponent>
    </div>
  );
}