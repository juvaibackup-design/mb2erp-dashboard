"use client";

import React from "react";
import { Card, Col, Row } from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* -------------------- KPI DATA -------------------- */

const stats = [
  { title: "Total Bins", value: 8, sub: "8 active" },
  { title: "Total Items", value: 435, sub: "10 SKUs" },
  { title: "Total Value", value: "$24,955.65", sub: "Inventory valuation" },
  { title: "Low Stock Alerts", value: 1, sub: "Items need restock" },
];

/* -------------------- CHART DATA -------------------- */

const volumeData = [
  { bin: "WH-WOM-H-01", volume: 0 },
  { bin: "WH-KID-F-01", volume: 0 },
  { bin: "RT-WOM-D-01", volume: 0 },
  { bin: "WH-WOM-F-02", volume: 0 },
];

const weightData = [
  { bin: "WH-WOM-H-01", weight: 28 },
  { bin: "WH-KID-F-01", weight: 12 },
  { bin: "RT-WOM-D-01", weight: 36 },
  { bin: "WH-WOM-F-02", weight: 18 },
];

const binTypeData = [
  { name: "Hanging", value: 2 },
  { name: "Folded", value: 3 },
  { name: "Retail Display", value: 2 },
  { name: "Shelf", value: 1 },
];

const categoryData = [
  { name: "Shirts", qty: 100 },
  { name: "Dresses", qty: 55 },
  { name: "Denim", qty: 85 },
  { name: "Kids Apparel", qty: 60 },
  { name: "Outerwear", qty: 15 },
  { name: "Casual Wear", qty: 85 },
];

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

/* -------------------- COMPONENT -------------------- */

const DashboardTab = () => {
  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      {/* KPI CARDS */}
      <Row gutter={[16, 16]}>
        {stats.map((s, i) => (
          <Col xs={24} md={6} key={i}>
            <Card style={{ borderRadius: 12 }}>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{s.title}</div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.sub}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ROW 2 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Bin Volume Utilization" style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={volumeData}>
                <XAxis dataKey="bin" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Bin Weight Utilization" style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weightData}>
                <XAxis dataKey="bin" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="weight" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* ROW 3 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Bin Type Distribution" style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={binTypeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {binTypeData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Inventory by Category" style={{ borderRadius: 12 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardTab;
