import React, {
  memo,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Col, Drawer, Row, Tooltip } from "antd";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import styles from "./DrawerComponent.module.css";
import CancelButton from "../ButtonComponent/CancelButton";
import { useTranslation } from "react-i18next";
import { TranslationContext } from "@/lib/interfaces/Context.interfaces";
import useKeyPress from "@/lib/customHooks/useKeyPress";                                   //Shortcuts - Sherin

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeIcon: boolean | ReactNode;
  reset?: React.MouseEventHandler<HTMLElement> | undefined;
  buttonLabel?: string | any;
  submit?: React.MouseEventHandler<HTMLElement> | undefined;
  header1?: string;
  header2?: string;
  footer?: ReactNode | undefined;
  className?: string | undefined;
  width?: any;
  headerRightElement?: ReactNode;
  style?: React.CSSProperties;
  maskClosable?: boolean;
  htmlType?: "button" | "reset" | "submit";
  customCancelBtn?: boolean | undefined;
  customHeader?: ReactNode | undefined;
  disabled?: boolean;
  resetDisable?: boolean;
  title?: boolean | React.ReactNode | undefined;
  rootClass?: string | undefined;
  buttonId?: {
    submit: string;
    reset: string;
    cancel: string;
  };
  placement?: string;
  contentStyle?: any;
  resetLabel?: any;
  isMarginRule?: boolean;
  disableShortcuts?: boolean;
}

function DrawerComponent({
  onClose,
  open,
  closeIcon,
  children,
  reset,
  buttonLabel,
  submit,
  header1,
  header2,
  footer,
  className,
  width,
  headerRightElement,
  style,
  maskClosable = true,
  htmlType,
  customCancelBtn = true,
  customHeader,
  disabled,
  resetDisable,
  title,
  rootClass,
  buttonId,
  placement,
  contentStyle,
  resetLabel,
  isMarginRule = false,
  disableShortcuts = false,
}: DrawerProps) {
  const { t } = useTranslation();
  const lang = useContext(TranslationContext);
  const [ltr, setLtr] = useState<any>("en");
  const footerContent = (
    <div className={styles.group_button}>
      <ButtonComponent
        type="text"
        id={buttonId?.cancel ?? ""}
        className={styles.cancel_button}
        onClickEvent={onClose}
        disabled={resetDisable ? resetDisable : false}
      >
        {t("Close")}
      </ButtonComponent>
      <Tooltip title="Alt + R" placement="bottom" trigger={["hover"]}
        overlayInnerStyle={{
          fontSize: "11px",
          // padding: "2px 6px",    
          borderRadius: "4px",
        }}>
        <ButtonComponent
          type="text"
          id={buttonId?.reset ?? ""}
          className={styles.reset_button}
          onClickEvent={reset}
          disabled={resetDisable ? resetDisable : false}
        >
          {resetLabel || t("Reset")}
        </ButtonComponent>
      </Tooltip>
      <Tooltip title="Alt + S" placement="bottom" trigger={["hover"]}
        overlayInnerStyle={{
          fontSize: "11px",
          // padding: "2px 6px",    
          borderRadius: "4px",
        }}>
        <ButtonComponent
          type="primary"
          id={buttonId?.submit ?? ""}
          htmlType={htmlType ? htmlType : "submit"}
          className={styles.save_button}
          onClickEvent={submit}
          disabled={disabled ? disabled : false}
        >
          {buttonLabel}
        </ButtonComponent>
      </Tooltip>
    </div>
  );
  useEffect(() => {
    if (lang?.selectedLang) {
      setLtr(lang?.selectedLang);
    } else {
      const fromLocal = localStorage.getItem("language");
      setLtr(fromLocal);
    }
  }, [lang?.selectedLang]);

  // Language Translation
  // const drawerPlacement: any = useMemo(() => {
  //   if (ltr === "ar" || placement == "left") return "left";
  //   else if (placement) return placement;
  //   else return "right";
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [placement]);


  const drawerPlacement: any = useMemo(() => {
    if (placement) return placement;

    if (ltr === "ar") return "left";
    return "right";
  }, [ltr, placement]);
  //Ends


  //Shortcuts - Sherin
  const flashReset = () => {
    const rootSel = `.${rootClass ?? "ow-content-wrapper"}`;
    const root = document.querySelector(rootSel) ?? document.body;

    const btn =
      (buttonId?.reset
        ? root.querySelector<HTMLElement>(`#${buttonId.reset}`)
        : null) ||
      root.querySelector<HTMLElement>(`.${styles.reset_button}`);

    if (!btn) return;

    btn.classList.add("ow-flash");
    setTimeout(() => btn.classList.remove("ow-flash"), 500);
  };

  const flashSave = () => {
    const rootSel = `.${rootClass ?? "ow-content-wrapper"}`;
    const root = document.querySelector(rootSel) ?? document.body;

    const btn =
      (buttonId?.submit
        ? root.querySelector<HTMLElement>(`#${buttonId.submit}`)
        : null) ||
      root.querySelector<HTMLElement>(`.${styles.save_button}`);

    if (!btn) return;

    btn.classList.add("ow-flash");
    setTimeout(() => btn.classList.remove("ow-flash"), 500);
  };


  const onKeyPress = (event: {
    preventDefault(): void;
    stopPropagation(): void;
    key: string;
    altKey: boolean;
  }) => {
    if (disableShortcuts) return;
    
    if (!open) return;
    const k = event.key.toLowerCase();
    if (!event.altKey) return;

    // Alt+C → Cancel
    if (k === "c") {
      event.preventDefault();
      onClose?.();
      return;
    }

    // Alt+R → Reset
    if (k === "r") {
      event.preventDefault();
      flashReset();
      reset?.(event as any);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return;
    }

    // Alt+S → Submit / Create
    if (k === "s") {
      event.preventDefault();
      flashSave();
      submit?.(event as any);
      return;
    }
  };
  useKeyPress(["c", "C", "r", "R", "s", "S"], onKeyPress);
  //Ends


  return (
    <>
      <Drawer
        placement={drawerPlacement}
        onClose={onClose}
        open={open}
        rootClassName={`${rootClass}`}
        // rootClassName="ow-content-wrapper"
        closeIcon={closeIcon}
        width={width ? width : 350}
        footer={footer ? footer : footerContent}
        title={title ? title : false}
        className={className ? className : "wrapper"}
        maskClosable={maskClosable}
      >
        {customHeader ? customHeader : null}
        {customCancelBtn ? (
          <div style={{ transition: "opacity 0.1s" }}>
            <CancelButton
              buttonLabel={t("Cancel")}
              className={styles.button}
              onClick={onClose}
              style={
                ltr === "ar" && isMarginRule
                  ? {
                    left: "666px",
                    clipPath:
                      "polygon(0% 0%, 60% 0%, 70% 0%, 100% 100%, 0% 100%)",
                  }
                  : undefined
              }
            />
          </div>
        ) : null}
        {header1 || header2 || headerRightElement ? (
          <Row
            align={"middle"}
            justify={"space-between"}
            className={header1 || header2 ? styles.custHeaderLayout : ""}
            style={ltr === "ar" ? { direction: "rtl" } : { direction: "ltr" }}

          // style={
          //   ltr === "ar"
          //     ? { flexDirection: "row-reverse" }
          //     : { flexDirection: "row" }
          // }
          >
            <Col>
              <h1 className={styles.drawerHeader}>{t(header1 ?? "")}</h1>
              <h6 className={styles.drawerHeaderTwo}>{t(header2 ?? "")}</h6>
            </Col>
            {headerRightElement ? <Col>{headerRightElement}</Col> : null}
          </Row>
        ) : null}

        <div
          className={header1 || header2 ? styles.customContentLayout : ""}
          style={{
            direction: ltr === "ar" ? "rtl" : "ltr",
            ...contentStyle,
          }}
        >
          {children}
        </div>
      </Drawer>
    </>
  );
}

export default DrawerComponent;
