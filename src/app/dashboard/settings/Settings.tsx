'use client';

import { useEffect, useState } from 'react';
import { Card, Input, Button, Switch, message } from 'antd';
import {
  ReloadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styles from '@/app/dashboard/dashboard.module.css';
import InputComponent from '@/components/InputComponent/InputComponent';
import SwitchComponent from '@/components/SwitchComponent/SwitchComponent';
import SelectComponent from '@/components/SelectComponent/SelectComponent';
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent';
import makeApiCall from '@/lib/helpers/apiHandlers/api';
import { useFormik } from 'formik';

export default function Settings() {

  const [activeTab, setActiveTab] = useState('API Configuration');
  const [apiConfig, setApiConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "API Configuration") return;

    const getApiConfig = async () => {
      try {
        setLoading(true);

        const res = await makeApiCall.get("APIConfig/GetAPIConfig");
        console.log("CONFIG:", res.data);

        setApiConfig(res.data?.data);

      } catch (err) {
        console.error("API CONFIG ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    getApiConfig();
  }, [activeTab]);

  const formik = useFormik({
    enableReinitialize: true, // ✅ important for API data

    initialValues: {
      id: apiConfig?.id || 0,
      mindbodyBaseUrl: apiConfig?.mindbody_base_url || "",
      mindbodyApiKey: apiConfig?.mindbody_api_key || "",
      mindbodySiteId: apiConfig?.mindbody_site_id || "",
      staffUsername: apiConfig?.staff_username || "",
      staffPassword: apiConfig?.staff_password || "",
      staffToken: apiConfig?.staff_token || "",
      tokenExpiry: apiConfig?.token_expiry || null,
      d365ApiUrl: apiConfig?.d365_api_url || "",
      d365ClientId: apiConfig?.d365_client_id || "",
      d365ClientSecret: apiConfig?.d365_client_secret || "",
      companyId: 1, // ⚠️ set from your app context
      branchId: 1,  // ⚠️ set from your app context
    },

    onSubmit: async (values) => {
      try {
        console.log("FORM VALUES:", values);

        const res = await makeApiCall.post(
          "APIConfig/SaveAPIConfig",
          values
        );

        console.log("SAVE RESPONSE:", res.data);
            message.success("Settings saved successfully ✅");

      } catch (err) {
        console.error("SAVE ERROR:", err);
      }
    },
  });

  const handleGenerateToken = async () => {
    try {
      const { mindbodyBaseUrl, mindbodyApiKey, mindbodySiteId, staffUsername, staffPassword } = formik.values;

      if (!mindbodyBaseUrl || !mindbodyApiKey || !mindbodySiteId) {
        console.error("Missing required fields");
        return;
      }

      // ✅ Remove trailing slash if exists
      const baseUrl = mindbodyBaseUrl.replace(/\/$/, "");

      const body = {
        mindbodyBaseUrl: mindbodyBaseUrl,
        mindbodyApiKey: mindbodyApiKey,
        mindbodySiteId: mindbodySiteId,
        staffUsername: staffUsername,
        staffPassword: staffPassword,
      }

      const res = await makeApiCall.post(`APIConfig/GetGenerateToken`, body);

      const data = await res.data;
      console.log("TOKEN RESPONSE:", data);

      // ✅ Set token + expiry in formik
      formik.setFieldValue("staffToken", data?.AccessToken || "");
      formik.setFieldValue("tokenExpiry", data?.Expires || null);

    } catch (err) {
      console.error("TOKEN ERROR:", err);
    }
  };

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
      {/* {activeTab === 'API Configuration' && (
        <>
          <Card className={styles.customCard} style={{ marginTop: 20 }}>

            <div className={styles.cardTitle}>Mindbody API</div>
            <div className={styles.cardSubTitle}>
              Configure Mindbody source system connection
            </div>

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

            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>API URL</div>

              <Input
                defaultValue="https://api.d365.dynamics.com"
                style={{ marginTop: 8, borderRadius: 10, height: 40 }}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Client ID</div>

              <Input.Password
                defaultValue="••••••••••"
                style={{ marginTop: 8, borderRadius: 10, height: 40 }}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Client Secret</div>

              <Input.Password
                defaultValue="••••••••••"
                style={{ marginTop: 8, borderRadius: 10, height: 40 }}
              />
            </div>

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
      )} */}


      {activeTab === 'API Configuration' && (
        <>
          {/* ================= MINDBODY API ================= */}
          <Card className={styles.customCard} style={{ marginTop: 20 }}>

            <div className={styles.cardTitle}>Mindbody API</div>
            <div className={styles.cardSubTitle}>
              Configure Mindbody source system connection
            </div>

            {/* BASE URL */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Base URL</div>

              <InputComponent
                name="mindbodyBaseUrl"
                value={formik.values.mindbodyBaseUrl}
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  height: 40
                }}
                type='text'
                onChangeEvent={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <div className={styles.helperText}>
                Mindbody API base endpoint
              </div>
            </div>

            {/* API KEY */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>API Key</div>

              <InputComponent
                name="mindbodyApiKey"
                type="password"
                value={formik.values.mindbodyApiKey}
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  height: 40
                }}
                onChangeEvent={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <div className={styles.helperText}>
                Required for all API requests (Api-Key header)
              </div>
            </div>

            {/* SITE ID */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Site ID</div>

              <InputComponent
                name="mindbodySiteId"
                value={formik.values.mindbodySiteId}
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  height: 40
                }}
                type='text'
                onChangeEvent={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <div className={styles.helperText}>
                Required for all API requests (SiteId header)
              </div>
            </div>

            <div style={{ marginTop: 25, borderTop: '1px solid #e5e7eb', paddingTop: 20 }} />

            {/* STAFF USER CREDENTIALS */}
            <div className={styles.cardTitle}>🔑 Staff User Credentials</div>

            <div className={styles.cardSubTitle}>
              Some endpoints require staff authentication via bearer token
            </div>

            {/* USERNAME */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Staff Username</div>

              <InputComponent
                name="staffUsername"
                value={formik.values.staffUsername}
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  height: 40
                }}
                type='text'
                onChangeEvent={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Staff Password</div>

              <InputComponent
                name="staffPassword"
                type="password"
                value={formik.values.staffPassword}
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  height: 40
                }}
                onChangeEvent={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* TOKEN */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Staff User Token</div>

              <div style={{ display: 'flex', gap: 12 }}>
                <InputComponent
                  name="staffToken"
                  type="password"
                  value={formik.values.staffToken}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    height: 40
                  }}
                  onChangeEvent={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <ButtonComponent
                  icon={<ReloadOutlined />}
                  style={{
                    height: 40,
                    borderRadius: 10
                  }}
                  onClickEvent={handleGenerateToken}

                >
                  Generate Token
                </ButtonComponent>
              </div>

              <div className={styles.helperText}>
                Expires: 2026-04-24 (unused tokens expire after 7 days)
              </div>
            </div>

            {/* TOKEN RULES */}
            <div
              style={{
                marginTop: 20,
                background: '#eff6ff',
                border: '1px solid #93c5fd',
                padding: 16,
                borderRadius: 10
              }}
            >
              <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: 8 }}>
                ℹ Token Usage Rules:
              </div>

              <ul style={{ paddingLeft: 18, margin: 0, color: '#2563eb' }}>
                <li>Unused tokens expire after 7 days</li>
                <li>Tokens can only be used with API key that created them</li>
                <li>Staff permissions affect returned data</li>
                <li>Do NOT pass Authorization header when calling /usertoken/issue</li>
              </ul>
            </div>

            {/* REQUIRED HEADERS */}
            <div
              style={{
                marginTop: 20,
                background: '#fefce8',
                border: '1px solid #facc15',
                padding: 16,
                borderRadius: 10
              }}
            >
              <div style={{ fontWeight: 600, color: '#d97706', marginBottom: 8 }}>
                ⚠ Required Headers:
              </div>

              <ul style={{ paddingLeft: 18, margin: 0, color: '#d97706' }}>
                <li>Api-Key: Required for all requests</li>
                <li>SiteId: Required for all requests</li>
                <li>Authorization: Bearer {"{token}"} for protected endpoints</li>
              </ul>
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

          {/* ================= SECOND CARD ================= */}
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

              <InputComponent
                name="d365ApiUrl"
                value={formik.values.d365ApiUrl}
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  height: 40
                }}
                type='text'
                onChangeEvent={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* CLIENT ID */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Client ID</div>

              <InputComponent
                name="d365ClientId"

                type="password"
                value={formik.values.d365ClientId}
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  height: 40
                }}
                onChangeEvent={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* CLIENT SECRET */}
            <div style={{ marginTop: 20 }}>
              <div className={styles.sectionTitle}>Client Secret</div>

              <InputComponent
                name="d365ClientSecret"
                type="password"
                value={formik.values.d365ClientSecret}
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  height: 40
                }}
                onChangeEvent={formik.handleChange}
                onBlur={formik.handleBlur}
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

              <ButtonComponent
                icon={<ReloadOutlined />}
                className={styles.testBtn}
              >
                Test Connection
              </ButtonComponent>

            </div>

          </Card>

          {/* SAVE BUTTON */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 20
            }}
          >
            <ButtonComponent
              style={{
                background: '#020617',
                color: '#fff',
                borderRadius: 10,
                height: 44,
                padding: '0 24px'
              }}
              onClickEvent={() => { formik?.handleSubmit() }}
            >
              Save Settings
            </ButtonComponent>
          </div>
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