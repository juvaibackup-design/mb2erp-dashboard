"use client";
import React, { useState, useEffect, useRef } from "react";
import { Drawer, Layout, Flex, InputRef, Spin, Input, Card, Row, Col } from "antd";
import * as Yup from "yup";
import { Typography, Space, Avatar } from "antd";
import { CloseCircleOutlined, CloseOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import cssStyles from "./posmodal.module.css";
import { useFormik } from "formik";
import { Avatar1 } from "@/components/Svg/Avatar1";
import { User } from "@/components/Svg/User";
import { Phone } from "@/components/Svg/Phone";
import { BreifCase } from "@/components/Svg/BreifCase";
import { Clock } from "@/components/Svg/Clock";
import { Tropy } from "@/components/Svg/Tropy";
import { CoinsHand } from "@/components/Svg/CoinsHand";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/store/userInfo/store";
import { useRouter } from "next/navigation";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import { usePOSContext } from "@/store/context/POSContext";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import FloatInputComponent from "@/components/InputComponent/FloatInput";
import FloatSelectComponent from "@/components/SelectComponent/FloatSelect";
import FloatDatepickerComponent from "@/components/DatepickerComponent/FloatDatepicker";
import {
  getBranchIdByHeader,
  getCompanyDetails,
} from "@/lib/helpers/getCookiesClient";
import { indexList } from "@/components/SideBar/Constants";

interface RetailFormInterface {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: "create" | "edit";
  newCustomer?: any;
  editCustomer?: any;
}

export interface InitialValues {
  gender: string;
  religion: string;
  married: string;
  walkin_by: string;
  sub_ledger_id: string;
  card_type: string | null;
  ref_member_no: string | number | null;
  price_list: string | number | null;
  country_id: null;
  benefit_code: string;
  state_id: number | null;
  city_id: null;
  area_id: null;
  street: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  mobile_no: string;
  email_id: string;
  dob: Dayjs | null;
  profession: string;
  dom: Dayjs | null;
  gst_no: string;
  pan_no: string;
  whatsapp_no: string;
  building_no: string;
  member_no: string;
  event_name: string;
  card_no: string;
  pincode: string;
  is_active: boolean;
  familyMembers: {
    relation: any;
    relation_name: string;
    date_of_birth: Dayjs | null;
    mobileNo: string;
  }[];
  image_data: [
    {
      FileName: string;
      FileData: string;
      FileType: string | undefined;
    }
  ];
}

const { Content, Footer, Sider } = Layout;

const CustomerTray: React.FC<RetailFormInterface> = ({
  open,
  setOpen,
  type,
  newCustomer,
  editCustomer,
}) => {
  const { customerInitData, saveCustomer, customerList, getAllCustomer, globalSetting, countryCode } = usePOSContext(
    (state) => state
  );
  const { t } = useTranslation();
  const [access, setAccess] = useState<any>(null);
  const userDetails = useUserStore((state: any) => JSON.parse(state?.user));
  const { mobileNoDigit } = globalSetting;
  const [selectedKey, setSelectedKey] = useState("1");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null); // Type the ref as HTMLDivElement
  const isScrolling = React.useRef(false);
  const [rowData, setRowData] = useState<any | null>(null);
  const [benefitTypes, setBenefitTypes] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [areaList, setAreaList] = useState<any[]>([]);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const inputref = useRef<InputRef>(null);
  const [columnChooserData, setColumnChooserData] = useState<any[]>([]);
  const [p_index, c_index, gc_index] = indexList["Customer"];
  const [newMember, setNewMember] = useState({
    relation: "",
    relation_name: "",
    date_of_birth: null as Dayjs | null,
    mobileNo: "",
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();

  const card_type = customerInitData?.card_type;
  const religion = customerInitData?.religion;
  const gender = customerInitData?.gender;
  const reference_member = customerInitData?.reference_member;
  const price_list = customerInitData?.price_list;
  const sub_ledger = customerInitData?.sub_ledger;
  const martial_status = customerInitData?.martial_status;
  const walkin_by = customerInitData?.walkin_by;
  const country = customerInitData?.country;

  const panRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  const gstNumberRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Za-z]{1}$/;

  // const [triggerScroll, setTriggerScroll] = useState(true)
  // console.log('triggerScroll', triggerScroll)
  const [initData, setInitData] = useState<InitialValues>({
    gender: "",
    religion: "",
    married: "",
    walkin_by: "",
    sub_ledger_id: "",
    card_type: null,
    ref_member_no: null,
    price_list: "",
    country_id: null,
    benefit_code: "",
    state_id: null,
    city_id: null,
    area_id: null,
    street: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    mobile_no: "",
    email_id: "",
    dob: null,
    profession: "",
    dom: null,
    gst_no: "",
    pan_no: "",
    whatsapp_no: "",
    building_no: "",
    member_no: "",
    card_no: "",
    event_name: "",
    pincode: "",
    familyMembers: [],
    is_active: false,
    image_data: [
      {
        FileName: "",
        FileData: "",
        FileType: "",
      },
    ],
  });

  const disableIfExtinct = () => {
    if (rowData) {
      if (!rowData?.isActive || formik.errors.card_type) {
        return true;
      } else {
        return false;
      }
    }
  };

  //handling is_edit functionality based on access previlidge
  const handleIsEdit = () => {
    if (rowData) {
      return !access?.is_edit;
    }
  };

  //this useeffect to handle access based on access previlidge
  useEffect(() => {
    if (!userDetails) return;
    const accessList = userDetails?.accessPrivilegeList || [];
    const foundAccess = accessList.find(
      (item: any) => item.form_name === "Customer"
    );
    setAccess(foundAccess);
    if (!Boolean(foundAccess?.is_view)) {
      alert(`You don't have access to this page`);
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails?.accessPrivilegeList?.length]);

  /******load benefit function********/
  const loadBenefitType = async (value: any) => {
    const endPoint = `GetBenefitTypeForLoyaltyMember?card_type=${value}`;
    try {
      const response = await makeApiCall.get(endPoint);

      if (response.status == 200) {
        setBenefitTypes(response.data.data.benefit);

        // Extracting memberNo and cardNo
        const { memberNo } = response.data.data;
        if (type == "create") {
          if (memberNo) {
            formik.setFieldValue("member_no", memberNo.memberNo);
            formik.setFieldValue("card_no", memberNo.cardNo);
          }
        }
      } else {
        // console.error("error");
      }
    } catch (error) {
      alert(
        "The selected Card Type has exceeded the segment lenght so you can't use this Card type"
      );
    }
  };

  /*****card type dropdown*****/
  const cardTypeOptions = card_type?.map((card: any) => {
    return {
      value: card.r_card_type_code.toString(),
      label: card.r_card_name,
      disabled: !card.r_is_active,
    };
  });

  const activeStockPointIds: any = cardTypeOptions
    ?.filter((card_type: any) => card_type?.disabled === false)
    .map((card_type: any) => card_type.value);

  /********benefits dropdown*********/
  const benefitsOptions = benefitTypes?.map((benefit_type) => {
    return {
      value: benefit_type.r_beneit_code,
      label: benefit_type.r_benefit_name,
    };
  });

  /*****religion dropdown*****/
  const religionOptions = religion?.map((religion: any) => {
    return {
      value: religion.name,
      label: religion.name,
    };
  });

  /*****gender dropdown*****/
  const genderOptions = gender?.map((gender: any) => {
    return {
      value: gender.name,
      label: gender.name,
    };
  });

  /*****refrence member dropdown*****/
  const refrenceOptions = reference_member?.map((reference_member: any) => {
    return {
      value: reference_member.id.toString(),
      label: `${reference_member.displayName} (${reference_member.mobileNo})`,
    };
  });

  /*****pricelist dropdown*****/
  const priceListOptions = price_list?.map((price_list: any) => {
    return {
      value: price_list.r_id.toString(),
      label: price_list.r_price_list,
    };
  });

  /*****sub ledger dropdown*****/
  const subLedgerOptions = sub_ledger?.map((sub_ledger: any) => {
    return {
      value: sub_ledger.r_sl_id.toString(),
      label: sub_ledger.r_sl_name,
    };
  });

  /*****martial status dropdown*****/
  const martialOptions = martial_status?.map((martial_status: any) => {
    return {
      value: martial_status.name,
      label: martial_status.name === "Yes" ? "Married" : "Unmarried",
    };
  });

  /*****walkin by dropdown*****/
  const walkinbyOptions = walkin_by?.map((walkinby: any) => {
    return {
      value: walkinby.name,
      label: walkinby.name,
    };
  });

  /*****country dropdown*****/
  const countryOptions = country?.map((country: any) => {
    return {
      value: country.r_cyc_id.toString(),
      label: country.r_country,
    };
  });

  /********state dropdown*********/
  const stateOptions = stateList?.map((state) => {
    return {
      value: state.c_id.toString(),
      label: state.name,
    };
  });

  /********city dropdown*********/
  const cityOptions = cityList?.map((city) => {
    return {
      value: city.c_id.toString(),
      label: city.name,
    };
  });

  /********area dropdown*********/
  const areaOptions = areaList?.map((area) => {
    return {
      value: area.c_id.toString(),
      label: area.name,
    };
  });

  /******load state function******/
  const loadState = async (value: any) => {
    const endPoint = `GetAddressDetailsForLoyaltyMember`;
    const requestBody = {
      parent_id: `${value}`,
    };

    try {
      const response = await makeApiCall.post(endPoint, requestBody);

      if (response.status == 200) {
        setStateList(response.data.data);
      } else {
        // console.error("error");
      }
    } catch (error) {
      // console.error("Failed to fetch benefit types:", error);
    }
  };

  /******load city function******/
  const loadCity = async (value: any) => {
    const endPoint = `GetAddressDetailsForLoyaltyMember`;
    const requestBody = {
      parent_id: `${value}`,
    };

    try {
      const response = await makeApiCall.post(endPoint, requestBody);

      if (response.status == 200) {
        setCityList(response.data.data);
      } else {
        // console.error("error");
      }
    } catch (error) {
      // console.error("Failed to fetch benefit types:", error);
    }
  };

  /******load area function******/
  const loadArea = async (value: any) => {
    const endPoint = `GetAddressDetailsForLoyaltyMember`;
    const requestBody = {
      parent_id: `${value}`,
    };

    try {
      const response = await makeApiCall.post(endPoint, requestBody);

      if (response.status == 200) {
        setAreaList(response.data.data);
      } else {
        // console.error("error");
      }
    } catch (error) {
      // console.error("Failed to fetch benefit types:", error);
    }
  };

  /*****handling image data******/
  const handleImageData = (rowData: any) => {
    if (
      rowData &&
      rowData?.image_data?.length > 0 &&
      rowData?.image_data?.[0]?.fileData
    ) {
      const base64Image = `data:${rowData?.image_data?.[0].fileType};base64,${rowData?.image_data?.[0].fileData}`;
      setAvatarImage(base64Image);
    } else {
      setAvatarImage(null); // or setAvatarImage(initialValue);
    }
  };

  useEffect(() => {
    if (rowData) {
      handleImageData(rowData);

      // loadBenefitType(rowData.card_type);
      // formik.resetForm();
      setInitData({
        gender: rowData?.gender || "",
        religion: rowData?.religion || "",
        married: rowData?.martialStatus || "",
        walkin_by: rowData?.walkinBy || "",
        member_no: rowData?.memberNo || "",
        card_no: rowData?.cardNo || "",
        sub_ledger_id: rowData?.subLedgerId || "", // as sub_ledger_id
        card_type: rowData?.cardType || "",
        ref_member_no: parseInt(rowData?.refMemberNo) || "",
        price_list: parseInt(rowData?.priceList) || "",
        country_id:
          rowData?.countryId > 0 ? rowData?.countryId?.toString() : "",
        benefit_code: rowData?.benefitCode, // as benefit_code
        state_id: rowData?.stateId > 0 ? rowData?.stateId?.toString() : "",
        city_id: rowData?.cityId > 0 ? rowData?.cityId?.toString() : "",
        area_id: rowData?.areaId > 0 ? rowData?.areaId?.toString() : "",
        street: rowData?.street > 0 ? rowData?.street?.toString() : "",
        first_name: rowData?.firstName || "",
        middle_name: rowData?.middleName || "",
        last_name: rowData?.lastName || "",
        event_name: rowData?.eventName || "",
        mobile_no: rowData?.mobileNo || "",
        email_id: rowData?.email || "",
        dob:
          rowData?.dob && dayjs(rowData.dob).isSame("1900-01-01", "day")
            ? null
            : rowData?.dob
              ? dayjs(rowData.dob)
              : null,
        profession: rowData?.profession,
        dom:
          rowData?.dom && dayjs(rowData.dom).isSame("1900-01-01", "day")
            ? null
            : rowData?.dom
              ? dayjs(rowData.dom)
              : null,
        gst_no: rowData?.gstNumber || "",
        pan_no: rowData?.gstNumber ? rowData?.gstNumber : "",
        whatsapp_no: rowData?.buildingNumber || "",
        building_no: rowData?.buildingNumber || "",
        pincode: rowData?.pincode || "",
        familyMembers: rowData?.familyMembers?.length
          ? rowData.familyMembers.map((m: any) => ({
            relation: m.relation ?? "",
            relation_name: m.relation_name ?? "",
            date_of_birth: m.date_of_birth
              ? dayjs(m.date_of_birth)
              : null,
            mobileNo: m.mobileNo ?? "",
          }))
          : [],
        is_active: rowData?.isActive,
        image_data: rowData?.image_data, // Include image_data directly in initData
      });
      loadBenefitType(rowData?.cardType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData]);

  /*****this to render the dropdown values******/
  useEffect(() => {
    if (rowData?.countryId) {
      loadState(rowData?.countryId);
    }
    if (rowData?.stateId) {
      loadCity(rowData?.stateId);
    }
    if (rowData?.cityId) {
      loadArea(rowData?.cityId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData?.countryId, rowData?.stateId, rowData?.cityId]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const payloadValues = {
          roleId: userDetails.roleId,
          pIndex: p_index,
          cIndex: c_index,
          gcIndex: gc_index,
        };

        const response = await makeApiCall.post(
          "Getwebfieldconfiguration",
          payloadValues
        );

        console.log("response", response);

        if (response?.data?.data) {
          const fields = response.data.data[0].group.flatMap((group: any) =>
            group.fields
              .filter((field: any) => field.isRequired)
              .map((field: any) => ({
                id: field.columnId, // Map columnId to id
                label: field.field, // Map field to label
                isVisible: field.isVisible,
                isMandatory: field.isMandatory,
              }))
          );

          // Add dynamic "value" property based on label
          const updatedFields = fields.map((field: any) => {
            let dynamicProperty = {};

            switch (field.label) {
              case "First Name":
                dynamicProperty = { value: "first_name" };
                break;
              case "Middle Name":
                dynamicProperty = { value: "middle_name" };
                break;
              case "Last Name":
                dynamicProperty = { value: "last_name" };
                break;
              case "Contact Number":
                dynamicProperty = { value: "mobile_no" };
                break;
              case "PAN Number":
                dynamicProperty = { value: "pan_no" };
                break;
              case "Card Type":
                dynamicProperty = { value: "card_type" };
                break;
              case "Member Number":
                dynamicProperty = { value: "member_no" };
                break;
              case "Card Number":
                dynamicProperty = { value: "card_no" };
                break;
              case "GST Number":
                dynamicProperty = { value: "gst_no" };
                break;
              case "Profession":
                dynamicProperty = { value: "profession" };
                break;
              case "Whats app Number":
                dynamicProperty = { value: "whatsapp_no" };
                break;
              case "Email":
                dynamicProperty = { value: "email_id" };
                break;
              case "Street":
                dynamicProperty = { value: "street" };
                break;
              case "Building Number":
                dynamicProperty = { value: "building_no" };
                break;
              case "DOM":
                dynamicProperty = { value: "dom" };
                break;
              case "Benefit Type":
                dynamicProperty = { value: "benefit_code" };
                break;
              case "DOB":
                dynamicProperty = { value: "dob" };
                break;
              case "Walkin By":
                dynamicProperty = { value: "walkin_by" };
                break;
              case "Religion":
                dynamicProperty = { value: "religion" };
                break;
              case "Gender":
                dynamicProperty = { value: "gender" };
                break;
              case "Reference Member":
                dynamicProperty = { value: "ref_member_no" };
                break;
              case "Price List":
                dynamicProperty = { value: "price_list" };
                break;
              case "Sub Ledger":
                dynamicProperty = { value: "sub_ledger_id" };
                break;
              case "Martial Status":
                dynamicProperty = { value: "married" };
                break;
              case "Country":
                dynamicProperty = { value: "country_id" };
                break;
              case "City":
                dynamicProperty = { value: "city_id" };
                break;
              case "Area":
                dynamicProperty = { value: "area_id" };
                break;
              case "Pin Code":
                dynamicProperty = { value: "pinCode" };
                break;
              case "State":
                dynamicProperty = { value: "state_id" };
                break;
              case "Relation":
                dynamicProperty = { value: "relation" };
                break;
              case "Relation Name":
                dynamicProperty = { value: "relation_name" };
                break;
              case "Date of Birth":
                dynamicProperty = { value: "date_of_birth" };
                break;
              case "Mobile Number":
                dynamicProperty = { value: "mobileNo" };
                break;
            }

            return { ...field, ...dynamicProperty };
          });

          console.log("Updated Fields with Value Properties:", updatedFields);
          setColumnChooserData(updatedFields); // Set the updated fields
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateDynamicValidation = (columnChooserData: any) => {
    console.log("columnChooser", columnChooserData);

    return columnChooserData?.reduce((shape: any, field: any) => {
      if (field.isMandatory) {
        switch (field.value) {
          case "first_name":
            shape[field.value] = Yup.string()
              .required(t("requiredField"))
              .max(50, t("Maximum length is 50 characters"));
            break;

          case "middle_name":
            shape[field.value] = Yup.string().max(
              50,
              t("Maximum length is 50 characters")
            );
            break;

          case "last_name":
            shape[field.value] = Yup.string().max(
              50,
              t("Maximum length is 50 characters")
            );
            break;

          case "last_name":
            shape[field.value] = Yup.string().max(
              50,
              t("Maximum length is 50 characters")
            );
            break;

          case "mobile_no":
            shape[field.value] = Yup.string()
              .matches(/^[6-9]\d{9}$/, t("Invalid phone number"))
              .required(t("requiredField"));
            break;

          case "pan_no":
            shape[field.value] = Yup.string()
              .matches(panRegex, t("Invalid PAN format"))
              .max(10, t("Maximum length is 10 characters"));
            break;

          case "card_type":
            shape[field.value] = Yup.string()
              .required(t("requiredField"))
              .oneOf(activeStockPointIds ?? [], "card type is not active");
            break;

          case "member_no":
            shape[field.value] = Yup.string().required(t("requiredField"));
            break;

          case "card_no":
            shape[field.value] = Yup.string().required(t("requiredField"));
            break;

          case "walkin_by":
            shape[field.value] = Yup.string().required(t("requiredField"));
            break;

          case "gst_no":
            shape[field.value] = Yup.string().matches(
              gstNumberRegex,
              t("Invalid GST Number")
            );
            break;

          case "profession":
            shape[field.value] = Yup.string().max(
              50,
              t("Maximum length is 50 characters")
            );
            break;

          case "whatsapp_no":
            shape[field.value] = Yup.string().matches(
              /^[6-9]\d{9}$/,
              t("Invalid phone number")
            );
            break;

          case "email_id":
            Yup.string()
              .email(t("Invalid email format"))
              .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                t("Invalid email format")
              );
            break;

          case "street":
            shape[field.value] = Yup.string().max(
              50,
              t("Maximum length is 50 characters")
            );
            break;

          case "building_no":
            shape[field.value] = Yup.string().max(
              5,
              t("Maximum length is 5 characters")
            );
            break;

          case "dom":
            shape[field.value] = Yup.date().when("married", {
              is: "Yes",
              then: (validationSchema) =>
                validationSchema.required(
                  t("This field is required if martial status is married")
                ),
              otherwise: (validationSchema) => validationSchema.nullable(),
            });
            break;

          default:
            shape[field.value] = Yup.string().nullable(); // Optional field
            break;
        }
      }
      return shape;
    }, {});
  };

  const dynamicValidations = generateDynamicValidation(columnChooserData);
  /********validation schema******/
  // const validationSchema = (editMode: boolean) =>
  //   Yup.object().shape({
  //     first_name: Yup.string()
  //       .required(t("requiredField"))
  //       .max(50, t("Maximum length is 50 characters")),
  //     middle_name: Yup.string().max(50, t("Maximum length is 50 characters")),
  //     last_name: Yup.string().max(50, t("Maximum length is 50 characters")),
  //     mobile_no: Yup.string()
  //       .required(t("requiredField"))
  //       // .matches(/^[6-9]\d{9}$/, t("Invalid phone number"))
  //       .test(
  //         "is-valid-phone",
  //         "Invalid mobile number",
  //         (value: any) => value && value.length === mobileNoDigit // Custom validation function
  //       ),
  //     // .test("is-unique", "Mobile number already exists", async (value) => {
  //     // await getAllCustomer(null, value);
  //     // const selectedCus = customerList?.filter(
  //     // (item: any) =>
  //     // item?.mobileNo === value && initData.mobile_no !== value
  //     // );
  //     // return !selectedCus?.length; // Return `false` if the mobile number exists
  //     // }),
  //     pan_no: Yup.string()
  //       .matches(panRegex, t("Invalid PAN format"))
  //       .max(10, t("Maximum length is 10 characters")),
  //     card_type: Yup.string().required(t("requiredField")),
  //     // .oneOf(activeStockPointIds ?? [], "card type is not active"),
  //     member_no: Yup.string().required(t("requiredField")),
  //     card_no: Yup.string().required(t("requiredField")),
  //     gst_no: Yup.string().matches(gstNumberRegex, t("Invalid GST Number")),
  //     profession: Yup.string().max(50, t("Maximum length is 50 characters")),
  //     whatsapp_no: Yup.string()
  //       // .matches(/^[6-9]\d{9}$/, t("Invalid phone number"))
  //       .nullable()
  //       .test(
  //         "is-valid-phone",
  //         "Invalid whatsapp number",
  //         (value: any) => {
  //           if (!value) return true;
  //           return value.length === mobileNoDigit;
  //         }// Custom validation function
  //       ),
  //     // .test("is-unique", "Mobile number already exists", async (value) => {
  //     //   // Replace `customerList` with the actual list or fetch logic
  //     //   if (!value) return true;
  //     //   // await getAllCustomer(null, value);
  //     //   const selectedCus = customerList?.filter(
  //     //     (item: any) =>
  //     //       item?.whatsappNo === value && initData.whatsapp_no !== value
  //     //   );
  //     //   return !selectedCus?.length; // Return `false` if the mobile number exists
  //     // }),
  //     email_id: Yup.string()
  //       .email(t("Invalid email format"))
  //       // .matches(
  //       //   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  //       //   t("Invalid email format")
  //       // ),
  //       .matches(/@.*\./, t("Invalid email format")),
  //     street: Yup.string().max(50, t("Maximum length is 50 characters")),
  //     building_no: Yup.string().max(10, t("Maximum length is 10 characters")),
  //     dom: Yup.date().when("married", {
  //       is: "Yes",
  //       then: (validationSchema) =>
  //         validationSchema.required(t("This field is required")),
  //       otherwise: (validationSchema) => validationSchema.nullable(),
  //     }),
  //     event_name: Yup.string().when("walkin_by", {
  //       is: "Event",
  //       then: (validationSchema) =>
  //         validationSchema.required(t("This field is required")),
  //       otherwise: (validationSchema) => validationSchema.nullable(),
  //     }),
  //     // .test(
  //     //   "is-20-years-after-dob",
  //     //   "DOM must be at least 20 years greater than DOB",
  //     //   function (value) {
  //     //     const { dob } = this.parent;
  //     //     if (!dob || !value) {
  //     //       return true; // Validation will pass if either dob or dom is not provided
  //     //     }
  //     //     return (
  //     //       dayjs(value).isAfter(dayjs(dob).add(18, "years")) &&
  //     //       dayjs(value).year() !== dayjs(dob).year()
  //     //     );
  //     //   }
  //     // ),
  //   });

  const validationSchema = Yup.object().shape({
    ...dynamicValidations
  });


  const formik = useFormik({
    initialValues: initData,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const branchId = getBranchIdByHeader("companyId");
        const companyId = getCompanyDetails("id");
        setLoading(true);
        const data: any =
          type === "create"
            ? {
              id: 0,
              ...values,

              branch_id: branchId,
              company_id: companyId,
              dom: values.dom ? values.dom : "1900-01-01",
              dob: values.dob ? values.dob : "1900-01-01",
              country_id: values.country_id ? values.country_id : 0,
              state_id: values.state_id ? values.state_id : 0,
              city_id: values.city_id ? values.city_id : 0,
              area_id: values.area_id ? values.area_id : 0,
              sub_ledger_id: values.sub_ledger_id ? values.sub_ledger_id : 0,
              // image_data: values.image_data,
              image_data: values.image_data,
              is_active: values.is_active === true ? false : true,
            }
            : {
              id: rowData?.id,
              ...values,
              card_no: rowData?.cardNo,
              member_no: rowData.memberNo,
              company_prefix: rowData.companyPrefix,
              branch_id: branchId,
              company_id: companyId,
              dom: values.dom ? values.dom : "1900-01-01",
              dob: values.dob ? values.dob : "1900-01-01",
              country_id: values.country_id ? values.country_id : 0,
              state_id: values.state_id ? values.state_id : 0,
              city_id: values.city_id ? values.city_id : 0,
              area_id: values.area_id ? values.area_id : 0,
              sub_ledger_id: values.sub_ledger_id ? values.sub_ledger_id : 0,
              image_data: values.image_data,
            };
        const response = await saveCustomer(data);

        if (response.status === 200) {
          if (type === "create") {
            setOpen(false);
            setLoading(false);
            // setNotificationDisplayed(true);
            // setTimeout(() => {
            //   setNotificationDisplayed(false);
            // }, 2000);
          } else {
            setOpen(false);
            setLoading(false);
            // handleUpdateFromPos();

            // setEditNotificationDisplayed(true);
            // setTimeout(() => {
            //   setEditNotificationDisplayed(false);
            // }, 2000);
          }
        }
      } catch (error: any) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 422
        ) {
          setLoading(false);
          const keys = Object.keys(error?.response?.data?.errors);
          keys &&
            keys?.forEach((key: string) => {
              formik.setFieldError(
                `${key}`,
                `${error?.response?.data?.errors?.[key]?.[0]}`
              );
            });
        } else {
          setLoading(false);
          const msg =
            type === "create"
              ? "Something went wrong when creating new Customer"
              : "Something went wrong when update Customer";
          alert(msg);
        }
      }
    },
  });

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>, mobile = true) => {
    const { name, value } = e.target;

    formik.setFieldTouched(name, true);

    if (!value || (value === initData.mobile_no || value === initData.whatsapp_no)) {
      formik.setFieldError(name, "");
      return;
    }

    try {
      const response = await getAllCustomer(null, value);
      const customers = response?.data ?? [];
      const exists = customers.some(
        (item: any) => ((mobile && item?.mobileNo?.trim() === value.trim()) || (!mobile && item?.whatsappNo?.trim() === value.trim())))
      if (exists) {
        formik.setFieldError(name, `${mobile ? 'Mobile' : 'Whatsapp'} number already exists`);
      } else {
        formik.setFieldError(name, "");
      }
    } catch (err) {
      console.error("Error validating mobile number:", err);
    }
  }


  //reset form;
  const handleReset = () => {
    formik.resetForm();
    if (type === "create") {
      setAvatarImage(null);
    } else if (type === "edit") {
      if (rowData !== undefined) {
        handleImageData(rowData);
        setTimeout(() => {
          formik.validateForm();
        }, 0);
        tagRevalidate("customer");
      } else {
        handleImageData(rowData);
      }
    }
  };

  /*****passing the params in edit function*****/
  const getMemberById = async () => {
    const id = editCustomer?.id;
    const member_no = editCustomer?.memberNo;
    const company_prefix = editCustomer?.companyPrefix;
    const card_type = editCustomer?.cardType;

    const body = {
      id: id,
      member_no: member_no,
      company_prefix: company_prefix,
      card_type: card_type,
    };
    try {
      const response = await makeApiCall.post("GetSelectedLoyaltyMember", body);
      if (response.status === 200) {
        setRowData(response?.data?.data?.[0]);
      }
    } catch (error) {
      // console.log("error", error);
    }
  };

  useEffect(() => {
    if (type === "edit") {
      // getMemberById();
      setRowData(editCustomer);
    } else if (type === "create") {
      if (newCustomer) {
        setInitData((prev) => ({
          ...prev,
          mobile_no: newCustomer?.values?.mobile,
          whatsapp_no: newCustomer?.values?.mobile,
          first_name: newCustomer?.values?.name,
          card_type: newCustomer?.values?.cardType,
        }));
        if (newCustomer?.values?.cardType)
          loadBenefitType(newCustomer?.values?.cardType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    inputref.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleScroll = () => {
    if (isScrolling.current) return; // Skip if programmatically scrolling

    const contentElement = contentRef.current;
    if (contentElement) {
      const scrollPosition = contentElement.scrollTop;

      // Dynamically calculate section offsets
      const sectionOffsets = [
        { id: "section-personal-details", key: "1" },
        { id: "section-contact-details", key: "2" },
        { id: "section-business-details", key: "3" },
        { id: "section-purchase-history", key: "4" },
        { id: "section-points", key: "5" },
        { id: "section-credit", key: "6" },
      ].map((section) => ({
        key: section.key,
        offset: document.getElementById(section.id)?.offsetTop || 0,
      }));

      // Update active menu item based on scroll position
      // for (let i = sectionOffsets.length - 1; i >= 0; i--) {
      //   if (scrollPosition >= sectionOffsets[i].offset - 115) {
      //     setSelectedKey(sectionOffsets[i].key);
      //     break;
      //   }
      // }
    }
  };
  const relationOptions = [
    { label: "Father", value: "Father" },
    { label: "Mother", value: "Mother" },
    { label: "Spouse", value: "Spouse" },
    { label: "Son", value: "Son" },
    { label: "Daughter", value: "Daughter" },
    { label: "Brother", value: "Brother" },
    { label: "Sister", value: "Sister" },
    { label: "Grandfather", value: "Grandfather" },
    { label: "Grandmother", value: "Grandmother" },
    { label: "Other", value: "OTHER" },
  ];

  const scrollToSection = (key: "1" | "2" | "3" | "4" | "5" | "6" | "7") => {
    const section = {
      "1": "section-personal-details",
      "2": "section-contact-details",
      "3": "section-family-details",
      "4": "section-business-details",
      "5": "section-purchase-history",
      "6": "section-points",
      "7": "section-credit",
    }[key];

    if (section) {
      const sectionElement = document.getElementById(section);
      const offset = 115; // Adjust this value as per the height of your fixed header
      const contentElement = contentRef.current;

      if (contentElement && sectionElement) {
        const topPosition = sectionElement.offsetTop - offset;
        isScrolling.current = true;

        contentElement.scrollTo({
          top: topPosition,
          behavior: "smooth",
        });

        setTimeout(() => {
          isScrolling.current = false;
        }, 500); // Ensure programmatic scrolling is complete
      }
    }
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      return () => contentElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const onMenuHandler = (key: string) => {
    setSelectedKey(key);
    scrollToSection(key as "1" | "2" | "3" | "4" | "5" | "6" | "7");
  };

  const layoutStyle = {
    height: "100%",
  };


  // Dark Mode Changes - Sherin
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    const onThemeChanged = (e: any) => {
      const next = (e?.detail as "light" | "dark") ?? "light";
      setTheme(next);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue as "light" | "dark");
      }
    };

    window.addEventListener("icube-theme-changed", onThemeChanged as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("icube-theme-changed", onThemeChanged as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  // Ends


  const siderStyle: React.CSSProperties = {
    textAlign: "center",
    lineHeight: "120px",
    // backgroundColor: "#e3e9ea",                                       // Sherin
    backgroundColor: theme === "dark" ? "#424242" : "#e3e9ea",       //Dark Mode Changes - Sherin
  };

  const footerStyle: React.CSSProperties = {
    textAlign: "center",
    // backgroundColor: "#fff",                                         // Sherin
    backgroundColor: theme === "dark" ? "#141414" : "#fff",         //Dark Mode Changes - Sherin
  };

  return (
    <>
      <Drawer
        headerStyle={{ padding: 0 }}
        bodyStyle={{ padding: 0 }}
        maskClosable={false}
        title={
          <div className={cssStyles.header1}>
            <div className={cssStyles.header2}>
              <Space>
                <div className={cssStyles.avatar1}>
                  <Avatar1 />
                </div>

                <div className={cssStyles.doubleTitle}>
                  <p className={cssStyles.firstTitle}>{t("Customer Profile")}</p>
                  <p className={cssStyles.subTitle}>
                    {t("Know more about your customer")}
                  </p>
                </div>
              </Space>
              <div
                className={cssStyles.cancelButton}
                onClick={() => {
                  setOpen(false);

                  handleReset();
                }}
                style={{ cursor: "pointer" }}
              >
                <CloseOutlined style={{ fontSize: "18px" }} />
              </div>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={800}
        closable={false}
      >
        <Layout style={layoutStyle}>
          {/* <Layout
            style={{ height: "100%", width: "100%", background: "white" }}
          > */}
          <Sider width={200} className={cssStyles.menu1} style={siderStyle}>
            <Flex className={cssStyles.menu2}>
              <div className={cssStyles.menuContainer}>
                <div
                  className={`${cssStyles.menuItem} ${selectedKey === "1" ? cssStyles.active : ""
                    }`}
                  onClick={() => onMenuHandler("1")}
                >
                  <User color={selectedKey === "1" ? "#006875" : "#6F797B"} />
                  <p className={cssStyles.menuItemText}>{t("Personal Details")}</p>
                </div>
                <div
                  className={`${cssStyles.menuItem} ${selectedKey === "2" ? cssStyles.active : ""
                    }`}
                  onClick={() => onMenuHandler("2")}
                >
                  <Phone color={selectedKey === "2" ? "#006875" : "#6F797B"} />
                  <p className={cssStyles.menuItemText}>{t("Contact Details")}</p>
                </div>
                <div
                  className={`${cssStyles.menuItem} ${selectedKey === "3" ? cssStyles.active : ""
                    }`}
                  onClick={() => onMenuHandler("3")}
                >
                  <UsergroupAddOutlined style={{ fontSize: "18px" }} color={selectedKey === "3" ? "#006875" : "#6F797B"} />
                  <p className={cssStyles.menuItemText}>{t("Family Details")}</p>
                </div>
                <div
                  className={`${cssStyles.menuItem} ${selectedKey === "4" ? cssStyles.active : ""
                    }`}
                  onClick={() => onMenuHandler("4")}
                >
                  <BreifCase
                    color={selectedKey === "4" ? "#006875" : "#6F797B"}
                  />
                  <p className={cssStyles.menuItemText}>{t("Business Details")}</p>
                </div>
                <div
                  className={`${cssStyles.menuItem} ${selectedKey === "5" ? cssStyles.active : ""
                    }`}
                  onClick={() => onMenuHandler("5")}
                >
                  <Clock color={selectedKey === "5" ? "#006875" : "#6F797B"} />
                  <p className={cssStyles.menuItemText}>{t("Purchase History")}</p>
                </div>
                <div
                  className={`${cssStyles.menuItem} ${selectedKey === "6" ? cssStyles.active : ""
                    }`}
                  onClick={() => onMenuHandler("6")}
                >
                  <Tropy color={selectedKey === "6" ? "#006875" : "#6F797B"} />
                  <p className={cssStyles.menuItemText}>{t("Points")}</p>
                </div>
                <div
                  className={`${cssStyles.menuItem} ${selectedKey === "7" ? cssStyles.active : ""
                    }`}
                  onClick={() => onMenuHandler("7")}
                >
                  <CoinsHand
                    color={selectedKey === "7" ? "#006875" : "#6F797B"}
                  />
                  <p className={cssStyles.menuItemText}>{t("Wallet")}</p>
                </div>
              </div>
            </Flex>
          </Sider>
          <Layout>
            <Content
              className={cssStyles.contentContainer}
              // style={contentStyle}
              ref={contentRef}
            >
              <div className={cssStyles.customerFormContainer}>
                <div className={cssStyles.subContainer}>
                  <div className={cssStyles.subHeader}>
                    <h3 id="section-personal-details">{t("Personal Details")}</h3>
                    <div className={cssStyles.headerDivider}></div>
                  </div>
                  <div className={cssStyles.customerFormContent}>
                    {columnChooserData
                      ?.filter((column: any) => column.isVisible) // Only include visible fields
                      .sort((a: any, b: any) => a.orderNo - b.orderNo) // Sort by orderNo
                      .map((column: any, i: any) => {
                        switch (column.label) {
                          case "First Name":
                            return (<FloatInputComponent
                              ref={inputref}
                              type="text"
                              name="first_name"
                              maxLength={48}
                              label={`${t("First Name")}`}
                              isrequired={column.isMandatory || false}
                              value={formik.values?.first_name}
                              errormsg={
                                formik?.touched?.first_name &&
                                formik?.errors?.first_name
                              }
                              onChangeEvent={(eve) => {
                                let value = eve.target.value;
                                if (value.length > 25) return;
                                formik.handleChange(eve);
                              }}
                              onBlur={formik.handleBlur}
                              disabled={disableIfExtinct() || handleIsEdit() || loading}
                            />)
                          case "Middle Name":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="middle_name"
                                label={t("Middle Name")}
                                maxLength={48}
                                isrequired={column.isMandatory || false}
                                value={formik.values?.middle_name}
                                errormsg={
                                  formik?.touched?.middle_name &&
                                  formik?.errors?.middle_name
                                }
                                onChangeEvent={(eve) => {
                                  let value = eve.target.value;
                                  if (value.length > 25) return;
                                  formik.handleChange(eve);
                                }}
                                onBlur={formik.handleBlur}
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Last Name":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="last_name"
                                label={t("Last Name")}
                                maxLength={48}
                                isrequired={column.isMandatory || false}
                                value={formik.values?.last_name}
                                errormsg={
                                  formik?.touched?.last_name && formik?.errors?.last_name
                                }
                                onChangeEvent={(eve) => {
                                  let value = eve.target.value;
                                  if (value.length > 25) return;
                                  formik.handleChange(eve);
                                }}
                                onBlur={formik.handleBlur}
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Card Type":
                            return (
                              <FloatSelectComponent
                                label={t("Card Type")}
                                onChange={(value) => {
                                  formik.setFieldValue("card_type", value);
                                  formik.setFieldValue("benefit_code", "");
                                  formik.setFieldValue("member_no", "");
                                  formik.setFieldValue("card_no", "");

                                  loadBenefitType(value);
                                }}
                                errormsg={
                                  formik?.touched?.card_type && formik?.errors?.card_type
                                }
                                required={column.isMandatory || false}
                                onBlur={formik.handleBlur}
                                widthInput="48%"
                                value={formik.values?.card_type || ""}
                                showSearch={true}
                                options={cardTypeOptions}
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={type === "edit" ? true : false || loading}
                              />
                            )
                          case "Card Number":
                            return (
                              <FloatInputComponent
                                type="text"
                                value={formik.values.card_no}
                                isrequired={column.isMandatory || false}
                                label={t("Card Number")}
                                onChangeEvent={(e: any) =>
                                  formik.setFieldValue("card_no", e)
                                }
                                errormsg={
                                  formik?.touched?.card_no && formik?.errors?.card_no
                                }
                                maxLength={48}
                                style={{
                                  // backgroundColor: "#f0f9fc",          
                                  backgroundColor: theme === "dark" ? "#2b2b2bff" : "#f0f9fc",
                                }}
                                disabled={true}
                              />
                            )
                          case "Member Number":
                            return (
                              <FloatInputComponent
                                type="text"
                                isrequired={column.isMandatory || false}
                                value={formik.values.member_no}
                                label={t("Member Number")}
                                onChangeEvent={(e: any) => {
                                  const value = e.target.value;
                                  if (!/^[a-zA-Z0-9]*$/.test(value)) {
                                    return;
                                  }
                                  formik.setFieldValue("member_no", value);
                                }}
                                onBlur={formik.handleBlur}
                                maxLength={48}
                                errormsg={
                                  formik?.touched?.member_no && formik?.errors?.member_no
                                }
                                disabled={type === "edit" ? true : false || loading}
                                style={{
                                  // backgroundColor: type === "edit" ? "#f0f9fc" : "",                      //Dark Mode Changes - Sherin
                                  backgroundColor: type === "edit" ? theme === "dark" ? "#2b2b2bff" : "#f0f9fc" : "",    //Sherin
                                }}
                              />
                            )
                          case "Benefit Type":
                            return (
                              <FloatSelectComponent
                                label={t("Benefit Type")}
                                onChange={(data: any) =>
                                  formik.setFieldValue("benefit_code", data)
                                }
                                widthInput="48%"
                                onBlur={(event: any) => {
                                  formik.setFieldTouched("benefit_code", true);
                                  formik.handleBlur(event);
                                }}
                                required={column.isMandatory || false}
                                errormsg={
                                  formik?.touched?.benefit_code && formik?.errors?.benefit_code
                                }
                                value={formik.values.benefit_code}
                                showSearch={true}
                                options={benefitsOptions}
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={
                                  disableIfExtinct() ||
                                  handleIsEdit() ||
                                  !formik.values.card_type || loading
                                }
                              />
                            )
                          case "DOB":
                            return (
                              <FloatDatepickerComponent
                                widthInput="48%"
                                label={t("DOB")}
                                picker="date"
                                value={
                                  formik.values?.dob ? dayjs(formik.values?.dob) : null
                                }
                                isrequired={column.isMandatory || false}
                                onChange={(value) => {
                                  const datestring = value
                                    ? dayjs(value).format("YYYY-MM-DD")
                                    : null;
                                  formik.setFieldValue("dob", datestring);
                                }}
                                disabledDate={(current: any) =>
                                  current && current > dayjs()
                                }
                                errormsg={
                                  formik?.touched?.dob && formik?.errors?.dob
                                }
                                format={"DD/MM/YYYY"}
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Religion":
                            return (
                              <FloatSelectComponent
                                label={t("Religion")}
                                showSearch={false}
                                options={religionOptions}
                                onChange={(value) => {
                                  formik.setFieldValue("religion", value);
                                }}
                                required={column.isMandatory || false}
                                value={formik.values?.religion}
                                onBlur={(event) => {
                                  formik.setFieldTouched("religion", true);
                                  formik.handleBlur(event);
                                }}
                                errormsg={
                                  formik?.touched?.religion &&
                                  formik?.errors?.religion
                                }
                                widthInput="48%"
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Gender":
                            return (
                              <FloatSelectComponent
                                label={t("Gender")}
                                widthInput="48%"
                                showSearch={false}
                                options={genderOptions}
                                onChange={(value) => {
                                  formik.setFieldValue("gender", value);
                                }}
                                required={column.isMandatory || false}
                                value={formik.values?.gender}
                                onBlur={(event) => {
                                  formik.setFieldTouched("gender", true);
                                  formik.handleBlur(event);
                                }}
                                errormsg={
                                  formik?.touched?.gender &&
                                  formik?.errors?.gender
                                }
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Profession":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="profession"
                                label={t("Profession")}
                                maxLength={48}
                                isrequired={column.isMandatory || false}
                                value={formik.values?.profession}
                                errormsg={
                                  formik?.touched?.profession &&
                                  formik?.errors?.profession
                                }
                                onChangeEvent={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "PAN Number":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="pan_no"
                                label={t("PAN Number")}
                                errormsg={
                                  formik?.touched?.pan_no && formik?.errors?.pan_no
                                }
                                isrequired={column.isMandatory || false}
                                maxLength={48}
                                onChangeEvent={(e) => {
                                  const value = e.target.value.toLocaleUpperCase();
                                  if (!/^[a-zA-Z0-9]*$/.test(value)) {
                                    return;
                                  }
                                  formik.setFieldValue("pan_no", value);
                                  // formik.handleChange(e);
                                }}
                                value={formik.values?.pan_no.toLocaleUpperCase()}
                                onBlur={formik.handleBlur}
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "GST Number":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="gst_no"
                                label={t("GST Number")}
                                isrequired={column.isMandatory || false}
                                errormsg={
                                  formik?.touched?.gst_no && formik?.errors?.gst_no
                                }
                                maxLength={48}
                                onChangeEvent={(e) => {
                                  const value = e.target.value;
                                  if (!/^[a-zA-Z0-9]*$/.test(value)) {
                                    return;
                                  }
                                  formik.handleChange(e);
                                }}
                                value={formik.values?.gst_no}
                                onBlur={formik.handleBlur}
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Reference Member":
                            return (
                              <FloatSelectComponent
                                label={t("Reference Member")}
                                widthInput="48%"
                                showSearch={true}
                                options={refrenceOptions}
                                required={column.isMandatory || false}
                                onChange={(value) => {
                                  formik.setFieldValue("ref_member_no", value);
                                }}
                                value={formik.values?.ref_member_no?.toString() || ""}
                                onBlur={(event) => {
                                  formik.setFieldTouched("ref_member_no", true);
                                  formik.handleBlur(event);
                                }}
                                errormsg={
                                  formik?.touched?.ref_member_no &&
                                  formik?.errors?.ref_member_no
                                }
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Price List":
                            return (
                              <FloatSelectComponent
                                label={t("Price List")}
                                widthInput="48%"
                                showSearch={false}
                                options={priceListOptions}
                                required={column.isMandatory || false}
                                onChange={(value) => {
                                  formik.setFieldValue("price_list", value);
                                }}
                                errormsg={
                                  formik?.touched?.price_list &&
                                  formik?.errors?.price_list
                                }
                                value={formik.values?.price_list?.toString() || ""}
                                onBlur={(event) => {
                                  formik.setFieldTouched("price_list", true);
                                  formik.handleBlur(event);
                                }}
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Sub Ledger":
                            return (
                              <FloatSelectComponent
                                label={t("Sub Ledger")}
                                widthInput="48%"
                                showSearch={true}
                                options={subLedgerOptions}
                                onChange={(value) => {
                                  formik.setFieldValue("sub_ledger_id", value);
                                }}
                                value={
                                  formik.values?.sub_ledger_id.toString() !== "0"
                                    ? formik.values?.sub_ledger_id.toString()
                                    : ""
                                }
                                required={column.isMandatory || false}
                                // value={formik.values?.sub_ledger_id}
                                onBlur={(event) => {
                                  formik.setFieldTouched("sub_ledger_id", true);
                                  formik.handleBlur(event);
                                }}
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                                errormsg={
                                  formik?.touched?.sub_ledger_id &&
                                  formik?.errors?.sub_ledger_id
                                }
                              />
                            )
                          case "Martial Status":
                            return (
                              <FloatSelectComponent
                                label={t("Martial Status")}
                                widthInput="48%"
                                showSearch={false}
                                options={martialOptions}
                                onChange={(value) => {
                                  formik.setFieldValue("married", value);
                                }}
                                required={column.isMandatory || false}
                                value={formik.values?.married}
                                onBlur={(event) => {
                                  formik.setFieldTouched("married", true);
                                  formik.handleBlur(event);
                                }}
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                                errormsg={
                                  formik?.touched?.married &&
                                  formik?.errors?.married
                                }
                              />
                            )
                          case "DOM":
                            return (
                              <>
                                {formik.values?.married === "Yes" ? (
                                  <FloatDatepickerComponent
                                    placeholder="Select Date"
                                    label={t("DOM")}
                                    allowClear
                                    isrequired={column.isMandatory || false}
                                    value={
                                      formik.values?.dom ? dayjs(formik.values?.dom) : null
                                    }
                                    onChange={(value) => {
                                      const datestring = value
                                        ? dayjs(value).format("YYYY-MM-DD")
                                        : null;
                                      formik.setFieldValue("dom", datestring);
                                    }}
                                    errormsg={formik?.touched?.dom && formik?.errors?.dom}
                                    disabledDate={(current: any) =>
                                      current && current > dayjs()
                                    }
                                    format={"DD/MM/YYYY"}
                                    disabled={disableIfExtinct() || handleIsEdit() || loading}
                                    widthInput={"48%"}
                                  />
                                ) : (formik.values?.dom && formik.setFieldValue("dom", null))
                                }
                              </>
                            )
                          case "Walkin By":
                            return (
                              <FloatSelectComponent
                                label={t("Walkin By")}
                                widthInput="48%"
                                showSearch={false}
                                options={walkinbyOptions}
                                onChange={(value) => {
                                  formik.setFieldValue("walkin_by", value);
                                }}
                                value={formik.values?.walkin_by}
                                required={column.isMandatory || false}
                                onBlur={(event) => {
                                  formik.setFieldTouched("walkin_by", true);
                                  formik.handleBlur(event);
                                }}
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                errormsg={formik?.touched?.walkin_by && formik?.errors?.walkin_by}
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Event Name":
                            return (
                              formik.values?.walkin_by === "Event" && (
                                <FloatInputComponent
                                  type="text"
                                  name="event_name"
                                  isrequired={column.isMandatory || false}
                                  label={t("Event Name")}
                                  errormsg={
                                    formik?.touched?.event_name &&
                                    formik?.errors?.event_name
                                  }
                                  maxLength={48}
                                  onChangeEvent={(e) => {
                                    formik.handleChange(e);
                                  }}
                                  value={formik.values?.event_name}
                                  onBlur={formik.handleBlur}
                                  disabled={disableIfExtinct() || handleIsEdit() || loading}
                                />
                              )
                            )
                        }
                      })
                    }
                  </div>
                </div>
                <div className={cssStyles.subContainer}>
                  <div className={cssStyles.subHeader}>
                    <h3 id="section-contact-details">{t("Contact Details")}</h3>
                    <div className={cssStyles.headerDivider}></div>
                  </div>
                  <div className={cssStyles.customerFormContent}>
                    {columnChooserData
                      ?.filter((column: any) => column.isVisible) // Only include visible fields
                      .sort((a: any, b: any) => a.orderNo - b.orderNo) // Sort by orderNo
                      .map((column: any, i: any) => {
                        switch (column.label) {
                          case "Contact Number":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="mobile_no"
                                label={t("Contact Number")}
                                prefix={`+${countryCode.countryCode}`}
                                isrequired={column.isMandatory || false}
                                maxLength={48}
                                value={formik.values?.mobile_no}
                                onChangeEvent={(e) => {
                                  const value = e.target.value;
                                  if ((!/^\d*$/.test(value) || value.length > mobileNoDigit)) {
                                    return;
                                  }
                                  formik.setFieldValue("whatsapp_no", value);
                                  formik.handleChange(e);
                                }}
                                onBlur={(e) => handleBlur(e, true)}
                                // onBlur={formik.handleBlur}
                                errormsg={
                                  formik?.touched?.mobile_no && formik?.errors?.mobile_no
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Whats app Number":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="whatsapp_no"
                                label={t("Whatsapp Number")}
                                style={{ width: "100%" }}
                                prefix={`+${countryCode.countryCode}`}
                                isrequired={column.isMandatory || false}
                                maxLength={48}
                                value={formik.values?.whatsapp_no}
                                onChangeEvent={(e) => {
                                  const value = e.target.value;
                                  if ((!/^\d*$/.test(value) || value.length > mobileNoDigit)) {
                                    return;
                                  }
                                  formik.handleChange(e);
                                }}
                                onBlur={(e) => handleBlur(e, false)}
                                errormsg={
                                  formik?.touched?.whatsapp_no &&
                                  formik?.errors?.whatsapp_no
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Email":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="email_id"
                                label={t("Email")}
                                maxLength={48}
                                value={formik.values?.email_id}
                                isrequired={column.isMandatory || false}
                                onChangeEvent={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errormsg={
                                  formik?.touched?.email_id && formik?.errors?.email_id
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Country":
                            return (
                              <FloatSelectComponent
                                label={t("Country")}
                                widthInput="48%"
                                showSearch={true}
                                options={countryOptions}
                                onChange={(value) => {
                                  formik.setFieldValue("country_id", value);
                                  formik.setFieldValue("state_id", "");

                                  formik.setFieldValue("city_id", "");

                                  formik.setFieldValue("area_id", "");
                                  if (Boolean(value)) {
                                    loadState(value);
                                  }
                                }}
                                required={column.isMandatory || false}
                                value={formik.values?.country_id || ""}
                                onBlur={(event) => {
                                  formik.setFieldTouched("country_id", true);
                                  formik.handleBlur(event);
                                }}
                                errormsg={
                                  formik?.touched?.country_id &&
                                  formik?.errors?.country_id
                                }
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "State":
                            return (
                              <FloatSelectComponent
                                label={t("State")}
                                showSearch={true}
                                options={stateOptions}
                                onChange={(value) => {
                                  formik.setFieldValue("state_id", value);
                                  formik.setFieldValue("city_id", "");
                                  formik.setFieldValue("area_id", "");
                                  if (Boolean(value)) {
                                    loadCity(value);
                                  }
                                }}
                                // value={formik.values?.state_id}
                                required={column.isMandatory || false}
                                value={
                                  formik.values?.state_id &&
                                    formik.values?.state_id?.toString() !== "0"
                                    ? formik.values?.state_id?.toString()
                                    : ""
                                }
                                onBlur={(event) => {
                                  formik.setFieldTouched("state_id", true);
                                  formik.handleBlur(event);
                                }}
                                widthInput="48%"
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={
                                  disableIfExtinct() ||
                                  handleIsEdit() ||
                                  !formik.values.country_id || loading
                                }
                                errormsg={
                                  formik?.touched?.state_id &&
                                  formik?.errors?.state_id
                                }
                              />
                            )
                          case "City":
                            return (
                              <FloatSelectComponent
                                widthInput="48%"
                                label={t("City")}
                                showSearch={true}
                                options={cityOptions}
                                onChange={(value) => {
                                  formik.setFieldValue("city_id", value);
                                  formik.setFieldValue("area_id", "");
                                  if (Boolean(value)) {
                                    loadArea(value);
                                  }
                                }}
                                required={column.isMandatory || false}
                                value={formik.values?.city_id || ""}
                                onBlur={(event) => {
                                  formik.setFieldTouched("state_id", true);
                                  formik.handleBlur(event);
                                }}
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={
                                  disableIfExtinct() ||
                                  handleIsEdit() ||
                                  !formik.values.state_id || loading
                                }
                              />
                            )
                          case "Area":
                            return (
                              <FloatSelectComponent
                                label={t("Area")}
                                widthInput="48%"
                                showSearch={true}
                                options={areaOptions}
                                onChange={(value) => {
                                  formik.setFieldValue("area_id", value);
                                }}
                                required={column.isMandatory || false}
                                value={formik.values?.area_id || ""}
                                onBlur={(event) => {
                                  formik.setFieldTouched("area_id", true);
                                  formik.handleBlur(event);
                                }}
                                filterOption={(input: any, option: any) =>
                                  (option?.label as string)
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                disabled={
                                  disableIfExtinct() ||
                                  handleIsEdit() ||
                                  !formik.values.city_id || loading
                                }
                              />
                            )
                          case "Street":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="street"
                                label={t("Street")}
                                value={formik.values?.street}
                                isrequired={column.isMandatory || false}
                                maxLength={48}
                                onChangeEvent={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errormsg={
                                  formik?.touched?.street && formik?.errors?.street
                                }
                                disabled={disableIfExtinct() || loading}
                              />
                            )
                          case "Building Number":
                            return (
                              <FloatInputComponent
                                type="text"
                                name="building_no"
                                label={t("Building Number")}
                                maxLength={48}
                                value={formik.values?.building_no}
                                isrequired={column.isMandatory || false}
                                onChangeEvent={(e) => {
                                  const value = e.target.value;
                                  // Allow any character including special characters
                                  formik.setFieldValue("building_no", value);
                                }}
                                onBlur={formik.handleBlur}
                                errormsg={
                                  formik?.touched?.building_no &&
                                  formik?.errors?.building_no
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                          case "Pin Code":
                            return (
                              <FloatInputComponent
                                type="text"
                                name={t("pincode")}
                                label={t("Pin Code")}
                                maxLength={48}
                                value={formik?.values?.pincode}
                                isrequired={column.isMandatory || false}
                                onChangeEvent={(e) => {
                                  const value = e.target.value;
                                  if (!/^\d*$/.test(value)) {
                                    return;
                                  }
                                  formik.handleChange(e);
                                }}
                                onBlur={formik.handleBlur}
                                errormsg={
                                  formik?.touched?.pincode && formik?.errors?.pincode
                                }
                                disabled={disableIfExtinct() || handleIsEdit() || loading}
                              />
                            )
                        }
                      })}
                  </div>

                  <div className={cssStyles.subContainer}>
                    <div className={cssStyles.subHeader}>
                      <h3 id="section-family-details">{t("Family Details")}</h3>
                      <div className={cssStyles.headerDivider}></div>
                    </div>
                    <div className={cssStyles.customerFormContent}>
                      {columnChooserData
                        ?.filter((column: any) => column.isVisible) // Only include visible fields
                        .sort((a: any, b: any) => a.orderNo - b.orderNo) // Sort by orderNo
                        .map((column: any, index: number) => {
                          switch (column.label) {
                            case "Relation":
                              return (
                                <FloatSelectComponent
                                  label={t("Relation")}
                                  widthInput="48%"
                                  showSearch={false}
                                  options={relationOptions}
                                  onChange={(value) => {
                                    setNewMember((prev) => ({ ...prev, relation: value }))
                                  }}
                                  required={column.isMandatory || false}
                                  value={newMember.relation}
                                  onBlur={(event) => {
                                    formik.setFieldTouched(`familyMembers.${index}.relation`, true);
                                  }}
                                  // errormsg={
                                  //   formik.touched.familyMembers?.[index]?.relation &&
                                  //   formik.errors.familyMembers?.[index]?.relation
                                  // }
                                  filterOption={(input: any, option: any) =>
                                    (option?.label as string)
                                      ?.toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                  disabled={disableIfExtinct() || handleIsEdit() || loading}
                                />
                              );
                            case "Name":
                              return (
                                <FloatInputComponent
                                  key={index} // Add a key to ensure proper rendering
                                  type="text"
                                  name="relation_name"
                                  // name={`familyMembers[${index}].relation`} // Dynamically set name for each family member
                                  label={t("Name")} // Assuming you want to display "Relation"
                                  maxLength={48}
                                  value={newMember.relation_name} // Use the relation property of the member object
                                  // isrequired={column.isMandatory || false}
                                  onChangeEvent={(e: any) => {
                                    setNewMember((prev) => ({
                                      ...prev,
                                      relation_name: e.target.value,
                                    }));
                                  }}
                                  onBlur={formik.handleBlur}
                                  // errormsg={
                                  //   formik?.touched?.familyMembers?.[index]?.relation_name &&
                                  //   formik?.errors?.familyMembers?.relation_name
                                  // }
                                  disabled={disableIfExtinct() || handleIsEdit() || loading}
                                />
                              );
                            case "Date of Birth":
                              return (
                                <FloatDatepickerComponent
                                  widthInput="48%"
                                  label={t("Date of Birth")}
                                  picker="date"
                                  value={newMember.date_of_birth ? dayjs(newMember.date_of_birth) : null}
                                  isrequired={column.isMandatory || false}
                                  onChange={(value) => {
                                    setNewMember((prev) => ({
                                      ...prev,
                                      date_of_birth: value,   // ✅ store Dayjs directly
                                    }));
                                  }}
                                  disabledDate={(current: any) =>
                                    current && current > dayjs()
                                  }
                                  errormsg={
                                    formik?.touched?.dob && formik?.errors?.dob
                                  }
                                  format={"DD/MM/YYYY"}
                                  disabled={disableIfExtinct() || handleIsEdit() || loading}
                                />
                              )
                            case "Mobile No":
                              return (
                                <FloatInputComponent
                                  key={index} // Add a key to ensure proper rendering
                                  type="text"
                                  name="mobileNo"
                                  // name={`familyMembers[${index}].relation`} // Dynamically set name for each family member
                                  label={t("Mobile No")} // Assuming you want to display "Relation"
                                  maxLength={48}
                                  value={newMember.mobileNo} // Use the relation property of the member object
                                  isrequired={column.isMandatory || false}
                                  onChangeEvent={(e) => {
                                    const value = e.target.value;
                                    if (!/^\d*$/.test(value) || value.length > mobileNoDigit) return;

                                    setNewMember((prev) => ({
                                      ...prev,
                                      mobileNo: value,
                                    }));
                                  }}
                                  onBlur={(e) => handleBlur(e, true)}
                                  // errormsg={
                                  //   formik?.touched?.familyMembers?.[index]?.mobileNo &&
                                  //   formik?.errors?.familyMembers?.[index]?.mobileNo
                                  // }
                                  disabled={disableIfExtinct() || handleIsEdit() || loading}
                                />
                              );
                            // Add more cases for other fields as needed.
                          }
                        })
                      }
                    </div>
                    <button
                      className={cssStyles.footerChild1}
                      style={{ width: "25%", marginLeft: 417 }}
                      disabled={loading}
                      onClick={() => {
                        if (!newMember.relation || !newMember.relation_name) {
                          alert("Fill required fields");
                          return;
                        }

                        let updatedMembers = [...formik.values.familyMembers];

                        if (selectedIndex !== null) {
                          // 🔥 UPDATE MODE
                          updatedMembers[selectedIndex] = newMember;
                        } else {
                          // 🔥 ADD MODE
                          updatedMembers.push(newMember);
                        }

                        formik.setFieldValue("familyMembers", updatedMembers);

                        // Reset form
                        setNewMember({
                          relation: "",
                          relation_name: "",
                          date_of_birth: null,
                          mobileNo: "",
                        });

                        setSelectedIndex(null);
                      }}
                    >
                      <span>{selectedIndex !== null ? "Update Member" : "Add Member"}</span>
                    </button>
                  </div>
                  {formik.values.familyMembers.length > 0 && (
                    <div
                      style={{
                        marginTop: -10,
                        border: "1px solid #f0f0f0",
                        borderRadius: 8,
                        padding: "8px 12px",
                        background: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        width: "100%"
                      }}
                    >
                      {formik.values.familyMembers.map((member, index) => (
                        <Row
                          key={index}
                          align="middle"
                          style={{
                            padding: "8px 0",
                            borderBottom:
                              index !== formik.values.familyMembers.length - 1
                                ? "1px solid #f0f0f0"
                                : "none",
                          }}
                        >
                          {/* Name */}
                          <Col span={5}>
                            <p
                              style={{ color: "gray", cursor: "pointer", fontSize: "14px" }}
                              onClick={() => {
                                setSelectedIndex(index);

                                setNewMember({
                                  relation: member.relation,
                                  relation_name: member.relation_name,
                                  date_of_birth: member.date_of_birth,
                                  mobileNo: member.mobileNo,
                                });
                              }}
                            >
                              {member.relation_name}
                            </p>
                          </Col>
                          {/*Reltion*/}
                          <Col span={5}>
                            <span style={{ color: "gray" }}>
                              {member.relation}
                            </span>
                          </Col>
                          {/* DOB */}
                          <Col span={5}>
                            <span style={{ color: "gray" }}>
                              {member.date_of_birth?.format("DD-MM-YYYY") ?? "-"}
                            </span>
                          </Col>
                          {/* Mobile */}
                          <Col span={7}>
                            <span style={{ color: "gray" }}>
                              {member.mobileNo}
                            </span>
                          </Col>

                          {/* Close Icon */}
                          <Col span={2} style={{ textAlign: "right" }}>
                            <CloseCircleOutlined
                              style={{
                                color: "#006875",
                                cursor: "pointer",
                                fontSize: 18,
                              }}
                              onClick={() => {
                                const updatedMembers =
                                  formik.values.familyMembers.filter(
                                    (_, i) => i !== index
                                  );
                                formik.setFieldValue(
                                  "familyMembers",
                                  updatedMembers
                                );
                              }}
                            />
                          </Col>
                        </Row>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Content>
            <Footer style={footerStyle}>
              <div className={cssStyles.formFooter}>
                <button
                  className={cssStyles.footerChild1}
                  style={{ width: "50%" }}
                  disabled={loading}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  {loading ?
                    <div className={cssStyles.loadingContainer}>
                      <Spin />
                      <span className={cssStyles.loadingText}>{type === "create" ? "Creating..." : "Updating..."}</span>
                    </div>
                    :
                    <span>{type === "create" ? t("Create") : t("Update")}</span>
                  }
                </button>
                <button
                  className={cssStyles.footerChild2}
                  style={{ width: "50%" }}
                  onClick={() => handleReset()}
                >
                  <div className={cssStyles.resetText}>{t("Reset")}</div>
                </button>
              </div>
            </Footer>
          </Layout>
        </Layout>
      </Drawer>
    </>
  );
};

export default CustomerTray;
