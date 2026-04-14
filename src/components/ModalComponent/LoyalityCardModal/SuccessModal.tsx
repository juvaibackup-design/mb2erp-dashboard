import React from "react";
import { Flex, Modal, Upload, Button, UploadFile, Row, Col, Space } from "antd";
import styles from "./SuccessModal.module.css";
import CancelButton from "@/components/ButtonComponent/CancelButton";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import Header from "@/components/Header/Header";
import InputComponent from "@/components/InputComponent/InputComponent";
import { Footer } from "antd/es/layout/layout";
import InputNumberComponent from "@/components/InputComponent/InputNumberComponent";

interface RuleModalProps {
  openModal: boolean;
  setOpenModal?: Function;
  onClose: React.MouseEventHandler<HTMLElement>;
  onCancel: React.MouseEventHandler<HTMLElement>;
  // onUpload: (file: UploadFile<any>) => void; // New prop for handling photo upload
}

export default function RuleModal({
  openModal,
  setOpenModal,
  onClose,
  onCancel,
}: // onUpload,
RuleModalProps) {
  return (
    <Modal
      open={openModal}
      closeIcon={false}
      footer={null}
      width={318}
      className="custom-modal-global"
      centered={true}
      style={{ zIndex: 9999 }}
    >
      {/* <div>
        <CancelButton
          buttonLabel="Cancel"
          className={styles.cancelButton}
          onClick={onClose}
        />
      </div> */}
      <Flex vertical gap={24}>
        <Flex vertical gap={5}>
          <p className={styles.header}>Success</p>
          <p className={styles.alignCenter}>Card created successfully</p>
          <Flex vertical={true} gap={12}>
            <Row gutter={[24, 0]}>
              <Col span={24} style={{ margin: "6px" }}>
                <Flex vertical gap={8}>
                  <Row gutter={[8, 0]}>
                    <Col span={9}>
                      <p>Card Code :</p>
                    </Col>
                    <Col span={15}>
                      <p className={styles.justify_end}>
                        <b>PER/0021345/2023</b>
                      </p>
                    </Col>
                  </Row>
                  <Row gutter={[8, 0]}>
                    <Col span={12}>
                      <p>Created Date:</p>
                    </Col>
                    <Col span={12}>
                      <p className={styles.justify_end}>
                        <b>16-12-2023</b>
                      </p>
                    </Col>
                  </Row>
                  <Row gutter={[8, 0]}>
                    <Col span={12}>
                      <p>Created by:</p>
                    </Col>
                    <Col span={12}>
                      <p className={styles.justify_end}>
                        <b>Ahmed</b>
                      </p>
                    </Col>
                  </Row>
                </Flex>
              </Col>
            </Row>

            <div className={styles.groupButton}>
              <ButtonComponent
                type="default"
                className={styles.noButton}
                onClickEvent={onClose}
              >
                Share
              </ButtonComponent>
              <ButtonComponent
                type="default"
                className={styles.noButton}
                onClickEvent={onCancel}
              >
                Print
              </ButtonComponent>
            </div>

            <ButtonComponent type="primary" onClickEvent={onClose}>
              Continue to dashboard
            </ButtonComponent>
          </Flex>
        </Flex>
        {/* <div className={styles.groupButton}>
          <ButtonComponent
            type="default"
            className={styles.noButton}
            onClickEvent={onClose}
          >
            Share
          </ButtonComponent>
          <ButtonComponent
            type="default"
            className={styles.noButton}
            onClickEvent={onCancel}
          >
            Print
          </ButtonComponent>
        </div>
        <ButtonComponent type="primary" onClickEvent={onClose}>
          Continue to dashboard
        </ButtonComponent> */}
      </Flex>
    </Modal>
  );
}
