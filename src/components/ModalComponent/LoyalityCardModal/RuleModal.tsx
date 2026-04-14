// React imports
import React, { useEffect, useState } from "react";

// Third-party library imports
import { Flex, Row, Col } from "antd";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

// Local imports from the project
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import InputComponent from "@/components/InputComponent/InputComponent";
import InputNumberComponent from "@/components/InputComponent/InputNumberComponent";
import ModalComponent from "../ModalComponent";
import { Rule } from "@/lib/interfaces/retail-interface/loyaltyCardInterface";
import styles from "./RuleModal.module.css";

interface RuleModalProps {
  openModal: boolean;
  setOpenModal?: Function;
  modalKey: string | number;
  onClose: React.MouseEventHandler<HTMLElement>;
  setRuleSetting: Function;
  ruleBasedOn: string[] | string | undefined;
  ruleSetting: any;
  valueRef: any;
  resetModelRef: any;
  saveRef: any;
}

interface InitialValues {
  key?: string | number;
  value_from: number | null;
  value_to: number | null;
  walkin_from: number | null;
  walkin_to: number | null;
  period_from: number | null;
  period_to: number | null;

}

export default function RuleModal({
  openModal,
  setOpenModal,
  onClose,
  setRuleSetting,
  modalKey,
  ruleBasedOn,
  ruleSetting,
  valueRef,
  resetModelRef,
  saveRef,
}: RuleModalProps) {
  const { t } = useTranslation();

  const [initialValues, setInitialValues] = useState<InitialValues>({
    value_from: null,
    value_to: null,
    walkin_from: null,
    walkin_to: null,
    period_from: null,
    period_to: null,
  });

  useEffect(() => {
    if (ruleSetting.length >= 1 && typeof modalKey === "number") {
      const data = ruleSetting.filter((rule: Rule) => rule.key === modalKey);
      setInitialValues(data?.[0]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleSetting]);

  const validationSchema = Yup.object().shape({
    value_from: Yup.number()
      .nullable()
      // .max(99999, t("Maximum value exceeded"))
      .when([], (value, schema) => {
        const propContainsInvoice = ruleBasedOn?.includes("Invoice");
        return propContainsInvoice
          ? schema.required(t("requiredField")).min(1, t(`Minimum value is 1`))
          : schema;
      }),
    value_to: Yup.number()
      .nullable()
      // .max(99999, t("Maximum value exceeded"))
      .when(["value_from"], (value, schema) => {
        const propContainsInvoice = ruleBasedOn?.includes("Invoice");
        return propContainsInvoice
          ? schema
            .required(t("requiredField"))
            .min(value[0] + 1, `Minimum value is ${value[0] + 1 || 1}`)
          : schema;
      }),
    // walkin_from: Yup.string()
    //   .nullable()
    //   // .max(99998, t("Maximum value exceeded"))
    //   .when([], (array, schema) => {
    //     const propContainsInvoice = ruleBasedOn?.includes("Walk-in");
    //     return propContainsInvoice
    //       ? schema
    //           .required(t("requiredField"))
    //           .test(
    //             "isValid",
    //             t("Maximum value exceeded"),
    //             (value) => Number(value) < 99998
    //           )
    //       : schema;
    //   }),
    // // .min(1, t("Minimum value is 1")),
    // walkin_to: Yup.string()
    //   .nullable()
    //   .when(["walkin_from"], (value, schema) => {
    //     console.log("walkin_from", value);
    //     const propContainsInvoice = ruleBasedOn?.includes("Walk-in");
    //     return propContainsInvoice
    //       ? schema
    //           .required(t("requiredField"))
    //           // .min(
    //           //   value[0] === "0" ? 1 : Number(value[0]) + 1,
    //           //   `Minimum value is ${Number(value[0]) + 1 || 1}`
    //           // )
    //           .test(
    //             "isValid",
    //             `Minimum value is ${Number(value[0]) + 1 || 1}`,
    //             (value) => Number(value) > 0
    //           )
    //       : schema;
    //   }),
    walkin_from: Yup.number()
      .nullable()
      .max(99999, t("Maximum value exceeded"))
      .when([], (array, schema) => {
        const propContainsInvoice = ruleBasedOn?.includes("Walk-in");
        return propContainsInvoice
          ? schema.required(t("requiredField"))
          : schema;
      })
      .min(1, t("Minimum value is 1")),
    walkin_to: Yup.number()
      .nullable()
      .max(99999, t("Maximum value exceeded"))
      .when(["walkin_from"], (value, schema) => {
        const propContainsInvoice = ruleBasedOn?.includes("Walk-in");
        return propContainsInvoice
          ? schema
            .required(t("requiredField"))
            .min(value[0] + 1, `Minimum value is ${value[0] + 1 || 1}`)
          : schema;
      }),

    // period_from: Yup.string()
    //   .nullable()
    //   // .max(99999, t("Maximum value exceeded"))
    //   .when([], (array, schema) => {
    //     const propContainsInvoice = ruleBasedOn?.includes("Period");
    //     return propContainsInvoice
    //       ? schema
    //           .required(t("requiredField"))
    //           .test("isZero", t("Minimum value is 1"), (value) => {
    //             console.log("value::", typeof value);
    //             return value !== "0";
    //           })
    //       : schema;
    //   }),
    // .test("isZero", t("Minimum value is 1"), (value) => value == "0")
    // .min(1, t("Minimum value is 1"))
    // period_to: Yup.string()
    //   .nullable()
    //   // .max(99999, t("Maximum value exceeded"))
    //   .when(["period_from"], (value, schema) => {
    //     const propContainsInvoice = ruleBasedOn?.includes("Period");
    //     return propContainsInvoice
    //       ? schema
    //           .required(t("requiredField"))
    //           .min(
    //             Number(value[0]) + 1,
    //             `Minimum value is ${Number(value[0]) + 1 || 1}`
    //           )
    //       : schema;
    //   }),
    period_from: Yup.number()
      .nullable()
      // .max(99999, t("Maximum value exceeded"))
      .when([], (array, schema) => {
        const propContainsInvoice = ruleBasedOn?.includes("Period");
        return propContainsInvoice
          ? schema.required(t("requiredField"))
          : schema;
      })
      .min(1, t("Minimum value is 1")),
    period_to: Yup.number()
      .nullable()
      // .max(99999, t("Maximum value exceeded"))
      .when(["period_from"], (value, schema) => {
        const propContainsInvoice = ruleBasedOn?.includes("Period");
        return propContainsInvoice
          ? schema
            .required(t("requiredField"))
            .min(value[0] + 1, `Minimum value is ${value[0] + 1 || 1}`)
          : schema;
      }),
  });

  const handleSubmit = (values: InitialValues) => {
    console.log("modalKey", modalKey);
    let updateRule;
    let newRule;
    if (ruleSetting.length) {
      updateRule = ruleSetting.map((rule: any) => {
        if (rule.key === modalKey) {
          return {
            ...rule,
            ...values,
            key: modalKey,
          };
        }
        return rule;
      });
    }
    if (typeof modalKey === "string") {
      updateRule = [...ruleSetting, { ...values, key: modalKey }];
    }

    console.log("updateRule", updateRule);
    setRuleSetting(updateRule);
    setOpenModal?.({});
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  // const handleChange = (
  //   name: string,
  //   value: string | number | undefined | null
  // ) => {
  //   console.log("typeof value::", typeof value);
  //   const numbersOnly =
  //     typeof value === "string" ? value?.replace(/\D/g, "") : "";
  //   const sanitizedValue = /^\d{0,10}$/.test(numbersOnly) ? numbersOnly : "";
  //   if (
  //     name === "walkin_from" ||
  //     name === "walkin_to" ||
  //     name === "period_from" ||
  //     name === "period_to"
  //   ) {
  //     formik.setFieldValue(
  //       name,
  //       sanitizedValue !== null ? sanitizedValue : null
  //     );
  //   } else {
  //     formik.setFieldValue(name, value !== null ? value : null);
  //   }
  // };

  const handleChange = (name: string, value: number | undefined | null) => {
    formik.setFieldValue(name, value !== null ? value : undefined);
  };

  const handleReset = () => {
    formik.resetForm();
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  return (
    <ModalComponent
      showModal={openModal}
      setShowModal={() => setOpenModal}
      title={t("Rule Settings")}
      closeIcon={false}
      footer={null}
      width={477}
      // className="custom-modal-global"
      onCloseModalCustom={(e) => {
        onClose(e);
        if (Object.keys(formik.errors).length >= 1) {
          formik.resetForm();
        }
      }}
      centered={true}
      style={{ zIndex: 9999 }}
    >
      <Flex>
        <Flex vertical gap={12}>
          <form
            onSubmit={
              formik.handleSubmit as (
                e: React.FormEvent<HTMLFormElement>
              ) => void
            }
          >
            <Flex vertical={true} gap={12}>
              <Row gutter={[24, 0]}>
                <Col span={24} style={{ margin: "6px" }}>
                  <Flex vertical gap={8} ref={valueRef}>
                    <label>{t("Value")}</label>
                    <Row gutter={[8, 0]}>
                      <Col span={12}>
                        <InputNumberComponent
                          type="number"
                          name="value_from"
                          className="fullWidth"
                          value={formik.values.value_from}
                          onBlur={formik.handleBlur}
                          placeholder="00"
                          onChange={(value) => {
                            handleChange(
                              "value_from",
                              typeof value === "number" ? value : null
                            );
                          }}
                          onKeyPress={handleKeyPress}
                          // isRestrictDecimal={modalKey === "number" ? true : false}
                          // formik={formik}
                          // maxLength={2}
                          errormsg={
                            formik.touched.value_from &&
                              formik.errors.value_from
                              ? formik.errors.value_from
                              : ""
                          }
                          disabled={!ruleBasedOn?.includes("Invoice")}
                        />
                      </Col>
                      <Col span={12}>
                        <InputNumberComponent
                          type="number"
                          name="value_to"
                          className="fullWidth"
                          value={formik.values.value_to}
                          onChange={(value) => {
                            handleChange(
                              "value_to",
                              typeof value === "number" ? value : null
                            );
                          }}
                          onKeyPress={handleKeyPress}
                          // formik={formik}
                          // isRestrictDecimal={modalKey === "number" ? true : false}
                          onBlur={formik.handleBlur}
                          placeholder="00"
                          errormsg={
                            formik.touched.value_to && formik.errors.value_to
                              ? formik.errors.value_to
                              : ""
                          }
                          disabled={!ruleBasedOn?.includes("Invoice")}
                        />
                      </Col>
                    </Row>
                  </Flex>
                </Col>
                <Col span={24} style={{ margin: "6px" }}>
                  <Flex vertical gap={8}>
                    <label>{t("Walk in")}</label>
                    <Row gutter={[8, 0]}>
                      <Col span={12}>
                        <InputComponent
                          type="text"
                          name="walkin_from"
                          value={formik.values.walkin_from}
                          className="fullWidth"
                          // onChangeEvent={(e) => {
                          //   handleChange(
                          //     "walkin_from",
                          //     e.target.value
                          //     // typeof value === "number" ? value : null
                          //   );
                          // }}
                          onChangeEvent={(e) => {
                            const value = e.target.value;
                            if (!/^\d*$/.test(value) || value.length > 5) {
                              return;
                            }
                            formik.handleChange(e);
                          }}
                          // formik={formik}
                          maxLength={5}
                          // changeOnWheel={false}
                          onBlur={formik.handleBlur}
                          placeholder="00"
                          errormsg={
                            formik.touched.walkin_from &&
                              formik.errors.walkin_from
                              ? formik.errors.walkin_from
                              : ""
                          }
                          disabled={!ruleBasedOn?.includes("Walk-in")}
                        />
                        {/* <InputNumberComponent
                          type="text"
                          name="walkin_from"
                          value={formik.values.walkin_from}
                          className="fullWidth"
                          onChange={(value) => {
                            handleChange(
                              "walkin_from",
                              typeof value === "number" ? value : null
                            );
                          }}
                          onKeyPress={handleKeyPress}
                          onBlur={formik.handleBlur}
                          placeholder="00"
                          errormsg={
                            formik.touched.walkin_from &&
                            formik.errors.walkin_from
                              ? formik.errors.walkin_from
                              : ""
                          }
                          maxLength={5}
                          disabled={!ruleBasedOn?.includes("Walk-in")}
                        /> */}
                      </Col>
                      <Col span={12}>
                        <InputComponent
                          type="text"
                          name="walkin_to"
                          // changeOnWheel={false}
                          value={formik.values.walkin_to}
                          className="fullWidth"
                          // onChangeEvent={(e) => {
                          //   handleChange(
                          //     "walkin_to",
                          //     e.target.value
                          //     // typeof value === "number" ? value : null
                          //   );
                          // }}
                          onChangeEvent={(e) => {
                            const value = e.target.value;
                            if (!/^\d*$/.test(value) || value.length > 5) {
                              return;
                            }
                            formik.handleChange(e);
                          }}
                          maxLength={5}
                          onBlur={formik.handleBlur}
                          placeholder="00"
                          errormsg={
                            formik.touched.walkin_to && formik.errors.walkin_to
                              ? formik.errors.walkin_to
                              : ""
                          }
                          disabled={!ruleBasedOn?.includes("Walk-in")}
                        />
                        {/* <InputNumberComponent
                          type="text"
                          name="walkin_to"
                          value={formik.values.walkin_to}
                          className="fullWidth"
                          onChange={(value) => {
                            handleChange(
                              "walkin_to",
                              typeof value === "number" ? value : null
                            );
                          }}
                          onKeyPress={handleKeyPress}
                          onBlur={formik.handleBlur}
                          placeholder="00"
                          errormsg={
                            formik.touched.walkin_to && formik.errors.walkin_to
                              ? formik.errors.walkin_to
                              : ""
                          }
                          maxLength={5}
                          disabled={!ruleBasedOn?.includes("Walk-in")}
                        /> */}
                      </Col>
                    </Row>
                  </Flex>
                </Col>
                <Col span={24} style={{ margin: "6px" }}>
                  <Flex vertical gap={8}>
                    <label>{t("Period")}</label>
                    <Row gutter={[8, 0]}>
                      <Col span={12}>
                        <InputComponent
                          type="text"
                          name="period_from"
                          value={formik.values.period_from}
                          className="fullWidth"
                          // onChangeEvent={(e) => {
                          //   handleChange(
                          //     "period_from",
                          //     typeof e === "number" ? e : null
                          //     // e.target.value
                          //   );
                          // }}
                          onChangeEvent={(e) => {
                            const value = e.target.value;
                            if (!/^\d*$/.test(value) || value.length > 5) {
                              return;
                            }
                            formik.handleChange(e);
                          }}
                          maxLength={5}
                          onBlur={formik.handleBlur}
                          placeholder="00"
                          errormsg={
                            formik.touched.period_from &&
                              formik.errors.period_from
                              ? formik.errors.period_from
                              : ""
                          }
                          disabled={!ruleBasedOn?.includes("Period")}
                        />
                        {/* <InputNumberComponent
                          type="text"
                          name="period_from"
                          value={formik.values.period_from}
                          className="fullWidth"
                          onChange={(value) => {
                            handleChange(
                              "period_from",
                              typeof value === "number" ? value : null
                            );
                          }}
                          onKeyPress={handleKeyPress}
                          maxLength={5}
                          onBlur={formik.handleBlur}
                          placeholder="00"
                          errormsg={
                            formik.touched.period_from &&
                            formik.errors.period_from
                              ? formik.errors.period_from
                              : ""
                          }
                          disabled={!ruleBasedOn?.includes("Period")}
                        /> */}
                      </Col>
                      <Col span={12}>
                        <InputComponent
                          type="text"
                          name="period_to"
                          value={formik.values.period_to}
                          className="fullWidth"
                          // onChangeEvent={(e) => {
                          //   handleChange(
                          //     "period_to",
                          //     // e.target.value
                          //     typeof e === "number" ? e : null
                          //   );
                          // }}
                          onChangeEvent={(e) => {
                            const value = e.target.value;
                            if (!/^\d*$/.test(value) || value.length > 5) {
                              return;
                            }
                            formik.handleChange(e);
                          }}
                          onBlur={formik.handleBlur}
                          maxLength={5}
                          placeholder="00"
                          errormsg={
                            formik.touched.period_to && formik.errors.period_to
                              ? formik.errors.period_to
                              : ""
                          }
                          disabled={!ruleBasedOn?.includes("Period")}
                        />
                        {/* <InputNumberComponent
                          type="number"
                          name="period_to"
                          value={formik.values.period_to}
                          className="fullWidth"
                          onChange={(value) => {
                            handleChange(
                              "period_to",
                              typeof value === "number" ? value : null
                            );
                          }}
                          onKeyPress={handleKeyPress}
                          maxLength={5}
                          onBlur={formik.handleBlur}
                          placeholder="00"
                          errormsg={
                            formik.touched.period_to && formik.errors.period_to
                              ? formik.errors.period_to
                              : ""
                          }
                          disabled={!ruleBasedOn?.includes("Period")}
                        /> */}
                      </Col>
                    </Row>
                  </Flex>
                </Col>
              </Row>
              <Flex justify="end" style={{ margin: "1rem 0 1rem 0" }}>
                <Flex>
                  <ButtonComponent
                    type="link"
                    className={styles.cancel_button}
                    onClickEvent={(e) => {
                      onClose(e);
                      if (Object.keys(formik.errors).length >= 1) {
                        formik.resetForm();
                      }
                    }}
                  >
                    {t("Cancel")}
                  </ButtonComponent>
                  <ButtonComponent
                    type="link"
                    className={styles.reset_button}
                    onClickEvent={handleReset}
                  >
                    <div ref={resetModelRef}>{t("Reset")}</div>
                  </ButtonComponent>
                  <ButtonComponent
                    type="primary"
                    htmlType="submit"
                    className={styles.save_button}
                  >
                    <div ref={saveRef}>{t("Save")}</div>
                  </ButtonComponent>
                </Flex>
              </Flex>
            </Flex>
          </form>
        </Flex>
      </Flex>
    </ModalComponent>
  );
}
