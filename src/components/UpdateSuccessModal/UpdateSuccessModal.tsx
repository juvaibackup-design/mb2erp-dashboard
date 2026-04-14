import { Col, Row } from "antd";
import React, { ReactNode } from "react";
import styles from "./UpdateSuccessModal.module.css";

interface SuccessModalProps {
  data: {
    label: string;
    value: string;
  }[];
  button?: ReactNode | undefined;
}

function UpdateSuccessModal({ data, button }: SuccessModalProps) {
  return (
    <Col style={{ paddingTop: "8px" }}>
      {data.map((item, index) => {
        return (
          <Row
            key={index}
            justify={"space-between"}
            align={"middle"}
            wrap={false}
            style={{ padding: "8px 0" }}
          >
            <Col>
              <p className={styles.modalHeader}>{item.label}</p>
            </Col>
            <Col>
              <p className={styles.madalValue}>{item.value}</p>
            </Col>
          </Row>
        );
      })}
      {button ? button : null}
    </Col>
  );
}

export default UpdateSuccessModal;
