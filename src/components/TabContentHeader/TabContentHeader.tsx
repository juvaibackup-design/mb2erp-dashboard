import React from "react";
import { Col, Row } from "antd";
import { RightOutlined, EditOutlined } from "@ant-design/icons";
import styles from "./TabContentHeader.module.css";

interface TabContentHeaderProps {
  title: string;
  description?: string;
}

export default function TabContentHeader({ title, description }: TabContentHeaderProps) {
  return (
    <>
      <div className={styles.tabContentHeader}>
        <div className={styles.wrapper}>
          <RightOutlined style={{ fontSize: "10px" }} />
          <h5>{title}</h5>
        </div>
        <div>
          <EditOutlined style={{ fontSize: "20px" }} />
        </div>
      </div>
      <p className="bgPadding">
        {description}
      </p>
    </>
  );
}
