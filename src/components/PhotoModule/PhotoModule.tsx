import { createRef, useEffect } from "react";
import { raycastingPhoto } from "../../utils/GameVariables";

export type PhotoModuleProps = {
  width?: number;
  height?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  photo?: boolean;
};

export default function PhotoModule({
  width = 0,
  height = 0,
  canvasWidth = 0,
  canvasHeight = 0,
  photo,
}: PhotoModuleProps) {
  // ----- VARIABLES -----

  // ----- CANVAS -----

  const screenSize = { width: canvasWidth, height: canvasHeight };
  //const screenSize = { width: width, height: height };

  const canvasRef = createRef<HTMLCanvasElement>();

  var photoCanvas: HTMLCanvasElement | null;
  var photoCtx: CanvasRenderingContext2D;

  const scale = width / screenSize.width;

  // ----- FUNCTIONS -----

  // ----- INITIALIZATION -----

  // ----- DRAWING -----

  const draw = () => {
    photoCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    photoCtx.putImageData(raycastingPhoto.photo, 0, 0);
  };

  // ----- USE EFFECT -----

  useEffect(() => {
    // initializing the photoCanvas
    photoCanvas = canvasRef.current;
    photoCtx = photoCanvas!.getContext("2d")!;

    photoCtx.imageSmoothingEnabled = false;

    photoCtx.font = "30px monospace";

    draw();

    console.log("PhotoModule");
  }, [raycastingPhoto.photo]);

  // useEffect(() => {
  //   draw();
  // }, [raycastingPhoto.photo]);

  // ----- HTML -----

  return (
    <div className="flex flex-col full-size overflow-hidden text-white">
      {/* frames: {frameCountState} fps: {fpsState} */}
      <div
        style={{
          position: "relative",
          width: width + "px",
          height: height + "px",
          // border: "2px solid blue",
          backgroundColor: "black",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            transform: "scale(" + scale + ")",
            left: width / 2 - screenSize.width / 2,
            top: height / 2 - screenSize.height / 2,
            position: "absolute",
            // border: "2px solid red",
          }}
          width={screenSize.width}
          height={screenSize.height}
        />
      </div>
    </div>
  );
}
