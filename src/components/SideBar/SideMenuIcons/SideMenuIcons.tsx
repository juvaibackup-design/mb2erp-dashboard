import Image from "next/image";

import styles from "../SideMenuIcons/SideMenuIcons.module.css";
import {
  MenuUnfoldOutlined,
  PushpinOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface IconProps {
  name:
  | "Retail"
  | "Admin"
  | "Distribution"
  | "Finance"
  | "Forecasting"
  | "HRMS"
  | "Inventory"
  | "Notification"
  | "Procurement"
  | "Reports"
  | "Sales"
  | "Production"
  | "Utilities"
  | any;
  onClick?: Function;
}

const Icons = ({ name, onClick }: IconProps) => {
  // const isMobile = useMediaQuery({ maxWidth: 768 });

  // const imageSize = isMobile ? 20 : 18; // Set the image size based on device type

  switch (name) {
    case "Search":
      return <SearchOutlined />;
    case "Favourites":
      return <PushpinOutlined />;
    case "Menu":
      return (
        <MenuUnfoldOutlined onClick={(e) => (onClick ? onClick(e) : null)} />
      );
    case "Retail":
      return (
        <Image
          src={"/assets/Retail.png"}
          alt="Retail"
          width={0}
          height={0}
          className="menuImg"
        />
      );
    case "Admin":
      return (
        <Image
          // width={imageSize}
          // height={imageSize}
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Admin.png"}
          alt="Admin"
        />
      );
    case "Distribution":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Distribution.png"}
          alt="Distribution"
        />
      );
    case "Finance":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Finance.png"}
          alt="Finance"
        />
      );
    case "Forecasting":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Forecasting.png"}
          alt="Forecasting"
        />
      );
    case "HRMS":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/HRMS.png"}
          alt="HRMS"
        />
      );
    case "Inventory":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Inventory.png"}
          alt="Inventory"
        />
      );
    case "Apps":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Notification.png"}
          alt="Notification"
        />
      );
    case "Procurement":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Procurement.png"}
          alt="Procurement"
        />
      );
    case "Reports":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Reports.png"}
          alt="Reports"
        />
      );
    case "Sales":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Sales.png"}
          alt="Sales"
        />
      );
    case "Utilities":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Utilities.png"}
          alt="Utilities"
        />
      );
    case "Production":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Utilities.png"}
          alt="Production"
        />
      );
    case "Payroll":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/HRMS.png"}
          alt="Payroll"
        />
      );

    default:
      return null;
  }
};

export default Icons;
