import React, { useEffect, useState } from "react";
import { Col, Flex, Modal, Row, Space } from "antd";
import styles from "./PrintBarcodeModal.module.css";
import InputNumberComponent from "@/components/InputComponent/InputNumberComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent";
import PrintConfirmModal from "./PrintConfirmModal";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import { useUserStore } from "@/store/userInfo/store";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import { showAlert } from "@/lib/helpers/alert";
import { convertBlobToBase64 } from "@/lib/helpers/utilityHelpers";
import ModalComponent from "../ModalComponent";
import { getBranchIdByHeader } from "@/lib/helpers/getCookiesClient";
import usePrintStore from "@/store/print/store";
import { t } from "i18next";

export default function PrintLayoutModal(props: any) {
  const {
    printList,
    openModal,
    onClose,
    setShowModal,
    onPrintConfirm,
    selectedRowKeys,
    printer,
    type = "CM",
    printLayoutRef,
    setDefaultRef,
    selectPrinterRef,
    printPreviewRef,
    printModelRef,
    type2,
    p_index,
    c_index,
    gc_index,
    columnData,
    setSelectedRowKeys,
  } = props;
  console.log("type2", type2);

  const userDetails = useUserStore((state: any) => JSON.parse(state?.user));
  // const [selectedPrint, setSelectedPrint] = useState<any>(null);
  const { selectedPrint, setSelectedPrint } = usePrintStore();
  console.log("selectedPrint", selectedPrint);

  const { selectPrinter, setSelectPrinter } = usePrintStore();
  const [printerList, setPrinterList] = useState<any[]>([]);
  const [printList2, setPrintList2] = useState<any[]>(printList ?? []);
  console.log("printList2", printList2);

  const [defaultCheckbox, setDefaultCheckbox] = useState<boolean>(false);
  const [defaultCheckbox2, setDefaultCheckbox2] = useState<boolean>(false);

  const getLocalIPAddress = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const peerConnection = new RTCPeerConnection();
      const noop = () => { };
      const localIPs = new Set<string>();

      peerConnection.createDataChannel("");
      peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .catch(reject);

      peerConnection.onicecandidate = (event) => {
        if (event && event.candidate && event.candidate.candidate) {
          const parts = event.candidate.candidate.split(" ");
          const ip = parts[4];
          if (!localIPs.has(ip)) {
            localIPs.add(ip);
            resolve(ip); // Resolve with the first IP found
          }
        }
      };

      setTimeout(() => {
        if (localIPs.size === 0) {
          reject("Could not fetch local IP address");
        }
      }, 5000); // Timeout after 5 seconds
    });
  };
  useEffect(() => {
    if (!openModal) {
      setSelectedPrint(null);
      setSelectPrinter(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  useEffect(() => {
    const handlePrinter = async () => {
      const serviceBaseUrl = `http://127.0.0.1:5001/`;
      const serviceUrl = `${serviceBaseUrl}api/print/getprinters`;

      await makeApiCall
        .get(serviceUrl)
        .then((response) => {
          console.log("response", response);
          if (response?.status === 200) {
            const { data } = response?.data;
            setPrinterList(data);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
    handlePrinter();
  }, []);

  useEffect(() => {
    setPrintList2(printList);
  }, [printList]);

  useEffect(() => {
    const findData =
      printList2.length > 0
        ? printList2.find((val) => val.printer)
        : printList.find((val: any) => val.printer);
    setSelectPrinter(findData ? findData?.printer : printerList?.[0]);
  }, [printList2, printList, openModal]);

  useEffect(() => {
    if (
      openModal &&
      printList &&
      printList.length > 0
      // &&
      // (type === "PRINTBARCODE" || (type2 && type2 === "PB"))
    ) {
      const data =
        printList2.length > 0
          ? printList2.find((val: any) => val.is_default)
          : printList.find((val: any) => val.is_default);
      console.log("data", data);
      setDefaultCheckbox(data?.is_default);
      setDefaultCheckbox2(data?.is_default);
      setSelectedPrint({ ...data, value: data?.id });
    }
  }, [printList, openModal]);

  const fetchData = async (value: boolean) => {
    console.log("innn");

    if (
      (type === "PRINTBARCODE" || (type2 && type2 === "PB")) &&
      selectedPrint?.value
    ) {
      try {
        setDefaultCheckbox(value);
        const response = await makeApiCall.post("PostSavePrintDefault", {
          id: selectedPrint?.value,
          layout: selectedPrint?.display_name ?? selectedPrint?.label,
          default_value: value,
          default_printer: selectPrinter,
        });
        const respon = await makeApiCall.post(`GetPrintListForSelectedForm`, {
          p_index: 2,
          c_index: 5,
          gc_index: 0,
        });
        setPrintList2(respon.data.data);
        console.log("response", response);
      } catch (err) {
        console.log("err", err);
      }
    }
  };

  const fetchData2 = async (value: boolean) => {
    console.log("innn");
    if (
      (type !== "PRINTBARCODE" || (type2 && type2 !== "PB")) &&
      selectedPrint?.value
    ) {
      try {
        setDefaultCheckbox2(value);
        const response = await makeApiCall.post("PostSavePrintDefault2", {
          id: selectedPrint?.value,
          layout: selectedPrint?.display_name ?? selectedPrint?.label,
          default_value: value,
          default_printer: selectPrinter,
          p_index: p_index,
          c_index: c_index,
          gc_index: gc_index,
        });
        // const respon = await makeApiCall.post(`GetPrintListForSelectedForm`, {
        //   p_index: 2,
        //   c_index: 5,
        //   gc_index: 0,
        // });
        // setPrintList2(respon.data.data);
        console.log("response", response);
      } catch (err) {
        console.log("err", err);
      }
    }
  };
  // useEffect(() => {
  //   if (selectedPrint) fetchData(defaultCheckbox);
  // }, [selectedPrint]);

  console.log("setSelectedPrint", selectedPrint);
  const handlePrint = async () => {
    const localIPAddress = await getLocalIPAddress();

    const endPoint = `GetSelectedInvoicePrintData`;
    const payLoad = {
      P_INDEX: p_index,
      C_INDEX: c_index,
      GC_INDEX: gc_index,
      type: type,
      // invoice_id: type === "SalesMan" ? 0 : normalizeInvoiceValue(selectedRowKeys),

      print_id: selectedPrint?.value,
      invoice_no:
        type === "SalesMan"
          ? normalizeInvoiceValue(selectedRowKeys)
          : `${localIPAddress}-${getBranchIdByHeader("userName")}`,
      invoice_date: "",
      call_from_list: true,
    };
    makeApiCall
      .post(endPoint, payLoad)
      // .post(endPoint, payLoad, { responseType: "blob" })
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.status === 200) {
          const { data } = response?.data;
          console.log("selectedPrint2", selectedPrint);

          _callPrinter(data);
        } else {
          showAlert("No file to print");
        }
      })
      .catch((error) => {
        console.log("error", error);
        showAlert("No file to print");
      })
      .finally(() => {
        setSelectedPrint(null);
        setSelectPrinter(null);
        onPrintConfirm();
      });
  };

  const normalizeInvoiceValue = (value: { map: (arg0: (item: any) => any) => any[]; id: any; invoice_id: any; value: any; }) => {
    if (!value) return null;

    // Array of objects → extract id or value
    if (Array.isArray(value)) {
      return value
        .map(item => {
          if (typeof item === "object" && item !== null) {
            return item.id ?? item.invoice_id ?? item.value ?? null;
          }
          return item;
        })
        .filter(x => x !== null && x !== undefined)
        .join(",");
    }

    // Single object
    if (typeof value === "object") {
      return value.id ?? value.invoice_id ?? value.value ?? null;
    }

    // Primitive (string/number)
    return value;
  };

  const _callPrinter = (response: any) => {

    const finalData = response?.map((item: any) => {
      const value = columnData?.find((val: any) => val?.key === item?.id);
      console.log("value123", value);
      return value ? new Array(value?.qty).fill(item) : [];
    }).flat();

    const serviceBaseUrl = `http://127.0.0.1:5001/`;
    const serviceUrl = `${serviceBaseUrl}api/print/invoiceprint`;
    const payload = {
      type: type,
      data: type == "SalesMan" ? finalData : response,
      fileName: selectedPrint?.display_name ?? selectedPrint?.label,
      printerName: selectPrinter,
    };
    console.log("payload", payload);
    console.log("selectedPrint", selectedPrint);
    makeApiCall
      .post(serviceUrl, payload)
      .then((response) => {
        console.log("response", response);
        if (response?.status === 200) {
          // onClear();
          setSelectedRowKeys([])
        }
      })
      .catch((error) => {
        console.log("error", error);
        showAlert("something went worng")
        setSelectedRowKeys([])
      });
  };
  // Helper function to display PDF
  const displayPdf = (blobUrl: any) => {
    // Display PDF in a modal or open in a new tab based on preference
    const existingIframe: any = document.getElementById("pdf-viewer");
    if (existingIframe) {
      existingIframe.src = blobUrl; // Reuse iframe if exists
    } else {
      const iframe = document.createElement("iframe");
      iframe.id = "pdf-viewer";
      iframe.src = blobUrl;
      iframe.style.width = "100%";
      iframe.style.height = "600px";
      document.body.appendChild(iframe);
    }
  };

  const handlePrintReview = async () => {
    console.log("selectedRowKeys123", selectedRowKeys);
    const localIPAddress = await getLocalIPAddress();
    const { accessPrivilegeList } = userDetails;
    const currentForm = "Print Barcode";
    const selectedForm = accessPrivilegeList.filter(
      (item: any) => item.form_name === currentForm
    );
    console.log("p_index", p_index, c_index, gc_index);
    const endPoint = `GetSelectedInvoicePrint`;
    const payLoad = {
      P_INDEX: p_index,
      C_INDEX: c_index,
      GC_INDEX: gc_index,
      // P_INDEX: selectedForm?.[0]?.p_index,
      // C_INDEX: selectedForm?.[0]?.c_index,
      // GC_INDEX: selectedForm?.[0]?.gc_index,
      type: type,
      print_id: selectedPrint?.value,
      invoice_id: normalizeInvoiceValue(selectedRowKeys),

      invoice_no: `${localIPAddress}-${getBranchIdByHeader("userName")}`,
      invoice_date: "",
      call_from_list: true,
    };

    makeApiCall
      .post(endPoint, payLoad, { responseType: "blob" })
      .then((response) => {
        if (response.status === 200) {
          // Create a blob URL for the PDF
          const pdfBlob = new Blob([response.data], {
            type: "application/pdf",
          });
          const blobUrl = URL.createObjectURL(pdfBlob);

          // // Option 1: Display in an iframe or embed it in a modal
          // const iframe = document.createElement("iframe");
          // iframe.src = blobUrl;
          // iframe.width = "100%";
          // iframe.height = "600px";
          // document.body.appendChild(iframe);

          // Option 2: Open in a new tab
          window.open(blobUrl);

          // Clean up the blob URL when done
          URL.revokeObjectURL(blobUrl);
        } else {
          showAlert("No File To Print");
        }
      })
      .catch((error) => {
        console.log("error", error);
        showAlert("No File To Print");
      })
      .finally(() => {
        onPrintConfirm();
      });
  };
  const handleClose = () => {
    setShowModal(false);
  };
  console.log("type", type);
  console.log('setDefaultRef', setDefaultRef)
  return (
    <ModalComponent
      showModal={openModal}
      setShowModal={setShowModal}
      closeIcon={false}
      footer={null}
      width={360}
      className="custom-modal-global"
      centered={true}
      style={{ zIndex: 9999 }}
      onClose={onClose}
      onCloseModalCustom={onClose}
    >
      <Flex vertical gap={24}>
        <Flex vertical gap={5}>
          <p className={styles.header}>{t("Print Sent")}</p>
          {/* <p className={styles.alignCenter}>Your Print Sent Succcessfully</p> */}
        </Flex>
        <Row gutter={[4, 0]}>
          <Col span={13}>
            <Flex vertical={true} gap={12} ref={printLayoutRef}>
              <SelectComponent
                label={t("Print Layout")}
                placeholder="select"
                value={selectedPrint?.value}
                // allowClear={true}
                options={
                  printList2.length > 0
                    ? printList2.map((data: any) => ({
                      label: data?.display_name,
                      value: data?.id,
                      // value: data?.display_name,
                    }))
                    : printList.map((data: any) => ({
                      label: data?.display_name,
                      value: data?.id,
                      // value: data?.display_name,
                    }))
                }
                onChange={(val: any, label: any) => {
                  setSelectedPrint(label);
                  setDefaultCheckbox(false);
                  setDefaultCheckbox2(false);
                }}
              />
            </Flex>
          </Col>
          {/* <Col span={8} >
            <Flex align="center" gap={13} ref={setDefaultRef} style={{ marginTop: 33, fontSize: 14 }}>
              <CheckboxComponent />
              <span>{t("Set Default")}</span>
            </Flex>
          </Col> */}
          <Col span={2}>
            <Flex vertical={true} gap={12} ref={setDefaultRef}>
              <label className={styles.hide}>hi</label>
              {type === "PRINTBARCODE" || (type2 && type2 === "PB") ? (
                <CheckboxComponent
                  checked={defaultCheckbox}
                  onChange={(e) => {
                    if (e.target.checked && !selectedPrint?.value) {
                      Modal.success({
                        title: "Alert",
                        content: "Select Print Layout",

                        cancelButtonProps: { style: { display: "none" } },
                        onOk: () => {
                          // Do something when user clicks OK
                        },
                      });
                      return;
                    }
                    fetchData(e.target.checked);
                  }}
                />
              ) : (
                <CheckboxComponent
                  checked={defaultCheckbox2}
                  onChange={(e) => {
                    if (e.target.checked && !selectedPrint?.value) {
                      Modal.success({
                        title: "Alert",
                        content: "Select Print Layout",

                        cancelButtonProps: { style: { display: "none" } },
                        onOk: () => {
                          // Do something when user clicks OK
                        },
                      });
                      return;
                    }
                    fetchData2(e.target.checked);
                  }}
                />
              )}
            </Flex>
          </Col>
          <Col span={8} >
            <Flex align="center" gap={13} ref={setDefaultRef} style={{ marginTop: 33, fontSize: 14 }}>
              {/* <CheckboxComponent /> */}
              <span>{t("Set Default")}</span>
            </Flex>
          </Col>
          {/* <div ref={setDefaultRef}>
            <Col span={2}>
              <Flex vertical={true} gap={12}>
                <label className={styles.hide}>hi</label>
                <CheckboxComponent />
              </Flex>
            </Col>
            <Col span={8} >
              <Flex vertical={true} gap={12}>
                <label className={styles.hide}>hi</label>
                <p>{t("Set Default")}</p>
              </Flex>
            </Col>
          </div> */}
        </Row>



        {/* {type == "PRINTBARCODE" && ( */}
        < Row gutter={[3, 0]} >
          <Col span={13} ref={selectPrinterRef}>
            <Flex vertical={true} gap={5}>
              <SelectComponent
                label={t("Select Printer")}
                placeholder="select"
                // style={{ width: "120%" }}
                value={selectPrinter}
                // allowClear={true}
                options={printerList?.map((data: any) => {
                  return {
                    label: data,
                    value: data,
                    // value: data?.display_name,
                  };
                })}
                onChange={(data: any) => {
                  setSelectPrinter(data);
                  setDefaultCheckbox(false);
                  setDefaultCheckbox2(false);
                }}
              />
            </Flex>
          </Col>
        </Row >
        {/* )} */}

        < div className={styles.groupButton}>
          <ButtonComponent
            type="default"
            // style={{ padding: "10px 50px", marginRight: -20 }}
            className={styles.noButton}
            onClickEvent={handlePrintReview}
          >
            <div ref={printPreviewRef}>{t("Print Preview")}</div>
          </ButtonComponent>
          <ButtonComponent
            type="primary"
            className={styles.noButton}
            // style={{ padding: "10px 50px", marginRight: -15 }}
            onClickEvent={handlePrint}
          >
            <div ref={printModelRef}> {t("Print")}</div>
          </ButtonComponent>
        </div >
      </Flex >
    </ModalComponent >
  );
}
