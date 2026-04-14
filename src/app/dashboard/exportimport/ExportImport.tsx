'use client';

import { useState } from 'react';
import { Card, Row, Col, Checkbox, Button } from 'antd';
import { DownloadOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import styles from '@/app/dashboard/dashboard.module.css';
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent';
import DatePickerComponent from '@/components/DatepickerComponent/DatepickerComponent';
import SelectComponent from '@/components/SelectComponent/SelectComponent';

export default function ExportImport() {

  const [activeTab, setActiveTab] = useState('Export Data');
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'Customer Mappings',
    'Product Mappings'
  ]);

  const dataOptions = [
    { label: 'Customer Mappings', count: 1247 },
    { label: 'Product Mappings', count: 89 },
    { label: 'Transaction Logs', count: 3456 },
    { label: 'Reconciliation Data', count: 245 },
    { label: 'Audit Trail', count: 8923 },
    { label: 'Configuration Settings', count: 1 },
  ];

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const recentImports = [
    {
      title: 'Customer Mappings',
      status: 'Partial',
      success: '498/500',
      date: '2026-02-19 13:48:00'
    },
    {
      title: 'Product Mappings',
      status: 'Completed',
      success: '149/149',
      date: '2026-02-19 10:20:00'
    },
    {
      title: 'Configuration Backup',
      status: 'Completed',
      success: '1/1',
      date: '2026-02-18 15:00:00'
    }
  ];

  return (
    <div className={styles.dashboardContainer}>

      {/* HEADER */}
      <h1 className={styles.dashboardTitle}>Export & Import</h1>
      <p className={styles.dashboardSubtitle}>
        Manage data exports and imports for MB2ERP middleware
      </p>

      {/* TABS */}
      <div className={styles.customTabs}>
        {['Export Data', 'Import Data', 'History'].map((tab, index) => (
          <span
            key={index}
            onClick={() => setActiveTab(tab)}
            className={`${styles.tabItem} ${activeTab === tab ? styles.activeTab : ''}`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === 'Export Data' && (
        <Row gutter={20} style={{ marginTop: 20 }}>

          {/* LEFT SIDE */}
          <Col span={14}>
            <Card className={styles.customCard}>

              <div className={styles.cardTitle}>
                <DownloadOutlined /> Export Configuration
              </div>

              <div className={styles.cardSubTitle}>
                Select data types and format for export
              </div>

              <div style={{ marginTop: 20 }}>
                <div className={styles.sectionTitle}>Select Data to Export</div>

                {dataOptions.map((item, i) => (
                  <div key={i} className={styles.exportItem}>
                    <Checkbox
                      checked={selectedItems.includes(item.label)}
                      onChange={() => toggleItem(item.label)}
                    >
                      {item.label}
                    </Checkbox>

                    <span className={styles.recordCount}>
                      {item.count} records
                    </span>
                  </div>
                ))}

              </div>
              {/* EXPORT FORMAT */}
              <div style={{ marginTop: 20 }}>
                <div className={styles.sectionTitle}>Export Format</div>

                <SelectComponent
                  defaultValue="CSV (Comma Separated)"
                  style={{ width: '100%', marginTop: 8 }}
                  options={[
                    { label: 'CSV (Comma Separated)', value: 'csv' },
                    { label: 'Excel (.xlsx)', value: 'excel' },
                    { label: 'JSON', value: 'json' },
                  ]}
                />
              </div>

              {/* DATE RANGE */}
              <div style={{ marginTop: 20 }}>
                <div className={styles.sectionTitle}>
                  Date Range Filter (Optional)
                </div>

                <Row gutter={10} style={{ marginTop: 8 }}>
                  <Col span={12}>
                    <DatePickerComponent
                      placeholder="From"
                      style={{ width: '100%' }}
                      format="DD-MM-YYYY"
                    />
                  </Col>

                  <Col span={12}>
                    <DatePickerComponent
                      placeholder="To"
                      style={{ width: '100%' }}
                      format="DD-MM-YYYY"
                    />
                  </Col>
                </Row>
              </div>

              {/* EXPORT BUTTON */}
              <ButtonComponent
                icon={<DownloadOutlined />}
                style={{
                  width: '100%',
                  marginTop: 20,
                  background: '#020617',
                  color: '#fff',
                  borderRadius: 10,
                  height: 44,
                }}
              >
                Export Selected Data
              </ButtonComponent>
            </Card>
          </Col>

          {/* RIGHT SIDE */}
          <Col span={10}>

            {/* SUMMARY */}
            <Card className={styles.customCard}>
              <div className={styles.cardTitle}>Export Summary</div>
              <div className={styles.cardSubTitle}>
                Preview of selected export configuration
              </div>

              <div style={{ marginTop: 15 }}>
                <div style={{ fontWeight: 500 }}>Selected items:</div>

                {selectedItems.map((item, i) => (
                  <div key={i} className={styles.summaryItem}>
                    • {item}
                  </div>
                ))}
              </div>
            </Card>

            {/* TEMPLATES */}
            <Card className={styles.customCard} style={{ marginTop: 20 }}>
              <div className={styles.cardTitle}>Download Templates</div>
              <div className={styles.cardSubTitle}>
                Get sample templates for data imports
              </div>

              <div style={{ marginTop: 15 }}>
                <ButtonComponent icon={<FileOutlined />} className={styles.templateBtn}>
                  Customer Mapping Template
                </ButtonComponent>

                <ButtonComponent icon={<FileOutlined />} className={styles.templateBtn}>
                  Product Mapping Template
                </ButtonComponent>

                <ButtonComponent icon={<FileOutlined />} className={styles.templateBtn}>
                  Configuration Backup Template
                </ButtonComponent>
              </div>

            </Card>

          </Col>

        </Row>
      )}
      {activeTab === 'Import Data' && (
        <Row gutter={20} style={{ marginTop: 20 }}>

          {/* LEFT SIDE */}
          <Col span={14}>
            <Card className={styles.customCard}>

              <div className={styles.cardTitle}>
                <UploadOutlined /> Import Configuration
              </div>

              <div className={styles.cardSubTitle}>
                Upload and import data into MB2ERP
              </div>

              {/* IMPORT TYPE */}
              <div style={{ marginTop: 20 }}>
                <div className={styles.sectionTitle}>Import Type</div>

                <SelectComponent
                  defaultValue="Customer Mappings"
                  style={{ width: '100%', marginTop: 8 }}
                  options={[
                    { label: 'Customer Mappings', value: 'customer' },
                    { label: 'Product Mappings', value: 'product' },
                    { label: 'Transaction Logs', value: 'transaction' },
                  ]}
                />
              </div>

              {/* FILE UPLOAD BOX */}
              <div style={{ marginTop: 20 }}>
                <div className={styles.sectionTitle}>Select File</div>

                <div className={styles.uploadBox}>
                  <UploadOutlined style={{ fontSize: 28, color: '#9ca3af' }} />

                  <div className={styles.uploadText}>
                    Click to select file or drag and drop
                  </div>

                  <div className={styles.uploadSubText}>
                    Supports CSV, JSON, XLSX (Max 10MB)
                  </div>
                </div>
              </div>

              {/* IMPORT OPTIONS */}
              <div style={{ marginTop: 20 }}>
                <div className={styles.sectionTitle}>Import Options</div>

                <Checkbox>
                  Validate Only (No Import)
                </Checkbox>

                <div className={styles.uploadSubText}>
                  Check for errors without importing data
                </div>
              </div>

              {/* BUTTON */}
              <ButtonComponent
                icon={<UploadOutlined />}
                style={{
                  width: '100%',
                  marginTop: 20,
                  background: '#020617',
                  color: '#fff',
                  borderRadius: 10,
                  height: 44,
                }}
              >
                Import Data
              </ButtonComponent>

            </Card>
          </Col>

          {/* RIGHT SIDE */}
          <Col span={10}>

            {/* GUIDELINES */}
            <Card className={styles.customCard}>
              <div className={styles.cardTitle}>Import Guidelines</div>
              <div className={styles.cardSubTitle}>
                Best practices for successful imports
              </div>

              <div style={{ marginTop: 15 }}>
                {[
                  'Ensure all required columns are present in your file',
                  'Use the provided templates for correct column mapping',
                  'Validate data before importing to catch errors early',
                  'Keep file size under 10MB for optimal performance',
                  'Back up existing data before large imports',
                ].map((text, i) => (
                  <div key={i} className={styles.guidelineItem}>
                    <span className={styles.greenDot}></span>
                    {text}
                  </div>
                ))}
              </div>

              {/* IMPORTANT NOTES */}
              <div className={styles.warningBox}>
                <div className={styles.warningTitle}>Important Notes</div>

                <ul>
                  <li>Duplicate records will be skipped</li>
                  <li>Invalid formats will generate errors</li>
                  <li>Imports cannot be undone automatically</li>
                </ul>
              </div>

            </Card>
            <Card className={styles.customCard} style={{ marginTop: 20 }}>

              <div className={styles.cardTitle}>Recent Imports</div>
              <div className={styles.cardSubTitle}>
                Last 3 import operations
              </div>

              <div style={{ marginTop: 20 }}>

                {recentImports.map((item, index) => {

                  const isCompleted = item.status === 'Completed';

                  return (
                    <div key={index} className={styles.importItem}>

                      {/* LEFT ICON */}
                      <FileOutlined className={styles.importIcon} />

                      {/* CONTENT */}
                      <div style={{ flex: 1 }}>

                        {/* TITLE + STATUS */}
                        <div className={styles.importHeader}>
                          <span className={styles.importTitle}>{item.title}</span>

                          <span className={
                            isCompleted ? styles.successBadge : styles.warningBadge
                          }>
                            {item.status}
                          </span>
                        </div>

                        {/* DETAILS */}
                        <div className={styles.importSub}>
                          Success: {item.success} records
                        </div>

                        <div className={styles.importSub}>
                          {item.date}
                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </Card>
          </Col>



        </Row>



      )}

{activeTab === 'History' && (
  <Row style={{ marginTop: 20 }}>
    <Col span={24}>
      <Card className={styles.customCard}>

        {/* TITLE */}
        <div className={styles.cardTitle}>
          Import/Export History
        </div>

        <div className={styles.cardSubTitle}>
          Complete history of all operations
        </div>

        {/* EMPTY STATE */}
        <div className={styles.emptyState}>
          No history available
        </div>

      </Card>
    </Col>
  </Row>
)}
    </div>
  );
}