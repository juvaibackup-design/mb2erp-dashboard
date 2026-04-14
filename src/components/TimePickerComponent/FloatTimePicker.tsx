import React, { forwardRef, Ref } from "react";
import { TimePicker } from "antd";
import type { TimePickerProps } from "antd";
import cssStyles from "./timepicker.module.css";
import dayjs from "dayjs";

const format = "h:mm A";

type ExtendedTimePickerProps = Omit<
  TimePickerProps,
  "label" | "errormsg" | "isrequired"
> & {
  // Add your additional props here
  label?: string | undefined;
  errormsg?: string | undefined | any;
  isrequired?: boolean | undefined;
  widthInput?: string | undefined;
  disabled?: boolean | undefined;
};

const FloatTimePicker = forwardRef(function FloatDatePickerWithRef(
  props: ExtendedTimePickerProps,
  ref: Ref<any>
) {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div
      className={`${cssStyles.floatingLabelContainer} ${props.errormsg ? cssStyles.inputError : null
        }`}
      style={{ width: props.widthInput }}
    >
      <TimePicker
        allowClear
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=""
        style={{ width: "100%" }}
        variant="borderless"
        use12Hours
        format={"h:mm A"}
      // className={`${styles.customDatePicker} ${cssStyles.floatingDatepicker}`}
      />
      <label
        className={`${cssStyles.floatingLabel} ${props.value || isFocused ? cssStyles.active : ""
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

export default FloatTimePicker;
