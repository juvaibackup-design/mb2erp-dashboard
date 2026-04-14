const scripts: any[] = [
  {
    label: "Greet",
    key: "0",
    content: "Welcome to Icube",
  },
  {
    label: "Wait",
    key: "1",
    content: "Kindly wait all out agents are busy",
  },
  {
    label: "Under process",
    key: "2",
    content: "Your issue is actively being processed",
  },
  {
    label: "Done",
    key: "3",
    content: "Your issue is fixed, kindly refresh to allow changes to affect",
  },
];

const languages: any[] = [
  { label: "Tamil", value: "ta" },
  { label: "English", value: "en" },
  { label: "Arabic", value: "ar" },
];

const filterOptions = [
  {
    label: "Retail Customer",
    value: "retailCustomer",
  },
  {
    label: "Sales Customer",
    value: "salesCustomer",
  },
  {
    label: "Supplier",
    value: "supplier",
  },
  {
    label: "Transporter",
    value: "transporter",
  },
  {
    label: "Agent",
    value: "agent",
  },
];

export { scripts, languages, filterOptions };
