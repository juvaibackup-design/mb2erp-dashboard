// "use client";
// import React, { useState } from "react";
// import { Select, Table } from "antd";

// const { Option } = Select;

// interface Props {
//   dataSource: any;
//   columns: any;
//   placeholder: string;
//   onSelectChange: any;
//   isMultiSelect: boolean;
// }
// // Reusable component
// const MultiSelectWithTable = ({
//   dataSource,
//   columns,
//   placeholder,
//   onSelectChange,
//   isMultiSelect,
// }: Props) => {
//   const [selectedNames, setSelectedNames] = useState<any>([]);

//   const handleRowClick = (record: any) => {
//     const selected = selectedNames.includes(record.name)
//       ? selectedNames.filter((name: any) => name !== record.name)
//       : [...selectedNames, record.name];
//     setSelectedNames(selected);
//     onSelectChange(selected); // Notify parent about the change
//   };

//   return (
//     <Select
//       {...(isMultiSelect && {
//         mode: "multiple",
//       })}
//       value={selectedNames}
//       style={{ width: 400 }}
//       placeholder={placeholder || "Select names"}
//       dropdownRender={() => (
//         <div style={{ padding: 8 }}>
//           <Table
//             dataSource={dataSource}
//             columns={columns}
//             pagination={false}
//             size="small"
//             rowClassName={(record) =>
//               selectedNames.includes(record.name) ? "selected-row" : ""
//             }
//             onRow={(record) => ({
//               onClick: () => handleRowClick(record),
//             })}
//           />
//         </div>
//       )}
//     >
//       {selectedNames.map((name: any) => (
//         <Option key={name}>{name}</Option>
//       ))}
//     </Select>
//   );
// };

// export default MultiSelectWithTable;

import { Flex, Select, Table } from "antd";
import { SelectProps } from "antd/es/select";
import React, { Ref, forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

type ExtendedDatePickerProps = Omit<
  SelectProps,
  "label" | "errormsg" | "isrequired" | "isVisible"
> & {
  // Add your additional props here
  name?: string;
  label?: string | undefined;
  errormsg?: string | undefined | any;
  isrequired?: boolean | undefined;
  isVisible?: boolean | undefined;
  dataSource?: any;
  columns?: any;
  placeholder?: string;
  onSelectChange?: any;
  isMultiSelect?: boolean;
};
const MySelect = forwardRef(function MultiSelectWithTable(
  props: ExtendedDatePickerProps = {
    isVisible: true,
  },
  ref: Ref<any>
) {
  // Provide default values here
  const {
    isVisible = true, // Default to true if not provided
    options,
    onSelectChange,
    ...restProps
  } = props;
  const { t } = useTranslation();
  const [selectValues, setSelectedValues] = useState<any>("");
  console.log("options", options);
  const handleRowClick = (record: any) => {
    console.log("Selected record:", record);
    setSelectedValues(record.label);
  };
  return (
    <>
      {(props.errormsg || props.label) && isVisible ? (
        <Flex gap={8} vertical style={{ width: "100%" }}>
          {props.label ? (
            <p className="label">
              {props.isrequired ? (
                <span style={{ color: "#f5222d" }}>* </span>
              ) : null}
              {t(`${props.label}`)}
            </p>
          ) : null}
          <Select
            {...restProps}
            ref={ref}
            value={selectValues}
            className={props.errormsg ? "selErrBorder" : props.className}
            dropdownRender={() => (
              <div style={{ height: "150px", overflowY: "auto" }}>
                <Table
                  columns={props.columns}
                  dataSource={options}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record), // Handle row click
                  })}
                />
              </div>
            )}
            // dropdownStyle={{ maxHeight: 500, overflowY: "auto" }}
            // dropdownClassName="custom-scroll"
          >
            {/* {props.children} */}
          </Select>
          {props.errormsg ? <p className="error">{props.errormsg}</p> : null}
        </Flex>
      ) : (
        isVisible && (
          <Select
            {...props}
            className={props.errormsg ? "selErrBorder" : props.className}
          >
            {props.children}
          </Select>
        )
      )}
    </>
  );
});

export default MySelect;
