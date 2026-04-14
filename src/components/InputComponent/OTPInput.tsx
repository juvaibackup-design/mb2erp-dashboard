"use client";

import React from "react";
import { Flex, Input, Typography } from 'antd';
import styles from "./inputcomponent.module.css";

import type { GetProps } from 'antd';

type OTPProps = GetProps<typeof Input.OTP>;

interface Props {
  setOtp?: any
}
const OTPInput: React.FC<Props> = ({ setOtp }) => {

  const onChange: OTPProps["onChange"] = (value) => {
    setOtp(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only digits, backspace, arrow keys
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Tab"
    ) {
      e.preventDefault(); // block any other key
    }
  };

  return <div
    className={`${styles.otpwrapper}`}
  >
    <Input.OTP
      length={6}
      onChange={onChange}
      onKeyDown={onKeyDown}
      inputMode="numeric"
      size="large"
      formatter={(str) => str.toUpperCase()}
    />
  </div>
}

export default OTPInput;