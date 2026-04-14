'use client';

import { useState } from 'react';
import { Card, Input, Button, Switch } from 'antd';
import {
  ReloadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styles from '@/app/dashboard/dashboard.module.css';
import InputComponent from '@/components/InputComponent/InputComponent';
import SwitchComponent from '@/components/SwitchComponent/SwitchComponent';
import SelectComponent from '@/components/SelectComponent/SelectComponent';
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent';

export default function Settings() {

  const [activeTab, setActiveTab] = useState('API Configuration');

  return (
    <div className={styles.dashboardContainer}>

      {/* HEADER */}
      <h1 className={styles.dashboardTitle}>Settings</h1>
      <p className={styles.dashboardSubtitle}>
        Configure MB2ERP middleware parameters
      </p>

      {/* TABS */}
      <div className={styles.customTabs}>
        {['API Configuration', 'Sync Settings', 'Notifications', 'Advanced'].map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${styles.tabItem} ${activeTab === tab ? styles.activeTab : ''
              }`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* ================= API CONFIG ================= */}
      {activeTab === 'API Configuration' && (
        <>
          <Card className={styles.customCard} style={{ marginTop: 20 }}>

            <div className={styles.cardTitle}>Mindbody API</div>
            <div className={styles.cardSubTitle}>
              Configure Mindbody source system connection
            </div>

            {/* API KEY */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>API Key</div>

              <InputComponent
                type='password'
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  height: 40
                }}
              />

              <div className={styles.helperText}>
                Stored securely and encrypted at rest
              </div>
            </div>

            {/* CONNECTION STATUS */}
            <div className={styles.connectionBox}>

              <div className={styles.connectionLeft}>
                <CheckCircleOutlined className={styles.successIcon} />

                <div>
                  <div className={styles.connectionTitle}>
                    Connection Status
                  </div>
                  <div className={styles.connectionSub}>
                    Last verified: 2 mins ago
                  </div>
                </div>
              </div>

              <Button
                icon={<ReloadOutlined />}
                className={styles.testBtn}
              >
                Test Connection
              </Button>

            </div>

          </Card>
          <Card className={styles.customCard} style={{ marginTop: 20 }}>

            <div className={styles.cardTitle}>
              Microsoft Dynamics 365 F&O
            </div>

            <div className={styles.cardSubTitle}>
              Configure D365 target system connection
            </div>

            {/* API URL */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>API URL</div>

              <Input
                defaultValue="https://api.d365.dynamics.com"
                style={{ marginTop: 8, borderRadius: 10, height: 40 }}
              />
            </div>

            {/* CLIENT ID */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Client ID</div>

              <Input.Password
                defaultValue="••••••••••"
                style={{ marginTop: 8, borderRadius: 10, height: 40 }}
              />
            </div>

            {/* CLIENT SECRET */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Client Secret</div>

              <Input.Password
                defaultValue="••••••••••"
                style={{ marginTop: 8, borderRadius: 10, height: 40 }}
              />
            </div>

            {/* CONNECTION STATUS */}
            <div className={styles.connectionBox}>

              <div className={styles.connectionLeft}>
                <CheckCircleOutlined className={styles.successIcon} />

                <div>
                  <div className={styles.connectionTitle}>
                    Connection Status
                  </div>
                  <div className={styles.connectionSub}>
                    Last verified: 5 mins ago
                  </div>
                </div>
              </div>

              <Button
                icon={<ReloadOutlined />}
                className={styles.testBtn}
              >
                Test Connection
              </Button>

            </div>

          </Card>
        </>
      )}

      {activeTab === 'Sync Settings' && (
        <>
          {/* ================= SYNCHRONIZATION ================= */}
          <Card className={styles.customCard} style={{ marginTop: 20 }}>

            <div className={styles.cardTitle}>Synchronization</div>
            <div className={styles.cardSubTitle}>
              Configure data sync behavior
            </div>

            {/* Polling Frequency */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>
                Polling Frequency (minutes)
              </div>

              <SelectComponent
                defaultValue="5"
                style={{ width: '100%', marginTop: 8 }}
                options={[
                  { label: '1 minute', value: '1' },
                  { label: '5 minutes', value: '5' },
                  { label: '10 minutes', value: '10' },
                ]}
              />
            </div>

            {/* Auto Retry */}
            <div className={styles.switchRow}>
              <div>
                <div className={styles.sectionTitle}>
                  Enable Auto-Retry
                </div>
                <div className={styles.helperText}>
                  Automatically retry failed transactions
                </div>
              </div>

              <SwitchComponent defaultChecked checked={true} onChange={() => { }} />
            </div>

            {/* Retry Attempts */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>
                Maximum Retry Attempts
              </div>

              <SelectComponent
                defaultValue="3"
                style={{ width: '100%', marginTop: 8 }}
                options={[
                  { label: '1 attempt', value: '1' },
                  { label: '3 attempts', value: '3' },
                  { label: '5 attempts', value: '5' },
                ]}
              />
            </div>

            {/* Retry Delay */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>
                Retry Delay (seconds)
              </div>

              <Input
                defaultValue="300"
                style={{ marginTop: 8, borderRadius: 10, height: 40 }}
              />
            </div>

          </Card>

          {/* ================= DATA RETENTION ================= */}
          <Card className={styles.customCard} style={{ marginTop: 20 }}>

            <div className={styles.cardTitle}>Data Retention</div>
            <div className={styles.cardSubTitle}>
              Configure backup and archive policies
            </div>

            {/* Retention Period */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>
                Retention Period (months)
              </div>

              <SelectComponent
                defaultValue="24"
                style={{ width: '100%', marginTop: 8 }}
                options={[
                  { label: '6 months', value: '6' },
                  { label: '12 months', value: '12' },
                  { label: '24 months (Recommended)', value: '24' },
                ]}
              />
            </div>

            {/* Enable Archiving */}
            <div className={styles.switchRow}>
              <div>
                <div className={styles.sectionTitle}>
                  Enable Archiving
                </div>
                <div className={styles.helperText}>
                  Archive old data instead of deleting
                </div>
              </div>

              <SwitchComponent defaultChecked checked={true} onChange={() => { }} />
            </div>

          </Card>
        </>
      )}

      {activeTab === 'Notifications' && (
        <>
          {/* ================= EMAIL NOTIFICATIONS ================= */}
          <Card className={styles.customCard} style={{ marginTop: 20 }}>

            <div className={styles.cardTitle}>Email Notifications</div>
            <div className={styles.cardSubTitle}>
              Configure alert and notification settings
            </div>

            {/* Enable Email */}
            <div className={styles.switchRow}>
              <div>
                <div className={styles.sectionTitle}>
                  Enable Email Notifications
                </div>
                <div className={styles.helperText}>
                  Receive alerts via email
                </div>
              </div>
              <SwitchComponent defaultChecked checked={true} onChange={() => { }} />
            </div>

            {/* Email Input */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Notification Email</div>
              <Input
                defaultValue="integration@corelife.com"
                style={{ marginTop: 8, borderRadius: 10, height: 40 }}
              />
            </div>

            {/* Alert on Failure */}
            <div className={styles.switchRow}>
              <div>
                <div className={styles.sectionTitle}>Alert on Failure</div>
                <div className={styles.helperText}>
                  Immediate notification for failed transactions
                </div>
              </div>
              <SwitchComponent defaultChecked checked={true} onChange={() => { }} />
            </div>

            {/* Daily Summary */}
            <div className={styles.switchRow}>
              <div>
                <div className={styles.sectionTitle}>Daily Summary Report</div>
                <div className={styles.helperText}>
                  Daily digest at 6:00 AM
                </div>
              </div>
              <SwitchComponent defaultChecked checked={true} onChange={() => { }} />
            </div>

          </Card>

          {/* ================= ESCALATION RULES ================= */}
          <Card className={styles.customCard} style={{ marginTop: 20 }}>

            <div className={styles.cardTitle}>Escalation Rules</div>
            <div className={styles.cardSubTitle}>
              Configure when to escalate issues
            </div>

            <div style={{ marginTop: 20 }}>

              {/* ITEM 1 */}
              <div className={styles.escalationItem}>
                <div>
                  <div className={styles.escalationTitle}>
                    Transaction fails 3+ times
                  </div>
                  <div className={styles.helperText}>
                    Notify: Finance + IT Teams
                  </div>
                </div>

                <span className={styles.criticalBadge}>Critical</span>
              </div>

              {/* ITEM 2 */}
              <div className={styles.escalationItem}>
                <div>
                  <div className={styles.escalationTitle}>
                    Variance exceeds 5%
                  </div>
                  <div className={styles.helperText}>
                    Notify: Finance Team
                  </div>
                </div>

                <span className={styles.warningBadge}>Warning</span>
              </div>

              {/* ITEM 3 */}
              <div className={styles.escalationItem}>
                <div>
                  <div className={styles.escalationTitle}>
                    Unmapped items detected
                  </div>
                  <div className={styles.helperText}>
                    Notify: Integration Admin
                  </div>
                </div>

                <span className={styles.infoBadge}>Info</span>
              </div>

            </div>

          </Card>
        </>
      )}

      {activeTab === 'Advanced' && (
  <>
    {/* ================= PERFORMANCE SETTINGS ================= */}
    <Card className={styles.customCard} style={{ marginTop: 20 }}>

      <div className={styles.cardTitle}>Performance Settings</div>
      <div className={styles.cardSubTitle}>
        Advanced configuration for optimal performance
      </div>

      {/* Batch Size */}
      <div style={{ marginTop: 20 }}>
        <div className={styles.sectionTitle}>Batch Size</div>
        <Input
          defaultValue="50"
          style={{ marginTop: 8, borderRadius: 10, height: 40 }}
        />
        <div className={styles.helperText}>
          Number of records to process in each batch
        </div>
      </div>

      {/* API Timeout */}
      <div style={{ marginTop: 20 }}>
        <div className={styles.sectionTitle}>API Timeout (seconds)</div>
        <Input
          defaultValue="30"
          style={{ marginTop: 8, borderRadius: 10, height: 40 }}
        />
      </div>

      {/* Logging */}
      <div className={styles.switchRow}>
        <div>
          <div className={styles.sectionTitle}>
            Enable Detailed Logging
          </div>
          <div className={styles.helperText}>
            Log all API requests and responses
          </div>
        </div>
              <SwitchComponent defaultChecked checked={true} onChange={() => { }} />
      </div>

    </Card>

    {/* ================= SYSTEM INFORMATION ================= */}
    <Card className={styles.customCard} style={{ marginTop: 20 }}>

      <div className={styles.cardTitle}>System Information</div>
      <div className={styles.cardSubTitle}>
        Current middleware status and version
      </div>

      <div style={{ marginTop: 20 }}>

        <div className={styles.infoRow}>
          <span>Version</span>
          <span>1.0.0</span>
        </div>

        <div className={styles.infoRow}>
          <span>Last Deployment</span>
          <span>2026-02-19 14:30</span>
        </div>

        <div className={styles.infoRow}>
          <span>Uptime</span>
          <span>12 days 5 hours</span>
        </div>

        <div className={styles.infoRow}>
          <span>Environment</span>
          <span className={styles.envBadge}>Production</span>
        </div>

      </div>

    </Card>

    {/* ================= SAVE BUTTON ================= */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
      <ButtonComponent
        style={{
          background: '#020617',
          color: '#fff',
          borderRadius: 10,
          height: 44,
          padding: '0 20px'
        }}
      >
        Save Settings
      </ButtonComponent>
    </div>
  </>
)}
    </div>
  );
}