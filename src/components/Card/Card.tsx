import React from "react";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { MoreOutlined } from "@ant-design/icons";
import styles from "./Card.module.css";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import Image from "next/image";

export type CardProps = {
  item: any;
  selected: any;
  onChange: ((e: CheckboxChangeEvent) => void) | undefined;
  disabledCheckbox?: boolean | undefined;
  origin?: string;
};

const CardBody = ({
  onChange,
  item,
  selected,
  disabledCheckbox,
  origin,
}: CardProps) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.cardFlex}>
          {origin === "grt" ? null : (
            <div className={styles.gap}>
              <Checkbox
                checked={selected}
                onChange={onChange}
                disabled={disabledCheckbox}
              />
            </div>
          )}
          <div className={styles.gap}>
            {item.img ? (
              <Image
                width={50}
                height={50}
                unoptimized={true}
                unselectable="off"
                src={""}
                alt="Brand"
                className={styles.invoiceImg}
              />
            ) : (
              <div className={styles.brandIcon}>
                <p className={styles.icon_vendorName}>
                  {item?.supplier_name?.split(" ")[0].split("")[0]}
                  {item?.supplier_name?.split(" ")[1] !== undefined
                    ? item?.supplier_name?.split(" ")[1]?.split("")?.[0]
                    : item?.supplier_name?.split(" ")[0].split("")[1]}
                </p>
              </div>
            )}
          </div>
          <div className={styles.gap}>
            <p className={`${styles.vendorName} ${styles.heading}`}>
              {item.supplier_name}
            </p>
            <p className={styles.heading} style={{ fontSize: "12px" }}>
              Showroom 1
            </p>
          </div>
        </div>
        <div className={styles.moreIcon}>
          <MoreOutlined />
        </div>
      </div>
      <div className={styles.margin}>
        <div
          className={styles.align_centered}
          style={{ paddingBottom: "10px" }}
        >
          <p className={`${styles.leftALignedText} ${styles.heading}`}>
            PO Num:{" "}
            <span className={styles.invoiceData}>{item.invoice_no}</span>
          </p>
          {origin === "grt" ? null : (
            <p className={`${styles.rightALignedText} ${styles.heading}`}>
              Order status: <StatusBadge type={item.status} />
            </p>
          )}
        </div>
        <div className={styles.align_centered}>
          <p className={`${styles.leftALignedText} ${styles.heading}`}>
            Created:{" "}
            <span className={styles.invoiceData}>{item.created_name}</span>
          </p>
          <p className={`${styles.rightALignedText} ${styles.heading}`}>
            Date:{" "}
            <span className={styles.invoiceData}>
              {item.invoice_date.split("T")[0]}
            </span>
          </p>
        </div>
      </div>
      <div className={styles.align_centered}>
        <div>
          <p className={`${styles.leftALignedText} ${styles.heading}`}>
            Amount
          </p>
          <p className={styles.amount}>
            {item.net_amount.toString().split(".")[0]}
          </p>
        </div>
        <div>
          <p className={`${styles.rightALignedText} ${styles.heading}`}>
            Quantity: <span className={styles.stockPoint}>{item.quantity}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default CardBody;