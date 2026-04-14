import Image from "next/image";

interface IconProps {
  name: "Tenant" | "User" | any;
}

const Icons = ({ name }: IconProps) => {
  // const isMobile = useMediaQuery({ maxWidth: 768 });

  // const imageSize = isMobile ? 20 : 18; // Set the image size based on device type

  switch (name) {
    case "Tenant":
      return (
        <Image
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/Tenant.png"}
          alt="Tenant"
        />
      );
    case "User":
      return (
        <Image
          // width={imageSize}
          // height={imageSize}
          width={0}
          height={0}
          className="menuImg"
          src={"/assets/User.png"}
          alt="User"
        />
      );

    default:
      return null;
  }
};

export default Icons;
