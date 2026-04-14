import React, { useMemo, useRef, useState } from "react";
import {
  Button,
  Col,
  Collapse,
  ColorPicker,
  Flex,
  InputNumber,
  Radio,
  Row,
  Select,
  Tour,
} from "antd";
import { UserRightsInterface } from "@/lib/interfaces/admin-interface/userRights";
import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import { Color } from "antd/es/color-picker";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface PointOfSaleProps {
  data: UserRightsInterface;
  setData: Function;
  roundOff: any;
  returnMemoSelection: any;
  returnMemoMode: any;
  pointsBasedOn: any;
  blockMember: any;
  transactionHistory: any;
}

export default function PointOfSale({
  data,
  setData,
  roundOff = [],
  returnMemoSelection = [],
  returnMemoMode = [],
  pointsBasedOn = [],
  blockMember = [],
  transactionHistory = [],
}: PointOfSaleProps) {
  const [colorRgb, setColorRgb] = useState<Color | string>("rgb(22, 119, 255)");
  const [againstCashColorRgb, setAgainstCashColorRgb] = useState<
    Color | string
  >("rgb(22, 119, 255)");
  const { t } = useTranslation();

  const options = (array: any, label: any, value: any) => {
    const selectOption = array?.map((array: any) => {
      return {
        label: array[label],
        value: array[value],
      };
    });

    return selectOption.length >= 1 ? selectOption : [];
  };

  const roundOffOptions = options(roundOff, "value", "key");
  const returnMemoModeOptions = options(returnMemoMode, "value", "key");
  const returnMemoSelectionOptions = options(
    returnMemoSelection,
    "value",
    "key"
  );
  const pointsBasedOnOptions = options(pointsBasedOn, "value", "key");
  const blockMemberOptions = options(
    blockMember,
    "card_name",
    "card_type_code"
  );

  const transactionHistoryOptions = options(
    transactionHistory,
    "value",
    "value"
  );
  const refMap = useRef<Record<string, any>>({});
  const [openTour, setOpenTour] = useState(false);
  const [tourSteps, setTourSteps] = useState<any>([]);

  const descriptionMap: Record<string, string> = {
    pos_allow_manual_memo_disc:
      "Enables manual discounts at the invoice level.",
    pos_allow_hold_memo: "Allows holding invoices in POS.",
    pos_allow_item_disc: "Lets cashier apply discounts per item.",
    // ... add for all
  };


  const securityFields = [
    {
      id: "1",
      name: "pos_allow_manual_memo_disc",
      label: "Allow manual invoice level discount in cash invoice",
      component: "checkbox",
    },
    {
      id: "2",
      name: "pos_allow_hold_memo",
      label: "Allow hold invoice operation in cashmemo",
      component: "checkbox",
    },
    {
      id: "3",
      name: "pos_allow_item_disc",
      label: "Allow item level discount in cash invoice",
      component: "checkbox",
    },
    {
      id: "4",
      name: "pos_allow_promo_item_return",
      label: "Allow return of promotional item(against cash invoice)",
      component: "checkbox",
    },
    {
      id: "5",
      name: "pos_allow_drawer_view",
      label: "Allow viewing of drawer details in cash invoice",
      component: "checkbox",
    },
    {
      id: "6",
      name: "pos_allow_lookup",
      label: "Allow item lookup at barcode scanning field",
      component: "checkbox",
    },
    {
      id: "7",
      name: "pos_allow_customer_ledger",
      label: "Allow customer ledger selection",
      component: "checkbox",
    },
    {
      id: "8",
      name: "pos_allow_tender_amount",
      label: "Tender(paid) Amount in cash invoice is mandatory",
      component: "checkbox",
    },
    {
      id: "9",
      name: "pos_allow_negative_memo",
      label: "Allow negative cash invoice(cash refund) entry",
      component: "checkbox",
    },
    {
      id: "10",
      name: "pos_generate_serial_no_userwise",
      label: "Generate logon user wise cash invoice number",
      component: "checkbox",
    },
  ];

  const cashMemoFields = [
    {
      id: "1",
      name: "pos_round_off",
      label: "Round off method",
      component: "select",
      option: roundOffOptions,
    },
    {
      id: "2",
      name: "pos_cash_memo_copies",
      label: "Number of copies to print",
      component: "inputNumber",
    },
    {
      id: "3",
      name: "pos_max_disc_percent",
      label: "Maximum disount allowed",
      component: "inputNumber",
    },
    {
      id: "14",
      name: "pos_max_disc_amount",
      label: "% or Rs",
      component: "inputNumber",
    },
    {
      id: "4",
      name: "pos_max_less_qty",
      label: "Maximum less quantity",
      component: "inputNumber",
    },
    {
      id: "5",
      name: "pos_max_amount",
      label: "Sales margin %",
      component: "inputNumber",
    },
  ];

  const returnMemoFields = [
    {
      id: "1",
      name: "pos_return_memo_mode",
      label: "Return/ Credit invoice mode",
      component: "select",
      option: returnMemoModeOptions,
    },
    {
      id: "2",
      name: "pos_max_refund_amount",
      label: "Maximum refund allowed",
      component: "inputNumber",
    },
    {
      id: "3",
      name: "pos_return_memo_copies",
      label: "Number of copies to print",
      component: "inputNumber",
    },
  ];
  const [checkboxState, setCheckboxState] = useState<{ [key: string]: boolean }>({});
  const [playButtonVisible, setPlayButtonVisible] = useState<{ [key: string]: boolean }>({});
  const handlePlayClick = (fieldName: string) => {
    const targetRef = refMap.current[fieldName];
    if (targetRef) {
      setTourSteps([
        {
          title: "Permission Info",
          description: "Description goes here.",
          target: () => targetRef,
          nextButtonProps: { children: "OK" },
        },
      ]);
      setOpenTour(true);
    }
  };
  const handleChange = (name: string, value: boolean | string) => {
    setData({ ...data, [name]: value });
    if (value !== undefined) {
      setCheckboxState((prevState) => ({
        ...prevState,
        [name]: true, // Set true if checkbox is checked or changed
      }));
      setPlayButtonVisible((prevState) => ({
        ...prevState,
        [name]: !prevState[name], // Toggle visibility on each click
      }));
    }

  };

  const rgbString = useMemo(
    () => (typeof colorRgb === "string" ? colorRgb : colorRgb.toRgbString()),
    [colorRgb]
  );

  const rgbStringTwo = useMemo(
    () =>
      typeof againstCashColorRgb === "string"
        ? againstCashColorRgb
        : againstCashColorRgb.toRgbString(),
    [againstCashColorRgb]
  );

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
              <Row>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 13 }}>
                  <Flex vertical gap={5}>
                    <>
                      {securityFields.slice(0, 15).map((field) => {
                        if (field.component === "checkbox") {
                          return (
                            <div
                              key={field.id}
                              ref={(el) => (refMap.current[field.name] = el)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <CheckboxComponent
                                checked={data[field.name]}
                                onChange={(e) =>
                                  handleChange(field.name, e.target.checked)
                                }
                              >
                                {field.label}
                              </CheckboxComponent>
                              {/* {playButtonVisible[field.name] && (
                                <Button
                                  icon={<PlayCircleOutlined />}
                                  size="small"
                                  onClick={() => handlePlayClick(field.name)}
                                  style={{
                                    border: "none",
                                    boxShadow: "none",
                                    background: "transparent",
                                    // outline: "none",
                                  }}

                                />
                              )} */}
                            </div>
                          );
                        }
                      })}

                      {/* Ant Design Tour Component */}
                      <Tour
                        open={openTour}
                        onClose={() => setOpenTour(false)}
                        steps={tourSteps}
                        closeIcon={false}
                      />
                    </>

                    {/* <Flex align="center" gap={5}>
                      <CheckboxComponent
                        checked={data.pos_ds_color_apply}
                        onChange={(e) =>
                          handleChange("pos_ds_color_apply", e.target.checked)
                        }
                      >
                        DS Color
                      </CheckboxComponent>
                      <ColorPicker
                        format="rgb"
                        value={colorRgb}
                        onChange={(color) => {
                          const rgb = color.toRgbString();
                          handleChange("pos_ds_color1", rgb);
                          setColorRgb(rgb);
                        }}
                      />
                      <span>{rgbString}</span>
                    </Flex>
                    <Flex align="center" gap={5}>
                      <CheckboxComponent
                        checked={data.pos_against_cash_color_apply}
                        onChange={(e) =>
                          handleChange("pos_against_cash_color_apply", e.target.checked)
                        }
                      >
                        Against cash
                      </CheckboxComponent>
                      <ColorPicker
                        format="rgb"
                        value={againstCashColorRgb}
                        onChange={(color) => {
                          const rgb = color.toRgbString();
                          console.log('rgb', rgb)
                          handleChange("pos_against_cash_color1", rgb);
                          setAgainstCashColorRgb(rgb);
                        }}
                      />
                      <span>{rgbStringTwo}</span>
                    </Flex> */}
                  </Flex>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 11 }}>
                  <Flex vertical gap={5}>
                    {securityFields.slice(15).map((field) => {
                      if (field.component === "checkbox") {
                        return (
                          <div
                            key={field.id}
                            ref={(el) => (refMap.current[field.name] = el)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <CheckboxComponent
                              key={field.id}
                              checked={data[field.name]}
                              onChange={(e) =>
                                handleChange(field.name, e.target.checked)
                              }
                            >
                              {field.label}
                            </CheckboxComponent>
                            {/* {playButtonVisible[field.name] && (
                              <Button
                                icon={<PlayCircleOutlined />}
                                size="small"
                                onClick={() => handlePlayClick(field.name)}
                                style={{
                                  border: "none",
                                  boxShadow: "none",
                                  background: "transparent",
                                }}
                              />
                            )} */}
                          </div>
                        );
                      }
                      if (field.component === "select") {
                        return (
                          <div
                            key={field.id}
                            ref={(el) => (refMap.current[field.name] = el)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Flex key={field.id} gap={10} align="center">
                              <label>{field.label}</label>
                              <Select
                                // className="fullWidth"
                                value={data[field.name]}
                                style={{ width: "100%", marginTop: "5px" }}
                                onChange={(value) =>
                                  handleChange(field.name, value)
                                }
                                // options={field.option}
                              />

                              {/* <Button
                                icon={<PlayCircleOutlined />}
                                size="small"
                                onClick={() => handlePlayClick(field.name)}
                                style={{
                                  border: "none",
                                  boxShadow: "none",
                                  background: "transparent",
                                }}
                              /> */}

                            </Flex>
                          </div>
                        );
                      }
                    })}
                  </Flex>
                </Col>
              </Row>
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
            label: "Cash Invoice Settings",
            children: (
              <Flex vertical gap={5}>
                {cashMemoFields.slice(0, 2).map((field) => {
                  if (field.component === "select") {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Flex key={field.id} gap={10} align="center">
                          <label>{field.label}</label>
                          <Select
                            // className="fullWidth"
                            value={data[field.name]}
                            style={{ width: "100%", marginTop: "5px" }}
                            onChange={(value) => handleChange(field.name, value)}
                            options={field.option}
                          />

                          {/* <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          /> */}

                        </Flex>
                      </div>
                    );
                  }
                  if (field.component === "inputNumber") {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Flex key={field.id} gap={10} align="center">
                          <label>{field.label}</label>
                          <InputNumber
                            type="number"
                            value={data[field.name]}
                            onChange={(value) => handleChange(field.name, value)}
                          />

                          {/* <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          /> */}

                        </Flex>
                      </div>
                    );
                  }
                })}
                <Flex gap={10}>
                  {cashMemoFields.slice(2, 4).map((field) => {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div key={field.id}>
                          <label className="paddingRight">{field.label}</label>
                          <InputNumber
                            type="number"
                            value={data[field.name]}
                            onChange={(value) => handleChange(field.name, value)}
                          />

                          {/* <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          /> */}

                        </div>
                      </div>
                    );
                  })}
                </Flex>
                <Flex gap={10}>
                  {cashMemoFields.slice(4, 6).map((field) => {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div key={field.id}>
                          <label className="paddingRight">{field.label}</label>
                          <InputNumber
                            type="number"
                            value={data[field.name]}
                            onChange={(value) => handleChange(field.name, value)}
                          />

                          {/* <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          /> */}

                        </div>
                      </div>
                    );
                  })}
                </Flex>
                {cashMemoFields.slice(6).map((field) => {
                  if (field.component === "checkbox") {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <CheckboxComponent
                          key={field.id}
                          checked={data[field.name]}
                          onChange={(e) =>
                            handleChange(field.name, e.target.checked)
                          }
                        >
                          {field.label}
                        </CheckboxComponent>
                        {/* {playButtonVisible[field.name] && (
                          <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          />
                        )} */}
                      </div>
                    );
                  }
                  if (field.component === "select") {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Flex key={field.id} gap={10} align="center">
                          <label>{field.label}</label>
                          <Select
                            // className="fullWidth"
                            value={data[field.name]}
                            style={{ width: "30%", marginTop: "5px" }}
                            onChange={(value) => handleChange(field.name, value)}
                            options={field.option}
                          />

                          {/* <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          /> */}

                        </Flex>
                      </div>
                    );
                  }
                  if (field.component === "inputNumber") {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Flex key={field.id} gap={10} align="center">
                          <label>{field.label}</label>
                          <InputNumber
                            type="number"
                            value={data[field.name]}
                            onChange={(value) => handleChange(field.name, value)}
                          />

                          {/* <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          /> */}

                        </Flex>
                      </div>
                    );
                  }
                  if (field.component === "radio") {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Flex key={field.id} gap={5}>
                          <label>{field.label}</label>
                          <Radio.Group
                            onChange={(e) =>
                              handleChange(field.name, e.target.value)
                            }
                            value={data[field.name]}
                          >
                            <Radio value={true}>{t("Yes")}</Radio>
                            <Radio value={false}>{t("No")}</Radio>
                          </Radio.Group>

                          {/* <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          /> */}

                        </Flex>
                      </div>
                    );
                  }
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
            label: "Return Invoice Setting",
            children: (
              <Flex vertical gap={5}>
                {returnMemoFields.map((field) => {
                  if (field.component === "checkbox") {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <CheckboxComponent
                          key={field.id}
                          checked={data[field.name]}
                          onChange={(e) =>
                            handleChange(field.name, e.target.checked)
                          }
                        >
                          {field.label}
                        </CheckboxComponent>
                        {/* {playButtonVisible[field.name] && (
                          <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          />
                        )} */}
                      </div>
                    );
                  }
                  if (field.component === "select") {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Flex key={field.id} gap={10} align="center">
                          <label>{field.label}</label>
                          <Select
                            // className="fullWidth"
                            value={data[field.name]}
                            style={{ width: "30%", marginTop: "5px" }}
                            onChange={(value) => handleChange(field.name, value)}
                            options={field.option}
                          />

                          {/* <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          /> */}

                        </Flex>
                      </div>
                    );
                  }
                  if (field.component === "inputNumber") {
                    return (
                      <div
                        key={field.id}
                        ref={(el) => (refMap.current[field.name] = el)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Flex key={field.id} gap={10} align="center">
                          <label>{field.label}</label>
                          <InputNumber
                            type="number"
                            value={data[field.name]}
                            onChange={(value) => handleChange(field.name, value)}
                          />

                          {/* <Button
                            icon={<PlayCircleOutlined />}
                            size="small"
                            onClick={() => handlePlayClick(field.name)}
                            style={{
                              border: "none",
                              boxShadow: "none",
                              background: "transparent",

                            }}
                          /> */}

                        </Flex>
                      </div>
                    );
                  }
                })}
              </Flex>
            ),
          },
        ]}
      />
    </Flex>
  );
}
