"use client";

import { Carousel, Flex } from "antd";
import Chivo from "next/font/local";
import styles from "../activation/ActivationPage.module.css";
import InputComponent from "@/components/InputComponent/InputComponent";
import InputPasswordComponent from "../_components/signInComponents/InputPasswordComponent";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "@/lib/helpers/apiHandlers/login";
import { useRouter } from "next/navigation";
import { showAlert } from "@/lib/helpers/alert";
import {
  LoaderContext,
  SideBarStateContext,
} from "@/lib/interfaces/Context.interfaces";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useLoginStore } from "@/store/login/store";
import { encrypt1 } from "@/lib/helpers/utilityHelpers";
import { ENCRYPTION_KEY } from "@/lib/constants/constant";

const chivo = Chivo({
  src: [
    {
      path: "../fonts/Chivo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Chivo-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Chivo-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Chivo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Chivo-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
});

const images = [
  "/assets/image_login_1.png",
  "/assets/image_login_2.png",
  "/assets/image_login_3.png",
  "/assets/image_login_4.png",
];

export default function SuperPage() {
  const router = useRouter();
  const { loader, setLoader }: any = useContext(LoaderContext);
  const urlPath = useLoginStore().URLPath;
  const { setCollapse }: any = useContext(SideBarStateContext);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values: any) => {
      try {
        setLoader(true);
        // const res = await login(values);
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/SuperLogin`,
          {
            emailId: values.username,
            password: encrypt1(values.password, ENCRYPTION_KEY),
          }
        );
        console.log(res);
        if (res.status == 200) {
          // Cookies.set("AccessSuper", "true");
          const expiryDate = new Date(
            new Date().getTime() + 24 * 60 * 60 * 1000
          );
          Cookies.set("superToken", res.data.accessToken, {
            expires: expiryDate,
          });
          Cookies.set("superRefreshToken", res.data.refreshToken, {
            expires: expiryDate,
          });
          // router.push("super/dashboard");
          router.push(urlPath);
        }
        Cookies.set("allowAccess123", "false");
        setCollapse(false);
        // setLoader(false);
      } catch (err: any) {
        console.log(err);
        if (err?.response?.status == 500)
          showAlert(err.response.data.errordescription);
        else if (err?.response?.data?.errordescription?.includes("Password"))
          formik.setFieldError("password", "Invalid password");
        else formik.setFieldError("username", "Domain not register");
        setLoader(false);
      }
    },
  });

  useEffect(() => {
    if (Cookies.get("superToken")) {
      console.log("superToken", Cookies.get("superToken"));
      router.push("/super/dashboard")
      // router.push(urlPath);
    }
  }, [Cookies.get("superToken")]);

  console.log("formik", formik);

  return (
    <main className={`${chivo.className}`}>
      <Flex align="center" justify="center" className={styles.mainContainer}>
        <div className={styles.loginBox}>
          <div className={styles.padd}>
            <div className={styles.login_form}>
              <form onSubmit={formik.handleSubmit}>
                <Flex
                  vertical
                  gap={24}
                  align="center"
                  className={styles.paddingGap}
                >
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
                  <div>Enter credentials to login as Super Admin</div>
                  <InputComponent
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formik.values.username}
                    onChangeEvent={formik.handleChange}
                    errormsg={formik.touched.username && formik.errors.username}
                    autoFocus
                  />
                  <InputPasswordComponent
                    placeholder="Password"
                    fullWidth
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    errormsg={formik.touched.password && formik.errors.password}
                  />
                  <ButtonComponent
                    type="primary"
                    htmlType="submit"
                    className={styles.loginButton}
                    onClickEvent={() => formik.handleSubmit()}
                    disabled={loader}
                  >
                    Submit
                  </ButtonComponent>
                </Flex>
              </form>
            </div>
          </div>
        </div>

        <div className={styles.carousal}>
          <Carousel autoplay dots={false} waitForAnimate={true}>
            {images.map((image, index) => {
              return (
                <div key={index}>
                  <Image
                    key={index}
                    src={image}
                    alt={`image-${index + 1}`}
                    className={styles.img}
                    width={100}
                    height={100}
                    unoptimized={true}
                    unselectable="off"
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      </Flex>
    </main>
  );
}
