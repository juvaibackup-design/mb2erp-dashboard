import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./Header.module.css";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import { Col, Flex, Row } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import StatusBadge from "../StatusBadge/StatusBadge";
import { useTranslation } from "react-i18next";
import { LoaderContext, TranslationContext } from "@/lib/interfaces/Context.interfaces";
import useIsMobile from "@/lib/customHooks/useIsMobile";
import { indexList } from "../SideBar/Constants";
import { useUserStore } from "@/store/userInfo/store";
import { localDB } from "@/store/localStorage/store";
import { usePathname } from "next/navigation";

import { Tooltip } from "antd";
import Loader from "../Loader/Loader";
export type HeaderProps = {
  title: string | any;
  description: string | any;
  buttonLable?: string | any;
  buttonDisabled?: boolean;
  buttonId?: string | any;
  IsSecondaryBtn?: boolean;
  secondaryBtnLabel?: string;
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  cancelButton?: boolean | undefined;
  onClickCancel?: React.MouseEventHandler<HTMLElement> | undefined;
  slugType?: boolean | undefined;
  type?: "Hold" | "Approved" | "Open" | "Pending" | any;
  slugTypeButtonLabel?: string | undefined;
  onClickSlugButtons?: ((e: string) => void | undefined) | undefined;
  customRightSideButton?: React.ReactNode | undefined;
  autoFocus?: boolean | undefined;
  onAuditClick?: () => void;
  disabled?: boolean;
  access?: any;
  origin?: any;
  buttonTooltip?: React.ReactNode;
  poReceiveRatioData?: any;

};
const Header = ({
  title,
  description,
  buttonLable,
  buttonDisabled,
  buttonId,
  IsSecondaryBtn = false,
  secondaryBtnLabel,
  onClick,
  onAuditClick,
  cancelButton,
  disabled,
  onClickCancel,
  slugType,
  type,
  slugTypeButtonLabel,
  onClickSlugButtons,
  customRightSideButton,
  autoFocus,
  access,
  origin,
  buttonTooltip,
  poReceiveRatioData
}: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  console.log('pathname', pathname, type)
  console.log("poReceiveRatioData", poReceiveRatioData)
  const { t } = useTranslation();
  const cookies = Cookies;
  const lang = useContext(TranslationContext);
  const [transHeaderaccess, setTransHeaderaccess] = useState(access?.is_edit);
  const [directReceive, setDirectReceive] = useState<any>(null)
  const [directInvoice, setDirectIvoice] = useState<any>(null)
  const searchParams = useSearchParams();

  const [ltr, setLtr] = useState<any>("en");
  const isMobile = useIsMobile();
  const { loader } = useContext<any>(LoaderContext);
  const slugButtonConstants = [
    // { label: "Reset", value: "reset" },
    // { label: "Save", value: "saveAs" },
    // { label: "Print", value: "print" },
    {
      label: `${slugTypeButtonLabel}`,
      value: `${slugTypeButtonLabel?.toLocaleLowerCase()}`,
    },
  ];
  console.log("slugButtonConstants", slugButtonConstants, type);

  const createdBy = t("Created By");
  const orderStatus = t("Order status");
  const cancel = t("Cancel");
  useEffect(() => {
    if (lang?.selectedLang) {
      setLtr(lang?.selectedLang);
    } else {
      const fromLocal = localStorage.getItem("language");
      setLtr(fromLocal);
    }
  }, [lang?.selectedLang]);
  useEffect(() => {
    setTransHeaderaccess(!access?.is_edit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access?.form_name]);
  // useEffect(() => {
  //   const isEditMode = Boolean(type); // If type exists, assume edit mode
  //   const hasAccess = isEditMode ? access?.is_edit : access?.is_add;
  //   console.log("hasAccess", hasAccess, isEditMode);
  //   setTransHeaderaccess(!hasAccess); // disable button if no access
  // }, [access?.form_name, type]);

  console.log("type", typeof buttonLable);
  console.log(
    "access",
    access,
    transHeaderaccess,
    access?.is_edit,
    type,
    slugType
  );

  console.log("slugType::header", slugType);

  const [pr_index, cr_index, gcr_index] = indexList["Receive"];
  const [pi_index, ci_index, gci_index] = indexList["Invoice"];

  // inside Header.tsx (you already import localDB & router)
  function getMenuKeyFromPath(pathname: string) {
    const parts = (pathname || "").split("?")[0].split("/").filter(Boolean);
    const i = parts.indexOf("dashboard");
    return i >= 0 && parts[i + 1] ? parts[i + 1].toLowerCase() : "";
  }

  // 2) Delete ONLY Dexie rows for this screen (scoped wipe)
  async function clearDexieForMenu(menuKey: string) {
    if (!menuKey) return;
    const prefix = `barcode-products-${menuKey}-`;

    try {
      // Fast path: requires an index on "key" in localDB.state
      await localDB.state.where("key").startsWith(prefix).delete();
    } catch {
      // Fallback: scan & delete matched keys only (still scoped)
      const all = await localDB.state.toArray();
      const toDelete = all
        .map((r: any) => r?.key)
        .filter((k: any) => typeof k === "string" && (k.startsWith(prefix) || k.includes(`-${menuKey}-`)));
      await Promise.all(toDelete.map((k: string) => localDB.state.delete(k)));
    }
  }

  const handleBackAndClearScopedDexie = async () => {
    const menuKey = getMenuKeyFromPath(pathname);

    // Keep your existing local cleanups
    Cookies.remove("tr-session");
    localStorage.removeItem("ENTIDS");

    try {
      await clearDexieForMenu(menuKey);
      console.log("inn9"); // Clears ONLY this screen's Dexie cache
    } catch (e) {
      console.log("inn9");
      console.error("Dexie scoped clear failed:", e);
    } finally {
      // Check if searchParams include 'receive'
      const searchParams = window.location.pathname.split('/');// Use current URL search params
      // console.log("here78", Array.from(searchParams.entries()), window.location.pathname.split('/')[2]);

      const isReceivePage = searchParams.includes("procurement-receive");
      const isOrderPage = searchParams.includes("procurement-order")
      const isReturnPage = searchParams.includes("procurement-return")
      const isIvoicePage = searchParams.includes("procurement-invoice")
      const isSalesOrder = searchParams.includes("sales-salesorder")
      const isSalesInvoice = searchParams.includes("sales-salesinvoice")
      const isDeliverychellan = searchParams.includes("sales-deliverychallan")
      const isCreditNote = searchParams.includes("sales-creditnote")
      const isSalesReturn = searchParams.includes("sales-salesreturn")
      const isDebitNote = searchParams.includes("procurement-debitnote")
      console.log("searchParams", searchParams);
      console.log("isReceivePage", isReceivePage);

      if (isReceivePage) {
        // If the current page includes "receive" in the search params, push to /dashboard/procurement-receive
        router.push("/dashboard/procurement-receive");
      } else if (isOrderPage) {
        router.push("/dashboard/procurement-order");
      } else if (isReturnPage) {
        router.push("/dashboard/procurement-return");
      } else if (isIvoicePage) {
        router.push("/dashboard/procurement-invoice");
      }
      else if (isDebitNote) {
        router.push("/dashboard/procurement-debitnote");
      }
      else if (isSalesOrder) {
        router.push("/dashboard/sales-salesorder");
      }
      else if (isSalesInvoice) {
        router.push("/dashboard/sales-salesinvoice");
      }

      else if (isDeliverychellan) {
        router.push("/dashboard/sales-deliverychallan");
      }
      else if (isCreditNote) {
        router.push("/dashboard/sales-creditnote");
      }
      else if (isSalesReturn) {
        router.push("/dashboard/sales-salesreturn");
      }

      else {
        // Otherwise, use router.back() to go back
        router.back();
      }
    }
  };

  const userDetails = useUserStore(
    useCallback((state: any) => {
      try {
        return state.user ? JSON.parse(state.user) : null;
      } catch (error) {
        console.error("Error parsing user details:", error);
        return null;
      }
    }, [])
  );
  //this useeffect to handle access based on access previlidge for direct receive
  useEffect(() => {
    if (!userDetails) return;
    const accessList = userDetails?.accessPrivilegeList || [];
    const foundAccess = accessList.find(
      (item: any) => item.p_index == pr_index && item.c_index == cr_index
    );

    const foundAccess2 = accessList.find(
      (item: any) => item.p_index == pr_index && item.c_index == cr_index && item?.type_name === "GRN Against PO"
    );

    // setDirectReceive(foundAccess);
    setDirectReceive(foundAccess2);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails?.accessPrivilegeList?.length]);

  //this useeffect to handle access based on access previlidge for direct invoice
  useEffect(() => {
    if (!userDetails) return;
    const accessList = userDetails?.accessPrivilegeList || [];
    const foundAccess = accessList.find(
      (item: any) => item.p_index == pi_index && item.c_index == ci_index
    );
    console.log("foundAccess2", access);

    const foundAccess2 = accessList.find(
      (item: any) => item.p_index == pi_index && item.c_index == ci_index && item?.type_name === "PI Against GRN"
    );
    console.log("foundAccess2", foundAccess2, accessList);

    // setDirectIvoice(foundAccess);
    setDirectIvoice(foundAccess2);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails?.accessPrivilegeList?.length]);

  return (
    <>
      {slugType ? (
        <div
          className={styles.container}
          style={
            ltr === "ar"
              ? { flexDirection: "row-reverse" }
              : { flexDirection: "row" }
          }
        >
          <Row
            wrap={false}
            gutter={[16, 0]}
            justify={"center"}
            align={"middle"}
            style={ltr === "ar" ? { direction: "rtl" } : { direction: "ltr" }}
          >
            <Col>
              <ButtonComponent
                type="text"
                onClickEvent={handleBackAndClearScopedDexie}
                style={
                  ltr === "ar" ? { direction: "rtl" } : { direction: "ltr" }
                }
                className={styles.btnArrow}
              >
                {ltr === "ar" ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
              </ButtonComponent>
            </Col>
            <Col>
              <p className={styles.title}>{t(`${title}`)}</p>
              <Row gutter={[16, 0]} align={"middle"} wrap={false}>
                <Col>
                  <p className={styles.slugDetail}>
                    {createdBy}:{" "}
                    <span
                      style={{ fontWeight: "bold", paddingLeft: "4px" }}
                    >{t(`Admin`)}</span>
                  </p>
                </Col>
                {Boolean(type) && origin !== "grn" ? (
                  <Col>
                    <p className={styles.slugDetail}>
                      {orderStatus}:{" "}
                      {type && (
                        <StatusBadge
                          width={
                            type === "Waiting For Approval"
                              ? "120px"
                              : type === "Pending Approval"
                                ? "100px"
                                : "70px"
                          }
                          type={
                            origin === "dc" && type === true ? "Invoiced" : type
                          }

                        // type={type}
                        />
                      )}
                    </p>
                  </Col>
                ) : null}
              </Row>
            </Col>
          </Row>
          {/* here ismobile is kept for receive button should not visibe for mobile at the top  */}
          {/* {origin === "po" && type === "Approved" && !isMobile ? ( */}
          {type === "Approved" && !isMobile && origin !== "invoice" && origin !== "so" && origin !== "si" && origin !== "dc" && origin !== "sr" && origin !== "cn" ? (
            <Row gutter={[8, 0]} align={"middle"} wrap={false}>
              {slugButtonConstants.map((button, index) => {
                const isPoRatioApplied =
                  origin === "po" && poReceiveRatioData?.length > 0;

                const isDisabled =
                  isPoRatioApplied ||
                  !directReceive?.is_add ||
                  !directReceive?.is_view;

                return (
                  <Col key={index}>
                    <Tooltip
                      title={
                        isPoRatioApplied
                          ? "Disabled because PO ratio functionality is applied"
                          : ""
                      }
                    >
                      <span> {/* 🔥 Required for tooltip on disabled button */}
                        <ButtonComponent
                          onClickEvent={() =>
                            onClickSlugButtons && onClickSlugButtons(button.value)
                          }
                          size="middle"
                          className={styles.actionButton}
                          type={
                            slugButtonConstants.length - 1 < index + 1
                              ? "primary"
                              : button.value === "reset"
                                ? "text"
                                : "default"
                          }
                          disabled={isDisabled}
                        >
                          {t(button.label)}
                        </ButtonComponent>
                      </span>
                    </Tooltip>
                  </Col>
                );
              })}
            </Row>
          ) : // :
            origin === "grn" && type === "Open" && !isMobile ? (
              <>
                <Row gutter={[8, 0]} align={"middle"} wrap={false}>
                  <Col>
                    {customRightSideButton ? customRightSideButton : null}
                  </Col>
                  {slugButtonConstants.map((button, index) => {
                    return (
                      <Col key={index}>
                        <ButtonComponent
                          onClickEvent={() =>
                            onClickSlugButtons && onClickSlugButtons(button.value)
                          }
                          size="middle"
                          className={styles.actionButton}
                          type={
                            slugButtonConstants.length - 1 < index + 1
                              ? "primary"
                              : button.value === "reset"
                                ? "text"
                                : "default"
                          }
                          disabled={!directInvoice?.is_add || !directInvoice?.is_view}
                        >
                          {button.label}
                        </ButtonComponent>
                      </Col>
                    );
                  })}
                  <Col>
                    {Boolean(buttonLable) ? (
                      <ButtonComponent
                        className={styles.actionButton}
                        onClickEvent={onClick}
                        type="primary"
                        disabled={transHeaderaccess || buttonDisabled}
                      >
                        {buttonLable}
                      </ButtonComponent>
                    ) : null}
                  </Col>
                </Row>
              </>
            ) : origin === "invoice" && (type === "Open" || type === "Approved" || type === "Partially Paid") && !isMobile ? (
              <Row gutter={[8, 0]} align={"middle"} wrap={false}>
                {/* Show this ONLY if NOT Partially Paid */}
                {type !== "Partially Paid" && (
                  <Col>
                    {customRightSideButton ? customRightSideButton : null}
                  </Col>
                )}

                {slugButtonConstants.map((button, index) => {
                  return (
                    <Col key={index}>
                      <ButtonComponent
                        onClickEvent={() =>
                          onClickSlugButtons && onClickSlugButtons(button.value)
                        }
                        size="middle"
                        className={styles.actionButton}
                        type={
                          slugButtonConstants.length - 1 < index + 1
                            ? "primary"
                            : button.value === "reset"
                              ? "text"
                              : "default"
                        }
                        disabled={!directInvoice?.is_add || !directInvoice?.is_view}
                      >
                        {button.label}
                      </ButtonComponent>
                    </Col>
                  );
                })}

                {type !== "Partially Paid" && (
                  <Col>
                    {Boolean(buttonLable) ? (
                      <ButtonComponent
                        className={styles.actionButton}
                        onClickEvent={onClick}
                        type="primary"
                        disabled={transHeaderaccess || buttonDisabled}
                      >
                        {buttonLable}
                      </ButtonComponent>
                    ) : null}
                  </Col>
                )}
              </Row>
            ) : origin === "si" && (type === "Open" || type === "Approved" || type === "Partially Paid") && !isMobile ? (
              <Row gutter={[8, 0]} align={"middle"} wrap={false}>
                {type !== "Partially Paid" && (
                  <Col>
                    {customRightSideButton ? customRightSideButton : null}
                  </Col>
                )}

                {slugButtonConstants.map((button, index) => {
                  return (
                    <Col key={index}>
                      <ButtonComponent
                        onClickEvent={() =>
                          onClickSlugButtons && onClickSlugButtons(button.value)
                        }
                        size="middle"
                        className={styles.actionButton}
                        type={
                          slugButtonConstants.length - 1 < index + 1
                            ? "primary"
                            : button.value === "reset"
                              ? "text"
                              : "default"
                        }
                        disabled={!directInvoice?.is_add || !directInvoice?.is_view}
                      >
                        {button.label}
                      </ButtonComponent>
                    </Col>
                  );
                })}

                {type !== "Partially Paid" && (
                  <Col>
                    {Boolean(buttonLable) ? (
                      <ButtonComponent
                        className={styles.actionButton}
                        onClickEvent={onClick}
                        type="primary"
                        disabled={transHeaderaccess || buttonDisabled}
                      >
                        {buttonLable}
                      </ButtonComponent>
                    ) : null}
                  </Col>
                )}
              </Row>
            )


              :
              (origin !== "invoice" && origin !== "si" && origin !== "dc" && origin !== "so" && origin !== "sr" && origin !== "cn" && type === "Approved") ||

                // type === "Approved" ||
                type === "Received" ||
                type === "Cancelled" ||
                type === "In Progress" ||
                type === "In Progress" ||
                type === "Partially Paid" ||
                type === "Delivered" ||

                type === true ? null : (
                <Row gutter={[8, 0]} align={"middle"} wrap={false}>
                  <Col>{customRightSideButton ? customRightSideButton : null}</Col>
                  <Col>
                    {Boolean(buttonLable) ? (
                      <Tooltip title={buttonTooltip} placement="bottom" trigger={["hover"]}
                        overlayInnerStyle={{
                          fontSize: "11px",
                          // padding: "2px 6px",    
                          borderRadius: "4px",
                        }}>
                        <span style={{ display: "inline-flex" }}>
                          <ButtonComponent
                            className={styles.actionButton}
                            onClickEvent={onClick}
                            type="primary"
                            disabled={transHeaderaccess || buttonDisabled}
                          >
                            {buttonLable}

                            {/* {t(`${buttonLable}`)} */}
                          </ButtonComponent>
                        </span>
                      </Tooltip>
                    ) : null}
                  </Col>
                </Row>
              )}
        </div >
      ) : (
        <div
          className={styles.container}
          style={
            ltr === "ar"
              ? { flexDirection: "row-reverse" }
              : { flexDirection: "row" }
          }
        >
          <Row gutter={[16, 0]} justify={"center"} align={"middle"}>
            <Col>
              <Flex className={styles.title}>
                {typeof title === "string" ? t(title) : title}
                {loader ? <Loader className={styles.header} /> : null}
              </Flex>
              {/* <p className={styles.title}>{t(`${title}`)}</p> */}
              <p className={styles.description}>{t(`${description}`)}</p>
            </Col>
            {/* <Col>
              {}
            </Col> */}
          </Row>
          <Flex gap={8}>
            {customRightSideButton ? customRightSideButton : null}
            {Boolean(cancelButton) ? (
              <ButtonComponent
                type="text"
                htmlType="button"
                className={styles.cancel}
                onClickEvent={onClickCancel}
              >
                {t(cancel)}
              </ButtonComponent>
            ) : null}
            {Boolean(buttonLable) ? (
              <Tooltip title={buttonTooltip} placement="bottom" trigger={["hover"]}
                overlayInnerStyle={{
                  fontSize: "11px",
                  // padding: "2px 6px",    
                  borderRadius: "4px",
                }}>
                <span style={{ display: "inline-flex" }}>
                  <ButtonComponent
                    className={styles.actionButton}
                    onClickEvent={onClick}
                    type="primary"
                    id={buttonId}
                    disabled={disabled || buttonDisabled}
                  >
                    {/* {typeof title === "string" ? t(buttonLable) : buttonLable} */}
                    {buttonLable}
                  </ButtonComponent>
                </span>
              </Tooltip>
            ) : null}
          </Flex>
        </div >
      )}
    </>
  );
};
export default Header;
