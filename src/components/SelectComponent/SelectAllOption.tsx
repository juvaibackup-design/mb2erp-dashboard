// CustomSelectWithSelectAll.tsx
import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { Select, Space, Divider, SelectProps } from "antd";
import SelectComponent from "./SelectComponent";

const { Option } = Select;

interface CustomSelectWithSelectAllProps {
  name: string;
  label: string;
  options: Array<{ label: string; value: any }>;
  isrequired: boolean;
  errormsg: string;
  disabled: any;
}

const CustomSelectWithSelectAll: React.FC<CustomSelectWithSelectAllProps> = ({
  name,
  label,
  options,
  isrequired,
  errormsg,
  disabled,
  // ...restProps
}) => {
  const [filteredOption, setFilteredOption] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const { setFieldValue, values } = useFormikContext();

  const val: any = values;

  const handleChange = (selectedOptions: any) => {
    setFieldValue(name, selectedOptions);
  };

  const handleSelectAll = () => {
    const newValue = options?.filter((item) =>
      (item?.label ?? "").toLowerCase().includes(filteredOption.toLowerCase())
    );
    setSelectAll(!selectAll);
    if (!selectAll) {
      setFieldValue(name, newValue);
    } else {
      setFieldValue(name, []);
    }
  };

  return (
    <SelectComponent
      placeholder="Select"
      // {...restProps}
      filterOption={(input: any, option: any) => {
        setFilteredOption(input);
        const filteredItems = (option?.label ?? "")
          .toLowerCase()
          .includes(input.toLowerCase());
        return filteredItems;
      }}
      isrequired={isrequired}
      label={label}
      options={options}
      errormsg={errormsg}
      value={val?.[name]}
      dropdownRender={(menu) => (
        <>
          <Space style={{ padding: "4px 8px 4px" }}>
            <p onClick={handleSelectAll} style={{ cursor: "pointer" }}>
              {val?.[name]?.length === options?.length
                ? "Unselect All"
                : "Select All"}
            </p>
          </Space>
          <Divider style={{ margin: "4px 0 8px 0" }} />
          {menu}
        </>
      )}
      onChange={handleChange}
      onClear={() => {
        setFilteredOption("");
        setSelectAll(!selectAll);
      }}
      disabled={disabled}
    />
  );
};

export default CustomSelectWithSelectAll;
