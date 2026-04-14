import { Checkbox, CheckboxProps, Flex } from "antd";
import React from "react";

type ExtendedCheckBoxProps = Omit<
  CheckboxProps,
  "label" | "errormsg" | "isrequired"
> & {
  // Add your additional props here
  label?: string | undefined;
  errormsg?: string | undefined | any;
  isrequired?: boolean | undefined;
};

function CheckboxComponent(props: ExtendedCheckBoxProps) {
  return (
    <Flex gap={8} vertical>
      {props.label && (
        <p className="label">
          <span className="error">{props.isrequired ? "* " : null}</span>
          {props.label}
        </p>
      )}
      <Checkbox {...props} />
      {props.errormsg && <p className="error">{props.errormsg}</p>}
    </Flex>
  );
}

export default CheckboxComponent;
