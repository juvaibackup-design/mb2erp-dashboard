import { Flex, Switch, SwitchProps } from "antd";
import React, { ReactNode } from "react";

interface SwitchComponentProps {
  autoFocus?: boolean;
  checked: boolean;
  checkedChildren?: ReactNode;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: "default" | "small";
  unCheckedChildren?: ReactNode;
  onChange: (
    checked: boolean
    // event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onClick?: (checked: boolean, event: any) => void;
  style?: React.CSSProperties | undefined;
  labelStyle?: React.CSSProperties | undefined;
  label?: string | undefined;
  isRequired?: boolean;
  errorMsg?: string;
  isReverse?: boolean;
}

export default function SwitchComponent(props: SwitchComponentProps) {
  const { size = "small", isReverse = false, labelStyle } = props;

  return (
    <>
      {Boolean(isReverse) ? (
        <>
          {props.label ? (
            <label style={labelStyle} className="label">
              <span className="error">{props.isRequired ? "*" : null}</span>{" "}
              {props.label}
            </label>
          ) : null}
          <Switch {...props} size={size} />
          {props.errorMsg ? <p className="error">{props.errorMsg}</p> : null}
        </>
      ) : (
        <>
          <Switch {...props} size={size} />
          {props.label ? (
            <label style={labelStyle} className="label">
              <span className="error">{props.isRequired ? "*" : null}</span>{" "}
              {props.label}
            </label>
          ) : null}
          {props.errorMsg ? <p className="error">{props.errorMsg}</p> : null}
        </>
      )}
    </>
  );
}
