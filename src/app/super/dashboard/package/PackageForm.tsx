"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Checkbox } from "antd";
import { useRouter } from "next/navigation";
import styles from "@/app/super/dashboard/package/package.module.css";
import InputComponent from "@/components/InputComponent/InputComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import Header from "@/components/Header/Header";
import { CrownOutlined, DeleteOutlined } from "@ant-design/icons";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";

interface Props {
  type: "create" | "edit";
  packageId?: number;
}

interface Country {
  id: number;
  countryName: string;
  currencyCode: string;
}

interface CountryPrice {
  id: number;
  countryId?: number;
  countryName: string;
  currencyCode: string;
  listedPrice: string;
  resellerPrice: string;
  dealerPrice: string;
  distributorPrice: string;
}

interface FaqForm {
  id: number;
  pIndex: number;
  cIndex: number;
  gcIndex: number;
  formName: string;
  moduleName: string;
  articles: any[];
}

interface SavePackagePayload {
  id?: number;
  packageName: string;
  aliasName: string;
  noOfScreens: number;
  isActive?: boolean;
  formList: number[];
  priceDetails: {
    countryId: number;
    countryName: string;
    currencyCode: string;
    listedPrice: number | string;
    resellerPrice: number | string;
    dealerPrice: number | string;
    distributorPrice: number | string;
  }[];
}

const validationSchema = Yup.object({
  packageName: Yup.string().required("Package name is required"),
  aliasName: Yup.string().required("Alias name is required"),
});

const PackageForm = ({ type, packageId }: Props) => {
  const router = useRouter();

  // const [modulesData, setModulesData] = useState<Record<string, FaqForm[]>>({});
  const [modulesData, setModulesData] = useState<Record<string, any>>({});
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [checkedForms, setCheckedForms] = useState<number[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const excludeModules = [" ", "Procurement Report", "Sales Analysis", "Sales Summary", "Inventory Report", "Distribution Report", "CRM Report", "Production Report",
    "Store Management Report", "Finance Report", "Time And Attendance"];

  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  const [countryPrices, setCountryPrices] = useState<CountryPrice[]>([]);
  const [formListError, setFormListError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [priceFieldErrors, setPriceFieldErrors] = useState<any>({});
  const [rowData, setRowData] = useState<any>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  const toggleGroup = (id: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  // const validationSchema = Yup.object({
  //   packageName: Yup.string().required("This field is required"),
  //   aliasName: Yup.string().required("This field is required"),
  // });

  // useEffect(() => {
  //   const fetchFaqForms = async () => {
  //     try {
  //       const response = await makeSuperAPICall.get("GetFaqForms");
  //       if (response.status === 200) {
  //         const forms: FaqForm[] = response.data.data.faqFormsDetails;

  //         const modulesMap: Record<string, FaqForm[]> = {};
  //         // forms.forEach((f) => {
  //         //   if (!excludeModules.includes(f.moduleName)) {
  //         //     if (!modulesMap[f.moduleName]) modulesMap[f.moduleName] = [];
  //         //     modulesMap[f.moduleName].push(f);
  //         //   }
  //         // });

  //         forms.forEach((f) => {
  //           const moduleName = f.moduleName?.trim();

  //           if (!moduleName) return;
  //           if (excludeModules.includes(moduleName)) return;

  //           if (!modulesMap[moduleName]) {
  //             modulesMap[moduleName] = [];
  //           }

  //           modulesMap[moduleName].push(f);
  //         });

  //         setModulesData(modulesMap);

  //         const firstModuleName = Object.keys(modulesMap)[0] || "";
  //         setSelectedModule(firstModuleName);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching FAQ forms:", err);
  //     } finally {
  //       setLoadingForms(false);
  //     }
  //   };

  //   fetchFaqForms();
  // }, []);

  useEffect(() => {
    const fetchFaqForms = async () => {
      try {
        const response = await makeSuperAPICall.get("GetFaqForms");

        if (response.status === 200) {
          const forms: FaqForm[] = response.data.data.faqFormsDetails;

          const modulesMap: Record<string, any> = {};

          const REPORT_PINDEX = 10;

          const reportForms = forms.filter(f => f.pIndex === REPORT_PINDEX);
          const normalForms = forms.filter(f => f.pIndex !== REPORT_PINDEX);

          // ✅ NORMAL MODULES
          normalForms.forEach((f) => {
            const moduleName = f.moduleName?.trim();

            if (!moduleName) return;
            if (excludeModules.includes(moduleName)) return;

            if (!modulesMap[moduleName]) {
              modulesMap[moduleName] = [];
            }

            modulesMap[moduleName].push(f);
          });

          // ✅ REPORT TREE
          const buildReportTree = (forms: FaqForm[]) => {
            const tree: any = {};

            forms.forEach((f) => {
              const { cIndex, gcIndex, moduleName } = f;

              if (gcIndex === 0) {
                tree[cIndex] = {
                  parent: f,
                  subModules: {},
                  directChildren: [],
                };
              } else {
                if (!tree[cIndex]) {
                  tree[cIndex] = {
                    parent: null,
                    subModules: {},
                    directChildren: [],
                  };
                }

                if (moduleName && moduleName.trim() !== "") {
                  if (!tree[cIndex].subModules[moduleName]) {
                    tree[cIndex].subModules[moduleName] = [];
                  }

                  tree[cIndex].subModules[moduleName].push(f);
                } else {
                  tree[cIndex].directChildren.push(f);
                }
              }
            });

            return tree;
          };

          modulesMap["Reports"] = buildReportTree(reportForms);

          setModulesData(modulesMap);

          setSelectedModule(Object.keys(modulesMap)[0] || "");
        }
      } catch (err) {
        console.error("Error fetching FAQ forms:", err);
      } finally {
        setLoadingForms(false);
      }
    };

    fetchFaqForms();
  }, []);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await makeSuperAPICall.get("GetCountryDropdown");
        if (response.status === 200) {
          setAvailableCountries(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountryData();
  }, []);



  const handleAddCountry = () => {
    setPriceError("");
    setCountryPrices((prev) => [
      ...prev,
      {
        id: Date.now(),
        countryName: "",
        currencyCode: "",
        listedPrice: "",
        resellerPrice: "",
        dealerPrice: "",
        distributorPrice: "",
      },
    ]);
  };

  // const handleRemoveCountry = (id: number) => {
  //   setCountryPrices((prev) => prev.filter((item) => item.id !== id));
  // };

  const handleRemoveCountry = (id: number) => {
    setCountryPrices((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const formik = useFormik({
    initialValues: {
      packageName: "",
      aliasName: "",
      noOfScreens: "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {

      let isValid = true;

      // FORM LIST VALIDATION
      if (checkedForms.length === 0) {
        setFormListError("This field is required");
        isValid = false;
      } else {
        setFormListError("");
      }

      // PRICE DETAILS VALIDATION
      if (countryPrices.length === 0) {
        setPriceError("Price details is required");
        isValid = false;
      } else {
        const errors: any = {};

        countryPrices.forEach((c) => {
          const rowError: any = {};

          if (!c.countryId) rowError.countryId = "Country required";
          if (!c.listedPrice) rowError.listedPrice = "Listed price required";
          if (!c.resellerPrice) rowError.resellerPrice = "Reseller price required";
          if (!c.dealerPrice) rowError.dealerPrice = "Dealer price required";
          if (!c.distributorPrice) rowError.distributorPrice = "Distributor price required";

          if (Object.keys(rowError).length > 0) {
            errors[c.id] = rowError;
          }
        });

        if (Object.keys(errors).length > 0) {
          setPriceFieldErrors(errors);
          isValid = false;
        } else {
          setPriceFieldErrors({});
        }

      }

      if (!isValid) return;

      try {
        const payload: SavePackagePayload = {
          packageName: values.packageName,
          aliasName: values.aliasName,
          // noOfScreens: Number(values.noOfScreens),
          noOfScreens: checkedForms.length,
          isActive: rowData?.isActive ?? true,
          formList: checkedForms,
          priceDetails: countryPrices
            .filter(c => c.countryId)
            .map(c => ({
              countryId: c.countryId!,
              countryName: c.countryName,
              currencyCode: c.currencyCode,
              listedPrice: Number(c.listedPrice) || 0,
              resellerPrice: Number(c.resellerPrice) || 0,
              dealerPrice: Number(c.dealerPrice) || 0,
              distributorPrice: Number(c.distributorPrice) || 0,
            })),
        };

        if (type === "edit" && packageId) {
          payload.id = Number(packageId);
        }

        const response = await makeSuperAPICall.post("PostSavePackage", payload);

        if (response.status === 200) {
          router.push("/super/dashboard/package");
        }
      } catch (error) {
        console.error("Save failed:", error);
      }
    }
  });

  const { handleSubmit, handleChange } = formik;

  const handlePackageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    formik.setFieldValue("packageName", value);
    formik.setFieldValue("aliasName", value);
  };

  // const handleFormCheck = (formId: number) => {
  //   if (checkedForms.includes(formId)) {
  //     setCheckedForms(checkedForms.filter((f) => f !== formId));
  //   } else {
  //     setCheckedForms([...checkedForms, formId]);
  //   }
  // };

  const handleFormCheck = (formId: number) => {
    let updatedForms;

    if (checkedForms.includes(formId)) {
      updatedForms = checkedForms.filter((f) => f !== formId);
    } else {
      updatedForms = [...checkedForms, formId];
    }

    setCheckedForms(updatedForms);

    if (updatedForms.length > 0) {
      setFormListError("");
    }
  };

  useEffect(() => {
    if (!packageId) return;

    const fetchPackageById = async () => {
      try {
        const response = await makeSuperAPICall.get(
          `GetPackageById/${packageId}`
        );

        if (response.status === 200) {
          const data = response.data.data;
          console.log("dataa", data);
          setRowData(data);
          formik.setValues({
            packageName: data.packageName || "",
            aliasName: data.aliasName || "",
            noOfScreens: data.noOfScreens?.toString() || "",
          });

          setCheckedForms(data.formList || []);

          if (data.priceDetails?.length) {
            setCountryPrices(
              data.priceDetails.map((p: any) => ({
                id: Date.now() + Math.random(),
                countryId: p.countryId,
                countryName: p.countryName,
                currencyCode: p.currencyCode,
                listedPrice: p.listedPrice?.toString() || "",
                resellerPrice: p.resellerPrice?.toString() || "",
                dealerPrice: p.dealerPrice?.toString() || "",
                distributorPrice: p.distributorPrice?.toString() || "",
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching package by id:", error);
      }
    };

    fetchPackageById();
  }, [packageId]);


  const handleSelectAllForms = (checked: boolean) => {
    if (!selectedModule) return;

    const moduleFormIds = (modulesData[selectedModule] || []).map((f: FaqForm) => f.id);

    let updatedForms: number[] = [];

    if (checked) {
      updatedForms = checkedForms.slice();

      moduleFormIds.forEach((id: number) => {
        if (!updatedForms.includes(id)) {
          updatedForms.push(id);
        }
      });
    } else {
      updatedForms = checkedForms.filter((id) => !moduleFormIds.includes(id));
    }

    setCheckedForms(updatedForms);

    if (updatedForms.length > 0) {
      setFormListError("");
    }
  };

  // const moduleForms = modulesData[selectedModule] || [];
  const moduleForms: FaqForm[] = modulesData[selectedModule] || [];

  const isAllSelected =
    moduleForms.length > 0 &&
    moduleForms.every((form) => checkedForms.includes(form.id));

  const clearPriceError = (rowId: number, field: string) => {
    setPriceFieldErrors((prev: any) => {
      const updated = { ...prev };

      if (updated[rowId]) {
        delete updated[rowId][field];
        if (Object.keys(updated[rowId]).length === 0) delete updated[rowId];
      }

      return updated;
    });
  };

  const isEditMode = type === "edit";

  const isExtinctRow =
    isEditMode && rowData?.isActive === false;

  const disableSaveButton =
    isExtinctRow;


  const allowDecimalNumbers = (value: string) => {
    let cleaned = value.replace(/[^0-9.]/g, "");

    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    return cleaned;
  };

  return (
    <div className={styles.pageWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContent}>
        <div className={styles.formHeader}>
          <Header
            title={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {type === "edit" ? "Edit Package" : "Create Package"}
                <CrownOutlined />
              </span>
            }
            description="Manage your packages"
          />
          <div className={styles.formHeaderButtons}>
            <ButtonComponent
              type="default"
              onClickEvent={() => router.push("/super/dashboard/package")}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type="primary"
              htmlType="submit"
              disabled={disableSaveButton}
            >
              Save
            </ButtonComponent>
          </div>
        </div>

        <div className={styles.formBody}>

          <div className={styles.card}>
            <div className={styles.headerBar}>
              <h3>Package Details</h3>
            </div>
            <div className={styles.row}>
              <InputComponent
                label="Package Name"
                name="packageName"
                type="text"
                placeholder="Enter package name"
                value={formik.values.packageName}
                // onChangeEvent={handleChange}
                onChangeEvent={handlePackageNameChange}
                onBlur={formik.handleBlur}
                errormsg={formik.touched.packageName && formik.errors.packageName}
                disabled={isExtinctRow}
                isrequired
              />
              <InputComponent
                label="Alias Name"
                name="aliasName"
                type="text"
                placeholder="Enter alias name"
                value={formik.values.aliasName}
                onChangeEvent={handleChange}
                onBlur={formik.handleBlur}
                errormsg={formik.touched.aliasName && formik.errors.aliasName}
                disabled={isExtinctRow}
                isrequired
              />
              {/* <InputComponent
                label="No of Screen"
                name="noOfScreens"
                type="number"
                value={formik.values.noOfScreens}
                onChangeEvent={handleChange}
                isrequired
              /> */}

              <InputComponent
                label="No of Screens"
                name="noOfScreens"
                type="number"
                value={checkedForms.length}
                disabled
              />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.headerBar}>
              {/* <h3>Price Details</h3> */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ margin: 0 }}>
                  <span style={{ color: "#f5222d", fontSize: 13 }}>*</span> Price Details
                </h3>
              </div>
              <Button
                type="dashed"
                onClick={handleAddCountry}
                disabled={isExtinctRow}>
                + Add Country Price
              </Button>
            </div>

            {countryPrices.length > 0 && (
              <div className={styles.countryWrapper}>
                {countryPrices.map((item) => (
                  <div key={item.id} className={styles.countryCard}>
                    <div className={styles.countryHeader}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <SelectComponent
                          value={item.countryName || undefined}
                          placeholder="Select Country"
                          options={availableCountries.map((c) => ({
                            label: c.countryName,
                            value: c.countryName,
                          }))}
                          showSearch
                          filterOption={(input: any, option: any) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={(value: string) => {
                            const selected = availableCountries.find(
                              (c) => c.countryName === value
                            );
                            setPriceError("");
                            setCountryPrices((prev) =>
                              prev.map((row) =>
                                row.id === item.id
                                  ? {
                                    ...row,
                                    countryName: value,
                                    currencyCode: selected?.currencyCode || "",
                                    countryId: selected?.id,
                                  }
                                  : row
                              )
                            );
                            setPriceFieldErrors((prev: any) => {
                              const updated = { ...prev };
                              if (updated[item.id]) {
                                delete updated[item.id].countryId;
                                if (Object.keys(updated[item.id]).length === 0) delete updated[item.id];
                              }
                              return updated;
                            });
                          }}
                          style={{ width: 200 }}
                          disabled={isExtinctRow}
                        />
                        {priceFieldErrors[item.id]?.countryId && (
                          <span style={{ color: "#f5222d", fontSize: 13.5, paddingTop: 5 }}>
                            {priceFieldErrors[item.id]?.countryId}
                          </span>
                        )}
                      </div>
                      <div className={styles.countryActions}>
                        {/* <div className={styles.currencyBox}>
                          {item.currencyCode}
                        </div> */}
                        <div className={`${styles.currencyBox} ${!item.currencyCode ? styles.placeholder : ""}`}>
                          {item.currencyCode || "Currency"}
                        </div>
                        {countryPrices.length > 0 && (
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveCountry(item.id)}
                            disabled={isExtinctRow}
                          />
                        )}
                      </div>
                    </div>
                    <div className={styles.priceGrid}>
                      <InputComponent
                        label="Listed Price"
                        type="text"
                        value={item.listedPrice}
                        onChangeEvent={(e: any) => {
                          const value = allowDecimalNumbers(e.target.value);

                          setCountryPrices((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, listedPrice: value }
                                : row
                            )
                          );

                          clearPriceError(item.id, "listedPrice");
                        }}
                        disabled={isExtinctRow}
                        errormsg={priceFieldErrors[item.id]?.listedPrice}
                      />
                      <InputComponent
                        label="Reseller Price"
                        type="text"
                        value={item.resellerPrice}
                        onChangeEvent={(e: any) => {
                          const value = allowDecimalNumbers(e.target.value);

                          setCountryPrices((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, resellerPrice: e.target.value }
                                : row
                            )
                          );

                          clearPriceError(item.id, "resellerPrice");
                        }}
                        disabled={isExtinctRow}
                        errormsg={priceFieldErrors[item.id]?.resellerPrice}
                      />
                      <InputComponent
                        label="Dealer Price"
                        type="text"
                        value={item.dealerPrice}
                        onChangeEvent={(e: any) => {
                          const value = allowDecimalNumbers(e.target.value);

                          setCountryPrices((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, dealerPrice: e.target.value }
                                : row
                            )
                          );
                          clearPriceError(item.id, "dealerPrice");
                        }}
                        disabled={isExtinctRow}
                        errormsg={priceFieldErrors[item.id]?.dealerPrice}
                      />
                      <InputComponent
                        label="Distributor Price"
                        type="text"
                        value={item.distributorPrice}
                        onChangeEvent={(e: any) => {
                          const value = allowDecimalNumbers(e.target.value);

                          setCountryPrices((prev) =>
                            prev.map((row) =>
                              row.id === item.id
                                ? { ...row, distributorPrice: e.target.value }
                                : row
                            )
                          );
                          clearPriceError(item.id, "distributorPrice");
                        }}
                        disabled={isExtinctRow}
                        errormsg={priceFieldErrors[item.id]?.distributorPrice}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.headerBar}>
              {/* <h3>Form List</h3> */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ margin: 0 }}>
                  <span style={{ color: "#f5222d", fontSize: 13 }}>*</span> Form List
                </h3>

                {formListError && (
                  <span style={{ color: "#f5222d", fontSize: 14 }}>
                    {formListError}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.formContainer}>
              <div className={styles.modulesSection}>
                {Object.keys(modulesData).map((moduleName) => (
                  <div
                    key={moduleName}
                    className={`${styles.moduleItem} ${selectedModule === moduleName ? styles.activeModule : ""
                      }`}
                    onClick={() => setSelectedModule(moduleName)}
                  >
                    {moduleName}
                  </div>
                ))}
              </div>

              <div className={styles.formsSection}>
                {loadingForms ? (
                  <div>Loading forms...</div>
                ) : selectedModule === "Reports" ? (
                  <>
                    {Object.values(modulesData["Reports"] || {}).map((group: any) => {
                      const isOpen = expandedGroups[group.parent?.id];

                      const hasChildren =
                        (group.directChildren && group.directChildren.length > 0) ||
                        (group.subModules && Object.keys(group.subModules).length > 0);

                      return (
                        <div key={group.parent?.id}>

                          {/* LEVEL 1 (Clickable) */}
                          <div
                            className={styles.formItem}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (hasChildren) toggleGroup(group.parent.id);
                            }}
                          >
                            <span style={{ marginRight: 8 }}>
                              {hasChildren ? (isOpen ? "−" : "+") : ""}
                            </span>

                            <Checkbox
                              checked={checkedForms.includes(group.parent?.id)}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();

                                const isChecked = e.target.checked;

                                const childIds: number[] = [];

                                Object.values(group.subModules || {}).forEach((forms: any) => {
                                  forms.forEach((f: any) => childIds.push(f.id));
                                });

                                (group.directChildren || []).forEach((f: any) => {
                                  childIds.push(f.id);
                                });

                                let updatedForms = [...checkedForms];

                                if (isChecked) {
                                  const allIds = [group.parent.id, ...childIds];

                                  allIds.forEach((id) => {
                                    if (!updatedForms.includes(id)) {
                                      updatedForms.push(id);
                                    }
                                  });
                                } else {
                                  updatedForms = updatedForms.filter(
                                    (id) => id !== group.parent.id && !childIds.includes(id)
                                  );
                                }

                                setCheckedForms(updatedForms);

                                if (updatedForms.length > 0) {
                                  setFormListError("");
                                }
                              }}
                              disabled={isExtinctRow}
                            />

                            <span style={{ fontWeight: 600 }}>
                              {group.parent?.formName}
                            </span>
                          </div>

                          {/* CHILDREN (only if expanded) */}
                          {isOpen && (
                            <>
                              {/* SUB MODULE */}
                              {Object.entries(group.subModules).map(([subName, forms]: any) => (
                                <div key={Math.random()} style={{ paddingLeft: 20 }}>

                                  {forms.map((f: any) => (
                                    <div key={f.id} className={styles.formItem} style={{ paddingLeft: 20 }}>
                                      <Checkbox
                                        checked={checkedForms.includes(f.id)}
                                        onChange={() => handleFormCheck(f.id)}
                                        disabled={isExtinctRow}
                                      />
                                      <span>{f.formName}</span>
                                    </div>
                                  ))}
                                </div>
                              ))}

                              {/* DIRECT CHILD */}
                              {group.directChildren.map((f: any) => (
                                <div key={f.id} className={styles.formItem} style={{ paddingLeft: 20 }}>
                                  <Checkbox
                                    checked={checkedForms.includes(f.id)}
                                    onChange={() => handleFormCheck(f.id)}
                                    disabled={isExtinctRow}
                                  />
                                  <span>{f.formName}</span>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : selectedModule && modulesData[selectedModule] ? (
                  <>
                    <div className={styles.formItem}>
                      <Checkbox
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAllForms(e.target.checked)}
                        disabled={isExtinctRow}
                      />
                      <span style={{ fontWeight: 600 }}>Select All</span>
                    </div>

                    {modulesData[selectedModule].map((form: any) => (
                      <div key={form.id} className={styles.formItem}>
                        <Checkbox
                          checked={checkedForms.includes(form.id)}
                          onChange={() => handleFormCheck(form.id)}
                          disabled={isExtinctRow}
                        />
                        <span>{form.formName}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className={styles.emptyState}>Select a module</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;