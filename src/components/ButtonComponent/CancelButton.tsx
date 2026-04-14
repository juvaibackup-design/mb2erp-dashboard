import React, { useContext, useEffect, useState } from "react";
import styles from "./Button.module.css";
import { CloseCircleFilled } from "@ant-design/icons";
import { Flex } from "antd";
import { TranslationContext } from "@/lib/interfaces/Context.interfaces";

interface CancelButton {
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  className?: any;
  buttonLabel: string;
  autoFocus?: boolean | undefined;
  style?: React.CSSProperties;
  showModal?: any;
}

export default function CancelButton({
  onClick,
  className,
  buttonLabel,
  autoFocus,
  style,
  showModal,
}: CancelButton) {
  const lang = useContext(TranslationContext);
  const [ltr, setLtr] = useState<any>("en");
  useEffect(() => {
    if (lang?.selectedLang) {
      setLtr(lang?.selectedLang);
    } else {
      const fromLocal = localStorage.getItem("language");
      setLtr(fromLocal);
    }
  }, [lang?.selectedLang]);
  return (
    <button
      className={`${styles.right} ${className}`}
      onClick={onClick}
      style={{
        ...(
        !showModal
          ? ltr === "ar"
            ? {
                left: "316px",
                clipPath: "polygon(0% 0%, 60% 0%, 70% 0%, 100% 100%, 0% 100%)",
              }
            : { left: "-66px" }
          : {}
            ),
            ...style,
      }}
    >
      <Flex gap={2}>
        <CloseCircleFilled style={{ fontSize: "12px" }} autoFocus={false} />
        <p>{buttonLabel}</p>
      </Flex>
    </button>
  );
}

