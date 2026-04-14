import { Col, Row } from "antd";
import React from "react";
import styles from "./OrderInfoComponent.module.css";
import { Element } from "@/lib/interfaces/procurement-interface/ui.interface";
import { useTranslation } from "react-i18next";

interface OrderInfoProps {
  data: Element[];
  onClickElement: (key: string) => void;
  origin?: any
}

function OrderInfoComponent({ data, onClickElement, origin }: OrderInfoProps) {
  const { t } = useTranslation();
  const STATUS_COLOR_MAP: Record<string, string> = {
    // OLD labels
    Open: "#AEBDFF",
    Approved: "#D2F3DA",
    Cancelled: "#FFD4D2",
    Hold: "#FFE9BC",

    // NEW labels
    "Waiting For Support": "#FFD4D2",
    "In Progress": "#D2F3DA",
    "Resolved": "#FFE9BC",
    "Closed": "#fac1bdff",

    // Common
    Total: "#ECECEC",
  };

  return (
    <Row
      wrap={false}
      justify={"space-between"}
      align={"middle"}
      className={styles.orderInfoContainer}
    >
      {data.map((each: Element, index: number) => {
        return (
          <Col
            span={4}
            key={index}
            className={styles.orderInfoSubContainer}
          // style={{ maxWidth: "100%", marginRight: "10px" }}
          >
            <Row
              style={{
                // backgroundColor:
                //   each.label === "Open"
                //     ? "#AEBDFF"
                //     : each.label === "Approved" || "In Progress"
                //       ? "#D2F3DA"
                //       : each.label === "Cancelled" || "Waiting For Support"
                //         ? "#FFD4D2"
                //         : each.label === "Hold"
                //           ? "#FFE9BC"
                //           : each.label.includes("Total")
                //             ? "#ECECEC"
                //             : "",
                backgroundColor:
                  STATUS_COLOR_MAP[each.label] ||
                  (each.label.includes("Total") ? "#ECECEC" : ""),
              }}
              onClick={() => onClickElement(each.label)}
              className={origin == "ticket" ? styles.ticketInsideRow : styles.insideRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
            >
              <Col>
                <p className={styles.label}>{t(each.label)}</p>
              </Col>
              <Col>
                <p className={styles.value}>{each.value}</p>
              </Col>
            </Row>
          </Col>
        );
      })}
    </Row>
  );
}

export default OrderInfoComponent;
