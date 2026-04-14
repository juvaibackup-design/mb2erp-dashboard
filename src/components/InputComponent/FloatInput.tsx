import React, { forwardRef, Ref } from "react";
import styles from "./inputcomponent.module.css";
import { Input, InputRef } from "antd";
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
  label?: string | undefined;
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
  icon?: React.ReactNode;
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
}

const FloatInput = forwardRef(function FloatInputComponent(
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
    icon,
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
  }: InputTypes,
  ref: Ref<InputRef>
) {
  const { t } = useTranslation();
  const { decimals = 2 } = getUserDetails() ?? {};
  const [isFocused, setIsFocused] = React.useState(false);

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && onKeyDown) {
      e.preventDefault(); // Prevent the form from submitting
      onKeyDown(e);
    }
  };

  return (
    <div
      className={`${styles.wrapper} ${errormsg ? styles.inputError : null}`}
      style={{
        width: `${maxLength}%`,
        border: disabled ? "1px solid #f0f9fc" : "",
      }}
    >
      {icon && icon}
      <div className={styles.inputData}>
        {type !== "password" ? (
          type === "textarea" ? (
            <Input.TextArea
              id={id}
              // allowClear={allowClear}
              size={size}
              tabIndex={tabIndex}
              minLength={minLength}
              className={`${styles.customInput}`}
              // placeholder={t(${placeholder})}
              placeholder=""
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
              onFocus={(eve: any) => {
                setIsFocused(true); // Set focus state
                onFocus && onFocus(eve); // Call external onFocus if provided
              }}
              onBlur={(eve: any) => {
                setIsFocused(false);
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
              className={`${styles.customInput}`}
              // placeholder={t(${placeholder})}
              placeholder=""
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
              onFocus={(eve: any) => {
                setIsFocused(true); // Set focus state
                onFocus && onFocus(eve); // Call external onFocus if provided
              }}
              onBlur={(eve: any) => {
                if (type == "number") {
                  autoRoundOff(eve, formik, name);
                }
                setIsFocused(false);
                typeof onBlur != "undefined" && onBlur(eve);
              }}
              onKeyDown={onKeyDown}
              ref={ref}
              onInput={onInput}
              max={max}
            />
          )
        ) : (
          <Input.Password
            size={size}
            className={`${styles.customInput}`}
            // placeholder={t(${placeholder})}
            placeholder=""
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
            onBlur={(eve: any) => {
              setIsFocused(false);
              onBlur && onBlur(eve);
            }}
            onFocus={(eve: any) => {
              setIsFocused(true); // Set focus state
              onFocus && onFocus(eve); // Call external onFocus if provided
            }}
            autoComplete="new-password"
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
          />
        )}
        {/* <Input
          prefix={"$"}
          placeholder=""
          className={`${styles.customInput}`}
          value={""}
          autoFocus={true}
          // onFocus={() => handleInputFocus(option)}
          // onChange={(e) => handleInputChange(e, option)}
          // onBlur={(e) => handleInputBlur(e, option)}
        /> */}
        <label className={styles.customLabel}>
          {errormsg && !isFocused ? (
            <span style={{ color: "#e8bdb4" }}>{errormsg}</span>
          ) : (
            label
          )}
          {<span className="error">{isrequired ? "* " : null}</span>}
        </label>
      </div>
    </div>
  );
});
export default FloatInput;
