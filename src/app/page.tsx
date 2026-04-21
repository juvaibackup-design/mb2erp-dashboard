import styles from "./rootLayout.module.css";
import { Carousel, Flex } from "antd";
import Chivo from "next/font/local";
import Image from "next/image";
import HomePage from "./_components/HomePageComponents/HomePage";

const chivo = Chivo({
  src: [
    {
      path: "./fonts/Chivo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Chivo-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Chivo-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Chivo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Chivo-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata = {
  title: "ERP App",
  description: "Progressive ERP System",
  manifest: "/manifest.json",
  themeColor: "#317EFB",
};

export default function Home() {

  const images = [
    "/assets/image_login_1.png",
    "/assets/image_login_2.png",
    "/assets/image_login_3.png",
    "/assets/image_login_4.png",
  ];

  return (
    <main className={`${chivo.className}`}>
      <Flex align="center" justify="center" className={styles.mainContainer}>
        <HomePage />
        {/* <div className={styles.carousal}>
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
        </div> */}
      </Flex>
    </main>
  );
}
