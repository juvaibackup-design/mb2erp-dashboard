import React, { memo } from "react";
import styles from "./ProductCard.module.css";
import Image from "next/image";
import { ImageComponent } from "../MediaUploadComponent/MediaUpload";

interface ProductCardProps {
  // imgUrl: string | null;
  imgData: string | undefined;
  productItemName: string | undefined;
  productDescription: string | undefined;
  productGroupName: string | any;
  onClickImage?: Function;
}

function ProductCard({
  // imgUrl,
  imgData,
  productItemName,
  productDescription,
  productGroupName,
  onClickImage,
}: ProductCardProps) {
  // console.log("imgUrl", imgUrl);
  return (
    <div className={styles.container}>
      <div className={styles.productInfo}>
        <ImageComponent
          // src={imgUrl ? imgUrl : "/assets/thumbnail.png"}
          // alt={"-"}
          // unselectable="off"
          // unoptimized={true}
          imgData={imgData}
          altSrc="/assets/thumbnail.png"
          width={40}
          height={40}
          className="product-image"
          onClick={onClickImage}
          style={imgData ? { cursor: "pointer" } : {}}
        />
        <div className={styles.prod_ins}>
          <p className={styles.name}>{productItemName}</p>
          <p className={styles.desc}>{productDescription}</p>
        </div>
      </div>
      <p className={styles.grpName}>{productGroupName}</p>
    </div>
  );
}

export default memo(ProductCard);
