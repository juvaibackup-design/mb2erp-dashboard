import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  width: string;
  color: string;
  text: string;
};
const StatusBadge2 = (props: Props) => {
  return (
    <div
      style={{
        border: `1px solid ${props.color}`,
        display: "inline-block",
        fontSize: "14px",
        backgroundColor: "transparent",
        textAlign: "center",
        width: props.width,
        color: props.color,
        boxShadow: `0 1px 1px ${props.color}`,
      }}
    >
      {props.text}
    </div>
  );
};

export default StatusBadge2;
