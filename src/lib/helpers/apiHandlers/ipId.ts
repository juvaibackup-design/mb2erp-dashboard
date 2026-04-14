import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

//device
export const getDeviceDetails = () => {
  console.log("innn");
  const userAgent = navigator.userAgent;
  console.log("userAgent", userAgent); // Logs the full User-Agent string

  // Check for common device OS names
  if (userAgent.includes("Windows NT")) {
    return 1;
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    return 5;
  } else if (userAgent.includes("Mac OS X")) {
    return 2;
  } else if (userAgent.includes("Linux")) {
    return 3;
  } else if (userAgent.includes("Android")) {
    return 4;
  }
};

//id
export const getUUIDId = () => {
  return Cookies.get("deviceUUID");
};

export const createUUIDId = () => {
  const deviceUUID = uuidv4(); // Generate a new UUID
  // Store UUID in cookies for 1 year
  Cookies.set("deviceUUID", deviceUUID, { expires: 365 });
  return deviceUUID;
};

// Get Public IP + Location Name
const saveIpData = (data: any) => {
  const withTime = { ...data, fetchedAt: Date.now() };
  console.log("Date.now()", Date.now());
  // localStorage.setItem("ipData", JSON.stringify(withTime));
  Cookies.set("ipData", JSON.stringify(withTime), { expires: 365 });
};

export const getLocationFromIP: any = async () => {
  try {
    // const cached = localStorage.getItem("ipData");
    const cached = Cookies.get("ipData");
    console.log("cached78", cached);

    if (cached) {
      const parsed = JSON.parse(cached);
      console.log("Date.now()", parsed, cached, Date.now());

      const age = (Date.now() - parsed.fetchedAt) / 1000 / 60; // in minutes
      console.log("Date.now()", age);

      if (age < 240) {
        console.log("Date.now()");
        return parsed; // valid for 1 hour}
      }
    }
    const response = await axios.get("https://ipapi.co/json/", {
      timeout: 3000, // 3 seconds timeout
    });

    const data = response.data;

    saveIpData({
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
    });

    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
    };
  } catch (error: any) {
    console.error("Error fetching location from IP:", error);
    const data = {
      ip: "123.123.123.123",
      city: "Chennai",
      region: "Tamil Nadu",
      country_name: "India",
    };

    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
    };
  }
};
