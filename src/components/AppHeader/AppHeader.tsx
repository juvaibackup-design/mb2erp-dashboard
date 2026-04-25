"use client";
import React, { useState, useContext, useRef, useEffect, createContext } from "react";
import { useTranslation } from "react-i18next";
import { AutoComplete, Divider, Dropdown, Flex, Input, notification } from "antd";
import Image from "next/image";
import styles from "./AppHeader.module.css";
import {
  BellOutlined,
  SettingOutlined,
  CloseOutlined,
  TranslationOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  DownloadOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname, useParams } from "next/navigation";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import CollapseComponent from "../CollapseComponent/CollapseComponent";
import { Languages, Languages1 } from "@/lib/constants/dashboard";
import {
  LoaderContext,
  TabTrackContext,
  TranslationContext,
} from "@/lib/interfaces/Context.interfaces";
import { login, logout } from "@/lib/helpers/apiHandlers/login";
import Cookies from "js-cookie";
import "@/lib/antdOverwrittenCss/global.css";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import MobSideBar from "@/components/MobSideBar/MobSideBar";
import { useUserStore } from "@/store/userInfo/store";
import { CONSTANT } from "@/lib/constants/constant";
import useIsMobile from "@/lib/customHooks/useIsMobile";
import { useTabStore } from "@/store/report/tab/store";
import { useFormStore } from "@/store/formdirty/store";
// import { useReactMediaRecorder } from "react-media-recorder";
// import Webcam from "react-webcam";
// import Draggable from "react-draggable";
import formPaths from "./constants";
import ModalComponent from "../ModalComponent/ModalComponent";
import InputComponent from "../InputComponent/InputComponent";
import TableComponent from "../TableComponent/TableComponent";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import { showAlert } from "@/lib/helpers/alert";
import Toast from "../CustomToast/Toast";
import ConfirmModal from "../ModalComponent/ConfirmModal";
import { useLoginStore } from "@/store/login/store";
import { decrypt, encrypt } from "@/lib/helpers/utilityHelpers";
import SelectComponent from "../SelectComponent/SelectComponent";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "antd";
import InputPasswordComponent from "@/app/_components/signInComponents/InputPasswordComponent";

import dayjs from "dayjs";
import { useProductStore } from "@/store/inventory/product/store";

export interface AppHeaderProps {
  children: React.ReactNode;
  paths?: string[];
  // trackMenu: any;
  // setTrackMenu: Function;
}

const Context = createContext(null);

function AppHeader({ children }: AppHeaderProps) {






  return (
    <Context.Provider value={null}>
      {/* {contextHolder} */}
      <div className={styles.container}>



        <div className={styles.pageRenderContainer}>
          {children}
        </div>

      </div>
    </Context.Provider >
  );
}

export default AppHeader;
