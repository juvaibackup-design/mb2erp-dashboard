import { TranslationContext } from "@/lib/interfaces/Context.interfaces";
import localeForArabic from "@/locale/ar-EG";
import localeForEnglish from "@/locale/en-US";
import { DatePicker, Flex } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

type ExtendedRangePickerProps = Omit<
  RangePickerProps,
  "label" | "errormsg" | "isrequired"
> & {
  // Add your additional props here
  label?: string | undefined;
  errormsg?: string | undefined;
  isrequired?: boolean | undefined;
  dropdownClassName?: string | undefined;
  popupClassName?: string | undefined;
  rootClassName?: string | undefined;
};

const { RangePicker } = DatePicker;

function RangePickerComponent(props: ExtendedRangePickerProps) {
  const { t } = useTranslation();
  const lang = useContext(TranslationContext);
  // const selectedLang = lang?.selectedLang;

  return (
    <Flex gap={8} vertical>
      {props.label && (
        <p className="label">
          <span className="error">{props.isrequired ? "* " : null}</span>
          {t(`${props.label}`)}
        </p>
      )}
      <RangePicker
        {...props}
        // locale={
        //   selectedLang === "ar"
        //     ? {
        //         lang: localeForArabic,
        //         timePickerLocale: {
        //           placeholder: "اختيار الوقت",
        //         },
        //       }
        //     : {
        //         lang: localeForEnglish,
        //         timePickerLocale: {
        //           placeholder: "اختيار الوقت",
        //         },
        //       }
        // }
        popupClassName={props.popupClassName}
        dropdownClassName={props.dropdownClassName}
        rootClassName={props.rootClassName}
        className={props.errormsg ? "dateErrBorder" : ""}
      />
      {props.errormsg && <p className="error">{props.errormsg}</p>}
    </Flex>
  );
}

export default RangePickerComponent;
