import { useEffect, useState } from "react";
import { useKeybindings } from "../../hooks/useKeybindings";
import { map, mapHeight, mapWidth, player } from "../../utils/GameVariables";
import CLIModule from "../CLIModule/CLIModule";
import MapModule from "../MapModule/MapModule";
import RaycastingModule from "../RaycastingModule/RaycastingModule";

//TODO: SYNC THE UPDATES FROM MODULES

export default function MissionMenu() {
  const [focusedModule, setFocusedModule] = useState(0);

  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const bruh = ["#f55", "#5f5", "#55f", "#ff5", "#f5f"];
    setColors([...bruh]);
  }, [setColors]);

  var frameBruh = 0;
  const [frameCountState, setFrameCountState] = useState(0);

  // ----- FPS CALCULATION -----
  var targetFps: number = 30,
    fpsInterval: number,
    startTime: number,
    now: number,
    then: number,
    elapsed: number;

  // ----- PLAYER MOVEMENT -----

  //KEYBINDING HOOK
  useKeybindings(player);

  const move = () => {
    // Player will move this far along
    // the current direction vector
    var moveStep = player.speed * player.moveSpeed;

    // Add rotation if player is rotating (player.dir != 0)
    player.rot += player.dir * player.rotSpeed;

    // Calculate new player position with simple trigonometry
    var newX = player.x + Math.cos(player.rot) * moveStep;
    var newY = player.y + Math.sin(player.rot) * moveStep;

    if (isBlocking(newX, newY)) return;

    // Set new position
    player.x = newX;
    player.y = newY;
  };

  const isBlocking = (x: number, y: number) => {
    // first make sure that we cannot move outside the boundaries of the level
    if (y < 0 || y >= mapHeight || x < 0 || x >= mapWidth) return true;

    // return true if the map block is not 0, ie. if there is a blocking wall.
    return map[Math.floor(y)][Math.floor(x)] != 0;
  };

  // ----- RENDERING -----

  useEffect(() => {
    let animationFrameId: number;

    // fps calculation
    fpsInterval = 1000 / targetFps;
    then = window.performance.now();
    startTime = then;

    console.log("MissionMenu");

    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);

      // game logic
      // move();

      // calc elapsed time since last loop
      now = window.performance.now();
      elapsed = now - then;
      // if enough time has elapsed, draw the next frame
      if (elapsed > fpsInterval) {
        // game logic with fps
        move();

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);
        //var sinceStart = now - startTime;
        //var currentFps =
        //Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
        //setFpsState(currentFps);
        // drawing the frames
        // draw();

        frameBruh++;
        setFrameCountState(frameBruh);
      }
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="grid grid-rows-4 grid-cols-4 gap-4 full-size bg-white p-4 border-solid border-2 border-black">
      {colors.map((v, i) => {
        return (
          <div
            key={i}
            className={`flex flex-col full-size full-center border-solid border-2 border-black
             ${i == focusedModule ? "row-span-4 col-span-3 -order-1" : ""}`}
            style={{ backgroundColor: v }}
          >
            <button
              className={`flex flex-col full-size full-center ${
                i == focusedModule ? "" : ""
              }`}
              onClick={() => {
                setFocusedModule(i);
              }}
            >
              {i == 0 && <CLIModule />}
              {i == 1 && <RaycastingModule />}
              {i == 2 && <MapModule />}
            </button>
            {/* <button
              className="bg-white px-2 border-solid border-2 border-black rounded-xl"
              onClick={() => {
                setFocusedModule(i);
              }}
            >
              Focus
            </button> */}
          </div>
        );
      })}
    </div>
  );
}
