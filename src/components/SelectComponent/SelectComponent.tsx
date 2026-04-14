import { Flex, Select } from "antd";
import { SelectProps } from "antd/es/select";
import React, { Ref, forwardRef } from "react";
import { useTranslation } from "react-i18next";

type ExtendedDatePickerProps = Omit<
  SelectProps,
  "label" | "errormsg" | "isrequired" | "isVisible"
> & {
  // Add your additional props here
  name?: string;
  label?: string | undefined;
  labelElement?: any;
  errormsg?: string | undefined | any;
  isrequired?: boolean | undefined;
  isVisible?: boolean | undefined;
};
const MySelect = forwardRef(function SelectComponent(
  props: ExtendedDatePickerProps = {
    isVisible: true,
  },
  ref: Ref<any>
) {
  // Provide default values here
  const {
    isVisible = true, // Default to true if not provided
    ...restProps
  } = props;
  const { t } = useTranslation();

  return (
    <>
      {(props.errormsg || props.label || props.labelElement) && isVisible ? (
        <Flex gap={8} vertical style={{ width: "100%" }}>
          {props.label ? (
            <p className="label">
              {props.isrequired ? (
                <span style={{ color: "#f5222d" }}>* </span>
              ) : null}
              {t(`${props.label}`)}
            </p>
          ) : null}
          {props.labelElement ? (
            <div className="label">{props.labelElement}</div>
          ) : null}
          <Select
            {...props}
            ref={ref}
            className={props.errormsg ? "selErrBorder" : props.className}
          >
            {props.children}
          </Select>
          {props.errormsg ? <p className="error">{props.errormsg}</p> : null}
        </Flex>
      ) : (
        isVisible && (
          <Select
            {...props}
            className={props.errormsg ? "selErrBorder" : props.className}
          >
            {props.children}
          </Select>
        )
      )}
    </>
  );
});

export default MySelect;
