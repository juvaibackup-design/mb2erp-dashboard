"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./LoginForm.module.css";
import { Flex, Input, Switch } from "antd";
import { useFormik } from "formik";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import InputComponent from "@/components/InputComponent/InputComponent";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import { login } from "@/lib/helpers/apiHandlers/login";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { decrypt, encrypt } from "@/lib/helpers/utilityHelpers";
import InputPassword from "./InputPasswordComponent";
import InputNumberComponent from "@/components/InputComponent/InputNumberComponent";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import DialCodeSelect from "@/components/DialCodeSelect/DialCodeSelect";
import {
  LoaderContext,
  SideBarStateContext,
} from "@/lib/interfaces/Context.interfaces";
import { showAlert } from "@/lib/helpers/alert";
import Toast from "@/components/CustomToast/Toast";
import { Modal } from "antd";
import { decrypt1 } from "@/lib/helpers/utilityHelpers";
import { ENCRYPTION_KEY } from "@/lib/constants/constant";
import {
  getUUIDId,
  createUUIDId,
  getDeviceDetails,
  getLocationFromIP,
} from "@/lib/helpers/apiHandlers/ipId";
import dayjs from "dayjs";

const LoginForm = (props: { setAction: (action: string) => void }) => {
  const router = useRouter();
  const [host, setHost] = useState<any>("");
  console.log("host", host);
  const [host1, setHost1] = useState<any>("");
  const [otpLogin, setOtpLogin] = useState<boolean>(false);
  const [enableTwoFactor, setEnableTwoFactor] = useState<boolean>(false);
  const [codeList, setCodeList] = useState<any>();
  const { loader, setLoader }: any = useContext(LoaderContext);
  const [userMsg, setUserMsg] = useState<string>("");
  const { setCollapse }: any = useContext(SideBarStateContext);
  const [handleDasboard, setHandleDasboard] = useState<boolean>(false)
  const [phoneNo, setPhoneNo] = useState<any>();
  const [domainName, setDomainName] = useState<any>("");
  const [OTPValue, setOTPValue] = useState<any>();
  const [otpSended, setOtpSended] = useState<boolean>(false);
  const [shouldTriggerOTP, setShouldTriggerOTP] = useState(false);
  const [deviceLogout, setDeviceLogout] = useState<boolean>(false);


  console.log("OTPValue", OTPValue);
  console.log("phoneNo", phoneNo);
  console.log("otpSended", otpSended);
  // const host = window.location.host.split(".");
  // const host = document.location.href.split(".");
  // const host = "hello";
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost1(window.location.hostname);
      // setHost(window.location.host.split(".")); // Get the host on the client side
      const url = window.location.host.split(".");
      if (
        !(
          url[0] === "icube" ||
          url[0] === "localhost:3000" ||
          url[0] === "localhost:3001" ||
          url[0] === "" ||
          url[0] === "192"
        )
      )
        setHost("@" + url[0]);
      if (
        !(
          url[0] === "localhost:3000" ||
          url[0] === "localhost:3001" ||
          url[0] === "" ||
          url[0] === "192"
        ) &&
        url.length > 2
      )
        makeApiCall
          .get(`verifyCompanyDomain?subDomain=${url[0]}`)
          .then((res) => {
            console.log(res);
            if (res.data.data.isExpiry)
              setUserMsg("Your company account's validity has expired");
            else if (!res.data.data.isActive)
              setUserMsg("Your company account is not active");
          })
          .catch((err) => {
            console.log(err);
            if (
              err?.response?.data?.errordescription?.includes(
                "Domain not register"
              )
            )
              setUserMsg("Domain not register");
          });
    }
  }, []);

  useEffect(() => {
    if (Cookies.get("token") && !handleDasboard) {
      console.log("inn89Login");
      router.push("/dashboard");
    }
  }, [Cookies.get("token")]);

  function authenticateOTP() { }

  const formik = useFormik({
    initialValues: {
      username: decrypt(Cookies.get("icube_saas_username") || "") ?? "",
      password: decrypt(Cookies.get("icube_saas_password") || "") ?? "",
      phoneNo: "",
      otp: "",
    },
    validationSchema: Yup.object(
      !otpLogin
        ? {
          username: Yup.string().required("Username is required"),
          password: Yup.string().required("Password is required"),
        }
        : {
          phoneNo: Yup.string()
            .matches(/^\d{10}$/, "Phone Number must be 10 digits")
            .required("Phone Number is required"),
          otp: Yup.string()
            .matches(/^\d{6}$/, "OTP must be 6 digits")
            .required("OTP is required"),
        }
    ),
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!otpLogin) {
        const currDate = dayjs()?.format("MM-DD-YY");
        const getIPDetail = await getLocationFromIP();
        console.log("dataaa", getIPDetail);
        let deviceUUID = getUUIDId();
        const deviceOS = getDeviceDetails();
        console.log("deviceOS", deviceOS);
        if (!deviceUUID) {
          console.log("innn");
          deviceUUID = createUUIDId();
        }
        const finalIP = getIPDetail?.ip + "/" + deviceUUID;
        console.log("deviceUUID", deviceUUID);

        setLoader(true);
        const res = login({
          ...values,
          username: values.username + host,
          ip_address: finalIP,
          current_date: currDate,
        });
        res
          .then(async (res) => {
            if (res.status === 200) {
              if (res?.data?.message === "User Already Active") {
                setHandleDasboard(true)
                localStorage.setItem("theme", res?.data?.isLightTheme ? "light" : "dark");

                const expiryDate1 = new Date(
                  new Date().getTime() + 24 * 60 * 60 * 1000
                );
                Cookies.set("token", res?.data?.accessToken, {
                  expires: expiryDate1,
                });
                Cookies.set("refreshToken", res?.data?.refreshToken, {
                  expires: expiryDate1,
                });
                setLoader(false);

                Modal.confirm({
                  title: "Alert",
                  okText: "Confirm",
                  content:
                    "This user is already active on another device. Do you want to sign out from that device and continue here?",
                  cancelButtonProps: {
                    style: {
                      display: "inline-block",
                      marginRight: "8px", // Adjust spacing if needed
                    },
                  },
                  onCancel: () => { },
                  onOk: async () => {
                    // Do something when user clicks OK
                    try {
                      setLoader(true);
                      const response = await makeApiCall.post("RemoveUser", {
                        userId: res?.data?.userId,
                        ip_address: finalIP,
                        refreshToken: res?.data?.refreshToken,
                      });
                      if (response.status === 200) {
                        // Cookies.remove("token");
                        setHandleDasboard(false)
                        setLoader(false);
                        setDeviceLogout(true);
                        setTimeout(() => {
                          setDeviceLogout(false);
                        }, 3000);
                        Cookies.remove("tabs");
                        Cookies.remove("openTabs");
                        Cookies.remove("teller");
                        const theme = localStorage.getItem("theme");
                        // localStorage.clear();
                        // localStorage.setItem("theme", theme || "light");

                        if (res.data.rememberPassword) {
                          Cookies.set(
                            "icube_saas_username",
                            encrypt(formik.values.username)
                          );
                          Cookies.set(
                            "icube_saas_password",
                            encrypt(formik.values.password)
                          );
                        } else {
                          Cookies.remove("icube_saas_username");
                          Cookies.remove("icube_saas_password");
                        }
                        Cookies.set(
                          "icube_saas_username1",
                          encrypt(formik.values.username + host)
                        );
                        Cookies.set(
                          "icube_saas_password1",
                          encrypt(formik.values.password ?? "")
                        );
                        Cookies.set("allowAccess123", "false");
                        // if (res?.data?.enableTwoFactor) setEnableTwoFactor(true);
                        // else
                        router.push(`/dashboard`);
                        setCollapse(false);
                      }
                    } catch (err) {
                      console.log("err", err);
                      setLoader(false);
                    }
                  },
                });
              } else if (
                res?.data?.message === "Device Id does not match!" ||
                res?.data?.message === "This IP has expired!"
              ) {
                localStorage.setItem("theme", res?.data?.isLightTheme ? "light" : "dark");

                try {
                  setHandleDasboard(true)
                  const expiryDate1 = new Date(
                    new Date().getTime() + 24 * 60 * 60 * 1000
                  );
                  Cookies.set("token", res?.data?.accessToken, {
                    expires: expiryDate1,
                  });
                  Cookies.set("refreshToken", res?.data?.refreshToken, {
                    expires: expiryDate1,
                  });

                  const SAVEIP = await makeApiCall.post(`PostSaveIP`, {
                    ipAddress: finalIP,
                    city: getIPDetail?.city,
                    country: getIPDetail?.country,
                    region: getIPDetail?.region,
                    osId: deviceOS,
                    userId: res?.data?.userId,
                  });
                  console.log("SAVEIP", SAVEIP);
                  Cookies.remove("token");
                  setHandleDasboard(false)

                  setLoader(false);
                  Modal.error({
                    title: "Alert",
                    content:
                      res?.data?.message === "Device Id does not match!"
                        ? "Device ID mismatch. Approval request has been sent. Please wait for higher-level approval."
                        : "This Device IP has expired. Approval request has been sent. Please wait for higher-level approval.",
                    cancelButtonProps: { style: { display: "none" } },
                    onOk: () => {
                      // Do something when user clicks OK
                    },
                  });
                } catch (err) {
                  err;
                }
              } else if (res?.data?.message === "One Time Login!") {
                try {
                  localStorage.setItem("theme", res?.data?.isLightTheme ? "light" : "dark");

                  const expiryDate1 = new Date(
                    new Date().getTime() + 24 * 60 * 60 * 1000
                  );
                  Cookies.set("token", res?.data?.accessToken, {
                    expires: expiryDate1,
                  });
                  Cookies.set("refreshToken", res?.data?.refreshToken, {
                    expires: expiryDate1,
                  });

                  const response = await makeApiCall.post("SaveIPCount", {
                    count: 0,
                    userId: res?.data?.userId,
                  });
                  console.log("response", response);
                  setLoader(false);

                  Cookies.remove("tabs");
                  Cookies.remove("openTabs");
                  localStorage.clear();

                  if (res.data.rememberPassword) {
                    Cookies.set(
                      "icube_saas_username",
                      encrypt(formik.values.username)
                    );
                    Cookies.set(
                      "icube_saas_password",
                      encrypt(formik.values.password)
                    );
                  } else {
                    Cookies.remove("icube_saas_username");
                    Cookies.remove("icube_saas_password");
                  }
                  Cookies.set(
                    "icube_saas_username1",
                    encrypt(formik.values.username + host)
                  );
                  Cookies.set(
                    "icube_saas_password1",
                    encrypt(formik.values.password ?? "")
                  );
                  Cookies.set("allowAccess123", "false");
                  // if (res?.data?.enableTwoFactor) setEnableTwoFactor(true);
                  // else
                  router.push(`/dashboard`);
                  setCollapse(false);
                } catch (err) {
                  console.log("err", err);
                }
              } else if (res?.data?.enableTwoFactor && res?.data?.phoneNumber) {
                localStorage.setItem("theme", res?.data?.isLightTheme ? "light" : "dark");

                setLoader(false);
                console.log("res?.data", res?.data);
                setEnableTwoFactor(true);
                setOtpLogin(true);
                formik.setFieldValue("phoneNo", res?.data?.phoneNumber.trim());
                setPhoneNo(res?.data?.phoneNumber.trim());
                setShouldTriggerOTP(true);
              } else if (res?.data?.accessToken) {
                localStorage.setItem("theme", res?.data?.isLightTheme ? "light" : "dark");

                const expiryDate1 = new Date(
                  new Date().getTime() + 24 * 60 * 60 * 1000
                );
                Cookies.set("token", res?.data?.accessToken, {
                  expires: expiryDate1,
                });
                Cookies.set("refreshToken", res?.data?.refreshToken, {
                  expires: expiryDate1,
                });
                Cookies.remove("tabs");
                Cookies.remove("openTabs");
                const theme = localStorage.getItem("theme");
                // localStorage.clear();
                // localStorage.setItem("theme", theme || "light");

                if (res.data.rememberPassword) {
                  Cookies.set(
                    "icube_saas_username",
                    encrypt(formik.values.username)
                  );
                  Cookies.set(
                    "icube_saas_password",
                    encrypt(formik.values.password)
                  );
                } else {
                  Cookies.remove("icube_saas_username");
                  Cookies.remove("icube_saas_password");
                }
                Cookies.set(
                  "icube_saas_username1",
                  encrypt(formik.values.username + host)
                );
                Cookies.set(
                  "icube_saas_password1",
                  encrypt(formik.values.password ?? "")
                );
                Cookies.set("allowAccess123", "false");
                // if (res?.data?.enableTwoFactor) setEnableTwoFactor(true);
                // else
                router.push(`/dashboard`);
                setCollapse(false);
              }
            }
            setLoader(false);
          })
          .catch((err) => {
            if (err?.response?.status === 500) {
              alert(`${err?.response?.data?.errordescription}`);
            } else {
              if (err?.response?.data?.errordescription?.includes("Password")) {
                formik.setFieldError("password", "Invalid password");
              } else if (
                err?.response?.data?.errordescription?.includes(
                  "review stage"
                ) ||
                err?.response?.data?.errordescription?.includes(
                  "expiry date"
                ) ||
                err?.response?.data?.errordescription?.includes("not active")
              ) {
                showAlert(err?.response?.data?.errordescription);
              } else if (
                err?.response?.data?.errordescription?.includes(
                  `${values.username + host} is not register`
                )
              ) {
                formik.setFieldError("username", "Invalid Username");
              } else {
                formik.setFieldError("username", "Domain not register");
              }
            }
            setLoader(false);
          });
      } else {
        //OTP Based Login
        setLoader(true);
        const findDomain = window.location.host
          .split(".")[0]
          .startsWith("localhost")
          ? "icube"
          : host.replace(/^@/, "");

        try {
          const res = await makeApiCall.post("OTPBasedLogin", {
            phoneNo: phoneNo,
            domain_name: findDomain,
            otp: OTPValue.toString(),
          });
          if (res?.data?.accessToken) {
            const expiryDate1 = new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000
            );
            Cookies.set("token", res?.data?.accessToken, {
              expires: expiryDate1,
            });
            Cookies.set("refreshToken", res?.data?.refreshToken, {
              expires: expiryDate1,
            });
            Cookies.remove("tabs");
            Cookies.remove("openTabs");
            const theme = localStorage.getItem("theme");
            // localStorage.clear();
            // localStorage.setItem("theme", theme || "light");
            if (res.data.rememberPassword) {
              Cookies.set("icube_saas_username", encrypt(res.data.username));
              Cookies.set(
                "icube_saas_password",
                encrypt(decrypt1(res.data.password, ENCRYPTION_KEY))
              );
            } else {
              Cookies.remove("icube_saas_username");
              Cookies.remove("icube_saas_password");
            }

            Cookies.set(
              "icube_saas_username1",
              encrypt(res.data.username + host)
            );
            Cookies.set(
              "icube_saas_password1",
              encrypt(decrypt1(res.data.password, ENCRYPTION_KEY))
            );
            Cookies.set("allowAccess123", "false");
            // if (res?.data?.enableTwoFactor) setEnableTwoFactor(true);
            // else
            router.push(`/dashboard`);
            setCollapse(false);
            setLoader(false);
          }
          if (res?.data?.data === "Invalid OTP!") {
            console.log("inn");
            Modal.error({
              title: "Alert",
              content: "Invalid OTP!",
              cancelButtonProps: { style: { display: "none" } },
              onOk: () => {
                // Do something when user clicks OK
              },
            });
            setLoader(false);
          }
        } catch (err: any) {
          if (err?.response?.status === 500) {
            alert(`${err?.response?.data?.errordescription}`);
          } else {
            if (err?.response?.data?.errordescription?.includes("Password")) {
              formik.setFieldError("password", "Invalid password");
            } else if (
              err?.response?.data?.errordescription?.includes("review stage") ||
              err?.response?.data?.errordescription?.includes("expiry date") ||
              err?.response?.data?.errordescription?.includes("not active")
            ) {
              showAlert(err?.response?.data?.errordescription);
            } else if (
              err?.response?.data?.errordescription?.includes(
                `${values.username + host} is not register`
              )
            ) {
              formik.setFieldError("username", "Invalid Username");
            } else {
              formik.setFieldError("username", "Domain not register");
            }
          }
          setLoader(false);
        }
      }
    },
  });

  console.log("formik", formik.values);
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  const handleSwich = (value: string) => {
    props.setAction(value);
  };

  useEffect(() => {
    const data = async () => {
      if (shouldTriggerOTP) {
        await handleOTP();
        Modal.success({
          title: "Alert",
          content: (
            <>
              {"You have enabled Two-Factor Authentication. "}{" "}
              {`An OTP has been sent to your registered mobile number ${formik?.values?.phoneNo}. Please enter the OTP to complete your login.`}
            </>
          ),

          cancelButtonProps: { style: { display: "none" } },
          onOk: () => {
            // Do something when user clicks OK
          },
        });
      }
    };
    data();
  }, [shouldTriggerOTP]);

  useEffect(() => {
    makeApiCall
      .get("GetCompanyRegistrationDropDown/country")
      .then((res) => {
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
      })
      .catch((err) => console.log(err));
  }, []);

  const handleOTP = async () => {
    const findDomain = window.location.host
      ?.split(".")[0]
      .startsWith("localhost")
      ? "icube"
      : host.replace(/^@/, "");

    setLoader(true);

    await makeApiCall
      .post("GetOTPForLogin", {
        phoneNo: formik.values.phoneNo,
        domain_name: findDomain,
      })

      .then((res) => {
        setLoader(false);

        if (res?.data?.data?.phoneNO && res?.data?.data?.phoneNO.length > 0) {
          console.log("res", res);

          Modal.error({
            title: "Alert",
            content: res?.data?.data?.phoneNO[0],
            cancelButtonProps: { style: { display: "none" } },
            onOk: () => {
              // Do something when user clicks OK
            },
          });
          return;
        }
        if (res?.status === 200) {
          setOtpSended(true);
          setTimeout(() => {
            setOtpSended(false);
          }, 3000);
        }
        setShouldTriggerOTP(false);
      })
      .catch((err) => {
        setShouldTriggerOTP(false);
        setLoader(false);
        console.log(err);
      });
  };
  console.log("formik", formik);
  return (
    <form
      onSubmit={
        formik.handleSubmit as (e: React.FormEvent<HTMLFormElement>) => void
      }
    >
      <Flex vertical align="center">
        <Image
          src={"/assets/logo.png"}
          alt="iCube_Logo"
          className={styles.logo}
          width={126}
          height={37.991}
          unoptimized={true}
          unselectable="off"
          priority={true}
          placeholder="blur"
          blurDataURL={"/assets/logo.png"}
        />
        <p className={styles.text}>
          Enter your username and password to continue
        </p>
      </Flex>
      <div className={styles.login_form}>
        <Flex vertical gap={24} className={styles.paddingGap}>
          <h3 style={{ textAlign: "center", color: "red" }}>{userMsg}</h3>
          {!otpLogin ? (
            <>
              <InputComponent
                onChangeEvent={formik.handleChange}
                size="middle"
                className={styles.loginInputBox}
                prefix={<UserOutlined className={styles.formInputIcon} />}
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                suffix={
                  // !(
                  //   host[0] === "icube" ||
                  //   host[0] === "localhost:3000" ||
                  //   host[0] === ""
                  // )
                  //   ? `@${host[0]}`
                  //   : ""
                  host
                }
                // Add the `@` before the host dynamically
                // suffix={host[0].length > 2 ? `@${host[0]}` : ""} // Add the `@` before the host dynamically
                // suffix={host.length > 1 ? host[0] : ""}
                value={formik.values.username}
                errormsg={formik.touched.username && formik.errors.username}
                disabled={userMsg ? true : false}
                autoFocus
                onPressEnter={() => (!userMsg && !loader) ? formik.handleSubmit() : null}
              />

              {/* <InputComponent
                      onChangeEvent={formik.handleChange}
                      // className={styles.loginInputBox}
                      className={styles.passwordInputBox}
                      prefix={<LockOutlined className={styles.formInputIcon} />}
                      // type="password"
                      type="text"
                      name="password"
                      id="password"
                      placeholder="Password"
                      size="middle"
                      value={formik.values.password}
                      errormsg={formik.touched.password && formik.errors.password}
                    /> */}
              <InputPassword
                onChange={formik.handleChange}
                className={styles.loginInputBox}
                prefix={<LockOutlined className={styles.formInputIcon} />}
                name="password"
                id="password"
                placeholder="Password"
                size="middle"
                value={formik.values.password}
                errormsg={formik.touched.password && formik.errors.password}
                disabled={userMsg ? true : false}
                onPressEnter={() => (!userMsg && !loader) ? formik.handleSubmit() : null}
              />
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // alignItems: "self-start",
                gap: "0.7rem",
              }}
            >
              {!enableTwoFactor && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    // alignItems: "self-start",
                    gap: "0.3rem",
                  }}
                >
                  <DialCodeSelect
                    codeList={codeList}
                    formik={formik}
                    defaultCode="🇮🇳 91"
                    name2="phoneNo"
                    placeholder1="Select Country"
                    placeholder2="Phone Number"
                    onChange1={(value: any) => console.log("value", value)}
                    onChange2={(value: any) => {
                      setPhoneNo(value);
                      console.log("value2", value);
                      formik.setFieldValue("phoneNo", value);
                    }}
                    errormsg={formik.touched.phoneNo && formik.errors.phoneNo}
                  />
                  <ButtonComponent
                    type="text"
                    className={styles.fpass}
                    onClickEvent={handleOTP}
                    style={{ alignSelf: "self-end" }}
                  >
                    Send OTP
                  </ButtonComponent>
                </div>
              )}

              <InputNumberComponent
                value={formik.values.otp}
                type="number"
                placeholder="OTP"
                formatter={(value) =>
                  value ? value.toString().slice(0, 6) : ""
                }
                // parser={(value) => value?.replace(/[^\d]/g, "").slice(0, 6)}
                onChange={(e) => {
                  const value = String(e).slice(0, 6);
                  formik.setFieldValue("otp", value);
                  setOTPValue(value);
                }}
                errormsg={formik.touched.otp && formik.errors.otp}
                style={{ minWidth: "335px" }}
                onPressEnter={(e) => {
                  e.preventDefault(); // Prevent form submission on Enter key
                  formik.handleSubmit(); // Now only the form submission is triggered
                }}
              />
            </div>
          )}
          <Flex
            align="center"
            justify="space-between"
            className={styles.gapBelow}
          >
            <Switch
              checkedChildren="OTP"
              unCheckedChildren="Password"
              checked={otpLogin}
              onChange={(checked) => {
                setOtpLogin(checked);
                setEnableTwoFactor(false);
                formik.setFieldValue("phoneNo", "");
                formik.setFieldValue("otp", "");
              }}
              style={{ alignSelf: "flex-start" }}
            />
            {/* {otpLogin || enableTwoFactor ? (
              <ButtonComponent
                type="text"
                className={styles.fpass}
                onClickEvent={handleOTP}
              >
                Send OTP
              </ButtonComponent>
            ) : (
              <></>
            )} */}
          </Flex>
        </Flex>
        {/* <Flex
          align="center"
          justify="space-between"
          className={styles.gapBelow}
        >
          <Flex align="center" gap={7}>
            <Switch size="small" defaultChecked onChange={onChange} />
            <p className={styles.remme_text}>{t("Remember me")}</p>
          </Flex>
          <ButtonComponent
            id="forgotPasswordButton"
            onClickEvent={() => console.log("forgotPassword", "forgotPassword")}
            type="text"
            className={styles.fpass}
          >
            Forgot password?
          </ButtonComponent>
        </Flex> */}

        <div className={styles.gapAbove}>
          {/* {!enableTwoFactor ? ( */}
          {!otpLogin ? (
            <ButtonComponent
              id="loginButton"
              // htmlType={"submit"}
              onClickEvent={() => {
                console.log("inn");
                formik.handleSubmit();
              }}
              type="primary"
              className={styles.loginButton}
              disabled={loader || userMsg}
            >
              Sign In
            </ButtonComponent>
          ) : (
            <ButtonComponent
              type="primary"
              onClickEvent={() => {
                console.log("inn");
                formik.handleSubmit();
              }}
              className={styles.loginButton}
            >
              Verify OTP
            </ButtonComponent>
          )}
          <Flex align="center" justify="flex-end">
            {/* <p className={styles.footText}>New user?</p> */}
            <a
              className={styles.footText}
              onClick={() => {
                if (
                  host1 == "localhost" ||
                  host1 == "192.168.10.92" ||
                  host1.split(".").length <= 2
                ) {
                  handleSwich("register");
                } else {
                  handleSwich("forgotPassword");
                }
              }}
              style={{
                color: "#0D39FE",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              {host1 == "localhost" ||
                host1 == "192.168.10.92" ||
                host1.split(".").length <= 2
                ? "Setup your store"
                : "Forgot Password"}
            </a>
          </Flex>
        </div>
      </div>
      {otpSended ? (
        <Toast
          message={`OTP Sent To Register Number Successfully.`}
          type="success"
          delay={3000}
        />
      ) : null}
      {deviceLogout ? (
        <Toast
          message={`Successfully logged out from the other device.`}
          type="success"
          delay={3000}
        />
      ) : null}
    </form>
  );
};

export default LoginForm;
