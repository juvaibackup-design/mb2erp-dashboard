// app/manifest.ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Icube ERP",
    short_name: "icube",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icube logo cropped quality.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icube-logo (1).png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
