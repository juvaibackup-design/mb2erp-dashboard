import { Button } from "antd";
import styles from "./ButtonCheckboxComponent.module.css";
import { FormEventHandler, useState } from "react";
import { ButtonProps } from "antd/lib";

type ButtonTypes = "dashed" | "default" | "link" | "primary" | "text";

export interface ButtonCheckboxComponentProps
  extends Omit<ButtonProps, "type" | "children" | "onChange" | "className"> {
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean, value?: any) => void;
  children: React.ReactNode;
  type?: ButtonTypes;
  className?: string;
  checkedStyle?: any;
  unCheckedStyle?: any;
  checkedClassName?: string;
  unCheckedClassName?: string;
}

export default function ButtonCheckboxComponent({
  children,
  name,
  onChange,
  checked,
  type = "default",
  className,
  value,
  style,
  checkedStyle,
  unCheckedStyle,
  checkedClassName,
  unCheckedClassName = "",
  ...props
}: ButtonCheckboxComponentProps) {
  const [inputChecked, setInputChecked] = useState<boolean>(checked || false);
  const finalChecked = checked != undefined ? checked : inputChecked;
  const styleTypes: Record<ButtonTypes, string> = {
    dashed: "",
    default: "defaultChecked",
    link: "",
    primary: "",
    text: "",
  };
  const finalClassName =
    finalChecked && !checkedClassName
      ? styles[styleTypes[type]] + " " + className
      : finalChecked && checkedClassName
      ? checkedClassName
      : finalChecked && !unCheckedClassName
      ? className
      : unCheckedClassName + " " + className;
  return (
    <>
      <Button
        type={type}
        onClick={() => {
          if (onChange) onChange(!finalChecked, !finalChecked ? value : null);
          setInputChecked(!inputChecked);
        }}
        // className={
        //   (finalChecked
        //     ? !checkedStyle
        //       ? styles[styleTypes[type]]
        //       : ""
        //     : "") +
        //   " " +
        //   className
        // }
        className={finalClassName}
        style={{ ...(checkedStyle || {}), ...(style || {}) }}
        {...props}
      >
        {children}
      </Button>
      <input
        type="checkbox"
        name={name}
        className={styles.checkboxInput}
        checked={finalChecked}
      />
    </>
  );
}
