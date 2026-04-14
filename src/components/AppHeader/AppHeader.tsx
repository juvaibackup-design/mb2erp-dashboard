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
import axios from "axios";
import { decrypt, encrypt } from "@/lib/helpers/utilityHelpers";
import SelectComponent from "../SelectComponent/SelectComponent";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "antd";
import InputPasswordComponent from "@/app/_components/signInComponents/InputPasswordComponent";
import {
  getUUIDId,
  createUUIDId,
  getDeviceDetails,
  getLocationFromIP,
} from "@/lib/helpers/apiHandlers/ipId";
import dayjs from "dayjs";
import { localDB } from "@/store/localStorage/store";
import { clearAllDexieData } from "@/lib/helpers/dexieCleanup";
import { useProductStore } from "@/store/inventory/product/store";

export interface AppHeaderProps {
  children: React.ReactNode;
  paths?: string[];
  // trackMenu: any;
  // setTrackMenu: Function;
}
interface InvoiceTable {
  formName: string;
  invoiceNo: string;
  id: number;
  status: string;
  invoiceDate: string;
}
// --- Tab close cleanup (module-scope) ---
// const SESSION_FLAG_BY_MENU: Record<string, string> = {
//   "procurement-order": "ORDER_TAB_SESSION",
//   "procurement-receive": "RECEIVE_TAB_SESSION",
//   "procurement-invoice": "INVOICE_TAB_SESSION",
//   "procurement-debitnote": "DEBIT_TAB_SESSION",
//   "procurement-return": "RETURN_TAB_SESSION",
//   "sales-salesorder": "SALESORDER_TAB_SESSION",
//   "sales-salesinvoice": "SALESINVOICE_TAB_SESSION",
//   "sales-deliverychallan": "DELIVERYCHELLAAN_TAB_SESSION",
//   "inventory-stockaudit": "STOCKAUDIT_TAB_SESSION",
//   "inventory-stockadjustment": "STOCKADJUST_TAB_SESSION",
//   "sales-invoice": "SALES_TAB_SESSION",
//   "sales-salesreturn": "SALESRETURN_TAB_SESSION",
//   "sales-creditnote": "CREDITNOTE_TAB_SESSION",
//   "production-designandstyles": "DESIGNPAGE_TAB_SESSION",
//   "inventory-productlist": "PRODUCTLIST_TAB_SESSION",
//   "inventory-category": "CATEGORY_TAB_SESSION"
//   // add more as your screens use their own flag
// };

// async function deleteDexieForMenu(menuKey: string) {
//   const canonicalPrefix = `barcode-products-${menuKey}-`;
//   try {
//     await localDB.state.where("key").startsWith(canonicalPrefix).delete();
//   } catch {
//     const all = await localDB.state.toArray();
//     const keysToDelete: string[] = [];
//     for (const row of all) {
//       const k = row?.key;
//       if (typeof k !== "string") continue;
//       if (k.startsWith(canonicalPrefix) || k.includes(`-${menuKey}-`)) {
//         keysToDelete.push(k);
//       }
//     }
//     if (keysToDelete.length) {
//       await Promise.all(keysToDelete.map(k => localDB.state.delete(k)));
//     }
//   }
// }
// --- end helpers ---


const SESSION_FLAG_BY_MENU: Record<string, string> = {
  "procurement-order": "ORDER_TAB_SESSION",
  "procurement-receive": "RECEIVE_TAB_SESSION",
  "procurement-invoice": "INVOICE_TAB_SESSION",
  "procurement-debitnote": "DEBIT_TAB_SESSION",
  "inventory-stockaudit": "STOCKAUDIT_TAB_SESSION",
  "stock-audit-transaction": "STOCKAUDIT_TAB_SESSION",
  "inventory-managestock": "MANAGESTOCK_TAB_SESSION",
  "inter-stock-out": "INTERSTOCKOUT_TAB_SESSION",
  "inter-stock-in": "INTERSTOCKIN_TAB_SESSION",
  "bundle-creation": "BUNDLECREATION_TAB_SESSION",
  "misc-stock": "MISCELLANEOUS_TAB_SESSION",
  "rate-change": "RATECHANGE_TAB_SESSION",
  "inventory-stockadjustment": "STOCKADJUST_TAB_SESSION",
  "sales-invoice": "SALES_TAB_SESSION",
  "sales-return": "SALES_RETURN_TAB_SESSION",
  "sales-creditnote": "CREDITNOTE_TAB_SESSION",
  "production-designandstyles": "DESIGNPAGE_TAB_SESSION",
  "inventory-productlist": "PRODUCTLIST_TAB_SESSION",

  "inventory-logistics": "INWARD_TAB_SESSION",
  "inventory-requisition": "REQUISITION_TAB_SESSION",
  "production-jobreceive": "JOBRECEIVE_TAB_SESSION",
  "production-joborder": "JOBORDER_TAB_SESSION",
  "production-alteration": "ALTERATION_TAB_SESSION",
  "production-make-to-order": "MTO_TAB_SESSION",
  "retail-loyaltycard": "LOYALTYCARD_TAB_SESSION",
  "retail-customer": "CUSTOMER_TAB_SESSION",
  "admin-numberingscheme": "NUMBERINGSCHEME_TAB_SESSION",
  "admin-sitecreation": "SITECREATION_TAB_SESSION",
  "admin-transactionapproval": "TRANSACTION_APPROVAL_TAB_SESSION",
  "inventory-creategroup": "DEFAULT_TAB_SESSION",
  "inventory-category": "CATEGORY_TAB_SESSION",
  "sitecreation-ui": "SITECREATION_TAB_SESSION",
  "stockfloor-ui": "STOCKPOINT_TAB_SESSION",
  "globalsetting-ui": "GLOBALSETTING_TAB_SESSION",
  "general-ui": "GENERAL_TAB_SESSION",
  "finance-generalledger": "GENERALLEDGER_TAB_SESSION",
  "procurement-paymentvoucher": "PAYMENTVOUCHER_TAB_SESSION",
  "finance-journalvoucher": "JOURNALVOUCHER_TAB_SESSION",
  "admin-bins": "UI_SESSION_KEY",  // Change this to match the menu key
  "bin-management-admin-bins": "UI_SESSION_KEY", // Keep both for safety
  "bin-transaction-createBin-new": "BIN_TAB_SESSION"


};
async function deleteDexieForMenu(menuKey: string) {
  const canonicalPrefix = `barcode-products-${menuKey}-`;

  // STEP-1: Reset store BEFORE deleting Dexie
  useProductStore.getState().resetProductListFilters();

  // STEP-2: Delay to let UI unmount (prevent rewrite)
  requestAnimationFrame(async () => {
    try {
      await localDB.state.where("key").startsWith(canonicalPrefix).delete();
      console.log("Dexie deleted after unmount");
    } catch {
      const all = await localDB.state.toArray();
      const keys = all
        .map(r => r.key)
        .filter(k => typeof k === "string" && k.startsWith(canonicalPrefix));

      if (keys.length) {
        await localDB.state.bulkDelete(keys);
      }
    }
  });
}
//LOYALTYCARD
// Loyalty Card (retail-loyaltycard-form) draft cleaner
async function deleteLoyaltyCardDraftForMenu(menuKey: string) {
  // Your LoyaltyCard saves with: sessionKey = `${menuKey}-${slug}`
  // e.g. "retail-loyaltycard-form-create" or "retail-loyaltycard-form-edit-123"
  const prefixes = [
    `${menuKey}-`,                    // ✅ primary key pattern used by the page
    `lc-state-${menuKey}-`,          // (future/alt) autosave state
    `loyalty-state-${menuKey}-`,     // (future/alt) autosave state
    `barcode-products-${menuKey}-`,  // just in case anything reused the barcode cache
  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();

    }
  } catch {
    // Fallback sweep for old Dexie versions without startsWith
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}

// put this near your other cleaners
async function deleteJobOrderDraftForMenu(menuKey: string) {
  const prefixes = [
    `job-order-${menuKey}-`,   // your Job Order draft key
    // add any future state keys here if you introduce them:
    // `jo-state-${menuKey}-`,
  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
      console.log('order')
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}

//PRODUCT GROUP
// Product Group (Create Group) draft cleaner
async function deleteCreateGroupDraftForMenu(menuKey: string) {
  // Cover common key shapes you’ve used for this screen
  const prefixes = [
    `${menuKey}`,
    `cg-state-${menuKey}-`,          // form autosave/state
    `creategroup-${menuKey}-`,       // main draft (if you used it)
    `default-tab-${menuKey}-`,       // default tab state
    `barcode-products-${menuKey}-`,  // any barcode caches
  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
    }
  } catch {
    // Fallback sweep if startsWith is not supported
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}
// Add this function near your other delete functions
async function deleteBinManagementData(menuKey: string) {
  // The actual key pattern used in BinManagement.tsx is `bin-management-${slug}`
  // When slug is "admin-bins", the key becomes "bin-management-admin-bins"
  const canonicalPrefix = `bin-management-`; // Just match the prefix

  try {
    // Delete any keys that start with "bin-management-"
    await localDB.state.where("key").startsWith(canonicalPrefix).delete();
    console.log(`Dexie cleared for prefix: ${canonicalPrefix}`);
  } catch (err) {
    console.error("Error clearing Dexie for bin management:", err);
    // Fallback: manual sweep
    const all = await localDB.state.toArray();
    const keysToDelete = all
      .map((r: any) => r?.key)
      .filter((k: any) => typeof k === "string" && k.startsWith(canonicalPrefix));

    if (keysToDelete.length) {
      await Promise.all(keysToDelete.map((k: string) => localDB.state.delete(k)));
      console.log("Dexie cleared keys:", keysToDelete);
    }
  }
}
async function deleteBinAllocationTransaction(menukey: string) {
  const canonicalPrefix = `bin-allocation-`

  try {
    // Delete any keys that start with "bin-transaction-"
    await localDB.state.where("key").startsWith(canonicalPrefix).delete();
    console.log(`Dexie cleared for prefix: ${canonicalPrefix}`);

    // Also try to delete by specific pattern
    const all = await localDB.state.toArray();
    const keysToDelete = all
      .map((r: any) => r?.key)
      .filter((k: any) =>
        typeof k === "string" &&
        (k.startsWith(canonicalPrefix) || k.includes("bin-allocation-"))
      );

    if (keysToDelete.length) {
      await Promise.all(keysToDelete.map((k: string) => localDB.state.delete(k)));
      console.log("Additional keys deleted:", keysToDelete);
    }
  } catch (err) {
    console.error("Error clearing Dexie for bin management:", err);
    // Fallback: manual sweep
    const all = await localDB.state.toArray();
    const keysToDelete = all
      .map((r: any) => r?.key)
      .filter((k: any) =>
        typeof k === "string" &&
        (k.startsWith(canonicalPrefix) || k.includes("bin-allocation-"))
      );

    if (keysToDelete.length) {
      await Promise.all(keysToDelete.map((k: string) => localDB.state.delete(k)));
      console.log("Dexie cleared keys (fallback):", keysToDelete);
    }
  }
}
async function deleteBinTabTransaction(menuKey: string) {
  const canonicalPrefix = `bin-transaction-`;

  try {
    // Delete any keys that start with "bin-transaction-"
    await localDB.state.where("key").startsWith(canonicalPrefix).delete();
    console.log(`Dexie cleared for prefix: ${canonicalPrefix}`);

    // Also try to delete by specific pattern
    const all = await localDB.state.toArray();
    const keysToDelete = all
      .map((r: any) => r?.key)
      .filter((k: any) =>
        typeof k === "string" &&
        (k.startsWith(canonicalPrefix) || k.includes("bin-transaction-"))
      );

    if (keysToDelete.length) {
      await Promise.all(keysToDelete.map((k: string) => localDB.state.delete(k)));
      console.log("Additional keys deleted:", keysToDelete);
    }
  } catch (err) {
    console.error("Error clearing Dexie for bin management:", err);
    // Fallback: manual sweep
    const all = await localDB.state.toArray();
    const keysToDelete = all
      .map((r: any) => r?.key)
      .filter((k: any) =>
        typeof k === "string" &&
        (k.startsWith(canonicalPrefix) || k.includes("bin-transaction-"))
      );

    if (keysToDelete.length) {
      await Promise.all(keysToDelete.map((k: string) => localDB.state.delete(k)));
      console.log("Dexie cleared keys (fallback):", keysToDelete);
    }
  }
}

//CUSTOMER
async function deleteCustomerDraftForMenu(menuKey: string) {
  const prefixes = [
    `${menuKey}-`,
    // `customer-${menuKey}-`,
    // `barcode-products-${menuKey}-`,        // old variant if ever used
    // `cust-state-${menuKey}-`,  // your Job Order draft key

  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
      console.log('order')
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}

//LEDGER
async function deleteGenralLedgerDraftForMenu(menuKey: string) {
  const prefixes = [
    `${menuKey}-`,
    // `customer-${menuKey}-`,
    // `barcode-products-${menuKey}-`,        // old variant if ever used
    // `cust-state-${menuKey}-`,  // your Job Order draft key

  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
      console.log('order')
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}
//PAYMENT VOUCHER
async function deletePaymentVoucherDraftForMenu(menuKey: string) {
  const prefixes = [
    `${menuKey}-`,
    // `customer-${menuKey}-`,
    // `barcode-products-${menuKey}-`,        // old variant if ever used
    // `cust-state-${menuKey}-`,  // your Job Order draft key

  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
      console.log('order')
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}

// RECEIPT VOUCHER
async function deleteReceiptVoucherDraftForMenu(menuKey: string) {
  const prefixes = [
    `${menuKey}-`,
    // `customer-${menuKey}-`,
    // `barcode-products-${menuKey}-`,        // old variant if ever used
    // `cust-state-${menuKey}-`,  // your Job Order draft key

  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
      console.log('order')
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}

//JOURNAL VOUCHER
async function deleteJournalVoucherDraftForMenu(menuKey: string) {
  const prefixes = [
    `${menuKey}-`,
    // `customer-${menuKey}-`,
    // `barcode-products-${menuKey}-`,        // old variant if ever used
    // `cust-state-${menuKey}-`,  // your Job Order draft key

  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
      console.log('order')
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}

//Product Group 
// async function deleteCreateGroupDraftForMenu(menuKey: string) {
//   // Cover common key shapes you’ve used for this screen
//   const prefixes = [
//     `${menuKey}`,
//     `cg-state-${menuKey}-`,          // form autosave/state
//     `creategroup-${menuKey}-`,       // main draft (if you used it)
//     `default-tab-${menuKey}-`,       // default tab state
//     `barcode-products-${menuKey}-`,  // any barcode caches
//   ];
//   try {
//     for (const p of prefixes) {
//       await localDB.state.where("key").startsWith(p).delete();
//     }
//   } catch {
//     // Fallback sweep if startsWith is not supported
//     const all = await localDB.state.toArray();
//     const toDelete: string[] = [];
//     for (const row of all) {
//       const k = row?.key;
//       if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
//         toDelete.push(k);
//       }
//     }
//     if (toDelete.length) {
//       await Promise.all(toDelete.map(k => localDB.state.delete(k)));
//     }
//   }
// }
//SITECREATION
async function deleteSiteCreationDraftForMenu(menuKey: string) {
  const prefixes = [
    `${menuKey}-`,
    "sitecreation-ui-",
    "globalsetting-ui-",
    "stockfloor-ui-",
    "general-ui-"
    // `sitecreation-${menuKey}-`,
    // `barcode-products-${menuKey}-`,        // old variant if ever used
  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
      console.log('order')
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}
async function deleteSpecsDraftForMenu(menuKey: string) {
  // 1) Nuke ALL per-cat/bind specs snapshots
  try {
    await localDB.state.where("key").startsWith("specs-state-cat=").delete();
  } catch {
    // Fallback sweep (older Dexie)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && k.startsWith("specs-state-cat=")) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) await localDB.state.bulkDelete(toDelete);
  }

  // 2) Remove session flags used by Specs
  try {
    sessionStorage.removeItem("SPECS_TAB_SESSION");                         // page flag
    sessionStorage.removeItem(`category-deeplink-${menuKey}`);              // DEEPLINK_KEY
    sessionStorage.removeItem(`category-was-on-specs-${menuKey}`);          // WAS_ON_SPECS_KEY
  } catch { }
}
// 🆕 EXACTLY SAME STYLE AS OTHER MODULES
async function deleteRateChangeDraftForMenu(menuKey: string) {
  const prefixes = [
    `ratechange-state-inventory-managestock`,   // main key for Rate Change autosave
    `barcode-products-${menuKey}-`,   // barcode cache (like other modules)
    `rc-state-${menuKey}-`,           // fallback prefix if older version used
    `rate-change-state-${menuKey}-`,
  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
    }
  } catch {
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}


//Job RECeive
async function deleteJobReceiveDraftForMenu(menuKey: string) {
  const prefixes = [
    `job-receive-${menuKey}-`,   // primary JR draft (e.g., job-receive-production-jobreceive-create)
    `jr-state-${menuKey}-`,      // form state autosave
    `barcode-products-${menuKey}-`,
    `alteration-${menuKey}-`,      // main draft (e.g., alteration-production-alteration-create / edit-123)
    `alt-state-${menuKey}-`,       // autosave / form state
    `barcode-products-${menuKey}-`// any JR barcode caches (if reused)
  ];
  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}
//For ALTERATION
async function deleteAlterationDraftForMenu(menuKey: string) {
  const prefixes = [
    `alteration-${menuKey}-`,        // main draft (create/edit/id)
    `alt-state-${menuKey}-`,         // form autosave state
    `alt-measure-${menuKey}-`,       // measurement autosave (if used)
    `barcode-products-${menuKey}-`,  // any barcode caches
  ];
  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}


//NUMBERINGSCHEME
async function deleteNumberingSchemeDraftForMenu(menuKey: string) {
  const prefixes = [
    `${menuKey}-`,                      // admin-numberingscheme-
    `numbering-scheme-`,               // alt spelling with dash
    `numberingscheme-`,                // alt without dash
    `ns-state-${menuKey}-`,            // form autosave keyed to menu
    `ns-state-`,                       // generic ns state
    `ns-config-`,                      // any saved config
    `barcode-products-${menuKey}-`,       // old variant if ever used
  ];
  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
      console.log('order')
    }
  } catch {
    // Fallback sweep (older Dexie w/o startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }
    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}
// ADD: one generic sweeper for Manage Stock only
async function wipeAllDraftsForMenu(menuKey: string) {
  const rows = await localDB.state.toArray();
  const keysToDelete = rows
    .map((r: any) => r?.key)
    .filter((k: any) =>
      typeof k === "string" && (
        // common cache + autosave patterns you already use
        k.startsWith(`barcode-products-${menuKey}-`) ||
        k.startsWith(`iso-state-${menuKey}-`) ||

        // Bundle Creation variants saved under inventory-managestock
        k.startsWith(`bundle-create-${menuKey}-`) ||
        k.startsWith(`bundle-edit-${menuKey}-`) ||
        k.startsWith(`bc-state-${menuKey}-`) ||

        // Misc Stock variants saved under inventory-managestock
        k.startsWith(`misc-state-${menuKey}-`) ||

        // 🔥 Rate Change under Manage Stock
        k.startsWith(`ratechange-state-${menuKey}-`) ||
        k.startsWith(`rc-state-${menuKey}-`) ||
        k.startsWith(`rate-change-${menuKey}-`) ||

        // final safety net: anything that contains "-<menuKey>-"
        k.includes(`-${menuKey}-`)
      )
    ) as string[];

  if (keysToDelete.length) {
    await localDB.state.bulkDelete(keysToDelete);
  }
}


const Context = createContext(null);
//For Make-To-Order
async function deleteMTODraftForMenu(menuKey: string) {
  const prefixes = [
    `mto-${menuKey}-`,
    `make-to-order-${menuKey}-`,
    `mto-state-${menuKey}-`,
    `mto-measure-${menuKey}-`,
    `barcode-products-${menuKey}-`,
  ];
  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
    }
  } catch {
    // Fallback sweep (older Dexie without startsWith)
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];

    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }

    // final safety broom: anything that contains -<menuKey>- just in case key shape drifted
    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && k.includes(`-${menuKey}-`) && !toDelete.includes(k)) {
        toDelete.push(k);
      }
    }

    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
    }
  }
}
//For PrintTemplate
async function deletePrintTemplateDraftForMenu() {
  const prefixes = [
    "extrareport-ui-",   // 👈 matches UI_SESSION_KEY in ExtraReport
    "admin-extrareport-" // optional: in case you later save anything with this prefix
  ];

  try {
    for (const p of prefixes) {
      await localDB.state.where("key").startsWith(p).delete();
      console.log("[PrintTemplate] cleared keys starting with", p);
    }
  } catch {
    // Fallback sweep if .where().startsWith() isn’t available
    const all = await localDB.state.toArray();
    const toDelete: string[] = [];

    for (const row of all) {
      const k = row?.key;
      if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
        toDelete.push(k);
      }
    }

    if (toDelete.length) {
      await Promise.all(toDelete.map(k => localDB.state.delete(k)));
      console.log("[PrintTemplate] fallback cleared keys", toDelete);
    }
  }
}

function AppHeader({ children }: AppHeaderProps) {
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useTabStore(); // Zustand store

  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  console.log("pathname", pathname);
  const { slug } = useParams();  //Arun
  const TabContext: any = useContext(TabTrackContext); // to track the selected sub menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [password, setPassword] = useState("");
  // const [VoiceRecord, setVoiceRecord] = useState(false);
  // const { status, startRecording, stopRecording, mediaBlobUrl, error } =
  //   useReactMediaRecorder({ audio: true, screen: true });
  // const [showCameraIcon, setShowCameraIcon] = useState(false);
  const { trackMenu, setTrackMenu } = useContext<any>(TabTrackContext);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(-1);
  const userDetails = useUserStore((state: any) => JSON.parse(state?.user));

  const handleLogoClick = () => {
    setMenuOpen(!menuOpen);
  };
  const { Search } = Input;
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [multipleInvoice, setMultipleInvoice] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [tableData, setTableData] = useState<InvoiceTable[]>();
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [showLoginModal, setShowLoginModal] = useState<any>(
    Cookies.get("allowAccess123") == "true" || false
  );
  const [showToast, setShowToast] = useState<boolean>(false);
  const formDirty: boolean = useLoginStore((state: any) => state.formDirty);
  const setFormDirty: (fact: boolean) => void = useLoginStore(
    (state: any) => state.setFormDirty
  );
  const [openDirtyModal, setOpenDirtyModal] = useState<boolean>(false);
  const [routePath, setRoutePath] = useState<string>("");
  const [isWarningVisible, setisWarningVisible] = useState<boolean>(false);
  const [warningSec, setWarningSec] = useState<number>(30);
  const trackMenuRef = useRef<(HTMLDivElement | null)[]>([]);
  const [message, setMessage] = useState<string>("");
  const expireDate = Cookies.get("expire-date");

  useEffect(() => {
    if (expireDate === "True") {
      const event = new Event(CONSTANT.EXPIREDATE);
      window.dispatchEvent(event);
      Cookies.remove("expire-date");
    }
  })

  // const trackMenuData
  const Loader = useContext(LoaderContext);
  const formik = useFormik({
    initialValues: {
      // username: decrypt(Cookies.get("icube_saas_username1") || "") ?? "",
      // username: JSON.parse(Cookies.get("userDetails") ?? "{}")?.email,
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string(),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: (values) => {
      reLogin(values);
    },
  });

  const [api, contextHolder] = notification.useNotification();
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const currentUser = useRef<any>({});

  const showNotification = (type: "private" | "group", channel: "internal" | "whatsapp" | "support", data: any) => {
    console.log("Data123", data, type, currentUser.current.partyId);
    if (type == "group" && data[3] == currentUser.current.partyId)
      return;
    api.info({
      message: type == "group" ? (data[1] + " - " + data[2]) : data[1],
      description: <Context.Consumer>{() => type == "group" ? (data[4] || "Media") : (data[2] || "Media")}</Context.Consumer>,
      placement: "topRight",
    });
    if (Notification.permission == "granted") {
      // new Notification(`New ${type} message from ${type == "group" ? (data[1] + " - " + data[2]) : data[1]}`, {
      //   body: (type == "group" ? (data[4] || "Media") : (data[2] || "Media")),
      //   icon: "/icons/icube logo cropped quality.png"
      // })
      const notification = new Notification(`New ${type} message from ${type == "group" ? (data[1] + " - " + data[2]) : data[1]}`, {
        body: (type == "group" ? (data[4] || "Media") : (data[2] || "Media")),
        icon: "/icons/icube logo cropped quality.png",
        data: {
          // url: `${location.origin}/dm/hello`,
          url: `${location.origin}/dashboard/apps-supportboard`,
        },
      })
      notification.onclick = (event) => {
        Cookies.set("for-notification", JSON.stringify({ userId: data[0], type }))
        console.log("Data123", event, channel);

        event.preventDefault();
        window.focus(); // focus current tab
        // window.location.href = notification.data.url;
        router.push("/dashboard/apps-supportboard");

        notification.close();
      };
    }
  }

  useEffect(() => {
    makeApiCall.get("GetAllICubeChatGroups")
      .then((res) => setAllGroups(res.data.data))
      .catch((err) => {
        console.error(err);
        return [];
      });
    makeApiCall.get("GetChatUser")
      .then((res) => currentUser.current = res.data.data[0])
      .catch((err) => console.error(err));
  }, []);




  // console.log("userDetails", JSON.parse(Cookies.get("userDetails") ?? "{}"));
  // console.log("userDetails", JSON.parse(Cookies.get("userDetails") ?? "{}"));

  // console.log("Boolean(Cookies.get('allowAccess'))",Boolean(Cookies.get("allowAccess123")));
  const tableColumns: any[] = [
    { title: t("Type"), dataIndex: "formName", key: "formName" },
    {
      title: t("Invoice No."),
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      render: (value: string, record: any) => (
        <ButtonComponent
          type="link"
          onClickEvent={() => {
            setShowModal(false);
            setGlobalSearch("");
            router.push(
              myForm[record.formName][record.type](record.id, record.status)
            );
          }}
        >
          {value}
        </ButtonComponent>
      ),
    },
    { title: t("Invoice Date"), dataIndex: "invoiceDate", key: "invoiceDate" },
  ];

  const myForm: Record<string, any> = formPaths;

  // const handleCloseTab = async (index: number) => {
  //   const closedTabName = trackMenu[index]; // e.g. "Procurement Order"
  //   const normalized = closedTabName.toLowerCase().replace(/\s+/g, "-");
  //   const parts = pathname.split("/").filter(Boolean);
  //   let menuKey = parts[1] ?? "inventory-stockaudit";    // "procurement-order"
  //   // Use a prefix so we catch create/against/<id> variants:
  //   const prefix = `barcode-products-${menuKey}-`; // matches ...-create, ...-against, ...-123, etc.
  //   try {
  //     // Best path: delete by prefix using Dexie index on 'key'
  //     if (typeof localDB?.state?.where === "function") {
  //       await localDB.state.where("key").startsWith(prefix).delete();
  //       console.log(`Dexie cleared for prefix: ${prefix}`);
  //     } else {
  //       // Fallback: manual sweep
  //       const all = await localDB.state.toArray();
  //       const keys = all.map((r: any) => r?.key).filter((k: any) => typeof k === "string" && k.startsWith(prefix));
  //       await Promise.all(keys.map((k: string) => localDB.state.delete(k)));
  //       console.log(`Dexie cleared keys:`, keys);
  //     }
  //   } catch (err) {
  //     console.error("Error clearing Dexie:", err);

  //   }
  //   // Also clear the session flag used by OrderTransaction (safe no-op if absent)
  //   try {
  //     sessionStorage.removeItem("STOCKAUDIT_TAB_SESSION");


  //   } catch { }
  //   // ---- your existing logic below ----
  //   setFormDirty(false);
  //   Cookies.set("tabkey", "");
  //   setTrackMenu((prevTabs: string[]) => {
  //     const updatedTabs = [...prevTabs];
  //     const closedTab = updatedTabs[index]; // Get the closed tab
  //     if (trackMenu.length == 1) Cookies.remove("tabs");
  //     else
  //       Cookies.set(
  //         "tabs",
  //         `${trackMenu.filter((menu: string) => menu != closedTab).join(",")}`
  //       );

  //     // if (closedTab.includes("Reports-Report")) {
  //     //   // Check if there are any opened report tabs
  //     //   if (tabs.length > 0) {
  //     //     const confirmation = window.confirm(
  //     //       "You have opened reports tabs. Are you sure you want to close all report tabs?"
  //     //     );

  //     //     if (!confirmation) {
  //     //       return prevTabs; // Return the original array of tabs without modifications
  //     //     }

  //     //     // If confirmed, clear Zustand tabs and activeTab
  //     //     useTabStore.setState({
  //     //       tabs: [], // Clear Zustand tabs
  //     //       activeTab: null, // Clear Zustand activeTab
  //     //     });
  //     //   }
  //     // }

  //     updatedTabs.splice(index, 1);

  //     // Determine the next tab to activate if any remain
  //     if (updatedTabs.length > 0) {
  //       const newActiveTabIndex = index === 0 ? 0 : index - 1;
  //       handleClickTab(updatedTabs[newActiveTabIndex]);
  //     } else {
  //       // If no more trackMenu tabs are available, check for report tabs
  //       if (tabs.length > 0) {
  //         const lastReportTab = tabs[tabs.length - 1]; // Open the last report tab
  //         setActiveTab(lastReportTab);
  //         router.push(`/dashboard/reports-report/${lastReportTab.id}`);
  //       } else {
  //         // If no report tabs are available, navigate to the dashboard
  //         setTrackMenu([]); // Clear the trackMenu state
  //         router.push(`/dashboard/`);
  //       }
  //     }

  //     return updatedTabs;
  //   });

  // };

  // Manage Stock (Inter-Stock) draft cleaner
  async function deleteManageStockDraftForMenu(menuKey: string) {
    // These cover your InterStockOutForm session/save keys
    const prefixes = [
      `iso-state-${menuKey}-`,           // e.g. iso-state-inventory-managestock-create / edit-123
      `barcode-products-${menuKey}-`,    // any older/newer barcode caches by screen
    ];

    try {
      for (const p of prefixes) {
        await localDB.state.where("key").startsWith(p).delete();
      }
    } catch {
      // Fallback sweep (if where/startsWith not available)
      const all = await localDB.state.toArray();
      const toDelete: string[] = [];
      for (const row of all) {
        const k = row?.key;
        if (typeof k === "string" && prefixes.some(p => k.startsWith(p))) {
          toDelete.push(k);
        }
      }
      if (toDelete.length) {
        await Promise.all(toDelete.map(k => localDB.state.delete(k)));
      }
    }
  }

  //for inward form closing clear
  async function deleteInwardDraftForMenu(menuKey: string) {
    const inwardPrefix = `inward-draft-${menuKey}-`; // ex: inward-draft-inventory-logistics-*
    try {
      await localDB.state.where("key").startsWith(inwardPrefix).delete();
    } catch {
      // fallback sweep if where/startsWith isn't available
      const all = await localDB.state.toArray();
      const toDelete: string[] = [];
      for (const row of all) {
        const k = row?.key;
        if (typeof k === "string" && k.startsWith(inwardPrefix)) {
          toDelete.push(k);
        }
      }
      if (toDelete.length) {
        await Promise.all(toDelete.map(k => localDB.state.delete(k)));
      }
    }
  }
  //for inward form closing clear
  async function deleteProductGroupMenu(menuKey: string) {
    const inwardPrefix = `inward-draft-${menuKey}-`; // ex: inward-draft-inventory-logistics-*
    try {
      await localDB.state.where("key").startsWith(inwardPrefix).delete();
    } catch {
      // fallback sweep if where/startsWith isn't available
      const all = await localDB.state.toArray();
      const toDelete: string[] = [];
      for (const row of all) {
        const k = row?.key;
        if (typeof k === "string" && k.startsWith(inwardPrefix)) {
          toDelete.push(k);
        }
      }
      if (toDelete.length) {
        await Promise.all(toDelete.map(k => localDB.state.delete(k)));
      }
    }
  }
  async function deleteCategoryDraftForMenu(menuKey: string) {
    const prefixes = [
      `category-state-${menuKey}`, // current screen
      `category-state-`,           // safety (any residuals)
    ];
    try {
      for (const p of prefixes) {
        await localDB.state.where("key").startsWith(p).delete();
      }
    } catch {
      // fallback sweep
      const all = await localDB.state.toArray();
      await Promise.all(
        all
          .filter(r => typeof r?.key === "string" && prefixes.some(p => r.key.startsWith(p)))
          .map(r => localDB.state.delete(r.key))
      );
    }
  }

  //for LOYALTYCARD
  async function deleteLoyaltyCardDraftForMenu(menuKey: string) {
    // menuKey is "retail-loyaltycard-form"
    const knownPrefixes = [
      `${menuKey}-`,                 // e.g. retail-loyaltycard-form-create / edit-123
      `lc-state-${menuKey}-`,        // optional future autosave
      `loyalty-state-${menuKey}-`,   // optional future autosave
      `barcode-products-${menuKey}-` // any barcode caches under this screen
    ];

    // also support the no-hyphen variant you sometimes see in menus
    const altMenuKey = menuKey.replace(/-/g, ""); // retailloyaltycardform
    const altPrefixes = [
      `${altMenuKey}-`,
      `lc-state-${altMenuKey}-`,
      `loyalty-state-${altMenuKey}-`,
      `barcode-products-${altMenuKey}-`,
    ];

    const rows = await localDB.state.toArray();
    const keysToDelete: string[] = [];
    for (const row of rows) {
      const k = row?.key;
      if (typeof k !== "string") continue;
      if (
        knownPrefixes.some(p => k.startsWith(p)) ||
        altPrefixes.some(p => k.startsWith(p))
      ) {
        keysToDelete.push(k);
      }
    }
    if (keysToDelete.length) {
      await localDB.state.bulkDelete(keysToDelete);
    }
  }


  const handleCloseTab = async (index: number) => {
    // const closedTabName = trackMenu[index]; // e.g. "Procurement-Receive"
    // normalizeMenuName is already defined in your file
    // const menuKey = normalizeMenuName(closedTabName); // e.g. "procurement-receive"
    const closedTabName = trackMenu[index];                  // e.g. "Production-Make To Order"
    const rawMenuKey = closedTabName.replace(/\s+/g, '').toLowerCase(); // "production-maketoorder"
    const menuKey = normalizeMenuName(closedTabName);
    // LOYALTYCARD
    console.log('menukeyloyal', menuKey)
    if (menuKey === "retail-loyaltycard") {
      // tell the page to stop persisting & self-wipe this slug
      window.dispatchEvent(new Event("icube:close-loyaltycard"));

      // wait a microtask so the page listener runs before we nuke keys
      await Promise.resolve();

      // nuke all loyalty keys for all slugs
      await deleteLoyaltyCardDraftForMenu("retail-loyaltycard");

      try { sessionStorage.removeItem("LOYALTYCARD_TAB_SESSION"); } catch { }
    }
    if (menuKey === "createBin-new" || menuKey === "bin-transaction-createBin-new") {
      // Dispatch event for the page to clean itself - USE CORRECT EVENT NAME
      window.dispatchEvent(new Event("icube:close-bin-Tab"));  // ✅ Fixed: capital T

      // Delete all Dexie data for Bin Management
      await deleteBinTabTransaction(menuKey);

      // Clear session flags - REMOVE THE SPACE
      try {
        sessionStorage.removeItem("SESSION_FLAG");  // ✅ Fixed: no space
      } catch { }
    }
    if (menuKey === "createAllocation-new" || menuKey === "bin-allocation-createAllocation-new") {
      // Dispatch event for the page to clean itself - USE CORRECT EVENT NAME
      window.dispatchEvent(new Event("icube:close-bin-Tab"));  // ✅ Fixed: capital T

      // Delete all Dexie data for Bin Management
      await deleteBinAllocationTransaction(menuKey);

      // Clear session flags - REMOVE THE SPACE
      try {
        sessionStorage.removeItem("SESSION_FLAG");  // ✅ Fixed: no space
      } catch { }
    }
    if (menuKey === "admin-bins" || menuKey === "bin-management-admin-bins") {
      // Dispatch event for the page to clean itself
      window.dispatchEvent(new Event("icube:close-bin-Tab"));

      // Delete all Dexie data for Bin Management
      await deleteBinManagementData(menuKey);
      await deleteBinTabTransaction("bin-transaction");
      await deleteBinAllocationTransaction('bin-allocation')
      // Clear session flags
      try {
        sessionStorage.removeItem("UI_SESSION_KEY");
      } catch { }

      console.log(`[Dexie] Bin Management cleared for ${menuKey}`);
    }
    // 1) Clear Dexie
    if (menuKey === "inventory-logistics") {
      // Tell the page to run its own wipe logic
      window.dispatchEvent(new Event("icube:close-inward-form"));

      // Make sure we also blast the saved draft keys created by the page
      await deleteInwardDraftForMenu(menuKey);

      // Align the page's own session flags (these are the ones your page actually uses)
      try {
        sessionStorage.removeItem("INWARD_FORM_SESSION_OPEN");
        sessionStorage.removeItem("INWARD_FORM_CLOSED_BY_HEADER");
        sessionStorage.removeItem("OUTWARD_FORM_SESSION_OPEN");
        sessionStorage.removeItem("OUTWARD_FORM_CLOSED_BY_HEADER");
        sessionStorage.removeItem("GATE_ENTRY_SESSION_OPEN");
        sessionStorage.removeItem("GATE_ENTRY_CLOSED_BY_HEADER");
      } catch { }
    }
    // above for logistics
    // Below for manageStock
    if (menuKey === "inventory-managestock") {
      // Let the page clear its own local state (Zustand/Dexie/UI) if it wants
      window.dispatchEvent(new Event("icube:close-manage-stock"));

      // Remove page-created draft keys (session autosave + barcode caches)
      await deleteManageStockDraftForMenu(menuKey);
      await wipeAllDraftsForMenu(menuKey);
      // also wipe any Rate Change state saved under Manage Stock
      await deleteRateChangeDraftForMenu(menuKey); // menuKey === "inventory-managestock"


      // Align the page's own session flags (safe no-ops if absent)
      try {
        sessionStorage.removeItem("MANAGE_STOCK_SESSION_OPEN");
        sessionStorage.removeItem("MANAGE_STOCK_CLOSED_BY_HEADER");
        sessionStorage.removeItem("INTERSTOCKOUT_TAB_SESSION");
        sessionStorage.removeItem("INTERSTOCKIN_TAB_SESSION");
        sessionStorage.removeItem("INTERSTOCK_TAB_SESSION");
        sessionStorage.removeItem("INTER_STOCK_CLOSED_BY_HEADER");
      } catch { }

      // Optional: any local hints you use globally during selection
      try { localStorage.removeItem("ENTIDS"); } catch { }
    }
    // 🆕 ADD THIS JUST LIKE OTHER MODULES
    if (menuKey === "rate-change") {
      // Notify form page that this tab is closing (if listener exists)
      window.dispatchEvent(new Event("icube:close-ratechange"));

      // Delete Dexie data saved for Rate Change
      await deleteRateChangeDraftForMenu(menuKey);

      // Remove its session flag to stop autosave
      try {
        sessionStorage.removeItem("RATECHANGE_TAB_SESSION");
      } catch { }

      console.log(`[Dexie] Rate Change cleared for ${menuKey}`);
    }

    //below for joborder
    if (menuKey === "production-joborder") {
      // let the page nuke its own draft synchronously before we navigate
      window.dispatchEvent(new Event("icube:close-joborder"));

      // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
      await deleteJobOrderDraftForMenu(menuKey);
      console.log('menuKeyjoborder', menuKey)

      // also drop the page's session flag
      try { sessionStorage.removeItem("JOBORDER_TAB_SESSION"); } catch { }
    }
    //below for ProductGroup
    if (menuKey === "inventory-creategroup") {
      // Let the page clear any in-memory bits if it listens
      window.dispatchEvent(new Event("icube:close-creategroup"));

      // Hard delete Dexie rows for ALL slugs/variants of this screen
      await deleteCreateGroupDraftForMenu(menuKey);

      // Drop the session flag used by this screen (already in your map)
      try { sessionStorage.removeItem("DEFAULT_TAB_SESSION"); } catch { }

      // Force the next open to land on a fresh CREATE route
      try { localStorage.setItem(`lastPath_${menuKey}`, `/dashboard/${menuKey}`); } catch { }
    }
    //below for Jobreceipt
    if (menuKey === "production-jobreceive") {
      // let the page nuke its own draft synchronously before we navigate
      window.dispatchEvent(new Event("icube:close-jobreceive"));

      // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
      await deleteJobReceiveDraftForMenu(menuKey);

      // also drop the page's session flag
      try { sessionStorage.removeItem("JOBRECEIVE_TAB_SESSION"); } catch { }
    }
    // PRODUCTGROUP
    if (menuKey === "inventory-category") {
      // let the pages wipe their own in-memory state
      window.dispatchEvent(new Event("icube:close-category"));
      window.dispatchEvent(new Event("icube:close-specs")); // (optional) if you add a listener

      // delete Category page drafts
      await deleteCategoryDraftForMenu(menuKey);

      // delete Specs page drafts (per cat/bind snapshots + session flags)
      await deleteSpecsDraftForMenu(menuKey);

      // drop Category page’s session flag (you already had this)
      try { sessionStorage.removeItem("CATEGORY_TAB_SESSION"); } catch { }
    }


    //SITECREATION
    if (menuKey === "admin-sitecreation") {
      // let the page nuke its own draft synchronously before we navigate
      window.dispatchEvent(new Event("icube:close-sitecreation"));

      // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
      await deleteSiteCreationDraftForMenu(menuKey);

      // also drop the page’s session flag
      try {
        sessionStorage.removeItem("SITECREATION_TAB_SESSION");
        sessionStorage.removeItem("GLOBALSETTING_TAB_SESSION");
        sessionStorage.removeItem("STOCKPOINT_TAB_SESSION");
        sessionStorage.removeItem("GENERAL_TAB_SESSION");

      } catch { }
    }

    //NUMBERING SCHEME
    if (menuKey === "admin-numberingscheme") {
      // let the page nuke its own draft synchronously before we navigate
      window.dispatchEvent(new Event("icube:close-sitecreation"));
      // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
      await deleteNumberingSchemeDraftForMenu(menuKey);
      // also drop the page’s session flag
      try {
        sessionStorage.removeItem("NUMBERINGSCHEME_TAB_SESSION");
        sessionStorage.removeItem("NUMBERINGSCHEME_FORM_SESSION_OPEN");         // if you add it later
        sessionStorage.removeItem("NUMBERINGSCHEME_FORM_CLOSED_BY_HEADER");
      } catch { }
    }
    //ALTERATION
    if (menuKey === "production-alteration") {
      // Let the page clear any in-memory state (Zustand, timers, etc.)
      window.dispatchEvent(new Event("icube:close-alteration"));

      // Hard delete Dexie rows for ALL slugs (create/edit/<id>)
      await deleteAlterationDraftForMenu(menuKey);

      // Drop session flags (safe no-ops if absent)
      try {
        sessionStorage.removeItem("ALTERATION_TAB_SESSION");
        sessionStorage.removeItem("ALTERATION_FORM_SESSION_OPEN");
        sessionStorage.removeItem("ALTERATION_FORM_CLOSED_BY_HEADER");
      } catch { }
    }
    //CUSTOMER
    if (menuKey === "retail-customer") {
      // let the page nuke its own draft synchronously before we navigate
      window.dispatchEvent(new Event("icube:close-customer"));

      // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
      await deleteCustomerDraftForMenu(menuKey);
      console.log('menuKeyjoborder', menuKey)

      // also drop the page’s session flag
      try {
        sessionStorage.removeItem("CUSTOMER_TAB_SESSION");
      } catch { }
    }
    //LEDGER
    if (menuKey === "finance-generalledger") {
      // let the page nuke its own draft synchronously before we navigate
      window.dispatchEvent(new Event("icube:close-customer"));

      // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
      await deleteGenralLedgerDraftForMenu(menuKey);
      console.log('menuKeyjoborder', menuKey)

      // also drop the page’s session flag
      try {
        sessionStorage.removeItem("GENERALLEDGER_TAB_SESSION");
      } catch { }
    }
    // PAYMENT VOUCHER
    if (menuKey === "procurement-paymentvoucher") {
      // let the page nuke its own draft synchronously before we navigate
      window.dispatchEvent(new Event("icube:close-customer"));

      // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
      await deletePaymentVoucherDraftForMenu(menuKey);
      console.log('menuKeyjoborder', menuKey)

      // also drop the page’s session flag
      try {
        sessionStorage.removeItem("PAYMENTVOUCHER_TAB_SESSION");
      } catch { }
    }
    // RECEIPT VOUCHER
    if (menuKey === "procurement-receiptvoucher") {
      // let the page nuke its own draft synchronously before we navigate
      window.dispatchEvent(new Event("icube:close-customer"));

      // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
      await deleteReceiptVoucherDraftForMenu(menuKey);
      console.log('menuKeyjoborder', menuKey)

      // also drop the page’s session flag
      try {
        sessionStorage.removeItem("RECEIPTVOUCHER_TAB_SESSION");
      } catch { }
    }
    //JOURNAL VOUCHER
    if (menuKey === "finance-journalvoucher") {
      // let the page nuke its own draft synchronously before we navigate
      window.dispatchEvent(new Event("icube:close-customer"));

      // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
      await deleteJournalVoucherDraftForMenu(menuKey);
      console.log('menuKeyjoborder', menuKey)

      // also drop the page’s session flag
      try {
        sessionStorage.removeItem("JOURNALVOUCHER_TAB_SESSION");
      } catch { }
    }

    // //PRODUCTGROUP
    // if (menuKey === "inventory-logistics") {
    //   // let the page nuke its own draft synchronously before we navigate
    //   window.dispatchEvent(new Event("icube:close-productgrp"));

    //   // hard delete any leftover Dexie rows for ALL slugs (create/against/<id>)
    //   await deleteProductGroupMenu(menuKey);
    //   console.log('menuKeyjoborder', menuKey)

    //   // also drop the page’s session flag
    //   try {
    //     sessionStorage.removeItem("DEFAULT_TAB_SESSION");
    //     // localStorage.setItem(`lastPath_${menuKey}`, `/dashboard/${menuKey}/create`);
    //   } catch { }
    // }
    // PRINTTEMPLATE
    if (menuKey === "admin-extrareport") {
      // Let the page clear any in-memory bits if it listens
      window.dispatchEvent(new Event("icube:close-extrareport"));

      // Hard delete Dexie rows for ALL slugs/variants of this screen
      await deletePrintTemplateDraftForMenu();

      // Drop the session flag used by this screen
      try { sessionStorage.removeItem("PRINTTEMPLATE_TAB_SESSION"); } catch { }

      // Optional: force next open to a specific route if you want
      try {
        localStorage.setItem(`lastPath_${menuKey}`, `/dashboard/${menuKey}`);
      } catch { }
    }

    //MAKE-TO-ORDER
    // if (menuKey === "production-make-to-order") {
    if (menuKey === "production-orderhistory" || rawMenuKey === "production-orderhistory") {
      window.dispatchEvent(new Event("icube:close-orderhistory"));
      // await deleteMTODraftForMenu(menuKey);       // <-- now actually deletes the mto-... keys
      await deleteMTODraftForMenu("production-orderhistory");
      try {
        sessionStorage.removeItem("MTO_TAB_SESSION");
        sessionStorage.removeItem("MTO_FORM_SESSION_OPEN");
        sessionStorage.removeItem("MTO_FORM_CLOSED_BY_HEADER");
      } catch { }
    }
    try {
      await deleteDexieForMenu(menuKey);
      console.log(`[Dexie] cleared keys for ${menuKey}`);
    } catch (err) {
      console.error("Error clearing Dexie:", err);
    }

    // 2) Clear that screen’s session flag
    try {
      const flag = SESSION_FLAG_BY_MENU[menuKey];
      if (flag) sessionStorage.removeItem(flag);
    } catch { }
    // 3) Your existing tab UI logic (unchanged)
    setFormDirty(false);
    setTrackMenu((prevTabs: string[]) => {
      const updatedTabs = [...prevTabs];
      const closedTab = updatedTabs[index];
      if (trackMenu.length === 1) Cookies.remove("tabs");
      else
        Cookies.set(
          "tabs",
          `${trackMenu.filter((m: string) => m !== closedTab).join(",")}`
        );

      updatedTabs.splice(index, 1);

      if (updatedTabs.length > 0) {
        const newActiveTabIndex = index === 0 ? 0 : index - 1;
        handleClickTab(updatedTabs[newActiveTabIndex]);
      } else {
        if (tabs.length > 0) {
          const lastReportTab = tabs[tabs.length - 1];
          setActiveTab(lastReportTab);
          router.push(`/dashboard/reports-report/${lastReportTab.id}`);
        } else {
          setTrackMenu([]);
          router.push(`/dashboard/`);
        }
      }
      return updatedTabs;
    });
  };


  //backup
  //   const handleCloseTab = async (index: number) => {
  //   const closedTabName = trackMenu[index]; // e.g. "Procurement Order"
  //   const normalized = closedTabName.toLowerCase().replace(/\s+/g, "-");
  //   const parts = pathname.split("/").filter(Boolean);
  //   let menuKey = parts[1] ?? "inventory-stockaudit";    // "procurement-order"
  //   // Use a prefix so we catch create/against/<id> variants:
  //   const prefix = `barcode-products-${menuKey}-`; // matches ...-create, ...-against, ...-123, etc.
  //   try {
  //     // Best path: delete by prefix using Dexie index on 'key'
  //     if (typeof localDB?.state?.where === "function") {
  //       await localDB.state.where("key").startsWith(prefix).delete();
  //       console.log(`Dexie cleared for prefix: ${prefix}`);
  //     } else {
  //       // Fallback: manual sweep
  //       const all = await localDB.state.toArray();
  //       const keys = all.map((r: any) => r?.key).filter((k: any) => typeof k === "string" && k.startsWith(prefix));
  //       await Promise.all(keys.map((k: string) => localDB.state.delete(k)));
  //       console.log(`Dexie cleared keys:`, keys);
  //     }
  //   } catch (err) {
  //     console.error("Error clearing Dexie:", err);

  //   }
  //   // Also clear the session flag used by OrderTransaction (safe no-op if absent)
  //   try {
  //     sessionStorage.removeItem("STOCKAUDIT_TAB_SESSION");


  //   } catch { }
  //   // ---- your existing logic below ----
  //   setFormDirty(false);
  //   Cookies.set("tabKey", "");
  //   setTrackMenu((prevTabs: string[]) => {
  //     const updatedTabs = [...prevTabs];
  //     const closedTab = updatedTabs[index];

  //     if (trackMenu.length === 1) Cookies.remove("tabs");
  //     else
  //       Cookies.set(
  //         "tabs",
  //         `${trackMenu.filter((m: string) => m !== closedTab).join(",")}`
  //       );

  //     updatedTabs.splice(index, 1);

  //     if (updatedTabs.length > 0) {
  //       const newActiveTabIndex = index === 0 ? 0 : index - 1;
  //       handleClickTab(updatedTabs[newActiveTabIndex]);
  //     } else {
  //       if (tabs.length > 0) {
  //         const lastReportTab = tabs[tabs.length - 1];
  //         setActiveTab(lastReportTab);
  //         router.push(`/dashboard/reports-report/${lastReportTab.id}`);
  //       } else {
  //         setTrackMenu([]);
  //         router.push(`/dashboard/`);
  //       }
  //     }
  //     return updatedTabs;
  //   });

  // };
  useEffect(() => {  //Arun
    if (!pathname) return;

    // expect /dashboard/<menuKey>/...
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "dashboard") return;

    const menuKey = parts[1]; // e.g., "procurement-order"
    if (!menuKey) return;

    // persist full path (including query string)
    const fullPath =
      typeof window !== "undefined"
        ? pathname + window.location.search
        : pathname;

    localStorage.setItem(`lastPath_${menuKey}`, fullPath);
  }, [pathname]);

  // const handleCloseTab = (index: number) => {
  //   setTrackMenu((prevTabs: string[]) => {
  //     const updatedTabs = [...prevTabs];
  //     updatedTabs.splice(index, 1);

  //     // Determine the next tab to activate
  //     if (updatedTabs.length > 0) {
  //       const newActiveTabIndex = index === 0 ? 0 : index - 1;
  //       handleClickTab(updatedTabs[newActiveTabIndex]);
  //     }
  //     if (updatedTabs.includes("Reports-Report")) {
  //       useTabStore.setState({
  //         tabs: [], // Clear Zustand tabs
  //         activeTab: null, // Clear the active tab in Zustand
  //       });
  //     }
  //     return updatedTabs;
  //   });
  // };
  const { isTransactionDirty, setTransactionDirty } = useFormStore();
  const normalizeMenuName = (menuName: string): string => {
    let normalizedName =
      menuName.split(" ").length > 1
        ? menuName.split(" ").join("").toLocaleLowerCase()
        : menuName.toLocaleLowerCase();

    const mappings: Record<string, string> = {
      "admin-site": "admin-sitecreation",
      "inventory-productgroup": "inventory-creategroup",
      "reports-businessinsights": "reports-report",
      "reports-inventoryreport": "reports-report",
      "inventory-requisition": "inventory-request",
      "production-serviceorderhistory": "production-orderhistory",
      "retail-loyaltycardform": "retail-loyaltycard-form",
      "inventory-product": "inventory-productlist",
      "reports-dashboardviewer": "dashboard-viewer",
      "reports-dashboarddesigner": "dashboard-designer",
      "production-maketoorder": "production-orderhistory",
      "inventory-aging": "inventory-agingmaster",
      "finance-ledgers": "finance-generalledger",

      "admin-tax": "admin-taxmaster",
      "inventory-qctemplate": "inventory-qctemplatemaster",
      "admin-currencyexchange": "admin-currencyexchangerate",
      "inventory-creategroup": "inventory-creategroup",
      "knowhow": "userfaq",
      "apps-apps": "notification-apps",
      "admin-printtemplate": "admin-extrareport",
      "apps-chat": "apps-supportboard",
      "apps-chatbot": "apps-supportboard",
      "finance-naration": "finance-narration",
      "procurement-printbarcode": "procurement-printbarcode",
      "admin-bins": "admin-bins",  // Keep it as admin-bins, not admin-bin
      "admin-bin": "admin-bins",
      "apps-feedback": "apps-feedbackform",
      "payroll-attendancemanagement": "payroll-attendance",
      "payroll-loan&advance": "payroll-loanAdvance",
      "payroll-employeegroup": "payroll-empgroup"
    };

    return mappings[normalizedName] || normalizedName;
  };

  const handleClickTab = (
    name: string,
    tab?: { menuName: string; id: string }
  ) => {

    // // Handle the trackMenu logic
    // // Access the isDirty state from Zustand
    // if (isTransactionDirty) {
    //   // Show confirmation if the form is dirty
    //   const confirmation = window.confirm(
    //     "You have unsaved changes. Are you sure you want to leave this page?"
    //   );
    //   if (!confirmation) {
    //     return; // If the user doesn't confirm, do nothing
    //   } else {
    //     setTransactionDirty(false);
    //   }
    // }
    const normalized = normalizeMenuName(name);//Arun
    const remembered = localStorage.getItem(`lastPath_${normalized}`);//Arun
    const targetPath = remembered || `/dashboard/${normalized}`;//Arun
    setRoutePath(targetPath);//Arun
    router.push(targetPath);//Arun  

    var normalizedSubMenuName =
      name.split(" ").length > 1
        ? name.split(" ").join("").toLocaleLowerCase()
        : name.toLocaleLowerCase();

    if (normalizedSubMenuName == "admin-site")
      normalizedSubMenuName = "admin-sitecreation";
    else if (normalizedSubMenuName == "inventory-productgroup")
      normalizedSubMenuName = "inventory-creategroup";
    else if (normalizedSubMenuName == "reports-businessinsights")
      normalizedSubMenuName = "reports-report";
    else if (normalizedSubMenuName == "inventory-product")
      normalizedSubMenuName = "inventory-productlist";
    else if (normalizedSubMenuName == "admin-currencyexchange")
      normalizedSubMenuName = "admin-currencyexchangerate";
    else if (normalizedSubMenuName == "inventory-qctemplate")
      normalizedSubMenuName = "inventory-qctemplatemaster";
    else if (normalizedSubMenuName == "admin-tax")
      normalizedSubMenuName = "admin-taxmaster";
    else if (normalizedSubMenuName == "inventory-aging")
      normalizedSubMenuName = "inventory-agingmaster";
    else if (normalizedSubMenuName == "inventory-requisition")
      normalizedSubMenuName = "inventory-request";
    else if (normalizedSubMenuName == "production-maketoorder")
      normalizedSubMenuName = "production-orderhistory";
    else if (normalizedSubMenuName == "reports-dashboarddesigner")
      normalizedSubMenuName = "dashboard-designer";
    else if (normalizedSubMenuName == "reports-dashboardviewer")
      normalizedSubMenuName = "dashboard-viewer";
    else if (normalizedSubMenuName == "apps-apps")
      normalizedSubMenuName = "notification-apps";
    else if (normalizedSubMenuName == "finance-ledgers")
      normalizedSubMenuName = "finance-generalledger";
    else if (normalizedSubMenuName == "admin-printtemplate")
      normalizedSubMenuName = "admin-extrareport";
    else if (normalizedSubMenuName == "knowhow")
      normalizedSubMenuName = "userfaq";
    else if (normalizedSubMenuName == "apps-chat")
      normalizedSubMenuName = "apps-supportboard";
    else if (normalizedSubMenuName == "apps-feedback")
      normalizedSubMenuName = "apps-feedbackform"
    else if (normalizedSubMenuName == "payroll-attendancemanagement")
      normalizedSubMenuName = "payroll-attendance";
    else if (normalizedSubMenuName == "payroll-loan&advance")
      normalizedSubMenuName = "payroll-loanAdvance";
    else if (normalizedSubMenuName == "payroll-employeegroup")
      normalizedSubMenuName = "payroll-empgroup";

    const path = `/dashboard/${normalizedSubMenuName}`;

    setRoutePath(path);

    // if (formDirty || isTransactionDirty) {
    //   setOpenDirtyModal(true);
    // } else {
    //   router.push(path);
    //   setFormDirty(false);
    // }
  };
  const handleClickReportTab = (tab: { menuName: string; id: string }) => {
    // Check if the tab already exists in the list
    const existingTab = tabs.find((t: any) => t.id === tab.id);
    if (isTransactionDirty) {
      // Show confirmation if the form is dirty
      const confirmation = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );
      if (!confirmation) {
        return; // If the user doesn't confirm, do nothing
      } else {
        setTransactionDirty(false);
      }
    }
    if (existingTab) {
      // If the tab exists, set it as active
      setActiveTab(existingTab);
    } else {
      // If the tab doesn't exist, add it and set it as active
      addTab(tab);
      setActiveTab(tab);
    }

    // Navigate to the correct route using the `id` of the tab
    router.push(`/dashboard/reports-report/${tab.id}`);
  };
  useEffect(() => {
    // On component mount, check for any stored tabs in cookies
    const storedTabs = Cookies.get("openTabs");

    if (storedTabs) {
      try {
        const parsedTabs = JSON.parse(storedTabs);
        // Add each stored tab to Zustand state
        parsedTabs.forEach((tab: any) => addTab(tab));
      } catch (error) {
        console.error("Error parsing stored tabs from cookies:", error);
      }
    }
  }, [addTab]);
  // const handlePlayClick = () => {
  //   startRecording();
  //   setShowCameraIcon(true);
  // };

  // const handleStopClick = () => {
  //   stopRecording();
  //   setShowCameraIcon(false);
  // };

  const scrollRef = useRef<any>(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -100, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 100, behavior: "smooth" });
  };
  const handleCloseReportTab = (index: number, menuName: string, id: any) => {
    const getLocalStorageKey = (id: string, key: string) => `${id}_${key}`;

    // Clear local storage for the closed tab
    localStorage.removeItem(getLocalStorageKey(id, "fromDate"));
    localStorage.removeItem(getLocalStorageKey(id, "toDate"));
    localStorage.removeItem(getLocalStorageKey(id, "conditions"));
    localStorage.removeItem(getLocalStorageKey(id, "appearanceSettings"));
    localStorage.removeItem(`pivotGridState_${id}`); // Remove the pivotGridState for the closed tab

    // Remove the tab from Zustand store
    removeTab(menuName);

    const remainingTabs = tabs.filter((tab) => tab.menuName !== menuName); // Get remaining tabs

    console.log("remainingTabs :>> ", remainingTabs);

    if (remainingTabs.length > 0) {
      // If there are remaining tabs, activate the next appropriate tab
      const newActiveTabIndex = index === 0 ? 0 : index - 1; // Ensure valid index
      const nextTab = remainingTabs[newActiveTabIndex]; // Get the next tab to activate
      setActiveTab(nextTab);
      router.push(`/dashboard/reports-report/${nextTab.id}`);
    } else if (trackMenu.length > 0) {
      // If no report tabs remain but trackMenu has items, open the first item in trackMenu
      const lastTrackMenuItem = trackMenu[trackMenu.length - 1]; // Get the last item in trackMenu
      handleClickTab(lastTrackMenuItem);
    } else {
      // If no tabs and no trackMenu items, navigate to the dashboard
      setActiveTab(null);
      router.push("/dashboard");
    }
  };

  // const handleCloseReportTab = (index: number, menuName: string, id: any) => {
  //   const getLocalStorageKey = (id: string, key: string) => `${id}_${key}`;

  //   // Clear local storage for the closed tab
  //   localStorage.removeItem(getLocalStorageKey(id, "fromDate"));
  //   localStorage.removeItem(getLocalStorageKey(id, "toDate"));
  //   localStorage.removeItem(getLocalStorageKey(id, "conditions"));
  //   localStorage.removeItem(getLocalStorageKey(id, "appearanceSettings"));
  //   localStorage.removeItem(`pivotGridState_${id}`); // Remove the pivotGridState for the closed tab

  //   // Add other keys if there are more stored items
  //   // Remove the tab from Zustand store
  //   removeTab(menuName);

  //   const remainingTabs = tabs.filter((tab) => tab.menuName !== menuName); // Get remaining tabs

  //   if (remainingTabs.length > 0) {
  //     // If there are remaining tabs, activate the next appropriate tab
  //     const newActiveTabIndex = index === 0 ? 0 : index - 1; // Ensure valid index
  //     const nextTab = remainingTabs[newActiveTabIndex]; // Get the next tab to activate
  //     setActiveTab(nextTab);
  //     router.push(`/dashboard/reports-report/${nextTab.id}`);
  //   } else {
  //     // If no tabs are left, clear the active tab
  //     setActiveTab(null);
  //     router.push("/dashboard/reports-report"); // Navigate to a default route or dashboard if no tabs remain
  //   }
  // };

  //functionality for global search
  function handleDashboardSearch(value: string) {
    // if (!globalSearch) return;
    console.log("handling global search");
    makeApiCall
      .post("GetDashBoardSearch", {
        invoiceNo: value,
      })
      .then((res) => {
        // if (res.data.data.invoice.length > 1) {
        //   setMultipleInvoice(res.data.data.invoice);
        //   setFormName(res.data.data.accessPrivilegeList.form_name);
        //   setIsMultipleResult(true);
        //   setShowModal(true);
        // } else
        //   router.push(
        //     myForm[res.data.data.accessPrivilegeList.form_name](
        //       res.data.data.invoice[0].id
        //     )
        //   );
        if (res.data.data.accessPrivileges.length === 0) {
          // showAlert("Invoice number does not exist!");
          // setGlobalSearch("");
          console.log("Entering if");
          axios
            .post("https://icube.fouz.chat/include/api.php", {
              function: "search-articles",
              token: "126bc89bc1701acfbb9343aaf620e81d2fc47fb7",
              search: globalSearch.toLowerCase(),
            })
            .then((res1: any) => {
              console.log(res1);
              setAutoCompleteOptions(
                res1.data.response.map((article: any) => ({
                  label: article.title,
                  value: article.link,
                }))
              );
            })
            .catch((err1) => console.log(err1));
        } else if (
          res.data.data.accessPrivileges.length === 1 &&
          res.data.data.accessPrivileges[0].invoiceDetails.length === 1
        ) {
          console.log("Entering else if");
          router.push(
            myForm[res.data.data.accessPrivileges[0].form_name][
              res.data.data.accessPrivileges[0].invoiceDetails[0].type
            ](
              res.data.data.accessPrivileges[0].invoiceDetails[0].id,
              res.data.data.accessPrivileges[0].invoiceDetails[0].status
            )
          );
          setGlobalSearch("");
        } else {
          console.log("else");
          setMultipleInvoice(res.data.data.accessPrivileges);
          // setFormName(res.data.data.accessPrivilegeList.form_name);
          // setIsMultipleResult(true);
          setShowModal(true);
        }
      });
    // .catch((err) => showAlert(err.response.data.errordescription));
  }
  useEffect(() => {  //Arun
    if (!pathname) return;

    // expect /dashboard/<menuKey>/...
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "dashboard") return;

    const menuKey = parts[1]; // e.g., "procurement-order"
    if (!menuKey) return;

    // persist full path (including query string)
    const fullPath =
      typeof window !== "undefined"
        ? pathname + window.location.search
        : pathname;

    localStorage.setItem(`lastPath_${menuKey}`, fullPath);
  }, [pathname]);    //Arun
  window.addEventListener(CONSTANT.EXPIREDATE, (event) => {
    console.log("window::event", event);
    console.log("window::event", event?.type);
    console.log("innnn");
    setMessage(
      "This User is currently signed in on another device. Please enter your password to sign out from the other device and continue here."
    );

    setShowLoginModal(true);
    Cookies.remove("expire-date");
  });

  useEffect(() => {
    const invoices = multipleInvoice?.reduce((acc: any[], privilige: any) => {
      const invoiceDetails = privilige.invoiceDetails.map((invoice: any) => ({
        formName: invoice.menuName,
        type: invoice.type,
        invoiceNo: invoice.no,
        id: invoice.id,
        status: invoice.status,
        invoiceDate: invoice.date.split("T")[0],
      }));
      return acc.concat(invoiceDetails);
    }, []);

    setTableData(invoices);
  }, [multipleInvoice]);
  const lastSegment = pathname?.split("/").filter(Boolean).pop();
  console.log("lastSegment", lastSegment);

  // login form function starts
  // function getRenewedToken() {
  //   makeApiCall
  //     .post("RefreshToken", {
  //       emailId: JSON.parse(Cookies.get("userDetails") || "").email,
  //       refreshToken: Cookies.get("refreshToken"),
  //     })
  //     .then((res) => {
  //       const expiryDate = new Date(new Date().getTime() + 10 * 1000);
  //       Cookies.set("token1", res.data.accessToken, {
  //         expires: expiryDate,
  //       });
  //       Cookies.set("token", res.data.accessToken);
  //       Cookies.set("refreshToken", res.data.refreshtoken);
  //       setisWarningVisible(false);
  //       setShowLoginModal(false);
  //       Cookies.set("allowAccess123", "false");
  //       setShowToast(true);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       showAlert("Something went wrong re-signing in");
  //     });
  // }

  async function reLogin(values: any) {
    console.log("values1", values);
    // let values = {
    //   username: decrypt(Cookies.get("icube_saas_username1") || ""),
    //   // password: decrypt(Cookies.get("icube_saas_password1") || ""),
    //   password: password
    // };
    try {
      const currDate = dayjs()?.format("MM-DD-YY");
      const getIPDetail = await getLocationFromIP();
      console.log("dataaa", getIPDetail);
      let deviceUUID = getUUIDId();
      const deviceOS = getDeviceDetails();
      console.log("deviceOS", deviceOS);
      if (!deviceUUID) {
        console.log("innn");
        deviceUUID = createUUIDId();
      }
      const finalIP = getIPDetail?.ip + "/" + deviceUUID;
      console.log("deviceUUID", deviceUUID);

      // const res: any = await login(values);
      // const res: any = await login({
      //   username: JSON.parse(Cookies.get("userDetails") ?? "{}")?.email,
      //   password: values.password,
      // });
      const res: any = await login({
        username: decrypt(Cookies.get("icube_saas_username1") || ""),
        password: values.password,
        ip_address: finalIP,
        current_date: currDate,
        session_login: true,
      });
      console.log("res", res);
      if (res.status == 200) {
        // if (Cookies.get("idleMinutes")) {
        //   const expiryDate = new Date(
        //     new Date().getTime() +
        //       Number(Cookies.get("idleMinutes")) * 60 * 1000
        //   );
        //   Cookies.set("token1", res?.data?.accessToken, {
        //     expires: expiryDate,
        //   });
        // }
        const expiryDate1 = new Date(
          new Date().getTime() + 24 * 60 * 60 * 1000
        );
        Cookies.set("token", res?.data?.accessToken, {
          expires: expiryDate1,
        });
        Cookies.set("refreshToken", res?.data?.refreshToken, {
          expires: expiryDate1,
        });
        setShowLoginModal(false);
        Cookies.set("allowAccess123", "false");
        setShowToast(true);
        formik.resetForm();
      }
    } catch (err: any) {
      console.log(err);
      if (err?.response?.status === 500) {
        alert(`${err?.response?.data?.errordescription}`);
      } else {
        if (err?.response?.data?.errordescription?.includes("Password")) {
          formik.setFieldError("password", "Invalid password");
        } else {
          formik.setFieldError("username", "Domain not register");
        }
      }
    }
  }

  useEffect(() => {
    setTimeout(() => setShowToast(false), 3000);
  }, [showToast]);

  let idleTime = useRef<number>(0);

  // useEffect(() => {
  //   idleTime.current = 0;
  // }, []);

  useEffect(() => {
    if (!Cookies.get("token")) {
      return router.push("//");
    }

    // Reset idle time on user activity
    function resetIdleTime() {
      idleTime.current = 0;
    }

    // let warningModal: any = null;

    // Increment idle time every second
    const interval = setInterval(() => {
      // console.log("cookie", idleTime.current, Cookies.get("idleMinutes"));
      // console.log("token", Cookies.get("token"));
      // console.log("refresh", Cookies.get("refreshToken"));

      idleTime.current += 1; // Increase the idle time counter every second
      if (isWarningVisible) setWarningSec(warningSec - 1);
      if (
        Cookies.get("idleMinutes") &&
        ((Number(Cookies.get("idleMinutes")) * 60 < idleTime.current &&
          !showLoginModal) ||
          (warningSec - 1 == 0 && isWarningVisible))
      ) {
        setisWarningVisible(false);
        setShowLoginModal(true);
        Cookies.set("allowAccess123", "true");
      }
      if (
        Cookies.get("idleMinutes") &&
        Number(Cookies.get("idleMinutes")) * 60 - 30 < idleTime.current &&
        !showLoginModal &&
        !isWarningVisible
      ) {
        console.log("ALERTING USER", showLoginModal, isWarningVisible);
        // warningModal = Modal.confirm({
        //   title: "Alert",
        //   content:
        //     "You are reaching idle time have 30 seconds to avoid re-sign in",
        //   cancelButtonProps: { style: { display: "none" } },
        //   onOk: () => {
        //     // Do something when user clicks OK
        //   },
        // });
        setisWarningVisible(true);
        setWarningSec(30);
      }
    }, 1000);

    // Listen for activity and reset idle time
    window.addEventListener("mousemove", resetIdleTime);
    window.addEventListener("click", resetIdleTime);
    window.addEventListener("keydown", resetIdleTime);
    window.addEventListener("scroll", resetIdleTime);

    // You can then check `idleTime` to know how long the user has been idle

    // const cookieChecker = setInterval(() => {
    //   if (!Cookies.get("token1") && !showLoginModal) {
    //     Cookies.remove("token1");
    //     Cookies.remove("token");
    //     setShowLoginModal(true);
    //     Cookies.set("allowAccess123","true");
    //   }
    // }, 2000);

    // return () => clearInterval(cookieChecker);
    return () => clearInterval(interval); // Cleanup interval on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLoginModal, isWarningVisible, warningSec]);

  // Testing tab to tab idle minutes comms
  // useEffect(() => {
  //   // If the other tab enters password and make cookie false
  //   if (Cookies.get("allowAccess123") == "false") {
  //     setisWarningVisible(false);
  //     setShowLoginModal(false);
  //     idleTime.current = 0;
  //   } else {
  //     if (
  //       Cookies.get("idleMinutes") &&
  //       Number(Cookies.get("idleMinutes")) * 60 > idleTime.current &&
  //       !showLoginModal
  //     ) {
  //       console.log("else if");
  //       Cookies.set("allowAccess123", "false");
  //     }
  //   }
  // }, [document.cookie]);

  const handleLogout = async () => {
    // const token: any = Cookies.get("token");
    // const signOut = logout(token);
    // signOut
    //   .then((response) => {
    //     if (response.status === 200) {
    //       Cookies.remove("token");
    //       Cookies.remove("userDetails");
    //       router.push("/");
    //       Loader?.setLoader(false);
    //     }
    //   })
    //   .catch((err) => {
    //     Loader?.setLoader(false);
    //   });
    // setTimeout(async () => {
    setFormDirty(false);
    setisWarningVisible(false);
    setShowLoginModal(false);
    Loader?.setLoader(true);
    console.log("inn89");
    await clearAllDexieData();
    Cookies.remove("token");
    Cookies.remove("userDetails");
    Cookies.remove("openTabs");
    Cookies.remove("sb-login");
    Cookies.remove("idleMinutes");
    localStorage.clear();
    useUserStore.setState({
      user: null,
    });

    // Reset Zustand tab store (if necessary)
    useTabStore.setState({
      tabs: [], // Clear opened tabs in Zustand store
      activeTab: null, // Reset the active tab
    });
    Loader?.setLoader(false);
    // }, 500);
    router.push("/");

    // const event = new Event(CONSTANT.LOGOUT);
    // window.dispatchEvent(event);
  };

  useEffect(() => {
    if (trackMenuRef.current)
      trackMenuRef.current[currentTabIndex]?.scrollIntoView();
    console.log("currentTabIndex", currentTabIndex);
  }, [currentTabIndex]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const [ltr, setLtr] = useState<any>("en");
  const lang = useContext(TranslationContext);

  //Lang Translation
  useEffect(() => {
    if (lang?.selectedLang) {
      setLtr(lang?.selectedLang);
    } else {
      const fromLocal = localStorage.getItem("language");
      setLtr(fromLocal);
    }
  }, [lang?.selectedLang]);


  return (
    <Context.Provider value={null}>
      {contextHolder}
      <div className={styles.container}>



        <div className={styles.pageRenderContainer}>
          {children}
        </div>

      </div>
    </Context.Provider >
  );
}

export default AppHeader;
