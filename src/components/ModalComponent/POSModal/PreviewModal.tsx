import React, { useMemo } from "react";
import { Button, Col, Modal, Row, Image, Flex } from "antd";
// import cssStyles from "@/app/dashboard/(retail)/retail-pos/PosLayout.module.css";
import cssStyles from "./previewmodal.module.css";
import { Trash2 } from "@/components/Svg/Trash";
import PosStyles from "@/app/dashboard/(retail)/retail-pos/PosStyles";
import { Print } from "@/components/Svg/Print";
import { CloseIcon } from "@/components/Svg/CloseIcon";
import { applyDecimal, getUserDetails } from "@/lib/helpers/utilityHelpers";
import TableComponent from "@/components/TableComponent/TableComponent";
import { ImageComponent } from "@/app/_components/retailPos/catalogue/ImageComponent";

const PreviewModal = ({ visible, onClose, data, width }: any) => {
  const { styles } = PosStyles.useStyle();
  const loggedUser = getUserDetails();
  console.log("datadata", data);
  const tableData: any[] =
    //  useMemo(() => {
    //   return
    data?.customization?.reduce((acc: any, curr: any) => {
      const names = curr.styleName.split(",");
      const costs = curr.styleCost.split(",");
      const datum = curr.images.map((img: any, index: number) => ({
        designName: curr.designName,
        styleName: names[index],
        styleCost: costs[index],
        image: img,
      }));
      acc = [...acc, ...datum];
      return acc;
    }, []);
  // }, [data?.customization]);

  const columns: any[] = [
    {
      title: "Style",
      dataIndex: "styleName",
      key: "styleName",
      render: (text: string, record: any) => {
        return (
          <Flex gap={8} align="center">
            <div>
              <ImageComponent
                imgData={record.image?.[0]?.image}
                altSrc="/assets/Shirt.svg"
                width={70}
                height={70}
              />
            </div>
            <div>{text + " " + record.designName}</div>
          </Flex>
        );
      },
    },
    {
      title: "Cost",
      dataIndex: "styleCost",
      key: "styleCost",
      render: (text: string) => loggedUser.symbol + text,
    },
  ];
  console.log("tableData", tableData);

  return (
    <Modal
      open={visible}
      closeIcon={false}
      footer={null}
      centered={true}
      width={width}
      className={styles.customModal}
    >
      <div
        className={`${cssStyles.modalContent}`}
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside it
      >
        <button className={cssStyles.closeButton} onClick={onClose}>
          <CloseIcon />
        </button>
        <div className={cssStyles.modalBody}>
          <div className={cssStyles.previewContainer}>
            <div style={{ flexShrink: 0 }}>
              <ImageComponent
                style={{ objectFit: "cover", borderRadius: "10px" }}
                width={400}
                height={400}
                preview={false}
                alt="Preview Image"
                altSrc="/assets/thumbnail.png"
                imgData={data?.image?.[0]?.image}
                // fallback="https://via.placeholder.com/150"
              />
            </div>
            <div className={cssStyles.previewDetail + " custom-scroll"}>
              <div className={cssStyles.productName}>{data?.productName}</div>
              {/* <div className={cssStyles.itemPrice}>
                {loggedUser.symbol}
                {applyDecimal(data?.salePrice)} Inc. of all taxes
              </div> */}
              <Flex justify="space-between">
                <h3>{data?.serviceName}</h3>
                {data?.serviceCost && (
                  <span>
                    {loggedUser.symbol + applyDecimal(data?.serviceCost)}
                  </span>
                )}
              </Flex>
              {/* <TableComponent
                columns={columns}
                dataSource={tableData || []}
                pagination={false}
              size="small"
              /> */}

              {data?.components
                ?.filter(
                  (comp: any) =>
                    comp.mainfabric == "yes" || comp.secondaryFabric
                )
                .map((comp: any) => (
                  // {data.components?.[0] && (
                  <Flex justify="space-between" align="center">
                    <Flex gap={8} align="center">
                      <div>
                        <ImageComponent
                          imgData={comp?.image?.[0]?.image}
                          altSrc="/assets/thumbnail.png"
                          width={70}
                          height={60}
                          style={{ borderRadius: 8 }}
                        />
                      </div>
                      <div>{comp?.componentName}</div>
                    </Flex>
                    <span>{loggedUser.symbol + applyDecimal(comp?.rate)}</span>
                  </Flex>
                  // )}
                ))}

              {tableData?.map((row: any) => (
                <Flex justify="space-between" align="center">
                  <Flex gap={8} align="center">
                    <div>
                      <ImageComponent
                        imgData={row.image?.[0]?.image}
                        altSrc="/assets/Shirt.svg"
                        width={70}
                        height={70}
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div>{row.styleName + " " + row.designName}</div>
                  </Flex>
                  <span>{loggedUser.symbol + applyDecimal(row.styleCost)}</span>
                </Flex>
              ))}
              {/* <hr /> */}
              <Flex justify="space-between" align="center">
                <h3>Total</h3>
                <h3>
                  {loggedUser.symbol}
                  {applyDecimal(data?.salePrice)}
                </h3>
              </Flex>
              {/* <div className={cssStyles.itemDetail}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    gap: 6,
                  }}
                >
                  <p>Selected Size : 32</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    gap: 6,
                  }}
                >
                  <p>Selected Collor :</p>
                  {"  "}
                  <Image
                    width={100}
                    height={100}
                    preview={false}
                    style={{ borderRadius: "10px" }}
                    src="https://cdn.shopify.com/s/files/1/0981/8178/files/shirt-collar-edge-diagram.jpg?10144095463446111105"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    gap: 6,
                  }}
                >
                  <p>Selected Button :</p>
                  {"  "}
                  <Image
                    width={100}
                    height={100}
                    preview={false}
                    style={{ borderRadius: "10px" }}
                    src="https://static.thenounproject.com/png/2524731-200.png"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    gap: 6,
                  }}
                >
                  <p>Selected Placket :</p>
                  <Image
                    width={100}
                    height={100}
                    preview={false}
                    style={{ borderRadius: "10px" }}
                    src="https://d1fufvy4xao6k9.cloudfront.net/images/blog/posts/2020/11/aquarelle_front_placket.jpg"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewModal;
