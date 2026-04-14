import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import styles from "./InputToggler.module.css";

interface InputTogglerProps {
  name: string;
  disabled?: boolean;
  disabledMinus?: boolean;
  disabledPlus?: boolean;
  handleMinusClick?: Function;
  handlePlusClick?: Function;
  handleToggle?: Function;
  value?: any;
  onChange?: Function;
  onBlur?: (value: number) => void;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
}
export default function InputToggler({
  name,
  disabled,
  disabledMinus,
  disabledPlus,
  handleMinusClick,
  handlePlusClick,
  handleToggle,
  value,
  onChange,
  onBlur,
  defaultValue,
  minValue,
  maxValue,
  step,
}: InputTogglerProps) {
  const [toggleValue, setToggleValue] = useState<number | string>(value);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const ref = useRef<any>(null);

  function test(value: string) {
    if (!value) setErrorMessage(`${name} is required`);
    else if (value == "0") setErrorMessage(`${name} can not be zero`);
    else if (Number(value) < 0) setErrorMessage(`${name} can not be negative`);
    else if (maxValue && Number(value) > maxValue)
      setErrorMessage(`${name} can not be greater than ${maxValue}`);
    else if (minValue && Number(value) < minValue)
      setErrorMessage(`${name} can not be lesser than ${minValue}`);
    else setErrorMessage("");
  }

  useEffect(() => {
    setToggleValue(value);
  }, [value]);

  return (
    <div className={styles.inputToggler}>
      <div className={styles.inputWrap}>
        <MinusOutlined
          style={{
            cursor: "pointer",
            userSelect: "none",
            opacity: disabledMinus ? 0.5 : 1,
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (disabledMinus) return false;
            if (handleMinusClick) handleMinusClick(ref.current.value);
            else if (handleToggle) handleToggle(ref.current.value);
            else if (
              value == undefined &&
              ((minValue && Number(ref.current.value) > minValue) || !minValue)
            )
              ref.current.stepDown();
            else if (
              value != undefined &&
              ((minValue && Number(toggleValue) > minValue) || !minValue)
            )
              setToggleValue(Number(toggleValue) - 1);
            if (
              onBlur &&
              value == undefined &&
              ((minValue && Number(ref.current.value) > minValue) || !minValue)
            )
              onBlur(Number(ref.current.value) - 1);
            else if (
              onBlur &&
              value != undefined &&
              ((minValue && Number(toggleValue) > minValue) || !minValue)
            )
              onBlur(Number(toggleValue) - 1);
          }}
        />
        <input
          ref={ref}
          className={styles.input}
          disabled={disabled}
          // prefix={
          //   <MinusOutlined
          //     style={{
          //       cursor: "pointer",
          //       userSelect: "none",
          //       opacity: disabledMinus ? 0.5 : 1,
          //     }}
          //     onClick={(event) => {
          //       event.stopPropagation();
          //       if (disabledMinus) return false;
          //       if (handleMinusClick) handleMinusClick();
          //       else ref.current.input.stepDown();
          //     }}
          //   />
          // }
          // suffix={
          //   <PlusOutlined
          //     style={{
          //       cursor: "pointer",
          //       userSelect: "none",
          //       opacity: disabledPlus ? 0.5 : 1,
          //     }}
          //     onClick={(event) => {
          //       event.stopPropagation();
          //       if (disabledPlus) return false;
          //       if (handlePlusClick) handlePlusClick();
          //       else ref.current.input.stepUp();
          //     }}
          //   />
          // }
          type="number"
          defaultValue={defaultValue}
          value={toggleValue}
          // value={value || togglevalue}
          // pattern="[0-9]*"
          onChange={(eve) => {
            console.log(
              "e.target.value",
              eve.target.value,
              value,
              Number(eve.target.value)
            );
            if (value != undefined && !onChange) setToggleValue(eve.target.value);
            if (onChange) onChange(eve.target.value);
            // setToggleValue();
            test(eve.target.value);
          }}
          onKeyDown={(e: any) => {
            if (!/^[0-9.-]+$/.test(e.key) && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
          onBlur={() => {
            // e.preventDefault();
            console.log("ref.current", ref.current);
            if (errorMessage) {
              if (value == undefined) ref.current.value = defaultValue;
              else if (value != undefined) setToggleValue(value);
              test(String(defaultValue));
            } else {
              if (onBlur && value == undefined) onBlur(ref.current.value - 1);
              else if (onBlur && value != undefined)
                onBlur(Number(toggleValue));
            }
          }}
          min={minValue}
          max={maxValue}
          step={step}
        />
        <PlusOutlined
          style={{
            cursor: "pointer",
            userSelect: "none",
            opacity: disabledPlus ? 0.5 : 1,
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (disabledPlus) return false;
            if (handlePlusClick) handlePlusClick(ref.current.value);
            else if (handleToggle) handleToggle(ref.current.value);
            else if (
              value == undefined &&
              ((maxValue && Number(ref.current.value) < maxValue) || !maxValue)
            )
              ref.current.stepUp();
            else if (
              value != undefined && !onBlur &&
              ((maxValue && Number(toggleValue) < maxValue) || !maxValue)
            )
              setToggleValue(Number(toggleValue) + 1);
            if (
              onBlur &&
              value == undefined &&
              ((maxValue && Number(ref.current.value) < maxValue) || !maxValue)
            )
              onBlur(Number(ref.current.value) + 1);
            else if (
              onBlur &&
              value != undefined &&
              ((maxValue && Number(toggleValue) < maxValue) || !maxValue)
            )
              onBlur(Number(toggleValue) + 1);
          }}
        />
      </div>
      <p
        style={{
          fontSize: 12,
          color: "red",
          height: errorMessage ? 18 : 0,
          transition: "height 0.3s ease-in",
        }}
      >
        {errorMessage}
      </p>
    </div>
  );
}
