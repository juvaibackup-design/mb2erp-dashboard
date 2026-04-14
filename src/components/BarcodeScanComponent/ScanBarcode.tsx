import React, { useRef } from "react";
import InputComponent from "@/components/InputComponent/InputComponent";
import { useTranslation } from "react-i18next";

interface BarCodeSearchProps {
  widthValue?: string;
  onChange: React.KeyboardEventHandler<HTMLInputElement>;
  inputVal: string;
  onChangeInput: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean | undefined;
  ref?: any;
}
const ScanBarcode: React.FC<{ barCodeSearch: BarCodeSearchProps }> = ({
  barCodeSearch,
}) => {
  const { t } = useTranslation();

  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent default form submission if needed
    if (barCodeSearch.onChange) {
      barCodeSearch.onChange(e); // Call the onChange handler if it exists
    }
  };
  return (
    <div>
      <InputComponent
        ref={barCodeSearch.ref}
        placeholder={t("Scan barcode")}
        style={{ width: barCodeSearch.widthValue }}
        allowClear
        onPressEnter={handlePressEnter}
        onChangeEvent={barCodeSearch.onChangeInput}
        size="middle"
        type="text"
        disabled={barCodeSearch.disabled}
        value={barCodeSearch.inputVal.toUpperCase()}
      />
    </div>
  );
};
export default ScanBarcode;
