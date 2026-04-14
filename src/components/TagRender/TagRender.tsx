import { SelectProps, Tag } from "antd";
import { useEffect } from "react";

type TagRender = SelectProps["tagRender"];

export const tagRender: TagRender = (props) => {
  const { label, value, closable, onClose } = props;

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const isColor = (name: string) => {
    const div = document.createElement("div");
    div.style.color = name;
    return div.style.color !== ""; // If the browser recognized it as a color, this will be true
  };

  console.log("isColor", isColor("hello"), value);

  const getTextColor = (bgColor: any) => {
    const colorMap: { [key: string]: string } = {
      white: "white",
    };
    return colorMap[bgColor?.toLowerCase()] || bgColor; // Default to black if no match
  };

  // Function to determine background style
  const getBackgroundStyle = (bgColor: any) => {
    return {
      background:
        bgColor.toLowerCase() === "white"
          ? "black"
          : bgColor.toLowerCase() === "black"
          ? "white"
          : bgColor.toLowerCase()
          ? ""
          : "",
      // : "rgba(0, 0, 0, 0.06)",
    }; // Return the color directly for other cases
  };

  return (
    <Tag
      color={
        isColor(value)
          ? value.charAt(0).toLowerCase() + value.substring(1)
          : undefined
      }
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        ...getBackgroundStyle(label),
        color: getTextColor(label),
        marginInlineEnd: 4,
      }}
    >
      {label}
    </Tag>
  );
};
