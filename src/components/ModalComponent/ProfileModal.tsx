import React from "react";
import { Flex, Modal, Upload, Button, UploadFile } from "antd";
import styles from "./ModalComponent.module.css";
import CancelButton from "../ButtonComponent/CancelButton";
import { DeleteOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";

interface ConfirmModalProps {
  openModal: boolean;
  setOpenModal?: Function;
  avatarImage: string | null;
  setAvatarImage?: Function;
  onRemove?: React.MouseEventHandler<HTMLElement>;
  onClose: React.MouseEventHandler<HTMLElement>;
  onCancel: React.MouseEventHandler<HTMLElement>;
  onUpload: (file: UploadFile<string | Blob | RcFile>) => void; // New prop for handling photo upload
}

export default function ConfirmModal({
  openModal,
  onClose,
  onUpload,
  onRemove,
  avatarImage,
  setAvatarImage,
}: ConfirmModalProps) {

  function fileToUploadFile(file: File): UploadFile<RcFile> {
    return {
      uid: String(Date.now()),
      name: file.name,
      status: "done",
      type: file.type,
      size: file.size,
      originFileObj: file as RcFile,
    };
  }
  function openCameraAndPick(onOk: (base64DataUrl: string) => void | Promise<void>) {
    let stream: MediaStream | null = null;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,.92);
      display:flex; align-items:center; justify-content:center; z-index:99999; color:#fff;
    `;

    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex; flex-direction:column; gap:12px; align-items:center;";

    const video = document.createElement("video");
    video.autoplay = true; video.playsInline = true; video.muted = true;
    video.style.cssText = "max-width:90vw; max-height:70vh; border-radius:10px;";

    const img = new Image();
    img.style.cssText = "max-width:90vw; max-height:70vh; border-radius:10px; display:none;";

    const row = document.createElement("div");
    row.style.cssText = "display:flex; gap:10px;";

    const captureBtn = document.createElement("button");
    captureBtn.textContent = "Capture";
    captureBtn.style.cssText = baseBtn(true);

    const okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.style.cssText = baseBtn(true);
    okBtn.style.display = "none";

    const retakeBtn = document.createElement("button");
    retakeBtn.textContent = "Retake";
    retakeBtn.style.cssText = baseBtn(false);
    retakeBtn.style.display = "none";

    row.appendChild(captureBtn);
    row.appendChild(retakeBtn);
    row.appendChild(okBtn);
    wrap.appendChild(video);
    wrap.appendChild(img);
    wrap.appendChild(row);
    overlay.appendChild(wrap);
    document.body.appendChild(overlay);

    const stop = () => {
      stream?.getTracks().forEach(t => t.stop());
      stream = null;
      document.removeEventListener("keydown", onEsc);
      overlay.remove();
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") stop(); };
    document.addEventListener("keydown", onEsc);

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        await video.play();
      } catch {
        alert("Camera not available / permission denied.");
        stop();
      }
    })();

    captureBtn.onclick = () => {
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92); // "data:image/jpeg;base64,...."

      img.src = dataUrl;
      img.style.display = "block";
      video.style.display = "none";
      captureBtn.style.display = "none";
      okBtn.style.display = "inline-block";
      retakeBtn.style.display = "inline-block";

      okBtn.onclick = async () => {
        try {
          await onOk(dataUrl);
        } finally {
          stop();
        }
      };
    };

    function baseBtn(primary: boolean) {
      return `
        padding:8px 14px; border-radius:8px; border:${primary ? "none" : "1px solid #aaa"};
        background:${primary ? "#1677ff" : "#222"}; color:#fff; cursor:pointer; font-size:14px;
      `;
    }
  }
  async function dataUrlToFile(dataUrl: string, fileName = "avatar.jpg"): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type || "image/jpeg" });
  }
  return (
    <Modal
      open={openModal}
      closeIcon={false}
      footer={null}
      width={250}
      className="custom-modal-global"
      centered={true}
      style={{ zIndex: 9999 }}
    >
      <div
        style={{
          transition: "opacity 0.1s",
          position: "absolute",
          right: "86%",
          top: "34px",
        }}
      >
        <CancelButton buttonLabel="Cancel" onClick={onClose} />
      </div>
      <Flex vertical gap={24} justify="center" align="center">
        <Flex vertical gap={2} align="center">
          <p className={styles.alignCenter}>
            {avatarImage ? "Edit Picture" : "Add Picture"}
          </p>
        </Flex>
        <>
          <div className={styles.groupButton}>

            <Button type="default" onClick={() =>
              openCameraAndPick(
                // MAKE THIS ASYNC
                async (dataUrl) => {
                  setAvatarImage?.(dataUrl);
                  const file = await dataUrlToFile(dataUrl, "avatar.jpg"); // <- uses await
                  const up = fileToUploadFile(file);
                  onUpload(up);
                }
              )
            }>Take</Button>
            <Upload
              customRequest={({ file }: any) => onUpload(file)}
              showUploadList={false}
            >
              <Button type="primary">Upload</Button>
            </Upload>
          </div>
          {avatarImage ? (
            <Button danger onClick={onRemove} className={styles.removeBtn}>
              Remove <DeleteOutlined />
            </Button>
          ) : (
            ""
          )}
        </>
      </Flex>
    </Modal>
  );
}
