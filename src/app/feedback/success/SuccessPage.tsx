"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Card, Typography, Button, notification, message } from "antd";

import {
  CheckCircleFilled,
  TrophyOutlined,
  GiftOutlined,
  CopyOutlined,
  StarFilled,
} from "@ant-design/icons";
import styles from "./SuccessPage.module.css";

const { Title, Text } = Typography;

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const avg = searchParams.get("avg");
  const couponCode = searchParams.get("coupon");

  const status = searchParams.get("status"); // "saved" | "already"
  const expiry = searchParams.get("expiry");
  console.log("EXPIRY 👉", expiry);


  const isExpired =
    expiry && new Date(expiry).getTime() < new Date().getTime();




  const copyCoupon = () => {
    if (!couponCode) return;
    navigator.clipboard.writeText(couponCode);
    message.success("Coupon code copied!");
  };




  useEffect(() => {
    if (status === "saved") {
      notification.success({
        message: "Feedback Submitted Successfully",
        description: "Thank you for sharing your experience with us!",
        placement: "top",
        duration: 3,
      });
    }

    if (status === "already") {
      notification.warning({
        message: "Feedback Already Submitted",
        description:
          "You have already submitted feedback for this bill. This coupon was generated earlier.",
        placement: "top",
        duration: 4,
      });
    }
  }, [status]);


  return (
    <div className={styles.page}>
      <Card className={styles.card}>



        {/* ✅ ICON */}
        <CheckCircleFilled className={styles.successIcon} />

        {/* 🎉 TITLE */}
        <Title level={2} className={styles.title}>
          <TrophyOutlined /> Congratulations! ✨
        </Title>

        <Text className={styles.subtitle}>
          Thank You for Your Valuable Feedback
        </Text>

        {/* ⭐ AVERAGE RATING */}
        <div className={styles.ratingBox}>
          <Text>Your Average Rating</Text>

          <div className={styles.ratingValue}>
            <StarFilled />
            <span>{Number(avg).toFixed(1)}</span>
            <small>/5.0</small>
          </div>
        </div>

        {/* 🎁 COUPON */}
        <div className={styles.couponBox}>
          <Title level={4}>
            <GiftOutlined /> Special Discount Coupon!
          </Title>

          <Text>
            Here&apos;s your exclusive <b>20% OFF</b> coupon code : {" "}
            <span
              className={
                isExpired
                  ? styles.couponExpiredText
                  : styles.couponActiveText
              }
            >
              ({isExpired ? "Expired" : "Active"})
            </span>
          </Text>


          <div className={styles.couponCode}>
            <span>{couponCode}</span>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={copyCoupon}
            />
          </div>

          <Text type="secondary">
            Valid on your next purchase. Use this code at checkout!
          </Text>
        </div>

        <Text className={styles.footerText}>
          Your feedback has been successfully submitted! We truly appreciate
          you taking the time to share your thoughts with us.
        </Text>
      </Card>
    </div>
  );
}
