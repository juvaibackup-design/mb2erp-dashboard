"use client"
import { Avatar, Button, Col, Row, Tour, TourProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import styles from "./Header.module.css";
import { useManagestockFormStore } from "@/store/inventory/managestock/miscellaneous/store";
import { t } from "i18next";

export type SiteHeaderProps = {
  title: string;
  location: string;
};

export default function SiteHeader({ title, location }: SiteHeaderProps) {
  const showTour = useManagestockFormStore((state) => state.showTour);
  const setshowTour = useManagestockFormStore(
    (state) => state.setshowTour
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  const userRef = useRef<any>(null);
  const TransactionTour: TourProps["steps"] = [
    {
      title: t("User Profile"),
      description: t("Enter a unique name for the charge."),
      target: () => userRef?.current,
      // cover: (
      //   <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
      //     <Button type="default">
      //       Previous
      //     </Button>
      //   </div>
      // ),
      cover: (
        <div style={{ marginBottom: -20 }}>
          <Button
            type="link"
            size="small"
            style={{ position: "absolute", right: 0 }}
            onClick={() => {
              // router.back();
              // setOpenDrawer(false);
              setshowTour(false);
            }}
          >
            {t("Skip")}
          </Button>
          <div style={{
            textAlign: "center",
            position: 'relative',
            top: '90px',
            right: '-25px',
            fontSize: 10,
            padding: 10
          }}>
            <Button
              type="default"
              size="small"
              onClick={() => {

              }}
            >
              {t("Previous")}
            </Button>

          </div>

        </div>
      ),

    },
    {
      title: t("Search Barcode"),
      description: t("Choose whether this charge is applied at the Product level or Invoice level."),
      // target: () => siteRef?.current,
      // cover: getSkipCover(() => {
      //   router.back();
      //   setshowTour(false);

      // })
    },
    {
      title: t("Import"),
      description: t("Choose if the charge is an Addition (+) or a Deduction (−)."),
      // target: () => importRef?.current,
      // cover: getSkipCover(() => {
      //   router.back();
      //   setshowTour(false);
      // })
    },
    {
      title: t("Cancel"),
      description: t("Choose if the charge is a Percentage (%) or Amount (₹)"),
      // target: () => leaveRef?.current,
      // cover: getSkipCover(() => {
      //   router.back();
      //   setshowTour(false);
      // })
    },
  ];
  const translatedSteps = TransactionTour.map((step: any, index: any) => ({
    ...step,
    nextButtonProps: {
      children: index === TransactionTour.length - 1 ? t("Finish") : t("Next"),
    },
    prevButtonProps: index > 0 ? { children: t("Previous") } : undefined,
  }));
  return (
    <div className={styles.fixedPosition} style={{ height: "5rem" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ padding: "0.5rem 0.75rem" }}
      >
        <Col>
          <Row align="middle">
            <Col style={{ paddingRight: "1.5rem" }} ref={userRef}>
              <Avatar shape="square" size={75} icon={<UserOutlined />} />
            </Col>
            <Col>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{location}</p>
            </Col>
          </Row>
        </Col>
      </Row>
      <Tour
        open={showTour}
        steps={translatedSteps}
        current={stepIndex}
        onChange={(current) => setStepIndex(current)}
        // onClose={() => {setDrawerTour(false)}}
        onClose={() => {
          setshowTour(false);
          setStepIndex(0)
          // router.back();
        }}
        closeIcon={false}
        rootClassName="ow-tour"
      />
    </div>

  );
}
