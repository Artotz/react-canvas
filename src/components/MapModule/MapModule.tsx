import { useEffect, useState } from "react";
import {
  map,
  mapHeight,
  mapWidth,
  miniMap,
  player,
  raycastingRays,
} from "../../utils/GameVariables";
import useWindowResize from "../../hooks/useWindowResize";

export type MapModuleProps = {
  _screenWidth?: number;
  _screenHeight?: number;
  _targetFps?: number;
};

// MapModule.defaultProps = {
//   miniMap.scale: 5,
//   screenWidth: 480,
//   screenHeight: 300,
//   stripWidth: 20,
//   fov: 60,
//   targetFps: 30,
// };

export default function MapModule({
  _screenWidth = 480,
  _screenHeight = 300,
  _targetFps = 30,
}: MapModuleProps) {
  // ----- VARIABLES -----
  // ----- CANVAS (MINIMAP) -----

  var mapCanvas: HTMLCanvasElement | null;
  var mapCtx: CanvasRenderingContext2D;
  var objectCanvas: HTMLCanvasElement | null;
  var objectCtx: CanvasRenderingContext2D;

  // var drawingCanvas: HTMLCanvasElement | null;
  // var drawingCtx: CanvasRenderingContext2D;

  var frameCount = 0;
  const [frameCountState, setFrameCountState] = useState(0);

  // ----- SIZING HELL -----

  const screenWidth = _screenWidth;
  const screenHeight = _screenHeight;

  // const windowSizeState = useWindowResize();

  // const screenWidth = windowSizeState.width;
  // const screenHeight = windowSizeState.height;

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [lastClick, setLastClick] = useState({ x: 0, y: 0 });

  // ----- MEMES -----

  var targetFps: number = _targetFps,
    fpsInterval: number,
    startTime: number,
    now: number,
    then: number,
    elapsed: number;

  const [fpsState, setFpsState] = useState(0);

  // ----- DRAWING -----

  const drawMiniMap = () => {
    for (var y = 0; y < mapHeight; y++) {
      for (var x = 0; x < mapWidth; x++) {
        var wall = map[y][x];

        if (wall > 0) {
          // if there is a wall block at this (x,y) ...

          mapCtx.fillStyle = "rgb(200,200,200)";
          mapCtx.fillRect(
            // ... then draw a block on the minimap
            x * miniMap.scale,
            y * miniMap.scale,
            miniMap.scale,
            miniMap.scale,
          );
        }
      }
    }
  };

  const drawPlayer = () => {
    objectCtx.fillStyle = "red";
    objectCtx.beginPath();
    objectCtx.arc(
      // draw a dot at the current player position
      player.x * miniMap.scale,
      player.y * miniMap.scale,
      0.25 * miniMap.scale,
      0,
      2 * Math.PI,
    );
    objectCtx.fill();

    objectCtx.strokeStyle = "red";
    objectCtx.beginPath();
    objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
    objectCtx.lineTo(
      (player.x + Math.cos(player.rot)) * miniMap.scale,
      (player.y + Math.sin(player.rot)) * miniMap.scale,
    );
    objectCtx.closePath();
    objectCtx.stroke();
  };

  const drawRay = (rayX: number, rayY: number) => {
    objectCtx.strokeStyle = "rgba(100,0,0,0.3)";
    objectCtx.lineWidth = 0.5;
    objectCtx.beginPath();
    objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
    objectCtx.lineTo(rayX * miniMap.scale, rayY * miniMap.scale);
    objectCtx.closePath();
    objectCtx.stroke();
  };

  const draw = () => {
    setFrameCountState(frameCount);
    //console.log(frameCountState);

    mapCtx.clearRect(0, 0, mapCtx.canvas.width, mapCtx.canvas.height);
    objectCtx.clearRect(0, 0, objectCtx.canvas.width, objectCtx.canvas.height);

    for (var i = 0; i < raycastingRays.length; i++) {
      drawRay(raycastingRays[i].x, raycastingRays[i].y);
    }

    drawMiniMap();
    drawPlayer();

    // console.log(miniMap.scale);
    // console.log(document.getElementById("container")?.clientWidth);
    // console.log(document.getElementById("container")?.clientHeight);
  };

  // ----- MOUSE -----

  const handleMouseDown = (e: MouseEvent) => {
    setLastClick({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = (e: MouseEvent) => {
    setLastClick({
      x: 0,
      y: 0,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (lastClick.x !== 0 && lastClick.y !== 0) {
      setOffset({ x: -lastClick.x + e.clientX, y: -lastClick.y + e.clientY });
    }
    //console.log(e);
  };

  const handleMouseWheel = (e: WheelEvent) => {
    if (e.deltaY > 0) {
      miniMap.scale += miniMap.scale == 20 ? 0 : 1;
    } else if (e.deltaY < 0) {
      miniMap.scale -= miniMap.scale == 5 ? 0 : 1;
    }
  };

  // ----- USE EFFECT -----

  useEffect(() => {
    let animationFrameId: number;

    // referencing the canvas and contexts
    mapCanvas = document.getElementsByTagName("canvas")[0];
    mapCtx = mapCanvas!.getContext("2d")!;

    objectCanvas = document.getElementsByTagName("canvas")[1];
    objectCtx = objectCanvas!.getContext("2d")!;

    // drawingCanvas = document.getElementsByTagName("canvas")[2];
    // drawingCtx = drawingCanvas!.getContext("2d")!;

    // fps calculation
    fpsInterval = 1000 / targetFps;
    then = window.performance.now();
    startTime = then;

    console.log("MapModule");

    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);

      // game logic

      // calc elapsed time since last loop

      now = window.performance.now();
      elapsed = now - then;

      // if enough time has elapsed, draw the next frame

      if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        var sinceStart = now - startTime;
        var currentFps =
          Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;

        setFpsState(currentFps);

        // drawing the frames
        draw();
      }
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ----- HTML -----

  return (
    <div
      id="container"
      className="flex flex-col w-full overflow-hidden border-solid border-2 border-red-600"
    >
      <div
        style={{
          position: "relative",
          width: screenWidth + "px",
          height: screenHeight + "px",
          left: offset.x + "px",
          top: offset.y + "px",
        }}
        onMouseDown={(e) => {
          handleMouseDown(e as any);
        }}
        onMouseUp={(e) => {
          handleMouseUp(e as any);
        }}
        onMouseLeave={(e) => {
          handleMouseUp(e as any);
        }}
        onMouseMove={(e) => {
          handleMouseMove(e as any);
        }}
        onWheel={(e) => {
          handleMouseWheel(e as any);
        }}
      >
        <canvas
          style={{
            position: "absolute",
          }}
          width={screenWidth}
          height={screenHeight}
        />
        <canvas
          style={{
            position: "absolute",
          }}
          width={screenWidth}
          height={screenHeight}
        />
        {/* <canvas
          style={{
            position: "absolute",
          }}
          width={screenWidth}
          height={screenHeight}
        /> */}
      </div>
    </div>
  );
}
