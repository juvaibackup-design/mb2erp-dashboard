import React, { useState, useEffect } from "react";         // Added useEffect - Sherin
import { Select } from "antd";
import cssStyles from "./selectoption.module.css";
import { UpArrow } from "../Svg/UpArrow";
import { DownArrow } from "../Svg/DownArrow";

interface Option {
  value: string;
  label: string;
}

interface FloatingLabelSelectInterface {
  label: string;
  value: string;
  options: Option[]; // Define the options type
  onChange: (value: string) => void;
  widthInput: string;
  showSearch: Boolean;
  disabled?: boolean;
  filterOption?: any;
  errormsg?: any;
  required?: boolean;
  onFocus?:
  | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  | undefined;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
}

const FloatingLabelSelect: React.FC<FloatingLabelSelectInterface> = ({
  label,
  value,
  options,
  onChange,
  widthInput,
  showSearch,
  disabled,
  errormsg,
  required,
  filterOption,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);


  // Dark Mode Changes - Sherin
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    const onThemeChanged = (e: any) => {
      const next = (e?.detail as "light" | "dark") ?? "light";
      setTheme(next);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue as "light" | "dark");
      }
    };

    window.addEventListener("icube-theme-changed", onThemeChanged as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("icube-theme-changed", onThemeChanged as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  // Ends

  return (
    <div
      className={`${cssStyles.floatingLabelContainer}  ${errormsg ? cssStyles.inputError : null
        }`}
      style={{ width: widthInput, border: disabled ? "1px solid #f0f9fc" : "" }}
    >
      <Select
        allowClear
        showSearch={!!showSearch}
        placeholder=""
        optionFilterProp="label"
        value={value || undefined}
        onChange={(selectedValue) => {
          onChange(selectedValue);
          // setIsFocused(!!selectedValue); // Manage focus
        }}
        onFocus={(eve: any) => {
          setIsFocused(true); // Set focus state
          onFocus && onFocus(eve); // Call external onFocus if provided
        }}
        onBlur={(eve: any) => {
          setIsFocused(false);
          onBlur && onBlur(eve);
        }}
        // onFocus={handleFocus}
        // onBlur={onBlur}
        options={options}
        suffixIcon={
          isFocused ? (
            <div>
              <UpArrow color="#BFC8CA" />
            </div>
          ) : (
            <div>
              <DownArrow color="#BFC8CA" />
            </div>
          )
        }
        onDropdownVisibleChange={(open) => setIsFocused(open)}
        filterOption={filterOption}
        className={`${cssStyles.floatingSelect} ${value || isFocused ? cssStyles.filled : ""
          }`}
        // style={{
        //   backgroundColor: disabled ? "#f0f9fc" : "",                  // Sherin        
        // }}

        //Dark Mode Changes - Sherin
        style={{ backgroundColor: disabled ? theme === "dark" ? "#2b2b2bff" : "#f0f9fc" : "" }}   //Ends
        disabled={disabled}
      />
      <label
        className={`${cssStyles.floatingLabel} ${value || isFocused ? cssStyles.active : ""
          }`}
      >
        {errormsg && !isFocused ? (
          <span style={{ color: "#e8bdb4" }}>{errormsg}</span>
        ) : (
          label
        )}
        {<span className="error">{required ? "* " : null}</span>}
      </label>
    </div>
  );
};

export default FloatingLabelSelect;
