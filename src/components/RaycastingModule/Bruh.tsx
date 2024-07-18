import { createRef, useEffect, useState } from "react";
import { moduleFocus } from "../../utils/GameVariables";
import RaycastingModule from "./RaycastingModule";
import RaycastingPhotoModule from "./RaycastingPhotoModule";

export default function Bruh({ moduleIndex = 0, photo = false }) {
  const sizeRef = createRef<HTMLDivElement>();
  const [sizeState, setSizeState] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (sizeRef.current != null) {
      setSizeState({
        w: sizeRef.current?.clientWidth,
        // h: sizeRef.current?.clientHeight,
        h: Math.floor(sizeRef.current?.clientWidth / (16 / 9)),
      });
    }
  }, [moduleFocus[moduleIndex]]);

  return (
    <div ref={sizeRef} className="flex flex-col full-size text-white">
      {/* w: {sizeState.w} h: {sizeState.h} */}
      {photo ? (
        <RaycastingPhotoModule
          key={sizeState.w}
          width={sizeState.w}
          height={sizeState.h}
        />
      ) : (
        <RaycastingModule
          key={sizeState.w}
          width={sizeState.w}
          height={sizeState.h}
          // _targetFps={1}
          // _numRays={1}
        />
      )}
    </div>
  );
}
