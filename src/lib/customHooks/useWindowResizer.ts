import { useEffect, useState } from "react";

const useWindowResizer = () => {
  const [parentDimensions, setParentDimensions] = useState({
    width: 1024,
    height: 876,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const { clientWidth, clientHeight } = document.documentElement;
      setParentDimensions({ width: clientWidth, height: clientHeight });
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions(); // Initial dimensions

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return parentDimensions;
};

/**
 * Converts provided width percentage to pixels.
 * @param {number} widthPercent The percentage of the parent container's width that UI element should cover.
 * @param {number} parentWidth The width of the parent container.
 * @return {number} The calculated width in pixels.
 */
const widthPercentageToPixels = (widthPercent: any, parentWidth: any) => {
  const elemWidth =
    typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return (elemWidth / 100) * parentWidth;
};

/**
 * Converts provided height percentage to pixels.
 * @param {number} heightPercent The percentage of the parent container's height that UI element should cover.
 * @param {number} parentHeight The height of the parent container.
 * @return {number} The calculated height in pixels.
 */
const heightPercentageToPixels = (heightPercent: any, parentHeight: any) => {
  const elemHeight =
    typeof heightPercent === "number"
      ? heightPercent
      : parseFloat(heightPercent);
  return (elemHeight / 100) * parentHeight;
};

export {
  widthPercentageToPixels as WPP,
  heightPercentageToPixels as HPP,
  useWindowResizer,
};
