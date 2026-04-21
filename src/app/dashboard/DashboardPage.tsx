"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import Cookies from "js-cookie";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import texts from "../../../public/dictionary/en/translation.json";
import { useUserStore } from "@/store/userInfo/store";
import { CONSTANT } from "@/lib/constants/constant";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";
import { useDashboardNavStore } from "@/store/defaultLanding/store";
import { Card, Col, Row, Tooltip, Typography } from "antd";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ArrowUpOutlined, CheckCircleOutlined, FallOutlined, RiseOutlined, WarningOutlined } from "@ant-design/icons";
import { Tooltip as RechartsTooltip } from "recharts";
const DashboardPage = (initialData: any) => {



  const { Title, Text } = Typography;

  const lineData = [
    { name: 'Feb 13', total: 35, posted: 20, failed: 15 },
    { name: 'Feb 14', total: 50, posted: 35, failed: 15 },
    { name: 'Feb 15', total: 45, posted: 30, failed: 15 },
    { name: 'Feb 16', total: 30, posted: 20, failed: 10 },
    { name: 'Feb 17', total: 40, posted: 28, failed: 12 },
    { name: 'Feb 18', total: 55, posted: 40, failed: 15 },
    { name: 'Feb 19', total: 10, posted: 5, failed: 5 },
  ];

  const pieData = [
    { name: 'Downtown', value: 50, color: '#3b82f6' },
    { name: 'Uptown', value: 30, color: '#10b981' },
    { name: 'Midtown', value: 20, color: '#f59e0b' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          padding: '10px 12px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            {label}
          </div>

          <div style={{ color: '#3b82f6', fontSize: 13 }}>
            Total : {payload[0]?.value}
          </div>

          <div style={{ color: '#10b981', fontSize: 13 }}>
            Posted : {payload[1]?.value}
          </div>

          <div style={{ color: '#ef4444', fontSize: 13 }}>
            Failed : {payload[2]?.value}
          </div>
        </div>
      );
    }

    return null;
  };
  return (
    <div className={styles.initialDashboardImage}>
      <div className={styles.dashboardContainer}>

        {/* HEADER */}
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <p className={styles.dashboardSubtitle}>
          Real-time overview of MB2ERP integration
        </p>

        {/* KPI CARDS */}
        <Row gutter={16} style={{ marginTop: 20 }}>

          <Col span={6}>
            <Card className={styles.kpiCard}>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div className={styles.kpiTitle}>Total Transactions</div>

                <RiseOutlined style={{ fontSize: "18px", color: "#16a34a" }} className={styles.trendIcon} />

              </div>

              <div className={styles.kpiValue}>8</div>
              <div className={styles.kpiSub}>Today</div>

            </Card>
          </Col>

          <Col span={6}>
            <Card className={styles.kpiCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className={styles.kpiTitle}>Success Rate</div>
                <div className={styles.statusDotGreen}></div>
              </div>
              <div className={styles.kpiValue}>62.5%</div>
              <div className={styles.successText}>
                <ArrowUpOutlined /> +3.2% from yesterday
              </div>
            </Card>
          </Col>

          <Col span={6}>
            <Card className={styles.kpiCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div className={styles.kpiTitle}>Failed</div>
                <div className={styles.statusDotRed}></div>

              </div>
              <div className={`${styles.kpiValue} ${styles.failedText}`}>1</div>
              <div className={styles.kpiSub}>Requires attention</div>
            </Card>
          </Col>

          <Col span={6}>
            <Card className={styles.kpiCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div className={styles.kpiTitle}>Pending/Blocked</div>
                <div className={styles.statusDotRed}></div>

              </div>
              <div className={`${styles.kpiValue} ${styles.pendingText}`}>3</div>
              <div className={styles.kpiSub}>Awaiting action</div>
            </Card>
          </Col>

        </Row>

        {/* CHARTS */}
        <Row gutter={16} style={{ marginTop: 20 }}>

          {/* LINE CHART */}
          <Col span={16}>
            <Card className={styles.customCard}>
              <div className={styles.cardTitle}>Transaction Trend (7 Days)</div>
              <div className={styles.cardSubTitle}>
                Daily transaction volume and status
              </div>

              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />                    <Legend />

                    <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total" />
                    <Line type="monotone" dataKey="posted" stroke="#10b981" name="Posted" />
                    <Line type="monotone" dataKey="failed" stroke="#ef4444" name="Failed" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* PIE CHART */}
          <Col span={8}>
            <Card className={styles.customCard}>
              <div className={styles.cardTitle}>Revenue by Location</div>
              <div className={styles.cardSubTitle}>
                Distribution across branches
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={100}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* LEGEND */}
              <div style={{ marginTop: 10 }}>
                {pieData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <span style={{
                        width: 10,
                        height: 10,
                        background: item.color,
                        display: 'inline-block',
                        marginRight: 6
                      }} />
                      {item.name}
                    </span>
                    <span>({item.value}%)</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

        </Row>

        {/* BOTTOM */}
        <Row gutter={16} style={{ marginTop: 20 }}>

          <Col span={12}>
            <Card className={styles.customCard}>
              <div className={styles.cardTitle}>Reconciliation Summary</div>
              <div className={styles.cardSubTitle}>
                Mindbody vs D365 F&O comparison
              </div>

              <div className={styles.reconGrid}>

                <div>
                  <div className={styles.reconLabel}>Mindbody Total</div>
                  <div className={styles.reconValue}>$904.44</div>
                </div>

                <div>
                  <div className={styles.reconLabel}>D365 Posted Total</div>
                  <div className={styles.reconValue}>$648.48</div>
                </div>

                <div>
                  <div className={styles.reconLabel}>Variance</div>
                  <div className={`${styles.reconValue} ${styles.failedText}`}>
                    $255.96
                  </div>
                </div>

              </div>

              <div className={styles.reconSub}>
                3 transactions unposted
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card className={styles.customCard}>
              <div className={styles.cardTitle}>Recent Alerts</div>
              <div className={styles.cardSubTitle}>
                System notifications and warnings
              </div>

              <div style={{ marginTop: 10 }}>

                <div className={styles.alertItem}>
                  <WarningOutlined className={styles.smallIcon} style={{ color: 'red' }} />
                  <div>
                    <div className={styles.alertText}>
                      Transaction failed after retries
                    </div>
                    <div className={styles.alertTime}>2026-02-19 11:35</div>
                  </div>
                </div>

                <div className={styles.alertItem}>
                  <WarningOutlined className={styles.smallIcon} style={{ color: 'orange' }} />
                  <div>
                    <div className={styles.alertText}>
                      Customer mapping pending review
                    </div>
                    <div className={styles.alertTime}>2026-02-19 11:05</div>
                  </div>
                </div>

                <div className={styles.alertItem}>
                  <CheckCircleOutlined className={styles.smallIcon} style={{ color: 'blue' }} />
                  <div>
                    <div className={styles.alertText}>
                      Daily reconciliation completed
                    </div>
                    <div className={styles.alertTime}>2026-02-19 08:00</div>
                  </div>
                </div>

              </div>
            </Card>
          </Col>

        </Row>

      </div>
    </div>
  );
};

export default DashboardPage;
