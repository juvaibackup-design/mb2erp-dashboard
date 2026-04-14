import { Checkbox, Flex, Tabs } from "antd";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { forwardRef, Ref, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import { LoaderContext } from "@/lib/interfaces/Context.interfaces";
import NextImage from "next/image";
import styles from "./MediaUpload.module.css";
import { showAlert } from "@/lib/helpers/alert";

type MediaUploadProps = {
  showUploadModal: boolean;
  setShowUploadModal: (fact: boolean) => void;
  handleAddImages?: (imageIds: number[], imageBase64: string[], virtualTryOnBase64?: string) => void;
  closeMediaModal?: Function;
  selectionMethod?: "single" | "multi";
  p_index: number;
  refreshOnOpen?: boolean;
  ref?: Ref<any>;
};

const MediaUpload = forwardRef(({
  showUploadModal,
  setShowUploadModal,
  handleAddImages,
  closeMediaModal,
  selectionMethod = "single",
  p_index,
  refreshOnOpen = false,
}: MediaUploadProps, ref
) => {
  const [tab, setTab] = useState<string>("0");
  const [allImages, setAllImages] = useState<any[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const Loader = useContext(LoaderContext);
  const uploadedImages = useRef<number[]>([]);
  const isEnd = useRef<boolean>(false);
  const isUploadedEnd = useRef<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [uploadedImgs, setUploadedImgs] = useState<any[]>([]);
  const [modelImages, setModelImages] = useState<any[]>([]);
  const [selectedModelImageIds, setSelectedModelImageIds] = useState<number[]>([]);
  const [virtualTryOnBase64, setVirtualTryOnBase64] = useState<string | null>(null);

  const modelImageIds = useRef<number[]>([]);


  const finalImages = useMemo(() => allImages.filter((img) => showAll ? true : uploadedImages.current.includes(img.id)), [allImages, showAll, showUploadModal]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      uploadedImages.current = [];
      setUploadedImgs([]);
    }
  }));

  console.log("finalImages", finalImages, allImages);

  function getAllImages(page_no: number) {
    console.log("getAllImages", isEnd.current)
    // if ((showAll && isEnd.current) || (!showAll && isUploadedEnd.current))
    //   return;
    Loader?.setLoader(true);
    // if (uploadedImages.current.length)
    makeApiCall
      .get(`media?pindex=${p_index}&pageNo=${page_no}&pageSize=9`)
      .then((res) => {
        const images = res.data.data.map((img: any) => ({
          id: img.id,
          image: img.image,
          url: img.url,
        }));
        if (page_no != 1)
          setAllImages([...allImages, ...images]);
        else
          setAllImages(images);
        setPageNo(page_no);
        if (res.data.data.length != 9) {
          // if (showAll)
          isEnd.current = true;
          // else
          //   isUploadedEnd.current = true;
        }
        Loader?.setLoader(false);
      })
      .catch((err) => {
        Loader?.setLoader(false);
        console.log(err);
      });
  }

  function getUploadedImages() {
    makeApiCall
      .get(`media?pindex=${p_index}&pageNo=1&pageSize=${uploadedImages.current.length}`)
      .then((res) => {
        const images = res.data.data.map((img: any) => ({
          id: img.id,
          image: img.image,
          url: img.url,
        }));
        setUploadedImgs(images);
        setSelectedImageIds([...selectedImageIds, ...images.map((img: any) => img.id)]);
        setSelectedImages([...selectedImages, ...images.map((img: any) => img.image)]);
        Loader?.setLoader(false);
      })
      .catch((err) => {
        Loader?.setLoader(false);
        console.log(err);
      });
  }

  function convertToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString()?.split(",")[1]);
      reader.onerror = (err) => {
        console.error(err);
        reject(err);
      }
    });
  }

  async function uploadImage(e: any) {
    const files: File[] = Array.from(e.target.files);
    if (files.length > 50)
      return showAlert("Maximum 50 images allowed at a time!");
    console.log("files", files)
    const size = files.reduce((acc, curr) => {
      acc = acc + curr.size
      return acc;
    }, 0);
    console.log("size", size);
    if (size > 30 * 1024 * 1024)
      return showAlert("The maximum total size of all the images can be 30MB only!");

    if (files) {
      // const reader = new FileReader();
      // let base64Image: any;
      // reader.onload = () => {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        // "image/svg+xml",
      ];
      if (!allowedTypes.includes(files[0].type)) {
        e.target.value = "";
        return showAlert("Unsupported file format");
      }
      // const base64Image = reader?.result?.toString().split(",")?.[1];
      const base64Images = await Promise.all(files.map((file) => convertToBase64(file)));

      makeApiCall
        .post("media", files.map((file: File, i) => ({
          // path: `${new Date().toISOString()}_${file.name}_${i}`,
          path: file.name,
          pindex: p_index,
          cindex: 0,
          gcindex: 0,
          image: base64Images[i],
        })))
        .then((res) => {
          isEnd.current = false;
          isUploadedEnd.current = false;
          res.data.datas.forEach((data: number) => uploadedImages.current.push(data));
          getAllImages(1);
          getUploadedImages();
          // setUploadFiles([]);
          e.target.value = "";
          setTab("1");
        })
        .catch((err) => console.log(err));
      // };
      // reader.readAsDataURL(files[0]);
    }
  }

  function handleCheckImage(checked: boolean, imgId: number, image: string) {
    if (checked && selectionMethod == "multi") {
      setSelectedImageIds([...selectedImageIds, imgId]);
      setSelectedImages([...selectedImages, image]);
    } else if (checked) {
      setSelectedImageIds([imgId]);
      setSelectedImages([image]);
    } else {
      setSelectedImageIds(selectedImageIds.filter((id) => id != imgId));
      setSelectedImages(selectedImages.filter((img) => img != image));
    }
  }

  // Function to handle scroll event
  const handleScroll = (e: any) => {
    console.log("scrolling");
    const scrollTop = e?.target.scrollTop;
    const scrollHeight = e?.target.scrollHeight;
    const clientHeight = e?.target.clientHeight;
    // Check if the user has scrolled to the bottom
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      clientHeight != scrollHeight && showAll
    ) {
      getAllImages(pageNo + 1);
    }
  };

  useEffect(() => {
    if (
      (showUploadModal && refreshOnOpen) ||
      (showUploadModal && allImages.length == 0)
    )
      getAllImages(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUploadModal]);
  console.log("allImages", allImages);


  async function uploadModelImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files: File[] = Array.from(e.target.files || []);
    if (!files.length) return;

    if (files.length > 50) {
      showAlert("Maximum 50 images allowed at a time!");
      e.target.value = "";
      return;
    }

    const size = files.reduce((acc, curr) => acc + curr.size, 0);
    if (size > 30 * 1024 * 1024) {
      showAlert("The maximum total size of all the images can be 30MB only!");
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
    if (!allowedTypes.includes(files[0].type)) {
      showAlert("Unsupported file format");
      e.target.value = "";
      return;
    }

    try {
      Loader?.setLoader(true);

      const base64Images = await Promise.all(
        files.map((file) => convertToBase64(file))
      );

      const payload = files.map((file, i) => ({
        path: file.name,
        pindex: p_index,
        cindex: 0,
        gcindex: 0,
        image: base64Images[i],
      }));

      const res = await makeApiCall.post("media", payload);

      // ✅ ONLY store inside Model tab
      const newModelImages = res.data.datas.map(
        (id: number, index: number) => ({
          id,
          image: base64Images[index],
        })
      );

      // 🟢 ADD THESE TWO LINES
      setSelectedModelImageIds((prev) => [
        ...res.data.datas,
        ...prev,
      ]);

      setModelImages((prev) => [...newModelImages, ...prev]);

      // 🔴 DO NOT CALL THESE
      // getAllImages()
      // getUploadedImages()
      // uploadedImages.current.push()
      // setTab("1")

      setTab("2"); // stay in Model tab
    } catch (err) {
      console.log(err);
    } finally {
      Loader?.setLoader(false);
      e.target.value = "";
    }
  }

  async function callVirtualTryOn(
    modelBase64: string,
    garmentBase64: string
  ) {
    const payload = {
      person_b64: modelBase64,
      garment_b64: garmentBase64,
      base_steps: 30,
      sample_count: 1,
      max_side: 1024,
      jpeg_quality: 90,
    };

    return makeApiCall.post("VirtualTryOn/Base64", payload);
  }

  console.log("virtualTryOnBase64", virtualTryOnBase64)

  async function uploadGeneratedImage(base64Image: string) {
    const payload = [{
      path: `sample.jpg`,
      pindex: p_index,
      cindex: 0,
      gcindex: 0,
      image: base64Image,
    }];

    const res = await makeApiCall.post("media", payload);

    return {
      imageId: res.data.datas[0], // backend returns array
      imageBase64: base64Image,
    };
  }
  return (
    <ModalComponent
      showModal={showUploadModal}
      setShowModal={setShowUploadModal}
      // onOk={() => {
      //   setShowUploadModal(false);
      //   if (handleAddImages) handleAddImages();
      // }}
      // onClose={closeMediaModal}
      onCloseModalCustom={() => {
        setShowUploadModal(false);
        setSelectedImageIds([]);
        setSelectedImages([]);
        if (closeMediaModal) closeMediaModal();
      }}
      footer={
        <Flex>
          {tab == "1" && <ButtonComponent
            onClickEvent={() => setShowAll(!showAll)}
          >{showAll ? "Show Uploaded" : "Show All"}</ButtonComponent>}
          <ButtonComponent
            type="primary"
            // MEDIA UPLOAD FOR "NORMAL"
            onClickEvent={() => {
              setShowUploadModal(false);
              setSelectedImageIds([]);
              setSelectedImages([]);
              if (handleAddImages)
                handleAddImages(selectedImageIds, selectedImages);
            }}

            // MEDIA UPLOAD FOR "AI"
            // onClickEvent={async () => {
            //   try {
            //     Loader?.setLoader(true);

            //     let finalImageIds: number[] = [];
            //     let finalImageBase64: string[] = [];

            //     // 🔹 CASE: Multiple Model + Multiple Garment selected
            //     if (
            //       selectedModelImageIds.length > 0 &&
            //       selectedImageIds.length > 0
            //     ) {
            //       const modelImgs = modelImages.filter((m) =>
            //         selectedModelImageIds.includes(m.id)
            //       );

            //       const garmentImgsBase64 = selectedImages;

            //       // Array to hold API call promises
            //       const tryOnPromises: any = [];

            //       // Iterate over each selected model and garment
            //       modelImgs.forEach((modelImg) => {
            //         garmentImgsBase64.forEach((garmentImgBase64) => {
            //           // 1️⃣ For each model & garment combination, call the VirtualTryOn API
            //           const tryOnCall = callVirtualTryOn(modelImg.image, garmentImgBase64)
            //             .then((res) => {
            //               // After successful API call, save the result (b64 image)
            //               const generatedBase64 = res.data.data.result_image_b64;

            //               // 2️⃣ Upload generated image to media
            //               return uploadGeneratedImage(generatedBase64).then((uploaded) => {
            //                 // 3️⃣ Store the generated image ID and base64
            //                 finalImageIds.push(uploaded.imageId);
            //                 finalImageBase64.push(uploaded.imageBase64);
            //               });
            //             })
            //             .catch((err) => console.error("Error in VirtualTryOn API", err));

            //           // Store each promise
            //           tryOnPromises.push(tryOnCall);
            //         });
            //       });

            //       // Wait for all API calls to complete
            //       await Promise.all(tryOnPromises);
            //     }

            //     // 🔹 EXISTING FLOW (unchanged)
            //     if (handleAddImages) {
            //       handleAddImages(finalImageIds, finalImageBase64);
            //     }

            //     // Reset the form and modal
            //     setShowUploadModal(false);
            //     setSelectedImageIds([]);
            //     setSelectedImages([]);
            //     setSelectedModelImageIds([]);

            //   } catch (err) {
            //     console.error("Virtual try-on failed", err);
            //   } finally {
            //     Loader?.setLoader(false);
            //   }
            // }}

            style={{ marginLeft: "auto" }}
          >
            Done
          </ButtonComponent>
        </Flex>
      }
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
                  name="image_upload"
                  type="file"
                  multiple
                  accept="image/png, image/jpg, image/jpeg, image/gif"
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
                gap={16}
                justify="space-between"
                wrap="wrap"
                className={`${styles.imageContainer} custom-scroll`}
                onScroll={handleScroll}
              >
                {showAll && allImages.map((img, index) => {
                  const imgage = (
                    <ImageComponent
                      key={img.id}
                      width={128}
                      height={128}
                      style={{ cursor: "pointer" }}
                      imgData={img.image}
                      altSrc="/assets/thumbnail.png"
                      onClick={() =>
                        handleCheckImage(
                          !selectedImageIds.includes(img.id),
                          img.id,
                          img.image
                        )
                      }
                    />
                  );
                  // console.log("imgage", index, imgage);
                  // if (!img.image) return null;
                  return (
                    <div key={img.id} style={{ position: "relative" }}>
                      <Checkbox
                        className={styles.placeTopRight}
                        checked={selectedImageIds.includes(img.id)}
                        onChange={(e) =>
                          handleCheckImage(e.target.checked, img.id, img.image)
                        }
                        disabled={!img.image}
                      />
                      {imgage}
                    </div>
                  );
                })}
                {!showAll && (uploadedImgs.length > 0 ? uploadedImgs.map((img, index) => {
                  const imgage = (
                    <ImageComponent
                      key={img.id}
                      width={128}
                      height={128}
                      style={{ cursor: "pointer" }}
                      imgData={img.image}
                      altSrc="/assets/thumbnail.png"
                      onClick={() =>
                        handleCheckImage(
                          !selectedImageIds.includes(img.id),
                          img.id,
                          img.image
                        )
                      }
                    />
                  );
                  // console.log("imgage", index, imgage);
                  // if (!img.image) return null;
                  return (
                    <div key={img.id} style={{ position: "relative" }}>
                      <Checkbox
                        className={styles.placeTopRight}
                        checked={selectedImageIds.includes(img.id)}
                        onChange={(e) =>
                          handleCheckImage(e.target.checked, img.id, img.image)
                        }
                        disabled={!img.image}
                      />
                      {imgage}
                    </div>
                  );
                }) : <p style={{ color: "gray" }}>You not uploaded anything...</p>)}
              </Flex>
            ),
          },
          // {
          //   label: "Model",
          //   key: "2",
          //   children: (
          //     <>
          //       <input
          //         type="file"
          //         multiple
          //         accept="image/png, image/jpg, image/jpeg, image/gif"
          //         onChange={(e) => uploadModelImage(e)}
          //       />

          //       <Flex gap={16} wrap="wrap" style={{ marginTop: 16 }}>
          //         {modelImages.length > 0 ? (
          //           modelImages.map((img) => (
          //             <div key={img.id} style={{ position: "relative" }}>
          //               <Checkbox
          //                 className={styles.placeTopRight}
          //                 checked={selectedModelImageIds.includes(img.id)}
          //                 onChange={(e) => {
          //                   if (e.target.checked) {
          //                     setSelectedModelImageIds((prev) => [...prev, img.id]);
          //                   } else {
          //                     setSelectedModelImageIds((prev) =>
          //                       prev.filter((id) => id !== img.id)
          //                     );
          //                   }
          //                 }}
          //               />

          //               <ImageComponent
          //                 width={128}
          //                 height={128}
          //                 imgData={img.image}
          //                 altSrc="/assets/thumbnail.png"
          //               />
          //             </div>
          //           ))
          //         ) : (
          //           <p style={{ color: "gray" }}>No model images uploaded yet</p>
          //         )}
          //       </Flex>

          //     </>
          //   ),
          // }

        ]}
      />
    </ModalComponent>
  );
});

interface ImageComponentProps {
  src?: string;
  imgData?: string;
  altSrc?: string;
  altImgData?: string;
  alt?: string;
  className?: string;
  width: number;
  height: number;
  style?: Object;
  onClick?: Function;
  imageId?: number;
}

export function ImageComponent({
  src,
  imgData,
  altSrc,
  altImgData,
  alt,
  className,
  width,
  height,
  style,
  onClick,
  imageId,
}: ImageComponentProps) {
  const [apiImgData, setApiImgData] = useState<string>("");
  const finalSrc: string = useMemo(() => {
    if (src) return src;
    else if (apiImgData)
      return `data:image/${detectFileType(apiImgData)};base64,${apiImgData}`;
    else if (imgData)
      return `data:image/${detectFileType(imgData)};base64,${imgData}`;
    else if (altSrc) return altSrc;
    else if (altImgData)
      return `data:image/${detectFileType(altImgData)};base64,${altImgData}`;
    else return "";
  }, [src, apiImgData, imgData, altSrc, altImgData]);
  useEffect(() => {
    if (imageId)
      makeApiCall
        .get(`media/${imageId}`)
        .then((res) => {
          // Loader?.setLoader(false);
          setApiImgData(res.data.data.image);
        })
        .catch((err) => {
          // Loader?.setLoader(false);
          console.log(err);
        });
  }, [imageId]);
  // console.log(
  //   "imgData123",
  //   imgData,
  //   src,
  //   altSrc,
  //   altImgData,
  //   alt,
  //   !imgData && !src && !altSrc && !altImgData && !alt
  // );
  if (!imgData && !src && !altSrc && !altImgData && !alt) return null;
  return (
    <NextImage
      // src={src ?? `data:image/${detectFileType(imgData)};base64,${imgData}`}
      src={finalSrc}
      alt={alt ?? "-"}
      className={className}
      width={width}
      height={height}
      unoptimized={true}
      unselectable="on"
      priority={true}
      placeholder="blur"
      blurDataURL={"Hello"}
      onClick={() => (onClick ? onClick() : null)}
      style={style}
    />
  );
}

export default MediaUpload;

function detectFileType(base64String: string | undefined) {
  if (!base64String) return base64String;
  // Decode base64
  const binaryString = atob(base64String);

  // Convert binary string to byte array
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert first few bytes to hex
  const hexSignature = bytes
    .slice(0, 4)
    .map((b: any) => b.toString(16).padStart(2, "0"))
    .join(" ");

  // Known file signatures (magic numbers)
  const signatures = {
    "89 50 4e 47": "png",
    "ff d8 ff": "jpeg",
    "47 49 46 38": "gif",
    "25 50 44 46": "PDF",
    "50 4b 03 04": "ZIP",
    "66 74 79 70": "MP4",
  };

  // Match signature
  for (const [signature, fileType] of Object.entries(signatures)) {
    if (hexSignature.startsWith(signature)) {
      return fileType;
    }
  }

  // Check for text-based formats
  if (binaryString.includes("<svg")) return "svg+xml";

  return undefined;
}
