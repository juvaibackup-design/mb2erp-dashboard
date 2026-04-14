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
  // console.log('localStorage.getItem("theme")')

  // console.log('initialData', initialData, initialData?.initialData?.userInfo?.isLightTheme)
  // useEffect(() => {
  //   if (initialData?.initialData?.userInfo)
  //     localStorage.setItem("theme", !initialData?.initialData?.userInfo?.isLightTheme ? "dark" : "light");
  // }, [initialData?.initialData?.userInfo?.isLightTheme])

  const { t } = useTranslation();
  const router = useRouter();
  const { loader, setLoader }: any = useContext(LoaderContext);
  const [matchedPrivilege, setMatchedPrivilege] = useState<any>(null);
  const mappings: Record<string, string> = {
    "admin-site": "admin-sitecreation",
    "inventory-productgroup": "inventory-creategroup",
    "reports-businessinsights": "reports-report",
    "reports-inventoryreport": "reports-report",
    "inventory-requisition": "inventory-request",
    "production-serviceorderhistory": "production-orderhistory",
    "retail-loyaltycardform": "retail-loyaltycard-form",
    "inventory-product": "inventory-productlist",
    "reports-dashboardviewer": "dashboard-viewer",
    "reports-dashboarddesigner": "dashboard-designer",
    "production-maketoorder": "production-orderhistory",
    "inventory-aging": "inventory-agingmaster",
    "finance-ledgers": "finance-generalledger",
    "admin-tax": "admin-taxmaster",
    "inventory-qctemplate": "inventory-qctemplatemaster",
    "admin-currencyexchange": "admin-currencyexchangerate",
    "inventory-creategroup": "inventory-creategroup",
    "knowhow": "userfaq",
    "apps-apps": "notification-apps",
    "admin-printtemplate": "admin-extrareport",
    "apps-chat": "apps-supportboard",
    "apps-feedback": "apps-feedbackform",
    "payroll-attendancemanagement": "payroll-attendance",
    "payroll-loan&advance": "payroll-loanAdvance",
    "payroll-employeegroup": "payroll-empgroup"
  };
  useEffect(() => {
    if (initialData) {
      const companyData = initialData?.initialData?.userInfo;
      const userCooky = {
        branchList: companyData?.branchList ?? [],
        companyDomain: companyData?.companyDomain,
        companyId: companyData.companyId,
        displayName: companyData.displayName,
        email: companyData.email,
        roleName: companyData.roleName,
        userId: companyData.userId,
        userName: companyData.userName,
        idleMinutes: companyData.idleMinutes,
        salesmanId: companyData.salesmanId,
        financialYear: companyData?.financialYear ?? []
      };


      // NEW
      const {
        defaultLandingPage,
        accessPrivilegeList,
        accessPrivilegeReportList,
      } = companyData;
      console.log('accessPrivilegeList', accessPrivilegeList)
      const [pIndex, cIndex, gcIndex] =
        defaultLandingPage?.split("_").map(Number) || [];
      const [rPIndex, rCIndex, rGCIndex] =
        defaultLandingPage?.split("_").map(Number) || [];

      const match =
        rPIndex === 10
          ? accessPrivilegeReportList.find(
            (item: any) =>
              item.p_index === rPIndex &&
              item.c_index === rCIndex &&
              item.gc_index === rGCIndex
          )
          : accessPrivilegeList.find(
            (item: any) =>
              item.p_index === pIndex &&
              item.c_index === cIndex &&
              item.gc_index === gcIndex
          );

      setMatchedPrivilege(match);
      console.log('match', rPIndex)
      // console.log("match->", match, rPIndex, rCIndex, rGCIndex, pIndex, cIndex);

      // NEW
      let routePath = "";

      // if (companyData.defaultLandingPage === "Dashboard Viewer") {
      //   routePath = `dashboard/dashboard-viewer`;
      //   router.push(routePath);
      // }
      if (rPIndex === 1001) {
        useDashboardNavStore.getState().setTargetDashboardId(String(rCIndex));
        routePath = `dashboard/dashboard-viewer`;
        router.push(routePath);
      }
      // else if (match) {

      //   if (rPIndex === 10) {
      //     // Route for reports
      //     routePath = `/dashboard/reports-report/${rPIndex}.${rCIndex}.${rGCIndex}`;
      //   } else {
      //     // Normal route
      //     routePath = `/dashboard/${match.menu_name.toLowerCase()}-${match.form_name .toLowerCase().replace(/\s+/g, "")}`;
      //   }

      //   router.push(routePath);
      // }

      else if (match) {
        let routePath = "";

        // build key like: inventory-aging
        const mapKey = `${match.menu_name}-${match.form_name}`
          .toLowerCase()
          .replace(/\s+/g, "");

        const mappedRoute = mappings[mapKey];

        if (rPIndex === 10) {
          // reports
          routePath = `/dashboard/reports-report/${rPIndex}.${rCIndex}.${rGCIndex}`;
        } else if (mappedRoute) {
          console.log("mapping", mappedRoute);
          // mapped route
          routePath = `/dashboard/${mappedRoute}`;
        } else {
          // fallback (IMPORTANT)
          routePath = `/dashboard/${mapKey}`;
        }
        setTimeout(() => {
          router.push(routePath);
        }, 100);
      }

      console.log("companyData", companyData);
      Cookies.set("idleMinutes", companyData?.idleMinutes);
      Cookies.set("userDetails", JSON.stringify(userCooky));
      useUserStore.setState({
        user: JSON.stringify(companyData),
      });
      // const his = history;
      // console.log("history", his);
      // const isResume = localStorage.getItem(CONSTANT.RESUMEURL);
      // if (Boolean(isResume)) {
      //   router.replace(`${isResume}`);
      // }
    }
    setLoader(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  window.addEventListener(CONSTANT.LOGOUT, (event) => {
    console.log("window::event", event);
    console.log("window::event", event?.type);
    // debugger;

    const currentUrl = window.location.href;

    console.log("currentUrl", currentUrl);
    localStorage.setItem(CONSTANT.RESUMEURL, currentUrl);

    // Cancel pending promises
    Promise.resolve()
      .then(() => {
        throw new Error("Logout initiated");
      })
      .catch(() => {
        console.log("Pending promises canceled");
      });
    Cookies.remove("token");
    Cookies.remove("userDetails");
    useUserStore.setState({
      user: null,
    });
    router.push("/");
    // location.assign("/");
    // window.removeEventListener(CONSTANT.LOGOUT, () => {});
  });

  useEffect(() => {
    const chatBox: HTMLDivElement | null =
      document.querySelector(".sb-main.sb-chat");
    if (chatBox) {
      chatBox.style.display = "block";
    }
  }, []);

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
