import React from "react";
import { Flex, Modal } from "antd";
import styles from "./ModalComponent.module.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useTranslation } from "react-i18next";
import useKeyPress from "@/lib/customHooks/useKeyPress";               // Shortcuts - Sherin

interface ConfirmModalProps {
  openModal: boolean;
  setOpenModal?: Function;
  onClose: React.MouseEventHandler<HTMLElement>;
  onCancel: React.MouseEventHandler<HTMLElement>;
  message?: string;
}

export default function ConfirmModal({
  openModal,
  setOpenModal,
  onClose,
  onCancel,
  message,
}: ConfirmModalProps) {
  const { t } = useTranslation();

// Shortcuts - Sherin
  const onKeyPress = (event: {
    preventDefault?: () => void;
    stopPropagation?: () => void;
    key: any;
    altKey: boolean;
  }) => {
    const k = String(event.key || "").toLowerCase();
    if (!event.altKey || !openModal) return;

    if (k === "y") {
      event.preventDefault?.();
      onClose({} as any); // trigger Yes
    }
    if (k === "n") {
      event.preventDefault?.();
      onCancel({} as any); // trigger No
    }
  };

  useKeyPress(["y", "Y", "n", "N"], onKeyPress);
// Ends

  return (
    <div style={{ zIndex: "10001" }}>
      <Modal
        open={openModal}
        closeIcon={false}
        footer={null}
        width={318}
        rootClassName="custom-confirm-modal"
        className="custom-modal-global"
        centered={true}
      >
        <Flex vertical gap={24} justify="center" align="center">
          <Flex vertical gap={5} align="center">
            <p className={styles.header}>{t("Attention")}</p>
            {message ? (
              <p className={styles.alignCenter}>{message}</p>
            ) : (
              <p className={styles.alignCenter}>
                {t(
                  "Any unsaved changes will be lost. Are you sure you want to leave?"
                )}
              </p>
            )}
          </Flex>
          <div className={styles.groupButton}>
            <ButtonComponent
              type="default"
              className={styles.yesButton}
              onClickEvent={onClose}
            >
              {t("Yes")}
            </ButtonComponent>
            <ButtonComponent
              type="default"
              className={styles.noButton}
              onClickEvent={onCancel}
            >
              {t("No")}
            </ButtonComponent>
          </div>
        </Flex>
      </Modal>
    </div>
  );
}
