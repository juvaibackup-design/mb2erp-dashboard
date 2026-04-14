"use client";

import Header from "@/components/Header/Header";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Tree, TreeDataNode } from "antd";
import styles from "@/app/dashboard/(inventory)/inventory-logistics/Logistics.module.css";
import styles1 from "./faq.module.css";
import Editor from "./Editor";
import { useEffect, useRef, useState } from "react";
import makeApiCall from "@/lib/helpers/apiHandlers/api";
import { showAlert } from "@/lib/helpers/alert";
import Toast from "@/components/CustomToast/Toast";
import { tagRevalidate } from "@/lib/helpers/serverActions";
import CommentBox from "@/app/dashboard/userfaq/CommendBox";

interface FAQPageProps {
  allForms: any[];
  allRelease: any[]
  // commentData: any[]
}


export default function FAQPage({ allForms, allRelease }: FAQPageProps) {

  // useEffect(() => {
  //   const fetchFaqForms = async () => {
  //     try {
  //       const response = await makeApiCall.get(
  //         "GetFaqForms",
  //       );
  //       console.log("response", response);

  //     } catch (error) {
  //       console.error("Failed to fetch FAQ forms:", error);
  //     }
  //   };

  //   fetchFaqForms();
  // }, []);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [header, setHeader] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const editorRef = useRef<any>(null);
  const [selKeys, setSelKeys] = useState<React.Key[]>([]);
  const [toastMessage, setToastMessage] = useState<{ message: string } | null>(
    null
  );


  const [isMobile, setIsMobile] = useState(false);
  const [mobileMode, setMobileMode] = useState<"tree" | "content">("tree");
  const [pendingContent, setPendingContent] = useState<any>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const getParentKeys = (key: React.Key): React.Key[] => {
    const k = String(key);
    if (k.startsWith("rel-")) return ["rel"]; // Release Notes child -> parent is "rel"
    const parts = k.split("-");
    const parents: string[] = [];
    for (let i = 0; i < parts.length - 1; i++) {
      parents.push(parts.slice(0, i + 1).join("-"));
    }
    return parents;
  };


  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    if (mobileMode === "content" && pendingContent && editorRef.current?.setData) {
      editorRef.current.setData(pendingContent);
      setPendingContent(null);
    }
  }, [mobileMode, pendingContent]);

  const fetchReleaseNote = async (id: number) => {
    try {
      const res = await makeApiCall.get(`GetReleaseNoteById?id=${id}`);

      const versionName =
        (allRelease || []).find((r: any) => String(r.id) === String(id))
          ?.versionName || `Release ${id}`;

      setHeader(versionName || "");
      // editorRef.current.setData(JSON.parse(res.data.data.releaseNoteListByIdDetails[0].content));
      const parsed = JSON.parse(res.data.data.releaseNoteListByIdDetails[0].content);
      if (isMobile) {
        setPendingContent(parsed);
        setMobileMode("content");
      }
      else {
        editorRef.current?.setData(parsed);
      }
    } catch (e) {
      console.error("Error fetching Release Note:", e);
      showAlert("Failed to load Release Note.");
    }
  };

  const fetchFaqArticles = async (
    id: number,
    pIndex: number,
    cIndex: number,
    gcIndex: number,
    ggcIndex: number
  ) => {
    try {
      if (pIndex) {
        const response = await makeApiCall.get(`GetFaqArticles?id=${id}`);
        console.log("lol", response);
        setHeader(response.data.data[0].articleName);
        // editorRef.current.setData(JSON.parse(response.data.data.faqArticlesDetails[0].articleContent));
        const parsed = JSON.parse(response.data.data[0].articleContent)
        if (isMobile) {
          setPendingContent(parsed);
          setMobileMode("content");
        } else {
          editorRef.current?.setData(parsed);
        }
      } else {
        fetchReleaseNote(id);
      }
    } catch (error) {
      console.error("Error fetching FAQ articles:", error);
      showAlert("Failed to load FAQ.");
    }
  };

  const clearEditor = async () => {
    setHeader("");
    setPendingContent(null);
    await editorRef.current?.clear?.();
  };

  console.log("allForms", allForms, treeData);

  useEffect(() => {
    const cIndex = allForms.filter((data) => !data.gcIndex);
    const uniqueById = Array.from(
      new Map(cIndex.map((item) => [item.pIndex, item])).values()
    );

    const pIndex = uniqueById;
    const gcIndex = allForms.filter((data) => data.gcIndex && !data.ggcIndex);
    const ggcIndex = allForms.filter((data) => data.ggcIndex);
    const data = pIndex.map((pInd) => {
      const datum: any = {
        title: pInd.moduleName,
        key: pInd.pIndex,
        children: [],
      };
      cIndex
        .filter((c) => c.pIndex == pInd.pIndex)
        .forEach((cInd: any, i) => {
          const datum1: any = {
            title: cInd.formName,
            key: `${cInd.pIndex}-${cInd.cIndex}`,
            children: [],
          };
          gcIndex
            .filter(
              (gc) => gc.pIndex == cInd.pIndex && gc.cIndex == cInd.cIndex
            )
            .forEach((gcInd: any, i) => {
              const datum2: any = {
                title: gcInd.formName,
                key: `${gcInd.pIndex}-${gcInd.cIndex}-${gcInd.gcIndex}`,
                children: [],
              };
              ggcIndex
                .filter(
                  (ggc) =>
                    ggc.pIndex == gcInd.pIndex &&
                    ggc.cIndex == gcInd.cIndex &&
                    ggc.gcIndex == gcInd.gcIndex
                ).forEach((ggcInd: any, i) => {
                  datum2.children.push({
                    title: ggcInd.formName,
                    key: `${ggcInd.pIndex}-${ggcInd.cIndex}-${ggcInd.gcIndex}-${ggcInd.ggcIndex}`,
                    children: [],
                  });
                  console.log("ggcInd.articles", ggcInd, JSON.parse(ggcInd.articles));
                  JSON.parse(ggcInd.articles).map((article: any, ix: number) => datum2.children[i].children.push({
                    title: article.articleName,
                    id: article.id,
                    key: `${ggcInd.pIndex}-${ggcInd.cIndex}-${ggcInd.gcIndex}-${ggcInd.ggcIndex}-${ix}`,
                    children: [],
                  }))
                });
              datum1.children.push(datum2);
              JSON.parse(gcInd.articles).map((article: any, ix: number) => datum1.children[i].children.push({
                title: article.articleName,
                id: article.id,
                key: `${gcInd.pIndex}-${gcInd.cIndex}-${gcInd.gcIndex}-${gcInd.ggcIndex}-${ix}`,
                children: [],
              }));
            });
          datum.children.push(datum1);
          JSON.parse(cInd.articles).map((article: any, ix: number) => datum.children[i].children.push({
            title: article.articleName,
            id: article.id,
            key: `${cInd.pIndex}-${cInd.cIndex}-${cInd.gcIndex}-${cInd.ggcIndex}-${ix}`,
            children: [],
          }))
        });
      return datum;
    });

    // ---- HARD-CODED "Release Notes" node (always last) ----
    const releaseNode: any = {
      title: "Release Notes",
      key: "rel",            // parent key (non-leaf)
      // selectable: false,     // clicking the parent doesn't load anything
      children: (allRelease || []).map((r: any, idx: number) => ({
        title: r.versionName || `Release ${r.id ?? idx + 1}`,
        id: r.id,                                // release id used to fetch
        key: `rel-${r.id ?? idx + 1}`,           // unique leaf key
        isLeaf: true,
      })),
    };

    setTreeData([...data, releaseNode]);
  }, [allForms]);

  const onSelectNode = async (selectedKeys: React.Key[], info: any) => {
    setSelKeys(selectedKeys);                 // keep UI in sync


    if (!selectedKeys || selectedKeys.length === 0) {
      return; // no selection, exit early
    }
    const node = info?.node;
    if (!node) return;
    setSelectedNode(node);

    if (!node.id) {
      await clearEditor();
      if (isMobile) setMobileMode("tree"); // <— add
      return;
    }

    const selectedKey = selectedKeys[0]?.toString();
    const parents = getParentKeys(selectedKey);
    setExpandedKeys(prev => Array.from(new Set([...prev, ...parents])));
    setSelectedKeys([selectedKey]);

    if (!selectedKey) return; // guard against undefined or empty string

    const parts = selectedKey?.split("-");
    if (parts.length < 2) {
      // expected at least pIndex and cIndex, else exit or handle differently
      console.warn("Invalid selected key format:", selectedKey);
      return;
    }
    const pIndex = parseInt(parts[0]);
    const cIndex = parseInt(parts[1]);
    const gcIndex = parts[2] ? parseInt(parts[2]) : 0;
    const ggcIndex = parts[3] ? parseInt(parts[3]) : 0;
    console.log("info", info)
    setSelectedNode(info.node);
    await fetchFaqArticles(info.node.id, pIndex, cIndex, gcIndex, ggcIndex);
  };

  async function postArticle() {
    try {

      if (!selectedNode?.key) {
        showAlert("Please select a article position first.");
        return;
      } else if (!header.trim()) {
        showAlert("Please fill the article name or Version Name.")
        return;
      }

      const data = await editorRef.current?.getData();
      const [p_index, c_index = 0, gc_index = 0, ggc_index = 0] = selectedNode.key.split("-");
      const id = selectedNode.id || 0;
      console.log("selectedNode", selectedNode)
      if (p_index != "rel") {
        makeApiCall.post("PostSaveFaqArticles", [{
          id,
          "pIndex": p_index,
          "cIndex": c_index,
          "gcIndex": gc_index,
          "ggcIndex": ggc_index,
          // "createdBy": "Name",
          "articleContent": JSON.stringify(data),
          "articleName": header
        }]);
        tagRevalidate("faq");
      } else {
        makeApiCall.post("PostSaveReleaseNote", [
          {
            "id": id,
            "versionName": header,
            // "createdBy": "hadhi",
            "createdDate": new Date().toISOString(),
            "content": JSON.stringify(data)
          }
        ])
        tagRevalidate("release");
      }
      setToastMessage({ message: "Saved Successfully." })
      await clearEditor();
      setSelectedNode(null);
      setSelKeys([]);
    }
    catch (err) {
      console.log("err", err);
      showAlert("Failed to save FAQ.")
    }
  }
  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header
          title="Know How"
          description="About SAAS ERP"
          buttonLable={isMobile ? "" : "Create"}
          onClick={postArticle}
        />
      </div>


      <Flex style={{ height: "calc(100% - 70px)" }} gap={8}>
        {isMobile ? (
          mobileMode === "tree" ? (
            <div className={`${styles1.treeWrap} custom-scroll`}>
              <Tree
                showLine
                switcherIcon={<DownOutlined />}
                selectedKeys={selKeys}   // controlled selection
                onSelect={onSelectNode}
                treeData={treeData}
                expandAction="click"
                expandedKeys={expandedKeys}                           // ← add
                onExpand={(keys) => setExpandedKeys(keys as React.Key[])}  // ← add
              />
            </div>
          ) : (
            <div className={styles1.reactQuillWrap}>
              <Input
                placeholder="Header"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className={styles1.headerInput}
              />
              <div className={`${styles1.contentScroll} custom-scroll`}>
                <Editor
                  eref={editorRef}
                // footer={
                //   !String(selectedNode?.key).startsWith("rel-") && selectedNode?.id ? (
                //     <CommentBox
                //       origin="config"
                //       subjectId={selectedNode.id}
                //       subjectType={String(selectedNode.key || "").startsWith("rel-") ? "release" : "faq"}
                //       commentData={commentData || []}
                //     />
                //   ) : null
                // }
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", paddingTop: 10, gap: 12 }}>

                <Button
                  type="text"
                  onClick={() => {
                    setMobileMode("tree");
                    if (selectedNode?.key) {
                      const parents = getParentKeys(selectedNode.key);
                      setExpandedKeys(prev => Array.from(new Set([...prev, ...parents])));
                      setSelectedKeys([selectedNode.key]); // highlight same leaf
                    }
                  }}
                >
                  {("Back")}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    postArticle();
                    if (isMobile) setMobileMode("tree");
                  }}
                >
                  {("Create")}
                </Button>
              </div>
            </div>
          )
        ) : (
          <>
            <div className={`${styles1.treeWrap} custom-scroll`}>
              <Tree
                showLine
                switcherIcon={<DownOutlined />}
                selectedKeys={selKeys}   // controlled selection
                onSelect={onSelectNode}
                treeData={treeData}
                expandAction="click"
              />
            </div>
            <div className={styles1.reactQuillWrap}>
              <Input
                placeholder="Header"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className={styles1.headerInput}
              />
              <div className={`${styles1.contentScroll} custom-scroll`}>
                <Editor
                  eref={editorRef}
                // footer={
                //   !String(selectedNode?.key).startsWith("rel-") && selectedNode?.id ? (
                //     <CommentBox
                //       origin="config"
                //       subjectId={selectedNode.id}
                //       subjectType={String(selectedNode.key || "").startsWith("rel-") ? "release" : "faq"}
                //       commentData={commentData || []}
                //     />
                //   ) : null
                // }
                />
              </div>
            </div>
          </>
        )}
      </Flex>
      {toastMessage && <Toast message={toastMessage.message} delay={1500} />}
    </div>
  );
}
