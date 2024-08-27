import { createRef, useEffect, useState } from "react";
import {
  // drawingMouse,
  mapsArray,
  maxRayCastingVideo,
  miniMap,
  player,
  rayCastingVideo,
  raycastingRays,
} from "../../utils/GameVariables";
import { Categories, getCurrentUpgrade } from "../StoreMenu/StoreItems";

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
        // var cell = mapsArray.viewingMap[y][x];
        var cell = mapsArray.missionMap[y][x];

        if (cell > -999) {
          if (cell <= 0) {
            // if there is a wall block at this (x,y) ...
            if (
              cell == -1 &&
              getCurrentUpgrade(Categories.MapModule, "scan Threat Detection") >
                0
            ) {
              mapCtx.fillStyle = "rgb(150,100,100)";
            } else if (cell == -420) {
              mapCtx.fillStyle = "rgb(100,150,100)";
            } else {
              mapCtx.fillStyle = "rgb(150,150,150)";
            }
            mapCtx.fillRect(
              // ... then draw a block on the minimap
              x * miniMap.scale,
              y * miniMap.scale,
              miniMap.scale,
              miniMap.scale
            );
          } else if (cell > 0) {
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

          if (mapsArray.drawingMap[y][x] == 1) {
            mapCtx.fillStyle = "rgb(200,100,100,0.5)";
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
    }

    // map outline

    // objectCtx.strokeStyle = "black";
    // objectCtx.beginPath();
    // objectCtx.rect(
    //   0,
    //   0,
    //   mapsArray.mapsWidth * miniMap.scale,
    //   mapsArray.mapsHeight * miniMap.scale
    // );
    // objectCtx.stroke();
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
      2 * Math.PI
    );
    objectCtx.fill();

    // player rotation
    //@UPGRADE
    if (getCurrentUpgrade(Categories.MapModule, "Player Direction") > 0) {
      objectCtx.strokeStyle = "red";
      objectCtx.beginPath();
      objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
      objectCtx.lineTo(
        (player.x + Math.cos(player.rot)) * miniMap.scale,
        (player.y + Math.sin(player.rot)) * miniMap.scale
      );
      objectCtx.closePath();
      objectCtx.stroke();
      if (getCurrentUpgrade(Categories.MapModule, "Player Direction") == 1) {
        objectCtx.beginPath();
        objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
        objectCtx.lineTo(
          (player.x + Math.cos(player.rot - Math.PI / 4)) * miniMap.scale,
          (player.y + Math.sin(player.rot - Math.PI / 4)) * miniMap.scale
        );
        objectCtx.closePath();
        objectCtx.stroke();

        objectCtx.beginPath();
        objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
        objectCtx.lineTo(
          (player.x + Math.cos(player.rot + Math.PI / 4)) * miniMap.scale,
          (player.y + Math.sin(player.rot + Math.PI / 4)) * miniMap.scale
        );
        objectCtx.closePath();
        objectCtx.stroke();
      }
    }

    // player position glow
    // arbitrary numbers watch out
    //@UPGRADE
    // if (getCurrentUpgrade(Categories.MapModule, "Player Position") < Infinity) {
    //   objectCtx.strokeStyle = "red";

    //   objectCtx.beginPath();
    //   objectCtx.arc(
    //     // draw a dot at the current player position
    //     player.x * miniMap.scale,
    //     player.y * miniMap.scale,
    //     (25 - (miniMap.showingPosition % 25)) * miniMap.scale,
    //     0,
    //     2 * Math.PI
    //   );
    //   objectCtx.stroke();
    // }
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

    var centerAux;

    // center on center
    centerAux = {
      x: mapCtx.canvas.width / 2,
      y: mapCtx.canvas.height / 2,
    };

    // center on player
    if (getCurrentUpgrade(Categories.MapModule, "Center minimap on ROB-I") > 0)
      centerAux = {
        x: -player.x * miniMap.scale + mapCtx.canvas.width / 2,
        y: -player.y * miniMap.scale + mapCtx.canvas.height / 2,
      };

    if (focused) {
      miniMap.drawingOffsetX = centerAux.x + miniMap.offsetX;
      miniMap.drawingOffsetY = centerAux.y + miniMap.offsetY;
    } else {
      miniMap.drawingOffsetX = centerAux.x;
      miniMap.drawingOffsetY = centerAux.y;
    }

    mapCtx.translate(miniMap.drawingOffsetX, miniMap.drawingOffsetY);
    objectCtx.translate(miniMap.drawingOffsetX, miniMap.drawingOffsetY);

    // draw rays
    // for (var i = 0; i < raycastingRays.length; i++) {
    //   drawRay(raycastingRays[i].x, raycastingRays[i].y);
    // }

    drawMiniMap();
    if (miniMap.showingPosition > 0) drawPlayer();

    // SPRITE EXAMPLE

    // objectCtx.strokeStyle = "blue";
    // objectCtx.beginPath();
    // objectCtx.moveTo(player.x * miniMap.scale, player.y * miniMap.scale);
    // objectCtx.lineTo(
    //   spriteExample.x * miniMap.scale,
    //   spriteExample.y * miniMap.scale,
    // );
    // objectCtx.closePath();
    // objectCtx.stroke();

    // objectCtx.fillStyle = "blue";
    // objectCtx.beginPath();
    // objectCtx.arc(
    //   spriteExample.x * miniMap.scale,
    //   spriteExample.y * miniMap.scale,
    //   0.25 * miniMap.scale,
    //   0,
    //   2 * Math.PI,
    // );
    // objectCtx.fill();

    mapCtx.setTransform(1, 0, 0, 1, 0, 0);
    objectCtx.setTransform(1, 0, 0, 1, 0, 0);

    mapCtx.font = "20px monospace";
    mapCtx.fillStyle = "red";
    mapCtx.fillText("fps: " + fps, 10, 30);

    // HUD -----
    mapCtx.font = "12px monospace";

    if (
      getCurrentUpgrade(Categories.MapModule, "video HUD") +
        getCurrentUpgrade(Categories.MapModule, "position HUD") +
        getCurrentUpgrade(Categories.MapModule, "fuel HUD") +
        getCurrentUpgrade(Categories.MapModule, "integrity HUD") >
      0
    ) {
      mapCtx.fillStyle = "black";
      mapCtx.fillRect(
        0,
        mapCtx.canvas.height - 10 * 4,
        mapCtx.canvas.width,
        10 * 4
      );
    }

    if (getCurrentUpgrade(Categories.MapModule, "video HUD") > 0) {
      mapCtx.fillStyle = "blue";
      mapCtx.fillRect(
        0,
        mapCtx.canvas.height - 10,
        mapCtx.canvas.width * (rayCastingVideo / maxRayCastingVideo),
        10
      );
      mapCtx.fillStyle = "white";
      mapCtx.fillText("video", 8, mapCtx.canvas.height - 0);
    }

    if (getCurrentUpgrade(Categories.MapModule, "position HUD") > 0) {
      mapCtx.fillStyle = "red";
      mapCtx.fillRect(
        0,
        mapCtx.canvas.height - 10 * 2,
        mapCtx.canvas.width *
          (miniMap.showingPosition / miniMap.maxShowingPosition),
        10
      );
      mapCtx.fillStyle = "white";
      mapCtx.fillText("position", 8, mapCtx.canvas.height - 10 * 1);
    }

    if (getCurrentUpgrade(Categories.MapModule, "fuel HUD") > 0) {
      mapCtx.fillStyle = "rgb(120,120,20)";
      mapCtx.fillRect(
        0,
        mapCtx.canvas.height - 10 * 3,
        mapCtx.canvas.width * (player.fuel / player.maxFuel),
        10
      );
      mapCtx.fillStyle = "white";
      mapCtx.fillText("fuel", 8, mapCtx.canvas.height - 10 * 2);
    }

    if (getCurrentUpgrade(Categories.MapModule, "integrity HUD") > 0) {
      mapCtx.fillStyle = "green";
      mapCtx.fillRect(
        0,
        mapCtx.canvas.height - 10 * 4,
        mapCtx.canvas.width * (player.hp / player.maxHp),
        10
      );
      mapCtx.fillStyle = "white";
      mapCtx.fillText("integrity", 8, mapCtx.canvas.height - 10 * 3);
    }
  };

  // ----- MOUSE -----

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button == 0) {
      // let click = {
      //   x: Math.floor((e.nativeEvent.layerX - miniMap.offsetX) / miniMap.scale),
      //   y: Math.floor((e.nativeEvent.layerY - miniMap.offsetY) / miniMap.scale),
      // };
      // console.log(click);
      //@upgrade
    } else if (
      e.button == 1 &&
      getCurrentUpgrade(Categories.MapModule, "Move Map") > 0
    ) {
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
    if (getCurrentUpgrade(Categories.MapModule, "Draw on Map") > 0) {
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
          click.x < mapsArray.mapsWidth &&
          click.y < mapsArray.mapsHeight &&
          click.x >= 0 &&
          click.y >= 0
        )
          mapsArray.drawingMap[click.y][click.x] = 1;
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
          click.x < mapsArray.mapsWidth &&
          click.y < mapsArray.mapsHeight &&
          click.x >= 0 &&
          click.y >= 0
        )
          mapsArray.drawingMap[click.y][click.x] = 0;
      }
    }
  };

  const handleMouseWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (getCurrentUpgrade(Categories.MapModule, "Map Zoom") > 0) {
      if (e.deltaY > 0) {
        miniMap.scale += miniMap.scale == 30 ? 0 : 1;
      } else if (e.deltaY < 0) {
        miniMap.scale -= miniMap.scale == 5 ? 0 : 1;
      }
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

    // console.log("MapModule");

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
          // border: "2px solid blue",
        }}
        onMouseDown={(e) => {
          if (focused) handleMouseDown(e);
        }}
        onMouseUp={(e) => {
          if (focused) handleMouseUp(e);
        }}
        onMouseLeave={(e) => {
          if (focused) handleMouseUp(e);
        }}
        onMouseMove={(e) => {
          if (focused) handleMouseMove(e);
        }}
        onWheel={(e) => {
          if (focused) handleMouseWheel(e);
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
