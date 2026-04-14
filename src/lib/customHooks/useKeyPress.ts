import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const useKeyPress = (keys: any, callback: any, node = null) => {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: { preventDefault(): unknown; key: any }) => {
      if (event.key === "Alt") {
        event.preventDefault();
      }
      // check if one of the key is part of the ones we want
      else if (keys.some((key: any) => event.key === key)) {
        callbackRef.current(event);
      }
    },
    [keys]
  );

  useEffect(() => {
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, node]);
};

export default useKeyPress;
