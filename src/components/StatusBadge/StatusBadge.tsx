// import { Tag } from "antd";
// import React from "react";
// import { useTranslation } from "react-i18next";

// export type StatusBadgeProps = {
//   type:
//   | "Waiting For Approval"
//   | "Hold"
//   | "Cancelled"
//   | "Approved"
//   | "Open"
//   | "Pending"
//   | "Pending Approval"
//   | "Expired"
//   | "In Progress"
//   | "Received"
//   | "Active"
//   | "Extinct"
//   | "Invoiced"
//   | "Partially Paid"
//   | "Paid"
//   | "Closed"
//   | "";
//   width?: any;
// };

// const StatusBadge = ({ type, width }: StatusBadgeProps) => {
//   const { t } = useTranslation();
//   return (
//     <React.Fragment>
//       {type?.length !== 0 || type !== "" || type !== null ? (
//         <Tag
//           color={"#fff"}
//           style={{
//             color:
//               type === "Hold" ||
//                 type === "Pending" ||
//                 type === "Pending Approval" ||
//                 type === "Waiting For Approval" || type === "Partially Paid"
//                 ? "#FAAD14"
//                 : type === "Approved" || type === "Active" || type === "Paid"
//                   ? "#52C41A"
//                   : type === "Invoiced"
//                     ? "#52C41A"
//                     : type === "Cancelled" ||
//                       type === "Extinct" ||
//                       type === "Expired" ||
//                       type === "Closed"
//                       ? "#F5222D"
//                       : type === "Open"
//                         ? "#0D39FE"
//                         : type === "In Progress"
//                           ? "#f27d52"
//                           : type === "Received"
//                             ? "#fff"
//                             : "#000",
//             width: width ? width : "82px",
//             border:
//               type === "Hold" ||
//                 type === "Pending" ||
//                 type === "Pending Approval" ||
//                 type === "Waiting For Approval" || type === "Partially Paid"
//                 ? "1px solid #FAAD14"
//                 : type === "Approved" || type === "Active" || type === "Paid"
//                   ? "1px solid #52C41A"
//                   : type === "Invoiced"
//                     ? "1px solid #52C41A"
//                     : type === "Cancelled" ||
//                       type === "Extinct" ||
//                       type === "Expired" ||
//                       type === "Closed"
//                       ? "1px solid #F5222D"
//                       : type === "Open"
//                         ? "1px solid #0D39FE"
//                         : type === "In Progress"
//                           ? "1px solid #f27d52"
//                           : type === "Received"
//                             ? ""
//                             : "1px solid #000",
//             borderRadius: "10px",
//             textAlign: "center",
//             fontSize: "10px",
//             fontStyle: "normal",
//             // fontWeight: "bold",
//             lineHeight: "100%" /* 10px */,
//             padding: "5px 11px",
//             marginRight: 0,
//             backgroundColor: type === "Received" ? "#0D39FE" : "",
//           }}
//         >
//           {t(type)}
//         </Tag>
//       ) : null}
//     </React.Fragment>
//   );
// };

// export default StatusBadge;



import { Tag } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

export type StatusBadgeProps = {
  type: string;
  width?: any;
  module?: "stockaudit" | "default"; // NEW
};

const StatusBadge = ({ type, width, module = "default" }: StatusBadgeProps) => {
  const { t } = useTranslation();

  if (!type) return null;

  // --- STOCK AUDIT COLORS ---
  const stockAuditColors: Record<string, string> = {
    Verify: "rgb(250, 173, 20)",
    Active: "rgb(242, 125, 82)",
    New: "rgb(13, 57, 254)",
    Completed: "rgb(82, 196, 26)",
  };

  // --- DEFAULT COLORS (your old ones) ---
  const defaultColors: Record<string, string> = {
    Hold: "#FAAD14",
    Pending: "#FAAD14",
    "Pending Approval": "#FAAD14",
    "Waiting For Approval": "#FAAD14",
    "Partially Paid": "#FAAD14",

    Approved: "#52C41A",
    Active: "#52C41A",
    Paid: "#52C41A",
    Invoiced: "#52C41A",

    Cancelled: "#F5222D",
    Extinct: "#F5222D",
    Expired: "#F5222D",
    Closed: "#F5222D",

    Open: "#0D39FE",
    "In Progress": "#f27d52",
    Received: "#ffffff",
  };

  // --- PICK COLOR SET ---
  const colorMap = module === "stockaudit" ? stockAuditColors : defaultColors;

  const color = colorMap[type] || "#000";
  const backgroundColor = type === "Received" ? "#0D39FE" : "";

  return (
    <Tag
      color="#fff"
      style={{
        color,
        border: `1px solid ${color}`,
        width: width || "82px",
        borderRadius: "10px",
        textAlign: "center",
        fontSize: "10px",
        lineHeight: "100%",
        padding: "5px 10px",
        marginRight: 0,
        backgroundColor,
      }}
    >
      {t(type)}
    </Tag>
  );
};

export default StatusBadge;

