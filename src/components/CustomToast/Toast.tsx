import React, { useEffect, useState } from "react";
import styles from "./Toast.module.css";
import { Col, Row } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

interface ToastProps {
  type?: "success" | "error" | "warning" | "offline";
  message: string;
  delay: number;
  label?: string | undefined;
}

function Toast({ type, message, delay, label }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, delay); // 1000 milliseconds (1 second)

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return visible ? (
    <Row
      wrap={false}
      gutter={[12, 0]}
      align={"middle"}
      justify={"space-between"}
      className={styles.floatRowNotification}
    >
      <Col>
        <Row
          wrap={false}
          gutter={[4, 0]}
          align={"middle"}
          className={styles.rowStyle}
        >
          <Col>
            <CheckCircleFilled style={{ color: "#fff" }} />
          </Col>
          <Col>
            <p className={styles.messageFont}>{label ? label : "Saved"}</p>
          </Col>
        </Row>
      </Col>
      <Col>
        <p className={styles.messageFont}>{message}</p>
      </Col>
    </Row>
  ) : null;
}

export default Toast;
