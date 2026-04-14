import dynamic from "next/dynamic";

const SuperPage = dynamic(() => import("./SuperPage"), {
  ssr: false,
});

export default function page() {
  return <SuperPage />;
}
