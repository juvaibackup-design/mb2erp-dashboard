import { Flex, Checkbox } from "antd";

const formatDate = (value?: string) => {
  if (!value) return "";
  return value.split("T")[0];
};

export const TenantTableColumns: any[] = [
  {
    title: "",
    key: "expander",
    id: 1,
    width: "1%",
    isVisible: true,
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
    id: 2,
    width: "25%",
    isVisible: true,
  },
  {
    title: "Domain",
    dataIndex: "domain",
    key: "domain",
    id: 3,
    width: "20%",
    isVisible: true,
  },
  {
    title: "Industry",
    dataIndex: "industry",
    key: "industry",
    id: 4,
    width: "20%",
    isVisible: true,
  },
  {
    title: "Package Id",
    dataIndex: "packageId",
    key: "packageId",
    id: 5,
    width: "12%",
    isVisible: true,
  },
  {
    title: "Package Code",
    dataIndex: "packageCode",
    key: "packageCode",
    id: 6,
    width: "12%",
    isVisible: true,
  },

  // {
  //   title: "Plan",
  //   dataIndex: "plan",
  //   key: "plan",
  //   id: 5,
  //   width: "12%",
  //   isVisible: true,
  // },
  {
    title: "Mode",
    dataIndex: "mode",
    key: "mode",
    id: 6,
    width: "7%",
    isVisible: true,
  },
  {
    title: "DB Connections",
    dataIndex: "dbConnections",
    key: "dbConnections",
    id: 7,
    width: "12%",
    isVisible: true,
    align: "center",
  },
  // {
  //   title: "Exceptions",
  //   dataIndex: "exceptions",
  //   key: "exceptions",
  //   id: 7,
  //   width: "12%",
  //   isVisible: true,
  //   align: "center",
  // },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    id: 8,
    width: "12%",
    isVisible: true,
    render: (value?: string) => formatDate(value),
    },
  {
    title: "End Date",
    dataIndex: "expiryDate",
    key: "expiryDate",
    id: 9,
    width: "12%",
    isVisible: true,
    render: (value?: string) => formatDate(value),
  },
  {
    title: "Renewal Date",
    dataIndex: "renewalDate",
    key: "renewalDate",
    id: 10,
    width: "12%",
    isVisible: true,
    render: (value?: string) => formatDate(value),
  },
  {
    title: "Payment Status",
    dataIndex: "paymentStatus",
    key: "paymentStatus",
    id: 11,
    width: "12%",
    isVisible: true,
  },
  {
    title: "Last Paid Date",
    dataIndex: "lastPaidDate",
    key: "lastPaidDate",
    id: 12,
    width: "12%",
    isVisible: true,
    render: (value?: string) => formatDate(value),
  },
  {
    title: "Mode of Payment",
    dataIndex: "modeOfPayment",
    key: "modeOfPayment",
        id: 13,
    width: "12%",
    isVisible: true,
  },
  {
    title: "Account Manager",
    dataIndex: "accountManager",
    key: "accountManager",
    id: 14,
    width: "12%",
    isVisible: true,
  },
  {
    title: "SPOC",
    dataIndex: "spoc",
    key: "spoc",
        id: 15,
    width: "12%",
    isVisible: true,
  },
  {
    title: "No. of Users",
    dataIndex: "noOfUsers",
    key: "noOfUsers",
       id: 16,
    width: "12%",
    isVisible: true,
    align: "center",
  },
    {
    title: "No. of Sites",
    dataIndex: "noOfSites",
    key: "noOfSites",
        id: 17,
    width: "12%",
    isVisible: true,
    align: "center",
  },
  {
    title: "Extinct",
    dataIndex: "isActive",
    key: "isActive",
    id: 18,
    width: "20%",
    isVisible: true,
  },
];

export const branchTableColumns: any[] = [
  {
    title: "Branch Name",
    dataIndex: "branchName",
    key: "branchName",
  },
  {
    title: "Alias Name",
    dataIndex: "aliasName",
    key: "aliasName",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Contact Person",
    dataIndex: "contactPerson",
    key: "contactPerson",
  },
  {
    title: "Phone number",
    dataIndex: "primaryNumber",
    key: "primaryNumber",
  },
  {
    title: "City",
    dataIndex: "city",
    key: "city",
  },
  {
    title: "Financial Year",
    dataIndex: "financialYear",
    key: "financialYear",
  },
  {
    title: "Extinct",
    dataIndex: "isActive",
    key: "isActive",
  },
];

export const ModalTableColumns: any[] = [
  // {
  //   title: "Id",
  //   dataIndex: "id",
  //   key: "id",
  //   width: "7%",
  // },
  {
    title: "Storage",
    dataIndex: "attributeKey",
    key: "attributeKey",
    width: "20%",
  },
  {
    title: "Attribute Value",
    dataIndex: "attributeValue",
    key: "attributeValue",
  },
  // Commented out because it is not required. If uncommented the
  // the functionality of disabling DBs will render and work.
  // {
  //   title: "Is Active",
  //   dataIndex: "isActive",
  //   key: "isActive",
  //   width: "12%",
  // },
{
  title: "Total Tenants",
  dataIndex: "totalTenants",
  key: "totalTenants",
  align: "center",
},
{
  title: "Storage Used",
  dataIndex: "storageUsed",
  key: "storageUsed",
  align: "center",
},
];

export const dbTypes: Record<string, string> = {
  transaction_conn_str: "Transaction DB",
  exception_conn_str: "Exception DB",
  audit_conn_str: "Audit DB",
  file_storage_location: "File Storage",
  report_conn_str: "Report DB",
};
