import { Col, Row } from "antd";
import React from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { DeleteFilled, PrinterFilled } from "@ant-design/icons";
import styles from "./Floater.module.css";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface FloaterProps {
  onUpdate: (key: string) => void;
  origin:
  | "po"
  | "grn"
  | "grt"
  | "invoice"
  | "so"
  | "dc"
  | "sq"
  | "si"
  | "retail-modify"
  | "salesIncentive"
  | "stockaudit"
  | "logistic"
  | "promotion"
  | "dn"
  | "mr"
  | "sr"
  | "cn"
  | "rq"
  | "alteration"
  | "bank-recon"
  | "cheque-book"
  | "transaction"
  | "mto"
  | "whitelist"
  | "E-Inv"
  | "SM"
  | "JV"
  | "PV"
  | "RV"
  | "itemSearch"
  | "FBM"
  statusArray: string[];
  disabled?: boolean[];
  floaterButtonRef?: any;
  deleteRef?: any;
}

function FloaterButtons({
  onUpdate,
  origin,
  statusArray,
  floaterButtonRef,
  deleteRef,
  disabled = Array(statusArray.length).fill(false),
}: FloaterProps) {
  const { t } = useTranslation();

  if (origin === "bank-recon") {
    if (statusArray.length === 0) return null;
    return (
      <div className={styles.floatContainerr}>
        <Row
          className={styles.floatRoww}
          wrap={false}
          align="middle"
          gutter={[10, 0]}
        >
          <Col>
            <ButtonComponent
              type="primary"
              onClickEvent={() => onUpdate("Assign Date For All")}
              className={styles.approvalButton}
            >
              {t("Assign Date For All")}
            </ButtonComponent>
          </Col>
        </Row>
      </div>
    );
  } else if (origin === "cheque-book") {
    if (statusArray.length === 0) return null;

    return (
      <div className={styles.floatContainerr}>
        <Row
          className={styles.floatRoww}
          wrap={false}
          align="middle"
          gutter={[10, 0]}
        >
          <Col>
            <ButtonComponent
              type="primary"
              onClickEvent={() => onUpdate("Change Cheque Status")}
              className={styles.approvalButton}
            >
              {t("Change Cheque Status")}
            </ButtonComponent>
          </Col>
        </Row>
      </div>
    );
  }

  console.log("statusArray", statusArray);
  return (
    <div className={styles.floatContainer}>
      {(origin === "po" ||
        origin === "so" ||
        origin === "sq" ||
        origin === "dc"
        // || origin === "cn"
        //  ||
        // origin === "si"
      ) && (
          <>
            {
              <Row
                className={styles.floatRow}
                wrap={false}
                justify={"space-between"}
                align={"middle"}
                gutter={[10, 0]}
              >
                {statusArray.map((each, index) => {
                  return (
                    <Col key={index}>
                      <ButtonComponent
                        type="primary"
                        onClickEvent={() => onUpdate(each)}
                        className={
                          each === "Approve"
                            ? styles.approvalButton
                            : each === "Delete" || each === "Cancel" || each === "Close"
                              ? styles.deleteButton
                              : each === "Revoke"
                                ? styles.revokeButton
                                : styles.holdButton
                        }
                        disabled={disabled[index] ?? false}
                      >
                        {each}
                      </ButtonComponent>
                    </Col>
                  );
                })}
                <Col>
                  <ButtonComponent
                    type="primary"
                    onClickEvent={() => onUpdate("Print")}
                    className={styles.holdButton}
                  >
                    <PrinterFilled /> {t("Print")}
                  </ButtonComponent>
                </Col>
              </Row>
            }
          </>
        )}
      {(origin === "cn") && (
        <>
          {
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index}>
                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "Approve"
                          ? styles.approvalButton
                          : each === "Delete" || each === "Cancel"
                            ? styles.deleteButton
                            : each === "Revoke"
                              ? styles.revokeButton
                              : styles.holdButton
                      }
                      disabled={disabled[index] ?? false}
                    >
                      {each}
                    </ButtonComponent>
                  </Col>
                );
              })}
              <Col>
                <ButtonComponent
                  type="primary"
                  onClickEvent={() => onUpdate("Print")}
                  className={styles.holdButton}
                >
                  <PrinterFilled /> {t("Print")}
                </ButtonComponent>
              </Col>
              <Col>
                <ButtonComponent
                  type="primary"
                  onClickEvent={() => onUpdate("E-Invoice")}
                // className={styles.holdButton}
                >
                  {t("E-Invoice")}
                </ButtonComponent>
              </Col>
            </Row>
          }
        </>
      )}
      {(origin === "sr") && (
        <>
          {
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index}>
                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "Approve"
                          ? styles.approvalButton
                          : each === "Delete" || each === "Cancel"
                            ? styles.deleteButton
                            : each === "Revoke"
                              ? styles.revokeButton
                              : styles.holdButton
                      }
                      disabled={disabled[index] ?? false}
                    >
                      {each}
                    </ButtonComponent>
                  </Col>
                );
              })}
              <Col>
                <ButtonComponent
                  type="primary"
                  onClickEvent={() => onUpdate("Print")}
                  className={styles.holdButton}
                >
                  <PrinterFilled /> {t("Print")}
                </ButtonComponent>
              </Col>

            </Row>
          }
        </>
      )}
      {(origin === "dn" || origin === "invoice") && (
        <>

          {false ? null : (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index}>
                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "Approve"
                          ? styles.approvalButton
                          : each === "Delete"
                            ? styles.deleteButton
                            : each === "Print"
                              ? styles.holdButton
                              : each === "Pay"
                                ? styles.approvalButton
                                : each === "Partially Pay"
                                  ? styles.partiallyPay
                                  : each === "Revoke"
                                    ? styles.revokeButton
                                    : undefined
                      }
                    >
                      {each === "Print" && <PrinterFilled />}
                      {each}
                    </ButtonComponent>
                  </Col>
                );
              })}
              <Col>
                <ButtonComponent
                  type="primary"
                  onClickEvent={() => onUpdate("E-Invoice")}
                // className={styles.holdButton}
                >
                  {t("E-Invoice")}
                </ButtonComponent>
              </Col>
              {/* <Col>
                <ButtonComponent

                  danger={true}
                  onClickEvent={() => onUpdate("Delete")}
                  className={styles.deleteButton}
                >
                  {t("Delete")}
                </ButtonComponent>
              </Col> */}
            </Row>

          )}
        </>
      )}
      {(
        origin === "si" ||
        origin === "cn"
      ) && (
          <>
            {
              <Row
                className={styles.floatRow}
                wrap={false}
                justify={"space-between"}
                align={"middle"}
                gutter={[10, 0]}
              >
                {statusArray.map((each, index) => {
                  return (
                    <Col key={index}>
                      <ButtonComponent
                        type="primary"
                        onClickEvent={() => onUpdate(each)}
                        className={
                          each === "Approve"
                            ? styles.approvalButton
                            : each === "Delete" || each === "Cancel"
                              ? styles.deleteButton
                              : each === "Revoke"
                                ? styles.revokeButton
                                : each === "Pay"
                                  ? styles.approvalButton
                                  : each === "Partially Pay"
                                    ? styles.partiallyPay
                                    : styles.holdButton
                        }
                        disabled={disabled[index] ?? false}
                      >
                        {each}
                      </ButtonComponent>
                    </Col>
                  );
                })}
                <Col>
                  <ButtonComponent
                    type="primary"
                    onClickEvent={() => onUpdate("Print")}
                    className={styles.holdButton}
                  >
                    <PrinterFilled /> {t("Print")}
                  </ButtonComponent>
                </Col>
                <Col>
                  <ButtonComponent
                    type="primary"
                    onClickEvent={() => onUpdate("E-Invoice")}
                  // className={styles.holdButton}
                  >
                    {t("E-Invoice")}
                  </ButtonComponent>
                </Col>
              </Row>
            }
          </>
        )}
      {(
        origin === "SM"
      ) && (
          <>
            {
              <Row
                className={styles.floatRow}
                wrap={false}
                justify={"space-between"}
                align={"middle"}
                gutter={[10, 0]}
              >
                {
                  statusArray.map((each, index) => {
                    return (

                      <Col key={index}>
                        <ButtonComponent
                          type="primary"
                          onClickEvent={() => onUpdate(each)}
                          className={
                            each === "Approve"
                              ? styles.approvalButton
                              : each === "Delete" || each === "Cancel"
                                ? styles.deleteButton
                                : each === "Revoke"
                                  ? styles.revokeButton
                                  : styles.holdButton
                          }
                          disabled={disabled[index] ?? false}
                        >
                          {each}
                        </ButtonComponent>
                      </Col>
                    );
                  })}
                <Col>
                  <ButtonComponent
                    type="primary"
                    onClickEvent={() => onUpdate("print")}
                    className={styles.holdButton}
                  >
                    <PrinterFilled /> {t("print")}
                  </ButtonComponent>
                </Col>

              </Row>
            }
          </>
        )}
      {(origin === "grn" ||
        origin === "grt" ||
        // origin === "invoice" ||
        // origin === "dn" ||
        origin === "whitelist") && (
          <>

            {false ? null : (
              <Row
                className={styles.floatRow}
                wrap={false}
                justify={"space-between"}
                align={"middle"}
                gutter={[10, 0]}
              >
                {statusArray.map((each, index) => {
                  return (
                    <Col key={index}>
                      <ButtonComponent
                        type="primary"
                        onClickEvent={() => onUpdate(each)}
                        className={
                          each === "Approve"
                            ? styles.approvalButton
                            : each === "Delete"
                              ? styles.deleteButton
                              : each === "Print"
                                ? styles.holdButton
                                : each === "Cancel"
                                  ? styles.holdButton
                                  : each === "Pay"
                                    ? styles.approvalButton
                                    : each === "Partially Pay"
                                      ? styles.partiallyPay
                                      : each === "Revoke"
                                        ? styles.revokeButton
                                        : undefined
                        }
                      >
                        {each === "Print" && <PrinterFilled />}
                        {each}
                      </ButtonComponent>
                    </Col>
                  );
                })}
              </Row>
            )}
          </>
        )}
      {origin === "retail-modify" && (
        <>
          {statusArray?.length === 0 ? null : (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index}>
                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "VOID"
                          ? styles.modifyDelete
                          : each === "PRINT"
                            ? styles.modifyPrint
                            : each === "COPY"
                              ? styles.copyBtn
                              : styles.voidBtn
                      }
                      disabled={disabled[index] ?? false}
                    >
                      {each}
                    </ButtonComponent>
                  </Col>
                );
              })}

            </Row>
          )}
        </>
      )}

      {origin === "salesIncentive" && (
        <>
          {statusArray?.length === 0 ? null : (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index}>
                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "Approve"
                          ? styles.approvalButton
                          : each === "Delete"
                            ? styles.deleteButton
                            : ""
                      }
                      disabled={disabled[index] ?? false}
                    >
                      {each}
                    </ButtonComponent>
                  </Col>
                );
              })}
            </Row>
          )}
        </>
      )}

      {origin === "stockaudit" && (
        <>
          {statusArray?.length === 0 ? null : (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index: any) => {
                return (
                  <Col key={index}>
                    <div ref={index === 0 ? floaterButtonRef : deleteRef}>
                      <ButtonComponent
                        type="primary"
                        onClickEvent={() => onUpdate(each)}
                        className={
                          each === "Active"
                            ? styles.approvalButton
                            : each === "Delete"
                              ? styles.deleteButton
                              : each === "Verify"
                                ? styles.verifyButton
                                : each === "New"
                                  ? styles.revokeButton
                                  : styles.holdButton
                        }
                        disabled={disabled[index] ?? false}
                      >
                        {each}
                      </ButtonComponent>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </>
      )}
      {origin === "alteration" && (
        <>
          {statusArray?.length === 0 ? null : (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index}>
                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "Inprogress"
                          ? styles.approvalButton
                          : each === "Completed"
                            ? styles.revokeButton
                            : each === "Delivered"
                              ? styles.holdButton
                              : ""
                      }
                      disabled={disabled[index] ?? false}
                    >
                      {each}
                    </ButtonComponent>
                  </Col>
                );
              })}
              <Col>
                <ButtonComponent
                  type="primary"
                  onClickEvent={() => onUpdate("Print")}
                  className={styles.holdButton}
                >
                  <PrinterFilled /> {t("Print")}
                </ButtonComponent>
              </Col>
            </Row>
          )}
        </>
      )}

      {origin === "logistic" && (
        <>
          {statusArray?.length === 0 ? null : (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index} >

                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "Active"
                          ? styles.approvalButton
                          : each === "Delete"
                            ? styles.deleteButton
                            : each === "Verify"
                              ? styles.revokeButton
                              : styles.holdButton
                      }
                      disabled={disabled[index] ?? false}
                    >
                      {each}
                    </ButtonComponent>

                  </Col>
                );
              })}
              <Col>
                <ButtonComponent
                  type="primary"
                  onClickEvent={() => onUpdate("Print")}
                  className={styles.holdButton}
                >
                  <PrinterFilled /> {t("Print")}
                </ButtonComponent>
              </Col>
            </Row>
          )}
        </>
      )}
      {origin === "promotion" && (
        <>
          {statusArray?.length === 0 ? null : (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index}>
                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "Approve"
                          ? styles.approvalButton
                          : each === "Delete"
                            ? styles.deleteButton
                            : each === "Verify"
                              ? styles.revokeButton
                              : styles.holdButton
                      }
                      disabled={disabled[index] ?? false}
                    >
                      {each}
                    </ButtonComponent>
                  </Col>
                );
              })}
            </Row>
          )}
        </>
      )}
      {(origin === "FBM") && (
        <>
          {false ? null : (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index}>
                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "Approve"
                          ? styles.approvalButton
                          : each === "Delete"
                            ? styles.deleteButton
                            : each === "Print"
                              ? styles.holdButton
                              : each === "Pay"
                                ? styles.approvalButton
                                : each === "Partially Pay"
                                  ? styles.partiallyPay
                                  : each === "Revoke"
                                    ? styles.revokeButton
                                    : undefined
                      }
                    >
                      {each === "Print" && <PrinterFilled />}
                      {each}
                    </ButtonComponent>
                  </Col>
                );
              })}
            </Row>
          )}
        </>
      )}
      {(origin === "mr" || origin === "rq" || origin === "mto") && (
        <>
          {/* {statusArray?.length === 0 ? null : ( */}
          {/* {false ? null : (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              <Col>
                <ButtonComponent
                  type="primary"
                  onClickEvent={() => onUpdate("Print")}
                  className={styles.holdButton}
                >
                  <PrinterFilled /> Print
                </ButtonComponent>
              </Col>
              <Col>
                <ButtonComponent
                  type="primary"
                  onClickEvent={() => onUpdate("Delete")}
                  className={styles.deleteButton}
                >
                  <DeleteFilled /> Delete
                </ButtonComponent>
              </Col>
            </Row>
          )} */}
          {statusArray.length !== 0 ? (
            <Row
              className={styles.floatRow}
              wrap={false}
              justify={"space-between"}
              align={"middle"}
              gutter={[10, 0]}
            >
              {statusArray.map((each, index) => {
                return (
                  <Col key={index}>
                    <ButtonComponent
                      type="primary"
                      onClickEvent={() => onUpdate(each)}
                      className={
                        each === "Approve"
                          ? styles.approvalButton
                          : each === "Delete"
                            ? styles.deleteButton
                            : each === "Print"
                              ? styles.holdButton
                              : undefined
                      }
                    >
                      {each === "Print" && <PrinterFilled />}
                      {each}
                    </ButtonComponent>
                  </Col>
                );
              })}
            </Row>
          ) : null}
        </>
      )}
      {origin === "transaction" && (<Row
        className={styles.floatRow}
        wrap={false}
        justify={"space-between"}
        align={"middle"}
        gutter={[10, 0]}
      >
        {statusArray.map((each, index) => {
          return (
            <Col key={index}>
              <ButtonComponent
                type="primary"
                onClickEvent={() => onUpdate(each)}
                className={
                  each === "Approve"
                    ? styles.approvalButton
                    : each === "Delete"
                      ? styles.deleteButton
                      : each === "Print"
                        ? styles.holdButton
                        : each === "Pay"
                          ? styles.approvalButton
                          : each === "Partially Pay"
                            ? styles.partiallyPay
                            : undefined
                }
              >
                {/* {each === "Print" && <PrinterFilled />} */}
                {each}
              </ButtonComponent>
            </Col>
          );
        })}
      </Row>)}
      {(origin === "JV" || origin === "PV" || origin === "RV") && (<Row
        className={styles.floatRow}
        wrap={false}
        justify={"space-between"}
        align={"middle"}
        gutter={[10, 0]}
      >
        {statusArray.map((each, index) => {
          return (
            <Col key={index}>
              <ButtonComponent
                type="primary"
                onClickEvent={() => onUpdate(each)}
                className={
                  each === "Approve"
                    ? styles.approvalButton
                    : each === "Delete"
                      ? styles.deleteButton
                      : each === "Print"
                        ? styles.holdButton
                        : each === "Pay"
                          ? styles.approvalButton
                          : each === "Partially Pay"
                            ? styles.partiallyPay
                            : undefined
                }
              >
                {/* {each === "Print" && <PrinterFilled />} */}
                {each}
              </ButtonComponent>
            </Col>
          );
        })}
      </Row>)}
      {origin == "E-Inv" &&
        statusArray.length !== 0 &&
        <Row
          className={styles.floatRow}
          wrap={false}
          justify={"space-between"}
          align={"middle"}
          gutter={[10, 0]}
        >
          {statusArray.map((each, index) => {
            return (
              <Col key={index}>
                <ButtonComponent
                  type="primary"
                  onClickEvent={() => onUpdate(each)}
                  className={styles.approvalButton}>
                  Download JSON
                </ButtonComponent></Col>)
          })}
        </Row>
      }
      {origin === "itemSearch" && (<Row
        className={styles.floatRow}
        wrap={false}
        justify={"space-between"}
        align={"middle"}
        gutter={[10, 0]}
      >
        {statusArray.map((each, index) => {
          return (
            <Col key={index}>
              <ButtonComponent
                type="primary"
                onClickEvent={() => onUpdate(each)}
                className={
                  each === "Approve"
                    ? styles.approvalButton
                    : each === "Delete"
                      ? styles.deleteButton
                      : each === "Print"
                        ? styles.holdButton
                        : each === "Pay"
                          ? styles.approvalButton
                          : each === "Partially Pay"
                            ? styles.partiallyPay
                            : undefined
                }
              >
                {/* {each === "Print" && <PrinterFilled />} */}
                {each}
              </ButtonComponent>
            </Col>
          );
        })}
      </Row>)}
    </div>
  );
}

export default FloaterButtons;
