"use client";

import makeApiCall from "@/lib/helpers/apiHandlers/api";
import {
  applyDecimal,
  applyPosFinalAmount,
} from "@/lib/helpers/utilityHelpers";

export const getPosBillSynchPayload = (
  saveBill: any,
  contextData: {
    footerCalculation: any;
    posDataList: any[];
    base64: any;
    branchName: any;
    selectedCustomer: any;
    initialData: any;
  }
) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const { entryId, billNumber, billDate } = saveBill;
      const { ownchatLists } = contextData.initialData;
      const { authToken, apiUrl } =
        ownchatLists.find((d: any) => d.apiType === "1") ?? {};

      // const discSales: any =
      //   Number(applyPosFinalAmount(contextData.footerCalculation.grossSales)) -
      //   Number(contextData.footerCalculation.discount);

      const billItems = contextData.posDataList.map((data) => {
        const discAmt = data.discount + data.promoDiscValue;

        return {
          BILL_NUMBER: billNumber,
          BILL_DATE: billDate,
          ENTRYORDERID: entryId ?? "",
          STOCK_NO: "",
          DESCRIPTION: data.productName,
          QUANTITY: data.scanUnitQty,
          RATE: data.rate,
          AMOUNT: applyDecimal(data.salePrice),
          SALEDISCAMT: applyDecimal(discAmt),
        };
      });

      const data = {
        invoice_url: contextData.base64 ?? "",
        customer: {
          MOBILE: contextData.selectedCustomer?.mobileNo
            ? `${contextData.selectedCustomer?.mobileNo}`
            : "",
          EMAIL: contextData.selectedCustomer?.email ?? "",
          NAME: contextData.selectedCustomer?.displayName ?? "",
          BIRTHDAY: contextData.selectedCustomer?.dob ?? "",
          ANNIVERSARY: contextData.selectedCustomer?.dom ?? "",
          LOCATION: contextData.branchName ?? "",
        },
        Parent: {
          BILL_NUMBER: billNumber,
          BILL_DATE: billDate,
          GROSS_AMOUNT: applyPosFinalAmount(
            contextData.footerCalculation?.grossSales,
            true
          ),
          BILL_AMOUNT:
            applyPosFinalAmount(contextData.footerCalculation.totAmt, true) ??
            "",
          bill_header_discount_value:
            Number(contextData.footerCalculation.discount) ?? "",
        },
        bill_lineitems: billItems,
        apiUrl: apiUrl,
        apiToken: authToken,
      };

      resolve(data);
    } catch (error) {
      reject(0);
    }
  });
};

export const getLoyaltyPointPayload = (
  selectedCustomer: any,
  initialData: any
) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const { ownchatLists } = initialData;
      const { authToken, apiUrl } =
        ownchatLists.find((d: any) => d.apiType === "2") ?? {};

      const data = {
        mobileNo: selectedCustomer?.mobileNo
          ? `${selectedCustomer?.mobileNo}`
          : "",
        apiUrl: apiUrl,
        apiToken: authToken,
      };

      resolve(data);
    } catch (error) {
      reject(0);
    }
  });
};

export const checkRedeemPayload = (
  selectedCustomer: any,
  redeemPoint: any,
  initialData: any
) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const { ownchatLists } = initialData;
      const { authToken, apiUrl } =
        ownchatLists.find((d: any) => d.apiType === "3") ?? {};

      const data = {
        name: selectedCustomer?.displayName ?? "",
        mobileNo: selectedCustomer?.mobileNo
          ? `${selectedCustomer.mobileNo}`
          : "",
        redeemPoint: redeemPoint ?? 0,
        apiUrl: apiUrl,
        apiToken: authToken,
      };

      resolve(data);
    } catch (error) {
      reject(0);
    }
  });
};

export const sendOtpPayload = (
  selectedCustomer: any,
  otpType: any,
  otp: any,
  initialData: any
) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const { ownchatLists } = initialData;
      const apiType = otpType === "whatsapp" ? "4" : "5";
      const { authToken, apiUrl } =
        ownchatLists.find((d: any) => d.apiType === apiType) ?? {};

      let data: any;
      if (otpType === "whatsapp") {
        data = {
          name: selectedCustomer?.displayName ?? "",
          mobileNo: selectedCustomer?.mobileNo
            ? `${selectedCustomer?.mobileNo}`
            : "",
          otp: otp,
          otpType: otpType,
          apiUrl: apiUrl,
          apiToken: authToken,
        };
      } else {
        data = {
          name: selectedCustomer?.mobileNo ?? "",
          mobileNo: selectedCustomer?.mobileNo
            ? `${selectedCustomer?.mobileNo}`
            : "",
          otp: otp,
          otpType: otpType,
          apiUrl: apiUrl,
          apiToken: authToken,
        };
      }
      resolve(data);
    } catch (error) {
      reject(0);
    }
  });
};

export const redeemPointsPayload = (
  saveBill: any,
  selectedCustomer: any,
  redeemPoint: any,
  initialData: any
) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const { billNumber } = saveBill;
      const { ownchatLists } = initialData;
      const { authToken, apiUrl } =
        ownchatLists.find((d: any) => d.apiType === "6") ?? {};

      const data = {
        mobileNo: selectedCustomer?.mobileNo
          ? `91${selectedCustomer?.mobileNo}`
          : "",
        redeemPoint: redeemPoint ?? 0,
        billNumber: billNumber ?? "",
        apiUrl: apiUrl,
        apiToken: authToken,
      };

      resolve(data);
    } catch (error) {
      reject(0);
    }
  });
};

export const returnProductPayload = (saveBill: any, initialData: any) => {
  return new Promise<any>((resolve, reject) => {
    try {
      // const { billNumber } = saveBill;
      const { ownchatLists } = initialData;
      const { authToken, apiUrl } =
        ownchatLists.find((d: any) => d.apiType === "7") ?? {};

      const data = {
        entryIds: saveBill ?? "",
        apiUrl: apiUrl,
        apiToken: authToken,
      };

      resolve(data);
    } catch (error) {
      reject(0);
    }
  });
};

export const createCustomerPayload = (
  saveBill: any,
  base64: any,
  selectedCustomer: any,
  footerCalculation: any,
  mop: any,
  currency: any
) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const { billNumber, entryId, billDate } = saveBill;
      const data = {
        invoiceUrl: base64 ?? "",
        name: selectedCustomer?.displayName
          ? selectedCustomer?.displayName
          : "",
        mobileNo: selectedCustomer?.mobileNo
          ? `+91${selectedCustomer?.mobileNo}`
          : "",
        email: selectedCustomer?.email ? selectedCustomer?.email : "",
        orderValue: applyPosFinalAmount(footerCalculation.totAmt, true) ?? "",
        customerId: selectedCustomer?.id ? selectedCustomer?.id : "",
        orderId: entryId,
        orderName: billNumber ?? "",
        orderDate: billDate ?? "",
        currency: currency ?? "",
        type: mop ?? "",
        totalNoOfItems: footerCalculation.totQty ?? "",
        customerSource: "Offline store",
      };
      resolve(data);
    } catch (error) {
      reject(0);
    }
  });
};

// POS BILL SYNCH

const PostBillSync = async (
  apiUrl: any,
  saveBill: any,
  contextData: {
    footerCalculation: any;
    posDataList: any[];
    base64: any;
    branchName: any;
    selectedCustomer: any;
    initialData: any;
  }
) => {
  return new Promise<any>((resolve, reject) => {
    getPosBillSynchPayload(saveBill, contextData).then(async (payloadData) => {
      makeApiCall
        .post(apiUrl, payloadData)
        .then(async (response: any) => {
          if (response?.status === 200) {
            resolve(response);
          }
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  });
};

//GET LOYATLY POINTS
const GetLoyaltyPoints = async (
  apiUrl: any,
  selectedCustomer: any,
  initialData: any
) => {
  return new Promise<any>((resolve, reject) => {
    getLoyaltyPointPayload(selectedCustomer, initialData).then(
      async (payloadData) => {
        makeApiCall
          .post(apiUrl, payloadData)
          .then(async (response: any) => {
            if (response?.status === 200) {
              resolve(response);
            }
          })
          .catch((error) => {
            console.log("error", error);
            reject(error);
          });
      }
    );
  });
};

//CHECK REDEEM
const CheckRedeem = async (
  apiUrl: any,
  selectedCustomer: any,
  redeemPoint: any,
  initialData: any
) => {
  return new Promise<any>((resolve, reject) => {
    checkRedeemPayload(selectedCustomer, redeemPoint, initialData).then(
      async (payloadData) => {
        makeApiCall
          .post(apiUrl, payloadData)
          .then(async (response: any) => {
            if (response?.status === 200) {
              resolve(response);
            }
          })
          .catch((error) => {
            console.log("error", error);
            reject(error);
          });
      }
    );
  });
};

//Send OTP
const SendOTP = async (
  apiUrl: any,
  selectedCustomer: any,
  otpType: any,
  otp: any,
  initialData: any
) => {
  return new Promise<any>((resolve, reject) => {
    sendOtpPayload(selectedCustomer, otpType, otp, initialData).then(
      async (payloadData) => {
        makeApiCall
          .post(apiUrl, payloadData)
          .then(async (response: any) => {
            if (response?.status === 200) {
              resolve(response);
            }
          })
          .catch((error) => {
            console.log("error", error);
            reject(error);
          });
      }
    );
  });
};

//Confirmation Redeemed points
const RedeemPoints = async (
  apiUrl: any,
  saveBill: any,
  selectedCustomer: any,
  redeemPoint: any,
  initialData: any
) => {
  return new Promise<any>((resolve, reject) => {
    redeemPointsPayload(
      saveBill,
      selectedCustomer,
      redeemPoint,
      initialData
    ).then(async (payloadData) => {
      makeApiCall
        .post(apiUrl, payloadData)
        .then(async (response: any) => {
          if (response?.status === 200) {
            resolve(response);
          }
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  });
};

//Confirmation Redeemed points
const ReturnProduct = async (apiUrl: any, saveBill: any, initialData: any) => {
  return new Promise<any>((resolve, reject) => {
    returnProductPayload(saveBill, initialData).then(async (payloadData) => {
      makeApiCall
        .post(apiUrl, payloadData)
        .then(async (response: any) => {
          if (response?.status === 200) {
            resolve(response);
          }
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  });
};

//BIK Integrations

const CreateCustomer = async (
  apiUrl: any,
  saveBill: any,
  base64: any,
  selectedCustomer: any,
  footerCalculation: any,
  mop: any,
  currency: any
) => {
  return new Promise<any>((resolve, reject) => {
    createCustomerPayload(
      saveBill,
      base64,
      selectedCustomer,
      footerCalculation,
      mop,
      currency
    ).then(async (payloadData) => {
      makeApiCall
        .post(apiUrl, payloadData)
        .then(async (response: any) => {
          if (response?.status === 200) {
            resolve(response);
          }
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  });
};

export {
  PostBillSync,
  GetLoyaltyPoints,
  CheckRedeem,
  SendOTP,
  RedeemPoints,
  CreateCustomer,
  ReturnProduct,
};
