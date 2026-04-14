// "use client";

// import { useEffect } from "react";
// import { Modal } from "antd";
// import { useRouter } from "next/navigation";
// import { CONSTANT } from "@/lib/constants/constant";

// const SessionExpired = () => {
//   const router = useRouter();

//   useEffect(() => {
//     // fire logout event once, when page loads
//     const event = new Event(CONSTANT.LOGOUT);
//     window.dispatchEvent(event);

//     // show alert-style modal
//     Modal.warning({
//       title: "Session expired",
//       content:
//         "Your login session has expired. Please sign in again to continue working.",
//       okText: "OK",
//       centered: true,
//       maskClosable: false,  
//       onOk: () => {
//         router.replace("/"); 
//       },
//     });
//   }, [router]);

//   // no UI needed, only the modal
//   return null;
// };

// export default SessionExpired;


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CONSTANT } from "@/lib/constants/constant";

const SessionExpired = () => {
  const router = useRouter();

  useEffect(() => {
    const event = new Event(CONSTANT.LOGOUT);
    window.dispatchEvent(event);

    alert("Session Expired. Please sign in again to continue.");

    router.replace("/"); 
  }, [router]);

  return null;
};

export default SessionExpired;

