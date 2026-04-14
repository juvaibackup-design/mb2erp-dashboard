import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import { UserRightsInterface } from "@/lib/interfaces/admin-interface/userRights";
import { Col, Collapse, Flex, Row } from "antd";
import React from "react";

interface InventoryProps {
  data: UserRightsInterface;
  setData: Function;
  stockPoint: any;
}

export default function Inventory({
  data,
  setData,
  stockPoint = [],
}: InventoryProps) {
  const securityFields = [
    {
      id: "1",
      name: "inv_dept_code",
      label: "Allow department code auto generate",
    },
    {
      id: "2",
      name: "inv_set_code",
      label: "Allow set code auto generate",
    },
    {
      id: "3",
      name: "inv_item_code",
      label: "Allow item code auto general",
    },
    {
      id: "4",
      name: "inv_allow_margin_rule_edit",
      label: "Allow margin rule edit (create item)",
    },
    {
      id: "5",
      name: "inv_customize",
      label: "Allow customization",
    },
    {
      id: "6",
      name: "inv_show_inventory_cat",
      label: "Show inventory category",
    },
    {
      id: "8",
      name: "inv_allow_eway_mandatory",
      label: "Allow eway mandatory",
    },
  ];

  const defaultStockPointOptions = stockPoint.map((stock: any) => {
    return {
      label: stock.stockpoint_name,
      value: String(stock.stockpoint_id),
    };
  });

  const defaultStockPointFields = [
    {
      id: "1",
      name: "inv_out_stkpt_list",
      label: "Inter stock transaction",
      component: "select",
      option: defaultStockPointOptions,
    },
    {
      id: "2",
      name: "inv_allow_receive_all",
      label: "Allow receive all",
      component: "checkbox",
    },
  ];

  const stockAuditfields = [
    {
      id: "1",
      name: "inv_allow_user_to_activate_stock_audit",
      label: "To activate",
      component: "checkbox",
    },

    {
      id: "3",
      name: "inv_allow_user_to_verify_stock_audit",
      label: "To verify",
      component: "checkbox",
    },
    {
      id: "2",
      name: "inv_allow_user_to_complete_stock_audit",
      label: "To complete",
      component: "checkbox",
    },
  ];

  const handleChange = (name: string, value: boolean) => {
    setData({ ...data, [name]: value });
  };

  return (
    <Flex vertical gap={10}>
      <Collapse
        collapsible="header"
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: "Security",
            children: (
              <Flex vertical gap={5}>
                {securityFields.map((item) => {
                  return (
                    <CheckboxComponent
                      key={item.id}
                      name={item.name}
                      checked={data[item.name]}
                      onChange={(e) =>
                        handleChange(item.name, e.target.checked)
                      }
                    >
                      {item.label}
                    </CheckboxComponent>
                  );
                })}
              </Flex>
            ),
          },
        ]}
      />
      <Collapse
        collapsible="header"
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: "Default Stock Point",
            children: (
              <Row gutter={[10, 0]}>
                {defaultStockPointFields.map((item) => {
                  if (item.component === "select") {
                    const value =
                      data?.[item.name] == 0 ? undefined : data?.[item.name];
                    return (
                      <Col key={item.id} span={12}>
                        <Row>
                          <Col span={9}>
                            <label>{item.label}</label>
                          </Col>
                          <Col span={15}>
                            <SelectComponent
                              options={item.option}
                              allowClear
                              mode="multiple"
                              value={value}
                              onChange={(value) =>
                                handleChange(item.name, value)
                              }
                              className="fullWidth"
                            />
                          </Col>
                        </Row>
                      </Col>
                    );
                  }
                  if (item.component === "checkbox") {
                    return (
                      <Col key={item.id} span={12}>
                        <Flex gap={10}>
                          <CheckboxComponent
                            checked={data[item.name]}
                            onChange={(e) =>
                              handleChange(item.name, e.target.checked)
                            }
                          />
                          <label>{item.label}</label>
                        </Flex>
                      </Col>
                    );
                  }
                })}
              </Row>
            ),
          },
        ]}
      />
      <Collapse
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: "Stock Audit Rights",
            children: (
              <Flex gap={8}>
                Allow User:
                {stockAuditfields.map((field) => {
                  if (field.component == "checkbox")
                    return (
                      <>
                        <label>{field.label}</label>
                        <CheckboxComponent
                          key={field.id}
                          name={field.name}
                          checked={data[field.name]}
                          onChange={(e) =>
                            handleChange(field.name, e.target.checked)
                          }
                        />
                      </>
                    );
                })}
              </Flex>
            ),
          },
        ]}
      />
    </Flex>
  );
}
