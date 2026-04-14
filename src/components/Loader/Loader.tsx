import { Spin } from "antd";
import styles from "./Loader.module.css";

interface LoaderProps {
  size: "small" | "default" | "large";
  delay: number; // in milliseconds
  variant: "overlay" | "inline";
  /** NEW: allow additional className if you need fine control */
  className: any;
}

function Loader({ size, delay, variant, className }: Partial<LoaderProps>) {
  const wrapperClass =
    variant === "inline" ? styles.loaderInline : styles.loader;
  const wrapperSpinner =
    variant === "inline" ? styles.loaderInline : styles.loaderOverlay;
  return (
    <div className={`${wrapperClass} ${className ?? ""}`}>
      <Spin
        size={size}
        delay={delay}
        indicator={
          <img src="/assets/icube_logo.png" className={styles.spinnerLogo} />
        }
        className={styles.spinner}
      />
    </div>
  );
}

export default Loader;
