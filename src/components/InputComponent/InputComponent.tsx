"use client";
import React, { Ref, RefObject, forwardRef } from "react";
import { Flex, Input, InputRef } from "antd";
import { useTranslation } from "react-i18next";
import {
  autoRoundOff,
  getUserDetails,
  restrictDecimal,
} from "@/lib/helpers/utilityHelpers";
export interface InputTypes {
  size?: "large" | "middle" | "small";
  placeholder?: string;
  prefix?: React.ReactNode | null;
  suffix?: React.ReactNode | null;
  type:
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"
  | "textarea";
  id?: string;
  style?: React.CSSProperties;
  name?: string;
  onChangeEvent?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  value?: any;
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  className?: string;
  onPressEnter?:
  | React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
  | undefined;
  maxLength?: number;
  min?: number | undefined;
  minLength?: number | undefined;
  allowClear?: boolean | undefined;
  disabled?: boolean;
  label?: string | any;
  errormsg?: string | undefined | any;
  isrequired?: boolean | undefined;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  onFocus?:
  | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  | undefined;
  // ref?: React.Ref<InputRef> | undefined;
  onInput?:
  | React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>
  | undefined;
  autoFocus?: boolean | undefined;
  tabIndex?: number | undefined;
  max?: string | number | undefined;
  onKeyDown?:
  | React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
  | undefined;
  rootClassName?: string | undefined;
  passwordVisible?: boolean | undefined;
  setPasswordVisible?: ((visible: boolean) => void) | undefined;
  isFromPos?: boolean | undefined;
  formik?: any;
  isRestrictDecimal?: boolean | undefined;
  defaultValue?: any;
  status?: "error" | "warning" | "";
  autoComplete?: string;

}
const InputComponent = forwardRef(function InputComponent(
  {
    size,
    placeholder,
    prefix,
    suffix,
    type,
    style,
    name,
    id,
    onChangeEvent,
    value,
    addonAfter,
    addonBefore,
    className,
    onPressEnter,
    maxLength,
    min,
    minLength,
    allowClear,
    disabled,
    label,
    errormsg,
    isrequired,
    onBlur,
    onFocus,
    onInput,
    autoFocus,
    tabIndex,
    max,
    onKeyDown,
    rootClassName,
    passwordVisible,
    setPasswordVisible,
    isFromPos = false,
    formik,
    isRestrictDecimal, // only for edit view purpouse
    defaultValue,
    autoComplete,
    status
  }: InputTypes,
  ref: Ref<InputRef>
) {
  const { t } = useTranslation();
  const { decimals = 2 } = getUserDetails() ?? {};

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && onKeyDown) {
      e.preventDefault(); // Prevent the form from submitting
      onKeyDown(e);
    }
  };

  return (
    <Flex
      gap={isFromPos ? 0 : 8}
      vertical
      style={{ width: isFromPos ? "" : "100%" }}
    >
      {label && (
        <p className="label">
          <span className="error">{isrequired ? "* " : null}</span>
          {t(`${label}`)}
        </p>
      )}
      {type !== "password" ? (
        type === "textarea" ? (
          <Input.TextArea
            id={id}
            // allowClear={allowClear}
            size={size}
            tabIndex={tabIndex}
            minLength={minLength}
            className={className}
            // placeholder={t(${placeholder})}
            placeholder={placeholder}
            style={style}
            autoFocus={autoFocus}
            rootClassName={errormsg ? "errBorder" : rootClassName}
            name={name}
            onChange={(eve) => {
              typeof onChangeEvent != "undefined" && onChangeEvent(eve);
            }}
            // value={
            //   typeof isRestrictDecimal != "undefined" && isRestrictDecimal
            //     ? parseFloat(value).toFixed(decimals)
            //     : value
            // }
            value={value}
            onPressEnter={onPressEnter}
            maxLength={maxLength}
            autoComplete="off"
            disabled={disabled ? disabled : false}
            onFocus={onFocus}
            onBlur={(eve: any) => {
              typeof onBlur != "undefined" && onBlur(eve);
            }}
            ref={ref}
            onInput={onInput}
            onKeyDown={onKeyDown}
          // onKeyDown={handleKeyPress}
          />
        ) : (
          <Input
            id={id}
            // allowClear={allowClear}
            size={size}
            tabIndex={tabIndex}
            min={min}
            minLength={minLength}
            className={className}
            // placeholder={t(${placeholder})}
            placeholder={placeholder}
            prefix={prefix}
            suffix={suffix}
            type={type}
            style={style}
            autoFocus={autoFocus}
            rootClassName={errormsg ? "errBorder" : rootClassName}
            name={name}
            onChange={(eve) => {
              if (type == "number") {
                restrictDecimal(eve, formik, name);
              }
              typeof onChangeEvent != "undefined" && onChangeEvent(eve);
            }}
            // value={
            //   typeof isRestrictDecimal != "undefined" && isRestrictDecimal
            //     ? parseFloat(value).toFixed(decimals)
            //     : value
            // }
            value={value}
            addonAfter={addonAfter}
            addonBefore={addonBefore}
            onPressEnter={onPressEnter}
            maxLength={maxLength}
            autoComplete="off"
            disabled={disabled ? disabled : false}
            onFocus={onFocus}
            onBlur={(eve: any) => {
              if (type == "number") {
                autoRoundOff(eve, formik, name);
              }
              typeof onBlur != "undefined" && onBlur(eve);
            }}
            ref={ref}
            onInput={onInput}
            max={max}
            defaultValue={defaultValue}
            onKeyDown={onKeyDown}
          />
        )
      ) : (
        <Input.Password
          size={size}
          className={className}
          // placeholder={t(${placeholder})}
          placeholder={placeholder}
          prefix={prefix}
          suffix={suffix}
          type={type}
          style={style}
          name={name}
          onChange={onChangeEvent}
          rootClassName={errormsg ? "errBorder" : rootClassName}
          value={value}
          addonAfter={addonAfter}
          addonBefore={addonBefore}
          onPressEnter={onPressEnter}
          disabled={disabled ? disabled : false}
          onBlur={onBlur}
          onFocus={onFocus}
          autoComplete="new-password"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
        />
      )}
      {errormsg ? <p className="error">{errormsg}</p> : null}
    </Flex>
  );
});
export default InputComponent;
