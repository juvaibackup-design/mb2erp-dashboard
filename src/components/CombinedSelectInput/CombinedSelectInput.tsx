

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Select, Input, Divider, Space, Button, Modal, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";

const { Option } = Select;

const CombinedSelectInput = (props: any) => {
  const MODES = {
    select: 1,
    input: 2,
  };

  const [mode, setMode] = useState(MODES.select); // 'select' or 'input'
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [selectedVal, setSelectedVal] = useState<any>(undefined);
  const [customOptions, setCustomOptions] = useState<any[]>([]);
  const inputRef = useRef<any>(null);

  const { options, fLabel, fValue, ProductName, Department, onSelect } = props;
  const Loader = useContext(LoaderContext);
  console.log("options::new", options);
  useEffect(() => {
    setSelectedVal(ProductName);
    // setCustomOptions(options || []);
  }, [ProductName, Department]);
  console.log("customOptions", customOptions);

  const handleSelectChange = (value: any) => {
    if (!Department) {
      setSelectedVal(undefined);
      alert("Please Select Department");
      return;
    }
    setSelectedVal(value);
    onSelect(value);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };
  const addItem = () => {
    console.log("options", options);
    if (!inputValue || !inputValue.trim()) return;

    // Combine options and customOptions for duplicate check
    const allOptions = [
      ...(Array.isArray(options) ? options : []),
      ...(Array.isArray(customOptions) ? customOptions : []),
    ];


    const isDuplicate = Boolean(
      allOptions.filter(
        (option) =>
          String(option.item_name)?.toLowerCase() ===
          inputValue.trim().toLowerCase()
      ).length
    );

    if (isDuplicate) {
      Modal.warning({
        title: "Item already exists!",
      });
      setInputValue(""); // Clear the input field
      return;
    }

    // Add new option
    const newOption = { [fLabel]: inputValue, [fValue]: inputValue };
    setCustomOptions((prev) => [...prev, newOption]);
    setSelectedVal(inputValue);
    onSelect(inputValue);
    // setInputValue(inputValue); // Maintain the current input value

    setInputValue(""); // Clear input field
    inputRef.current?.focus(); // Focus input for further entries
  };



  return (
    <div>
      <Select
        placeholder="Select"
        disabled={!Boolean(Department)}
        onChange={handleSelectChange}
        labelInValue
        showSearch
        value={selectedVal}
        options={options}
        style={{ width: "100%" }}
        popupMatchSelectWidth={false}   // 👈 replaces dropdownMatchSelectWidth
        styles={{
          popup: {
            root: {
              minWidth: 450,   // 👈 increase dropdown width
            },
          },
        }}
        fieldNames={{
          label: options.label,
          value: options.value,
        }}
        dropdownRender={(menu) => (
          <>
            <Flex style={{ padding: "5px" }}>
              <Input
                ref={inputRef}
                value={inputValue}
                placeholder="Add new item"
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") {
                    addItem();
                  }
                }}
              />
              {/* <Button
                type="text"
                // icon={<PlusOutlined />}
                onClick={addItem}
                disabled={!inputValue?.trim()}
              > */}
              {/* Add item */}
              {/* </Button> */}
            </Flex>
            <Divider style={{ margin: "4px 0" }} />
            {menu}
          </>
        )}
        optionFilterProp="label"   // 👈 must match the fieldNames.label
        filterOption={(input, option) => {
          const label = String(option?.label ?? ""); // since fieldNames.label = "label"
          return label.toLowerCase().includes(input.toLowerCase());
        }}
      // optionFilterProp="children"
      // filterOption={(input, option) => {
      //   const label = String(option?.[fLabel] ?? ""); // Ensure label is a string
      //   return label.toLowerCase().includes(input.toLowerCase());
      // }}
      // This will position the dropdown towards the top
      />
    </div>
  );
};

export default CombinedSelectInput;
