import { useState } from "react";
import ButtonCheckboxComponent, {
  ButtonCheckboxComponentProps,
} from "./ButtonCheckboxComponent";

interface option
  extends Omit<ButtonCheckboxComponentProps, "children" | "onChange"> {
  label: any;
}

export default function ButtonGroupComponent({
  options,
  value,
  onChange,
  type,
}: {
  options: option[];
  value?: any;
  onChange?: Function;
  type: "radio" | "checkbox";
}) {
  const [selectedValues, setSelectedValues] = useState<any[]>(value);
  const [selectedValue, setSelectedValue] = useState<any>(value);
  function check(checked: boolean, value: any) {
    if (type == "checkbox")
      return checked
        ? setSelectedValues([...selectedValues, value])
        : setSelectedValues(selectedValues.filter((val) => val != value));
    else if (type == "radio")
      return checked ? setSelectedValue(value) : setSelectedValue(null);
  }
  return options.map(({ label, value, ...option }) => (
    <ButtonCheckboxComponent
      value={value}
      onChange={(checked, value) => check(checked, value)}
      checked={
        type == "radio"
          ? selectedValue == value
          : selectedValues.includes(value)
      }
      {...option}
    >
      {label}
    </ButtonCheckboxComponent>
  ));
}
