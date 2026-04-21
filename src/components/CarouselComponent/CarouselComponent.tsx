/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Ref, useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Carousel,
  Checkbox,
  Flex,
  Image,
  Modal,
  Row,
  Spin,
  Tabs,
  Upload,
} from "antd";
import NextImage from "next/image";
import styles from "./CarouselComponent.module.css";
import {
  DeleteOutlined,
  LeftOutlined,
  MinusSquareOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import ModalComponent from "../ModalComponent/ModalComponent";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import { showAlert } from "@/lib/helpers/alert";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";


interface CarouselComponent {
  images: any;
  isBase64: boolean;
  uploadedImageList: any;
  setUploadedImageList: any;
  selectedValue?: any;
  setSelectedValues: Function;
  initialDisplayValues: any;
  displayValues: any;
  selectedValues: any;
  setDisplayValues: Function;
  combiIndex: number;
  setCombiIndex: Function;
  imageData: any[];
  setImageData: Function;
  choosenImageBase64: string;
  setChoosenImageBase64: Function;
  setMultiImage: any;
  choosedCat: any;
  handleSave: any;
  isOverrideWarninig: boolean;
  setisOverrideWarninig: any;
  localSelectedCat: any;
  mediaUploadRef: Ref<any>
}

const CarouselComponent = ({
  images,
  isBase64,
  uploadedImageList,
  setUploadedImageList,
  selectedValue,
  selectedValues,
  setSelectedValues,
  initialDisplayValues,
  displayValues,
  setDisplayValues,
  combiIndex,
  setCombiIndex,
  imageData,
  setImageData,
  choosenImageBase64,
  setChoosenImageBase64,
  setMultiImage,
  choosedCat,
  handleSave,
  isOverrideWarninig,
  setisOverrideWarninig,
  localSelectedCat,
  mediaUploadRef
}: CarouselComponent) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("1");
  const [uploadFiles, setUploadFiles] = useState<any[]>([]);
  const [images1, setImages1] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const Loader = useContext(LoaderContext);
  

  console.log("imageData123", imageData);
  useEffect(() => {
    console.log("uploadedImageList", uploadedImageList);
    const choosedImage = getImagesList(
      uploadedImageList,
      choosedCat?.value,
      selectedValue?.ccode
    );
    setMultiImage(choosedImage);
    setSelectedIndex(0);
  }, [selectedValue, localSelectedCat]);

  const getImagesList = (
    uploadedImageList: any,
    cat: any,
    selectedValue: any
  ) => (uploadedImageList[cat] && uploadedImageList[cat][selectedValue]) || [];

  useEffect(() => {
    if (previewRef.current) {
      // Get the last image element
      const lastImage = previewRef.current.children[images.length - 1]; // Change to images.length
      if (lastImage) {
        lastImage.scrollIntoView({ behavior: "smooth" }); // Scroll to the last image
      }
    }
  }, [images]);

  const dropZoneRef = useRef<HTMLDivElement | null>(null);
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewRef = useRef<HTMLImageElement | any>(null);
  const pRef = useRef<HTMLParagraphElement | any>(null);

  const handleRemoveImage = () => {
    const imagesCopy = [...images];

    if (selectedIndex >= 0 && selectedIndex < images?.length) {
      imagesCopy.splice(selectedIndex, 1);
      // setMultiImage(imagesCopy);
      setMultiImage((prev: any) => {
        const updatedMultiImage = [...imagesCopy];
        handleSave(updatedMultiImage);
        return updatedMultiImage;
      });
      setSelectedIndex(0);
    } else {
      console.log("Invalid index to remove.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files", e.target.files);
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const previews: any = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const reader = new FileReader();

        reader.onload = () => {
          previews.push({ img: reader.result as string });

          if (i === selectedFiles.length - 1) {
            if (dropZoneRef.current) {
              dropZoneRef.current.style.border = "2px dotted blue";
            }
            if (imgRef.current) {
              imgRef.current.style.display = "block";
            }
            setSelectedIndex(0);
            setMultiImage((prev: any) => {
              const updatedMultiImage = [...prev, ...previews];
              handleSave(updatedMultiImage);
              return updatedMultiImage;
            });
          }
        };

        reader.readAsDataURL(file);
      }

      if (imgRef.current) {
        imgRef.current.style.display = "block";
        pRef.current.style.display = "none";
      }

      if (dropZoneRef.current) {
        dropZoneRef.current.style.border = "none";
      }
    }
  };

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   if (imgRef.current && pRef.current) {
  //     imgRef.current.style.display = "block";
  //     const file = e.dataTransfer.files[0];
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     reader.onload = () => {
  //       if (imgRef.current) {
  //         pRef.current.style.display = "none";
  //         imgRef.current.src = reader.result as string;
  //         imgRef.current.alt = file.name;
  //       }
  //     };
  //   }
  // };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    console.log("e.dataTransfer items", e.dataTransfer?.items);
    console.log("e.dataTransfer files", e.dataTransfer?.files);
    const droppedFiles: any = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const previews: any = [];
      console.log("droppedFiles.length", droppedFiles.length);
      // Handle items
      for (let i = 0; i < droppedFiles.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              previews.push({ img: reader.result as string });
              if (imgRef.current && pRef.current) {
                imgRef.current.style.display = "block";
              }
              if (i === droppedFiles.length - 1) {
                setSelectedIndex(0);
                setMultiImage((prev: any) => {
                  const updatedMultiImage = [...prev, ...previews];
                  handleSave(updatedMultiImage);
                  return updatedMultiImage;
                });
              }
            };
          }
        }
      }
    }
    // else {
    //   console.log("ELSE");
    //   // Handle files
    //   for (let i = 0; i < e.dataTransfer.files.length; i++) {
    //     const file = e.dataTransfer.files[i];
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //       if (imgRef.current && pRef.current) {
    //         imgRef.current.style.display = "block";
    //         pRef.current.style.display = "none";
    //       }
    //       imgRef.current.src = reader.result as string;
    //       imgRef.current.alt = file.name;
    //     };
    //   }
    // }
  };

  const handleDropZoneClick = () => {
    console.log("inputElementRef", inputElementRef);
    if (inputElementRef.current) {
      inputElementRef.current.value = "";
      inputElementRef.current.click();
    }
  };

  function uploadImage(e: any) {
    const files = e.target.files;
    setUploadFiles(files);
    console.log("file", files);
    if (files) {
      const reader = new FileReader();
      // let base64Image: any;
      reader.onload = () => {
        const allowedTypes = [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/svg+xml",
        ];
        if (!allowedTypes.includes(files[0].type)) {
          e.target.value = "";
          return showAlert("Unsupported file format");
        }
        const base64Image = reader?.result?.toString().split(",")?.[1];
        makeApiCall
          .post("media", {
            path: files[0].name,
            pindex: 2,
            cindex: 0,
            gcindex: 0,
            image: base64Image,
          })
          .then((res) => {
            getAllImages();
            // setUploadFiles([]);
            e.target.value = "";
            setTab("1");
          })
          .catch((err) => console.log(err));
      };
      reader.readAsDataURL(files[0]);
    }
  }

  function handleCheckImage(checked: boolean, imgId: number) {
    if (checked && combiIndex == -1)
      setSelectedImages([...selectedImages, imgId]);
    else if (checked) setSelectedImages([imgId]);
    else setSelectedImages(selectedImages.filter((id) => id != imgId));
  }

  function getAllImages() {
    Loader?.setLoader(true);
    makeApiCall
      .get("media?pindex=2")
      .then((res) => {
        const images = res.data.data.map((img: any) => ({
          id: img.id,
          image: img.image,
          url: img.url,
        }));
        setImages1(images);
        Loader?.setLoader(false);
      })
      .catch((err) => {
        Loader?.setLoader(false);
        console.log(err);
      });
  }

  function handleAddImages(imageIds: number[], imageBase64: string[], virtualTryOnBase64?: string) {
    console.log("virtualTryOnBase64",virtualTryOnBase64)
    if (combiIndex == -1) {
      // const pushData = selectedImages.map((id) => ({
      const pushData = imageIds.map((id, index) => ({
        ...displayValues,
        imageId: id,
        image: imageBase64[index],
        // image: virtualTryOnBase64 ?? imageBase64[index], // 🔥 KEY

      }));
      const final = [...imageData, ...pushData];
      console.log("final", final, virtualTryOnBase64);
      setImageData(final);
      setCombiIndex(final.length - 1);
      setDisplayValues({
        ...displayValues,
        imageId: final[final.length - 1]?.imageId,
      });
      if (final.length > 0)
        // if (virtualTryOnBase64) {
        //   setChoosenImageBase64(virtualTryOnBase64); // ✅ USE TRY-ON
        // } else {
        //   downloadFullQualityImage(final, final.length - 1); // ✅ OLD FLOW
        // }
      downloadFullQualityImage(final, final.length - 1);
    } else {
      const pushData = [...imageData];
      pushData[combiIndex] = {
        ...displayValues,
        imageId: imageIds[0],
        image: imageBase64[0],
        // image: virtualTryOnBase64 ?? imageBase64[0], // 🔥 KEY

      };
      setImageData(pushData);
      setDisplayValues({
        ...displayValues,
        imageId: pushData[combiIndex].imageId,
      });
      // if (virtualTryOnBase64) {
      //   setChoosenImageBase64(virtualTryOnBase64);
      // } else {
      //   downloadFullQualityImage(pushData, combiIndex);
      // }
      downloadFullQualityImage(pushData, combiIndex);
    }
    setShowUploadModal(false);
    setSelectedImages([]);
  }

  function handleChooseImage(index: number, img: any) {
    if (index == combiIndex) {
      setCombiIndex(-1);
      setDisplayValues(initialDisplayValues.current);
      setSelectedValues([]);
    } else {
      setCombiIndex(index);
      downloadFullQualityImage(imageData, index);
      const data = { ...img };
      delete data.image;
      setDisplayValues(data);
      console.log("data", data);
      const data2 = Object.entries(data)
        .flatMap((val: any) =>
          val[1].length > 0
            ? val[1].map((v: string) => val[0] + "-" + v)
            : undefined
        )
        .filter((val) => val);
      console.log("data2", data2);
      setSelectedValues(data2);
    }
  }

  function handleCloseModal() {
    setSelectedImages([]);
    setShowUploadModal(false);
  }

  function handleRemoveCarouselImage(index: number) {
    const data = [...imageData];
    data[index] = undefined;
    setImageData(data.filter((datum) => datum));
    setCombiIndex(-1);
    setDisplayValues(initialDisplayValues.current);
    setSelectedValues([]);
  }

  function downloadFullQualityImage(data: any, index: number) {
    makeApiCall
      .get(`media/${data[index].imageId}`)
      .then((res) => setChoosenImageBase64(res.data.data.image))
      .catch((err) => console.log(err));
  }

  // useEffect(() => {
  //   if (showUploadModal && images1.length == 0) getAllImages();
  // }, [showUploadModal]);

  useEffect(() => {
    if (combiIndex == -1) setChoosenImageBase64("");
  }, [combiIndex]);

  return (
    <>
      {Boolean(selectedValue) && (
        <div className={`${styles.tabContainer}`}>
          {/* <div style={{}}>
            <p>
              Property :{" "}
              <span
                style={{ fontSize: 14, fontWeight: "bold" }}
              >{`${selectedValue.cname}`}</span>
            </p>
          </div> */}
          {Boolean(images.length) && (
            <div>
              <DeleteOutlined
                style={{ fontSize: "16px", color: "red", cursor: "pointer" }}
                onClick={() => {
                  handleRemoveImage();
                }}
              />
            </div>
          )}
        </div>
      )}
      {/* <ModalComponent
        showModal={showUploadModal}
        setShowModal={setShowUploadModal}
        onOk={handleAddImages}
        onClose={handleCloseModal}
        onCloseModalCustom={handleCloseModal}
      >
        <Tabs
          defaultActiveKey="1"
          activeKey={tab}
          onChange={(key) => setTab(key)}
          items={[
            {
              label: "Upload",
              key: "0",
              children: (
                <>
                  <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/svg+xml"
                    // value={uploadFiles}
                    onChange={(e) => uploadImage(e)}
                  />
                </>
              ),
            },
            {
              label: "Existing Images",
              key: "1",
              children: (
                <Flex
                  gap={"5%"}
                  // justify="space-between"
                  wrap="wrap"
                  className={`${styles.imageContainer} custom-scroll`}
                >
                  {images1.map((img, index) => (
                    <div key={index} className={styles.gridImage}>
                      <Checkbox
                        className={styles.placeTopRight}
                        checked={selectedImages.includes(img.id)}
                        onChange={(e) =>
                          handleCheckImage(e.target.checked, img.id)
                        }
                      />
                      <NextImage
                        src={`data:image/png;base64,${img.image}`}
                        alt="iCube_Logo"
                        // className={styles.logo}
                        width={128}
                        height={128}
                        unoptimized={true}
                        unselectable="off"
                        priority={true}
                        placeholder="blur"
                        blurDataURL={img.url}
                        onClick={() =>
                          handleCheckImage(
                            !selectedImages.includes(img.id),
                            img.id
                          )
                        }
                      />
                    </div>
                  ))}
                </Flex>
              ),
            },
          ]}
        />
      </ModalComponent> */}
    
      <div
        ref={dropZoneRef}
        id="dropzone"
        className={styles.dropzone}
        onDragOver={handleDrop}
        onDrop={handleDrop}
        onClick={() => {
          // if (selectedValues.length == 0)
          //   showAlert("Select category to upload image");
          // else
          setShowUploadModal(true);
        }}
      >
        {/* <div className={styles.imgBox} onClick={handleDropZoneClick}>
          <input
            ref={inputElementRef}
            type="file"
            id="myfile"
            hidden
            multiple
            onChange={handleFileChange}
            disabled={Boolean(selectedValue) ? false : true}
          />
          <img
            className={styles.img}
            id="img"
            // ref={imgRef}
            // alt=""
            style={{
              display: Boolean(images[selectedIndex]?.img) ? "block" : "none",
            }}
            src={images[selectedIndex]?.img}
          />
        </div>
        {Boolean(images?.length) ? (
          <div ref={previewRef} className={styles.previewContainer}>
            {images.map((item: any, index: number) => {
              return (
                <img
                  key={index}
                  className={styles.previewImg}
                  alt=""
                  src={item.img}
                  style={{
                    cursor: "pointer",
                    borderColor: selectedIndex == index ? "blue" : "#e3dbdb",
                  }}
                  onClick={() => {
                    setSelectedIndex(index);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div style={{ marginTop: "-28%", padding: 20 }}>
            <p ref={pRef}>Select Property to drop file or click to upload</p>
          </div>
        )} */}
      
        
      </div>
    
      <div>
        <Modal
          title="Warning"
          open={isOverrideWarninig}
          closeIcon={false}
          onOk={() => {
            setisOverrideWarninig(false);
          }}
          onCancel={() => {
            setisOverrideWarninig(false);
          }}
          okText="Ok"
          // cancelText=""
          okType="danger"
          mask
          maskClosable={false}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <p>You already upload an image, It will override if you continue</p>
        </Modal>
      </div>
    </>
  );
};

export default CarouselComponent;
