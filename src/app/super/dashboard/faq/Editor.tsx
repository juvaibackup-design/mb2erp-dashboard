"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
// @ts-ignore  // no .d.ts shipped for this package
import VideoTool from "editorjs-video";
import type { ToolConstructable } from "@editorjs/editorjs";
import { useRouter } from "next/navigation";

/* --------------------  Helpers  -------------------- */
const createBtn = (label: string, title: string) => {
  const b = document.createElement("button");
  b.type = "button";
  b.title = title;
  b.textContent = label;
  b.style.cssText =
    "min-width:32px;height:28px;margin:0 2px;padding:0 6px;border:1px solid #d9d9d9;border-radius:6px;background:#fff;cursor:pointer;font-size:12px";
  return b;
};

const applyAsync = (fn: () => void) => {
  // Try now; if the image isn't in the DOM yet, try again shortly.
  fn();
  setTimeout(fn, 0);
  setTimeout(fn, 50);
  setTimeout(fn, 200);
};

/* --------------------  Tunes  -------------------- */

/** Alignment tune: left / center / right */
class ImageAlignTune {
  static get isReadOnlySupported() {
    return true;
  }
  static get isTune() { return true; }        // ✅

  private api: any;
  private block: any;
  private data: { align: "left" | "center" | "right" };

  private wrapper!: HTMLDivElement;
  private btns: Record<"left" | "center" | "right", HTMLButtonElement>;

  constructor({ api, data, block }: any) {
    this.api = api;
    this.block = block;
    this.data = data && data.align ? data : { align: "center" };

    this.btns = {
      left: createBtn("L", "Align left"),
      center: createBtn("C", "Align center"),
      right: createBtn("R", "Align right"),
    };

    Object.entries(this.btns).forEach(([k, btn]) => {
      btn.onclick = () => {
        this.data.align = k as any;
        this.apply();
        this.highlight();
      };
    });

    // Apply saved alignment when loading
    applyAsync(() => this.apply());
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.style.display = "flex";
    this.wrapper.style.alignItems = "center";
    this.wrapper.style.padding = "4px 2px";
    // label
    const label = document.createElement("span");
    label.textContent = "Align:";
    label.style.cssText = "margin-right:4px;font-size:12px;color:#444";
    this.wrapper.appendChild(label);
    this.wrapper.appendChild(this.btns.left);
    this.wrapper.appendChild(this.btns.center);
    this.wrapper.appendChild(this.btns.right);
    this.highlight();
    return this.wrapper;
  }

  save() {
    return this.data;
  }

  private highlight() {
    Object.entries(this.btns).forEach(([k, btn]) => {
      const active = k === this.data.align;
      btn.style.borderColor = active ? "#1677ff" : "#d9d9d9";
      btn.style.background = active ? "#e6f4ff" : "#fff";
    });
  }

  private apply() {
    const holder: HTMLElement | null = this.block?.holder || null;
    if (!holder) return;

    // Try to find the image container inside EditorJS image tool
    const img: HTMLImageElement | null =
      holder.querySelector(".image-tool__image img") ||
      holder.querySelector("img");

    const container: HTMLElement =
      (holder.querySelector(".image-tool") as HTMLElement) || holder;

    // Align by text-align on the container
    if (container) {
      container.style.textAlign =
        this.data.align === "left"
          ? "left"
          : this.data.align === "right"
            ? "right"
            : "center";
    }
    // Ensure the image can be centered as inline-block
    if (img) {
      img.style.display = "inline-block";
    }
  }
}

/** Size tune: width percentage (25 / 50 / 75 / 100) */
class ImageSizeTune {
  static get isReadOnlySupported() {
    return true;
  }
  static get isTune() { return true; }        // ✅

  private api: any;
  private block: any;
  private data: { widthPct: number };
  private wrapper!: HTMLDivElement;
  private btns: Record<"50" | "75" | "100", HTMLButtonElement>;

  constructor({ api, data, block }: any) {
    this.api = api;
    this.block = block;
    const w = Number(data?.widthPct) || 100;
    // this.data = { widthPct: [ 25 ,50, 75, 100].includes(w) ? w : 100 };
    this.data = { widthPct: [50, 75, 100].includes(w) ? w : 100 };

    this.btns = {
      // "25": createBtn("25%", "25% width"),
      "50": createBtn("50%", "50% width"),
      "75": createBtn("75%", "75% width"),
      "100": createBtn("100%", "100% width"),
    };

    Object.entries(this.btns).forEach(([k, btn]) => {
      btn.onclick = () => {
        this.data.widthPct = Number(k);
        this.apply();
        this.highlight();
      };
    });

    // Apply saved size when loading
    applyAsync(() => this.apply());
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.style.display = "flex";
    this.wrapper.style.alignItems = "center";
    this.wrapper.style.padding = "4px 2px";
    // label
    const label = document.createElement("span");
    label.textContent = "Size:";
    label.style.cssText = "margin:0 4px 0 0;font-size:12px;color:#444";
    this.wrapper.appendChild(label);

    // this.wrapper.appendChild(this.btns["25"]);
    this.wrapper.appendChild(this.btns["50"]);
    this.wrapper.appendChild(this.btns["75"]);
    this.wrapper.appendChild(this.btns["100"]);
    this.highlight();
    return this.wrapper;
  }

  save() {
    return this.data;
  }

  private highlight() {
    Object.entries(this.btns).forEach(([k, btn]) => {
      const active = Number(k) === this.data.widthPct;
      btn.style.borderColor = active ? "#1677ff" : "#d9d9d9";
      btn.style.background = active ? "#e6f4ff" : "#fff";
    });
  }

  private apply() {
    const holder: HTMLElement | null = this.block?.holder || null;
    if (!holder) return;

    const img: HTMLImageElement | null =
      holder.querySelector(".image-tool__image img") ||
      holder.querySelector("img");

    if (img) {
      img.style.width = `${this.data.widthPct}%`;
      img.style.maxWidth = "100%";
      img.style.height = "auto";
    }
  }
}

// class ImageViewTune {
//   static get isReadOnlySupported() { return true; }
//   static get isTune() { return true; }

//   private block: any;
//   private btn!: HTMLButtonElement;

//   constructor({ block }: any) {
//     this.block = block;
//   }

//   render() {
//     this.btn = document.createElement("button");
//     this.btn.type = "button";
//     this.btn.textContent = "👁 View";
//     this.btn.title = "Preview image";
//     this.btn.style.cssText =
//       "min-width:48px;height:28px;margin:0 2px;padding:0 8px;border:1px solid #d9d9d9;border-radius:6px;background:#fff;cursor:pointer;font-size:12px";
//     this.btn.onclick = () => this.openViewer();
//     return this.btn;
//   }

//   save() {
//     // no persistent data, it’s just an action
//     return {};
//   }

//   private findImageUrl(): string {
//     // 1) Prefer tool DOM (image tool markup)
//     const holder: HTMLElement | null = this.block?.holder || null;
//     const domUrl =
//       holder?.querySelector<HTMLImageElement>(".image-tool__image img")?.src ||
//       holder?.querySelector<HTMLImageElement>("img")?.src ||
//       "";

//     if (domUrl) return domUrl;

//     // 2) Try block data shape (file.url or url)
//     // @ts-ignore EditorJS block API
//     const data = (this.block?.data ?? {}) as any;
//     return data?.file?.url || data?.url || "";
//   }

//   private openViewer() {
//     const url = this.findImageUrl();
//     if (!url) return;

//     const overlay = document.createElement("div");
//     overlay.style.cssText = `
//       position:fixed; inset:0; background:rgba(0,0,0,.85);
//       display:flex; align-items:center; justify-content:center;
//       z-index: 99999; padding: 24px;
//     `;

//     const frame = document.createElement("div");
//     frame.style.cssText = `
//       position:relative; max-width:90vw; max-height:90vh;
//       display:flex; align-items:center; justify-content:center;
//     `;

//     const img = new Image();
//     img.src = url;
//     img.alt = "Preview";
//     img.style.cssText = `
//       max-width:90vw; max-height:90vh; border-radius:12px;
//       box-shadow:0 10px 40px rgba(0,0,0,.5);
//     `;

//     const closeBtn = document.createElement("button");
//     closeBtn.textContent = "×";
//     closeBtn.title = "Close";
//     closeBtn.style.cssText = `
//       position:absolute; top:-12px; right:-12px; width:36px; height:36px;
//       border-radius:50%; border:none; background:#fff; cursor:pointer;
//       font-size:20px; line-height:36px; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,.3);
//     `;

//     const actions = document.createElement("div");
//     actions.style.cssText = `
//       position:absolute; bottom:-12px; right:0; display:flex; gap:8px;
//     `;

//     const openBtn = document.createElement("button");
//     openBtn.textContent = "↗ Open";
//     openBtn.title = "Open in new tab";
//     openBtn.style.cssText = `
//       height:32px; padding:0 10px; border-radius:8px; border:none;
//       background:#fff; cursor:pointer; font-size:12px; box-shadow:0 4px 14px rgba(0,0,0,.3);
//     `;
//     openBtn.onclick = () => window.open(url, "_blank", "noopener,noreferrer");

//     const copyBtn = document.createElement("button");
//     copyBtn.textContent = "⧉ Copy URL";
//     copyBtn.title = "Copy image URL";
//     copyBtn.style.cssText = openBtn.style.cssText;
//     copyBtn.onclick = async () => {
//       try {
//         await navigator.clipboard.writeText(url);
//         copyBtn.textContent = "✓ Copied";
//         setTimeout(() => (copyBtn.textContent = "⧉ Copy URL"), 1200);
//       } catch {
//         // fallback
//         const ta = document.createElement("textarea");
//         ta.value = url; document.body.appendChild(ta);
//         ta.select(); document.execCommand("copy");
//         document.body.removeChild(ta);
//         copyBtn.textContent = "✓ Copied";
//         setTimeout(() => (copyBtn.textContent = "⧉ Copy URL"), 1200);
//       }
//     };

//     const close = () => {
//       document.removeEventListener("keydown", onEsc);
//       overlay.remove();
//     };
//     const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };

//     overlay.onclick = close;
//     frame.onclick = (e) => e.stopPropagation();
//     closeBtn.onclick = close;
//     document.addEventListener("keydown", onEsc);

//     actions.appendChild(openBtn);
//     actions.appendChild(copyBtn);
//     frame.appendChild(img);
//     frame.appendChild(closeBtn);
//     frame.appendChild(actions);
//     overlay.appendChild(frame);
//     document.body.appendChild(overlay);
//   }
// }

/* --------------------  Component  -------------------- */

export default function Editor({ eref, footer, }: { eref: any; footer?: React.ReactNode }) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const ejInstance = useRef<any>(null);
  const router = useRouter();


  const forceVideoControls = () => {
    const holder = holderRef.current;
    if (!holder) return;
    holder.querySelectorAll("video").forEach((vid: HTMLVideoElement) => {
      vid.controls = true;
      vid.setAttribute("playsinline", "");
      vid.setAttribute("preload", "metadata");
    });
  };

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest("a") as HTMLAnchorElement | null;
      if (!a) return;

      // let Ctrl/Cmd-click open a new tab normally
      if (e.ctrlKey || e.metaKey) return;

      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("javascript:")) return;

      // stop EditorJS from eating the click
      e.preventDefault();
      e.stopPropagation();

      // internal vs external routing
      if (href.startsWith("/")) {
        router.push(href);             // SPA route (same tab)
      } else {
        window.location.href = href;   // external (same tab)
        // or: window.open(href, "_blank");
      }
    };

    // capture phase so we beat EditorJS handlers
    holder.addEventListener("click", onAnchorClick, true);
    return () => holder.removeEventListener("click", onAnchorClick, true);
  }, [router]);


  useImperativeHandle(eref, () => ({
    // Return HTML built from saved data
    getHTML: handleGetHTML,
    // Return raw EditorJS saved data
    getData: async () => (await ejInstance.current?.save?.()) ?? null,
    // Load EditorJS saved data object (OutputData)
    setData: async (data: any) => {
      if (!data) return;
      await ensureReady();
      await ejInstance.current.clear();
      // accept either full OutputData or {blocks:[...]}
      const payload = data.blocks ? data : { time: Date.now(), blocks: data };
      await ejInstance.current.render(payload);
      setTimeout(() => forceVideoControls(), 0);
    },
    // Load plain text / simple HTML into a paragraph
    setText: async (text: string) => {
      const safe = (text ?? "").replace(/\n/g, "<br/>");
      await ensureReady();
      await ejInstance.current.clear();
      await ejInstance.current.render({
        time: Date.now(),
        blocks: [{ type: "paragraph", data: { text: safe } }],
      });
    },
    // Clear the editor
    clear: async () => {
      await ensureReady();
      await ejInstance.current.clear();
    },
  }));

  const ensureReady = async () => {
    if (!ejInstance.current) return;
    if (ejInstance.current.isReady) {
      await ejInstance.current.isReady;
    }
  };

  const handleGetHTML = async () => {
    const outputData = await ejInstance.current.save();
    const htmlContent = editorDataToHTML(outputData);
    return htmlContent;
  };

  function editorDataToHTML(data: any): string {
    if (!data || !data.blocks) return "";
    const inferType = (url: string) => {
      if (url.startsWith("data:")) {
        if (url.includes("video/mp4")) return "video/mp4";
        if (url.includes("video/webm")) return "video/webm";
        return "video/mp4";
      }
      if (/\.(webm)(\?|#|$)/i.test(url)) return "video/webm";
      return "video/mp4";
    };
    return data.blocks
      .map((block: any) => {
        switch (block.type) {
          case "header":
            return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
          case "paragraph":
            return `<p>${block.data.text}</p>`;
          case "list": {
            const tag = block.data.style === "ordered" ? "ol" : "ul";
            const items = block.data.items.map((item: string) => `<li>${item}</li>`).join("");
            return `<${tag}>${items}</${tag}>`;
          }
          case "table": {
            const rows = block.data.content
              .map((row: string[]) => {
                const cols = row.map((cell: string) => `<td>${cell}</td>`).join("");
                return `<tr>${cols}</tr>`;
              })
              .join("");
            return `<table>${rows}</table>`;
          }
          case "image": {
            const url = block.data.file?.url || "";
            const caption = block.data.caption || "";
            const align = block.tunes?.imgAlign?.align || "center";
            const widthPct = block.tunes?.imgSize?.widthPct || 100;

            const style =
              `text-align:${align};` +
              ``;

            const imgStyle = `width:${widthPct}%;max-width:100%;height:auto;display:inline-block;`;

            return `
              <figure style="${style}">
                <img src="${url}" alt="${caption || ""}" style="${imgStyle}" />
                ${caption ? `<figcaption>${caption}</figcaption>` : ""}
              </figure>
            `.trim();
          }
          case "video": {
            const url = block.data?.file?.url || block.data?.url || "";
            const caption = block.data?.caption || "";
            const type = inferType(url);
            return `
                <figure class="video">
                  <video controls playsinline preload="metadata">
                    <source src="${url}" type="${type}" />
                    Your browser does not support the video tag.
                  </video>
                  ${caption ? `<figcaption>${caption}</figcaption>` : ""}
                </figure>
              `.trim();
          }

          // ✅ (optional) embed block (YouTube/Vimeo)
          case "embed": {
            const src = block.data?.embed || block.data?.source || "";
            const caption = block.data?.caption || "";
            const width = block.data?.width || 640;
            const height = block.data?.height || 360;
            return `
                <div class="embed">
                  <iframe src="${src}" width="${width}" height="${height}" frameborder="0"
                    allowfullscreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                  ${caption ? `<div class="embed__caption">${caption}</div>` : ""}
                </div>
              `.trim();
          }
          default:
            return "";
        }
      })
      .join("\n");
  }

  useEffect(() => {
    if (!ejInstance.current) {

      // // put inside your component
      // const forceVideoControls = () => {
      //   const holder = holderRef.current;
      //   console.log("holderRef.current", holderRef.current)
      //   if (!holder) return;
      //   holder.querySelectorAll("video").forEach((vid: HTMLVideoElement) => {
      //     // add native controls
      //     vid.controls = true;                  // ← equivalent to setting the attribute
      //     // optional but nice for UX
      //     vid.setAttribute("playsinline", "");
      //     vid.setAttribute("preload", "metadata");
      //   });
      // };

      ejInstance.current = new EditorJS({
        holder: holderRef.current!, // HTMLElement reference
        tools: {
          header: Header,
          list: List,
          // table: Table as any,
          image: {
            class: ImageTool,
            tunes: ["imgAlign", "imgSize"],
            config: {
              endpoints: {},
              uploader: {
                async uploadByFile(file: File) {
                  console.log("file", file)
                  const toBase64 = (f: File) =>
                    new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = (err) => reject(err);
                      reader.readAsDataURL(f);
                    });
                  const base64 = (await toBase64(file)) as string;
                  return { success: 1, file: { url: base64 } };
                },
              },
            },
          },
          // register tunes (names must match "tunes" array above)
          imgAlign: { class: ImageAlignTune as any },
          imgSize: { class: ImageSizeTune as any },
          // imgView: { class: ImageViewTune as any },

          video: {
            class: VideoTool as unknown as ToolConstructable,
            config: {
              // ✅ 'uploader' must be a sibling of 'endpoints', not inside it
              uploader: {
                async uploadByFile(file: File) {
                  console.log("file", file)
                  const toBase64 = (f: File) =>
                    new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(String(reader.result));
                      reader.onerror = reject;
                      reader.readAsDataURL(f);        // data:video/mp4;base64,...
                    });

                  const url = await toBase64(file);
                  console.log("urll", url);
                  // const url = URL.createObjectURL(file);
                  setTimeout(() => forceVideoControls(), 1000);
                  return { success: 1, file: { url } }; // EditorJS standard response
                },
                // optional, if you paste a direct video URL and want to keep it as-is
                async uploadByUrl(url: string) {
                  return { success: 1, file: { url } };
                },
              },
              types: "video/*",    // (optional) ensures the file input accepts videos
              field: "video",      // (default) name used when sending FormData (for endpoints mode)
              onReady: () => { forceVideoControls(); },
              onChange: () => { forceVideoControls(); },
            },
          },
          embed: {
            class: Embed as unknown as any,
            inlineToolbar: true,
            config: { services: { youtube: true, vimeo: true } },
          },
          table: {
            class: Table as any,
            inlineToolbar: true,
            config: { rows: 2, cols: 3 },
          },
          // paragraph tool is bundled by default
        },
        placeholder: "Start writing your content...",
      });
    }

    return () => {
      if (ejInstance.current?.destroy) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", flexGrow: 1 }}>
      <div id="editorjs" ref={holderRef} className="faq-editor"></div>
      {footer ? <div>{footer}</div> : null}
    </div>
  );
}
