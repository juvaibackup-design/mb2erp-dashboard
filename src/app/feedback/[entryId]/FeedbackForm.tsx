"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Input,
  Row,
  Col,
  Rate,
  DatePicker,
  Button,
  Segmented,
  notification,
} from "antd";
import {
  StarOutlined,
  StarFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
// import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import styles from "./FeedbackForm.module.css";

import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";

const { Title, Text } = Typography;
import makeApiCall from "@/lib/helpers/apiHandlers/api";

/* QUESTIONS (API-ready) */


type ViewMode = "SCROLL" | "SLIDE";

export default function FeedbackForm() {
  const router = useRouter();

  const params = useParams();
  const entryId = Array.isArray(params.entryId)
    ? params.entryId[0]
    : params.entryId;

  const [viewMode, setViewMode] = useState<ViewMode>("SCROLL");
  const [currentStep, setCurrentStep] = useState(0);

  const [questions, setQuestions] = useState<
    { id: string; label: string; outOf: number }[]
  >([]);



  /* CUSTOMER INFO */
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [location, setLocation] = useState("");
  const [billId, setBillId] = useState<number | null>(null);


  /* ANSWERS */
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [birthDate, setBirthDate] = useState<string | null>(null);
  // const [festival, setFestival] = useState<string | null>(null);
  const [festival, setFestival] = useState<string[]>([]);
  const [checkingCompleted, setCheckingCompleted] = useState(true);

  const [companyId, setCompanyId] = useState<number>(0);
  const [branchId, setBranchId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(1);

  const totalSteps = questions.length + 2;
  useEffect(() => {
    const loadContext = async () => {
      try {
        setCheckingCompleted(true);

        if (!entryId) {
          console.warn("❌ Missing entryId");
          setCheckingCompleted(false);
          return;
        }

        const res = await makeApiCall.get(
          `GetFeedbackFormContext?entryId=${entryId}`
        );

        const json = res?.data;
        const ctx = json?.data;

        // 🚨 Already completed
        if (ctx?.isCompleted) {
          router.replace(
            `/feedback/success?avg=${ctx.averageRating}&coupon=${ctx.couponCode}&expiry=${ctx.couponExpiry}&status=already`
          );
          return;
        }

        setCheckingCompleted(false);

        // ✅ Set data
        setCompanyId(Number(ctx.company?.companyId ?? 0));
        setBranchId(Number(ctx.branchdata?.branchId ?? 0));
        setUserId(Number(json?.userId ?? 1));

        setCustomerName(ctx.customer?.name ?? "");
        setMobileNumber(ctx.customer?.phone ?? "");
        setLocation(ctx.customer?.location ?? "");
        setBillId(Number(entryId));

        const mapped = (ctx.question ?? []).map((q: any) => ({
          id: String(q.id),
          label: q.question,
          outOf: Number(q.outOf ?? 5),
        }));

        setQuestions(mapped);

      } catch (err) {
        console.error("❌ Context load failed", err);
        setCheckingCompleted(false);
      }
    };

    loadContext();
  }, [entryId]); // ✅ IMPORTANT






  const nextDisabled = () => {
    if (currentStep < questions.length)
      return !ratings[questions[currentStep].id];
    if (currentStep === questions.length) return !birthDate;
    // if (currentStep === questions.length + 1) return !festival;
    if (currentStep === questions.length + 1) return festival.length === 0;
    return false;
  };
  const showError = (title: string, description: string) => {
    notification.open({
      message: title,
      description,
      placement: "top",
      className: styles.customNotification,
      icon: (
        <StarFilled style={{ color: "#facc15", fontSize: 22 }} />
      ),
    });
  };
  const validateBeforeSubmit = () => {
    if (!billId) {
      showError(
        "Invalid Feedback Link",
        "Bill ID is missing. Please use the correct feedback link."
      );
      return false;
    }

    for (const q of questions) {
      if (!ratings[q.id]) {
        showError(
          "Incomplete Feedback",
          "Please rate all questions before submitting."
        );
        return false;
      }
    }

    if (!birthDate) {
      showError(
        "Birth Date Required",
        "Please select your birth date."
      );
      return false;
    }

    // if (!festival) {
    if (festival.length === 0) {
      showError(
        "Festival Required",
        "Please select your preferred festival."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) return;

    const payload = {
      companyId: companyId || 0,
      branchId: branchId || 0,
      userId: userId || 1,

      customerName: customerName || "",
      customerPhone: mobileNumber || "",
      customerLocation: location || "",

      billId: billId,
      birthDate: birthDate || null,
      // festival: festival ? festival.toLowerCase() : "",
      festival: festival.map(f => f.toLowerCase()),

      answers: questions.map((q) => ({
        questionId: Number(q.id),
        rating: ratings[q.id] || 0,
      })),
    };

    try {
      const res = await makeApiCall.post("SubmitFeedback", payload);

      const data = res?.data;

      if (!data?.data) {
        showError("Submission Failed", "Please try again");
        return;
      }

      const result = data.data.result;
      const avg = data.data.averagerating;
      const coupon = data.data.couponcode;
      const expiry = data.data.couponExpiry;

      if (result === "AlreadyCompleted") {
        router.push(
          `/feedback/success?avg=${avg}&coupon=${coupon}&expiry=${expiry}&status=already`
        );
        return;
      }

      router.push(
        `/feedback/success?avg=${avg}&coupon=${coupon}&expiry=${expiry}&status=saved`
      );

    } catch (err) {
      console.error(err);
      showError("Network Error", "Unable to submit feedback");
    }
  };

  if (checkingCompleted) {
    return (
      <div className={styles.page}>
        <Card className={styles.card}>
          <Text>Checking your feedback status...</Text>
        </Card>
      </div>
    );
  }

  /*
  if (!billId) {
    return (
      <div className={styles.page}>
        <Card className={styles.card}>
          <Text type="danger">
            Invalid feedback link. Bill ID is missing.
          </Text>
        </Card>
      </div>
    );
  }
    */



  return (
    <div className={styles.page}>
      <Card className={styles.card} styles={{ body: { padding: 0 } }}>
        {/* ================= HEADER ================= */}
        <div className={styles.header}>
          {/* <div className={styles.logoBox}>
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              fill
              className={styles.logoImage}
            />

          </div> */}

          <div className={styles.logoBox}>
  <span className={styles.shopName}>
    {location || "Shop Name"}
  </span>
</div>

          <Title level={3} className={styles.headerTitle}>
            Customer Feedback Survey
          </Title>

          <Text className={styles.headerSub}>
            We value your opinion. Please rate your experience.
          </Text>

          <div className={styles.toggleWrapper}>
            <Segmented
              value={viewMode}
              onChange={(val) => {
                setViewMode(val as ViewMode);
                setCurrentStep(0);
              }}
              options={[
                { label: "Scroll Mode", value: "SCROLL" },
                { label: "Slide Mode", value: "SLIDE" },
              ]}
              className={styles.modeToggle}
            />
          </div>
        </div>
        {/* CONTENT */}
        <div className={styles.content}>
          {/* CUSTOMER INFO */}
          <div className={styles.blueBox}>
            <Title level={5}>Customer Information</Title>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Text strong>Customer Name</Text>
                <Input
                  size="large"
                  prefix={<UserOutlined style={{ color: "#2563eb" }} />}
                  value={customerName}
                  readOnly
                />
              </Col>

              <Col xs={24} sm={12}>
                <Text strong>Mobile Number</Text>
                <Input
                  size="large"
                  style={{ width: "100%" }}
                  prefix={<PhoneOutlined style={{ color: "#2563eb" }} />}
                  value={mobileNumber}
                  readOnly
                />
              </Col>
            </Row>
          </div>

          {/* LOCATION */}
          <div className={styles.blueBox}>
            <Title level={5}>Location</Title>
            <Input
              size="large"
              prefix={<EnvironmentOutlined />}
              value={location}
              readOnly
            />
          </div>

          {/* RATE TITLE */}
          <Title level={5} className={styles.rateTitle}>
            <StarOutlined /> Rate Your Experience
          </Title>


          {/* ================= SCROLL MODE ================= */}
          {viewMode === "SCROLL" && (
            <>
              {questions.length === 0 && (
                <Text type="secondary">Loading questions…</Text>
              )}

              {questions.map((q, index) => (
                <div key={q.id} className={styles.blueBox}>
                  <div className={styles.questionHeader}>
                    <div className={styles.questionNumber}>
                      {index + 1}
                    </div>

                    <div className={styles.questionText}>
                      {q.label}
                    </div>
                  </div>


                  <div className={styles.ratingRow} style={{ marginTop: 8 }}>
                    <Rate
                      className={styles.customRate}
                      count={q.outOf}
                      value={ratings[q.id] || 0}
                      onChange={(val) =>
                        setRatings((p) => ({ ...p, [q.id]: val }))
                      }
                      allowClear={false}
                    />


                    {ratings[q.id] > 0 && (
                      <span className={styles.scoreBadge}>
                        {ratings[q.id]}/{q.outOf}
                      </span>
                    )}
                  </div>


                </div>
              ))}
              <div className={styles.blueBox}>
                <Text>Your Birth Date?</Text>



                <DatePicker
                  size="large"
                  style={{ width: "100%", marginTop: 8 }}
                  format="DD-MM-YYYY"
                  placeholder="DD-MM-YYYY (e.g. 23-06-2002)"
                  onChange={(date) => {
                    if (date) {
                      setBirthDate(date.format("YYYY-MM-DD")); // ⭐ IMPORTANT
                    } else {
                      setBirthDate(null);
                    }
                  }}
                />




              </div>

              <div className={styles.blueBox}>
                <Text>Your preferred Festival?</Text>
                <div className={styles.festivalRow}>
                  {[
                    { label: "Diwali", emoji: "🪔" },
                    { label: "Christmas", emoji: "🎄" },
                    { label: "Ramzan", emoji: "🌙" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      // className={`${styles.festivalCard} ${festival === item.label
                      //     ? styles.festivalActive
                      //     : ""
                      //   }`}
                      // onClick={() => setFestival(item.label)}
                      className={`${styles.festivalCard} ${
  festival.includes(item.label) ? styles.festivalActive : ""
}`}
onClick={() =>
  setFestival((prev) =>
    prev.includes(item.label)
      ? prev.filter((f) => f !== item.label)
      : [...prev, item.label]
  )
}
                    >
                      <span className={styles.festivalEmoji}>
                        {item.emoji}
                      </span>
                      <Text>{item.label}</Text>
                    </div>
                  ))}
                </div>
              </div>

              <ButtonComponent
                type="primary"
                onClickEvent={handleSubmit}
                className={styles.submitButton}
                style={{ width: "100%", height: 48 }}
              >
                Submit Feedback
              </ButtonComponent>
            </>
          )}

          {/* ================= SLIDE MODE ================= */}
          {viewMode === "SLIDE" && (
            <>
              {currentStep < questions.length && (
                <div className={`${styles.blueBox} ${styles.slide}`}>
                  <Text>
                    Question {currentStep + 1} / {totalSteps}
                  </Text>

                  <Text style={{ marginTop: 12, display: "block" }}>
                    {questions[currentStep].label}
                  </Text>

                  <div className={styles.ratingRow}>
                    <Rate
                      className={styles.customRate}
                      value={ratings[questions[currentStep].id] || 0}
                      onChange={(val) =>
                        setRatings((p) => ({
                          ...p,
                          [questions[currentStep].id]: val,
                        }))
                      }
                      allowClear={false}
                    />

                    {ratings[questions[currentStep].id] && (
                      <span className={styles.scoreBadge}>
                        {ratings[questions[currentStep].id]}/{questions[currentStep].outOf}

                      </span>
                    )}
                  </div>
                </div>
              )}

              {currentStep === questions.length && (
                <div className={`${styles.blueBox} ${styles.slide}`}>
                  <Text>Your Birth Date?</Text>
                  <DatePicker
                    size="large"
                    style={{ width: "100%", marginTop: 8 }}
                    format="DD-MM-YYYY"
                    placeholder="DD-MM-YYYY (e.g. 23-06-2002)"
                    onChange={(date) => {
                      if (date) {
                        setBirthDate(date.format("YYYY-MM-DD")); // ⭐ IMPORTANT
                      } else {
                        setBirthDate(null);
                      }
                    }}
                  />


                </div>
              )}

              {currentStep === questions.length + 1 && (
                <div className={`${styles.blueBox} ${styles.slide}`}>
                  <Text>Your preferred Festival?</Text>
                  <div className={styles.festivalRow}>
                    {[
                      { label: "Diwali", emoji: "🪔" },
                      { label: "Christmas", emoji: "🎄" },
                      { label: "Ramzan", emoji: "🌙" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        // className={`${styles.festivalCard} ${festival === item.label
                        //     ? styles.festivalActive
                        //     : ""
                        //   }`}
                        // onClick={() => setFestival(item.label)}
                        className={`${styles.festivalCard} ${
  festival.includes(item.label) ? styles.festivalActive : ""
}`}
onClick={() =>
  setFestival((prev) =>
    prev.includes(item.label)
      ? prev.filter((f) => f !== item.label)
      : [...prev, item.label]
  )
}
                      >
                        <span className={styles.festivalEmoji}>
                          {item.emoji}
                        </span>
                        <Text>{item.label}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ButtonComponent
                type="primary"
                onClickEvent={() =>
                  currentStep < totalSteps - 1
                    ? setCurrentStep((s) => s + 1)
                    : handleSubmit()
                }
                disabled={nextDisabled()}
                className={styles.submitButton}
                style={{ width: "100%", height: 48 }}
              >
                {currentStep < totalSteps - 1 ? "Next" : "Submit"}
              </ButtonComponent>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
