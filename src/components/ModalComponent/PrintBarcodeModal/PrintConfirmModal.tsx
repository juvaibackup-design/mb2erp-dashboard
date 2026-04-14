import React, { useState } from "react";
import { Col, Flex, Modal, Row, Space } from "antd";
import styles from "./PrintBarcodeModal.module.css";
import InputNumberComponent from "@/components/InputComponent/InputNumberComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent";
import PrintConfirmModal from "./PrintConfirmModal";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";

interface ConfirmModalProps {
  openModal: boolean;
  setOpenModal?: Function;
  // setIsModalOpen?: Function;
  onClose: React.MouseEventHandler<HTMLElement>;
}

export default function PrintLayoutModal({
  openModal,
  setOpenModal = () => {},
  onClose,
}: // setIsModalOpen = () => {}, // Provide a default value here
ConfirmModalProps) {
  return (
    <Modal
      open={openModal}
      closeIcon={false}
      footer={null}
      width={360}
      className="custom-modal-global"
      centered={true}
      style={{ zIndex: 9999 }}
    >
      <Flex vertical gap={24}>
        <Flex vertical gap={5}>
          <p className={styles.header}>Print Sent</p>
          <p className={styles.alignCenter}>Your Print Sent Succcessfully</p>
        </Flex>

        <div className={styles.groupButton}>
          <ButtonComponent
            type="default"
            className={styles.noButton}
            onClickEvent={onClose}
          >
            Share
          </ButtonComponent>
          <ButtonComponent type="default" className={styles.noButton}>
            Print
          </ButtonComponent>
        </div>
        <ButtonComponent type="primary" onClickEvent={onClose}>
          Continue To Dashboard
        </ButtonComponent>
      </Flex>
    </Modal>
  );
}
