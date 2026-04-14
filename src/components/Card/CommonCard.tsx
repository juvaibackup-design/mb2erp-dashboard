import React from "react";
import { Checkbox, Col, Flex, Row } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { MoreOutlined } from "@ant-design/icons";
import styles from "./Card.module.css";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import Image from "next/image";
import ExtinctSwitch from "../ExtinctSwitch/ExtinctSwitch";

export type CardProps = {
  selected?: any;
  onChange?: ((e: CheckboxChangeEvent) => void) | undefined;
  onEdit?: any;
  onExtinct?: Function;
  disabledCheckbox?: boolean | undefined;
  origin?: string;
  dataSource?: any;
  columns?: any;
  checkbox?: boolean;
  // extinct?: boolean;
  moreoutlined?: boolean;
  form?: string;
  // showStatusTopRight?: boolean;
  extinct?: boolean;
  // onExtinct?: (checked: boolean) => void;
  extinctDisabled?: boolean;   // <-- add this
  showStatusTopRight?: boolean;
};

const CommonCard = ({
  onChange,
  selected,
  disabledCheckbox,
  checkbox,
  origin,
  dataSource,
  columns,
  onEdit,
  extinct,
  onExtinct,
  moreoutlined,
  form,
  extinctDisabled,
  showStatusTopRight = true,

}: CardProps) => {
  console.log("columnsdd", columns, form);

  console.log("dataSource", dataSource);

  const hasContainer =
    Array.isArray(columns) && columns.some((c: any) => c?.fieldType === "container");
  const hasBodyKeys = Array.isArray(columns) && columns.some((c: any) => c?.body);

  const getPrimaryName = () => {
    const nameCol =
      columns?.find((c: any) =>
        ["full_name", "name", "user_name"].includes(c?.dataIndex)
      ) || columns?.[0];
    return dataSource?.[nameCol?.dataIndex] ?? "";
  };

  const getInitials = () => {
    const raw = String(getPrimaryName() || "").trim();
    if (!raw) return "--";
    const parts = raw.split(/\s+/);
    if (parts.length > 1) return (parts[0][0] ?? "") + (parts[1][0] ?? "");
    return raw.slice(0, 2);
  };


  const baseExcludedColumns = [
    "PO No",
    "PO Date",
    "Qty",
    "Amount",
    // "Created By",
    "Status",
    "GRN No",
    "GRN Date",
    "QTY",
    "GRT No",
    "GRT Date",
    "Invoice No",
    "Date",
    "DN No",
    "DN Date",
    "Courier No",
    "Courier Type",
    "Extinct",
    "Track No",
    "Entry No",
    "Entry Type",
    "CN Number",
    "Quote No",
    "Sales Order Number",
    "Delivery Challan Number",
    "Sales Invoice Number",
    "Request No",
    // "GST",
  ];

  let excludedColumns = [...baseExcludedColumns];

  if (form === "SalesPartner") {
    excludedColumns.push("Location");
    excludedColumns.push("GST");
  }

  // if (form === "Sales Invoice") {
  //   excludedColumns.push("Sales Invoice Number");
  // }

  return (
    <>
      {columns.map((column: any) => {
        // console.log("column", column);
        if (column.fieldType === "container")
          return (
            <div key={column} className={styles.container}>
              <div className={styles.cardFlex}>
                {checkbox && (
                  <div className={styles.gap}>
                    <Checkbox
                      checked={selected}
                      onChange={onChange}
                      disabled={disabledCheckbox}
                    />
                  </div>
                )}
                <div className={styles.gap}>
                  {dataSource.img ? (
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
                        {column?.component === "image" &&
                          dataSource[column.dataIndex]?.trim() &&
                          dataSource[column.dataIndex]?.trim().split(/\s+/).length > 1
                          ? dataSource[column.dataIndex]
                            ?.trim()
                            .split(/\s+/)[0]
                            .split("")[0] +
                          dataSource[column.dataIndex]
                            ?.trim()
                            .split(/\s+/)?.[1]
                            ?.split("")[0]
                          : dataSource[column.dataIndex]?.trim()?.slice(0, 2)}
                      </p>
                    </div>
                  )}
                </div>
                <div className={styles.gap}>
                  <p
                    className={`${styles.vendorName} ${styles.heading}`}
                    onClick={() => onEdit(dataSource)}
                  >
                    {column?.component === "image" &&
                      dataSource[column.dataIndex]}
                  </p>
                  <p className={styles.heading} style={{ fontSize: "12px" }}>
                    Showroom 1
                  </p>
                </div>
              </div>
              <div className={styles.moreIcon}>
                {moreoutlined && <MoreOutlined />}

                {extinct && (
                  <div className={styles.gap}>
                    <ExtinctSwitch
                      size="small"
                      checked={
                        dataSource?.is_active != undefined
                          ? !dataSource?.is_active
                          : !dataSource?.isActive
                      }
                      // onClick={() => onExtinct}
                      onChange={(checked) => onExtinct?.(checked)}
                      disabled={extinctDisabled}
                    />
                  </div>
                )}
              </div>
            </div>
          );
      })}


      {!hasContainer && (
        <div className={styles.container}>
          <div className={styles.cardFlex}>
            {checkbox && (
              <div className={styles.gap}>
                <Checkbox
                  checked={selected}
                  onChange={onChange}
                  disabled={disabledCheckbox}
                />
              </div>
            )}
            <div className={styles.gap}>
              <div className={styles.brandIcon}>
                <p className={styles.icon_vendorName}>{getInitials()}</p>
              </div>
            </div>
            <div className={styles.gap}>
              <p
                className={`${styles.vendorName} ${styles.heading}`}
                onClick={() => onEdit?.(dataSource)}
              >
                {getPrimaryName() || "--"}
              </p>
              <p className={styles.heading} style={{ fontSize: "12px" }}>
                {dataSource?.role_name ?? dataSource?.department_name ?? ""}
              </p>
            </div>
          </div>
          <div className={styles.moreIcon}>
            {moreoutlined && <MoreOutlined />}
            {extinct && (
              <div className={styles.gap}>
                <ExtinctSwitch
                  size="small"
                  checked={
                    dataSource?.is_active != undefined
                      ? !dataSource?.is_active
                      : !dataSource?.isActive
                  }
                  // onClick={() => onExtinct}
                  onChange={(checked) => onExtinct?.(checked)}
                // disabled={extinctDisabled}
                />
              </div>
            )}
          </div>
        </div>
      )}


      <div className={styles.margin}>
        <div
          className={styles.align_centered}
        // style={{ paddingBottom: "10px" }}
        >
          {columns.findIndex((c: any) => c.body === "header1") > -1 && (
            <p className={`${styles.leftALignedText} ${styles.heading}`}>
              {
                columns[columns.findIndex((c: any) => c.body === "header1")]
                  .title
              }
              :{" "}
              <span className={styles.invoiceData}>
                {
                  dataSource[
                  columns[columns.findIndex((c: any) => c.body === "header1")]
                    .dataIndex
                  ]
                }
              </span>
            </p>
          )}

          {columns.findIndex((c: any) => c.body === "header2") > -1 && (
            <p className={`${styles.rightALignedText} ${styles.heading}`}>
              {
                columns[columns.findIndex((c: any) => c.body === "header2")]
                  .title
              }
              : {"  "}
              <StatusBadge
                type={
                  columns[columns.findIndex((c: any) => c.body === "header2")]
                    .title !== "Extinct"
                    ? dataSource[
                    columns[
                      columns.findIndex((c: any) => c.body === "header2")
                    ].dataIndex
                    ]
                    : (dataSource.is_active != undefined &&
                      dataSource.is_active) ||
                      (dataSource.isActive != undefined && dataSource.isActive)
                      ? "Active"
                      : "Extinct"
                }
              />
            </p>
          )}
        </div>

        {/* <div className={styles.align_centered}>
          {columns.findIndex((c: any) => c.body === "created") > -1 && (
            <p className={`${styles.leftALignedText} ${styles.heading}`}>
              Created:{" "}
              <span className={styles.invoiceData}>
                {
                  dataSource[
                    columns[columns.findIndex((c: any) => c.body === "created")]
                      .dataIndex
                  ]
                }
              </span>
            </p>
          )}
          {columns.findIndex((c: any) => c.body === "date") > -1 && (
            <p className={`${styles.rightALignedText} ${styles.heading}`}>
              Date:{" "}
              <span className={styles.invoiceData}>
                {
                  dataSource[
                    columns[columns.findIndex((c: any) => c.body === "date")]
                      .dataIndex
                  ]?.split("T")[0]
                }
              </span>
            </p>
          )}
        </div> */}

        {/* FOR SHOW ALL RECORDS */}
        {/* <div className={styles.fieldscontainer}>
          {columns
            .filter((col: any) => col.body && col.dataIndex) // Ensure valid fields
            .filter((col: any) => !excludedColumns.includes(col.title)) // Exclude specific columns
            .map((col: any) => (
              <div key={col.body} className={styles.field}>
                <p className={styles.heading}>
                  {col.title}:{" "}
                  <span className={styles.invoiceData}>
                    {dataSource[col.dataIndex] || "--"}
                  </span>
                </p>
              </div>
            ))}
        </div> */}

        {/* FOR CLEAR EMPTY RECORDS */}
        <div className={styles.fieldscontainer}>
          {columns
            .filter((col: any) => col.body && col.dataIndex) // Ensure valid fields
            .filter((col: any) => !excludedColumns.includes(col.title)) // Exclude specific columns
            .filter((col: any) => dataSource[col.dataIndex]) // Show only columns that have data
            .map((col: any) => (
              <div key={col.body} className={styles.field}>
                <p className={styles.heading}>
                  {col.title}:{" "}
                  <span className={styles.invoiceData}>
                    {dataSource[col.dataIndex]}
                  </span>
                </p>
              </div>
            ))}
        </div>

        {!hasBodyKeys && (
          <div className={styles.fieldscontainer}>
            {columns
              ?.filter((c: any) => c?.dataIndex && c?.title)
              ?.filter((c: any) => c.dataIndex !== "is_active") // status shown separately
              ?.filter((c: any) => {
                const v = dataSource?.[c.dataIndex];
                return v !== null && v !== undefined && String(v).trim() !== "";
              })
              ?.map((c: any) => (
                <div key={c.dataIndex} className={styles.field}>
                  <p className={styles.heading}>
                    {c.title}:{" "}
                    <span className={styles.invoiceData}>
                      {String(dataSource?.[c.dataIndex])}
                    </span>
                  </p>
                </div>
              ))}
          </div>
        )}


        <div className={styles.align_centered}>
          {columns.findIndex((c: any) => c.body === "gst") > -1 && (
            <p className={`${styles.leftALignedText} ${styles.heading}`}>
              {columns[columns.findIndex((c: any) => c.body === "gst")].title}:{" "}
              <span className={styles.invoiceData}>
                {
                  dataSource[
                  columns[columns.findIndex((c: any) => c.body === "gst")]
                    .dataIndex
                  ]
                }
              </span>
            </p>
          )}
          {columns.findIndex((c: any) => c.body === "address") > -1 && (
            <p className={`${styles.leftALignedText} ${styles.heading}`}>
              {
                columns[columns.findIndex((c: any) => c.body === "address")]
                  .title
              }
              :{" "}
              <span className={styles.invoiceData}>
                {
                  dataSource[
                  columns[columns.findIndex((c: any) => c.body === "address")]
                    .dataIndex
                  ]
                }
              </span>
            </p>
          )}
        </div>
        <div className={styles.align_centered}>
          {columns.findIndex((c: any) => c.body === "state") > -1 && (
            <p className={`${styles.leftALignedText} ${styles.heading}`}>
              {columns[columns.findIndex((c: any) => c.body === "state")].title}
              :{" "}
              <span className={styles.invoiceData}>
                {
                  dataSource[
                  columns[columns.findIndex((c: any) => c.body === "state")]
                    .dataIndex
                  ]
                }
              </span>
            </p>
          )}
        </div>

        {!hasBodyKeys && (
          <div className={styles.align_centered}>
            {columns?.some((c: any) => c?.dataIndex === "is_active") && (
              <p className={`${styles.rightALignedText} ${styles.heading}`}>
                Status:{" "}
                <StatusBadge
                  type={
                    (dataSource?.is_active ?? dataSource?.isActive)
                      ? "Active"
                      : "Extinct"
                  }
                />
              </p>
            )}
          </div>
        )}

      </div>

      <div className={styles.align_centered}>
        {columns.findIndex((c: any) => c.body === "amount") > -1 && (
          <div>
            <p className={`${styles.leftALignedText} ${styles.heading}`}>
              {
                columns[columns.findIndex((c: any) => c.body === "amount")]
                  .title
              }
            </p>
            <p className={styles.amount}>
              {
                dataSource[
                  columns[columns.findIndex((c: any) => c.body === "amount")]
                    .dataIndex
                ]
                  ?.toString()
                  ?.split(".")[0]
              }
            </p>
          </div>
        )}
        {columns.findIndex((c: any) => c.body === "quantity") > -1 && (
          <div>
            <p className={`${styles.rightALignedText} ${styles.heading}`}>
              {
                columns[columns.findIndex((c: any) => c.body === "quantity")]
                  .title
              }
              :{" "}
              <span className={styles.stockPoint}>
                {/* {dataSource[column.dataIndex]} */}
                {
                  dataSource[
                    columns[
                      columns.findIndex((c: any) => c.body === "quantity")
                    ].dataIndex
                  ]
                    ?.toString()
                    ?.split(".")[0]
                }
              </span>
            </p>
          </div>
        )}
      </div>

      {!hasBodyKeys && (
        <div className={styles.align_centered}>
          {columns?.some((c: any) => c.dataIndex === "amount") && (
            <div>
              <p className={`${styles.leftALignedText} ${styles.heading}`}>Amount</p>
              <p className={styles.amount}>
                {String(dataSource?.amount ?? "").split(".")[0]}
              </p>
            </div>
          )}
          {columns?.some((c: any) => c.dataIndex === "quantity") && (
            <div>
              <p className={`${styles.rightALignedText} ${styles.heading}`}>
                Quantity:{" "}
                <span className={styles.stockPoint}>
                  {String(dataSource?.quantity ?? "").split(".")[0]}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CommonCard;
