import React, { forwardRef, KeyboardEventHandler } from "react";
import { Button } from "antd";

interface ButtonProps {
  id?: string;
  onClickEvent?: React.MouseEventHandler<HTMLElement>;
  onKeyDownEvent?: React.KeyboardEventHandler<HTMLElement> | undefined;
  type?: "link" | "text" | "default" | "primary" | "dashed";
  style?: React.CSSProperties;
  shape?: "default" | "circle" | "round";
  size?: "small" | "middle" | "large";
  className: string;
  loading: boolean;
  children: React.ReactNode;
  ref?: React.Ref<any> | undefined;
  icon: React.ReactNode;
  title?: string; // Making it optional
  disabled: boolean;
  onSubmit?: React.FormEventHandler;
  onSubmitCapture?: React.FormEventHandler<HTMLElement>;
  htmlType?: "button" | "reset" | "submit";
  autoFocus?: boolean | undefined;
  danger?: boolean | undefined;
  onMouseEnter: React.MouseEventHandler<HTMLElement> | undefined;
  onMouseLeave: React.MouseEventHandler<HTMLElement> | undefined;
  tabIndex?: number;
}

// function ButtonComponent({
const ButtonComponent = forwardRef<HTMLButtonElement, Partial<ButtonProps>>(
  (
    {
      id,
      htmlType,
      title,
      type,
      onClickEvent,
      onKeyDownEvent,
      style,
      shape,
      size,
      className,
      loading,
      children,
      icon,
      disabled,
      // ref,
      onSubmit,
      onSubmitCapture,
      autoFocus,
      danger,
      onMouseEnter,
      onMouseLeave,
      tabIndex,
    },
    ref
  ) => {
    return (
      <Button
        rootClassName="reponsive-btn"
        id={id}
        htmlType={htmlType}
        onSubmit={onSubmit}
        type={type}
        title={title}
        onClick={onClickEvent}
        onKeyDown={onKeyDownEvent}
        icon={icon}
        style={style}
        shape={shape}
        ref={ref}
        size={size ? size : "middle"}
        className={className}
        loading={loading}
        disabled={disabled}
        onSubmitCapture={onSubmitCapture}
        autoFocus={autoFocus}
        danger={danger}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        tabIndex={tabIndex}
      >
        {children}
      </Button>
    );
  }
);

export default ButtonComponent;
