import React from "react";
import styles from "./Card.module.css";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { Button, Flex } from "antd";
// import {
//   CalendarOutlined,
//   PhoneOutlined,
//   UserOutlined,
// } from "@ant-design/icons";

interface CardForServiceOrderProps {
  item: any;
  onEdit?: (item: any) => void;
}

const CardForServiceOrder: React.FC<CardForServiceOrderProps> = ({
  item,
  onEdit,
}) => {
  const extractInitials = (name: string) => {
    const parts = name?.split(" ") || [];
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return parts[0]?.substring(0, 2) || "";
  };

  return (
    <Flex vertical gap={8} className={styles.container}>
      <Flex className={styles.cardFlex}>
        <div className={styles.gap}>
          <div className={styles.brandIcon}>
            <p className={styles.icon_vendorName}>
              {extractInitials(item?.customerName)}
            </p>
          </div>
        </div>
        <div className={styles.gap} onClick={() => onEdit?.(item)}>
          <p className={`${styles.vendorName} ${styles.heading}`}>
            {item?.orderNo}
          </p>
          {/* <p className={styles.invoiceData}>{item?.orderDate?.split("T")[0]}</p> */}
        </div>
      </Flex>

      <Flex vertical className={styles.margin}>
        <Flex justify="space-between">
          <div className={styles.align_centered}>
            <p className={`${styles.leftALignedText} ${styles.heading}`}>
              Created by:{" "}
              <span className={styles.invoiceData}>{item?.user}</span>
            </p>
          </div>
          <div className={styles.align_centered}>
            <p className={`${styles.rightALignedText} ${styles.heading}`}>
              Location:{" "}
              <span className={styles.invoiceData}>{item?.locationName}</span>
            </p>
          </div>
        </Flex>

        <Flex justify="space-between">
          <div className={styles.align_centered}>
            <p className={`${styles.leftALignedText} ${styles.heading}`}>
              Delivery:{" "}
              <span className={styles.invoiceData}>
                {item?.deliveryDate?.split("T")[0]}
              </span>
            </p>
          </div>
          <div
            className={styles.align_centered}
            style={{ paddingBottom: "10px" }}
          >
            <p className={`${styles.rightALignedText} ${styles.heading}`}>
              Status:
              <StatusBadge type={item?.status} width={70} />
            </p>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CardForServiceOrder;
