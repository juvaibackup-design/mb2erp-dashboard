import React, { forwardRef, Ref, useState } from "react";
import { DatePicker, DatePickerProps } from "antd";
import cssStyles from "./datepicker.module.css";
import { Calender } from "@/components/Svg/Calender";
import PosStyles from "@/app/dashboard/(retail)/retail-pos/PosStyles";

type ExtendedDatePickerProps = Omit<
  DatePickerProps,
  "label" | "errormsg" | "isrequired"
> & {
  // Add your additional props here
  label?: string | undefined;
  errormsg?: string | undefined | any;
  isrequired?: boolean | undefined;
  widthInput?: string | undefined;
  disabled?: boolean | undefined;
};

const DatePickerComponent = forwardRef(function FloatDatePickerWithRef(
  props: ExtendedDatePickerProps,
  ref: Ref<any>
) {
  const [isFocused, setIsFocused] = useState(false);
  const { styles } = PosStyles.useStyle();
  return (
    <div
      className={`${cssStyles.floatingLabelContainer} ${
        props.errormsg ? cssStyles.inputError : null
      }`}
      style={{
        width: props.widthInput,
        border: props.disabled ? "1px solid #f0f9fc" : "",
      }}
    >
      <DatePicker
        allowClear
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
        suffixIcon={
          <div
          // style={{
          //   width: "16px",
          //   paddingBottom: "30px",
          //   height: "16px",
          //   flexShrink: "0",
          // }}
          >
            <Calender color={"#BFC8CA"} />
          </div>
        }
        style={{
          width: "100%",
          backgroundColor: props.disabled ? "#f0f9fc" : "",
        }}
        placeholder=" " // Placeholder as a space to prevent overlap
        className={`${styles.customDatePicker} ${cssStyles.floatingDatepicker}`}
      />
      <label
        className={`${cssStyles.floatingLabel} ${
          props.value || isFocused ? cssStyles.active : ""
        }`}
      >
        {props.errormsg && !isFocused ? (
          <span style={{ color: "#e8bdb4" }}>{props.errormsg}</span>
        ) : (
          props.label
        )}
        {<span className="error">{props.isrequired ? "* " : null}</span>}
      </label>
    </div>
  );
});

export default DatePickerComponent;
