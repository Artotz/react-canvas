import { useEffect, useState } from "react";
import { map, mapHeight, mapWidth, player } from "../../utils/GameVariables";
import useWindowResize from "../../hooks/useWindowResize";

export type MapModuleProps = {
  miniMapScale: number;
  screenWidth: number;
  screenHeight: number;
  stripWidth: number;
  fov: number;
  targetFps: number;
};

MapModule.defaultProps = {
  miniMapScale: 5,
  screenWidth: 480,
  screenHeight: 300,
  stripWidth: 20,
  fov: 60,
  targetFps: 30,
};

export default function MapModule(props: MapModuleProps) {
  // ----- VARIABLES -----
  // ----- CANVAS (MINIMAP) -----

  var mapCanvas: HTMLCanvasElement | null;
  var mapCtx: CanvasRenderingContext2D;
  var objectCanvas: HTMLCanvasElement | null;
  var objectCtx: CanvasRenderingContext2D;

  var frameCount = 0;
  const [frameCountState, setFrameCountState] = useState(0);

  // ----- SIZING HELL -----

  const miniMapScale = props.miniMapScale;

  // const screenWidth = props.screenWidth;
  // const screenHeight = props.screenHeight;

  const windowSizeState = useWindowResize();

  const screenWidth = windowSizeState.width;
  const screenHeight = windowSizeState.height;

  //console.log(windowSizeState);

  // ----- MEMES -----

  var targetFps: number = props.targetFps,
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
            x * miniMapScale,
            y * miniMapScale,
            miniMapScale,
            miniMapScale,
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
      player.x * miniMapScale,
      player.y * miniMapScale,
      0.25 * miniMapScale,
      0,
      2 * Math.PI,
    );
    objectCtx.fill();

    objectCtx.strokeStyle = "red";
    objectCtx.beginPath();
    objectCtx.moveTo(player.x * miniMapScale, player.y * miniMapScale);
    objectCtx.lineTo(
      (player.x + Math.cos(player.rot)) * miniMapScale,
      (player.y + Math.sin(player.rot)) * miniMapScale,
    );
    objectCtx.closePath();
    objectCtx.stroke();
  };

  // const drawRay = (rayX: number, rayY: number) => {
  //   objectCtx.strokeStyle = "rgba(0,100,0,0.3)";
  //   objectCtx.lineWidth = 0.5;
  //   objectCtx.beginPath();
  //   objectCtx.moveTo(player.x * miniMapScale, player.y * miniMapScale);
  //   objectCtx.lineTo(rayX * miniMapScale, rayY * miniMapScale);
  //   objectCtx.closePath();
  //   objectCtx.stroke();
  // };

  const draw = () => {
    setFrameCountState(frameCount);
    //console.log(frameCountState);

    mapCtx.clearRect(0, 0, mapCtx.canvas.width, mapCtx.canvas.height);
    objectCtx.clearRect(0, 0, objectCtx.canvas.width, objectCtx.canvas.height);

    drawMiniMap();
    drawPlayer();

    // console.log(document.getElementById("container")?.clientWidth);
    // console.log(document.getElementById("container")?.clientHeight);
  };

  // ----- USE EFFECT -----

  useEffect(() => {
    let animationFrameId: number;

    // referencing the canvas and contexts
    mapCanvas = document.getElementsByTagName("canvas")[0];
    mapCtx = mapCanvas!.getContext("2d")!;

    objectCanvas = document.getElementsByTagName("canvas")[1];
    objectCtx = objectCanvas!.getContext("2d")!;

    // fps calculation
    fpsInterval = 1000 / targetFps;
    then = window.performance.now();
    startTime = then;

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
    <div id="container" className="flex flex-col w-full overflow-hidden">
      <div
        style={{
          position: "relative",
          width: screenWidth + "px",
          height: screenHeight + "px",
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
      </div>
    </div>
  );
}
