import { useEffect } from "react";

export const useMouse = (
  handleMouseDown: (e: Event) => void,
  handleMouseUp: (e: Event) => void,
  handleMouseMove: (e: Event) => void
) => {
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
};
