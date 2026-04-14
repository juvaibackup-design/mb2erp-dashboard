export const convertTo12Hour = (time24: string) => {
  // Split the time into hours, minutes, and seconds
  const [hours, minutes, seconds] = time24.split(":");
  // Convert hours from string to number
  let hours12 = parseInt(hours, 10);
  // Determine AM or PM suffix
  const ampm = hours12 >= 12 ? "PM" : "AM";
  // Adjust hours for 12-hour format (e.g., 13 becomes 1, 0 becomes 12)
  hours12 = hours12 % 12 || 12; // Convert '0' or '12' to '12'
  // Return the time in 12-hour format with AM/PM
  return `${hours12}:${minutes} ${ampm}`;
};
