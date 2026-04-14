// components/SelectWithActions/SelectWithActions.tsx
import { Flex, Select, Input, Button, Space, Divider } from "antd";
import { SelectProps } from "antd/es/select";
import React, { Ref, forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "./CustomSelectWithActions.module.css";

type ExtendedSelectWithActionsProps = Omit<
  SelectProps,
  "label" | "errormsg" | "isrequired" | "isVisible"
> & {
  name?: string;
  label?: string;
  labelElement?: any;
  errormsg?: string;
  isrequired?: boolean;
  isVisible?: boolean;

  // actions
  onAdd?: () => void;
  onEdit?: (value: string | number) => void;
  showAddButton?: boolean;
  showEditButton?: boolean;
  searchPlaceholder?: string;
};

const SelectWithActions = forwardRef(function SelectWithActionsComponent(
  props: ExtendedSelectWithActionsProps,
  ref: Ref<any>
) {
  const {
    isVisible = true,
    showAddButton = true,
    showEditButton = true,
    onAdd,
    onEdit,
    searchPlaceholder = "Search...",
    value,
    options,
    ...restProps
  } = props;

  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  // ✅ ADD handler (FIXED)
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd?.();
  };

  // ✅ EDIT handler (FIXED)
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value !== undefined && value !== null) {
      onEdit?.(value);
    }
  };

  // ✅ Custom dropdown
  const dropdownRender = (menu: React.ReactElement) => (
    <div className={styles.dropdownContainer}>
      {/* Search */}
      <div className={styles.searchContainer}>
        <Input
          placeholder={t(searchPlaceholder)}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          allowClear
          className={styles.searchInput}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Options */}
      <div className={styles.optionsList}>{menu}</div>

      <Divider style={{ margin: "8px 0" }} />

      {/* Footer */}
      <div className={styles.footer}>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          {showAddButton && (
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className={styles.actionButton}
              size="small"
            >
              {t("Add")}
            </Button>
          )}

          {showEditButton && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={handleEdit}
              disabled={!value}
              className={styles.actionButton}
              size="small"
            >
              {t("Edit")}
            </Button>
          )}
        </Space>
      </div>
    </div>
  );

  const selectComponent = (
    <Select
      {...restProps}
      ref={ref}
      value={value}
      options={options} // ⭐ IMPORTANT FIX
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? "")
          .toString()
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      searchValue={searchValue}
      onSearch={setSearchValue}
      dropdownRender={dropdownRender}
      className={props.errormsg ? "selErrBorder" : props.className}
    />
  );

  return (
    <>
      {(props.errormsg || props.label || props.labelElement) && isVisible ? (
        <Flex gap={8} vertical style={{ width: "100%" }}>
          {props.label && (
            <p className="label">
              {props.isrequired && (
                <span style={{ color: "#f5222d" }}>* </span>
              )}
              {t(props.label)}
            </p>
          )}

          {props.labelElement && (
            <div className="label">{props.labelElement}</div>
          )}

          {selectComponent}

          {props.errormsg && <p className="error">{props.errormsg}</p>}
        </Flex>
      ) : (
        isVisible && selectComponent
      )}
    </>
  );
});

export default SelectWithActions;