import React from "react";
import { Flex, Radio, RadioChangeEvent } from "antd";
interface RadioGroupProps {
  name?: string;
  buttonStyle?: "solid" | "outline";
  options?: Array<{ label: React.ReactNode; value: string | number }>;
  onChange?: (e: RadioChangeEvent) => void;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  onBlur?: any;
  children?: React.ReactNode;
  label?: string;
  isrequired?: boolean;
  errormsg?: string | undefined | any;
  style?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
}
const RadioComponent: React.FC<RadioGroupProps> = (props) => {
  const {
    options,
    onChange,
    value,
    defaultValue,
    onBlur,
    disabled,
    children,
    buttonStyle = "solid",
    style,
    name,
    labelStyles,
    ...restProps
  } = props;
  return (
    <Flex vertical gap={8}>
      {props.label ? (
        <label style={labelStyles} className="label">
          <span className="error">{props.isrequired ? "*" : null}</span>{" "}
          {props.label}
        </label>
      ) : null}
      <Radio.Group
        name={name}
        options={options}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        buttonStyle={buttonStyle}
        onBlur={onBlur}
        style={style}
        {...restProps}
      >
        {children}
      </Radio.Group>
      {props.errormsg ? <p className="error">{props.errormsg}</p> : null}
    </Flex>
  );
};
export default RadioComponent;
