import { AutoComplete } from "antd";
import { BaseOptionType } from "antd/es/select";
import { CSSProperties, ReactNode } from "react";

interface AutoCompleteProps {
  allowClear?: boolean;
  autoFocus?: boolean;
  backfill?: boolean;
  bordered?: boolean;
  children?: ReactNode;
  defaultActiveFirstOption?: boolean;
  defaultOpen?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  popupClassName?: string;
  dropdownMatchSelectWidth?: boolean | number;
  filterOption?:
    | boolean
    | ((inputValue: string, option?: BaseOptionType) => boolean);
  notFoundContent?: string;
  open?: boolean;
  options?: { label: any; value: any }[];
  placeholder?: string;
  status?: "error" | "warning";
  value?: string;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onChange?: (
    value: string,
    option?: { label: any; value: any } | { label: any; value: any }[]
  ) => void;
  onDropdownVisibleChange?: (open: boolean) => void;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: { label: any; value: any }) => void;
  onClear?: () => void;
  style?: CSSProperties;
}

function AutoCompleteComponent(props: AutoCompleteProps) {
  return (
    <AutoComplete style={props.style} {...props}>
      {props.children}
    </AutoComplete>
  );
}

export default AutoCompleteComponent;
