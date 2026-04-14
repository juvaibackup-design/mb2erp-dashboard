import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import InputComponent from "@/components/InputComponent/InputComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import { makeSuperAPICall } from "@/lib/helpers/apiHandlers/superapi";
import { getBranchIdByHeader } from "@/lib/helpers/getCookiesClient";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import {
  Branch,
  employeeList,
  roleList,
  userList,
  defaultLandingPage,
} from "@/lib/interfaces/admin-interface/userInterface";
import { Avatar, Button, Col, Divider, Flex, Row, Space, Tour, Checkbox } from "antd";
import { useFormik } from "formik";
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import "@/lib/antdOverwrittenCss/global.css";
import {
  LoaderContext,
  UserContext,
} from "@/lib/interfaces/Context.interfaces";
import styles from "./superuser.module.css";
import { InputRef, TourProps, UploadFile } from "antd";
import useIsMobile from "@/lib/customHooks/useIsMobile";
import SwitchComponent from "@/components/SwitchComponent/SwitchComponent";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/userInfo/store";
import InputPasswordComponent from "@/app/_components/signInComponents/InputPasswordComponent";
import { encrypt1 } from "@/lib/helpers/utilityHelpers";
import { ENCRYPTION_KEY } from "@/lib/constants/constant";
import { UserOutlined } from "@ant-design/icons";
import ProfileModal from "@/components/ModalComponent/ProfileModal";
import i18n from "@/i18n";
import { useShortcutStore } from "@/store/shortcuts/store";
import { handleApiError } from "@/lib/helpers/handleApiError";
import { SuperUserRow } from "./SuperUserTable";
import { superindexList } from "@/components/SideBar/Constants";
import { useSuperUserStore } from "@/store/superuserinfo/store";

export interface SuperUserInitialValues {
  id?: number;
  roleId: number | null;

  firstName: string;
  middleName: string;
  lastName: string;

  primaryPhoneNumber: null;

  emailId: string;

  userName: string;
  password: string;

  isAllowSavePassword: boolean;

  idleMinutes: number;
  isActive: boolean;

  createdBy: number;
  updatedBy: number;
  customerList: string[];

  imageData: {
    imageFileName: string;
    imageFileData: string;
    imageFileType: string;
  };

}

function SuperUserForm({
  initData,
  type,
  userList,
  roleList,
  userTableData,
  setFormDirty,
  setOpenDrawer,
  setRefKey,
  open,
  record,
  setNotificationDisplayed,
  setSuperUserTableData,
  formDirty,
  access,
  setAccess,
  host,
  setIsConfirmModal,
  rowData
}: {
  initData: Partial<SuperUserInitialValues>;
  type: "create" | "edit";
  userList: userList[];
  roleList: roleList[];
  branchList: Branch[];
  userTableData: SuperUserRow[];
  setFormDirty: Function;
  setOpenDrawer: Function;
  open: boolean;
  record: any;
  setNotificationDisplayed: Function;
  setSuperUserTableData: Dispatch<SetStateAction<any[]>>;
  formDirty?: any;
  access: any;
  setAccess: Function;
  host?: any;
  setRefKey: Function;
  setIsConfirmModal: Function;
  rowData: any;
}) {
  const { t } = useTranslation();
  const Loader = useContext(LoaderContext);
  const isMobile = useIsMobile();
  const inputref = useRef<InputRef>(null);
  const [selectedBranches, setSelectedBranches] = useState<any>([]);
  const [filteredOption, setFilteredOption] = useState("");
  const [stockpointOptions, setStockpointOptions] = useState<any[]>([]);
  // const [initialValues, setInitialValues] = useState<any>(initData);
  // const [avatarImage, setAvatarImage] = useState<string | null>(initData?.imageData?.FileData ? `data:${initData.imageData.FileType};base64,${initData.imageData.FileData}` : null);
  const [avatarImage, setAvatarImage] = useState<string | null>(
    initData?.imageData?.imageFileData
      ? `data:${initData.imageData.imageFileType};base64,${initData.imageData.imageFileData}`
      : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sidebarShortcutMode = useShortcutStore(s => s.sidebarShortcutMode);
  const fieldRef = useRef<any[]>([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [p_index, c_index, gc_index] = superindexList["Users"];
  const [columnChooserData, setColumnChooserData] = useState<any[]>([]);

  const originalPhoneRef = useRef<number | null>(
    initData?.primaryPhoneNumber ?? null
  );

  const [filteredCustomerOption, setFilteredCustomerOption] = useState("");


  const isFieldVisible = (label: string) =>
    columnChooserData.some(
      (col) => col.label === label && col.isVisible
    );

  const isFieldMandatory = (label: string) =>
    columnChooserData.find((col) => col.label === label)?.isMandatory ?? false;



  useEffect(() => {
    if (initData?.imageData?.imageFileData) {
      setAvatarImage(
        `data:${initData.imageData.imageFileType};base64,${initData.imageData.imageFileData}`
      );
    } else {
      setAvatarImage(null);
    }
  }, [initData]);

  const userDetails = useSuperUserStore(
    useCallback((state: any) => {
      try {
        return state.user ? JSON.parse(state.user) : null;
      } catch (error) {
        console.error("Error parsing user details:", error);
        return null;
      }
    }, [])
  );


  useEffect(() => {
    const fetchData = async () => {
      try {
        const payloadValues = {
          roleId: userDetails.userInfo.roleId,
          pIndex: p_index,
          cIndex: c_index,
          gcIndex: gc_index,
        };
        console.log("payloadValues", payloadValues)
        const response = await makeSuperAPICall.post(
          "GetWebFieldConfigurationSA",
          payloadValues
        );

        if (response?.data?.data) {
          const fields = response.data.data[0].group.flatMap((group: any) =>
            group.fields
              .filter((field: any) => field.isRequired)
              .map((field: any) => ({
                id: field.columnId,
                label: field.field,
                isVisible: field.isVisible,
                isMandatory: field.isMandatory,
              }))
          );

          const updatedFields = fields.map((field: any) => {
            let dynamicProperty = {};

            switch (field.label) {
              case "First Name":
                dynamicProperty = { value: "firstName" };
                break;
              case "Middle Name":
                dynamicProperty = { value: "middleName" };
                break;
              case "Last Name":
                dynamicProperty = { value: "lastName" };
                break;
              case "Mobile Number":
                dynamicProperty = { value: "primaryPhoneNumber" };
                break;
              case "User Name":
                dynamicProperty = { value: "userName" };
                break;
              case "Password":
                dynamicProperty = { value: "password" };
                break;
              case "Role":
                dynamicProperty = { value: "roleId" };
                break;
              case "Customer List":
                dynamicProperty = { value: "customerList" };
                break;
              case "Idle Minutes":
                dynamicProperty = { value: "idleMinutes" };
                break;
              case "Permissions":
                dynamicProperty = { value: "permissions" };
                break;
              default:
                dynamicProperty = {
                  value: field.label.toLowerCase().replace(/\s+/g, "_"),
                };
            }

            return { ...field, ...dynamicProperty };
          });

          setColumnChooserData(updatedFields);
        }
      } catch (error) {
        console.error("SuperUser config error", error);
      }
    };

    fetchData();
  }, []);

  console.log("SuperuserColumnChooser", columnChooserData);

  const normalizeUserName = (val: string) =>
    val
      .trim()
      .replace(/\s+/g, "")
      .toLowerCase();


  const generateDynamicValidation = (columnChooserData: any[]) => {
    return columnChooserData.reduce((shape: any, field: any) => {

      if (!field.isVisible || !field.isMandatory) return shape;

      if (field.value === "permissions") {
        shape.permissionsCheck = Yup.mixed().test(
          "at-least-one-permission",
          t("Select at least one permission"),
          function () {
            const { add, view, edit, delete: del } = this.parent;
            return add || view || edit || del;
          }
        );
        return shape;
      }

      switch (field.value) {
        case "userName":
          shape.userName = Yup.string()
            .required(t("requiredField"))
            .test(
              "no-at-symbol",
              t("@ is not allowed"),
              (value) => !value?.includes("@")
            )
            .test(
              "no-spaces",
              t("User Name should not contain spaces"),
              (value) => !/\s/.test(value || "")
            )
            .matches(
              /^[a-zA-Z0-9._-]*$/,
              t("Special characters are not allowed")
            )
            .test(
              "unique-username",
              t("User Name Already Exists"),
              function (value) {
                if (!value) return true;

                const input = normalizeUserName(value);

                return !userTableData?.some((item: any) => {
                  if (!item?.loginName) return false;

                  const db = normalizeUserName(
                    item.loginName.split("@")[0]
                  );

                  return db === input && item.id !== record?.id;
                });
              }
            )
            .max(50, t("User Name characters should not exceed 50"));
          break;


        case "primaryPhoneNumber":
          shape[field.value] = Yup.string()
            .matches(/^[6-9]\d{9}$/, t("Invalid mobile number"))
            .required(t("requiredField"));
          break;

        case "password":
          shape[field.value] = Yup.string()
            .min(8, t("Minimum 8 characters"))
            .required(t("requiredField"));
          break;

        case "customerList":
          shape[field.value] = Yup.array()
            .min(1, t("Select at least one customer"))
            .required(t("requiredField"));
          break;

        default:
          shape[field.value] = Yup.string().required(t("requiredField"));
      }

      return shape;
    }, {});
  };






  const validationSchema = Yup.object().shape({
    ...generateDynamicValidation(columnChooserData),
    // firstName: Yup.string()
    //   .required(t("requiredField"))
    //   .matches(/^[a-zA-Z0-9\s]*$/, "special characters are not allowed")
    //   .min(1, "Minimum one character is required")
    //   .max(20, "First name  characters should not exceed 20")
    //   .test("unique-first-name", t("Name already exists"), function (value) {
    //     if (!value) return true;
    //     const v = value.trim().toLowerCase();
    //     return !userTableData?.some(
    //       (item) =>
    //         (item?.first_name ?? "").trim().toLowerCase() === v &&
    //         item?.id !== record?.id
    //     );
    //   }),
    // userName: Yup.string()
    //   .required(t("requiredField"))

    //   .test(
    //     "no-at-symbol",
    //     t("@ is not allowed"),
    //     (value) => !value?.includes("@")
    //   )

    //   .test(
    //     "no-spaces",
    //     t("User Name should not contain spaces"),
    //     (value) => !/\s/.test(value || "")
    //   )

    //   .matches(
    //     /^[a-zA-Z0-9._-]*$/,
    //     t("Special characters are not allowed")
    //   )

    //   .test(
    //     "unique-name",
    //     t("User Name Already Exists"),
    //     function (value) {
    //       if (!value) return true;

    //       const inputName = value.toLowerCase();

    //       return !userTableData?.some((item: any) => {
    //         const dbName = item.loginName
    //           ?.split("@")[0]
    //           ?.toLowerCase();

    //         return dbName === inputName && item.id !== record?.id;
    //       });
    //     }
    //   )
    //   .max(50, t("User Name characters should not exceed 50")),


    // primaryPhoneNumber: Yup.string()
    //   .nullable()
    //   .matches(/^[6-9]\d{9}$/, t("Invalid phone number")),
    // // password: Yup.string()
    // //   .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*[<>&.'"]).*$/, "Password should contain one uppercase, one lowercase, one number, <, > , & , ., ', \" not allowed")
    // //   .required(t("requiredField")),
    // password: Yup.string()
    //   .matches(
    //     /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*[<>&.'"]).*$/,
    //     "Password should contain one uppercase, one lowercase, one number"
    //   )
    //   .when([], {
    //     is: () => type === "create",
    //     then: (schema) => schema.required(t("requiredField")),
    //     otherwise: (schema) => schema.notRequired(),
    //   }),

    // roleId: Yup.number().required(t("requiredField")),
    // // branch_id: Yup.array().required(t("requiredField")).min(1, t("requiredField")),
    // // stockpoint_id: Yup.array(),
    // idleMinutes: Yup.number().min(5, t("Minimum 5 minutes")).nullable(),

    // permissionsCheck: Yup.mixed().test(
    //   "at-least-one-permission",
    //   "Select at least one permission ",
    //   function () {
    //     const { add, view, edit, delete: del } = this.parent;
    //     return add || view || edit || del;
    //   }
    // ),

    // customerListCheck: Yup.mixed().test(
    //   "at-least-one-customer",
    //   "Select at least one customer",
    //   function () {
    //     const { customerList } = this.parent;
    //     return Array.isArray(customerList) && customerList.length > 0;
    //   }
    // ),
  });

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputref.current?.focus();
      }, 0);
    }
    if (!open) {
      setRefKey((prevKey: any) => prevKey + 1);
    }
  }, [open, inputref]);


  const loadRoleDropdown = async () => {
    try {
      const res = await makeSuperAPICall.get("GetRoleDropdown");
      const result = res.data;

      const formatted = result.data.map((item: any) => ({
        label: item.roleName,
        value: item.id
      }));

      setRoleOptions(formatted);
    } catch (err) {
      console.error("Role API failed:", err);
    }
  };

  useEffect(() => {
    loadRoleDropdown();
  }, []);


  //CustomerList Dropdown

  const loadCustomerDropdown = async () => {
    try {
      const res = await makeSuperAPICall.get("GetSuperUserCustomerDropdown");
      const result = res.data;

      const formatted = result.data.map((item: any) => ({
        label: item.domain,
        value: String(item.id)
      }));

      setCustomerOptions(formatted);
    } catch (err) {
      console.error("Customer API failed:", err);
    }
  };

  useEffect(() => {
    loadCustomerDropdown();
  }, []);




  const onClose = () => {
    if (formDirty) {
      setIsConfirmModal(true);
    } else {
      setIsConfirmModal(false);
      setOpenDrawer(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleSelectAllCustomer = () => {
    // Unselect all
    if (
      formik.values.customerList?.length === customerOptions.length
    ) {
      setFilteredCustomerOption("");
      formik.setFieldValue("customerList", []);
      return;
    }

    // Select only filtered customers
    if (filteredCustomerOption.length >= 1) {
      const filteredCustomers =
        customerOptions.filter((item: any) =>
          (item.label ?? "")
            .toLowerCase()
            .includes(filteredCustomerOption.toLowerCase())
        );

      const newValues = filteredCustomers.filter(
        (item: any) =>
          !formik.values.customerList.includes(item.value)
      );

      formik.setFieldValue("customerList", [
        ...formik.values.customerList,
        ...newValues.map((i: any) => i.value),
      ]);

      setFilteredCustomerOption("");
      return;
    }

    // Select all customers
    formik.setFieldValue(
      "customerList",
      customerOptions.map((i: any) => i.value)
    );
    setFilteredCustomerOption("");
  };



  //SaveSuperUser API

  const formik: any = useFormik({
    initialValues: {
      id: initData?.id ?? 0,
      roleId: initData?.roleId ?? null,

      firstName: initData?.firstName ?? "",
      middleName: initData?.middleName ?? "",
      lastName: initData?.lastName ?? "",
      customerList: Array.isArray(initData?.customerList)
        ? initData.customerList
        : [],


      primaryPhoneNumber: "",
      // primaryPhoneNumber: initData?.primaryPhoneNumber ?? "",
      // password: "",
      password: initData?.password ?? "",

      userName:
        type === "edit" && initData?.userName
          ? initData.userName.split("@")[0]
          : initData?.userName ?? "",


      isAllowSavePassword: initData?.isAllowSavePassword ?? false,
      // idleMinutes: initData?.idleMinutes ?? 0,
      // isActive: initData?.isActive ?? false,
      isActive: Boolean(initData?.isActive),
      imageData: {
        imageFileName: initData?.imageData?.imageFileName || "",
        imageFileType: initData?.imageData?.imageFileType || "",
        imageFileData: initData?.imageData?.imageFileData || "",
      },
      add: record?.add ?? false,
      edit: record?.edit ?? false,
      view: record?.view ?? false,
      delete: record?.delete ?? false,

      permissionsCheck: "",
      customerListCheck: "",
      permissions: "",
    },

    enableReinitialize: true,
    validationSchema: validationSchema,


    onSubmit: async (values) => {
      console.log("Formik errors at submit time", formik.errors);
      console.log("Formik values at submit time", values);
      try {
        Loader?.setLoader(true);

        let finalImageName = values.imageData?.imageFileName || null;
        let finalImageType = values.imageData?.imageFileType || null;
        let finalImageData = values.imageData?.imageFileData || null;

        if (
          type === "edit" &&
          values.imageData?.imageFileData === undefined &&
          record?.profileImageData
        ) {
          finalImageName = record.profileImageName;
          finalImageType = record.profileImageType;
          finalImageData = record.profileImageData;
        }

        formik.setTouched({
          ...formik.touched,
          permissionsCheck: true,
          customerListCheck: true,
        });

        // await formik.validateForm();
        // if (Object.keys(formik.errors).length > 0) {
        //   Loader?.setLoader(false);
        //   return;
        // }

        const modifiedValues: any = {
          roleId: Number(values.roleId),

          firstName: values.firstName.trim(),
          middleName: values.middleName?.trim() || null,
          lastName: values.lastName?.trim() || null,
          customerList: values.customerList,

          // primaryPhoneNumber: values.primaryPhoneNumber
          //   ? Number(values.primaryPhoneNumber)
          //   : null,


          loginName: `${values.userName}@sa`,
          emailId: `${values.userName}@sa`,

          isAllowSavePassword: values.isAllowSavePassword,
          // idleMinutes: Number(values.idleMinutes || 0),
          isActive: values.isActive,
          profileImageName: finalImageName,
          profileImageType: finalImageType,
          profileImageData: finalImageData,

          add: values.add,
          edit: values.edit,
          view: values.view,
          delete: values.delete,


        };

        modifiedValues.primaryPhoneNumber =
          values.primaryPhoneNumber?.trim()
            ? Number(values.primaryPhoneNumber)      // user typed new number
            : originalPhoneRef.current;              // keep DB value


        if (values.primaryPhoneNumber?.trim()) {
          modifiedValues.primaryPhoneNumber = Number(values.primaryPhoneNumber);
        }


        if (type === "create") {
          modifiedValues.password = encrypt1(
            values.password,
            ENCRYPTION_KEY
          );
        } else if (values.password?.trim()) {
          modifiedValues.password = encrypt1(
            values.password,
            ENCRYPTION_KEY
          );
        }

        const payload =
          type === "create"
            ? {
              id: 0,
              ...modifiedValues,
              isActive: true,
              createdBy: 1,
              updatedBy: 1,
            }
            : {
              id: record?.id,
              ...modifiedValues,
              createdBy: record?.createdBy ?? 1,
              updatedBy: 1,
            };

        console.log("SaveSuperUser Payload:", payload);
        console.log("Payload being sent to API", payload);


        const response = await makeSuperAPICall.post(
          "SaveSuperUser",
          payload
        );

        if (response.status === 200) {
          tagRevalidate("superuser");
          if (type === "create") {
            setOpenDrawer(false);
            setNotificationDisplayed(true);
            setTimeout(() => {
              setNotificationDisplayed(false);
            }, 2000);
          } else {
            setOpenDrawer(false);
            setNotificationDisplayed(true);
            setTimeout(() => {
              setNotificationDisplayed(false);
            }, 2000);
          }
        }
      } catch (error: any) {
        handleApiError(error);
      } finally {
        Loader?.setLoader(false);
      }
    },
  });




  useEffect(() => {
    if (
      formik.values.add ||
      formik.values.edit ||
      formik.values.delete
    ) {
      if (!formik.values.view) {
        formik.setFieldValue("view", true);
      }
    }
  }, [
    formik.values.add,
    formik.values.edit,
    formik.values.delete,
  ]);


  const disableIfExtinct = () => {
    if (record) {
      if (!record?.isActive || formik.errors.roleId) {
        return true;
      } else {
        return false;
      }
    }
  };

  const isExtinct = formik.values.isActive === false;

  const disableAction = isExtinct

  const handleReset = () => {
    formik.resetForm();
  };

  const handleIsEdit = () => {
    if (type === "edit") {
      return !access?.isEdit;
    }
    return false;
  };

  const isEditMode = type === "edit";
  const isExtinctRow = isEditMode && rowData?.isActive === false;

  const disableSaveButton =
    isExtinctRow ||
    handleIsEdit();


  const handleImageUpload = async (file: UploadFile<any>) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!file.type || !["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPEG and PNG formats are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file as unknown as File); // Convert image to base64
    reader.onload = () => {
      const base64Image = reader.result?.toString();
      if (base64Image) {
        const base64Data = base64Image.match(/^data:(.*);base64,(.*)$/);
        if (base64Data && base64Data.length === 3) {
          // Update the form with the image data
          formik.setFieldValue("imageData", {
            imageFileName: file.name,
            imageFileData: base64Data[2], // Base64 image data
            imageFileType: base64Data[1], // Image MIME type
          });
          setAvatarImage(base64Image); // Set the image to be displayed
        }
      }
    };
  };

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleRemove = () => {
    formik?.setValues({
      ...formik.values,
      imageData: {
        imageFileName: "",
        imageFileData: "",
        imageFileType: "",
      },
    });
    formik?.setFieldTouched("imageData", true);
    setAvatarImage(null);
    setIsModalOpen(false);
  };

  //   const handleRemove = () => {
  //   formik.setFieldValue("imageData", {
  //     imageFileName: null,
  //     imageFileType: null,
  //     imageFileData: null,
  //   });

  //   setAvatarImage(null);
  //   setIsModalOpen(false);
  // };


  useEffect(() => {
    setFormDirty(formik?.dirty);
  }, [formik?.dirty]);

  const handleChange = (value: string, option: any) => {
    formik.setFieldValue("branch_id", value);
    setSelectedBranches(value);
    formik.setFieldValue("is_primary_branch_id", null);
  };

  //For ColumnChooser

  const renderFieldByValue = (field: any) => {
    switch (field.value) {
      case "firstName":
        return (
          <InputComponent
            name="firstName"
            type="text"
            // isrequired={true}
            isrequired={isFieldMandatory("First Name")}
            onBlur={formik.handleBlur}
            label={t("First Name")}
            maxLength={50}
            value={formik.values?.firstName}
            onChangeEvent={formik.handleChange}
            errormsg={formik?.touched?.firstName && formik?.errors?.firstName}
          />
        );

      case "middleName":
        return (
          <InputComponent
            name="middleName"
            type="text"
            onBlur={formik.handleBlur}
            label={t("Middle Name")}
            maxLength={50}
            value={formik.values?.middleName}
            onChangeEvent={formik.handleChange}
          />
        );

      case "lastName":
        return (
          <InputComponent
            name="lastName"
            type="text"
            label={t("Last Name")}
            maxLength={50}
            value={formik.values?.lastName}
            onChangeEvent={formik.handleChange}
            errormsg={formik?.touched?.lastName && formik?.errors?.lastName}
          />
        );

      case "primaryPhoneNumber":
        return (
          <InputComponent
            name="primaryPhoneNumber"
            type="text"
            onBlur={formik.handleBlur}
            label={t("Mobile Number")}
            addonBefore="+91"
            maxLength={10}
            value={formik.values?.primaryPhoneNumber}
            onChangeEvent={(e) => {
              const value = e.target.value;
              if (!/^\d*$/.test(value)) {
                return;
              }
              formik.handleChange(e);
            }}
            errormsg={
              formik?.touched?.primaryPhoneNumber &&
              formik?.errors?.primaryPhoneNumber
            }
          />
        );

      case "userName":
        return (
          <InputComponent
            name="userName"
            type="text"
            // isrequired={true}
            isrequired={isFieldMandatory("User Name")}
            onBlur={formik.handleBlur}
            label={t("User Name")}
            maxLength={50}
            value={formik.values?.userName}
            suffix="@sa"
            // onChangeEvent={formik.handleChange}
            onChangeEvent={(e) => {
              const value = e.target.value;
              formik.setFieldValue("userName", value, true);
              formik.setFieldTouched("userName", true, false);
            }}
            errormsg={
              formik?.touched?.userName && formik?.errors?.userName
            }
          />
        );

      case "password":
        return (
          <InputPasswordComponent
            name="password"
            value={formik.values?.password}
            // isrequired={true}
            isrequired={isFieldMandatory("Password")}
            label={t("Password")}
            onBlur={formik.handleBlur}
            maxLength={100}
            onChange={(e) =>
              formik.setFieldValue("password", e.target.value.trim())
            }
            errormsg={formik?.touched?.password && formik?.errors?.password}
          />
        );

      case "roleId":
        return (
          <SelectComponent
            showSearch
            name="roleId"
            options={roleOptions}
            onChange={(value) => {
              formik.setFieldValue("roleId", value);
              formik.setFieldValue("concat_index", "");
            }}
            label={t("Role")}
            // isrequired={true}
            isrequired={isFieldMandatory("Role")}
            value={formik.values?.roleId}
            placeholder="Select"
            onBlur={formik.handleBlur}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
            errormsg={
              formik.touched.roleId && formik.errors.roleId
                ? formik.errors.roleId
                : ""
            }
          />
        );

      case "customerList":
        return (
          <SelectComponent
            showSearch
            allowClear
            mode="multiple"
            label="Customer List"
            // isrequired={true}
            isrequired={isFieldMandatory("Customer List")}
            options={customerOptions}
            value={formik.values.customerList}
            placeholder="Select"
            maxTagCount={2}
            filterOption={(input, option) => {
              setFilteredCustomerOption(input);
              return (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase());
            }}
            dropdownRender={(menu) => (
              <>
                <Space style={{ padding: "4px 8px" }}>
                  <ButtonComponent
                    type="text"
                    onClickEvent={handleSelectAllCustomer}
                  >
                    {formik.values.customerList?.length === customerOptions.length
                      ? "Unselect All"
                      : "Select All"}
                  </ButtonComponent>
                </Space>
                <Divider style={{ margin: "4px 0 8px 0" }} />
                {menu}
              </>
            )}
            onChange={(value) => {
              formik.setFieldValue("customerList", value);
              formik.setFieldTouched("customerListCheck", true);
            }}
            onClear={() => setFilteredCustomerOption("")}
          />
        );

      case "idleMinutes":
        return (
          <InputComponent
            name="idleMinutes"
            type="text"
            label={t("Idle Minutes")}
            value={formik.values.idleMinutes ?? ""}
            onChangeEvent={(e) => {
              const value = e.target.value;

              if (!/^\d*$/.test(value)) return;

              formik.setFieldValue(
                "idleMinutes",
                value === "" ? "" : Number(value)
              );
            }}
            onBlur={formik.handleBlur}
            errormsg={
              formik.touched.idleMinutes && formik.errors.idleMinutes
            }
          />
        );

      case "permissions":
        return (
          // <div>
          <Flex vertical gap={8}>
            <label className="input-label">
              {isFieldMandatory("Permissions") && (
                <span style={{ color: "#F5222D" }}>*</span>
              )}{" "}
              Permissions
            </label>

            <Flex gap={17}>
              <Checkbox
                checked={formik.values.add}
                onChange={(e) => {
                  formik.setFieldValue("add", e.target.checked);
                  formik.setFieldTouched("permissionsCheck", true);
                }}
              >
                Add
              </Checkbox>

              <Checkbox
                checked={formik.values.view}
                onChange={(e) => {
                  const checked = e.target.checked;

                  if (
                    (formik.values.add ||
                      formik.values.edit ||
                      formik.values.delete) &&
                    checked === false
                  ) {
                    return;
                  }

                  formik.setFieldValue("view", checked);

                  if (
                    !checked &&
                    !formik.values.add &&
                    !formik.values.edit &&
                    !formik.values.delete
                  ) {
                    formik.setFieldTouched("permissionsCheck", true);
                  }
                }}
                className={
                  formik.values.add ||
                    formik.values.edit ||
                    formik.values.delete
                    ? styles.viewLocked
                    : ""
                }
              >
                View
              </Checkbox>

              <Checkbox
                checked={formik.values.edit}
                onChange={(e) => {
                  formik.setFieldValue("edit", e.target.checked);
                  formik.setFieldTouched("permissionsCheck", true);
                }}
              >
                Edit
              </Checkbox>

              <Checkbox
                checked={formik.values.delete}
                onChange={(e) => {
                  formik.setFieldValue("delete", e.target.checked);
                  formik.setFieldTouched("permissionsCheck", true);
                }}
              >
                Delete
              </Checkbox>
            </Flex>
            {/* </div> */}
          </Flex>
        );

      default:
        return null;
    }
  };


  return (
    <div className={styles.userFormContent}>
      {/* form */}
      <form onSubmit={formik.handleSubmit} className={`${styles.form} custom-scroll`}>
        <div className={styles.container}>
          <div className={`${styles.scrollerContainer}`}>
            <Flex vertical gap={12}>
              <Flex vertical gap={8} ref={(ref) => ref ? (fieldRef.current[0] = ref) : null}>
                <label>{t("Upload Image")}</label>
                <Avatar
                  shape="circle"
                  size={75}
                  icon={<UserOutlined />}
                  src={avatarImage}
                  // onClick={() => setIsModalOpen(true)}
                  onClick={!disableIfExtinct() ? handleAvatarClick : undefined}
                  style={{ cursor: disableIfExtinct() ? "default" : "pointer" }}
                />
              </Flex>

              {columnChooserData
                .filter((field) => field.isVisible)
                .map((field) => (
                  <div key={field.id}>
                    {renderFieldByValue(field)}
                  </div>
                ))}

            </Flex>
          </div>
          <div className={styles.footerBtnContainer}>
            <ButtonComponent
              type="text"
              className={styles.cancel_button}
              onClickEvent={onClose}
            >
              {t("Close")}
            </ButtonComponent>
            <div ref={(ref) =>
              ref ? (fieldRef.current[14] = ref) : null}>
              <ButtonComponent
                type="link"
                htmlType="reset"
                className={styles.formBtn}
                // onClickEvent={() => formik.handleReset()}
                onClickEvent={handleReset}
                // disabled={
                //   isExtinct ||
                //   !branchOffice?.[0]?.headOffice ||
                //   handleIsEdit()
                // }
                disabled={disableAction}
              >
                {t("Reset")}
              </ButtonComponent>
            </div>
            <div ref={(ref) =>
              ref ? (fieldRef.current[15] = ref) : null} >
              <ButtonComponent
                type="primary"
                htmlType="submit"
                className={styles.submitbtn}
                size="middle"
                // disabled={disableAction}
                // disabled={
                //   type == "create"
                //     ? !access?.isAdd
                //     : !access?.isEdit
                //       || (!rowData?.isActive && rowData !== undefined)
                //       ? true
                //       : false
                // }

                // disabled={
                //   handleIsEdit()
                // }

                disabled={disableSaveButton}
              // onClickEvent={() => formik.handleSubmit()}
              >
                {type === "create" ? t("Create") : t("Save")}
              </ButtonComponent>
            </div>
          </div>

        </div>

      </form>

      <ProfileModal
        openModal={isModalOpen}
        onCancel={handleModalCancel}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onUpload={handleImageUpload}
        onRemove={handleRemove}
        avatarImage={avatarImage}
      />
    </div>
  );
}
export default SuperUserForm;