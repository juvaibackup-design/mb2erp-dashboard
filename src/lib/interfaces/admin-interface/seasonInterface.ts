import { boolean, date } from "yup";

export interface season {
  sno: "number";
  season: "string";
  financialYear: "boolean";
  fromDate: "boolean";
  toDate: "boolean";
  isActive: boolean;
}
