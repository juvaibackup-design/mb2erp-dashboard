"use client";
import LoginForm from "../signInComponents/LoginForm";
import RegisterCompanyForm from "../RegisterCompanyComponents/RegisterCompanyForm";
import { useEffect, useState } from "react";
import styles from "../../rootLayout.module.css";
import { useLoginStore } from "@/store/login/store";
import ActivatedPage from "./ActivatedPage";
import ForgotPasswordForm from "../signInComponents/ForgotPasswordForm";

export default function HomePage() {
  // const [preferredAction, setPreferredAction] = useState<string>("login");
  const preferredAction = useLoginStore().preferredAction;
  const setPreferredAction = useLoginStore().setPreferredAction;
  useEffect(() => {
    const chatBox: HTMLDivElement | null =
      document.querySelector(".sb-main.sb-chat");
    if (chatBox) {
      chatBox.style.display = "none";
    }
  }, []);

  return (
    <div
      className={
        preferredAction == "login" ||
        preferredAction == "activated" ||
        preferredAction == "forgotPassword"
          ? styles.loginBox
          : styles.registerBox
      }
    >
      <div className={styles.padd}>
        {preferredAction == "login" && (
          <LoginForm />
        )}
      
      </div>
    </div>
  );
}
