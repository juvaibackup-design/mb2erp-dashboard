import Image from "next/image";

export const CardPayment = () => {
  return (
    <Image
      src="/assets/card-payment.png"
      alt="icon"
      width={32}
      height={32}
      priority
    />
  );
};
