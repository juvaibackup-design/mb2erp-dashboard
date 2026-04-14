export const formatDateString = () => {
  const inputDate = new Date();
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  const hours = String(inputDate.getHours()).padStart(2, "0");
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");
  const seconds = String(inputDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const formatDateAndTime = () => {
  const inputDate = new Date();
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  const hours = String(inputDate.getHours()).padStart(2, "0");
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");
  const seconds = String(inputDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatDateOnly = () => {
  const inputDate = new Date();
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  const hours = String(inputDate.getHours()).padStart(2, "0");
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");
  const seconds = String(inputDate.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}`;
  // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const tellerDateFormat = (date: Date | string) => {
  const inputDate = new Date(date);
  // Get year, day, and month
  const year = inputDate.getFullYear();
  const day = inputDate.getDate();

  // Format month as short text (e.g., Jan, Feb)
  const month = inputDate.toLocaleString("default", { month: "short" });

  // Get hours, minutes, and format the time as AM/PM
  let hours = inputDate.getHours();
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Return the formatted string
  return `${day} ${month} ${year} | ${hours}:${minutes} ${ampm}`;
};

export const convertToISO = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate(); // Extract the day
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()]; // Extract the month name
  const hours24 = date.getHours(); // Extract the hour in 24-hour format
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Extract and format minutes

  // Convert 24-hour format to 12-hour format and determine AM/PM
  const hours12 = hours24 % 12 || 12; // Handle 0 as 12
  const meridian = hours24 >= 12 ? "PM" : "AM";

  return `${day} ${month} | ${hours12}:${minutes}${meridian}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString); // Parse the date string
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
