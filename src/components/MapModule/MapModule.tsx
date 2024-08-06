import { createRef, useEffect, useState } from "react";
import {
  // drawingMouse,
  mapsArray,
  miniMap,
  player,
  raycastingRays,
  spriteExample,
} from "../../utils/GameVariables";

export type MapModuleProps = {
  width?: number;
  height?: number;
  _targetFps?: number;
  focused: boolean;
};

export default function MapModule({
  width = 0,
  height = 0,
  _targetFps = 30,
  focused = false,
}: MapModuleProps) {
  // ----- VARIABLES -----
  // ----- CANVAS (MINIMAP) -----

  var mapCanvas: HTMLCanvasElement | null;
  var mapCtx: CanvasRenderingContext2D;
  var objectCanvas: HTMLCanvasElement | null;
  var objectCtx: CanvasRenderingContext2D;

  var frameCount = 0;

  // ----- SIZING HELL -----

  // const screenWidth = _screenWidth;
  // const screenHeight = _screenHeight;

  const screenSize = { width: width, height: height };

  const [lastClick, setLastClick] = useState({ x: 0, y: 0 });

  // ----- MEMES -----

  var targetFps: number = _targetFps,
    fpsInterval: number,
    startTime: number,
    now: number,
    then: number,
    elapsed: number;

  var fps = 0;

  // ----- DRAWING -----

  const drawMiniMap = () => {
    for (var y = 0; y < mapsArray.mapsHeight; y++) {
      for (var x = 0; x < mapsArray.mapsWidth; x++) {
        var wall = mapsArray.viewingMap[y][x];

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

        if (mapsArray.drawingMap[y][x] == 1) {
          mapCtx.fillStyle = "rgb(200,100,100,0.5)";
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

    objectCtx.strokeStyle = "black";
    objectCtx.beginPath();
    objectCtx.rect(
      0,
      0,
      mapsArray.mapsWidth * miniMap.scale,
      mapsArray.mapsHeight * miniMap.scale,
    );
    objectCtx.stroke();
  };

  const drawPlayer = () => {
    // player body
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

    // player rotation
    objectCtx.strokeStyle = "red";
    objectCtx.beginPath();
    objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
    objectCtx.lineTo(
      (player.x + Math.cos(player.rot)) * miniMap.scale,
      (player.y + Math.sin(player.rot)) * miniMap.scale,
    );
    objectCtx.closePath();
    objectCtx.stroke();

    objectCtx.beginPath();
    objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
    objectCtx.lineTo(
      (player.x + Math.cos(player.rot - Math.PI / 4)) * miniMap.scale,
      (player.y + Math.sin(player.rot - Math.PI / 4)) * miniMap.scale,
    );
    objectCtx.closePath();
    objectCtx.stroke();

    objectCtx.beginPath();
    objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
    objectCtx.lineTo(
      (player.x + Math.cos(player.rot + Math.PI / 4)) * miniMap.scale,
      (player.y + Math.sin(player.rot + Math.PI / 4)) * miniMap.scale,
    );
    objectCtx.closePath();
    objectCtx.stroke();

    // player position glow
    // arbitrary numbers watch out
    objectCtx.fillStyle = "red";
    objectCtx.beginPath();
    objectCtx.arc(
      // draw a dot at the current player position
      player.x * miniMap.scale,
      player.y * miniMap.scale,
      (25 - (player.showingPosition % 25)) * miniMap.scale,
      0,
      2 * Math.PI,
    );
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
    mapCtx.clearRect(0, 0, mapCtx.canvas.width, mapCtx.canvas.height);
    objectCtx.clearRect(0, 0, objectCtx.canvas.width, objectCtx.canvas.height);

    const centerAux = {
      x: mapCtx.canvas.width / 2 - (mapsArray.mapsWidth / 2) * miniMap.scale,
      y: mapCtx.canvas.height / 2 - (mapsArray.mapsHeight / 2) * miniMap.scale,
    };

    if (focused) {
      //if (true) {
      miniMap.drawingOffsetX = centerAux.x + miniMap.offsetX;
      miniMap.drawingOffsetY = centerAux.y + miniMap.offsetY;
    } else {
      // center on player
      // miniMap.drawingOffsetX =
      //   -player.x * miniMap.scale + mapCtx.canvas.width / 2;
      // miniMap.drawingOffsetY =
      //   -player.y * miniMap.scale + mapCtx.canvas.height / 2;
      miniMap.drawingOffsetX = centerAux.x;
      miniMap.drawingOffsetY = centerAux.y;
      if (miniMap.offsetX != 0 || miniMap.offsetY != 0) {
        miniMap.offsetX = 0;
        miniMap.offsetY = 0;
      }
    }

    mapCtx.translate(miniMap.drawingOffsetX, miniMap.drawingOffsetY);
    objectCtx.translate(miniMap.drawingOffsetX, miniMap.drawingOffsetY);

    // draw rays
    for (var i = 0; i < raycastingRays.length; i++) {
      drawRay(raycastingRays[i].x, raycastingRays[i].y);
    }

    drawMiniMap();
    // if (player.showingPosition > 0) drawPlayer()

    objectCtx.strokeStyle = "blue";
    objectCtx.beginPath();
    objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
    objectCtx.lineTo(
      spriteExample.x * miniMap.scale,
      spriteExample.y * miniMap.scale,
    );
    objectCtx.closePath();
    objectCtx.stroke();

    objectCtx.fillStyle = "blue";
    objectCtx.beginPath();
    objectCtx.arc(
      spriteExample.x * miniMap.scale,
      spriteExample.y * miniMap.scale,
      0.25 * miniMap.scale,
      0,
      2 * Math.PI,
    );
    objectCtx.fill();

    drawPlayer();

    mapCtx.setTransform(1, 0, 0, 1, 0, 0);
    objectCtx.setTransform(1, 0, 0, 1, 0, 0);

    mapCtx.fillStyle = "red";
    mapCtx.beginPath();
    mapCtx.fillText("fps: " + fps, 10, 20);
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

  const handleMouseMove = (e: any) => {
    if (lastClick.x !== 0 && lastClick.y !== 0) {
      miniMap.offsetX = -lastClick.x + e.clientX;
      miniMap.offsetY = -lastClick.y + e.clientY;
    }

    if (e.buttons == 1) {
      let click = {
        x: Math.floor(
          (e.nativeEvent.layerX - miniMap.drawingOffsetX) / miniMap.scale,
        ),
        y: Math.floor(
          (e.nativeEvent.layerY - miniMap.drawingOffsetY) / miniMap.scale,
        ),
      };
      if (
        click.x < mapsArray.mapsWidth &&
        click.y < mapsArray.mapsHeight &&
        click.x >= 0 &&
        click.y >= 0
      )
        mapsArray.drawingMap[click.y][click.x] = mapsArray.drawingMap[click.y][
          click.x
        ] = 1;
    } else if (e.buttons == 2) {
      let click = {
        x: Math.floor(
          (e.nativeEvent.layerX - miniMap.drawingOffsetX) / miniMap.scale,
        ),
        y: Math.floor(
          (e.nativeEvent.layerY - miniMap.drawingOffsetY) / miniMap.scale,
        ),
      };
      if (
        click.x < mapsArray.mapsWidth &&
        click.y < mapsArray.mapsHeight &&
        click.x >= 0 &&
        click.y >= 0
      )
        mapsArray.drawingMap[click.y][click.x] = mapsArray.drawingMap[click.y][
          click.x
        ] = 0;
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

    // referencing the canvas and contexts
    mapCanvas = document.getElementById("mapCanvas") as HTMLCanvasElement;
    mapCtx = mapCanvas!.getContext("2d")!;

    objectCanvas = document.getElementById("objectCanvas") as HTMLCanvasElement;
    objectCtx = objectCanvas!.getContext("2d")!;

    mapCtx.font = "20px monospace";

    // fps calculation
    fpsInterval = 1000 / targetFps;
    then = window.performance.now();
    startTime = then;

    draw();

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

        fps = currentFps;

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
    <div className="flex flex-col full-size overflow-hidden text-white bg-gray-500">
      <div
        style={{
          position: "relative",
          width: screenSize.width + "px",
          height: screenSize.height + "px",
          border: "2px solid blue",
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
          id="mapCanvas"
          style={{
            position: "absolute",
          }}
          width={screenSize.width}
          height={screenSize.height}
        />
        <canvas
          id="objectCanvas"
          style={{
            position: "absolute",
          }}
          width={screenSize.width}
          height={screenSize.height}
        />
      </div>
    </div>
  );
}
