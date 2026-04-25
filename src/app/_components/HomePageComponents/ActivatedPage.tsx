import { Flex } from "antd";
import Image from "next/image";
import styles from "../signInComponents/LoginForm.module.css";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/store/login/store";

export default function ActivatedPage(props: any) {
  const router = useRouter();
  const newCompanyURL = useLoginStore().newCompanyURL;

  return (
    <form>
      <Flex vertical align="center">
        {/* <Image
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
        /> */}
        {/* <p className={styles.text}>
          Enter your username and password to continue
        </p> */}
      </Flex>
      <div className={styles.login_form}>
        <p style={{ fontSize: 20, paddingBottom: 24, textAlign: "center" }}>
          Company successfully registered! Kindly wait for our approval...
        </p>
        <Flex align="center" justify="flex-end">
          <a
            className={styles.footText}
            // onClick={() => props.setAction("login")}
            // onClick={() => {
            //   router.push(`https://${newCompanyURL}`);
            // }}
            onClick={() => props.setAction("login")}
            style={{
              color: "#0D39FE",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Continue to Login
          </a>
        </Flex>
      </div>
    </form>
  );
}
