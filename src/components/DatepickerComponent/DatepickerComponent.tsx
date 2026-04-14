// import { TranslationContext } from "@/lib/interfaces/Context.interfaces";
// import localeForArabic from "@/locale/ar-EG";
// import localeForEnglish from "@/locale/en-US";
// import { DatePicker, DatePickerProps, Flex } from "antd";
// import React, { useContext } from "react";
// import { useTranslation } from "react-i18next";

// type ExtendedDatePickerProps = Omit<
//   DatePickerProps,
//   "label" | "errormsg" | "isrequired"
// > & {
//   // Add your additional props here
//   label?: string | undefined;
//   errormsg?: string | undefined | any;
//   isrequired?: boolean | undefined;
// };

// function DatePickerComponent(props: ExtendedDatePickerProps) {
//   const { t } = useTranslation();
//   const lang = useContext(TranslationContext);
//   // const selectedLang = lang?.selectedLang;

//   // const locale =
//   //   selectedLang === "ar"
//   //     ? {
//   //         lang: localeForArabic,
//   //         timePickerLocale: {
//   //           placeholder: "اختيار الوقت",
//   //         },
//   //       }
//   //     : {
//   //         lang: localeForEnglish,
//   //         timePickerLocale: {
//   //           placeholder: "Select date",
//   //         },
//   //       };

//   return (
//     <Flex gap={8} vertical>
//       {props.label && (
//         <p className="label">
//           <span className="error">{props.isrequired ? "* " : null}</span>
//           {t(`${props.label}`)}
//         </p>
//       )}
//       <DatePicker
//         {...props}
//         // locale={locale}
//         className={props.errormsg ? "dateErrBorder" : ""}
//       />
//       {props.errormsg && <p className="error">{props.errormsg}</p>}
//     </Flex>
//   );
// }

// export default DatePickerComponent;

import { TranslationContext } from "@/lib/interfaces/Context.interfaces";
import localeForArabic from "@/locale/ar-EG";
import localeForEnglish from "@/locale/en-US";
import { DatePicker, DatePickerProps, Flex } from "antd";
import React, { forwardRef, Ref, useContext } from "react";
import { useTranslation } from "react-i18next";

type ExtendedDatePickerProps = Omit<
  DatePickerProps,
  "label" | "errormsg" | "isrequired"
> & {
  // Add your additional props here
  label?: string | undefined;
  errormsg?: string | undefined | any;
  isrequired?: boolean | undefined;
};

const DatePickerComponent = forwardRef(function DatePickerWithRef(
  props: ExtendedDatePickerProps,
  ref: Ref<any>
) {
  const { t } = useTranslation();
  const lang = useContext(TranslationContext);

  // Logic to determine locale (optional, commented out for now)
  // const locale =
  //   lang?.selectedLang === "ar"
  //     ? {
  //         lang: localeForArabic,
  //         timePickerLocale: {
  //           placeholder: "اختيار الوقت",
  //         },
  //       }
  //     : {
  //         lang: localeForEnglish,
  //         timePickerLocale: {
  //           placeholder: "Select date",
  //         },
  //       };

  return (
    <Flex gap={8} vertical>
      {props.label && (
        <p className="label">
          {props.isrequired && <span className="error">* </span>}
          {(`${props.label}`)}
        </p>
      )}
      <DatePicker
        {...props}
        ref={ref}
        
        // locale={locale} // Uncomment if you use localization
        className={props.errormsg ? "dateErrBorder" : ""}
      />
      {props.errormsg && <p className="error">{props.errormsg}</p>}
    </Flex>
  );
});

export default DatePickerComponent;
