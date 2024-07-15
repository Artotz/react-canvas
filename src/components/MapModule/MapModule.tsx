import { createRef, useEffect, useRef, useState } from "react";
import {
  drawingMap,
  // drawingMouse,
  map,
  mapHeight,
  mapWidth,
  miniMap,
  moduleFocus,
  player,
  raycastingRays,
} from "../../utils/GameVariables";

import useWindowResize from "../../hooks/useWindowResize";

export type MapModuleProps = {
  _screenWidth?: number;
  _screenHeight?: number;
  _targetFps?: number;
  moduleIndex: number;
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
  moduleIndex = 0,
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

  // const screenWidth = _screenWidth;
  // const screenHeight = _screenHeight;

  const containerRef = createRef<HTMLDivElement>();

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

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

        if (drawingMap[x][y] == 1) {
          mapCtx.fillStyle = "rgb(200,100,100)";
          mapCtx.fillRect(
            // ... then draw a block on the minimap
            x * miniMap.scale,
            y * miniMap.scale,
            miniMap.scale,
            miniMap.scale
          );
          continue;
        }

        if (wall > 0) {
          // if there is a wall block at this (x,y) ...

          mapCtx.fillStyle = "rgb(200,200,200)";
          mapCtx.fillRect(
            // ... then draw a block on the minimap
            x * miniMap.scale,
            y * miniMap.scale,
            miniMap.scale,
            miniMap.scale
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
      2 * Math.PI
    );
    objectCtx.fill();

    objectCtx.strokeStyle = "red";
    objectCtx.beginPath();
    objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
    objectCtx.lineTo(
      (player.x + Math.cos(player.rot)) * miniMap.scale,
      (player.y + Math.sin(player.rot)) * miniMap.scale
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

    if (moduleFocus[moduleIndex] == 1) {
      //if (true) {
      miniMap.drawingOffsetX = miniMap.offsetX;
      miniMap.drawingOffsetY = miniMap.offsetY;
    } else {
      miniMap.drawingOffsetX =
        -player.x * miniMap.scale + mapCtx.canvas.width / 2;
      miniMap.drawingOffsetY =
        -player.y * miniMap.scale + mapCtx.canvas.height / 2;
    }

    mapCtx.translate(miniMap.drawingOffsetX, miniMap.drawingOffsetY);
    objectCtx.translate(miniMap.drawingOffsetX, miniMap.drawingOffsetY);

    // draw rays
    // for (var i = 0; i < raycastingRays.length; i++) {
    //   drawRay(raycastingRays[i].x, raycastingRays[i].y);
    // }

    drawMiniMap();
    drawPlayer();

    mapCtx.setTransform(1, 0, 0, 1, 0, 0);
    objectCtx.setTransform(1, 0, 0, 1, 0, 0);
  };

  // ----- MOUSE -----

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button == 0) {
      // let click = {
      //   x: Math.floor((e.nativeEvent.layerX - miniMap.offsetX) / miniMap.scale),
      //   y: Math.floor((e.nativeEvent.layerY - miniMap.offsetY) / miniMap.scale),
      // };
      // console.log(click);
    } else if (e.button == 1) {
      setLastClick({
        x: e.clientX - miniMap.offsetX,
        y: e.clientY - miniMap.offsetY,
      });
    }
    // else if (e.button == 2) {
    //   miniMap.offsetX = 0;
    //   miniMap.offsetY = 0;
    // }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button == 0) {
      //drawingMouse.pressed = false;
    } else if (e.button == 1) {
      setLastClick({
        x: 0,
        y: 0,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (lastClick.x !== 0 && lastClick.y !== 0) {
      miniMap.offsetX = -lastClick.x + e.clientX;
      miniMap.offsetY = -lastClick.y + e.clientY;
    }

    if (e.buttons == 1) {
      let click = {
        x: Math.floor(
          (e.nativeEvent.layerX - miniMap.drawingOffsetX) / miniMap.scale
        ),
        y: Math.floor(
          (e.nativeEvent.layerY - miniMap.drawingOffsetY) / miniMap.scale
        ),
      };
      if (
        click.x < mapWidth &&
        click.y < mapHeight &&
        click.x >= 0 &&
        click.y >= 0
      )
        drawingMap[click.x][click.y] = drawingMap[click.x][click.y] = 1;
    } else if (e.buttons == 2) {
      let click = {
        x: Math.floor(
          (e.nativeEvent.layerX - miniMap.drawingOffsetX) / miniMap.scale
        ),
        y: Math.floor(
          (e.nativeEvent.layerY - miniMap.drawingOffsetY) / miniMap.scale
        ),
      };
      if (
        click.x < mapWidth &&
        click.y < mapHeight &&
        click.x >= 0 &&
        click.y >= 0
      )
        drawingMap[click.x][click.y] = drawingMap[click.x][click.y] = 0;
    }
  };

  const handleMouseWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) {
      miniMap.scale += miniMap.scale == 30 ? 0 : 1;
    } else if (e.deltaY < 0) {
      miniMap.scale -= miniMap.scale == 5 ? 0 : 1;
    }
  };

  // ----- USE EFFECT -----

  useEffect(() => {
    let animationFrameId: number;

    setScreenSize({
      width: containerRef.current!.clientWidth,
      height: containerRef.current!.clientHeight,
    });

    // referencing the canvas and contexts
    mapCanvas = document.getElementsByTagName("canvas")[0];
    mapCtx = mapCanvas!.getContext("2d")!;

    objectCanvas = document.getElementsByTagName("canvas")[1];
    objectCtx = objectCanvas!.getContext("2d")!;

    draw();

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
  }, [moduleFocus[moduleIndex]]);

  // ----- HTML -----

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full h-full overflow-hidden text-white"
      onResize={() => {
        console.log("resize");
      }}
    >
      frames: {frameCountState} fps: {fpsState}
      <div
        style={{
          position: "relative",
          width: screenSize.width + "px",
          height: screenSize.height + "px",
          border: "1px solid red",
        }}
        onMouseDown={(e) => {
          handleMouseDown(e);
        }}
        onMouseUp={(e) => {
          handleMouseUp(e);
        }}
        onMouseLeave={(e) => {
          handleMouseUp(e);
        }}
        onMouseMove={(e) => {
          handleMouseMove(e);
        }}
        onWheel={(e) => {
          handleMouseWheel(e);
        }}
      >
        <canvas
          style={{
            position: "absolute",
          }}
          width={screenSize.width}
          height={screenSize.height}
        />
        <canvas
          style={{
            position: "absolute",
          }}
          width={screenSize.width}
          height={screenSize.height}
        />
        {/* <canvas
          style={{
            position: "absolute",
          }}
          width={screenSize.width}
          height={screenSize.height}
        /> */}
      </div>
    </div>
  );
}
