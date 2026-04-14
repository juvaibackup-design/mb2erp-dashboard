


import dynamic from "next/dynamic";

const SuccessPage = dynamic(() => import("./SuccessPage"), {
  ssr: false,
});

export default function page() {
  return <SuccessPage />;
}
