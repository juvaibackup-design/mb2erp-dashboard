import React from "react";
import { Button, Modal } from "antd";
import cssStyles from "@/app/dashboard/(retail)/retail-pos/PosLayout.module.css";
import { Trash2 } from "@/components/Svg/Trash";
import PosStyles from "@/app/dashboard/(retail)/retail-pos/PosStyles";
import { Print } from "@/components/Svg/Print";
import { CloseIcon } from "@/components/Svg/CloseIcon";

const CommonModal = ({
  visible,
  onClose,
  children,
  width,
  style,
  contentHeight,
  showCloseIcon = true,
}: any) => {
  const { styles } = PosStyles.useStyle();

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      closeIcon={false}
      footer={null}
      centered={true}
      width={width}
      keyboard={true}
      className={styles.customModal}
      style={style}
    >
      <div
        className={`${cssStyles.modalContent}`}
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside it
      >
        {showCloseIcon && (
          <button className={cssStyles.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        )}
        <div
          className={cssStyles.modalBody}
          style={{ height: contentHeight, overflowY: "auto" }}
        >
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default CommonModal;
