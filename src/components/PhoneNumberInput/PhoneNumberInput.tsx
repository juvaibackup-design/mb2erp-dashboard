import React, { useState } from "react";
import { Flex, Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import "@/lib/antdOverwrittenCss/global.css";

const { Option } = Select;

interface PhoneNumberInputProps {
  maxLength?: number;
  isrequired?: boolean;
  label?: string | undefined;
  errormsg?: string | undefined;
  placeholder?: string | undefined;
  onChange?: (value: any, countryCode: any) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  name: string;
  value: any;
}

const PhoneNumberInput = (props: PhoneNumberInputProps) => {
  const { t } = useTranslation();
  const [countryCode, setCountryCode] = useState("+91"); // Default country code

  const handleCountryCodeChange = (value: any) => {
    setCountryCode(value);
  };

  const handlePhoneNumberChange = (e: any) => {
    props.onChange && props.onChange(e.target.value, countryCode);
  };

  return (
    <Flex gap={8} vertical style={{ width: "100%" }}>
      {props.label && (
        <p className="label">
          {props.isrequired ? (
            <span style={{ color: "#f5222d" }}>* </span>
          ) : null}
          {t(`${props.label}`)}
        </p>
      )}
      <Input
        autoComplete="off"
        placeholder={props?.placeholder || "Enter phone number"}
        onChange={handlePhoneNumberChange}
        onBlur={props.onBlur}
        status={props.errormsg ? "error" : undefined}
        type="text"
        name={props.name}
        value={props.value}
        maxLength={props.maxLength ? props.maxLength : undefined}
        addonBefore={
          <Select
            showSearch
            defaultValue={countryCode}
            onChange={handleCountryCodeChange}
          >
            <Option value="+1">+1</Option>
            <Option value="+91">+91</Option>
          </Select>
        }
      />
      {props.errormsg ? <p className="error">{props.errormsg}</p> : null}
    </Flex>
  );
};

export default PhoneNumberInput;
