"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import styles from "./chatbot.module.css";
import {
  BookOutlined,
  BookTwoTone,
  CloseOutlined,
  LeftOutlined,
  MessageTwoTone,
  SwitcherTwoTone,
  VideoCameraTwoTone,
  WechatWorkOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import {
  getBranchIdByHeader,
  getCompanyDetails,
} from "@/lib/helpers/getCookiesClient";

const Chatbot = ({
  openChatBot,
  setOpenChatBot,
}: {
  openChatBot: boolean;
  setOpenChatBot: (fact: boolean) => void;
}) => {
  const [userInput, setUserInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Hello! I am iCube Report Bot. Type 'Report' to start the Convo.",
    },
  ]);
  const [tab, setTab] = useState<number>(-1);
  const draggable = useRef<any>(null);
  const chatSpaceRef = useRef<any>(null);
  const sessionId = useMemo(() => Math.floor(Math.random() * 100000), []); // Unique session identifier
  const projectId = "i-show-reports-sbfa"; // Replace with your Google Cloud project ID
  useEffect(() => {
    // const cookie = Cookies.get("token");
    // fetch(`${BASE_URL}/GetDialogueFlowToken`, {
    //   headers: {
    //     Authorization: `Bearer ${cookie}`,
    //   },
    // })
    //   .then((res) => {
    //     if (res.ok)
    //       return res
    //         .json()
    //         .then((res) => {
    //           console.log("res", res);
    //           setAccessToken(res.data);
    //         })
    //         .catch((err) => console.log(err));
    //     else throw new Error("issue" + res.status);
    //   })
    //   .catch((err) => console.log(err));
    // .then((data) => {
    //   console.log(data);
    //   //setPhotos(data);
    // });
    makeApiCall
      .get("GetDialogueFlowToken")
      .then((res) => setAccessToken(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    draggable.current = document.getElementById("draggable");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function handleMouseDown(e: any) {
      isDragging = true;
      // if (draggable.current) draggable.current.style.cursor = "grabbing";
      offsetX = e.clientX - draggable.current.parentElement?.offsetLeft;
      offsetY = e.clientY - draggable.current.parentElement?.offsetTop;
    }

    // Mouse down: Start dragging
    draggable.current?.addEventListener("mousedown", handleMouseDown);

    function handleMouseMove(e: any) {
      if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        if (draggable.current) {
          draggable.current.parentElement.style.left = `${x}px`;
          draggable.current.parentElement.style.top = `${y}px`;
        }
      }
    }

    // Mouse move: Update element's position
    document.addEventListener("mousemove", handleMouseMove);

    function handleMouseUp() {
      isDragging = false;
      // if (draggable.current) draggable.current.style.cursor = "grab";
    }
    // Mouse up: Stop dragging
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      draggable.current?.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [openChatBot]);

  const sendQueryToDialogFlow = async (input: string) => {
    const url = `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`;
    const defaultParameters = {
      company_id: String(getBranchIdByHeader("companyId")),
      branch_id: String(getCompanyDetails("id")),
      user_name: getBranchIdByHeader("companyDomain"),
      url: window.location.origin,
    };
    const payload = {
      query_input: {
        text: {
          text: input,
          language_code: "en",
        },
      },
      query_params: {
        payload: defaultParameters,
      },
    };
    const headers = {
      // Authorization: `Bearer ${accessToken}`,
      Authorization:
        "Bearer ya29.c.c0ASRK0GaS6OZ4ndyhiGZb2oW8qPvmfLAQjGACz-HJ9SqpwJiTjXCrkWQ7oTzCzK62s4Z3M0T58ooRQWd6LTBrmobQkScC_0XoDLkYCfeyCcwVV99T7EKs4KGKMTdcRs_o_ca7ip3syFabI-zCOguCc3GRL7SdgX1CKT_q_wsd-vx6_9bSWmuYMi_CTyxCP2Uylq5Kzk1HXyg2xTr0u6GQqkNntLgXj708Suu-7M7pefa_ILtrGoUcQUzeDWlnabC4AEK8IWfBW94BzJEC9QgEOObpfFbwsMVoR_PPW45RmtlYiRGBmzCeGkoZdUyBQZW5qISSLg5qrFt-MjkpKMgl0M3iY6YjVHFJREs06JI5BACE3660CAvdoRqjkwE387DxkpjbvUmmUYkf5kaiSmmWX7ewf5zVqBYXwzd3SgW4gto8QJUU5zw_XihjpVOyUqcQRJYeJXxVQU57g8bVVX8a2bYmFBo4OwxJbOb8o7riw5jaQXk0orQsa1jx5ImB19_cjQ5c3y6YFij0eQxdVunk1JQ4fnoz8umvY705rybleFrfSQ-fWbzbO1FmY-kat4ZpVd1IhScoW20mswu1b2gFXnc7dWgVwoMr0tQ_4JJls1UwBOfqk5tktSv1f-6I_vYwiBbMqr2OMu8JZeV5Ou4lr4jB3shFofjZj2yskvmmJvFxaYSRjo_Y_2k23W_zmjiBiaic7sxzJm_wZjySIa4jZJWBVnOY9j_k-a-Q686VveMSgJdJ41iqQYBokOkMaF0VXX7mgp8ujyJhw0WeZFj6xd2VUoJ0Yfe3e60oSM8pnWf-1MbRrmh8JbvMiSQUSJO1oBVpdJrpmBtj3SnBfUtwngb3po_Fqj7v66QcowqIVdpcS7WRrWBb7m3iJR2klj3vg-fzF6FWrISd5JrQ8xXZixphoS5pu7X9xXQV1Y-ub5ZVFko3of-nY3rd143O-rek1U82SSW6dgVSiJ4mzeV7w64iIW7UyU5ynVito8jW1RusQ8kc8OtxRXb",
      "Content-Type": "application/json",
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to send query to DialogFlow: ${response.status}, ${response.statusText}`
        );
      }
      const data = await response.json();
      const botResponse = data.queryResult.fulfillmentText;
      // Update chat history
      setChatHistory((prev) => [
        ...prev,
        // { sender: "user", text: input },
        { sender: "bot", text: botResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        // { sender: "user", text: input },
        {
          sender: "bot",
          text: "Error connecting to DialogFlow. Please try again.",
        },
      ]);
    }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (userInput.trim() !== "") {
      setChatHistory([...chatHistory, { sender: "user", text: userInput }]);
      sendQueryToDialogFlow(userInput);
      setUserInput(""); // Clear input field
    }
  };

  useEffect(() => {
    if (tab == 1) chatSpaceRef.current?.scrollTo(0, 100000000);
  }, [tab]);

  useEffect(() => {
    chatSpaceRef.current?.scrollTo(0, 100000000);
  }, [chatHistory]);

  return (
    <>
      {tab == -1 && (
        <div
          className={styles.chatBox}
          style={!openChatBot ? { display: "none" } : {}}
        >
          <div id="draggable" className={styles.chatHeader}>
            <div className={styles.chatHeaderBrand}>
              <Image
                src="/assets/icube_logo.png"
                width={24}
                height={24}
                alt="icube_logo"
              />
              <span>Help</span>
            </div>
            <CloseOutlined onClick={() => setOpenChatBot(false)} />
          </div>
          <div className={styles.chatSpace}>
            <div className={styles.card}>
              <BookTwoTone />
              <span>Articles</span>
            </div>
            <div className={styles.card} onClick={() => setTab(1)}>
              <MessageTwoTone />
              <span>Customer Support</span>
            </div>
            <div className={styles.card}>
              <SwitcherTwoTone />
              <span>Screen Sharing</span>
            </div>
            <div className={styles.card}>
              {" "}
              <VideoCameraTwoTone />
              <span>Screen Recording</span>
            </div>
          </div>
        </div>
      )}
      {tab == 1 && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderBrand}>
              <Image
                src="/assets/icube_logo.png"
                width={24}
                height={24}
                alt="icube_logo"
              />
              <span>iCube Chat</span>
            </div>
            <LeftOutlined onClick={() => setTab(-1)} />
          </div>
          <div className={styles.chatSpace} ref={chatSpaceRef}>
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender == "bot"
                    ? styles.receivedMessage
                    : styles.senderMessage
                }
              >
                {/* <strong>{message.sender === "bot" ? "Bot: " : "You: "}</strong> */}
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className={styles.chatFooter}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className={styles.chatInput}
            />
            <button type="submit" className={styles.sendBtn}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};
export default Chatbot;
