import { Modal } from "antd";
import { t } from "i18next";

export const showAlert = (message: string) => {
  Modal.confirm({
    className: "custom-alert",                                      //Dark Mode Changes - Sherin
    title: t("Alert"),
    content: message,
    cancelButtonProps: { style: { display: "none" } },
    onOk: () => {
      // Do something when user clicks OK
    },
  });
};



