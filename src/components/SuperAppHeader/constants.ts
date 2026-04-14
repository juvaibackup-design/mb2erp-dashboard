const formPaths = {
  "Discount Setup": ``,
  "Tax Master": ``,
  "Site Creation": ``,
  "Access Privilege": ``,
  Employee: ``,
  User: ``,
  Order: {
    PO: (id: number, status: string) =>
      `/dashboard/procurement-order/${id}?trSession=${status}`,
  },
  Receive: {
    GRN: (id: number, status: string) =>
      `/dashboard/procurement-receive/${id}?trSession=${id}`,
  },
  Return: {
    GRT: (id: number, status: string) =>
      `/dashboard/procurement-return/${id}?trSession=${id}`,
  },
  Invoice: {
    PI: (id: number, status: string) => `/dashboard/procurement-invoice/${id}`,
  },
  "Business partner": ``,
  Charges: ``,
  Terms: ``,
  "Margin Rule": ``,
  "Print Barcode": ``,
  Category: ``,
  "Create Group": ``,
  "Price Range": ``,
  "Price List": ``,
  Logistics: {
    "LR Inwards": (id: number, status: string) =>
      `/dashboard/inventory-logistics/inward?id=${id}`,
    "LR Outwards": (id: number, status: string) =>
      `/dashboard/inventory-logistics/outward?id=${id}`,
    GateEntry: (id: number, status: string) =>
      `/dashboard/inventory-logistics/gateEntry?id=${id}`,
  },
  "Stock Audit": ``,
  "Manage Stock": {
    "Miscellaneous Stock": (id: number, status: string) =>
      `/dashboard/inventory-managestock/bundle-creation?id=${id}`,
    "Rate Change": (id: number, status: string) =>
      `/dashboard/inventory-managestock/rate-change?id=${id}`,
    "Inter Stock Transfer Out": (id: number, status: string) =>
      `/dashboard/inventory-managestock/inter-stock-out?id=${id}`,
    "Inter Stock Transfer In": (id: number, status: string) =>
      `/dashboard/inventory-managestock/inter-stock-in?transactionType=default&id=${id}`,
    "Bundle Creation": (id: number, status: string) =>
      `/dashboard/inventory-managestock/bundle-creation?id=${id}`,
  },
  POS: ``,
  "Loyalty Card": ``,
  Promotion: ``,
  Customer: ``,
  "Numbering Scheme": ``,
  "Sales Incentive": ``,
  Salesman: ``,
  "Delivery Challan": {
    DC: (id: number, status: string) =>
      `/dashboard/sales-deliverychallan/${id}?trSession=default`,
  },
  "Sales Partner": ``,
  "Sales Order": {
    SO: (id: number) => `/dashboard/sales-salesorder/${id}?trSession=${id}`,
  },
  Quote: {
    SQ: (id: number, status: string) =>
      `/dashboard/sales-quote/${id}?trSession=${status}`,
  },
  "Collection Refund": ``,
  "Sales Invoice": {
    SI: (id: number, status: string) =>
      `/dashboard/sales-salesinvoice/${id}?trSession=default`,
  },
  "Aging Master": ``,
};
export default formPaths;
