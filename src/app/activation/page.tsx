import dynamic from "next/dynamic";

// import ActivationPage from "./ActivationPage";
const ActivationPage = dynamic(() => import("./ActivationPage"), {
  ssr: false,
});

export default function page() {
  return <ActivationPage />;
}
