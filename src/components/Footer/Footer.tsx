import React from "react";
import styles from "./Footer.module.css";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import { Col, Flex, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import StatusBadge from "../StatusBadge/StatusBadge";
import { useTranslation } from "react-i18next";

export type FooterProps = {
  title: string;
  description: string;
  buttonLable?: string | any;
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
};

const Footer = ({
  title,
  description,
  buttonLable,
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
}: FooterProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const cookies = Cookies;
  const slugButtonConstants = [
    // { label: "Reset", value: "reset" },
    // { label: "Save", value: "saveAs" },
    // { label: "Print", value: "print" },
    {
      label: `${slugTypeButtonLabel}`,
      value: `${slugTypeButtonLabel?.toLocaleLowerCase()}`,
    },
  ];

  const createdBy = t("Created By");
  const orderStatus = t("Order status");
  const cancel = t("Cancel");

  return (
    <>
      <div className={styles.container}>
        {type === "Approved" ? (
          <Row gutter={[8, 0]} align={"middle"} wrap={false}>
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
                  >
                    {t(button.label)}
                  </ButtonComponent>
                </Col>
              );
            })}
          </Row>
        ) : type === "Approved" ||
          type === "Received" ||
          type === "Cancelled" ||
          type === "In Progress" ? null : (
          <Row
            gutter={[8, 0]}
            align={"middle"}
            wrap={false}
            style={{ display: "flex" }}
          >
            <Col>{customRightSideButton ? customRightSideButton : null}</Col>

            <Col>
              {Boolean(buttonLable) ? (
                <ButtonComponent
                  className={styles.actionButton}
                  onClickEvent={onClick}
                  type="primary"
                  // autoFocus
                >
                  {/* {t(`${buttonLable}`)} */}
                  {buttonLable}
                </ButtonComponent>
              ) : null}
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default Footer;
