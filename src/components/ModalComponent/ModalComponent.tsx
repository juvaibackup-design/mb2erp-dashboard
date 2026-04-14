import React, {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./ModalComponent.module.css";
import { Button, Modal, Tour } from "antd";
import "@/lib/antdOverwrittenCss/global.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import CancelButton from "../ButtonComponent/CancelButton";
import { useTranslation } from "react-i18next";
import { TranslationContext } from "@/lib/interfaces/Context.interfaces";
import useKeyPress from "@/lib/customHooks/useKeyPress";                    //Shortcuts 

interface ModalComponentProps {
  children: ReactNode;
  title?: string | any;
  customTitle?: string | undefined;
  description?: string;
  showModal: boolean | undefined;
  setShowModal: Function;
  footer?: React.ReactNode;
  width?: string | number | undefined;
  closeIcon?: React.ReactNode;
  className?: string;
  rootClassName?: string | undefined;
  wrapClassName?: string | undefined;
  centered?: boolean | undefined;
  headerCentered?: boolean | undefined;
  style?: CSSProperties | undefined;
  customHeaderButtonLabel?: string | undefined;
  customHeaderOnClickEvent?: React.MouseEventHandler<HTMLElement> | undefined;
  customHeaderButtonIcon?: React.ReactNode | undefined;
  mask?: boolean | undefined;
  keyboard?: boolean | undefined;
  maskClosable?: boolean | undefined;
  headerRightChildren?: React.ReactNode | undefined;
  customCancelButton?: boolean | undefined;
  onCloseModalCustom?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onClose?:
  | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
  | undefined;
  onOk?: () => void;
  zIndex?: number;

}

export default function ModalComponent({
  children,
  title,
  description,
  showModal,
  footer,
  width,
  closeIcon,
  className,
  setShowModal,
  centered,
  rootClassName,
  wrapClassName,
  customTitle,
  headerCentered,
  style,
  customHeaderOnClickEvent,
  customHeaderButtonLabel,
  customHeaderButtonIcon,
  mask,
  maskClosable,
  headerRightChildren,
  customCancelButton = true,
  onCloseModalCustom,
  onClose,
  keyboard,
  onOk,
  zIndex,

}: ModalComponentProps) {
  const { t } = useTranslation();
  const lang = useContext(TranslationContext);
  const [ltr, setLtr] = useState<any>("en");
  const onCloseModal = () => {
    setShowModal(false);
  };


  //language translation useeffect funtionality from eng to arabic
  useEffect(() => {
    if (lang?.selectedLang) {
      setLtr(lang?.selectedLang);
    } else {
      const fromLocal = localStorage.getItem("language");
      setLtr(fromLocal);
    }
  }, [lang?.selectedLang]);


//Confirm Modal - Esc Key

useEffect(() => {
  if (!showModal) return;

  if (keyboard === false) return;

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;

    event.preventDefault();
    event.stopPropagation();

    if (onCloseModalCustom) {
      onCloseModalCustom({} as any);
    } else if (onClose) {
      onClose({} as any);
    } else {
      setShowModal(false);
    }
  };

  document.addEventListener("keydown", handleEsc, true);

  return () => {
    document.removeEventListener("keydown", handleEsc, true);
  };
}, [showModal, keyboard, onCloseModalCustom, onClose, setShowModal]);
//Ends

  // Shortcuts
  // const onKeyPress = (event: KeyboardEvent) => {
  //   if (!showModal) return;

  //   const key = event.key?.toLowerCase();



  //   if (event.altKey && key === "c") {
  //     event.preventDefault();
  //     event.stopImmediatePropagation();
  //     (onClose ?? onCloseModal)({} as any);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("keydown", onKeyPress, true);

  //   return () => {
  //     document.removeEventListener("keydown", onKeyPress, true);
  //   };
  // }, [showModal]);


  //   const onKeyPress = (event: KeyboardEvent) => {
  //   if (!showModal) return;

  //   const key = event.key?.toLowerCase();

  //   if (event.altKey && key === "x") {
  //     event.preventDefault();
  //     event.stopImmediatePropagation();
  //     (onClose ?? onCloseModal)({} as any);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("keydown", onKeyPress, true);
  //   return () => {
  //     document.removeEventListener("keydown", onKeyPress, true);
  //   };
  // }, [showModal]);


  // const onKeyPress = (event: {
  //   preventDefault(): unknown;
  //   key: string;
  //   altKey: boolean;
  // }) => {
  //   if (!showModal) return;

  //   if (event.altKey && event.key.toLowerCase() === "x") {
  //     event.preventDefault();
  //     (onClose ?? onCloseModal)({} as any);
  //     return;
  //   }
  // };

  // useKeyPress(["x", "X"], onKeyPress);

  // const onKeyPress = (event: KeyboardEvent) => {
  //   const key = event.key?.toLowerCase();

  //   if (showModal) {
  //     event.stopPropagation();

  //     if (event.altKey && key === "x") {
  //       event.preventDefault();
  //       (onClose ?? onCloseModal)({} as any);
  //     }

  //     return;
  //   }
  // }
  // useKeyPress(["x", "X"], onKeyPress);

  // const onKeyPress = (event: KeyboardEvent) => {
  //   if (!showModal) return;

  //   const key = event.key.toLowerCase();

  //   if (event.altKey && key === "x") {
  //     event.preventDefault();
  //     event.stopImmediatePropagation();
  //     (onClose ?? onCloseModal)({} as any);
  //   }
  // };

  // useKeyPress(["x", "X"], onKeyPress);

  // const onKeyPress = (event: KeyboardEvent) => {
  //   if (!showModal) return;

  //   const key = event.key?.toLowerCase();

  //   if (event.altKey && key === "c") {
  //     event.preventDefault();   // prevent only for the shortcut
  //     event.stopPropagation();
  //     (onClose ?? onCloseModal)({} as any);
  //   }
  // };


  // useEffect(() => {
  //   document.addEventListener("keydown", onKeyPress, true);

  //   return () => {
  //     document.removeEventListener("keydown", onKeyPress, true);
  //   };
  // }, [showModal]);

  // Ends


  return (
    <>
      <Modal
        // style={ltr === "ar" ? { direction: "rtl" } : { direction: "ltr" }}
        title={title}
        open={showModal}
        footer={footer}
        width={width}
        closeIcon={closeIcon ? closeIcon : false}
        className={`${className} custom-modal-global`}
        rootClassName={rootClassName}
        wrapClassName={wrapClassName}
        centered={centered}
        mask={mask}
        maskClosable={maskClosable}
        keyboard={keyboard}
        style={
          style
            ? style
            : ltr === "ar"
              ? { direction: "rtl" }
              : { direction: "ltr" }
        }
        onCancel={onClose ? onClose : onCloseModal}
        onOk={onOk}
        // style={{ height: "100vh" }}
        // styles={{
        //   body: {
        //     height: "100vh",
        //     overflow: "auto",
        //     backgroundColor: "white",
        //     width: "100%",
        //   },
        // }}
        zIndex={zIndex}
      >
        {customTitle && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className={styles.modalHeader}>
              <h3
                className={styles.title}
                style={{
                  textAlign: headerCentered
                    ? "center"
                    : ltr === "ar"
                      ? "right"
                      : "left",
                  // textAlign: headerCentered ? "center" : "left",
                  // direction: ltr === "ar" ? "rtl" : "ltr",
                }}
              >
                {t(`${customTitle}`)}
              </h3>
              {description && (
                <p
                  className={styles.desc}
                  style={{
                    // headerCentered
                    //   ? { textAlign: "center" }
                    //   : { textAlign: "left" }
                    textAlign: headerCentered
                      ? "center"
                      : ltr === "ar"
                        ? "right"
                        : "left",
                  }}
                >
                  {t(`${description}`)}
                </p>
              )}
            </div>

            {customHeaderButtonLabel && (
              <ButtonComponent
                type="primary"
                onClickEvent={customHeaderOnClickEvent}
                icon={customHeaderButtonIcon}
              >
                {t(`${customHeaderButtonLabel}`)}
              </ButtonComponent>
            )}

            {headerRightChildren ? headerRightChildren : null}
          </div>
        )}
        {children}
        {customCancelButton ? (
          <CancelButton
            onClick={onCloseModalCustom ? onCloseModalCustom : onCloseModal}
            buttonLabel={t("Cancel")}
            className={styles.cancelButton}
            showModal={showModal}
          />
        ) : null}
      </Modal>
    </>
  );
}
