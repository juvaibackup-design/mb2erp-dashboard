
import { Carousel, Flex } from "antd";
import Chivo from "next/font/local";
import Image from "next/image";



export default function Home() {

  return (
    <Flex align="center" justify="center" >
      <div >
        <Carousel autoplay dots={false} waitForAnimate={true}>

          <div >
            <Image
              src={"image"}
              alt={`image`}
              width={100}
              height={100}
              unoptimized={true}
              unselectable="off"
            />
          </div>
        </Carousel>
      </div>
    </Flex>
  );
}


