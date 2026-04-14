import { useFormik } from "formik";
import InputComponent from "@/components/InputComponent/InputComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import * as Yup from "yup";
import { Flex, Select, Input, DatePicker } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import dayjs, { Dayjs } from "dayjs";
import DialCodeSelect from "@/components/DialCodeSelect/DialCodeSelect";
import { login } from "@/lib/helpers/apiHandlers/login";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import styles from "@/components/DrawerComponent/DrawerComponent.module.css";
import styles1 from "../signInComponents/LoginForm.module.css";
import { showAlert } from "@/lib/helpers/alert";
import axios from "axios";
import InputPasswordComponent from "../signInComponents/InputPasswordComponent";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";
import { useLoginStore } from "@/store/login/store";
import { encrypt1 } from "@/lib/helpers/utilityHelpers";
import { ENCRYPTION_KEY } from "@/lib/constants/constant";
import ExtinctSwitch from "@/components/ExtinctSwitch/ExtinctSwitch";

export default function RegisterCompanyForm(props: any) {
  const [codeList, setCodeList] = useState<any>();
  const [countriesList, setCountriesList] = useState<any>();
  const [stateList, setStateList] = useState<any>();
  const [cityList, setCityList] = useState<any>();
  const [industry, setIndustry] = useState<any>();
  const Loader = useContext(LoaderContext);
  const router = useRouter();
  const setNewCompanyURL = useLoginStore().setNewCompanyURL;
  const [packageList, setPackageList] = useState<any[]>([]);

  const { t } = useTranslation();

  var formik = useFormik({
    // initialValues: {
    //   fullName: "",
    //   emailAddresss: "",
    //   phoneCode: "🇮🇳 91",
    //   phoneNumber: "",
    //   industry: "Garments",
    //   companyName: "",
    //   storeUrl: "",
    //   userName: "",
    //   password: "",
    //   country: null,
    //   state: null,
    //   city: null,
    //   // validity: "",
    //   // branch: null,
    //   // package: "",
    //   // isExtinct: false,
    //   noOfSites: "",
    //   plan: "",
    // },
    initialValues: {
      fullName: "",
      emailAddresss: "",
      phoneCode: "🇮🇳 91",
      phoneNumber: "",
      industry: "Garments",
      companyName: "",
      storeUrl: "",
      userName: "",
      password: "",
      country: null,
      state: null,
      city: null,
      noOfSites: "",
      noOfUsers: "",
      packageId: null,
      expiryDate: null,
      countryId: null,
      stateId: null,
      cityId: null,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required(t("requiredField")),
      emailAddresss: Yup.string()
        .required(t("requiredField"))
        .email("Invalid email format")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email format"
        ),
      phoneCode: Yup.string().required(t("requiredField")),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Only numbers are allowed")
        .min(10, "Indian number should have atleast 10 digits")
        .max(10, "Indian number is only of 10 digits")
        .required(t("requiredField")),
      industry: Yup.string().required(t("requiredField")),
      companyName: Yup.string()
        .matches(/^[a-zA-Z0-9\s]*$/, "No special characters allowed")
        .required(t("requiredField")),
      storeUrl: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "No space or special characters allowed")
        .required(t("requiredField")),
      userName: Yup.string()
        .matches(/^[a-zA-Z0-9_]+$/, "Special characters are not allowed")
        .required(t("requiredField")),
      password: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*[<>&.'"]).*$/,
          "Enter password(one uppercase, one lowercase, one number, <, > , & , ., ', \" not allowed"
        )
        .test(
          "username_in_login",
          "Can not use username in password",
          (value: string | undefined) => {
            if (!value || !formik.values.userName) return true;
            if (
              value.toLowerCase().includes(formik.values.userName.toLowerCase())
            )
              return false;
            return true;
          }
        )
        .test(
          "consecutive_num_test",
          "Consecutive numbers not allowed",
          (value: string | undefined) => {
            if (!value) return;
            console.log("");
            for (let i = 0; i < value.length - 1; i++) {
              if (Number(value[i + 1]) == Number(value[i]) + 1) return false;
              if (Number(value[i + 1]) == Number(value[i]) - 1) return false;
            }
            return true;
          }
        )
        .required(t("requiredField")),
      country: Yup.string().required(t("requiredField")),
      state: Yup.string().required(t("requiredField")),
      city: Yup.string().required(t("requiredField")),

      expiryDate: Yup.date()
        .nullable()
        .required("This field is required"),

      noOfUsers: Yup.string()
        .required("This field is required")
        .test("is-valid-number", "Enter valid number", (value) =>
          value ? !isNaN(Number(value)) : false
        )
        .test("min-value", "Must be greater than 0", (value) =>
          value ? Number(value) > 0 : false
        ),

      noOfSites: Yup.string()
        .required("This field is required")
        .test("is-valid-number", "Enter valid number", (value) =>
          value ? !isNaN(Number(value)) : false
        )
        .test("min-value", "Must be greater than 0", (value) =>
          value ? Number(value) > 0 : false
        ),

      packageId: Yup.number()
        .typeError("Package is required")
        .required("This field is required"),
    }),
    onSubmit: (values) => {
      Loader?.setLoader(true);
      const storeURL =
        values.storeUrl +
        (globalThis.window &&
          globalThis.window.location.hostname !== "localhost"
          ? "." + globalThis.window.location.hostname
          : "");
      // const body = {
      //   ...values,
      //   storeUrl: storeURL,
      //   userName:
      //     values.userName + formatCompanyDomain(formik.values.companyName),
      //   password: encrypt1(values.password, ENCRYPTION_KEY),
      // };
      const body = {
        fullName: values.fullName,
        emailAddresss: values.emailAddresss,
        phoneCode: values.phoneCode.replace(/[^\d]/g, ""),
        phoneNumber: values.phoneNumber,
        industry: values.industry,
        companyName: values.companyName,
        storeUrl: storeURL,
        userName:
          values.userName + formatCompanyDomain(values.companyName),
        password: encrypt1(values.password, ENCRYPTION_KEY),
        country: values.country,
        state: values.state,
        city: values.city,
        noOfSites: Number(values.noOfSites),
        noOfUsers: Number(values.noOfUsers),
        packageId: Number(values.packageId),
        expiryDate: values.expiryDate,
        countryId: values.countryId,
        stateId: values.stateId,
        cityId: values.cityId,
      };
      // let res = register(values as RegisterCredentials);
      makeApiCall
        .post("SaveCompanyRegistration", body)
        .then((res) => {
          Loader?.setLoader(false);
          if (res.data.errorCode == 200) {
            // const res1 = login({
            //   username:
            //     values.userName + formatCompanyDomain(values.companyName),
            //   password: values.password,
            // });
            // res1
            //   .then((res) => {
            //     console.log(res);
            //     if (res.status === 200) {
            //       if (res?.data?.accessToken) {
            //         axios
            //           .post("https://icube.fouz.chat/include/api.php", {
            //             function: "add-user",
            //             token: "126bc89bc1701acfbb9343aaf620e81d2fc47fb7",
            //             first_name:
            //               formik.values.fullName.split(" ").length > 1
            //                 ? formik.values.fullName.split(" ")[0]
            //                 : formik.values.fullName,
            //             ...(formik.values.fullName.split(" ").length > 1 && {
            //               last_name:
            //                 formik.values.fullName.split(" ")[
            //                   formik.values.fullName.split(" ").length - 1
            //                 ],
            //             }),
            //             email:
            //               values.userName +
            //               formatCompanyDomain(values.companyName),
            //             password: formik.values.password,
            //             user_type: "user",
            //           })
            //           .then((res: any) => console.log(res))
            //           .catch((err: any) => console.log(err));
            //         Cookies.set("token", res?.data?.accessToken);
            //         Cookies.remove("tabs");
            //         Cookies.set("allowAccess123", "false");
            //         router.push(`/dashboard`);
            //       }
            //     }
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //     showAlert("Something went wrong logging in!");
            //   });
            formik.resetForm();
            // showAlert(
            //   "Company successfully registered! Kindly wait for our approval..."
            // );
            setNewCompanyURL(storeURL);
            props.setAction("activated");
          }
        })
        .catch((error: any) => {
          Loader?.setLoader(false);
          if (
            error?.response?.data?.code == 422 ||
            error?.response?.data?.status == 400
          ) {
            const keys = Object.keys(error?.response?.data?.errors);
            keys.forEach((key) => {
              formik.setFieldError(
                key,
                error?.response?.data?.errors?.[key]?.[0]
              );
            });
          } else {
            alert("Something went wrong while registering the company");
          }
        });
    },
  });

  function formatCompanyDomain(companyName: string): string {
    return companyName
      ? "@" + companyName.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")
      : "";
  }

  function countryCodeToEmoji(countryCode: string) {
    if (countryCode == "AN") return countryCodeToEmoji("BQ");
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  function handleCountryChange(value: any, Countries: any) {
    makeApiCall
      .get(`GetCompanyRegistrationDropDown/state/${value}`)
      .then((res) => {
        const states = res.data.data.state.map((state: any, index: number) => ({
          value: state.id,
          label: state.stateName,
          key: index,
        }));
        setStateList(states);
        var country_name = Countries.find(
          (country: any) => country.value === value
        ).label;
        // formik.setFieldValue("country", country_name);
        // formik.setFieldValue("state", null);
        // formik.setFieldValue("city", null);
        formik.setFieldValue("countryId", value);
        formik.setFieldValue("country", country_name);

        formik.setFieldValue("stateId", null);
        formik.setFieldValue("state", null);

        formik.setFieldValue("cityId", null);
        formik.setFieldValue("city", null);
        // var country = codeList.find((country: any) => country.id == value);
        // formik.setFieldValue(
        //   "phoneCode",
        //   countryCodeToEmoji(country.short_name) + " " + country.code
        // );
        // console.log(
        //   countryCodeToEmoji(country.short_name) + " " + country.code
        // );
      })
      .catch((err) => console.log(err));
  }

  function handleStateChange(value: string) {
    makeApiCall
      .get(`GetCompanyRegistrationDropDown/city/${value}`)
      .then((res) => {
        const cities = res.data.data.city.map((city: any, index: number) => ({
          value: city.id,
          label: city.cityName,
          key: index,
        }));
        setCityList(cities);
        var state_name = stateList.find(
          (state: any) => state.value === value
        ).label;
        // formik.setFieldValue("state", state_name);
        // formik.setFieldValue("city", null);
        formik.setFieldValue("stateId", value);
        formik.setFieldValue("state", state_name);

        formik.setFieldValue("cityId", null);
        formik.setFieldValue("city", null);
      })
      .catch((err) => {
        console.log(err.data.message);
      });
  }

  useEffect(() => {
    makeApiCall.get("GetCompanyRegistrationDropDown/country").then((res) => {
      const countryCodes = res.data.data.country.map(
        (country: any, index: number) => ({
          name: country.countryName,
          short_name: country.countryShortName,
          code: country.countryPhoneCode,
          id: country.id,
          // value: country.id,
          key: index,
        })
      );
      setCodeList(countryCodes);

      const countries = res.data.data.country.map(
        (country: any, index: number) => ({
          value: country.id,
          label: country.countryName,
          key: index,
        })
      );

      setCountriesList(countries);
      // handleCountryChange(344, countries);

      const industries = res.data.data.industry.map((industry: any) => ({
        value: industry.industry,
        label: industry.industry,
        key: industry.id,
      }));

      setIndustry(industries);
    });

    // Fetch Package Dropdown
    makeApiCall
      .get("GetPackageDropdown")
      .then((res) => {
        if (res?.data?.status === "success") {
          const packages = res.data.data.map((pkg: any, index: number) => ({
            value: pkg.id,
            label: `${pkg.packageName}`,
            key: index,
          }));

          setPackageList(packages);
        }
      })
      .catch((err) => {
        console.log("Package dropdown error:", err);
      });
  }, []);

  const allowOnlyIntegers = (value: string) => {
    return value.replace(/[^0-9]/g, "");
  };

  return (
    <form
      className="LoginForm_login_form__obhB_"
      onSubmit={formik.handleSubmit}
    >
      <Flex vertical gap={16}>
        <Flex vertical align="center" gap={16}>
          <h2>Register Company</h2>
          <p>Enter your company details below to register your store</p>
        </Flex>
        <Flex vertical gap={16}>
          <InputComponent
            type="text"
            placeholder="Full Name"
            label="Full Name"
            name="fullName"
            value={formik.values.fullName}
            onChangeEvent={formik.handleChange}
            onBlur={formik.handleBlur}
            errormsg={formik.touched.fullName && formik.errors.fullName}
            isrequired
          />
          <InputComponent
            type="email"
            placeholder="Email ID"
            label="Email ID"
            name="emailAddresss"
            value={formik.values.emailAddresss}
            onChangeEvent={formik.handleChange}
            onBlur={formik.handleBlur}
            errormsg={
              formik.touched.emailAddresss && formik.errors.emailAddresss
            }
            isrequired
          />
          <Flex>
            <DialCodeSelect
              codeList={codeList}
              placeholder1="Select Country"
              placeholder2="Phone Number"
              label="Phone Number"
              defaultCode="🇮🇳 91"
              onChange1={(country: any) =>
                handleCountryChange(country.id, countriesList)
              }
              formik={formik}
              name1="phoneCode"
              name2="phoneNumber"
              isrequired
            />
          </Flex>
          <InputComponent
            type="text"
            placeholder="Company Name"
            label="Company Name"
            name="companyName"
            value={formik.values.companyName}
            onChangeEvent={(event) => {
              formik.handleChange(event);
              console.log(
                "eventtarget.value.trim()",
                event.target.value.trim()
              );
              formik.setFieldValue(
                "storeUrl",
                event.target.value.replace(/\s/g, "").toLowerCase()
              );
            }}
            onBlur={formik.handleBlur}
            errormsg={formik.touched.companyName && formik.errors.companyName}
            isrequired
          />
          {/* <SelectComponent
            showSearch
            placeholder="Industry"
            label="Industry"
            onChange={(value) => formik.setFieldValue("industry", value)}
            // value={formik.values.industry}
            value="Garments"
            options={industry}
            onBlur={(event) => {
              formik.setFieldTouched("industry", true);
              formik.handleBlur(event);
            }}
            errormsg={formik.touched.industry && formik.errors.industry}
            isrequired
          /> */}
          <Flex style={{ position: "relative" }}>
            <InputComponent
              type="text"
              placeholder="Store URL"
              label="Store URL"
              name="storeUrl"
              value={formik.values.storeUrl}
              onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) =>
                formik.setFieldValue("storeUrl", event.target.value)
              }
              // style={{ paddingRight: 130, ...props.style }}
              suffix={
                globalThis.window &&
                  globalThis.window.location.hostname !== "localhost"
                  ? "." + globalThis.window.location.hostname
                  : ""
              }
              onBlur={formik.handleBlur}
              errormsg={formik.touched.storeUrl && formik.errors.storeUrl}
              isrequired
            />
            {/* <p style={{ position: "absolute", right: 4, top: 38 }}>
              {globalThis.window &&
              globalThis.window.location.hostname !== "localhost"
                ? "." + globalThis.window.location.hostname
                : ""}
            </p> */}
          </Flex>
          <Flex style={{ position: "relative" }}>
            <InputComponent
              type="text"
              placeholder="Username"
              label="Username"
              name="userName"
              value={formik.values.userName}
              onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) =>
                formik.setFieldValue("userName", event.target.value)
              }
              // style={{
              //   paddingRight: formik.values.companyName.length * 12,
              //   ...props.style,
              // }}
              suffix={formatCompanyDomain(formik.values.companyName)}
              onBlur={formik.handleBlur}
              errormsg={formik.touched.userName && formik.errors.userName}
              isrequired
            />
            {/* <p style={{ position: "absolute", right: 4, top: 38 }}>
              {formatCompanyDomain(formik.values.companyName)}
            </p> */}
          </Flex>
          {/* <InputComponent
            type="password"
            placeholder="Password"
            label="Password"
            name="password"
            value={formik.values.password}
            onChangeEvent={formik.handleChange}
            onBlur={formik.handleBlur}
            errormsg={formik.touched.password && formik.errors.password}
            isrequired
          /> */}
          <InputPasswordComponent
            placeholder="Password"
            label="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errormsg={formik.touched.password && formik.errors.password}
            isrequired
          />
          <SelectComponent
            showSearch
            placeholder="Select Country"
            label="Country"
            // name="country"
            optionFilterProp="label"
            value={formik.values.country}
            className="w-100"
            onChange={(value) => handleCountryChange(value, countriesList)}
            options={countriesList}
            onBlur={(event) => {
              formik.setFieldTouched("country", true);
              formik.handleBlur(event);
            }}
            errormsg={formik.touched.country && formik.errors.country}
            isrequired
          />
          <SelectComponent
            showSearch
            placeholder="Select State"
            label="State"
            // name="state"
            defaultValue={"33"}
            value={formik.values.stateId}
            optionFilterProp="label"
            onChange={(value) => handleStateChange(value)}
            options={stateList}
            onBlur={(event) => {
              formik.setFieldTouched("state", true);
              formik.handleBlur(event);
            }}
            errormsg={formik.touched.state && formik.errors.state}
            isrequired
          />
          <SelectComponent
            showSearch
            placeholder="Select City"
            label="City"
            // onChange={(value: string) =>
            //   formik.setFieldValue(
            //     "city",
            //     cityList.find((city: any) => city.value == value).label
            //   )
            // }
            onChange={(value: string) => {
              const city_name = cityList.find((city: any) => city.value == value)?.label;

              formik.setFieldValue("cityId", value);
              formik.setFieldValue("city", city_name);
            }}
            optionFilterProp="label"
            value={formik.values.cityId}
            options={cityList}
            onBlur={(event) => {
              formik.setFieldTouched("city", true);
              formik.handleBlur(event);
            }}
            errormsg={formik.touched.city && formik.errors.city}
            isrequired
            disabled={!cityList || cityList?.length == 0}
          />

          <Flex vertical>
            <label style={{ fontSize: "0.87rem", marginBottom: "4px" }}>
              Validity
              {/* <span style={{ color: "red" }}>*</span> */}
            </label>

            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select Validity Date"
              format="DD-MM-YYYY"
              value={
                formik.values.expiryDate
                  ? dayjs(formik.values.expiryDate)
                  : null
              }
              disabledDate={(current) =>
                current && current.isBefore(dayjs(), "day")
              }
              onChange={(date: Dayjs | null) => {
                formik.setFieldValue(
                  "expiryDate",
                  date ? date.format("YYYY-MM-DD") : null
                );
              }}
              onBlur={() => formik.setFieldTouched("expiryDate", true)}
            // isrequired
            />

            {formik.touched.expiryDate && formik.errors.expiryDate && (
              <div style={{ color: "#f5222d", fontSize: "14px", marginTop: "4px" }}>
                {formik.errors.expiryDate}
              </div>
            )}
          </Flex>

          <InputComponent
            name="noOfUsers"
            placeholder="Enter No of Users"
            label="No of Users"
            type="text"
            value={formik.values.noOfUsers}
            // onChangeEvent={(e) => {
            //   formik.setFieldValue("noOfUsers", Number(e.target.value))
            // }}
            onChangeEvent={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = allowOnlyIntegers(e.target.value);
              formik.setFieldValue("noOfUsers", val);
            }}
            onBlur={formik.handleBlur}
            errormsg={formik.touched.noOfUsers && formik.errors.noOfUsers}
            isrequired
          />
          <InputComponent
            name="noOfSites"
            placeholder="Enter No of Sites"
            label="No of Sites"
            type="text"
            // isrequired
            value={formik.values.noOfSites}
            // onChangeEvent={(e) => {
            //   const value = allowOnlyIntegers(e.target.value);
            //   formik.setFieldValue("noOfSites", Number(e.target.value))
            // }}
            onChangeEvent={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = allowOnlyIntegers(e.target.value);
              formik.setFieldValue("noOfSites", val);
            }}
            onBlur={formik.handleBlur}
            errormsg={formik.touched.noOfSites && formik.errors.noOfSites}
            isrequired
          />
          <SelectComponent
            showSearch
            placeholder="Select Package"
            label="Package"
            optionFilterProp="label"
            value={formik.values.packageId}
            options={packageList}
            onChange={(value) =>
              formik.setFieldValue("packageId", Number(value))
            }
            onBlur={(event) => {
              formik.setFieldTouched("packageId", true);
              formik.handleBlur(event);
            }}
            errormsg={formik.touched.packageId && formik.errors.packageId}
            isrequired
          />

          {/* <Flex justify="space-between" align="center" >
            <label style={{ fontSize: "0.87rem",  marginLeft: "6px"  }}>Extinct</label>
            <ExtinctSwitch
              checked={formik.values.isExtinct}
              onChange={(checked) => formik.setFieldValue("isExtinct", checked)}
              size="small"
            />
          </Flex> */}

          <Flex gap={16}>
            <ButtonComponent
              type="text"
              onClickEvent={() => formik.resetForm()}
              // className={styles.reset_button}
              style={{ flexGrow: 1 }}
            >
              Reset
            </ButtonComponent>

            <ButtonComponent
              type="default"
              // onClickEvent={() => router.back()}
              onClickEvent={() => {
                if (formik.dirty) {
                  const confirmLeave = confirm("You have unsaved changes. Are you sure?");
                  if (!confirmLeave) return;
                }
                router.back();
              }}
              style={{ flexGrow: 1 }}
            >
              Cancel
            </ButtonComponent>

            <ButtonComponent
              type="primary"
              htmlType="submit"
              style={{ flexGrow: 1 }}
              className={styles.save_button}
            >
              Submit
            </ButtonComponent>
          </Flex>
        </Flex>
        <a
          // className={loginStyles.footText}
          style={{ color: "#0D39FE", textAlign: "left", fontSize: "0.85rem" }}
          onClick={() => props.setAction("login")}
        >
          Already have an account? Login
        </a>
      </Flex>
    </form>
  );
}
