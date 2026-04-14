import React, { useContext } from "react";
import { Button, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { MoreOutlined, EditOutlined } from "@ant-design/icons";
import styles from "./Card.module.css";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import ExtinctSwitch from "../ExtinctSwitch/ExtinctSwitch";
import { useRouter } from "next/navigation";
import { getCompanyDetails } from "@/lib/helpers/getCookiesClient";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";

export type CardProps = {
  item: any;
  selected?: any;
  onChange?: ((e: CheckboxChangeEvent) => void) | undefined;
  propertyName: any;
  // editFunction: any;
  city: any;
  onExtinct?: Function;
};

const CardBody = ({
  onChange,
  item,
  selected,
  propertyName,
  city,
  onExtinct,
}: CardProps) => {
  const { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } =
    propertyName;
  const navigation = useRouter();
  const userId = getCompanyDetails("id");
  const Loader = useContext(LoaderContext);

  const goToTransactionScreenById = (id: number) => {
    Loader?.setLoader(true);
    navigation.push(`/dashboard/admin-sitecreation/${id}`);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.cardFlex}>
          {/* <div className={styles.gap}>
            <Checkbox checked={selected} onChange={onChange} />
          </div> */}
          <div className={styles.gap}>
            {item?.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={""} alt="Brand" className={styles.invoiceImg} />
            ) : (
              <div className={styles.brandIcon}>
                <p className={styles.icon_vendorName}>
                  {item?.branch_name.split(" ").length > 1
                    ? item?.branch_name.split(" ")[0].split("")[0] +
                      item?.branch_name.split(" ")[1]?.split("")[0]
                    : item?.branch_name.slice(0, 2)}
                </p>
              </div>
            )}
          </div>
          <div
            className={styles.gap}
            onClick={() => goToTransactionScreenById(item?.id)}
          >
            <p className={`${styles.vendorName} ${styles.heading}`}>
              {item?.branch_name}
            </p>
            <p className={styles.heading} style={{ fontSize: "12px" }}>
              Showroom 1
            </p>
          </div>
        </div>
        <div className={styles.moreIcon}>
          {/* <Button
            icon={<EditOutlined style={{ fontSize: "0.8rem" }} />}
            onClick={editFunction}
            type="text"
          />
          <MoreOutlined /> */}
          <ExtinctSwitch
            size="small"
            checked={!item?.is_active}
            onChange={(checked) => {
              onExtinct?.(checked, item);
              // console.log("item::", item);
            }}
            disabled={
              item?.head_office === "True"
                ? true
                : userId == item.id
                ? true
                : false
            }
          />
        </div>
      </div>
      <div className={styles.margin}>
        <div
          className={styles.align_centered}
          style={{ paddingBottom: "10px" }}
        >
          <p className={`${styles.leftALignedText} ${styles.heading}`}>
            {Heading1}:{" "}
            <span className={styles.invoiceData}>{item?.industry}</span>
          </p>
          {/* <p className={`${styles.rightALignedText} ${styles.heading}`}>
            {Heading2}: <StatusBadge type={"Open"} />
          </p> */}
        </div>
        <div className={styles.align_centered}>
          <p className={`${styles.leftALignedText} ${styles.heading}`}>
            {Heading3}:{" "}
            <span className={styles.invoiceData}>
              {item?.address1} {item?.address2} {item?.village} {item?.city}
            </span>
          </p>
          {/* <p className={`${styles.rightALignedText} ${styles.heading}`}>
            {Heading4}:{" "}
            <span className={styles.invoiceData}>
              {item?.created_at.split("T")[0]}
            </span>
          </p> */}
        </div>
      </div>
      <div className={styles.align_centered}>
        <div>
          <p className={`${styles.leftALignedText} ${styles.heading}`}>
            {Heading5}
          </p>
          {/* <p className={styles.amount}>{filterCity || ""}</p> */}
          <p className={styles.amount}>{item.state}</p>
        </div>
        <div>
          <p className={`${styles.rightALignedText} ${styles.heading}`}>
            {Heading6}:{" "}
            <span className={styles.stockPoint}>{item?.cst_no}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default CardBody;
