import React from "react";
import styles from "./Analytics.module.css";
import Image from "next/image";

export interface AnalyticsProps {
  insightName: string;
  insightAmout: string;
  image: any;
  insightType: string;
  insight: string;
}

const localData: AnalyticsProps[] = [
  {
    insightName: "Sales",
    insightAmout: "$7825",
    image: "/assets/Graph style 1.png",
    insightType: "Total sale",
    insight: "Today",
  },
  {
    insightName: "Purchase",
    insightAmout: "$6666",
    image: "/assets/Graph style 2.png",
    insightType: "Total purchase",
    insight: "Today",
  },
  {
    insightName: "Stock",
    insightAmout: "11256",
    image: "/assets/Graph style 4.png",
    insightType: "Total available stock",
    insight: "Today",
  },
  {
    insightName: "Ecommerce",
    insightAmout: "235",
    image: "/assets/Graph style 4 (1).png",
    insightType: "Total Visit",
    insight: "Views",
  },
];

function Analytics() {
  return (
    <div className={styles.flexCentered}>
      {localData.map((each: AnalyticsProps, index: number) => {
        return (
          <div
            key={index}
            className={styles.analytics}
            style={{
              marginRight: index === localData.length - 1 ? "" : "32px",
            }}
          >
            <div className={styles.flexCentered}>
              <div className={styles.padding}>
                <p className={styles.insightName}>{each.insightName}</p>
                <p className={styles.insightAmout}>{each.insightAmout}</p>
              </div>
              <div>
                <Image
                  src={each.image}
                  alt="Analytics"
                  width={75}
                  height={55}
                  unoptimized={true}
                  unselectable="off"
                  priority={true}
                />
              </div>
            </div>
            <div className={styles.flexCentered}>
              <p className={styles.font}>{each.insightType}</p>
              <p className={styles.font}>{each.insight}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Analytics;
