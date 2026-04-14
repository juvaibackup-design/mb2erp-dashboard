import { useUserStore } from "@/store/userInfo/store";
import { GetProp, UploadProps } from "antd";
import dayjs from "dayjs";
import Cookies from "js-cookie";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const calculatePercentageFromPixelsWidth = (pixels: number) => {
  const windowWidth = window.innerWidth;
  const percentage = (pixels / windowWidth) * 100;
  return `${percentage}%`;
};

const calculatePercentageFromPixelsHeight = (pixels: number): string => {
  const windowHeight = window.innerHeight;
  const percentage = (pixels / windowHeight) * 100;
  return `${percentage}%`;
};

const replaceKeys = (data: any, replaceKeyObj: any) => {
  return Object.keys(data).reduce((acc: any, key: any) => {
    if (key in replaceKeyObj) {
      acc[replaceKeyObj[key]] = data[key];
    }
    return acc;
  }, {});
};

const getLoggedUserDateFormate = () => {
  const loggedUser = getUserDetails();
  const ludf = loggedUser?.dateFormat ?? "DD-MM-YYYY";
  return ludf;
};

const formateDateDependLoggedUser = (
  date: string | number | Date | dayjs.Dayjs | null | undefined
) => {
  const loggedUser = getUserDetails();
  const ludf = loggedUser?.dateFormat ?? "DD-MM-YYYY";

  switch (ludf) {
    case "DD-MM-YYYY":
      return formatDatewithType(date, 6);
    case "MM-DD-YYYY":
      return formatDatewithType(date, 5);
    case "YYYY-MM-DD":
      return formatDatewithType(date, 1);

    default:
      return formatDatewithType(date, 6);
  }
};

const formatDatewithType = (
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  formatIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 6
) => {
  // Parse the input date using Day.js
  let parsedDate = dayjs(date);

  const dateFormats = [
    "YYYY-MM-DDTHH:mm:ssZ", // ISO 8601
    "YYYY-MM-DD", // ISO 8601 date only
    "MM/DD/YYYY", // US format
    "DD/MM/YYYY", // UK format
    "MMMM DD, YYYY", // Full month name, day, year
    "MM-DD-YYYY", // US format with dashes
    "DD-MM-YYYY", // UK format with dashes
  ];

  // Check if the parsed date is valid
  if (parsedDate.isValid()) {
    // Format the parsed date into the desired output format
    return parsedDate.format(dateFormats[formatIndex]);
  } else {
    return "Invalid date";
  }
};

const NormalDateFormat = (input: any) => {
  let date: any;

  // Check if input is already a Date object
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {
    // Check if the input is in ISO 8601 format
    if (input.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
      date = new Date(input); // If in ISO 8601 format, directly parse
    } else if (input.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // If in "YYYY-MM-DD" format, parse and add time to avoid timezone issues
      date = new Date(input + "T00:00:00");
    } else {
      // throw new Error("Invalid date string");
    }
  } else {
    // throw new Error("Invalid input");
  }
  // Extract day, month, and year
  let day: any = date.getDate();
  let month: any = date.getMonth() + 1; // Months are zero-based
  let year = date.getFullYear();

  // Add leading zero if day or month is less than 10
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  console.log("NormalDateFormat::date", day);
  console.log("NormalDateFormat::date", month);
  // Format the date as DD-MM-YYYY
  return `${day}-${month}-${year}`;
};

const getUserDetails = () => {
  const getUserDetails = Cookies.get("userDetails");
  const userDetails = getUserDetails && JSON.parse(`${getUserDetails}`);
  const uData = userDetails?.branchList?.[0];
  // const uData = userDetails?.initialData?.userInfo?.branchList?.[0];
  return uData;
};

const getSuperUserDetails = () => {
  const getSuperUserDetails = Cookies.get("superUserDetails");
  const superUserDetails =
    getSuperUserDetails && JSON.parse(`${getSuperUserDetails}`);

  return superUserDetails;
};


/***
 * @Function autoRoundOff
 * !For Forms Input
 */
const autoRoundOff = (event: any, formik?: any, fieldName?: any) => {
  const userDetail = getUserDetails();
  const { decimals = 2 } = userDetail;

  let { value } = event.target;

  if (!Boolean(value)) return false;

  const parts = value.split(".");
  if (parts.length === 2) {
    while (parts[1].length < decimals) {
      parts[1] += "0";
    }
    value = `${parts[0]}.${parts[1]}`;
  } else if (parts.length === 1 && decimals > 0) {
    value += "." + "0".repeat(decimals);
  }
  typeof formik != "undefined" && formik.setFieldValue(`${fieldName}`, value);
};

/***
 * @Function restrictDecimal
 * !For Forms Input
 */
const restrictDecimal = (event: any, formik?: any, fieldName?: any) => {
  const userDetail = getUserDetails();
  const { decimals = 2 } = userDetail;
  const { value } = event.target;
  const regEx = new RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`);

  if (regEx.test(value)) {
    typeof formik != "undefined" && formik.setFieldValue(`${fieldName}`, value);
  } else if (value === "") {
    typeof formik != "undefined" && formik.setFieldValue(`${fieldName}`, value);
  }
};

/***
 * @Function applyRoundOffWithDecimal
 * ! apply roundoff with decimal depends on logged user
 */
const applyRoundOffWithDecimal = (originalNumber: any, useRound?: boolean) => {
  const userData = getUserDetails();

  const isRoundOff = userData?.isRoundOff ?? true;
  const toDecimal = userData?.decimals || 0;

  if (!isRoundOff && useRound) {
    let newNumber = originalNumber;
    return newNumber;
  }

  let newNumber = originalNumber;
  const roundOffVal = userData?.roundOff ?? null;
  let factor = Math.pow(10, toDecimal);
  console.log("factor", factor);
  // if (roundOffVal == "upper") {
  //   let ceilVal = Math.ceil(newNumber);
  //   newNumber = (ceilVal * factor) / factor;
  // } else if (roundOffVal == "lower") {
  //   let floorVal = Math.floor(newNumber);
  //   newNumber = newNumber = (floorVal * factor) / factor;
  // } else if (toDecimal > 0) {
  //   // Standard rounding to the specified number of decimal places
  //   newNumber = Math.round(newNumber * factor) / factor;
  // }

  let roundedVal;
  const val = (newNumber * factor) / factor;
  console.log("roundOffVal", roundOffVal, val);
  if (roundOffVal == "upper") {
    // if (roundOffVal <= 5) {
    roundedVal = Math.ceil(val);
  } else {
    roundedVal = Math.floor(val);
  }

  return roundedVal.toFixed(toDecimal ?? 0);

  // console.log(roundedVal.toFixed(toDecimal));

  // return newNumber.toFixed(toDecimal ?? 0);
};

const applyPosFinalAmount = (originalNumber: any, useRound?: boolean) => {
  const userData = getUserDetails();
  const isRoundOff = userData?.isRoundOff ?? true;


  if (!isRoundOff &&useRound&& originalNumber) {
    const toDecimal = userData?.decimals || 0;
    return originalNumber.toFixed(toDecimal ?? 0);
  }

  const invoiceValue = Math.round(originalNumber);
  const toDecimal = userData?.decimals || 0;
  return invoiceValue.toFixed(toDecimal ?? 0);
};

const getRoundOffAmount = (
  originalNumber: any,
  sign?: boolean,
  useRound?: boolean
) => {
  const userData = getUserDetails();
  const isRoundOff = userData?.isRoundOff ?? true;

  if (!isRoundOff && useRound) return 0;

  const invoiceValue = Math.round(originalNumber);
  const toDecimal = userData?.decimals || 0;
  const roundoff = parseFloat(
    (invoiceValue - originalNumber).toFixed(toDecimal ?? 0)
  );
  const absoluteRoundoff = Math.abs(roundoff);
  const signSymbol = invoiceValue <= originalNumber ? "-" : "+";
  if (sign) {
    return roundoff !== 0
      ? `${signSymbol}${userData?.symbol || "¥"}${absoluteRoundoff}`
      : userData?.symbol + 0;
  }

  return roundoff;
};

const applyDecimal = (val: any) => {
  const userData = getUserDetails();
  const toDecimal = userData?.decimals ?? 0;
  let factor = Math.pow(10, toDecimal);
  const newVal = (val * factor) / factor;
  return newVal.toFixed(toDecimal);
};

function truncFixed(num: number | string, to = 0) {
  let str = num.toString();
  let result = "";
  let i = 0,
    j = -1;

  // Find the index of the decimal point
  for (i = 0; i < str.length; i++) {
    if (str[i] === ".") {
      j = i;
      break;
    }
  }

  // Append the integer part
  for (i = 0; i < str.length; i++) {
    if (str[i] !== ".") {
      result += str[i];
    } else {
      result += str[i];
      break;
    }
  }

  // Append the decimal part, up to the desired number of decimal places
  if (j !== -1) {
    result += str.slice(j + 1, j + 1 + to);
  }

  return result;
}

const convertBlobToBase64 = (blob: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export {
  replaceKeys,
  restrictDecimal,
  autoRoundOff,
  applyPosFinalAmount,
  getUserDetails,
  getSuperUserDetails,
  formateDateDependLoggedUser,
  formatDatewithType,
  NormalDateFormat,
  calculatePercentageFromPixelsWidth as PerToPix,
  calculatePercentageFromPixelsHeight as HPixToPer,
  applyRoundOffWithDecimal,
  getRoundOffAmount,
  truncFixed,
  applyDecimal,
  getLoggedUserDateFormate,
  convertBlobToBase64,
};

const variables123: Record<any, string> = {
  a: "r",
  b: "e",
  c: ")",
  d: "g",
  e: "7",
  f: "m",
  g: "m",
  h: "r",
  i: "a",
  j: ",",
  k: "l",
  l: "t",
  m: "o",
  n: "g",
  o: "a",
  p: "d",
  q: "g",
  r: "y",
  s: "x",
  t: "5",
  u: "g",
  v: "h",
  w: "e",
  x: "j",
  y: "<",
  z: "u",
};

export function encrypt(payload: string) {
  return Array.from(payload)
    .map((char) => String(Number(char.charCodeAt(0)) - 30).padStart(2, "0"))
    .join("");
}

export function decrypt(cipher: string) {
  let array = [];
  for (let i = 0; i < cipher.length; i = i + 2) {
    const char = String.fromCharCode(Number(cipher.slice(i, i + 2)) + 30);
    array.push(char);
  }
  return array.join("");
}

export function encrypt1(text: string, encryptKey: string) {
  // XOR the text with the encryption key
  const xorResult = xorEncrypt(text, encryptKey);

  // Convert the XOR result to Base64
  const base64Xor = btoa(String.fromCharCode(...Array.from(xorResult)));

  return base64Xor; // Only a single Base64 encoding
}

export function decrypt1(hash: string, decryptKey: string) {
  if (!hash) return "";
  try {
    // Decode the Base64 string into a byte array
    const hashBytes = atob(hash)
      .split("")
      .map((char) => char.charCodeAt(0));

    // Use the XOR function to decrypt
    const resultBytes = xorEncrypt(
      String.fromCharCode(...hashBytes),
      decryptKey
    );

    // Convert the result bytes back to a string
    return new TextDecoder().decode(Uint8Array.from(resultBytes));
  } catch (error) {
    console.log(error);
    return hash;
    // throw error;
  }
}

function xorEncrypt(text: string, encryptKey: string) {
  // Convert the text and key to ASCII byte arrays
  const textBytes = new TextEncoder().encode(text);
  const keyBytes = new TextEncoder().encode(encryptKey);

  // XOR each byte with the corresponding key byte
  const resultBytes = textBytes.map(
    (byte, index) => byte ^ keyBytes[index % keyBytes.length]
  );

  return resultBytes;
}

type CapsTypes = "First" | "Whole" | "Whole alphabets";

export function capitalize(
  sentence: string,
  type: CapsTypes = "Whole"
): string {
  if (type == "First")
    return (
      sentence.charAt(0).toUpperCase() + sentence.substring(1).toLowerCase()
    );
  else if (type == "Whole") {
    return sentence
      .split(" ")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
      )
      .join(" ");
  } else if (type == "Whole alphabets")
    return sentence
      .split(" ")
      .map((word: string) => {
        const index = word.search(/[a-zA-Z]/);
        return (
          word.substring(0, index).toLowerCase() +
          word.charAt(index).toUpperCase() +
          word.substring(index + 1).toLowerCase()
        );
      })
      .join(" ");
  return "";
}

export function create_options(
  data: any,
  label_name: string,
  value_name: string,
  leave_rest: boolean = false
) {
  return data?.map((datum: any) => ({
    label: datum[label_name],
    value: datum[value_name],
    ...(leave_rest ? datum : {}),
  }));
}

export function snakeToCamel(text: string) {
  const array = text.split("_");
  return (
    array
      ?.slice(1)
      ?.map((item: string) => item.charAt(0)?.toUpperCase() + item.slice(1))
      .join("") ?? text
  );
}

export function getFormName(
  userDetails: any,
  p_index: number,
  c_index: number,
  gc_index: number = 0
) {
  const accessList = userDetails?.accessPrivilegeList || [];
  const foundAccess = accessList.find(
    (item: any) => item.p_index == p_index && item.c_index == c_index
  );
  return foundAccess?.form_name;
}

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1]; // remove 'data:image/...;base64,' or similar
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });

export const base64ToFile = (
  base64: string,
  fileName: string,
  mimeType: string
): File => {
  const byteString = atob(base64); // Decode base64 string
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([byteArray], { type: mimeType });
  const file = new File([blob], fileName, { type: mimeType });

  return file; // Same as originFileObj
};

export const getVideoMeta = (
  file: File
): Promise<{ thumbnail: string; duration: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");

    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    video.onloadedmetadata = () => {
      const duration = video.duration;

      // Seek to 1 second (or 0 if shorter)
      const seekTime = Math.min(1, duration / 2);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas not supported");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL("image/png");
      resolve({ thumbnail, duration: video.duration });
    };

    video.onerror = (err) => {
      reject("Video load error");
    };
  });
};
