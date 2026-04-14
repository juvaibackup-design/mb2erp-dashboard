import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Flex, type InputProps, type InputRef } from "antd";
import { Input } from "antd/lib";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

interface InputPasswordProps extends Omit<InputProps, "suffix" | "type"> {
  label?: string;
  isrequired?: boolean;
  errormsg?: any;
  fullWidth?: boolean;
  confirmPassword?: boolean;
}

function InputPassword(props: InputPasswordProps, ref: Ref<InputRef>) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(false);
  const [textClass, setTextClass] = useState<string>(" hideText ");
  const inputRef = useRef<InputRef>(null);

  useImperativeHandle(
    ref,
    () => {
      const nativeElement = inputRef.current?.input || null;

      return {
        focus() {
          inputRef?.current?.focus();
        },
        blur() {
          inputRef.current?.blur();
        },
        scrollIntoView() {
          inputRef?.current?.input?.scrollIntoView();
        },
        select() {
          inputRef.current?.select();
        },
        setSelectionRange(start: number, end: number) {
          inputRef.current?.setSelectionRange(start, end);
        },
        get input() {
          return inputRef.current?.input || null;
        },
        hideText() {
          setVisible(false);
          setTextClass(" hideText ");
        },
        showText() {
          setVisible(true);
          setTextClass("");
        },
        nativeElement, // ✅ Required for InputRef type
      };
    },
    []
  );

  // useImperativeHandle(
  //   ref,
  //   () => {
  //     return {
  //       focus() {
  //         inputRef?.current?.focus();
  //       },
  //       blur() {
  //         inputRef.current?.blur();
  //       },
  //       scrollIntoView() {
  //         inputRef?.current?.input?.scrollIntoView();
  //       },
  //       select() {
  //         inputRef.current?.select();
  //       },
  //       setSelectionRange(start, end) {
  //         inputRef.current?.setSelectionRange(start, end);
  //       },
  //       get input() {
  //         return inputRef.current?.input || null;
  //       },
  //       hideText() {
  //         setVisible(false);
  //         setTextClass(" hideText ");
  //       },
  //       showText() {
  //         setVisible(true);
  //         setTextClass("");
  //       },
  //     };
  //   },
  //   []
  // );

  // Above return
  const computedSuffix = !props.confirmPassword ? (
    visible ? (
      <EyeOutlined
        onClick={() => {
          setVisible(false);
          setTextClass(" hideText ");
        }}
      />
    ) : (
      <EyeInvisibleOutlined
        onClick={() => {
          setVisible(true);
          setTextClass("");
        }}
      />
    )
  ) : null;

  return (
    <Flex gap={8} vertical style={{ width: props.fullWidth ? "100%" : "" }}>
      {props.label && (
        <p className="label">
          <span className="error">{props.isrequired ? "* " : null}</span>
          {t(`${props.label}`)}
        </p>
      )}
      <Input
        ref={inputRef}
        size={props.size}
        className={props.className + textClass}
        // placeholder={t(${placeholder})}
        placeholder={props.placeholder}
        prefix={props.prefix}
        // suffix={props.suffix}
        style={props.style}
        name={props.name}
        onChange={props.onChange}
        rootClassName={props.errormsg ? "errBorder" : props.rootClassName}
        value={props.value}
        addonAfter={props.addonAfter}
        addonBefore={props.addonBefore}
        onPressEnter={props.onPressEnter}
        disabled={props.disabled ? props.disabled : false}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        autoComplete="off"
        // visibilityToggle={{
        //   visible: props.passwordVisible,
        //   onVisibleChange: props.setPasswordVisible,
        // }}
        // suffix={
        //   visible ? (
        //     <EyeOutlined
        //       onClick={() => {
        //         setVisible(false);
        //         setTextClass(" hideText ");
        //       }}
        //     />
        //   ) : (
        //     <EyeInvisibleOutlined
        //       onClick={() => {
        //         setVisible(true);
        //         setTextClass("");
        //       }}
        //     />
        //   )
        // }
        suffix={computedSuffix}
      />
      {props.errormsg ? <p className="error">{props.errormsg}</p> : null}
    </Flex>
  );
}

export default forwardRef(InputPassword);
