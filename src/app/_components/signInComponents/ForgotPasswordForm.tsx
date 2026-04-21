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
import {
  LoaderContext,
  SideBarStateContext,
} from "@/lib/interfaces/Context.interfaces";
import { showAlert } from "@/lib/helpers/alert";
import Toast from "@/components/CustomToast/Toast";
import { Modal } from "antd";
import { decrypt1 } from "@/lib/helpers/utilityHelpers";
import { ENCRYPTION_KEY } from "@/lib/constants/constant";
import { encrypt1 } from "@/lib/helpers/utilityHelpers";

const ForgotPasswordForm = (props: { setAction: (action: string) => void }) => {
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

  const [phoneNo, setPhoneNo] = useState<any>();
  const [domainName, setDomainName] = useState<any>("");
  const [OTPValue, setOTPValue] = useState<any>();
  const [otpSended, setOtpSended] = useState<boolean>(false);
  const [shouldTriggerOTP, setShouldTriggerOTP] = useState(false);

  const [otpField, setOtpField] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<boolean>(false);
  const [otpVerify, setOtpVerify] = useState<boolean>(false);
  const [alertSavePass, setAlertSavePass] = useState<boolean>(false);
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
              err?.response?.data?.errordescription.includes(
                "Domain not register"
              )
            )
              setUserMsg("Domain not register");
          });
    }
  }, []);

  function authenticateOTP() {}

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      phoneNo: "",
      otp: "",
    },
    validationSchema: Yup.object({
      ...(!confirmPassword
        ? {
            username: Yup.string().required("Username is required"),
            otp: Yup.string()
              .matches(/^\d{6}$/, "OTP must be 6 digits")
              .required("OTP is required"),
          }
        : {
            password: Yup.string().required("Password is required"),
            confirmPassword: Yup.string().required(
              "Confirm Password is required"
            ),
          }),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        Modal.error({
          title: "Alert",
          content: "Password and Confirm Password Should Be Same.",
          cancelButtonProps: { style: { display: "none" } },
          onOk: () => {
            // Do something when user clicks OK
          },
        });
        return;
      }
      setLoader(true);
      await makeApiCall
        .post("PostSavePassword", {
          emailId: values.username,
          password: encrypt1(values.confirmPassword as string, ENCRYPTION_KEY),
        })
        .then(async (res) => {
          setLoader(false);
          setAlertSavePass(true);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setAlertSavePass(false);
          handleSwich("login");
        })
        .catch((error) => {
          console.log("error", error);
          setLoader(false);

          // Modal.error({
          //   title: "Alert",
          //   content: "Something Went Wrong!",
          //   cancelButtonProps: { style: { display: "none" } },
          //   onOk: () => {
          //     // Do something when user clicks OK
          //   },
          // });
        });
    },
  });

  console.log("formik", formik);
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

  const verifyEmail = async () => {
    if (!formik.values.username) {
      console.log("inn");
      formik.setFieldError("username", "Username Required");
      return;
    }
    setLoader(true);

    await makeApiCall
      .post("PostForgotPassword", {
        EmailId: formik.values.username,
      })
      .then(async (res: any) => {
        // setLoader(false);
        if (res?.data?.phoneNo && res?.data?.phoneNo.length > 0) {
          formik.setFieldValue("phoneNo", res?.data?.phoneNo?.trim());
          setShouldTriggerOTP(true);
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err?.response?.status === 500) {
          alert(`${err?.response?.data?.errordescription}`);
        } else {
          if (
            err?.response?.data?.errordescription?.includes("review stage") ||
            err?.response?.data?.errordescription?.includes("expiry date") ||
            err?.response?.data?.errordescription?.includes("not active")
          ) {
            showAlert(err?.response?.data?.errordescription);
          } else if (
            err?.response?.data?.errordescription?.includes(
              `${formik.values.username + host} is not register`
            )
          ) {
            formik.setFieldError("username", "Invalid Username");
          } else {
            console.log("inn");
            formik.setFieldError("username", "Domain not register");
          }
        }
      });
  };

  function maskPhone(phone: string): string {
    if (!phone || phone.length < 4) return phone;
    return phone.slice(0, 2) + "******" + phone.slice(-3);
  }

  const handleOTP = async () => {
    if (!formik.values.phoneNo) {
      console.log("inn");
      formik.setFieldError("phoneNo", "Phone Number Required");
      return;
    }
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

        if (res?.status === 200) {
          Modal.success({
            title: "Alert",
            content: `OTP sent to ${maskPhone(
              formik.values.phoneNo
            )}. This number is linked to the given username.`,
            cancelButtonProps: { style: { display: "none" } },
            onOk: () => {
              // Do something when user clicks OK
            },
          });
          setOtpSended(true);
          setTimeout(() => {
            setOtpSended(false);
          }, 3000);
        }
        setOtpField(true);
        setShouldTriggerOTP(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  // const verifyOTP = async () => {
  //   setLoader(false);

  //   await makeApiCall
  //     .post("ValidateOTP", {
  //       phoneNo: formik.values.phoneNo,
  //       otp: formik.values.otp,
  //     })
  //     .then(async (res: any) => {
  //       setLoader(false);
  //       setConfirmPassword(true);
  //       setOtpField(false);
  //       setOtpVerify(true);
  //       setTimeout(() => {
  //         setOtpVerify(false);
  //       }, 3000);
  //     })
  //     .catch((err) => {
  //       setLoader(false);
  //       console.log("err", err);
  //       if (err?.response?.data?.data === "Invalid OTP") {
  //         Modal.error({
  //           title: "Alert",
  //           content: "Invalid OTP!",
  //           cancelButtonProps: { style: { display: "none" } },
  //           onOk: () => {
  //             // Do something when user clicks OK
  //           },
  //         });
  //       }
  //     });
  // };

  const verifyOTP = async () => {
    setLoader(true);

    const findDomain = window.location.host
      .split(".")[0]
      .startsWith("localhost")
      ? "icube"
      : host.replace(/^@/, "");

    await makeApiCall
      .post("OTPBasedLogin", {
        phoneNo: formik.values.phoneNo,
        domain_name: findDomain,
        otp: formik.values.otp.toString(),
      })
      .then(async (res: any) => {
        setLoader(false);
        const expiryDate1 = new Date(
          new Date().getTime() + 24 * 60 * 60 * 1000
        );

        Cookies.set("token", res?.data?.accessToken, {
          expires: expiryDate1,
        });
        Cookies.set("refreshToken", res?.data?.refreshToken, {
          expires: expiryDate1,
        });
        setConfirmPassword(true);
        setOtpField(false);
        setOtpVerify(true);
        setTimeout(() => {
          setOtpVerify(false);
        }, 3000);
      })
      .catch((err) => {
        setLoader(false);
        console.log("err", err);
        if (err?.response?.data?.data === "Invalid OTP") {
          Modal.error({
            title: "Alert",
            content: "Invalid OTP!",
            cancelButtonProps: { style: { display: "none" } },
            onOk: () => {
              // Do something when user clicks OK
            },
          });
        }
      });
  };

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
        <p className={styles.text}>Enter your username and otp</p>
      </Flex>
      <div className={styles.login_form}>
        <Flex vertical gap={24} className={styles.paddingGap}>
          <h3 style={{ textAlign: "center", color: "red" }}>{userMsg}</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // alignItems: "self-start",
              gap: "0.7rem",
            }}
          >
            {!otpField ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: "self-start",
                  gap: "0.3rem",
                }}
              >
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
                  errormsg={formik.errors.username}
                  disabled={confirmPassword}
                  autoFocus
                />
                {confirmPassword && (
                  <div className={styles.pass_container}>
                    {" "}
                    <InputPassword
                      onChange={formik.handleChange}
                      className={styles.loginInputBox}
                      fullWidth={true}
                      prefix={<LockOutlined className={styles.formInputIcon} />}
                      name="password"
                      id="password"
                      placeholder="Password"
                      size="middle"
                      value={formik.values.password}
                      errormsg={
                        formik.touched.password && formik.errors.password
                      }
                      disabled={userMsg ? true : false}
                    />
                    <InputPassword
                      onChange={formik.handleChange}
                      className={styles.loginInputBox}
                      fullWidth={true}
                      prefix={<LockOutlined className={styles.formInputIcon} />}
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      size="middle"
                      value={formik.values.confirmPassword}
                      errormsg={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                      }
                      disabled={userMsg ? true : false}
                      confirmPassword={true}
                      onPressEnter={() => formik.handleSubmit()}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <InputNumberComponent
                  value={formik.values.otp}
                  // value={OTPValue}
                  type="number"
                  placeholder="OTP"
                  maxLength={6}
                  // onChange={(e) => {
                  //   formik.setFieldValue("otp", e);
                  //   setOTPValue(e);
                  // }}
                  formatter={(value) =>
                    value ? value.toString().slice(0, 6) : ""
                  }
                  onChange={(e) => {
                    const value = String(e).slice(0, 6);
                    formik.setFieldValue("otp", value);
                    setOTPValue(value);
                  }}
                  errormsg={formik.touched.otp && formik.errors.otp}
                  style={{ minWidth: "335px" }}
                  onPressEnter={() => verifyOTP()}
                />
                <ButtonComponent
                  type="text"
                  className={styles.fpass}
                  onClickEvent={() => {
                    setOtpField(false);
                    formik.setFieldValue("otp", "");
                  }}
                  style={{ alignSelf: "self-end" }}
                >
                  Incorrect Username?
                </ButtonComponent>
              </>
            )}
          </div>
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
          {!confirmPassword ? (
            !otpField ? (
              <ButtonComponent
                id="loginButton"
                // htmlType={"submit"}
                onClickEvent={() => {
                  verifyEmail();
                }}
                type="primary"
                className={styles.loginButton}
                disabled={loader || userMsg}
              >
                Get OTP
              </ButtonComponent>
            ) : (
              <ButtonComponent
                type="primary"
                onClickEvent={() => {
                  verifyOTP();
                }}
                className={styles.loginButton}
              >
                Verify OTP
              </ButtonComponent>
            )
          ) : (
            <ButtonComponent
              type="primary"
              onClickEvent={() => {
                formik.handleSubmit();
              }}
              className={styles.loginButton}
            >
              Save Password
            </ButtonComponent>
          )}

          <Flex align="center" justify="flex-end">
            {/* <p className={styles.footText}>New user?</p> */}
            <a
              className={styles.footText}
              onClick={() => {
                // if (
                //   host1 == "localhost" ||
                //   host1 == "192.168.10.92" ||
                //   host1.split(".").length <= 2
                // ) {
                //   handleSwich("register");
                // } else {
                handleSwich("login");
                // }
              }}
              style={{
                color: "#0D39FE",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              {/* {host1 == "localhost" ||
              host1 == "192.168.10.92" ||
              host1.split(".").length <= 2
                ? "Setup your store"
                : } */}
              Already know your password? Login
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
      {otpVerify ? (
        <Toast
          message={`OTP Verify Successfully.`}
          type="success"
          delay={3000}
        />
      ) : null}
      {alertSavePass ? (
        <Toast
          message={`Password Saved Successfully.`}
          type="success"
          delay={3000}
        />
      ) : null}
    </form>
  );
};

export default ForgotPasswordForm;
