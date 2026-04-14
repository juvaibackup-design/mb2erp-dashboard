"use client";

import { Button, Carousel, Flex, Table } from "antd";
import styles1 from "./ActivationPage.module.css";
import Chivo from "next/font/local";
import Image from "next/image";
import InputNumberComponent from "@/components/InputComponent/InputNumberComponent";
import InputComponent from "@/components/InputComponent/InputComponent";
import InputPasswordComponent from "../_components/signInComponents/InputPasswordComponent";
import Password from "antd/lib/input/Password";
import { useState } from "react";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { entries } from "lodash";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";

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

export default function ActivationPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const [details, setDetails] = useState<any[]>([]);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  // let userDetails: Record<string, string> = {};
  const [userDetails, setUserDetails] = useState<any>();

  function validatePassword() {
    if (!password) return setError("Password is required");
    if (password != "Icube@123") return setError("Incorrect password!");
    setError("");
    makeApiCall
      .get("GetAllRegisteredcompany")
      .then((res) => {
        const data = res.data.data[0].find(
          (user: any) => user.domain == searchParams.get("domain")
        );
        if (data) {
          setUserDetails(data);

          let tableData = [];
          for (const [key, value] of Object.entries(data)) {
            if (
              key == "zipCode" ||
              key == "isActive" ||
              key == "userName" ||
              key == "password" ||
              key == "dbConnections" ||
              key == "branches"
            )
              continue;
            else if (key == "expiryDate" || key == "createdAt") {
              tableData.push({
                first: key,
                second: (value as any).split("T")[0],
              });
              continue;
            }
            tableData.push({ first: key, second: value });
          }
          setDetails(tableData);
        }
      })
      .catch((err) => console.log(err));
  }

  function toggleActivation() {
    makeApiCall
      .post("PostDomainStatusUpdate", {
        domain: searchParams.get("domain"),
        status: !userDetails.isActive,
      })
      .then((res) => {
        console.log(res);
        makeApiCall
          .get("GetAllRegisteredcompany")
          .then((res) => {
            const data = res.data.data[0].find(
              (user: any) => user.domain == searchParams.get("domain")
            );
            setUserDetails(data);

            let tableData = [];
            for (const [key, value] of Object.entries(data)) {
              if (
                key == "zipCode" ||
                key == "isActive" ||
                key == "userName" ||
                key == "password" ||
                key == "dbConnections" ||
                key == "branches"
              )
                continue;
              else if (key == "expiryDate" || key == "createdAt") {
                tableData.push({
                  first: key,
                  second: (value as any).split("T")[0],
                });
                continue;
              }
              tableData.push({ first: key, second: value });
            }
            setDetails(tableData);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  return (
    <main className={`${chivo.className}`}>
      <Flex align="center" justify="center" className={styles1.mainContainer}>
        <div
          className={
            details.length == 0 ? styles1.loginBox : styles1.registerBox
          }
        >
          <div className={styles1.padd}>
            {details.length == 0 ? (
              <div className={styles1.login_form}>
                <Flex
                  vertical
                  gap={24}
                  align="center"
                  className={styles1.paddingGap}
                >
                  <p>Enter Password for Account Activation</p>
                  <InputPasswordComponent
                    placeholder="Password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    errormsg={error}
                  />
                  <Button
                    type="primary"
                    className={styles1.loginButton}
                    onClick={validatePassword}
                  >
                    Submit
                  </Button>
                </Flex>
              </div>
            ) : (
              <div className={styles1.login_form}>
                <Flex vertical gap={16}>
                  <h3 style={{ textAlign: "center" }}>
                    {userDetails?.customer}&apos;s Company Details
                  </h3>
                  <Table
                    columns={[
                      { dataIndex: "first", title: "Field" },
                      { dataIndex: "second", title: "Data" },
                    ]}
                    dataSource={details}
                    pagination={false}
                  />
                  <InputNumberComponent
                    label="Trial days"
                    style={{ width: "100%" }}
                  />
                  <Button
                    type="primary"
                    size="large"
                    danger={userDetails?.isActive ?? false}
                    onClick={toggleActivation}
                  >
                    {userDetails.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </Flex>
              </div>
            )}
          </div>
        </div>

        <div className={styles1.carousal}>
          <Carousel autoplay dots={false} waitForAnimate={true}>
            {images.map((image, index) => {
              return (
                <div key={index}>
                  <Image
                    key={index}
                    src={image}
                    alt={`image-${index + 1}`}
                    className={styles1.img}
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
