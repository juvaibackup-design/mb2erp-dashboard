import {
  getBranchIdByHeader,
  getCompanyDetails,
} from "@/lib/helpers/getCookiesClient";
import * as Yup from "yup";
import {
  applyDecimal,
  applyPosFinalAmount,
  applyRoundOffWithDecimal,
  getRoundOffAmount,
  getUserDetails,
} from "@/lib/helpers/utilityHelpers";
import {
  clientGetApi,
  clientPostApi,
} from "@/lib/middleware/client/commonClientRequest";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { formatDate, formatDateAndTime } from "@/lib/helpers/dateFormat";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import { searchFunctionality } from "@/lib/helpers/filterHelpers";
import { usePOSStore } from "../retail/pos/store";
import { postCart } from "@/app/_components/retailPos/catalogue/apis";
import { useUserStore } from "../userInfo/store";
import { indexList } from "@/components/SideBar/Constants";
import usePrintStore from "../print/store";
import { CreateCustomer, GetLoyaltyPoints, PostBillSync, RedeemPoints, ReturnProduct } from "./ownchatApi";

interface ApiTypes {
  scanBarcode: string;
  refScanBarcode: string;
  scanTicket: string;
  mopList: string;
  barcodeValidation: string;
  invoiceLevelDiscount: string;
  posInititalData: string;
  posSave: string;
  posTicketSave: string;
  getSalesmanList: string;
  customerList: string;
  applyPromotion: string;
  lastBill: string;
  getTellerSummary: string;
  saveTellerSummary: string;
  getDenomination: string;
  saveDenomination: string;
  recentInvoices: string;
  posHistory: string;
  lastInvoiceBill: string;
  userSetting: string;
  customerBenefit: string;
  deleteHoldInvoice: string;
  tagReturnList: string;
  posMakeOrderSave: string;
  posTableColumns: string;
  posTellerPrint: string;
  notification: string;
  getGiftVoucher: string;
  pinelabsUpload: string;
  pinelabsStatus: string;
  pinelabsCancel: string;
  billSync: string;
  getLoyaltyPoints: string;
  redeemPoints: string;
  getTellerSummaryHistory: string;
  getCountryCode: string;
  getCreditDetails: string;
  GetAllCategoryListDetails: string;
  BikCreateCustomer: string;
  returnProduct: string;
  getTicketDetail: string;
}

interface FooterTypes {
  totItems: number;
  totQty: number;
  totTicketQty: number;
  scanQty: number;
  adjustedQty: number;
  discount: number;
  totAmt: number;
  roundOf: number;
  totPrice: number;
  totalReturn: number;
  totalGst: number;
  promoDiscount: number;
  grossSales: number;
}


interface GlobalSetting {
  mobileNoDigit: number;
  catGrouping?: string;
}

interface CountryCode {
  countryName: string,
  countryCode: number
}

interface TicketType {
  invoice: boolean,
  dc: boolean,
  isAgainstDC: boolean
}

interface POSType {
  invoiceType: number;
  holdType: number;
  returnType: number;
  orderType: number;
}

export interface POSContextProps {
  APIS: ApiTypes;
  searchBarcode: string | null;
  selectedRowKeys: any[];
  posDataList: any[];
  posStatus: string;
  barcodeCache: any;
  ticketCache: any;
  discountMasterDataList: any[];
  salesmanList: any[];
  mopDataList: any[];
  selectedMop: any;
  isTagCustomer: boolean;
  customerList: any[];
  selectedCustomer: any;
  footerCalculation: FooterTypes;
  mopValues: any;
  discountPopRate: any;
  dupDiscount: any[];
  posHistoryData: any;
  segment: Segment;
  posHistoryDetail: any;
  selectedViews: any;
  onSuccessModal: boolean;
  posHistoryFlag: boolean;
  invoiceAppliedDiscc: any;
  customerInitData: any;
  tellerSummaryList: DataType[];
  tellerSummaryCalculation: TellerSummary;
  denominationList: DenominationType[];
  isCopy: boolean;
  isEdit: boolean;
  notesVal: string;
  dueDate: any;
  trialDate: any;
  pickupDateTime: any;
  location: any;
  selectedType: any;
  isOrder: boolean;
  paymentSuccess: any;
  recentInvoiceList: any;
  historyDate: any;
  historyType: any;
  selectedRowKey: any;
  searchHistory: any;
  searchProduct: any;
  searchedItems: any;
  isAdvSearch: any;
  posEditData: any;
  isConfirmTeller: any;
  selectForVoid: any;
  customerBenefitData: any;
  multiScanBarcodes: any;
  isFetching: boolean;
  customerFocus: boolean;
  paymentFocus: boolean;
  openConfirm: boolean;
  posError: any;
  userRights: any | null;
  isCopySalesman: boolean;
  tagReturnData: any;
  posReturnData: any;
  checkOffer: any;
  catalogueProducts: any;
  catalogueTotal: any;
  pointsValue: any;
  initialData: any;
  mtrValue: any;
  shortcuts: any[];
  returnLists: any[];
  historyColumns: any[];
  createColumns: any[];
  reference: any;
  openTour: boolean;
  redeemPoint: any;
  currentStep: any;
  coupons: any;
  showPayment: any;
  connector: any;
  tellerHistories: any;
  isTellerHistory: any;
  tellerDate: any;
  tellerSummaryHistory: any;
  globalSetting: GlobalSetting;
  countryCode: CountryCode;
  creditDetails: any;
  walletDetails: any;
  showWallet: any;
  formik: any;
  mopEdit: boolean;
  autoFocus: boolean;
  allCategoryList: any[];
  catGroup: any;
  selectedProductDetail: any;
  categoryData: any;
  ticket: TicketType;
  ticketDataList: any;
  ticketHistoryData: any[];
  isProDiscount: boolean;
  entryType: POSType;
  setSearchBarcode: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<any[]>>;
  setPosDataList: React.Dispatch<React.SetStateAction<any[]>>;
  setPosStatus: React.Dispatch<React.SetStateAction<string>>;
  setdiscountMasterDataList: React.Dispatch<React.SetStateAction<any[]>>;
  setSalesmanList: React.Dispatch<React.SetStateAction<any[]>>;
  setMopDataList: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedMop: React.Dispatch<React.SetStateAction<string | null>>;
  setIsTagCustomer: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomerList: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<any>>;
  setFooterCalculation: React.Dispatch<React.SetStateAction<FooterTypes>>;
  getFooterTotal: (newList: any) => Promise<number>;
  _updateSalesPriceFromInput: (props: any) => any;
  onInvoiceOrderSubmit: () => any;
  setMopValues: React.Dispatch<React.SetStateAction<any>>;
  setDiscountPopRate: React.Dispatch<React.SetStateAction<any>>;
  setDupDiscount: React.Dispatch<React.SetStateAction<any[]>>;
  setPosHistoryData: React.Dispatch<React.SetStateAction<any>>;
  setSegment: React.Dispatch<React.SetStateAction<Segment>>;
  setPosHistoryDetail: React.Dispatch<React.SetStateAction<any>>;
  setSelectedViews: React.Dispatch<React.SetStateAction<any>>;
  setOnSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPosHistoryFlag: React.Dispatch<React.SetStateAction<boolean>>;
  handleApplyDiscount: (disc: any, record: any) => any;
  setInvoiceAppliedDiscc: React.Dispatch<React.SetStateAction<any>>;
  applyInvoiceLevelDiscount: (discData: any) => any;
  handleRemoveInvoiceDiscount: () => any;
  saveNewCustomer: (formData: any) => any;
  setCustomerInitData: React.Dispatch<React.SetStateAction<any>>;
  setTellerSummaryList: React.Dispatch<React.SetStateAction<DataType[]>>;
  setTellerSummaryCalculation: React.Dispatch<
    React.SetStateAction<TellerSummary>
  >;
  setDenominationList: React.Dispatch<React.SetStateAction<DenominationType[]>>;
  setIsCopy: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setNotesVal: React.Dispatch<React.SetStateAction<string>>;
  setDueDate: React.Dispatch<React.SetStateAction<any>>;
  setTrialDate: React.Dispatch<React.SetStateAction<any>>;
  setPickupDateTime: React.Dispatch<React.SetStateAction<any>>;
  setLocation: React.Dispatch<React.SetStateAction<any>>;
  setSelectedType: React.Dispatch<React.SetStateAction<any>>;
  setIsOrder: React.Dispatch<React.SetStateAction<boolean>>;
  setPaymentSuccess: React.Dispatch<React.SetStateAction<any>>;
  setRecentInvoiceList: React.Dispatch<React.SetStateAction<any>>;
  setHistoryDate: React.Dispatch<React.SetStateAction<any>>;
  setHistoryType: React.Dispatch<React.SetStateAction<any>>;
  setSelectedRowKey: React.Dispatch<React.SetStateAction<any>>;
  setSearchHistory: React.Dispatch<React.SetStateAction<any>>;
  setSearchProduct: React.Dispatch<React.SetStateAction<any>>;
  setSearchedItems: React.Dispatch<React.SetStateAction<any>>;
  setIsAdvSearch: React.Dispatch<React.SetStateAction<any>>;
  setPosEditData: React.Dispatch<React.SetStateAction<any>>;
  setSelectForVoid: React.Dispatch<React.SetStateAction<any>>;
  setIsConfirmTeller: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomerBenefitData: React.Dispatch<React.SetStateAction<any>>;
  setCustomerFocus: React.Dispatch<React.SetStateAction<boolean>>;
  setPaymentFocus: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setMultiScanBarcodes: React.Dispatch<React.SetStateAction<any>>;
  setPosError: React.Dispatch<React.SetStateAction<any>>;
  setIsCopySalesman: React.Dispatch<React.SetStateAction<boolean>>;
  setTagReturnData: React.Dispatch<React.SetStateAction<any>>;
  setCheckOffer: React.Dispatch<React.SetStateAction<any>>;
  setCatalogueProducts: React.Dispatch<React.SetStateAction<any>>;
  setCatalogueTotal: React.Dispatch<React.SetStateAction<any>>;
  setPointsValue: React.Dispatch<React.SetStateAction<number>>;
  setMtrValue: React.Dispatch<React.SetStateAction<any>>;
  setReturnLists: React.Dispatch<React.SetStateAction<any>>;
  setReference: React.Dispatch<React.SetStateAction<any>>;
  setOpenTour: React.Dispatch<React.SetStateAction<boolean>>;
  setRedeemPoint: React.Dispatch<React.SetStateAction<any>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<any>>;
  setCoupons: React.Dispatch<React.SetStateAction<any>>;
  setShowPayment: React.Dispatch<React.SetStateAction<any>>;
  setConnector: React.Dispatch<React.SetStateAction<any>>;
  setIsTellerHistory: React.Dispatch<React.SetStateAction<any>>;
  setTellerDate: React.Dispatch<React.SetStateAction<any>>;
  setCreditDetails: React.Dispatch<React.SetStateAction<any>>;
  setWalletDetails: React.Dispatch<React.SetStateAction<any>>;
  setShowWallet: React.Dispatch<React.SetStateAction<any>>;
  setAutoFocus: React.Dispatch<React.SetStateAction<any>>;
  setAllCategoryList: React.Dispatch<React.SetStateAction<any>>;
  setCatGroup: React.Dispatch<React.SetStateAction<any>>;
  setSelectedProductDetail: React.Dispatch<React.SetStateAction<any>>;
  setCategoryData: React.Dispatch<React.SetStateAction<any>>;
  setTicketDataList: React.Dispatch<React.SetStateAction<any>>;
  setTicket: React.Dispatch<React.SetStateAction<TicketType>>;
  setTicketHistoryData: React.Dispatch<React.SetStateAction<TicketType>>;
  setIsProDiscount: React.Dispatch<React.SetStateAction<boolean>>;
  setPosReturnData: React.Dispatch<React.SetStateAction<any>>;
  _handleQtyFromAction: (props: any) => any;
  tellerSummaryPrint: (startDate?: any, endDate?: any) => any;
  voidByIds: (ids: any) => any;
  tellerSummarySave: () => any;
  denominationSave: () => any;
  onClear: () => any;
  handleHold: () => any;
  lastInvoiceBill: (id?: any) => any;
  onApplyPromotion: () => any;
  getCustomerBenefit: (res?: any) => any;
  removeCustomerBenefitDiscount: () => any;
  checkOffers: () => any;
  saveCustomer: (data: any) => any;
  deleteHoldInvoice: (ids: any, type: any) => any;
  applyCoupon: (data: any) => any;
  setMakeOrderSave: React.Dispatch<React.SetStateAction<boolean>>;
  makeOrderSave: boolean;
  onMakeOrderSave: () => any;
  getDeviceName: () => any;
  getAllCustomer: (id?: any, search?: any, lastId?: any) => any;
  fetchAllHistory: (id: any, lastRowId: any) => any;
  getTellerSummary: (isCreate: any) => any;
  onValidateBarcode: () => any;
  onPreviewTeller: (startDate: any, endDate: any) => any;
  getTellerSummaryHistory: (id: any) => any;
  getCreditDetails: (customerId: any) => any;
  getWalletDetails: (customerId: any) => any;
  onCreditSave: () => any;
  getRecentInvoice: (lastRowId: any) => any;
  tourRefs: any;
  setMopEdit: React.Dispatch<React.SetStateAction<boolean>>;
  _callRedeemOtp: (data: any) => any;
  _calculateDiscount: (data: any) => any;
}

interface POSStatus {
  invoice: string;
  pos: string;
  ticket: string;
  againstDC: string;
  return: string;
  hold: string;
  holdOrder: string;
}

interface QUANTITYACTION {
  add: string;
  less: string;
}

interface DataType {
  id: React.Key;
  rId?: string | number;
  description: string;
  amount: string | number;
  wallet: string | number;
  credit: string | number;
  debit: string | number;
  balance: string | number;
  debitStatus: boolean;
  creditStatus: boolean;
  ledger: string;
  subLedger: string;
  loginDate?: string;
  status: boolean;
  activeStatus: string;
}

interface DenominationType {
  id: React.Key;
  denomination: string;
  factor: string | number;
  noOfUnits: string | number;
  amount: string | number;
}

interface TellerSummary {
  openingDate: string | Date;
  counterId: string;
  openingAmount: string | number;
  debit: string | number;
  credit: string | number;
  balance: string | number;
  activeStatus: "Open" | "Close";
}

interface TellerSummaryHistory {
  total: string | number;
  openingAmount: string | number;
  debit: string | number;
  credit: string | number;
  closingAmount: string | number;
  denominationAmount: string | number;
  shortage: string | number;
  excess: string | number;
}

interface Razorpay {
  apiKey: string;
  apiSecret: string;
}

export const POSContext = createContext<POSContextProps | null>(null);

export const POSSTATUS: POSStatus = {
  invoice: "INVOICE", // id = 2
  ticket: "TICKET", // id = 8
  againstDC: "AGAINSTDC", // id = 10
  pos: "POS ORDER", // id = 1
  return: "RETURN", // id = 3
  hold: "HOLD", //id=4
  holdOrder: "HOLD ORDER", //id=6
};

export const QUANTITYACTION: QUANTITYACTION = {
  add: "ADD",
  less: "LESS",
};

export const POSFOR = [
  { key: "1", label: POSSTATUS.pos },
  { key: "2", label: POSSTATUS.invoice },
  { key: "8", label: POSSTATUS.ticket },
  { key: "3", label: POSSTATUS.return },
  { key: "4", label: POSSTATUS.hold },
  { key: "6", label: POSSTATUS.holdOrder },
];

type Segment = "Create" | "History";

export const METER = ["MTR", "METER"];

export const POSContextProvider = ({ children }: { children: ReactNode }) => {
  var barcodeCache: any = {};
  var ticketCache: any = {};

  const APIS: ApiTypes = {
    scanBarcode: `GetPOSScanBarcode`,
    refScanBarcode: `GetPOSRefScanBarcode`,
    scanTicket: `GetScanTicketForInvoice`,
    mopList: `GetMOPDetailsForPOS`,
    barcodeValidation: `GetPOSScanBarcodeValidate`,
    posInititalData: `GetPOSInitialData`,
    // mopList: `GetMOPSummaryInfo`,
    invoiceLevelDiscount: `GetDiscountForPOS`,
    posSave: `POSSave`,
    posTicketSave: `TicketSave`,
    getSalesmanList: `GetAllSalesman`, //GetAllSalesman?branch_id=1
    customerList: `GetLoyaltyMemberList`,
    applyPromotion: `POSPromoBarcodeScan`,
    lastBill: `LastTransactionHistory`,
    getTellerSummary: `GetTellerSummary`,
    saveTellerSummary: `SaveTellerSummary`,
    getDenomination: `GetDenominationList`,
    saveDenomination: `SaveTellerSummaryDenomination`,
    recentInvoices: `RecentInvoicesList`,
    posHistory: `GetPOSHistory`,
    lastInvoiceBill: `PrintLastBill`,
    userSetting: `GetAllUserSettingsListForPos`,
    customerBenefit: `GetCustomerBenefit`,
    deleteHoldInvoice: `DeleteHoldHistory`,
    tagReturnList: `GetInvoiceTagReturnList`,
    posMakeOrderSave: `POSMakeOrderSave`,
    posTableColumns: `Getwebtablecolumnconfiguration`,
    posTellerPrint: `GetTellerSummaryPrintData`,
    notification: `SendNotification`,
    getGiftVoucher: `GetGiftVoucher`,
    pinelabsUpload: `PinelabsUpload`,
    pinelabsStatus: `PinelabsStatus`,
    pinelabsCancel: `PinelabsCancel`,
    billSync: `POSBillSynch`,
    getLoyaltyPoints: `GetLoyaltyPoints`,
    redeemPoints: `RedeemPoints`,
    getTellerSummaryHistory: `GetTellerSummaryHistory`,
    getCountryCode: `GetCountryCode`,
    getCreditDetails: `GetCreditDetails`,
    GetAllCategoryListDetails: `GetAllCategoryListDetails`,
    BikCreateCustomer: `BikCreateCustomer`,
    returnProduct: `ReturnProduct`,
    getTicketDetail: `GetAllTicketDetailForInvoice`
  };

  const shortcuts = [
    { key: 1, value: "+ (value)", text: "Increase 'Quantity'" },
    { key: 2, value: "- (value)", text: "Decrease 'Quantity'" },
    { key: 3, value: "@ (salesman code)", text: "Tag 'Salesman'" },
    { key: 4, value: "/ (value)", text: "Update the 'Price'" },
    { key: 5, value: "* (value)", text: "Update the 'Discount' terms of value" },
    {
      key: 6,
      value: "* (value) % ",
      text: "Update the 'Discount' terms of percentage",
    },
    {
      key: 7,
      value: ". (value)",
      text: "Enter the mobile number to tag the customer",
    },
    { key: 8, value: "0, enter", text: "MOP" },
    { key: 9, value: "Alt + S", text: "Save Bill" },
    { key: 10, value: "Alt + R", text: "Clear Invoice" },
    { key: 11, value: "Delete", text: "Selected Row delete" },
    { key: 13, value: "Alt + P", text: "Apply offers" },
    // { key: 12, value: "Alt + o", text: "Open applied promotions" },
    // { key: 13, value: "Alt + c", text: "Close applied promotions" },
    { key: 14, value: "Alt + I", text: "Invoice" },
    { key: 15, value: "Alt + E", text: "Return" },
    { key: 16, value: "Alt + C", text: "Catalogue" },
    { key: 17, value: "Alt + A", text: "Create" },
    { key: 18, value: "Alt + H", text: "History" },
    { key: 19, value: "Alt + T", text: "Teller Summary" },
    { key: 20, value: "Alt + D", text: "Selected Row Apply Discount" },
    { key: 21, value: "Alt + B", text: "Apply discount invoice level" },
    { key: 22, value: "Alt + L", text: "Apply discount product level" },
    { key: 23, value: "Alt + N", text: "Search customers" },
    { key: 22, value: "Alt + SHIFT + N", text: "Create a new customer" },
  ];

  const [posError, setPosError] = React.useState<any>({
    dueDate: "",
    pickupDateTime: "",
    location: "",
    error: "",
    teller: "",
  });
  const [mtrValue, setMtrValue] = React.useState<any>({
    index: null,
    returnQty: null,
    scanQty: null,
    qty: null,
    lessQty: null,
    isMtr: false,
    isReturn: false,
  });

  const [catGroup, setCatGroup] = React.useState({ showItem: false, previewItem: false });

  const [selectedProductDetail, setSelectedProductDetail] = React.useState<any>([]);

  const {
    products,
    setProducts,
    customer,
    setCustomer,
    cartData,
    // posCookie,
    // setPosCookie,
  } = usePOSStore((state) => state);

  const userDetail = getUserDetails();
  const printStore = usePrintStore();
  const loggedUser = getUserDetails();
  const userDetails = useUserStore(
    React.useCallback((state: any) => {
      try {
        return state.user ? JSON.parse(state.user) : null;
      } catch (error) {
        console.error("Error parsing user details:", error);
        return null;
      }
    }, [])
  );

  const [p_index, c_index, gc_index] = indexList["POS"];

  const createTourRefs = (count: number) => {
    return Array.from({ length: count }, () =>
      React.createRef<HTMLDivElement>()
    );
  };

  const [tourRefs, setTourRefs] = useState<any>(() => {
    const refs: any = createTourRefs(28);
    refs[3] = createTourRefs(3);
    refs[4] = createTourRefs(6);
    return refs;
  });

  const [ticket, setTicket] = useState<TicketType>({ invoice: false, dc: false, isAgainstDC: false });

  const [connector, setConnector] = useState({ points: 0, ownChat: false, pineLabs: false, bik: false, redeemOtp: false, pointsWithoutPromo: false });
  const [globalSetting, setGlobalSetting] = useState<GlobalSetting>({ mobileNoDigit: 10, catGrouping: "" });
  const [countryCode, setCountryCode] = useState<CountryCode>({ countryName: "india", countryCode: 91 });
  const [autoFocus, setAutoFocus] = React.useState(false);
  const [showWallet, setShowWallet] = React.useState(false);
  const [creditDetails, setCreditDetails] = React.useState([]);
  const [walletDetails, setWalletDetails] = React.useState([]);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [historyColumns, setHistoryColumns] = React.useState([]);
  const [allCategoryList, setAllCategoryList] = React.useState([]);
  const [categoryData, setCategoryData] = React.useState<any>({});
  const [createColumns, setCreateColumns] = React.useState([]);
  const [openTour, setOpenTour] = React.useState(false);
  const [showPayment, setShowPayment] = React.useState(false);
  const [isCopySalesman, setIsCopySalesman] = React.useState(false);
  const [customerFocus, setCustomerFocus] = React.useState(false);
  const [paymentFocus, setPaymentFocus] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [applyPromo, setApplyPromo] = React.useState(false);
  const [applyBenefit, setApplyBenefit] = React.useState(false);
  const tellerIsExist = Cookies.get("teller");
  const [userRights, setUserRights] = React.useState<any | null>(null);
  const [isConfirmTeller, setIsConfirmTeller] = React.useState<boolean>(false);
  const [segment, setSegment] = React.useState<Segment>("Create");
  const deviceName = Cookies.get("devicename");
  // const [deviceName, setDeviceName] = React.useState("");
  const [searchHistory, setSearchHistory] = React.useState("");
  const [searchProduct, setSearchProduct] = React.useState("");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);
  const [selectForVoid, setSelectForVoid] = useState<any[]>([]);
  const [catalogueProducts, setCatalogueProducts] = useState<any[]>([]);
  const [makeOrderSave, setMakeOrderSave] = useState<boolean>(false);
  const [searchedItems, setSearchedItems] = useState<any[]>([]);
  const [isAdvSearch, setIsAdvSearch] = useState(false);

  const [catalogueTotal, setCatalogueTotal] = useState<any>({
    itemCount: 0,
    totalAmount: 0,
    totalCount: 0,
  });

  const [historyType, setHistoryType] = useState(POSSTATUS.invoice);
  const [historyDate, setHistoryDate] = useState<any>([
    dayjs().format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD"),
  ]);

  const [tellerDate, setTellerDate] = useState<any>([
    dayjs().subtract(7, "day").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD"),
  ]);

  const [isCopy, setIsCopy] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isCustomerEdit, setIsCustomerEdit] = useState(false);
  const [isTellerHistory, setIsTellerHistory] = React.useState(false);
  const [notesVal, setNotesVal] = useState<any>(null);
  const [dueDate, setDueDate] = useState<any>(null);
  const [trialDate, setTrialDate] = useState<any>(null);
  const [pickupDateTime, setPickupDateTime] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>(1);
  const [initOrder, setInitOrder] = useState({
    isOrder: false,
    isMakeToOrder: false,
    dueDate: null,
    trialDate: null,
    pickupDateTime: null,
    location: null,
    selectedType: 1,
  });

  const [isOrder, setIsOrder] = useState<boolean>(false);
  const [posStatus, setPosStatus] = useState<string>(POSSTATUS.invoice);
  const [recentInvoiceList, setRecentInvoiceList] = useState<any>([]);
  const [searchBarcode, setSearchBarcode] = useState<any>(null);
  const [posDataList, setPosDataList] = useState<any[]>([]);
  const [ticketDataList, setTicketDataList] = useState<any[]>([]);
  const [tellerSummaryList, setTellerSummaryList] = React.useState<DataType[]>(
    []
  );
  const [denominationList, setDenominationList] = React.useState<
    DenominationType[]
  >([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRowKey, setSelectedRowKey] = useState<any>(null);
  const [discountMasterDataList, setdiscountMasterDataList] = useState<any[]>(
    []
  );
  const [salesmanList, setSalesmanList] = useState<any[]>([]);
  const [mopDataList, setMopDataList] = useState<any[]>([]);
  const [initialData, setInitialData] = useState<any>(null);
  const [mopValues, setMopValues] = React.useState<any[]>([]);
  const [selectedMop, setSelectedMop] = useState<any>(null);
  const [isTagCustomer, setIsTagCustomer] = useState<boolean>(false);
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [posEditData, setPosEditData] = useState<any>(null);
  const [checkOffer, setCheckOffer] = useState<any>({
    apply: false,
    status: false,
  });
  const [mopEdit, setMopEdit] = useState<boolean>(true);
  const [discountPopRate, setDiscountPopRate] = React.useState<any>(null);
  const [dupDiscount, setDupDiscount] = React.useState<any[]>([]);
  const [posHistoryData, setPosHistoryData] = React.useState<any>([]);
  const [posHistoryFlag, setPosHistoryFlag] = React.useState<boolean>(false);
  const [posHistoryDetail, setPosHistoryDetail] = React.useState<any>(null);
  const [ticketHistoryData, setTicketHistoryData] = React.useState<any>([]);
  const [selectedViews, setSelectedViews] = React.useState<any>([]);
  const [onSuccessModal, setOnSuccessModal] = React.useState<boolean>(false);
  const [invoiceAppliedDiscc, setInvoiceAppliedDiscc] = useState<any>(null);
  const [customerInitData, setCustomerInitData] = useState<any | null>(null);
  const [customerBenefitData, setCustomerBenefitData] = useState<any>(null);
  const [tellerHistories, setTellerHistories] = useState<any>([]);
  const [posReturnData, setPosReturnData] = useState<any>([]);
  const [tagReturnData, setTagReturnData] = React.useState([]);
  const [multiScanBarcodes, setMultiScanBarcodes] = React.useState([]);
  const [pointsValue, setPointsValue] = useState<number>(0);
  const [returnLists, setReturnLists] = useState<any>([]);
  const [customerEarnPoint, setCustomerEarnPoint] = useState(0);
  const [isProDiscount, setIsProDiscount] = React.useState<boolean>(false);
  const [redeemPoint, setRedeemPoint] = useState({
    point: "",
    pointAmount: "",
    redeemPoint: "",
  });

  const [reference, setReference] = React.useState({
    refEntryNo: "",
    refEntryDate: "",
    refMobileNo: "",
  });

  const [coupons, setCoupons] = React.useState([]);

  // const [razorpayAuth, setRazorPayAuth] = useState<Razorpay>({
  //   apiKey: "rzp_live_YpufKq5XX4lVTm",
  //   apiSecret: "ScLVl7tD1pJpVsPkP6Jug6Lr",
  // });

  const [isPayment, setIsPayment] = React.useState({
    cardProgress: false,
    cardPaid: false,
    cardFailed: "",
    creditProgress: false,
    creditPaid: false,
    creditFailed: "",
    upiProgress: false,
    upiPaid: false,
    upiFailed: ""
  });

  const { pos_cash_memo_copies = 1, pos_return_memo_copies = 1 } =
    (userRights?.userRights as any) || {};




  const [footerCalculation, setFooterCalculation] = useState<FooterTypes>({
    totItems: 0,
    totQty: 0,
    totTicketQty: 0,
    scanQty: 0,
    adjustedQty: 0,
    discount: 0,
    totAmt: 0,
    roundOf: 0,
    totPrice: 0,
    totalReturn: 0,
    totalGst: 0,
    promoDiscount: 0,
    grossSales: 0,
  });

  const [tellerSummaryCalculation, setTellerSummaryCalculation] =
    useState<TellerSummary>({
      openingDate: new Date(),
      counterId: "1",
      openingAmount: 0,
      debit: 0,
      credit: 0,
      balance: 0,
      activeStatus: "Close",
    });

  const [tellerSummaryHistory, setTellerSummaryHistory] =
    useState<TellerSummaryHistory>({
      total: 0,
      openingAmount: 0,
      debit: 0,
      credit: 0,
      closingAmount: 0,
      denominationAmount: 0,
      shortage: 0,
      excess: 0
    });


  //Handle type invoice/hold/return/order
  const entryType: POSType = React.useMemo(() => {
    if (ticket?.dc) {
      return { invoiceType: 8, holdType: 9, returnType: 12, orderType: 13 };
    }
    else if (ticket?.isAgainstDC) {
      return { invoiceType: 10, holdType: 11, returnType: 14, orderType: 15 };
    }
    else if (ticket?.invoice) {
      return { invoiceType: 2, holdType: 4, returnType: 3, orderType: 1 };
    }
    else return { invoiceType: 0, holdType: 0, returnType: 0, orderType: 0 };

  }, [ticket, posStatus]);

  //Footer Total
  const getFooterTotal = (newList: any[]) => {
    return new Promise<any>((resolve, reject) => {
      try {
        const { totalAmount } = newList.reduce(
          (acc, item) => {
            const { saleValue, productDiscountValType, productDiscountFactor } =
              item;

            let amount = parseFloat(saleValue);
            let prodisc = 0;
            if (Boolean(productDiscountFactor)) {
              if (productDiscountValType == "Amount") {
                prodisc = parseFloat(productDiscountFactor);
              } else {
                prodisc = (saleValue * parseFloat(productDiscountFactor)) / 100;
              }
            }

            amount = amount - prodisc;

            if (item.isTaken) {
              acc.totalAmount += amount;
            } else {
              acc.totalAmount -= amount;
            }
            return acc;
          },
          { totalAmount: 0 }
        );
        resolve(totalAmount);
      } catch (error) {
        reject(0);
      }
    });
  };

  //For filter without return items and reference retun items
  const scannedProducts = (items: any) => {
    return items.filter((d: any) => !d.isInvoiceReturn && d.isTaken && !!!Boolean(d.blockDiscount))
  }

  const _updateSalesPriceFromInput = (props: any) => {
    const { sanitizedValue, index } = props;
    setPosDataList((prevPosData) => {
      const updatedPosData: any = [...prevPosData];
      const currentRow = updatedPosData[index];
      const {
        productDiscountValue,
        productDiscountValType,
        productDiscountFactor,
        invoiceDiscountValue,
        invoiceDiscountValType,
        invoiceDiscountFactor,
        discount,
        qty,
        mrp,
        scanUnitQty,
      } = updatedPosData[index];

      let newDiscount: any = 0;
      if (Boolean(productDiscountValue)) {
        if (productDiscountValType == "Amount") {
          newDiscount = discount;
        } else {
          const diff: any = sanitizedValue * (productDiscountFactor / 100);
          updatedPosData[index]["discount"] = diff;
          newDiscount = diff;
        }
      }

      const discTotal = sanitizedValue - newDiscount;
      updatedPosData[index]["productDiscountValue"] = newDiscount;
      updatedPosData[index]["discountedSales"] = discTotal;
      updatedPosData[index]["initialAmount"] = discTotal;
      const mrpValue = mrp * (qty * scanUnitQty);
      const mrpDiscount = (mrp - sanitizedValue) * (qty * scanUnitQty);
      const mrpPercentage = (mrpDiscount / mrpValue) * 100;

      let amt =
        (Boolean(sanitizedValue) ? parseFloat(sanitizedValue) : 0) *
        parseFloat(currentRow?.qty);
      const amtWithoutDisc = amt;

      amt = Boolean(amt) ? amt - currentRow?.discount : amt;

      updatedPosData[index] = {
        ...updatedPosData[index],
        salePrice: sanitizedValue,
        discountedSales: applyDecimal(amt),
        saleValue: applyDecimal(amtWithoutDisc),
        mrpValue: mrpValue,
        mrpDiscount: mrpDiscount,
        mrpPercentage: mrpPercentage
      };

      if (Boolean(invoiceDiscountValue)) {
        getFooterTotal(scannedProducts(updatedPosData))
          .then((response) => {
            setPosDataList((prevPosData) => {
              return prevPosData.map((item) => {
                if (item.isTaken) {
                  const {
                    productDiscountValue,
                    saleValue,
                    productDiscountFactor,
                    productDiscountValType,
                  } = item ?? {};

                  let productAmt = parseFloat(saleValue);
                  let discount = 0;
                  let discountedSales = 0;
                  let invDiscVal: any = 0;

                  if (Boolean(productDiscountFactor)) {
                    if (productDiscountValType == "Amount") {
                      discount = parseFloat(productDiscountFactor);
                    } else {
                      discount =
                        (saleValue * parseFloat(productDiscountFactor)) / 100;
                    }
                  }

                  productAmt = productAmt - discount;

                  if (invoiceDiscountValType == "Amount") {
                    let perVal: any = (invoiceDiscountFactor / response) * 100;

                    invDiscVal = productAmt * (perVal / 100);
                  } else {
                    invDiscVal = productAmt * (invoiceDiscountFactor / 100);
                  }
                  discount = discount + invDiscVal;
                  discountedSales = saleValue - discount;

                  return {
                    ...item,
                    discount: discount,
                    invoiceDiscountValue: invDiscVal,
                    discountedSales: discountedSales,
                  };
                } else return item;
              });
            });
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
      return updatedPosData;
    });
  };

  const getInvoiceFinalAmount = () => {
    return posDataList.reduce(
      (acc, item) => {
        const { saleValue, productDiscountValType, productDiscountFactor } =
          item;

        let amount = parseFloat(saleValue);
        let prodisc = 0;
        if (Boolean(productDiscountFactor)) {
          if (productDiscountValType == "Amount") {
            prodisc = parseFloat(productDiscountFactor);
          } else {
            prodisc = (saleValue * parseFloat(productDiscountFactor)) / 100;
          }
        }

        amount -= prodisc;

        if (item.isTaken) {
          acc.totalAmount += amount;
        } else {
          acc.totalAmount -= amount;
        }
        return acc;
      },
      { totalAmount: 0 }
    );
  };

  //handle qty from action
  const _handleQtyFromAction = (props: any) => {
    const { index, newQty, action, mtrQty } = props;
    let newItems = [...posDataList];

    // updatedMtrValue.qty *
    // (Math.abs(updatedMtrValue.scanQty) - Math.abs(updatedMtrValue.lessQty)),
    const prevQty = newItems[index]["qty"];
    newItems[index]["qty"] = newQty;
    const mrp = newItems[index]["mrp"];
    const rate = newItems[index]["salePrice"];
    const { qty = null, scanQty = null, lessQty = null } = mtrQty || {};

    const itemQty = mtrQty
      ? qty * Math.abs(scanQty) - Math.abs(lessQty)
      : newQty;
    const totalAmt = itemQty * newItems[index]["salePrice"];

    newItems[index]["saleValue"] = totalAmt;

    const mrpValue = mrp * (newQty * Math.abs(scanQty ?? 1));
    const mrpDiscount = (mrp - rate) * (newQty * Math.abs(scanQty ?? 1));

    const {
      productDiscountValue,
      productDiscountValType,
      productDiscountFactor,
      invoiceDiscountValue,
      invoiceDiscountValType,
      invoiceDiscountFactor,
      discount,
      isInvoiceReturn,
      returnQty,
      discountedSales,
      loyaltyDiscount,
      promoDiscValue,
    } = newItems[index];

    let newDiscount: any = 0;
    if (Boolean(productDiscountValue)) {
      if (productDiscountValType == "Amount") {
        newDiscount = discount;
      } else {
        const diff: any = totalAmt * (productDiscountFactor / 100);
        newItems[index]["discount"] = diff;
        newDiscount = diff;
      }
    }

    let returnPromoDisc: any,
      returnItemDisc,
      returnInvDisc,
      retrunDiscount,
      returnLayaltyDisc;

    if (isInvoiceReturn) {
      let promoDisc: any, itemDisc: any, loayltyDisc: any, invDisc: any;
      if (action == QUANTITYACTION.less) {
        if (prevQty > 1) {
          promoDisc = promoDiscValue / (itemQty + 1);
          itemDisc = productDiscountValue / (itemQty + 1);
          loayltyDisc = loyaltyDiscount / (itemQty + 1);
          invDisc = invoiceDiscountValue / (itemQty + 1);
        } else {
          promoDisc = promoDiscValue;
          itemDisc = productDiscountValue;
          loayltyDisc = loyaltyDiscount;
          invDisc = invoiceDiscountValue;
        }

        returnPromoDisc = promoDisc * itemQty;
        returnItemDisc = itemDisc * itemQty;
        returnLayaltyDisc = loayltyDisc * itemQty;
        returnInvDisc = invDisc * itemQty;

        newDiscount = returnItemDisc;

        retrunDiscount = returnItemDisc + returnInvDisc + returnLayaltyDisc;
        newItems[index]["discount"] = retrunDiscount;
        newItems[index]["promoDiscValue"] = returnPromoDisc;
        newItems[index]["loyaltyDiscount"] = returnLayaltyDisc;
      } else if (action == QUANTITYACTION.add) {
        if (prevQty <= returnQty) {
          promoDisc = promoDiscValue / (itemQty - 1);
          itemDisc = productDiscountValue / (itemQty - 1);
          loayltyDisc = loyaltyDiscount / (itemQty - 1);
          invDisc = invoiceDiscountValue / (itemQty - 1);
        } else {
          promoDisc = promoDiscValue;
          itemDisc = productDiscountValue;
          loayltyDisc = loyaltyDiscount;
          invDisc = invoiceDiscountValue;
        }

        returnPromoDisc = promoDisc * itemQty;
        returnItemDisc = itemDisc * itemQty;
        returnLayaltyDisc = loayltyDisc * itemQty;
        returnInvDisc = invDisc * itemQty;

        newDiscount = returnItemDisc;

        retrunDiscount = returnItemDisc + returnInvDisc + returnLayaltyDisc;
        newItems[index]["discount"] = retrunDiscount;
        newItems[index]["promoDiscValue"] = returnPromoDisc;
        newItems[index]["loyaltyDiscount"] = returnLayaltyDisc;
      } else {
        promoDisc = promoDiscValue / prevQty;
        itemDisc = productDiscountValue / prevQty;
        loayltyDisc = loyaltyDiscount / prevQty;
        loayltyDisc = loyaltyDiscount / prevQty;
        invDisc = invoiceDiscountValue / prevQty;

        //returnInvDisc = invoiceDiscountValue;
        returnPromoDisc = promoDisc * itemQty;
        returnItemDisc = itemDisc * itemQty;
        returnLayaltyDisc = loayltyDisc * itemQty;
        returnInvDisc = invDisc * itemQty;

        newDiscount = returnItemDisc;

        retrunDiscount = returnItemDisc + returnInvDisc + returnLayaltyDisc;
        newItems[index]["discount"] = retrunDiscount;
        newItems[index]["promoDiscValue"] = returnPromoDisc;
        newItems[index]["loyaltyDiscount"] = returnLayaltyDisc;
      }


      const returnDiscTotal =
        totalAmt -
        (newDiscount + returnInvDisc + returnPromoDisc + returnLayaltyDisc
        );

      newItems[index]["productDiscountValue"] = newDiscount;
      newItems[index]["invoiceDiscountValue"] = returnInvDisc;

      newItems[index]["discountedSales"] = returnDiscTotal;
      newItems[index]["mrpValue"] = mrpValue;
      newItems[index]["mrpDiscount"] = Math.abs(mrpDiscount);

      if (mtrQty) {
        newItems[index]["scanUnitQty"] = scanQty * newQty;
        newItems[index]["adjustedQty"] = lessQty;
      } else {
        newItems[index]["scanUnitQty"] = newQty;
      }
      setPosDataList(newItems);
      return;
    }

    const discTotal = totalAmt - newDiscount;

    newItems[index]["productDiscountValue"] = newDiscount;
    newItems[index]["discountedSales"] = discTotal;
    newItems[index]["mrpValue"] = mrpValue;
    newItems[index]["mrpDiscount"] = Math.abs(mrpDiscount);

    if (mtrQty) {
      newItems[index]["scanUnitQty"] = scanQty * newQty;
      newItems[index]["adjustedQty"] = lessQty;
    } else {
      newItems[index]["scanUnitQty"] = newQty;
    }

    setPosDataList(newItems);

    if (Boolean(invoiceDiscountValue) && invoiceDiscountValue > 0) {
      getFooterTotal(scannedProducts(newItems))
        .then((response) => {
          setPosDataList((prevPosData) => {
            return prevPosData.map((item) => {
              if (item.isTaken) {
                const {
                  productDiscountValue,
                  saleValue,
                  productDiscountFactor,
                  productDiscountValType,
                } = item ?? {};

                let productAmt = parseFloat(saleValue);
                let discount = 0;
                let discountedSales = 0;
                let invDiscVal: any = 0;
                let productFactor: any = 0;
                let productDisc: any = 0;
                let invFactor: any = 0;

                if (Boolean(productDiscountFactor)) {
                  if (productDiscountValType == "Amount") {
                    discount = parseFloat(productDiscountFactor);
                  } else {
                    discount =
                      (saleValue * parseFloat(productDiscountFactor)) / 100;
                  }
                  // if (!productDiscountValType) {
                  //   const percFactor = (productDiscountValue / productAmt) * 100;

                  //   const amtFactor = productDiscountValue;
                  //   productFactor = percFactor <= 100 ? percFactor : amtFactor;
                  //   discount = productFactor <= 100
                  //     ? (productAmt * productFactor) / 100
                  //     : productFactor;
                  // }
                  // else {
                  //   //new calculation 30-01-2026
                  //   discount =
                  //     productDiscountValType === "Amount"
                  //       ? parseFloat(productDiscountFactor)
                  //       : (productAmt * parseFloat(productDiscountFactor)) / 100;
                  // }
                }

                productAmt = productAmt - discount;

                if (invoiceDiscountFactor && !isInvoiceReturn) {
                  if (invoiceDiscountValType == "Amount") {
                    let perVal: any = (invoiceDiscountFactor / response) * 100;

                    invDiscVal = productAmt * (perVal / 100);
                  } else {
                    invDiscVal = productAmt * (invoiceDiscountFactor / 100);
                  }
                  // if (!invoiceDiscountValType) {
                  //   //new calculation 26-09-2025
                  //   const percinvFactor = (invoiceDiscountValue / productAmt) * 100;
                  //   const amtinvFactor = invoiceDiscountValue;
                  //   invFactor = percinvFactor <= 100 ? percinvFactor : amtinvFactor;
                  //   invDiscVal = invFactor <= 100
                  //     ? (productAmt * invFactor) / 100
                  //     : invFactor;
                  // }
                  // else {
                  //   //new calculation 30-01-2026
                  //   invDiscVal =
                  //     invoiceDiscountValType === "Amount"
                  //       ? (productAmt * invoiceDiscountFactor) / response
                  //       : productAmt * (invoiceDiscountFactor / 100);
                  // }
                }


                discount = discount + invDiscVal;
                discountedSales = saleValue - discount;

                return {
                  ...item,
                  discount: discount,
                  invoiceDiscountValue: invDiscVal,
                  discountedSales: discountedSales,
                };
              } else return item;
            });
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  //handle apply discount
  const handleApplyDiscount = async (discData: any, record: any) => {
    const {
      qty,
      scanUnitQty,
      adjustedQty,
      salePrice,
      saleValue,
      splitQty,
      discount,
      productDiscountFactor,
      productDiscountValue,
      invoiceDiscountValue,
      invoiceDiscountValType,
      invoiceDiscountFactor = null,
      promoDiscValue,
      isInvoiceReturn
    } = record ?? {};

    const { totalAmount } = getInvoiceFinalAmount();

    const type = discData?.type;
    // console.log("type", type);

    let itemAmt: any | number =
      (splitQty
        ? qty * (Math.abs(scanUnitQty) / qty) - Math.abs(adjustedQty)
        : qty) * salePrice;

    let itemDiscAmt = 0;
    let disc: any = 0;
    let invDiscVal: any = 0;
    let promotionDiscValue = 0;

    if (Boolean(promoDiscValue)) {
      promotionDiscValue = parseFloat(promoDiscValue);
    }

    itemAmt -= promotionDiscValue || 0;
    // if (Boolean(productDiscountFactor) && disc == 0) {
    //   amt = amt + parseFloat(productDiscountValue);
    // } else {
    // }

    if (type == "Amount") {
      disc = discData?.discVal;
      // amt = amt - parseFloat(disc);
    } else {
      disc = Boolean(discData?.discPerVal)
        ? parseFloat(discData?.discPerVal)
        : 0;
      disc = (itemAmt * disc) / 100;
      // amt = amt - parseFloat(disc);
    }

    itemDiscAmt = itemAmt - parseFloat(disc);

    if (Boolean(invoiceDiscountFactor)) {
      if (invoiceDiscountValType == "Amount") {
        let perVal: any = (invoiceDiscountFactor / totalAmount) * 100;

        invDiscVal = itemDiscAmt * (perVal / 100);
      } else {
        invDiscVal = itemDiscAmt * (invoiceDiscountFactor / 100);
      }
    }

    disc = disc + invDiscVal;

    let amount = itemAmt - disc;

    const updatedDataList = posDataList.map((item) => {
      // if (item.key === record.key && item.posTypeId !== 3) {
      if (item.key === record.key && !item.isInvoiceReturn) {
        const updated = {
          ...item,
          discount: disc,
          initialAmount: amount,
          discountedSales: amount,
          // saleValue: itemAmt,
          productDiscountFactor: discData.factor,
          productDiscountName: discData.discName,
          productDiscountValue: discData.discVal,
          invoiceDiscountValue: invDiscVal,
          productDiscId: discData.discId,
          productDiscountValType: type,
        };
        setDiscountPopRate(updated);
        return updated;
      }

      return item;
    });

    setPosDataList(updatedDataList);

    getFooterTotal(scannedProducts(updatedDataList))
      .then((response) => {
        setPosDataList((prevPosData) => {
          return prevPosData.map((item) => {
            // if (item.isTaken) {
            const {
              productDiscountFactor,
              productDiscountValType,
              invoiceDiscountValType,
              saleValue,
              invoiceDiscountFactor,
              isInvoiceReturn
            } = item ?? {};
            if (isInvoiceReturn) return item;
            let productAmt = parseFloat(saleValue);
            let discount = 0;
            let discountedSales = 0;
            let invDiscVal: any = 0;

            if (Boolean(productDiscountFactor)) {
              if (productDiscountValType == "Amount") {
                discount = parseFloat(productDiscountFactor);
              } else {
                discount =
                  (saleValue * parseFloat(productDiscountFactor)) / 100;
              }
            }
            productAmt = productAmt - discount;
            if (invoiceDiscountValType == "Amount" && item.posTypeId !== 3) {
              let perVal: any = (invoiceDiscountFactor / response) * 100;
              invDiscVal = productAmt * (perVal / 100);
            } else if (item.posTypeId !== 3) {
              invDiscVal =
                productAmt * (parseFloat(invoiceDiscountFactor) / 100);
            }
            discount = discount + invDiscVal;
            discountedSales = saleValue - discount;
            return {
              ...item,
              invoiceDiscountValue: invDiscVal,
              discount: discount,
              initialAmount: discountedSales,
              discountedSales: discountedSales,
            };
            // } else return item;
          });
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleRemoveInvoiceDiscount = async () => {
    const disc = footerCalculation?.discount;
    const amt = footerCalculation?.totAmt;
    const discount = disc - invoiceAppliedDiscc;
    const newAmt = amt > 0 ? amt + invoiceAppliedDiscc : 0;

    setFooterCalculation({
      ...footerCalculation,
      discount: discount,
      totAmt: newAmt,
      totPrice: newAmt,
    });

    setPosDataList((prevPosData) =>
      prevPosData.map((item) => {
        const isInvoiceReturn: any = item?.isInvoiceReturn;
        if (isInvoiceReturn) return item;
        const salesVal: any = applyDecimal(item?.saleValue);
        const discValPerItem: any = parseFloat(item?.invoiceDiscountValue) || 0;
        const currentDiscount: any = parseFloat(item?.discount) || 0;

        // Recalculate discount and discounted sales
        const updatedDiscount: any = applyDecimal(
          currentDiscount - discValPerItem
        );
        const discountedSales = applyDecimal(salesVal - updatedDiscount);

        const updatedItem = {
          ...item,
          invoiceDiscountFactor: 0,
          invoiceDiscountName: "",
          invoiceDiscountValue: 0,
          discount: updatedDiscount,
          discountedSales,
        };

        // Set discountPopRate if item matches
        if (item.key === discountPopRate.key) {
          setDiscountPopRate(updatedItem);
        }

        return updatedItem;
      })
    );

    // Clear `invoiceAppliedDiscc` with a timeout
    setTimeout(() => {
      setInvoiceAppliedDiscc(null);
    }, 0);
  };

  const applyInvoiceLevelDiscount = (discData: any) => {
    const { discPerVal, factor, discName, type, discVal } = discData;
    getFooterTotal(scannedProducts(posDataList))
      .then((response) => {
        setPosDataList((prevPosData) => {
          return prevPosData.map((item) => {

            if (item.isTaken && !!!Boolean(item.blockDiscount)) {
              const {
                productDiscountFactor,
                productDiscountValType,
                saleValue,
              } = item ?? {};

              let productAmt = parseFloat(saleValue);
              let discount = 0;
              let discountedSales = 0;
              let invDiscVal: any = 0;

              if (Boolean(productDiscountFactor) && item.posTypeId !== 3) {
                if (productDiscountValType == "Amount") {
                  discount = parseFloat(productDiscountFactor);
                } else {
                  discount =
                    (saleValue * parseFloat(productDiscountFactor)) / 100;
                }
              }

              productAmt = productAmt - discount;

              if (type == "Amount" && item.posTypeId !== 3) {
                // calculate percentage from total value
                let perVal: any = (discVal / response) * 100;
                // let perVal: any = (discVal / footerCalculation.totAmt) * 100;
                invDiscVal = productAmt * (perVal / 100);
                // footerCalculation?.totItems;
                // invDiscVal = discVal;
              } else if (item.posTypeId !== 3) {
                invDiscVal = productAmt * (parseFloat(discPerVal) / 100);
              }

              discount = discount + invDiscVal;
              discountedSales = saleValue - discount;

              setTimeout(() => {
                setInvoiceAppliedDiscc(
                  invDiscVal * footerCalculation?.totItems
                );
              }, 0);

              return {
                ...item,
                invoiceDiscountFactor: factor,
                invoiceDiscountName: discName,
                invoiceDiscountValue: invDiscVal,
                discount: discount,
                // discount: applyRoundOffWithDecimal(discount),
                initialAmount: discountedSales,
                discountedSales: discountedSales,
                // productDiscountValType: type,
                invoiceDiscountValType: type,
              };
            } else return item;
          });
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getMopData = async () => {
    const branchId = getCompanyDetails("id");
    const endPoint = `${APIS.mopList}?branchId=${branchId}`;

    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          setMopDataList(onSuccess?.data);
          resolve();
        },
        (onError: any) => {
          console.log("onError", onError);
          reject();
          // setMopData(onError?.savedMOP);
        }
      );
    });
  };



  const getCountryCode = async () => {
    const endPoint = `${APIS.getCountryCode}`;

    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          setCountryCode(onSuccess?.data);
          resolve();
        },
        (onError: any) => {
          console.log("onError", onError);
          reject();
          // setMopData(onError?.savedMOP);
        }
      );
    });
  };

  const getInitialData = async () => {
    const branchId = getCompanyDetails("id");
    const endPoint = `${APIS.posInititalData}?branchId=${branchId}&device=${deviceName}`;

    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          console.log("onSuccess", onSuccess);
          setInitialData(onSuccess?.data);
          resolve();
        },
        (onError: any) => {
          console.log("onError", onError);
          reject();
          // setMopData(onError?.savedMOP);
        }
      );
    });
  };

  const setCustomerFromId = (list: any[], id: any) => {
    const selected = list?.filter((item: any) => item?.id == id);
    if (selected?.length) {
      setSelectedCustomer(selected[0]);
    }
  };

  const getAllCustomer = async (
    id?: number | string | null,
    search: String = "",
    lastId: number | string = 0
  ) => {
    return await new Promise<any>((resolve, reject) => {
      clientGetApi(
        `${APIS.customerList}?keysearch=${search}&minId=${lastId}&noOfData=10`,
        null,
        (onSuccess: any) => {
          setCustomerList(onSuccess?.data);
          if (Boolean(id)) {
            setCustomerFromId(onSuccess?.data, id);
          }
          resolve(onSuccess);
        },
        (onError: any) => {
          console.log("onError", onError);
          // setNotification("error", "Failed to fetch customer details");
          reject(onError);
        }
      );
    });
  };

  const getDiscountMasterData = async () => {
    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        APIS.invoiceLevelDiscount,
        null,
        (onSuccess: any) => {
          setdiscountMasterDataList(onSuccess?.data);

          resolve();
        },
        (onError: any) => {
          console.log("onError::discount", onError);
          // setdiscountMasterDataList(onError?.data);
          resolve();
        }
      );
    });
  };

  const initalCustomerLoyalty = async () => {
    const endPoint = `GetInitialDataLoyaltyMember`;
    clientGetApi(
      endPoint,
      null,
      (OnSuccess: any) => {
        setCustomerInitData(OnSuccess?.data);
      },
      (onError: any) => {
        console.log("onError", onError);
      }
    );
  };

  const _calculateDiscount = (data: any) => {
    return data.reduce((acc: number, d: any) => {
      if (!d.isInvoiceReturn && d.posTypeId == 2 && !!!Boolean(d.blockDiscount)) {

        const mrpDiscount =
          (d.mrp - d?.salePrice) *
          ((d.qty * Math.abs(d.scanUnitQty || 1)) / d.qty);

        return (
          acc +
          mrpDiscount +
          (d.productDiscountValue || 0) +
          (d.invoiceDiscountValue || 0) +
          (d.loyaltyDiscount || 0)
        );
      }
      return acc;
    }, 0);
  }

  const _calucaluteNetAmount = (data: any) => {
    return data.reduce((acc: number, d: any) => {
      const taken = d.isTaken ? Number(d.discountedSales || 0) : 0;
      const returned = !d.isTaken ? Number(d.discountedSales || 0) : 0;

      return acc + (taken - returned);
    }, 0);
  }

  const getInvoiceById = (id = null, type: any = null) => {
    // console.log("posHistoryFlag", posHistoryFlag);
    // console.log("selectedInfo", selectedInfo);
    let typeId = POSFOR.find((item) => item.label == historyType)?.key;
    if (type && type.toLowerCase() === "POS Order Hold".toLowerCase()) {
      typeId = "6";
    }
    if (ticket.dc) {
      typeId = "8";
    }
    if (ticket.isAgainstDC) {
      typeId = "10";
    }
    const endPoint = `GetPOSInvoice?entryid=${id}&typeId=${typeId}`;
    clientGetApi(
      endPoint,
      null,
      (onSuccess: any) => {
        if (typeId == "10") {
          const { invoice, against } = onSuccess?.data;
          setPosHistoryDetail(invoice);
          setTicketHistoryData(against);
          setPosHistoryFlag(false);
        }
        else {
          setPosHistoryDetail(onSuccess?.data);
          setPosHistoryFlag(false);
        }
      },
      (onError: any) => {
        console.log("onError", onError);
      }
    );
  };

  // React.useEffect(() => {
  //   const openingDate = tellerSummaryCalculation.openingDate.toString();
  //   const currentDate = formatDate(new Date().toString());

  //   if (
  //     new Date(openingDate) < new Date(currentDate) &&
  //     posStatus !== "tellerSummary" &&
  //     !tellerIsExist
  //   ) {
  //     setIsConfirmTeller(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tellerSummaryCalculation]);

  React.useEffect(() => {
    if (posHistoryFlag === true && segment === "History") {
      const { historyList } = posHistoryData;
      const historyId = historyList?.[selectedRowKey]?.entry_id;
      const type = historyList?.[selectedRowKey]?.type;
      getInvoiceById(historyId, type);
    } else {
      setPosHistoryDetail(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowKey, isCustomerEdit]);


  const fetchAllHistory = (typeId = entryType.invoiceType, lastRowId = 0) => {
    // const endPoint = `GetAllTransactionHistory?typeid=${typeId}`;
    const endPoint = `${APIS.posHistory}?fromDate=${historyDate[0]}&toDate=${historyDate[1]}&typeId=${typeId}&terminal=${deviceName}&page=${lastRowId}&pageSize=20&search=${searchHistory}`;
    clientGetApi(
      endPoint,
      null,
      (onSuccess: any) => {
        const { historyList } = onSuccess.data;
        const response = {
          ...onSuccess?.data,
          historyList: historyList.map((history: any, index: number) => {
            return {
              ...history,
              entry_key: index,
            };
          }),
        };


        const histories = [
          ...(Boolean(posHistoryData.historyList?.length) ? posHistoryData.historyList : []),
          ...response.historyList
        ].map((data, index) => {
          return {
            ...data,
            entry_key: index,
          };
        });

        //const historyData = (Boolean(searchHistory) || lastRowId == 0)
        const historyData = ((Boolean(searchHistory) && lastRowId == 0) || (!Boolean(searchHistory) && lastRowId == 0)) //23-08-2025
          ? response
          : { ...response, historyList: histories };

        setPosHistoryData(historyData);
      },
      (onError: any) => {
        console.log("onError", onError);
      }
    );
  };

  const getTellerSummaryHistory = async (lastRowId = 0) => {

    const endPoint = `${APIS.getTellerSummaryHistory}`;

    const payload = {
      terminalName: deviceName,
      fromDate: tellerDate[0],
      toDate: tellerDate[1],
      page: lastRowId,
      pageSize: 10
    }

    await new Promise<any>((resolve, reject) => {
      try {
        clientPostApi(
          endPoint,
          payload,
          async (onSuccess: any) => {
            const data = lastRowId > 0 ? [...tellerHistories, ...onSuccess?.data?.items] : onSuccess?.data?.items;
            setTellerHistories(data);
            setTellerSummaryHistory({
              openingAmount: onSuccess?.data?.openingAmount || 0,
              total: onSuccess?.data?.count || 0,
              credit: onSuccess?.data?.creditAmount || 0,
              debit: onSuccess?.data?.debitAmount || 0,
              closingAmount: onSuccess?.data?.closingAmount || 0,
              denominationAmount: onSuccess?.data?.denomAmount || 0,
              shortage: onSuccess?.data?.shortageAmount || 0,
              excess: onSuccess?.data?.excessAmount || 0
            })
            resolve(onSuccess);
          },
          (onError: any) => {
            reject(onError);
          }
        );
      } catch (error) {
        reject(error);
      }
    });

  }

  const getInvoiceReturnList = async () => {
    const endPoint = `${APIS.tagReturnList}`;
    const payload = {
      entryid: posEditData?.entryId ?? "",
      customerid: selectedCustomer?.id ?? "",
      terminal: deviceName,
      trstype: entryType.invoiceType
    }

    clientPostApi(
      endPoint,
      payload,
      (onSuccess: any) => {
        const { data } = onSuccess;
        setPosReturnData(data);
        // if (isEdit)
        //   setTagReturnData(
        //     data?.filter((d: any) => d.adj_invoice_id === posEditData?.entryId)
        //   );
      },
      (onError: any) => {
        console.log("onError", onError);
      }
    );
  };


  // useEffect(() => {
  //   if (posStatus == POSSTATUS.invoice) getInvoiceReturnList();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [posEditData, deviceName, selectedCustomer, isFetching, posStatus]);

  React.useEffect(() => {
    if (segment === "History") {
      const typeId =
        historyType === POSSTATUS.invoice
          ? entryType.invoiceType
          : historyType === POSSTATUS.return
            ? entryType.returnType
            : historyType === POSSTATUS.hold
              ? entryType.holdType
              : historyType === POSSTATUS.pos
                ? entryType.orderType
                : entryType.invoiceType;
      fetchAllHistory(typeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    historyType,
    historyDate,
    segment,
    isCustomerEdit,
    deviceName,
    isFetching,
    searchHistory,
  ]);

  React.useEffect(() => {
    getTellerSummaryHistory();
  }, [deviceName, tellerDate])


  const tellerListHandler = (data?: any) => {
    let credit: any = 0;
    let debit: any = 0;

    const finalList = data.map((list: any) => {
      credit += Number(list.credit);
      debit += Number(list.debit);
      return {
        ...list,
        balance: Number(credit) - Number(debit),
      };
    });

    setTellerSummaryList(finalList);
  };

  React.useEffect(() => {
    // tellerListHandler(tellerSummaryList);

    const openingAmount: any = tellerSummaryList.filter(
      (list) =>
        list.description.toLowerCase().trim() === "opening amount".trim()
    )[0]?.balance;

    const loginDate: any = tellerSummaryList.filter(
      (list) =>
        list.description.toLowerCase().trim() === "opening amount".trim()
    )[0]?.loginDate;

    const status: any = tellerSummaryList.filter(
      (list) =>
        list.description.toLowerCase().trim() === "opening amount".trim()
    )[0]?.activeStatus;

    let credit: any = 0;
    let debit: any = 0;

    tellerSummaryList.forEach((list) => {
      credit += Number(list.credit);
      debit += Number(list.debit);
    });

    setTellerSummaryCalculation((prev) => ({
      ...prev,
      openingDate: loginDate || new Date(),
      openingAmount: openingAmount || 0,
      credit: credit,
      debit: debit,
      balance: Number(credit) - Number(debit),
      activeStatus: status,
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tellerSummaryList]);

  const getIsTaken = (id: number | string) => {
    if (id == 1 || id == 2 || id == 4 || id == 6) {
      return true;
    } else {
      return false;
    }
  };

  const posDetailsForUpdate = (posDetails: any) => {
    return new Promise<any>((resolve, reject) => {
      try {
        const newUpdateData = posDetails?.map((item: any, index: number) => {
          const selectedSalesMan = salesmanList?.filter(
            (data) => data?.id == item?.salesmanId
          );
          const {
            salesman_name = "salesman",
            image = "",
            id = 0,
          } = selectedSalesMan?.[0] ?? {};

          const makeOrderData = item?.makeOrderJson?.serviceId
            ? item?.makeOrderJson
            : null;

          const mrpValue =
            item.mrp *
            ((item.qty * Math.abs(item.scanUnitQty || 1)) / item.qty);
          const mrpDiscount =
            (item.mrp - item?.salePrice) *
            ((item.qty * Math.abs(item.scanUnitQty || 1)) / item.qty);

          const mrpPercentage = (mrpDiscount / mrpValue) * 100;

          return {
            ...item,
            // image: "image",
            salesman: salesman_name,
            salesmanImage: image,
            barcodeImage: "",
            salesmanId: id,
            mrpValue: mrpValue ?? 0,
            mrpDiscount: mrpDiscount ?? 0,
            mrpPercentage: mrpPercentage ?? 0,
            salePrice: applyDecimal(item?.salePrice), // {18/06/25} commented
            // // salePrice: rate,
            // saleValue: applyRoundOffWithDecimal(item?.saleValue),
            saleValue: applyDecimal(item?.saleValue),
            discount: applyDecimal(item?.discount ?? 0),
            discountedSales: applyDecimal(item?.discountedSales),
            isTaken: getIsTaken(item?.posTypeId),
            key: index,
            promoDiscValue: item.promoDiscountValue,
            entryId:
              isCopy || item?.posTypeId == 4 || item?.posTypeId == 6
                ? 0
                : item?.entryId,
            posTypeId:
              item?.posTypeId == 4 || item?.posTypeId == 1
                ? 2
                : item?.posTypeId == 6
                  ? 1
                  : item?.posTypeId,
            ...makeOrderData,
          };
        });

        resolve(newUpdateData);
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    const bindEditData = async () => {
      if (posEditData) {
        setSegment("Create");
        const {
          POSDetails,
          MOPDetails,
          customerPoint,
          redemption,
          mobileno,
          customerId,
          remarks,
        } = posEditData ?? {};

        const mopDetails = Boolean(MOPDetails?.length)
          ? MOPDetails?.map((detail: any) => {
            if (detail.mopName.toLowerCase() === "Cash".toLowerCase()) {
              detail.cashAmt = detail.amount;
            }
            return detail;
          })
          : [];

        setNotesVal(remarks);
        posDetailsForUpdate(POSDetails).then((newPosdetailList) => {
          setPosDataList(newPosdetailList ?? []);
          const lastIndex = newPosdetailList?.length - 1;
          // setSelectedRowKeys([lastIndex]);
        });
        if (!isCopy) {
          setPosStatus(posStatus);
          if (Boolean(customerId)) {
            // setSelectedCustomer({
            //   ...customerPoint,
            //   cardType: customerPoint?.cardTypeCode,
            // });
            const resp = await getAllCustomer(null, mobileno, 0);
            if (resp.statusCode == 200) {
              const { data } = resp;
              setCustomerFromId(data, customerId);
              setCustomerEarnPoint(customerPoint?.earnPoints || 0);
              setPointsValue(customerPoint?.promoPoints || 0);
              const selected = data?.filter(
                (item: any) => item?.id == customerId
              );

              if (connector.ownChat) {
                try {
                  const response = await GetLoyaltyPoints(APIS.getLoyaltyPoints, selected[0], initialData);
                  if (response.status == 200) {
                    const data = response?.data?.data?.data;
                    setConnector((prev) => ({
                      ...prev,
                      points: data
                    }))
                  }
                } catch (err) {

                }
              }

              if (selected?.length && !connector.ownChat) {
                let amount: any =
                  (selected[0]?.equivalentRs / selected[0]?.everyPoints) *
                  Number(customerPoint?.redeemPoints);

                let point: any =
                  (selected[0]?.everyPoints / selected[0]?.equivalentRs) *
                  Number(amount);

                setRedeemPoint((prev: any) => ({
                  ...prev,
                  point: Boolean(point) ? point : "",
                  pointAmount: Boolean(amount) ? amount : "",
                  redeemPoint: Boolean(point) ? point : "",
                }));
              }
              else {
                setRedeemPoint((prev: any) => ({
                  ...prev,
                  point: Boolean(redemption) ? redemption : "",
                  pointAmount: Boolean(redemption) ? redemption : "",
                  redeemPoint: Boolean(redemption) ? redemption : "",
                }));
              }
            }

            // setCustomerFromId(customerList, editData?.customerId);
          }
          setMopValues(mopDetails ?? []);
          if (historyType == POSSTATUS.pos) {
            const {
              dueDate,
              trialDate,
              pickupDateTime,
              locationId,
              isDelivery,
            } = posEditData ?? {};

            formik.setFieldValue("selectedType", isDelivery ? 1 : 2);
            formik.setFieldValue("dueDate", dueDate ? dayjs(dueDate) : null);
            formik.setFieldValue("trialDate", trialDate ? dayjs(trialDate) : null);
            formik.setFieldValue("pickupDateTime", pickupDateTime ? dayjs(pickupDateTime) : null);
            formik.setFieldValue("location", locationId ? String(locationId) : null);
            // setSelectedType(isDelivery ? 1 : 2);
            // setDueDate(dueDate ? dayjs(dueDate) : null);
            // setTrialDate(trialDate ? dayjs(trialDate) : null);
            // setPickupDateTime(pickupDateTime ? dayjs(pickupDateTime) : null);
            // setLocation(locationId ? String(locationId) : null);
            // setIsOrder(true);
          }
        }
      }
    };
    bindEditData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posEditData]);

  //CUSTOMER SAVE ************
  const getNewCustomerPayload = (formValues: any) => {
    const branchId = getCompanyDetails("id");
    return new Promise<any>((resolve, reject) => {
      const { cardType, mobile, name } = formValues;

      if (!Boolean(cardType) || !Boolean(mobile) || !Boolean(name)) {
        reject("Enter all the fields");
      }
      try {
        const payload = {
          gender: "",
          religion: "",
          married: "",
          member_no: "",
          card_no: "",
          sub_ledger_id: 0,
          card_type: cardType, //
          ref_member_no: "",
          price_list: "",
          country_id: 0,
          benefit_code: "",
          state_id: 0,
          city_id: 0,
          area_id: 0,
          street: "",
          first_name: name, //
          middle_name: "",
          last_name: "",
          mobile_no: mobile, //
          email_id: "",
          dob: "1900-01-01",
          profession: "",
          dom: "1900-01-01",
          gst_no: "",
          pan_no: "",
          whatsapp_no: "",
          building_no: "",
          pincode: "",
          is_active: true,
          familyMembers: [],
          image_data: [
            {
              fileName: "",
              fileData: "",
              fileType: "",
            },
          ],
          company_prefix: "",
          branch_id: branchId,
          company_id: branchId,
        };
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  };

  const applyCoupon = (payload: any) => {
    return new Promise<any>((resolve, reject) => {
      try {
        clientPostApi(
          APIS.getGiftVoucher,
          payload,
          async (onSuccess: any) => {
            resolve(onSuccess);
          },
          (onError: any) => {
            reject(onError);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  const saveNewCustomer = (formData: any) => {
    const endPoint = `PostLoyaltyMemberSave`;
    getNewCustomerPayload(formData)
      .then((payload) => {
        clientPostApi(
          endPoint,
          payload,
          async (onSuccess: any) => {
            await getAllCustomer(onSuccess?.data, formData.mobile);
            // setAddCustomer(false);

            // setTimeout(() => {
            //   setCusAfterSuccess(onSuccess?.data);
            // }, 100);
          },
          (onError: any) => {
            console.log("onError", onError);
            // setNotification("error", "Something went wrong");
          }
        );
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getPosTypeId = (isLastPrint: any = false) => {
    if (isLastPrint) {
      return (posStatus === POSSTATUS.invoice)
        ? 2
        : (posStatus === POSSTATUS.return)
          ? 3
          : (posStatus === POSSTATUS.pos)
            ? 1
            : 2;
    } else {
      return ((posStatus === POSSTATUS.invoice ||
        posStatus === POSSTATUS.return) &&
        Boolean(
          posDataList.filter((data) => data.posTypeId === 2).length
        )) ||
        Boolean(tagReturnData.length)
        ? 2
        : (posStatus === POSSTATUS.return ||
          posStatus === POSSTATUS.invoice) &&
          Boolean(posDataList.filter((data) => data.posTypeId === 3).length)
          ? 3
          : 1;
    }
  };

  // CALL PINELSBS

  const _callPinelabsApi = async (data: any, type: any) => {

    if (type.toLowerCase() === "card") {
      setIsPayment((prev: any) => ({ ...prev, cardProgress: true }));
      try {
        const cardRes = await _callPineLab("1", data?.amount, data?.amount * 100);
        setIsPayment((prev: any) => ({ ...prev, cardProgress: false, cardPaid: true, cardFailed: "" }));
        return cardRes;
      } catch (err: any) {
        const data = err?.data?.data;
        setIsPayment((prev: any) => ({ ...prev, cardProgress: false, cardFailed: "Payment Failed" }));
        throw new Error(data?.ResponseMessage ?? "Card payment failed");
      }
    }
    else if (type.toLowerCase() === "credit") {
      setIsPayment((prev: any) => ({ ...prev, creditProgress: true }));

      try {
        const creditRes = await _callPineLab("1", data?.amount, data?.amount);
        setIsPayment((prev: any) => ({ ...prev, creditProgress: false, creditPaid: true, creditFailed: "" }));
        return creditRes;

      } catch (err: any) {
        const data = err?.data?.data;
        setIsPayment((prev: any) => ({ ...prev, creditProgress: false, creditFailed: "Payment Failed" }));
        throw new Error(data?.ResponseMessage ?? "Credit payment failed");
      }
    }
    else if (type.toLowerCase() === "upi") {
      setIsPayment((prev: any) => ({ ...prev, upiProgress: true }));
      try {
        const upiRes = await _callPineLab("10", data?.amount, data?.amount * 100);
        setIsPayment((prev: any) => ({ ...prev, upiProgress: false, upiPaid: true, upiFailed: "" }));
        return upiRes;
      } catch (err: any) {
        const data = err?.data?.data;
        setIsPayment((prev: any) => ({ ...prev, upiProgress: false, upiFailed: "Payment Failed" }));
        throw new Error(data?.ResponseMessage ?? "UPI payment failed");
      }
    }

    return null;
  }
  //POS SAVE ********************
  const getPosSavePayload = async (isHold = false) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const userDetail = getUserDetails();

        // console.log("userDetail", userDetail);
        let cashSales = 0,
          cardSales = 0,
          cardDetails = "",
          creditSales = 0,
          creditDetail = "",
          tenderValue = 0,
          refund: any = 0,
          productDiscount = 0,
          invoiceDiscount = 0,
          promoDiscount = 0,
          isCredit = false;


        const isAdjWallet = (Boolean(walletDetails.filter((cd: any) => cd.selected).length) && posDataList.length > 0 || isEdit && posDataList.length > 0);

        let pinelabs: any[] = [];

        const results: any[] = [];


        const cashValues = [
          {
            amount: Number(
              applyPosFinalAmount(footerCalculation.totAmt, true)
            ).toString(),
            cardTypeCode: "",
            commissionCharges: 0,
            entryId: 1,
            expiryDate: "",
            ledgerId: null,
            mopId:
              mopDataList.filter((d) => d.mop.toLowerCase() === "cash")[0]
                ?.id ?? 1,
            mopName: "Cash",
            refNumber: "",
          },
        ];

        const mopBalance = () => {
          let sum: any = 0;
          mopValues.forEach((mop: any) => (sum += Number(mop.amount)));
          return Number(sum || 0);
        };

        const getRemainingAmt = () => {
          const received: any = mopBalance();
          let retrn = 0;
          if (
            footerCalculation.totAmt === 0 &&
            footerCalculation.totalReturn > 0
          ) {
            retrn =
              (Number(footerCalculation.totalReturn) +
                Number(footerCalculation.discount) +
                Number(footerCalculation.promoDiscount)
              ) -
              Number(footerCalculation.grossSales);
          }
          const remaining =
            Number(Math.abs(footerCalculation.totAmt) + Math.abs(retrn)) >=
              Number(received)
              ? Number(retrn)
              : Number(footerCalculation.totAmt) - parseFloat(received);

          return Math.abs(Number(applyPosFinalAmount(remaining || 0, true))) || 0;
        };


        for (const item of mopValues) {
          switch ((item?.mopName || "").trim()) {
            case "Cash":
              cashSales = item?.amount ?? 0;
              tenderValue += parseFloat(item?.amount);
              break;
            case "Card":
              cardSales = item?.amount ?? 0;
              cardDetails = "";

              if (connector.pineLabs && !isPayment.cardPaid && !isEdit) {
                const cardRes = await _callPinelabsApi(item, "Card");
                results.push(cardRes);
              }
              break;
            case "Credit":
              creditSales = item?.amount ?? 0;
              creditDetail = isAdjWallet ? walletDetails.filter((d: any) => d.selected).map((c: any) => { return c.entryNo + "@" + dayjs(c.entryDate).format("YYYY-MM-DD") }).join("^") : "";
              isCredit = isAdjWallet ? false : true;
              if (connector.pineLabs && !isPayment.creditPaid && !isEdit) {
                const creditRes = await _callPinelabsApi(item, "Credit");
                results.push(creditRes);
              }
              break;
            case "UPI":
              if (connector.pineLabs && !isPayment.upiPaid && !isEdit) {
                const upiRes = await _callPinelabsApi(item, "UPI");
                results.push(upiRes);
              }

              break;

            default:
              break;
          }
        }
        pinelabs = results;

        // tenderValue = mopBalance();

        const discSales: any =
          Number(applyPosFinalAmount(footerCalculation.grossSales, true)) -
          Number(footerCalculation.discount);
        // if (tenderValue > discSales) {
        refund = getRemainingAmt();
        // }

        const {
          entryId = 0,
          entryDate,
          entryNo = 0,
          posOrderId = null,
        } = posEditData ?? {};

        const isFromRetrive =
          typeof entryNo == "string" ? entryNo?.includes("HM") : false;

        posDataList?.filter((d) => d.isTaken).map(
          (d) => (
            (productDiscount += Number(d.productDiscountValue)),
            (invoiceDiscount += Number(d.invoiceDiscountValue)),
            (promoDiscount += Number(d.promoDiscValue))
          )
        );

        const getEntryId = () => {
          if (isCopy) {
            return 0;
          } else if (isFromRetrive) {
            return isHold ? entryId : 0;
          } else if (isEdit) { // New line added 2811
            return entryId;
          } else {
            if (historyType == POSSTATUS.pos) {
              if (posStatus == POSSTATUS.pos) {
                return entryId;
              } else {
                return 0;
              }
            }

            return entryId;
          }
        };

        const getEntryNumber = () => {
          if (isHold) {
            return null;
          } else {
            // if (isEdit && statusFrom == POSSTATUS.pos) {
            // if (isEdit && posStatus == POSSTATUS.pos) {
            if (isFromRetrive) {
              return entryNo;
            } else {
              return null;
            }
            // }
            // return entryNo;
          }
        };

        const getPosList = () => {
          if (!Boolean(posDataList.length)) {
            return [
              {
                key: 0,
                image: "",
                salesman: "salesman",
                entryId: 0,
                salesmanId: 0,
                salesmanImage: "",
                barcodeImage: "",
                barcode: "",
                productName: "",
                qty: 0,
                salePrice: 0,
                // salePrice: rate,
                saleValue: 0,
                discount: 0,
                initialAmount: 0,
                discountedSales: 0,
                productDiscountName: "",
                productDiscountValue: 0,
                productDiscountFactor: 0,
                invoiceDiscountName: "",
                invoiceDiscountValue: 0,
                invoiceDiscountFactor: 0,
                icode: "",
                oemCode: "",
                uomId: null,
                uomName: "",
                groupCode: null,
                taxCode: null,
                promoId: null,
                promoDiscValue: null,
                promoDiscFactor: 0, //
                taxValue: null,
                scanUnitQty: 0,
                ticketEntryId: 0,
                loyaltyDiscount: 0,
                hsnCode: null,
                customerDiscount: 0, //
                taxBeforeDiscount: 0,
                adjustedQty: 0,
                isWsp: false,
                ticketDetailId: 0, //
                productPoints: 0,
                blockDiscount: 0,
                posTypeId: 2,
                productDiscId: null,
                productDiscountValType: null,
                invoiceDiscountValType: null,
                discountPercentage: null,
                stockpointId: null,
              },
            ];
          }
          if (isHold) {
            return posDataList?.map((item) => {
              if (item.posTypeId === 3) {
                item.posTypeId = 3;
                item.entryId = 0;
              } else item.posTypeId = !isOrder ? 4 : 6;
              return item;
            });
          } else {
            if (!isEdit && historyType == POSSTATUS.pos) {
              if (posStatus === POSSTATUS.invoice) {
                return posDataList?.map((item) => {
                  if (item.posTypeId === 3 && item.entryId != 0)
                    return { ...item, posTypeId: 5 };
                  if (item.posTypeId === 3)
                    return { ...item, entryId: 0, entryNo: null };
                  return {
                    ...item,
                    posTypeId: 2,
                    entryId: 0,
                    entryNo: null,
                  };
                });
              }
            }

            return [...posDataList];
          }
        };

        const getPosTypeForSave = () => {
          return ((posStatus === POSSTATUS.invoice ||
            posStatus === POSSTATUS.return) &&
            Boolean(
              posDataList.filter((data) => data.posTypeId === 2).length
            )) ||
            isHold ||
            Boolean(tagReturnData.length)
            ? 2
            : (posStatus === POSSTATUS.return ||
              posStatus === POSSTATUS.invoice) &&
              Boolean(posDataList.filter((data) => data.posTypeId === 3).length)
              ? 3
              : 1;
        };

        //Coupon Data:::
        const couponAmount = coupons.reduce(
          (acc: any, d: any) => acc + d.voucherAmount,
          0
        );
        const couponNos = coupons
          .map(
            ({ voucherNo, voucherAmount }) =>
              `${voucherNo}*${applyDecimal(Number(voucherAmount))}^`
          )
          .join("");

        const mopLists = mopValues.filter((mop) => (mop?.mopName || "").trim() !== "Credit");

        const payload = {
          entryId: getEntryId(),
          // entryId: isCopy ? 0 : isFromRetrive ? 0 : entryId,
          entryNo: getEntryNumber(),
          // entryNo: isHold ? "" : entryNo,
          posTypeId: getPosTypeForSave(),
          posOrderId: posOrderId,
          returnTagIds: tagReturnData.map((data: any) => data?.entry_id) || [],
          refEntryNo: "",
          refEntryDate: "",
          adjInvoiceId: "",
          adjTicketId: "",
          customerCardType: selectedCustomer?.cardType ?? "",
          stockpointId: userDetail?.defaultStockpointId,
          grossSales: applyPosFinalAmount(footerCalculation?.grossSales, true),
          qty: footerCalculation.totQty || 0,
          productDiscount: productDiscount || 0,
          invoiceDiscount: invoiceDiscount || 0,
          discountedSales: discSales,
          roundOff: getRoundOffAmount(footerCalculation.totAmt, false, true),
          salesReturn: applyPosFinalAmount(footerCalculation?.totalReturn, true),
          netSales: applyPosFinalAmount(footerCalculation.totAmt, true),
          cashSales:
            (getPosTypeForSave() === 2 && !Boolean(mopLists?.length) && Number(tenderValue) <= 0) && !isCredit
              ? applyPosFinalAmount(footerCalculation.totAmt, true)
              : Number(cashSales) - Number(refund),
          cardSales: cardSales,
          cardDetails: cardDetails,
          creditSales: !isCredit ? creditSales : (Number(applyPosFinalAmount(footerCalculation.totAmt, true)) - Number(creditSales)),
          creditDetails: Boolean(posEditData) ? posEditData.creditDetails : creditDetail,
          isCredit: isCredit,
          tenderValue: tenderValue, // Total AMT given by the customer
          refund: refund,
          printCount: getPosTypeForSave() === 2 ? pos_cash_memo_copies : getPosTypeForSave() === 3 ? pos_return_memo_copies : 1,
          remarks: notesVal && notesVal !== null ? notesVal : "",
          customerId: selectedCustomer?.id ?? 0,
          redemption: Boolean(redeemPoint?.redeemPoint)
            ? redeemPoint?.pointAmount
            : 0,
          terminalName: printStore.printService,
          promoDiscount: promoDiscount || 0,
          taxValue: footerCalculation?.totalGst,
          scanUnitQty: footerCalculation.scanQty || footerCalculation.totQty, //
          discountAuthorised: "",
          posted: true,
          couponValue: couponAmount,
          couponNo: couponNos,
          loyaltyDiscount: customerBenefitData?.net_val_disc
            ? applyDecimal(customerBenefitData?.net_val_disc)
            : 0, //
          loyaltyBenefitCode: selectedCustomer?.benefitCode ?? "", //
          customerDiscount: 0, //
          returnDiscountedValue: 0, //
          // returnValue: getPosTypeId() == 3 ? footerCalculation.totAmt : null, //
          returnValue: applyPosFinalAmount(footerCalculation.totalReturn, true), //
          quantityAdjustment: footerCalculation.adjustedQty, //
          wspUser: "false",
          branchId: userDetail?.id,
          dueDate:
            getPosTypeId() == 1 && formik.values.dueDate
              ? dayjs(formik.values.dueDate).format("YYYY-MM-DD")
              : null, // pos order
          trialDate:
            getPosTypeId() == 1 && formik.values.trialDate
              ? dayjs(formik.values.trialDate).format("YYYY-MM-DD")
              : null, // pos order
          pickupDateTime:
            getPosTypeId() == 1 && formik.values.pickupDateTime
              ? dayjs(formik.values.pickupDateTime).format("YYYY-MM-DD hh:mm A")
              : null, // pos order
          locationId: getPosTypeId() == 1 && formik.values.location ? formik.values.location : null,
          isDelivery: formik.values.selectedType == 1 ? true : false,
          POSDetails: getPosList(),
          MOPDetails:
            (getPosTypeForSave() === 2 && !Boolean(mopLists?.length) && Number(tenderValue) <= 0) && !isCredit && !isAdjWallet && !ticket.dc //22-02-2026
              ? cashValues
              : Boolean(mopLists?.length)
                ? [...mopLists]
                : null,
          AdjDetails: isAdjWallet ? walletDetails.filter((cd: any) => cd.selected) : null,
          customerPoint: (!connector.ownChat && Boolean(selectedCustomer?.cardNo))
            ? {
              entryId: 0,
              cardNo: selectedCustomer?.cardNo ?? null,
              transactionType: "Invoice Type", //
              transactionId: 1, //
              netValue: 0,
              earnPoints: customerEarnPoint,
              redeemPoints: redeemPoint?.redeemPoint ?? 0,
              promoPoints: pointsValue ?? 0,
              bonusPoints: 0,
              itemPoints: 0,
              cardTypeCode: selectedCustomer?.cardType ?? null,
              benefitCode: selectedCustomer?.benefitCode,
              customerBranch: selectedCustomer?.branchId ?? 0,
            }
            : null,
          makeOrderSave: isOrder,
          pinelabs: pinelabs,
          isAgainstDS: ticket.isAgainstDC,
          trsType: ticket.dc ? 2 : ticket.isAgainstDC ? 3 : 1
        };
        // console.log("payload", payload);
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  };

  /** HOLD INVOICE */
  const handleHold = async () => {
    return new Promise<any>((resolve, reject) => {
      let endpoint = ticket.dc ? APIS.posTicketSave : APIS.posSave;
      getPosSavePayload(true).then((payloadData) => {
        const updatedPayload = { ...payloadData, posTypeId: 4 };
        clientPostApi(
          endpoint,
          updatedPayload,
          (onSuccess: any) => {
            console.log("handleHold::onSuccess", onSuccess);
            onClear();
            // setIsPaid(true);
            setPaymentSuccess(onSuccess?.data);
            setOnSuccessModal(true);
            // setLastBillInfo(onSuccess?.data);
            resolve(onSuccess);
          },
          (onError: any) => {
            console.log("onError", onError);
            reject(onError);
          }
        );
      });
    });
  };

  // Get Bill Payload
  const getBillPayload = (id?: any) => {
    return new Promise<any>((resolve, reject) => {
      try {
        let entryId;
        let type;
        if (id) {
          entryId = id;
          type =
            historyType === POSSTATUS.invoice
              ? "CM"
              : historyType === POSSTATUS.return
                ? "RM"
                : historyType === POSSTATUS.pos
                  ? "POSORDER"
                  : "CM";
        } else {
          entryId = Math.max(
            ...recentInvoiceList.map((invoice: any) => invoice.entryId)
          );
          type =

            posStatus === POSSTATUS.invoice
              ? "CM"
              : posStatus === POSSTATUS.return
                ? "RM"
                : posStatus === POSSTATUS.pos
                  ? "POSORDER"
                  : "CM";
        }
        const data = {
          entry_id: entryId,
          type: type,
        };

        resolve(data);
      } catch (error) {
        reject(0);
      }
    });
  };


  /***********************PINE LABS INTERATIONS */

  //PINE LABS Integrations: 
  const _callPineLab = async (mop: any, actAmount: any, amount: any) => {
    return new Promise<any>(async (resolve, reject) => {
      const companyId = getBranchIdByHeader("companyId");
      const branchId = getCompanyDetails("id");
      const userId = getBranchIdByHeader("userId");

      const { pinelabsConfig: { entryId, merchantId, merchantStorePosCode, securityToken, imei, mechineSerialNo, uploadUrl, checkStatusUrl, cancelUrl } } = initialData;

      const prefix = "POS";
      const timestamp = Date.now();
      const random = Math.floor(1000 + Math.random() * 9000);

      try {
        const pinelabsPayload = {
          transactionNumber: `${prefix}-${timestamp}-${random}`,
          sequenceNumber: mechineSerialNo,
          allowedPaymentMode: mop,
          merchantStorePosCode: merchantStorePosCode,
          amount: amount,
          userId: "",
          merchantId: merchantId,
          securityToken: securityToken,
          IMEI: imei,
          autoCancelDurationInMinutes: 5,
          apiUrl: uploadUrl
        };

        const txn: any = await makeApiCall.post(APIS.pinelabsUpload, pinelabsPayload);
        const data = txn?.data?.data;
        const txnId = data.PlutusTransactionReferenceID;

        if (!txnId || txnId == 0) {
          reject({ status: "Failed", message: "No transaction ID from PineLabs" });
          return;
        }

        const POLL_INTERVAL = 3000; // 3 seconds
        const TIMEOUT = 5 * 60 * 1000; // 5 minutes
        const startTime = Date.now();
        const interval = setInterval(async () => {
          try {
            const statusPayload = {
              merchantId: merchantId,
              securityToken: securityToken,
              IMEI: imei,
              merchantStorePosCode: merchantStorePosCode,
              plutusTransactionReferenceID: txnId,
              apiUrl: checkStatusUrl
            };

            const cancelPayload = {
              merchantId: merchantId,
              securityToken: securityToken,
              IMEI: imei,
              merchantStorePosCode: merchantStorePosCode,
              plutusTransactionReferenceID: txnId,
              apiUrl: cancelUrl
            };

            const response: any = await makeApiCall.post(
              `${APIS.pinelabsStatus}`,
              statusPayload
            );
            const res = response?.data;
            const txn = response?.data?.data;

            if (res.code === 200 && txn.ResponseMessage.toLowerCase() === "txn approved") {
              clearInterval(interval);
              const data = {
                ...pinelabsPayload,
                plutusRefId: txn.PlutusTransactionReferenceID,
                responseMessage: txn.ResponseMessage,
                amount: applyDecimal(actAmount),
                mechineId: entryId,
                userId: userId,
              }
              resolve(data)
            } else if (
              txn.ResponseMessage.toLowerCase() === "cancelled" ||
              txn.ResponseMessage.toLowerCase() === "expired"
            ) {
              clearInterval(interval);
              reject({ status: txn.ResponseMessage, ...response });
            }

            // Timeout after 5 mins
            if (Date.now() - startTime >= TIMEOUT) {
              clearInterval(interval);
              await makeApiCall.post(
                `${APIS.pinelabsCancel}`,
                cancelPayload
              );
              reject({ status: "Timeout" });
            }
          } catch (err) {
            clearInterval(interval);
            reject(err);
          }

        }, POLL_INTERVAL);

      } catch (error) {
        reject(0);
      }
    });
  };

  const lastInvoiceBill = (id?: any) => {
    const endPoint = APIS.lastInvoiceBill;

    getBillPayload(id)
      .then((response) => {
        clientPostApi(
          endPoint,
          response,
          (onSuccess: any) => {
            _callPrinter(onSuccess?.data, true);
          },
          (onError: any) => {
            console.log("onError", onError);
          }
        );
      })
      .catch((error) => {
        console.log("error", error);
        alert("Something went wrong");
      });
  };

  const onClear = () => {
    Cookies.remove("scannedProdcut");
    setDueDate(null);
    setSelectedType(1);
    setPosDataList([]);
    setPosError({
      dueDate: "",
      location: "",
      pickupDateTime: "",
    });
    setPosStatus(POSSTATUS.invoice);
    setFooterCalculation({
      totItems: 0,
      discount: 0,
      totAmt: 0,
      totQty: 0,
      totTicketQty: 0,
      scanQty: 0,
      adjustedQty: 0,
      roundOf: 0,
      totalReturn: 0,
      totalGst: 0,
      totPrice: 0,
      promoDiscount: 0,
      grossSales: 0,
    });
    setTagReturnData([]);
    setIsCopySalesman(false);
    setIsOrder(false);
    setPosEditData(null);
    // setIsRetrive(false);
    setSelectedCustomer(null);
    // setIsCompleteSale(false);
    // setIsPosOrderModal(false);
    // setIsModify(false);
    setIsCopy(false);
    setIsEdit(false);
    setSelectedRowKeys([]);
    setMopValues([]);
    setHistoryType(POSSTATUS.invoice);
    // setIsPaid(false);
    barcodeCache = {};
    setSelectedMop(null);
    // setInputVal(null);
    setNotesVal(null);
    setDiscountPopRate(null);
    setInvoiceAppliedDiscc(null);
    setCustomerBenefitData(null);
    setCustomerEarnPoint(0);
    setPosHistoryDetail(null);
    setTicketHistoryData([]);
    setSelectedRowKey(null);
    setIsFetching(true);
    setTrialDate(null);
    setPickupDateTime(null);
    setLocation(null);
    setMakeOrderSave(false);
    setMtrValue((prev: any) => ({
      ...prev,
      index: null,
      scanQty: null,
      qty: null,
      lessQty: null,
      isMtr: false,
      isReturn: false,
    }));
    setCoupons([]);
    setReference((prev) => ({ ...prev, refEntryDate: "", refEntryNo: "", refMobileNo: "" }));
    setRedeemPoint({
      point: "",
      pointAmount: "",
      redeemPoint: "",
    });
    setIsPayment({
      cardProgress: false,
      cardPaid: false,
      cardFailed: "",
      creditProgress: false,
      creditPaid: false,
      creditFailed: "",
      upiProgress: false,
      upiPaid: false,
      upiFailed: ""
    });
    setProducts({ final_invoice: [], curr_invoice: [], order: [] });
    setConnector((prev: any) => ({ ...prev, points: 0 }));
    setCreditDetails([]);
    setWalletDetails([]);
    setMopEdit(true);
    setTicketDataList([]);
    // handleClear();
    // clearDraft();
  };

  //For TAB SWITCH::
  // type StoredState = {
  //   posDataList: any[];
  // };
  // const SESSION_FLAG = "POS_TAB_SESSION";

  // const { id } = useParams() as { id?: string };
  // const isEditData = !!id && id !== "create";
  // const slug = isEditData ? `edit-${id}` : "create";

  // const sessionKey = `retail-pos-${slug}`;

  // const hydratedRef = useRef(false);
  // const hydratedKeyRef = useRef<string | null>(null);
  // const saveTimerRef = useRef<number | null>(null);

  // useEffect(() => {
  //   sessionStorage.setItem(SESSION_FLAG, "true");
  // }, []);
  // //
  // // 2️⃣ Hydrate from Dexie (load stored POS table)
  // //
  // useEffect(() => {
  //   hydratedRef.current = false;
  //   hydratedKeyRef.current = sessionKey;

  //   const loadStored = async () => {
  //     const sessionActive =
  //       sessionStorage.getItem(SESSION_FLAG) === "true";

  //     if (!sessionActive || isEdit) return;

  //     try {
  //       const result = await localDB.state.get(sessionKey);

  //       if (result?.data?.posDataList) {
  //         setPosDataList(result.data.posDataList);
  //       }
  //     } finally {
  //       if (hydratedKeyRef.current === sessionKey) {
  //         hydratedRef.current = true;
  //       }
  //     }
  //   };

  //   loadStored();
  // }, [sessionKey]);


  // //
  // // 3️⃣ Persist POS table into Dexie
  // //
  // useEffect(() => {
  //   if (!hydratedRef.current) return;
  //   if (sessionStorage.getItem(SESSION_FLAG) !== "true") return;

  //   const payload: StoredState = {
  //     posDataList,
  //   };
  //   if (saveTimerRef.current)
  //     window.clearTimeout(saveTimerRef.current);
  //   saveTimerRef.current = window.setTimeout(() => {
  //     localDB.state.put({
  //       key: sessionKey,
  //       data: payload,
  //     });
  //   }, 250);
  //   // return () => {
  //   //   if (saveTimerRef.current)
  //   //     window.clearTimeout(saveTimerRef.current);
  //   // };
  // }, [posDataList, sessionKey]);

  // // useEffect(() => {
  // //   const handleUnload = async () => {
  // //     await localDB.state.delete(sessionKey);
  // //   };
  // //   window.addEventListener("beforeunload", handleUnload);
  // //   return () => {
  // //     window.removeEventListener("beforeunload", handleUnload);
  // //   };
  // // }, [sessionKey]);

  // const stopPersist = () => {
  //   sessionStorage.setItem(SESSION_FLAG, "false");     // gate the save effect
  //   if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current); // kill pending debounce
  // };
  // const clearDraft = async () => {
  //   stopPersist();
  //   await localDB.state.delete(sessionKey);
  // };


  //Closing Tab switch


  const _callPrinter = (response: any, isLastPrint?: any) => {
    const serviceBaseUrl = process.env.NEXT_PUBLIC_PRINT_SERVICE_URL_HTTPS || 'http://localhost:5001/';
    const serviceUrl = `${serviceBaseUrl}api/print/invoiceprint`;
    let type = "";
    if (segment === "Create") {
      type =
        getPosTypeId(isLastPrint) === 2
          ? "CM"
          : getPosTypeId(isLastPrint) === 3
            ? "RM"
            : getPosTypeId(isLastPrint) === 1
              ? "POSORDER"
              : "CM";
    } else {
      if (posStatus === "tellerSummary") {
        type = "TELLERSUMMARY"
      } else {
        type =
          historyType === POSSTATUS.invoice
            ? "CM"
            : historyType === POSSTATUS.return
              ? "RM"
              : historyType === POSSTATUS.pos
                ? "POSORDER"
                : historyType === POSSTATUS.hold ? "HOLD" : "CM";
      }
    }

    const payload = {
      data: response,
      type: type,
    };
    makeApiCall
      .post(serviceUrl, payload)
      .then((response) => {
        console.log("response", response);
        if (response?.status === 200) {
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const _callPrinterBase64 = async (response: any) => {
    const serviceBaseUrl = process.env.NEXT_PUBLIC_PRINT_SERVICE_URL_HTTPS || 'http://localhost:5001/';
    const serviceUrl = `${serviceBaseUrl}api/print/invoicePrintBase64`;
    let type = "";
    if (segment === "Create") {
      type =
        getPosTypeId() === 2
          ? "CM"
          : getPosTypeId() === 3
            ? "RM"
            : getPosTypeId() === 1
              ? "POSORDER"
              : "CM";
    }
    else if (segment === "History")
      type = "TELLERSUMMARY";

    const payload = {
      data: response,
      type: type,
    };
    return new Promise((resolve, reject) => {
      makeApiCall
        .post(serviceUrl, payload)
        .then((response) => {
          console.log("response", response);
          if (response?.status === 200) {
            resolve(response);
          }
        })
        .catch((error) => {
          reject(error);
          console.log("error", error);
        });
    });
  };

  const htmlToPlainText = (html: any) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const _callRedeemOtp = async (
    data: any
  ) => {
    const payload = {
      mobileNo: data.mobileNo,
      eventType: "Redeem OTP",
      form: "POS",
      type: data.type,
      otp: data.otp,
      redeemPoint: data.redeemPoint,
      typeId: 2
    };

    try {
      const response = await makeApiCall.post(APIS.notification, payload);
      if (response?.status === 200) {
        // setSelectedCustomer(null);
        return true;
      }
      return false;
    } catch (err) {
      console.log("data::", err);
      console.log(err);
    }
  }

  const _callNotification = async (
    id: any,
    entryNo: any,
    base64: any,
    eventType: string,
    form: string,
    typeId: any
  ) => {
    try {
      const payload = {
        entryId: id,
        eventType,
        form,
        media: [
          {
            id: 0,
            url: `invoice_${entryNo}.pdf`,
            image: base64,
          },
        ],
        typeId: typeId,
      };

      makeApiCall
        .post(APIS.notification, payload)
        .then(async (response: any) => {
          if (response?.status === 200) {
            setSelectedCustomer(null);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const validationSchema = Yup.object().shape({
    isOrder: Yup.boolean(),
    isMakeToOrder: Yup.boolean(),
    selectedType: Yup.number(),
    dueDate: Yup.string()
      .nullable()
      .when(["isOrder", "selectedType"], (values, schema) => {
        const [isOrder, selectedType] = values;
        if (isOrder === true && selectedType === 1) {
          return schema.required("Delivery date is required");
        }
        return schema;
      }),
    pickupDateTime: Yup.string()
      .nullable()
      .when(["isOrder", "selectedType"], (values, schema) => {
        const [isOrder, selectedType] = values;
        if (isOrder === true && selectedType === 2) {
          return schema.required("Pickup time is required");
        }
        return schema;
      }),
    location: Yup.string()
      .nullable()
      .when(["isOrder", "selectedType"], (values, schema) => {
        const [isOrder, selectedType] = values;
        if (isOrder === true && selectedType === 2) {
          return schema.required("Location is required");
        }
        return schema;
      }),
  });

  const formik = useFormik({
    initialValues: {
      ...initOrder,
      isOrder,
      isMakeToOrder: makeOrderSave
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const { isMakeToOrder } = values;
      return new Promise(async (resolve) => {
        try {
          let res: any;
          if (!isMakeToOrder) {
            res = await onInvoiceOrderSubmit();
            onClear();
            setShowPayment(false);
          } else {
            res = await onMakeOrderSave();
            onClear();
            setShowPayment(false);
          }
          const { data } = res ?? {};
          const result = { success: true, response: data };
          formik.resetForm();
          resolve(result); // ⭐ return result to caller
        }
        catch (err) {
          const result = { success: false, error: err };
          resolve(result); // ⭐ return error to caller
        }
      });

    },
  });

  const onInvoiceOrderSubmit = async () => {
    return new Promise((resolve, reject) => {

      //New update
      let endpoint = ticket.dc ? APIS.posTicketSave : APIS.posSave;

      getPosSavePayload()
        .then((payloadData) => {
          try {
            clientPostApi(
              endpoint,
              payloadData,
              async (onSuccess: any) => {
                const { printData, entryId, billNumber } = onSuccess?.data;
                // setIsPaid(true);
                setPaymentSuccess(onSuccess?.data);
                // setOnSuccessModal(true);
                // setLastBillInfo(onSuccess?.data);
                getRecentInvoice();
                getAllCustomer();

                const customer = selectedCustomer;
                const redeem = redeemPoint;
                const branchName = userDetail.branchName;

                // onClear();
                // setShowPayment(false);
                resolve(onSuccess);
                if (!isEdit) {
                  try {
                    if (getPosTypeId() === 2) {
                      for (let i = 0; i < pos_cash_memo_copies; i++) {
                        setTimeout(() => {
                          _callPrinter(printData);
                        }, i * 2000);
                      }
                    }
                    else if (getPosTypeId() === 3) {
                      for (let i = 0; i < pos_return_memo_copies; i++) {
                        _callPrinter(printData);
                      }
                    }
                    else _callPrinter(printData);

                    const response: any = await _callPrinterBase64(printData);
                    const {
                      data: { base64 },
                    } = response;


                    if (connector.ownChat) {
                      try {
                        if (Boolean(redeem.redeemPoint))
                          await RedeemPoints(APIS.redeemPoints, onSuccess?.data, customer, redeem.redeemPoint, initialData);
                      } catch (err) {

                      }

                      try {
                        await PostBillSync(APIS.billSync, onSuccess?.data, {
                          footerCalculation,
                          posDataList,
                          base64,
                          branchName,
                          selectedCustomer: customer,
                          initialData,
                        });
                      } catch (err) {

                      }
                    }
                    const mopData = Boolean(mopValues?.length)
                      ? mopValues.map((mop) => mop.mopName).join(",")
                      : "Cash";

                    if (connector.bik) {
                      try {
                        await CreateCustomer(
                          APIS.BikCreateCustomer,
                          onSuccess?.data,
                          base64,
                          customer,
                          footerCalculation,
                          mopData,
                          loggedUser?.curruncyID
                        );
                      } catch (err) {

                      }
                    }

                    try {
                      const res: any = await _callNotification(
                        entryId,
                        billNumber,
                        base64,
                        getPosTypeId() == 2 ?
                          "New Cash Memo Created" :
                          getPosTypeId() == 1 ? "New Pos Order Created" : getPosTypeId() == 3 ? "New Return Created" : "New Hold Created",
                        "POS",
                        getPosTypeId() == 2 ? 2 : 1
                      );
                    } catch (notificationError) {
                      console.error(
                        "Error in notification API:",
                        notificationError
                      );
                      // Continue even if notification fails
                    }
                  } catch (printerError) {
                    console.error("Error in printer API:", printerError);
                    // Continue even if print fails
                  } finally {
                    // Always executed

                  }
                }
              },
              (onError: any) => {
                if (onError.code == 422) {
                  setPosError((prev: any) => ({
                    ...prev,
                    error: onError?.errordescription,
                  }));
                  console.log("onError", onError);
                }
                reject(onError);
              }
            );
          } catch (error) {
            // alert("Something went wrong");
            console.log("API::error", error);
            reject(error);
          }
        })
        .catch((error) => {
          console.log("error:::", error);
          // alert("Something went wrong");
          reject(error);
        });
      // clearDraft();
    });
  };

  const onMakeOrderSave = async () => {
    return new Promise((resolve, reject) => {
      getPosSavePayload()
        .then((payloadData) => {
          try {
            clientPostApi(
              APIS.posMakeOrderSave,
              payloadData,
              async (onSuccess: any) => {
                const { printData, entryId, billNumber } = onSuccess?.data;
                // setIsPaid(true);
                setPaymentSuccess(onSuccess?.data);
                // setOnSuccessModal(true);
                // setLastBillInfo(onSuccess?.data);
                getRecentInvoice();
                getAllCustomer();
                //28/08 updated

                const icodes = products.order.map((item: any) => ({
                  icode: item.icode,
                  seqNo: item.seqNo,
                }));

                if (customer) {
                  postCart(
                    customer.id,
                    cartData.filter((item: any) => {
                      // keep item if it's NOT found in icodes+seqNo list
                      return !icodes.some(
                        (o) => o.icode === item.icode && o.seqNo === item.seqNo
                      );
                    })
                  );
                }
                // const icodes = products.order.map((item: any) => item.icode);
                // postCart(
                //   customer.id,
                //   cartData.filter((item: any) => !icodes.includes(item.icode))
                // );

                setProducts({ final_invoice: [], curr_invoice: [], order: [] });
                setCustomer(null);
                // onClear();
                // setShowPayment(false);
                resolve(onSuccess);
                if (!isEdit) {
                  try {
                    _callPrinter(printData); // Optional if _callPrinter is needed

                    const response: any = await _callPrinterBase64(printData);
                    const {
                      data: { base64 },
                    } = response;

                    try {
                      const res: any = await _callNotification(
                        entryId,
                        billNumber,
                        base64,
                        "New Pos Order Created",
                        "POS",
                        1
                      );
                    } catch (notificationError) {
                      console.error(
                        "Error in notification API:",
                        notificationError
                      );
                      // Continue even if notification fails
                    }
                  } catch (printerError) {
                    console.error("Error in printer API:", printerError);
                    // Continue even if print fails

                  } finally {
                    // Always executed

                  }
                }


              },
              (onError: any) => {
                console.log("onError", onError);
                reject(onError);
              }
            );
          } catch (error) {
            // alert("Something went wrong");
            console.log("API::error", error);
            reject(error);
          }
        })
        .catch((error) => {
          console.log("error", error);
          // alert("Something went wrong");
          reject(error);
        });
    });
  };

  const getTellerSavePayload = () => {
    return new Promise<any>((resolve, reject) => {
      try {
        const companyId = getBranchIdByHeader("companyId");
        const branchId = getCompanyDetails("id");
        const userDetail = getUserDetails();

        const payload = tellerSummaryList
          .filter((ts) => (Number(ts.credit) > 0 || Number(ts.debit) > 0))
          .map((ts) => {
            return {
              id: ts.rId,
              userName: "",
              terminalName: deviceName,
              loginDate:
                tellerSummaryCalculation.openingDate || formatDateAndTime(),
              time: "",
              openingAmount:
                ts.description.toLowerCase().trim() ===
                  "opening amount".toLowerCase().trim()
                  ? tellerSummaryCalculation.openingAmount
                  : 0,
              payIn:
                ts.description.toLowerCase().trim() !==
                  "opening amount".toLowerCase().trim()
                  ? ts.credit || 0
                  : 0,
              payInRemarks:
                ts.credit &&
                  Number(ts.credit) > 0 &&
                  ts.description.toLowerCase().trim() !==
                  "opening amount".toLowerCase().trim()
                  ? ts.description
                  : "",
              payOut:
                ts.description.toLowerCase().trim() !==
                  "opening amount".toLowerCase().trim()
                  ? ts.debit || 0
                  : 0,
              payOutRemarks:
                ts.debit &&
                  Number(ts.debit) > 0 &&
                  ts.description.toLowerCase().trim() !==
                  "opening amount".toLowerCase().trim()
                  ? ts.description
                  : "",
              stockpointId: 1,
              status: "Open",
              gLedger: 0,
              sLedger: 0,
              acknowledge: 0,
              isMasterCashier: 0,
              branchId: branchId,
              companyId: companyId,
            };
          });
        // console.log("payload", payload);
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  };

  const getDenominationSavePayload = () => {
    return new Promise<any>((resolve, reject) => {
      try {
        const companyId = getBranchIdByHeader("companyId");
        const branchId = getCompanyDetails("id");

        const denominationAmount = () => {
          // Calculate the total of the "Amount" column
          const totalAmount = denominationList.reduce(
            (sum: any, row: any) => sum + row.amount,
            0
          );
          return totalAmount;
        };

        const payload = {
          userName: "",
          terminalName: deviceName,
          loginDate:
            tellerSummaryCalculation.openingDate || formatDateAndTime(),
          session: 0,
          value: 1,
          cashInHandLedger: 0,
          denomination: denominationList.map((list) => {
            return {
              ...list,
              noOfUnits: Number(list.noOfUnits),
              amount: denominationAmount(),
            };
          }),
          branchId: branchId,
          companyId: companyId,
        };
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  };

  const details = React.useMemo(() => {
    if (Boolean(posDataList.length))
      return walletDetails;
    return creditDetails;
  }, [posDataList, creditDetails, walletDetails]);

  const getCreditSavePayload = () => {
    return new Promise<any>((resolve, reject) => {
      try {
        const voucherDate = dayjs().format("YYYY-MM-DD");
        const referenceDate = dayjs().format("YYYY-MM-DD");

        const mopBalance = () => {
          let sum: any = 0;
          mopValues.forEach((mop: any) => (sum += Number(mop.amount)));
          return Number(sum || 0);
        };

        let againstAdjustedAmount = 0;
        let againstDiscountAmount = 0;
        let againstTdsAmount = 0;
        let againstOthersAmount = 0;

        details
          .filter((d: any) => d.selected === true)
          .map((d: any) => {
            againstAdjustedAmount =
              Number(againstAdjustedAmount) +
              (d.sign === "+" ? -Number(d.adjustment) : +Number(d.adjustment)) * -1;
            againstDiscountAmount =
              Number(againstDiscountAmount) +
              (d.sign === "+"
                ? -Number(d.discountValue)
                : +Number(d.discountValue)) *
              -1;
            againstTdsAmount =
              Number(againstTdsAmount) +
              (d.sign === "+" ? -Number(d.tds) : +Number(d.tds)) * -1;
            againstOthersAmount =
              Number(againstOthersAmount) +
              (d.sign === "+" ? -Number(d.others) : +Number(d.others)) * -1;
          });


        const againstIdList = details
          .filter((d: any) => d.selected === true)
          .map((d: any) => d.id);

        const againstSignList = details
          .filter((d: any) => d.selected === true)
          .map((d: any) => d.sign);

        const againstAmountList = details
          .filter((d: any) => d.selected === true)
          .map((d: any) => d.netAmount);

        const againstAdjustedAmountList = details
          .filter((d: any) => d.selected === true)
          .map((d: any) => d.adjustment);

        const totalAmt = applyPosFinalAmount(footerCalculation.totAmt, true);

        const getRemainingAmt = () => {
          const received: any = mopBalance();
          let retrn = 0;
          if (
            footerCalculation.totAmt === 0 &&
            footerCalculation.totalReturn > 0
          ) {
            retrn =
              Number(footerCalculation.totalReturn) -
              Number(footerCalculation.grossSales);
          }
          const remaining =
            Number(Math.abs(footerCalculation.totAmt) + Math.abs(retrn)) >=
              Number(received)
              ? Number(retrn)
              : Number(footerCalculation.totAmt) - parseFloat(received);

          return Math.abs(Number(applyPosFinalAmount(remaining || 0, true))) || 0;
        };
        const refund = getRemainingAmt();


        const updatedMop = mopValues.map((d) => {
          if (d.mopName.toLowerCase() == "cash" && Number(totalAmt) > 0)
            return { ...d, amount: Number(d.amount) - refund }
          return { ...d }
        })

        const payload = {
          entryId: 0,
          voucherTypeId: 5,
          voucherNo: "Auto",
          voucherDate: voucherDate,
          partnerType: "Loyalty",
          customer: selectedCustomer?.id,
          partnerLocation: selectedCustomer?.branchId,
          modeOfPayment: "Cash",
          referenctId: 0,
          referenceNumber: "",
          referenceDate: referenceDate,
          favorOf: "",
          // amount: Number(totalAmt) > Number(refund) ? Number(totalAmt) : Number(refund),
          amount: Number(totalAmt),
          narration: "",
          againstIdList: againstIdList.join(","),
          againstSignList: againstSignList.join(","),
          againstAmountList: againstAmountList.join(","),
          againstAdjustedAmountList: againstAdjustedAmountList.join(","),
          againstDiscountAmountList: "",
          againstTdsAmountList: "",
          againstOthersAmountList: "",
          againstAdjustedAmount: againstAdjustedAmount,
          againstDiscountAmount: 0,
          againstTdsAmount: 0,
          againstOthersAmount: 0,
          againstRefAmount: againstAdjustedAmount,
          newRefAmount: Number(totalAmt) == 0 ? Number(refund) : 0,
          customField1: "",
          customField2: "",
          customField3: "",
          customField4: "",
          customField5: "",
          terminalName: deviceName,
          cfDate1: null,
          cfDate2: null,
          cfCombo1: "",
          cfCombo2: "",
          cfRadio1: false,
          cfRadio2: false,
          MOPDetails: [...updatedMop],
          isActive: true,
        }
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  };

  const tellerSummarySave = async () => {
    try {
      const payloadData = await getTellerSavePayload();
      await makeApiCall.post(APIS.saveTellerSummary, payloadData);
      await getTellerSummary();
      return;
    }
    catch (err) {
      console.log(err);
    }
  };

  const denominationSave = async () => {
    try {
      const payloadData = await getDenominationSavePayload();
      await makeApiCall.post(APIS.saveDenomination, payloadData);
      await getTellerSummary();
      return;
    }
    catch (err) {
      console.log(err);
    }
  };

  //Credit Save ///////////////////////
  const onCreditSave = async () => {
    await new Promise<void>((resolve, reject) => {
      getCreditSavePayload()
        .then((payloadData) => {
          try {
            clientPostApi(
              "CollectionRefundSave",
              payloadData,
              (onSuccess: any) => {
                console.log("onSuccess::", onSuccess);
                onClear();
                resolve();
              },
              (onError: any) => {
                console.log("onError", onError);
                reject();
              }
            );
          } catch (error) {
            alert("Something went wrong");
            console.log("API::error", error);
            reject();
          }
        })
        .catch((error) => {
          console.log("error", error);
          alert("Something went wrong");
          reject();
        });
    });
  }

  const saveCustomer = async (data: any) => {
    try {
      const response = await makeApiCall.post("PostLoyaltyMemberSave", data);
      const mobileNo = data?.mobile_no || selectedCustomer?.mobileNo;
      await getAllCustomer(response?.data?.data, mobileNo, 0);
      setIsCustomerEdit(true);
      return response;
    } catch (error) {
      alert("Something went wrong");
      console.log("API::error", error);
    }
  };

  const getAllSalesman = async () => {
    const branchId = getBranchIdByHeader("companyId");
    const endPoint = `${APIS.getSalesmanList}?branch_id=${branchId}`;
    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          console.log("check::onSuccess", onSuccess);
          setSalesmanList(onSuccess?.data);
          resolve();
          // setSalesmanList
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
          // setSalesmanList(onError?.data);
        }
      );
    });
  };

  const getTellerSummary = async (isCreate = false) => {
    const companyId = getBranchIdByHeader("companyId");
    const branchId = getCompanyDetails("id");
    const endPoint = `${APIS.getTellerSummary}`;

    const bodyData = {
      terminalName: deviceName,
      loginDate: tellerSummaryCalculation.openingDate
        ? tellerSummaryCalculation.openingDate
        : formatDateAndTime(),
      branchId: branchId,
      companyId: companyId,
      isPosSave: isCreate,
    };

    await new Promise<void>((resolve, reject) => {
      clientPostApi(
        endPoint,
        bodyData,
        (onSuccess: any) => {
          tellerListHandler(onSuccess?.data);
          resolve();
          // setSalesmanList
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
          // setSalesmanList(onError?.data);
        }
      );
    });
  };

  const getDenomination = async () => {
    const endPoint = `${APIS.getDenomination}?currencyId=${loggedUser.curruncySetupId ?? 0
      }`;

    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          console.log("check::onSuccess", onSuccess);
          setDenominationList(onSuccess?.data);
          resolve();
          // setSalesmanList
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
          // setSalesmanList(onError?.data);
        }
      );
    });
  };

  const tellerSummaryPrint = async (startDate?: any, endDate?: any) => {
    const endPoint = `${APIS.posTellerPrint}`;
    const payload = {
      "terminal": deviceName,
      "startDate": startDate || '',   //"2025-09-18 11:17:36.009703+05:30",
      "endDate": endDate || '' //"2025-09-18 16:38:09.239379+05:30"
    }
    await new Promise<void>((resolve, reject) => {
      clientPostApi(
        endPoint,
        payload,
        (onSuccess: any) => {
          _callPrinter(onSuccess.data);
          resolve();
          // setSalesmanList
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
          // setSalesmanList(onError?.data);
        }
      );
    });
  };

  //Preview Teller 
  const onPreviewTeller = async (startDate: any, endDate: any) => {
    const endPoint = `${APIS.posTellerPrint}`;
    const payload = {
      "terminal": deviceName,
      "startDate": startDate,   //"2025-09-18 11:17:36.009703+05:30",
      "endDate": endDate //"2025-09-18 16:38:09.239379+05:30"
    }
    return await new Promise<any>((resolve, reject) => {
      clientPostApi(
        endPoint,
        payload,
        async (onSuccess: any) => {
          const blob = await _callPrinterBase64(onSuccess.data);
          resolve(blob);
          // setSalesmanList
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
          // setSalesmanList(onError?.data);
        }
      );
    });
  };

  const getRecentInvoice = async (lastRowId = 0) => {
    const typeId =
      posStatus === POSSTATUS.invoice
        ? entryType.invoiceType
        : posStatus === POSSTATUS.return
          ? entryType.returnType
          : entryType.invoiceType;
    const customer = selectedCustomer?.id ?? "";
    const endPoint = `${APIS.recentInvoices}?typeId=${typeId}&terminal=${deviceName}&page=${lastRowId}&pageSize=20&customer=${customer}`;
    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          const recents = lastRowId == 0 ? onSuccess?.data : [...recentInvoiceList, ...onSuccess?.data]
          setRecentInvoiceList(recents);
          resolve();
          // setSalesmanList
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
          // setSalesmanList(onError?.data);
        }
      );
    });
  };


  const getCreditDetails = async (customerId: any) => {
    const endPoint = `${APIS.getCreditDetails}?customerId=${customerId ?? null}&status=${false}&typeId=${5}`;
    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          setCreditDetails(onSuccess?.data || []);
          setShowWallet(false);
          resolve();
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
        }
      );
    });
  }

  const getWalletDetails = async (customerId: any) => {
    const endPoint = `${APIS.getCreditDetails}?customerId=${customerId ?? null}&status=${true}&typeId=${30}`;
    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          setWalletDetails(onSuccess?.data || []);
          setShowWallet(false);
          resolve();
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
        }
      );
    });
  }

  useEffect(() => {
    if (selectedCustomer) {
      getCreditDetails(selectedCustomer?.id);
      getWalletDetails(selectedCustomer?.id);
    }
  }, [selectedCustomer]);

  const getUserSettings = async () => {
    const endPoint = `${APIS.userSetting}`;
    await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          console.log("usersetting", onSuccess);
          setUserRights(onSuccess?.data);
          // setRecentInvoiceList(onSuccess?.data);
          resolve();
          // setSalesmanList
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
          // setSalesmanList(onError?.data);
        }
      );
    });
  };

  const onValidateBarcode = async () => {
    const payload = {
      barcode: `${searchBarcode}`,
      // stockpoint_id: 1,
      stockpoint_id: userDetails?.defaultStockpointId,
      branch_id: getCompanyDetails("id"),
      company_id: getBranchIdByHeader("companyId"),
    };
    return await new Promise((resolve, reject) => {
      clientPostApi(
        APIS.barcodeValidation,
        payload,
        (onSuccess: any) => {
          resolve(onSuccess?.data);
        },
        (onError: any) => {
          reject(onError);
        }
      );
    });
  };

  const buildPayload = (items: any[]) => ({
    customerCardType: selectedCustomer?.cardType || "",
    customerId: selectedCustomer?.id || null,
    loyaltyBenefitCode: selectedCustomer?.benefitCode || "",
    currentTime: new Date().toLocaleTimeString(),
    memoType: 1,
    netSales: 0,
    branchId: getCompanyDetails("id"),
    scannedBarcodes: items.map((pd) => ({
      seqNo: pd.key,
      icode: pd.icode,
      qty: pd.scanUnitQty,
      salePrice: pd.salePrice,
      promoDiscValue: "",
    })),
  });

  const promotionApiCall = (payload: any) => {
    return new Promise((resolve, reject) => {
      clientPostApi(
        APIS.applyPromotion,
        payload,
        (onSuccess: any) => resolve(onSuccess?.data),
        (onError: any) => reject(onError)
      );
    });
  };


  const onApplyPromotion = async () => {

    const filteredList = posDataList.filter(
      (item) => !item.isInvoiceReturn && !!!Boolean(item.blockDiscount)
    ).map((item) => {
      let unique = item.barcode.split(".");
      let icode;
      if (unique?.length > 1)
        icode = unique[0];
      else icode = item.barcode;
      return {
        ...item,
        icode
      }
    });

    const takenItems = filteredList.filter(item => item.isTaken && !!!Boolean(item.blockDiscount));
    const notTakenItems = filteredList.filter(item => !item.isTaken && !!!Boolean(item.blockDiscount));

    const isAllTaken = takenItems.length === filteredList.length;
    const isAllNotTaken = notTakenItems.length === filteredList.length;
    const isMixed = takenItems.length > 0 && notTakenItems.length > 0;

    try {
      let response;

      if (isAllTaken || isAllNotTaken) {
        // ✅ Single promotion call
        response = await promotionApiCall(buildPayload(filteredList));
      }
      else if (isMixed) {
        // ✅ Split promotion
        const takenResponse: any = await promotionApiCall(
          buildPayload(takenItems)
        );

        const notTakenResponse: any = await promotionApiCall(
          buildPayload(notTakenItems)
        );

        let both = [...takenResponse, ...notTakenResponse];

        response = both;
      }

      return response;

    } catch (error) {
      alert("Something went wrong");
      console.log("API::error", error);
      return null; // Return null on error
    }
  };

  const getCustomerBenefit = async (response: any) => {
    const companyId = getBranchIdByHeader("companyId");
    const branchId = getCompanyDetails("id");
    const payloadData = {
      branchId: branchId,
      companyId: companyId,
      customerId: selectedCustomer ? selectedCustomer.id : 0,
      memberCardType: selectedCustomer ? selectedCustomer.cardType : null,
      netVal: applyPosFinalAmount(response, true),
      type: "Benefit",
    };

    if (!selectedCustomer) {
      console.log("No customer selected");
      return null;
    }

    try {
      // if (connector.ownChat) {
      //   try {
      //     const response = await GetLoyaltyPoints(APIS.getLoyaltyPoints, selectedCustomer, initialData);

      //     if (response.status == 200) {
      //       const data = response?.data?.data?.data;
      //       setConnector((prev: any) => ({
      //         ...prev,
      //         points: applyDecimal(data)
      //       }));
      //     }
      //   } catch (err) {
      //     setConnector((prev) => ({
      //       ...prev,
      //       points: 0
      //     }));
      //   }

      // }

      const response = await new Promise((resolve, reject) => {
        clientPostApi(
          APIS.customerBenefit,
          payloadData,
          async (onSuccess: any) => {
            setCustomerBenefitData(onSuccess?.data);
            setCustomerEarnPoint(onSuccess?.data?.earn_point ?? 0);
            resolve(onSuccess?.data); // Resolve the Promise with data
          },
          (onError: any) => {
            console.log("onError", onError);
            reject(onError); // Reject the Promise on error
          }
        );
      });
      return response; // Return the resolved data
    } catch (error) {
      alert("Something went wrong");
      console.log("API::error", error);
      return null; // Return null on error
    }
  };

  const checkOffersTotal = (newList: any[], response: any) => {
    return new Promise<number>((resolve, reject) => {
      try {
        // Sum total saleValue before and after applying discounts
        const { totalAmount } = newList.reduce(
          (acc, item) => {
            const {
              saleValue,
              productDiscountValType,
              productDiscountFactor,
              promoDiscValue,
              invoiceDiscountValType,
              invoiceDiscountFactor,
              invoiceDiscountValue,
              productDiscountValue,
              isInvoiceReturn,
              qty,
            } = item;

            let amount = parseFloat(saleValue) || 0;
            let prodisc = 0;
            let invDiscVal = 0;
            let promotionDiscValue = 0;
            let productFactor = 0;
            let invFactor = 0;

            // Calculate promotion discount
            // if (Boolean(promoDiscValue)) {
            //   promotionDiscValue = parseFloat(promoDiscValue);
            // }

            amount -= promotionDiscValue;

            // Calculate product-level discount
            if (Boolean(productDiscountFactor)) {
              //new calculation 26-09-2025
              if (!productDiscountValType) {
                const percFactor = (productDiscountValue / amount) * 100;

                const amtFactor = productDiscountValue;
                productFactor = percFactor <= 100 ? percFactor : amtFactor;
                prodisc = productFactor <= 100
                  ? (amount * productFactor) / 100
                  : productFactor;
              }
              else {
                //new calculation 30-01-2026
                prodisc =
                  productDiscountValType === "Amount"
                    ? parseFloat(productDiscountFactor)
                    : (amount * parseFloat(productDiscountFactor)) / 100;
              }
            }

            amount -= prodisc;

            // Accumulate total saleValue before invoice-level discounts
            acc.totalSaleValue += amount;

            if (invoiceDiscountFactor && !isInvoiceReturn) {
              if (!invoiceDiscountValType) {
                //new calculation 26-09-2025
                const percinvFactor = (invoiceDiscountValue / amount) * 100;
                const amtinvFactor = invoiceDiscountValue;
                invFactor = percinvFactor <= 100 ? percinvFactor : amtinvFactor;
                invDiscVal = invFactor <= 100
                  ? (amount * invFactor) / 100
                  : invFactor;
              }
              else {
                //new calculation 30-01-2026
                invDiscVal =
                  invoiceDiscountValType === "Amount"
                    ? (amount * invoiceDiscountFactor) / response
                    : amount * (invoiceDiscountFactor / 100);
              }
            }

            amount -= invDiscVal;

            // Update totalAmount after discounts
            if (item.isTaken) {
              acc.totalAmount += amount;
            } else {
              acc.totalAmount -= amount;
            }

            return acc;
          },
          { totalAmount: 0 }
        );

        resolve(totalAmount);
      } catch (error) {
        console.error("Error in checkOffersTotal:", error);
        reject(0);
      }
    });
  };

  const calculateDiscounts = (
    item: any,
    response: number,
    customerBenefit: any
  ) => {
    const {
      saleValue,
      productDiscountFactor,
      invoiceDiscountFactor,
      productDiscountValue,
      invoiceDiscountValue,
      invoiceDiscountValType,
      productDiscountValType,
      promoDiscValue,
      isInvoiceReturn,
      discount,
      loyaltyDiscount,
      discountedSales,
      blockDiscount
    } = item ?? {};

    if (!!Boolean(blockDiscount)) return item;  //Block discount

    let productAmt = parseFloat(saleValue || "0");
    let promotionDiscValue = promoDiscValue || 0;
    let disc = 0;
    let productDisc = 0;
    let invDiscVal = 0;
    let loyaltyDiscValue = 0;
    let discountedSalesAmount = 0;
    let productFactor = 0;
    let invFactor = 0;

    if (productDiscountFactor && !isInvoiceReturn) {

      //new calculation 26-09-2025
      if (!productDiscountValType) {
        const percFactor = (productDiscountValue / productAmt) * 100;

        const amtFactor = productDiscountValue;
        productFactor = percFactor <= 100 ? percFactor : amtFactor;
        productDisc = productFactor <= 100
          ? (productAmt * productFactor) / 100
          : productFactor;
      }
      else {
        //new calculation 30-01-2026
        productDisc =
          productDiscountValType === "Amount"
            ? parseFloat(productDiscountFactor)
            : (productAmt * parseFloat(productDiscountFactor)) / 100;
      }

    }

    productAmt -= productDisc;


    if (invoiceDiscountFactor && !isInvoiceReturn) {

      if (!invoiceDiscountValType) {
        //new calculation 26-09-2025
        const percinvFactor = (invoiceDiscountValue / productAmt) * 100;
        const amtinvFactor = invoiceDiscountValue;
        invFactor = percinvFactor <= 100 ? percinvFactor : amtinvFactor;
        invDiscVal = invFactor <= 100
          ? (productAmt * invFactor) / 100
          : invFactor;
      }
      else {
        //new calculation 30-01-2026
        invDiscVal =
          invoiceDiscountValType === "Amount"
            ? (productAmt * invoiceDiscountFactor) / response
            : productAmt * (invoiceDiscountFactor / 100);
      }
    }

    productAmt -= invDiscVal;

    if (customerBenefit?.disc_per && !isInvoiceReturn) { // Updated sakthi 07-03-26

      const hasDiscount =
        Number(productDiscountFactor) !== 0 ||
        Number(invoiceDiscountFactor) !== 0 ||
        Number(promoDiscValue) !== 0;

      if (connector?.pointsWithoutPromo) {
        loyaltyDiscValue = hasDiscount
          ? 0
          : productAmt * (customerBenefit.disc_per / 100);
      } else {
        loyaltyDiscValue = productAmt * (customerBenefit.disc_per / 100);
      }
    }

    disc = productDisc + invDiscVal + loyaltyDiscValue;
    discountedSalesAmount = parseFloat(saleValue || "0") - disc;

    // productAmt -= promotionDiscValue;




    return {
      ...item,
      discount: isInvoiceReturn ? discount : disc,
      invoiceDiscountValue: isInvoiceReturn ? invoiceDiscountValue : invDiscVal,
      productDiscountValue: isInvoiceReturn
        ? productDiscountValue
        : productDisc,
      loyaltyDiscount: isInvoiceReturn ? loyaltyDiscount : loyaltyDiscValue,
      discountedSales: isInvoiceReturn
        ? discountedSales
        : discountedSalesAmount,
    };
  };

  const ticketPromotions = (products: any) => {
    const promoMap: any = new Map(
      products.map((p: any) => [p.barcode, p])
    );

    const updatedTickets = ticketDataList.map(ticket => ({
      ...ticket,
      posDetails: ticket.posDetails.map((item: any) => {
        const promo = promoMap.get(item.barcode);

        if (!promo) return item;

        return {
          ...item,
          promoDiscValue: promo.promoDiscValue,
          promoId: promo.promoId,
          promotionName: promo.promotionName
        };
      })
    }));

    setTicketDataList(updatedTickets);
  };

  const ticketUpdations = (products: any) => {
    const promoMap: any = new Map(
      products.map((p: any) => [p.barcode, p])
    );

    const updateTickets = ticketDataList.map((ticket) => {
      const details = ticket.posDetails.map((item: any) => {
        const promo = promoMap.get(item.barcode);
        if (!promo) return item;
        return {
          ...item,
          ...promo
        };
      })
      return {
        ...ticket,
        posDetails: details,
        discount: _calculateDiscount(details),
        netSales: _calucaluteNetAmount(details)
      }
    })
    // const updatedTickets = ticketDataList.map(ticket => ({
    //   ...ticket,
    //   posDetails: ticket.posDetails.map((item: any) => {
    //     const promo = promoMap.get(item.barcode);

    //     if (!promo) return item;

    //     return {
    //       ...item,
    //       promoDiscValue: promo.promoDiscValue,
    //       promoId: promo.promoId,
    //       promotionName: promo.promotionName
    //     };
    //   })
    // }));

    setTicketDataList(updateTickets);
  }


  const checkOffers = async () => {
    setCheckOffer((prev: any) => ({ ...prev, apply: true }));

    try {
      //Apply promotion api call
      const promotions: any = await onApplyPromotion();

      const totalPointsValue = promotions.reduce(
        (sum: number, item: any) => sum + item.pointsValue,
        0
      );
      setPointsValue(totalPointsValue);

      // Process promotions and calculate discounted sales
      const promotionPosList = await Promise.all(
        posDataList.map(async (item) => {
          const {
            salePrice,
            promoDiscValue,
            promoId,
            key,
            promotionName,
            isInvoiceReturn,
            splitQty,
            qty,
            scanUnitQty,
            adjustedQty,
            blockDiscount
          } = item ?? {};

          if (!!Boolean(blockDiscount)) return item; //Block discount

          let productAmt =
            parseFloat(salePrice || "0") *
            (splitQty ? qty * (scanUnitQty / qty) - adjustedQty : qty);
          let promotionDiscValue: any = promoDiscValue || 0;
          let proId: any = promoId || null;
          let promoName: any = promotionName || null;
          let benefitDetailId: any = null;
          let isPromoGiftVoucher = false;

          // Apply promotions if available
          if (Boolean(promotions?.length)) {
            const promo = promotions.find((promo: any) => promo.key === key);
            if (promo) {
              promotionDiscValue = promo.promoDiscValue || 0;
              proId = promo.promoId || null;
              promoName = promo.promotionName || null;
              benefitDetailId = promo.customerbenefitid || null;
              isPromoGiftVoucher = Boolean(promo.giftVoucherValue)
                ? true
                : false;
            }
          } else {
            promotionDiscValue = 0;
            proId = null;
            promoName = null;
          }

          const discountedSales = productAmt - promotionDiscValue;

          return {
            ...item,
            promoDiscValue: isInvoiceReturn
              ? promoDiscValue
              : promotionDiscValue,
            promoId: isInvoiceReturn ? promoId : proId,
            promotionName: isInvoiceReturn ? promotionName : promoName,
            saleValue: isInvoiceReturn ? item.discountedSales : discountedSales,
            discountedSales: isInvoiceReturn
              ? item.discountedSales
              : discountedSales,
            isPromoGiftVoucher: isPromoGiftVoucher,
            benefitDetailId: benefitDetailId,
          };
        })
      );

      // Calculate footer totals and further discounts
      const response = await getFooterTotal(scannedProducts(promotionPosList));

      //apply promotion discount in every product and invoice
      const updatedPosDataList = await Promise.all(
        promotionPosList.map(async (item) => {
          return calculateDiscounts(item, response, {});
        })
      );

      const posFilterData = connector?.pointsWithoutPromo ? updatedPosDataList.filter(item =>
        item.productDiscountFactor == 0 && item.promoDiscValue == 0 && item.invoiceDiscountFactor == 0) : updatedPosDataList;

      //total amount after applied promotion discount
      const responseData = await checkOffersTotal(posFilterData, response);

      //call api for customer benefit
      const customerBenefit: any = await getCustomerBenefit(responseData);

      //apply benefit discount in every product
      const updatedBenefitPosList = await Promise.all(
        promotionPosList.map(async (item) => {
          return calculateDiscounts(item, response, customerBenefit);
        })
      );

      // Update the state with the calculated values
      setPosDataList(updatedBenefitPosList);

      if (ticket.isAgainstDC) {
        ticketUpdations(updatedBenefitPosList);
      }
    } catch (error) {
      console.error("Error in checkOffers:", error);
    }
  };

  const removeCustomerBenefitDiscount = async () => {
    setPosDataList((prevPosData) =>
      prevPosData.map((item) => {
        const salesVal: any = applyDecimal(item?.saleValue);
        const loyaltyDiscount: any = parseFloat(item?.loyaltyDiscount) || 0;
        const currentDiscount: any = parseFloat(item?.discount) || 0;

        // Recalculate discount and discounted sales
        const updatedDiscount: any = applyDecimal(
          currentDiscount - loyaltyDiscount
        );
        const discountedSales = applyDecimal(salesVal - updatedDiscount);

        const updatedItem = {
          ...item,
          loyaltyDiscount: 0,
          discount: updatedDiscount,
          discountedSales,
        };

        return updatedItem;
      })
    );
  };

  const voidByIds = async (ids?: any) => {
    return new Promise<any>((resolve, reject) => {
      try {
        const selectdIds = selectForVoid
          .filter((item) => item.delete_access).map((item: any) => item?.entry_id)
          ?.join(",");
        const endPoints = `DeleteTransactionHistory`;
        const deleteInvoice = ticket.dc ? "DC Invoice" : "Invoice";
        const payload = {
          entryid: `${selectdIds}`,
          remarks: notesVal,
          transaction_type:
            historyType === POSSTATUS.invoice ? deleteInvoice : historyType === POSSTATUS.pos ? "Order" : "Return",
          terminal: deviceName,
        };
        clientPostApi(
          endPoints,
          payload,
          async (onSuccess: any) => {
            setSelectForVoid([]);
            setPosHistoryDetail(null);
            setSelectedRowKey(null);
            setNotesVal(null);
            fetchAllHistory(entryType.invoiceType);

            if (connector.ownChat && historyType === POSSTATUS.invoice) {
              try {
                await ReturnProduct(
                  APIS.returnProduct,
                  selectdIds,
                  initialData,
                );
              } catch (err) {

              }
            }
            resolve(onSuccess);
          },
          (onError: any) => {
            console.log("onError", onError);
            reject(onError);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  const deleteHoldInvoice = async (ids?: any, type?: any) => {
    const selectdIds = selectForVoid
      .map((item: any) => item?.entry_id)
      ?.join(",");
    const endPoint = `${APIS.deleteHoldInvoice}?entryId=${selectdIds}&transactionType=${type}`;
    return await new Promise<void>((resolve, reject) => {
      clientGetApi(
        endPoint,
        null,
        (onSuccess: any) => {
          setSelectForVoid([]);
          setPosHistoryDetail(null);
          setSelectedRowKey(null);
          fetchAllHistory(entryType.holdType);
          // setRecentInvoiceList(onSuccess?.data);
          resolve();
          // setSalesmanList
        },
        (onError: any) => {
          console.log("onError", onError?.data);
          reject();
          // setSalesmanList(onError?.data);
        }
      );
    });
  };

  const getDeviceName = async () => {
    const serviceBaseUrl = process.env.NEXT_PUBLIC_PRINT_SERVICE_URL_HTTPS || 'http://localhost:5001/';
    const serviceUrl = `${serviceBaseUrl}api/print/devicename`;
    try {
      makeApiCall
        .get(serviceUrl)
        .then((response: any) => {
          Cookies.set("devicename", response?.data);
          printStore.setPrintService(response?.data);
        })
        .catch((error) => {
          Cookies.remove("devicename");
          printStore.setPrintService(null);
          console.log("error", error);
        });
    } catch (err) {

    }
  };

  const categoryList = async () => {
    try {
      const response = await makeApiCall.get(APIS.GetAllCategoryListDetails);

      if (response?.status === 200) {
        // adjust this based on your API response shape
        const categories = response.data?.data?.allCategory ?? [];

        // e.g. keep it in state
        setAllCategoryList(categories);
      }
    } catch (err) {
      console.error("GetAllCategoryListDetails error:", err);
    }
  };

  const getFieldColumns = async () => {
    try {
      const payloadValues = {
        roleId: userDetails?.roleId,
        pIndex: p_index,
        cIndex: c_index,
        gcIndex: gc_index,
      };
      const response = await makeApiCall.post(
        APIS.posTableColumns,
        payloadValues
      );

      if (response?.status == 200) {
        const getDataIndex = (columnName: any) => {
          const formated = columnName.replace(/\s+/g, "_");
          return columnName.toLowerCase() === "Invoice Number".toLowerCase()
            ? "entry_no"
            : columnName.toLowerCase() === "Date".toLowerCase()
              ? "entry_date_time"
              : columnName.toLowerCase() === "Location".toLowerCase()
                ? "branch_name"
                : columnName.toLowerCase() === "uom".toLowerCase()
                  ? "uomName"
                  : columnName.toLowerCase() === "rate".toLowerCase()
                    ? "salePrice"
                    : columnName.toLowerCase() === "amount".toLowerCase()
                      ? "discountedSales"
                      : formated.toLowerCase();
        };

        const history = response.data.data[0].group
          .filter((group: any) => group.groupName === "History")
          .flatMap((group: any) => {
            const getHistoryDataIndex = (columnName: any) => {
              const formated = columnName.replace(/\s+/g, "_");
              return columnName.toLowerCase() === "Invoice Number".toLowerCase()
                ? "entry_no"
                : columnName.toLowerCase() === "Date".toLowerCase()
                  ? "entry_date_time"
                  : columnName.toLowerCase() === "Location".toLowerCase()
                    ? "branch_name"
                    : formated.toLowerCase();
            };
            return group.fields
              .filter((field: any) => field.isRequired)
              .map((field: any) => ({
                id: field.columnId,
                title: field.columnName,
                dataIndex: getHistoryDataIndex(field.columnName),
                groupName: group.groupName,
                isVisible: field.isVisible,
                isMandatory: field.isMandatory,
                isFreezeLeft: field.isFreezeLeft,
                isFreezeRight: field.isFreezeRight,
                orderNo: field.orderNo,
                fixed: field.isFreezeRight
                  ? "right"
                  : field.isFreezeLeft
                    ? "left"
                    : undefined,
              }));
          });

        const create = response.data.data[0].group
          .filter((group: any) => group.groupName === "Create")
          .flatMap((group: any) => {
            const getCreateDataIndex = (columnName: any) => {
              const formated = columnName.replace(/\s+/g, "_");
              return columnName.toLowerCase() === "uom".toLowerCase()
                ? "uomName"
                : columnName.toLowerCase() === "rate".toLowerCase()
                  ? "salePrice"
                  : columnName.toLowerCase() === "amount".toLowerCase()
                    ? "discountedSales"
                    : columnName.toLowerCase() === "mrp value".toLowerCase()
                      ? "mrpValue"
                      : columnName.toLowerCase() === "mrp discount".toLowerCase()
                        ? "mrpDiscount"
                        : formated.toLowerCase();
            };
            return group.fields
              .filter((field: any) => field.isRequired)
              .map((field: any) => ({
                id: field.columnId,
                title: field.columnName,
                dataIndex: getCreateDataIndex(field.columnName),
                groupName: group.groupName,
                isVisible: field.isVisible,
                isMandatory: field.isMandatory,
                isFreezeLeft: field.isFreezeLeft,
                isFreezeRight: field.isFreezeRight,
                orderNo: field.orderNo,
                fixed: field.isFreezeRight
                  ? "right"
                  : field.isFreezeLeft
                    ? "left"
                    : undefined,
              }));
          });
        setCreateColumns(create ?? []);
        setHistoryColumns(history ?? []);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  React.useEffect(() => {
    if (posStatus === "tellerSummary" && deviceName) getTellerSummary();
    else if (posStatus === POSSTATUS.invoice && deviceName) getTellerSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posStatus, deviceName]);

  React.useEffect(() => {
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posStatus, deviceName]);

  React.useEffect(() => {
    getRecentInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posStatus, deviceName, selectedCustomer, ticket]);

  useEffect(() => {
    let count = 0;
    let amount = 0;
    catalogueProducts.map((item) => {
      count += item.qty;
      amount += item.mrp * item.qty;
    });
    setCatalogueTotal({
      itemCount: count,
      totalAmount: amount,
      totalCount: catalogueProducts.length,
    });
  }, [catalogueProducts]);

  useEffect(() => {
    const mopUpdate = mopDataList.map((data) => {
      if (data.mop.toLowerCase() === "card") {
        return {
          ...data,
          isProgress: isPayment.cardProgress,
          isPaid: isPayment.cardPaid,
          isFailed: isPayment.cardFailed
        }
      }
      if (data.mop.toLowerCase() === "credit") {
        return {
          ...data,
          isProgress: isPayment.creditProgress,
          isPaid: isPayment.creditPaid,
          isFailed: isPayment.creditFailed
        }
      }
      if (data.mop.toLowerCase() === "upi") {
        return {
          ...data,
          isProgress: isPayment.upiProgress,
          isPaid: isPayment.upiPaid,
          isFailed: isPayment.upiFailed
        }
      }
      return {
        ...data,
        isProgress: false,
        isPaid: false,
        isFailed: "",
      }
    });
    setMopDataList(mopUpdate);

  }, [isPayment]);


  React.useEffect(() => {
    if (userRights) {
      const ownChat = userRights?.globalSettings?.find((d: any) => d.key === "POS_OwnChatEnable")?.value;
      const pinelabs = userRights?.globalSettings?.find((d: any) => d.key === "POS_PinelabsEnable")?.value;
      const bik = userRights?.globalSettings?.find((d: any) => d.key === "POS_BIKEnable")?.value;
      const noDigit = userRights?.globalSettings?.find((d: any) => d.key === "MobileNoDigit")?.value;
      const redeemOtp = userRights?.globalSettings?.find((d: any) => d.key === "POS_RedeemOTP")?.value;
      const pointsWithoutPromo = userRights?.globalSettings?.find((d: any) => d.key === "POS_PointsWithOutPromo")?.value;
      const catGrouping = userRights?.globalSettings?.find((d: any) => d.key === "POS_Catalogue_Grouping")?.value;

      const isOwnChat = ownChat?.toLowerCase() === "true";
      const isPinelabs = pinelabs?.toLowerCase() === "true";
      const redeem = redeemOtp?.toLowerCase() === "true";
      const withoutpromo = pointsWithoutPromo?.toLowerCase() === "true";
      const isBik = bik?.toLowerCase() === "true";
      setConnector((prev) => ({ ...prev, ownChat: isOwnChat, pineLabs: isPinelabs, bik: isBik, redeemOtp: redeem, pointsWithoutPromo: withoutpromo }));
      setGlobalSetting((prev) => ({ ...prev, mobileNoDigit: parseInt(noDigit) || 10, catGrouping: catGrouping }));
    }
  }, [userRights]);

  // Set DC and against DC based on postype from initialData
  React.useEffect(() => {
    const postype = initialData?.postype;
    setTicket((prev) => ({
      ...prev,
      invoice: postype === 1,
      dc: postype === 2,
      isAgainstDC: postype === 3,
    }));
  }, [initialData?.postype]);

  React.useEffect(() => {
    getDeviceName();
  }, [segment]);



  React.useEffect(() => {
    if (isFetching) {
      const fetchData = async () => {
        await Promise.all([
          getUserSettings(),
          getMopData(),
          getCountryCode(),
          getInitialData(),
          getAllCustomer(),
          getDiscountMasterData(),
          getAllSalesman(),
          initalCustomerLoyalty(),
          getDenomination(),
          getDeviceName(),
          getFieldColumns(),
          categoryList(),
          // fetchCustomerHistory(),
        ]);
        setIsFetching(false);
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);


  const contextValues: POSContextProps = {
    APIS,
    barcodeCache,
    ticketCache,
    searchBarcode,
    setSearchBarcode,
    selectedRowKeys,
    setSelectedRowKeys,
    posDataList,
    setPosDataList,
    posStatus,
    setPosStatus,
    discountMasterDataList,
    setdiscountMasterDataList,
    salesmanList,
    setSalesmanList,
    mopDataList,
    setMopDataList,
    selectedMop,
    setSelectedMop,
    isTagCustomer,
    setIsTagCustomer,
    customerList,
    setCustomerList,
    selectedCustomer,
    setSelectedCustomer,
    footerCalculation,
    setFooterCalculation,
    getFooterTotal,
    _updateSalesPriceFromInput,
    onInvoiceOrderSubmit,
    mopValues,
    setMopValues,
    discountPopRate,
    setDiscountPopRate,
    dupDiscount,
    setDupDiscount,
    posHistoryData,
    setPosHistoryData,
    segment,
    setSegment,
    posHistoryDetail,
    setPosHistoryDetail,
    selectedViews,
    setSelectedViews,
    onSuccessModal,
    setOnSuccessModal,
    posHistoryFlag,
    setPosHistoryFlag,
    handleApplyDiscount,
    invoiceAppliedDiscc,
    setInvoiceAppliedDiscc,
    applyInvoiceLevelDiscount,
    handleRemoveInvoiceDiscount,
    saveNewCustomer,
    customerInitData,
    setCustomerInitData,
    tellerSummaryList,
    setTellerSummaryList,
    tellerSummaryCalculation,
    setTellerSummaryCalculation,
    denominationList,
    setDenominationList,
    isCopy,
    setIsCopy,
    isEdit,
    setIsEdit,
    isOrder,
    setIsOrder,
    selectedType,
    setSelectedType,
    dueDate,
    setDueDate,
    notesVal,
    setNotesVal,
    handleHold,
    paymentSuccess,
    setPaymentSuccess,
    recentInvoiceList,
    setRecentInvoiceList,
    historyDate,
    setHistoryDate,
    historyType,
    setHistoryType,
    selectedRowKey,
    setSelectedRowKey,
    tellerSummarySave,
    denominationSave,
    onClear,
    setSearchHistory,
    searchHistory,
    setPosEditData,
    posEditData,
    selectForVoid,
    setSelectForVoid,
    voidByIds,
    lastInvoiceBill,
    onApplyPromotion,
    checkOffers,
    saveCustomer,
    isConfirmTeller,
    setIsConfirmTeller,
    getCustomerBenefit,
    customerBenefitData,
    isFetching,
    setCustomerBenefitData,
    customerFocus,
    setCustomerFocus,
    paymentFocus,
    setPaymentFocus,
    openConfirm,
    setOpenConfirm,
    removeCustomerBenefitDiscount,
    deleteHoldInvoice,
    multiScanBarcodes,
    setMultiScanBarcodes,
    posError,
    setPosError,
    userRights,
    isCopySalesman,
    setIsCopySalesman,
    tagReturnData,
    posReturnData,
    setPosReturnData,
    setTagReturnData,
    checkOffer,
    setCheckOffer,
    searchProduct,
    setSearchProduct,
    searchedItems,
    setSearchedItems,
    isAdvSearch,
    setIsAdvSearch,
    catalogueProducts,
    setCatalogueProducts,
    catalogueTotal,
    setCatalogueTotal,
    makeOrderSave,
    setMakeOrderSave,
    onMakeOrderSave,
    pointsValue,
    setPointsValue,
    trialDate,
    setTrialDate,
    location,
    setLocation,
    initialData,
    pickupDateTime,
    setPickupDateTime,
    mtrValue,
    setMtrValue,
    shortcuts,
    returnLists,
    setReturnLists,
    historyColumns,
    createColumns,
    reference,
    setReference,
    tellerSummaryPrint,
    tourRefs,
    openTour,
    setOpenTour,
    redeemPoint,
    setRedeemPoint,
    setCurrentStep,
    currentStep,
    _handleQtyFromAction,
    coupons,
    setCoupons,
    applyCoupon,
    getDeviceName,
    fetchAllHistory,
    getAllCustomer,
    showPayment,
    setShowPayment,
    onValidateBarcode,
    setConnector,
    connector,
    getTellerSummary,
    tellerHistories,
    onPreviewTeller,
    isTellerHistory,
    setIsTellerHistory,
    tellerDate,
    setTellerDate,
    getTellerSummaryHistory,
    tellerSummaryHistory,
    globalSetting,
    countryCode,
    creditDetails,
    walletDetails,
    setCreditDetails,
    setWalletDetails,
    getCreditDetails,
    getWalletDetails,
    onCreditSave,
    showWallet,
    setShowWallet,
    getRecentInvoice,
    formik,
    mopEdit,
    setMopEdit,
    autoFocus,
    setAutoFocus,
    allCategoryList,
    setAllCategoryList,
    _callRedeemOtp,
    catGroup,
    setCatGroup,
    selectedProductDetail,
    setSelectedProductDetail,
    categoryData,
    setCategoryData,
    ticket,
    setTicket,
    ticketDataList,
    setTicketDataList,
    ticketHistoryData,
    setTicketHistoryData,
    _calculateDiscount,
    isProDiscount,
    setIsProDiscount,
    entryType
  };
  return (
    <POSContext.Provider value={contextValues}>{children}</POSContext.Provider>
  );
};

export const usePOSContext = <T,>(
  selector: (state: POSContextProps) => T
): T => {
  const context = useContext<POSContextProps | null>(POSContext);
  if (context === null) {
    throw new Error("usePOSContext must be used within a POSContextProvider");
  }
  return selector(context);
};
