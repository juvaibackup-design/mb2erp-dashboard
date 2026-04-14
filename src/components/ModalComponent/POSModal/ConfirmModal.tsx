import React, { useEffect, useRef } from "react";
import { Button, Modal } from "antd";
import cssStyles from "./posmodal.module.css";
import { Trash2 } from "@/components/Svg/Trash";
import PosStyles from "@/app/dashboard/(retail)/retail-pos/PosStyles";
import { Print } from "@/components/Svg/Print";
import { useTranslation } from "react-i18next";

type Props = {
  isOpen: boolean;
  title: string;
  description: any;
  icon?: any;
  width?: any;
  confirm?: any;
  cancel?: any;
  template?: null | React.ReactNode;
  color: string;
  buttonText: string;
  cancelText?: string;
  maskClosable?: boolean;
  setIsOpen?: (fact: boolean) => void;
};

const ConfirmModal = (props: Props) => {
  const buttonRef = useRef<any>(null);
  const cancelRef = useRef<any>(null);
  const [focusButton, setFocusButton] = React.useState("button");
  const { styles } = PosStyles.useStyle();

  useEffect(() => {
    if (!props.isOpen) {
      buttonRef.current?.blur();
      cancelRef.current?.blur();
      return;  // Stop running focus logic
    }
    // Set a small delay before focusing the button to ensure modal is fully closed
    const timeout = setTimeout(() => {
      if (focusButton === "button") {
        buttonRef.current?.focus();
      } else if (focusButton === "cancel") {
        cancelRef.current?.focus();
      }
    }, 0); // Adjust delay based on your modal transition time

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, [props.isOpen, focusButton]);

  const handleArrowKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      setFocusButton("cancel");
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      setFocusButton("button");
    }
  };

  const { t } = useTranslation();

  return (
    <Modal
      open={props.isOpen}
      closeIcon={false}
      footer={null}
      width={props.width ? props.width : 350}
      centered={true}
      className={styles.customModal}
      maskClosable={props.maskClosable}
      onCancel={() => (props.setIsOpen ? props.setIsOpen(false) : undefined)}
    >
      <div className={cssStyles.modalContainer}>
        {props.icon ? (
          <div className={cssStyles.headerIcon2}>
            <div style={{ width: "48px", height: "48px" }}>{props.icon}</div>
          </div>
        ) : (
          <div className={cssStyles.headerIcon}>
            <div style={{ width: "24px", height: "24px" }}>
              <Trash2 color="#BA1A1A" />
            </div>
          </div>
        )}
        <div className={cssStyles.modalContent}>
          <p className={cssStyles.modalContentTitle}>{props.title}</p>
          <p className={cssStyles.modalContentDescription}>
            {props.description}
          </p>
        </div>
      </div>
      {props.template && props.template}
      <div className={cssStyles.modalAction}>
        <div className={cssStyles.modalActionContent}>
          <div
            className={cssStyles.modalActionButton}
            onKeyDown={handleArrowKeyPress}
            tabIndex={-1}
          >
            <button
              ref={buttonRef}
              className={cssStyles.modalButton1}
              style={{
                border: `1px solid ${props.color}`,
                background: props.color,
              }}
              onClick={props.confirm}
            >
              <span
                className={cssStyles.buttonText1}
                style={{ textWrap: "nowrap" }}
              >
                {props.buttonText}
              </span>
            </button>
            {props.cancel && (
              <button
                ref={cancelRef}
                className={cssStyles.modalButton2}
                onClick={props.cancel}
              >
                <p className={cssStyles.buttonText2}>
                  {props.cancelText ? props.cancelText : t("Cancel")}
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
