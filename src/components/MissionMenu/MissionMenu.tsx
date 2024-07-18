import { createRef, useEffect, useState } from "react";
import { useKeybindings } from "../../hooks/useKeybindings";
import {
  moduleFocus,
  player,
  raycastingRays,
  mapsArray,
} from "../../utils/GameVariables";
import CLIModule from "../CLIModule/CLIModule";
import MapModule from "../MapModule/MapModule";
import Bruh from "../RaycastingModule/Bruh";
import RaycastingModule from "../RaycastingModule/RaycastingModule";

//TODO: SYNC THE UPDATES FROM MODULES

export default function MissionMenu() {
  const [focusedModule, setFocusedModule] = useState(0);

  const [youWon, setYouWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const ref1 = createRef<HTMLDivElement>();
  const ref2 = createRef<HTMLDivElement>();

  const [colors, setColors] = useState<string[]>([
    "#5f5",
    "#555",
    "#55f",
    "#ff5",
  ]);

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
  //useKeybindings();

  const move = () => {
    // Player will move this far along
    // the current direction vector
    var moveStep = player.speed * player.moveSpeed;

    // Add rotation if player is rotating (player.dir != 0)
    player.rot += player.dir * player.rotSpeed;
    player.rot =
      player.rot < 0
        ? 2 * Math.PI - player.rot
        : player.rot >= 2 * Math.PI
          ? player.rot - 2 * Math.PI
          : player.rot;

    // console.log(player.rot / (2 * Math.PI));
    // Calculate new player position with simple trigonometry
    var newX = player.x + Math.cos(player.rot) * moveStep;
    var newY = player.y + Math.sin(player.rot) * moveStep;

    if (isBlocking(newX, newY)) return;

    // Set new position
    player.x = newX;
    player.y = newY;

    if (
      mapsArray.missionMap[Math.floor(player.y)][Math.floor(player.x)] == -1
    ) {
      setYouWon(true);
      setGameOver(true);
    }

    player.fuel -= 0.025;
    player.showingPosition -= player.showingPosition > 0 ? 1 : 0;

    if (player.fuel <= 0 || player.hp <= 0) setGameOver(true);
  };

  const isBlocking = (x: number, y: number) => {
    // first make sure that we cannot move outside the boundaries of the level
    if (y < 0 || y >= mapsArray.mapsHeight || x < 0 || x >= mapsArray.mapsWidth)
      return true;

    // return true if the map block is not 0, ie. if there is a blocking wall.
    return mapsArray.missionMap[Math.floor(y)][Math.floor(x)] > 0;
  };

  // ----- GAME LOGIC -----

  const missionLogic = () => {
    move();
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

        missionLogic();

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
    <div className="flex full-size bg-green-500 p-2 border-solid border-2 border-black">
      {!gameOver ? (
        <div className="grid grid-rows-3 grid-cols-4 gap-2 full-size">
          {colors.map((v, i) => {
            return (
              <div
                ref={i == 0 ? ref1 : ref2}
                key={i}
                className={`flex flex-col full-size full-center border-solid border-2 border-black
             ${i == focusedModule ? "row-span-4 col-span-3 -order-1" : ""}`}
                style={{ backgroundColor: v }}
                onClick={
                  i == focusedModule
                    ? () => {}
                    : () => {
                        moduleFocus[focusedModule] = 0;
                        moduleFocus[i] = 1;
                        setFocusedModule(i);
                      }
                }
              >
                {i == 0 && <CLIModule />}
                {i == 1 && <MapModule moduleIndex={1} />}
                {i == 2 && <Bruh moduleIndex={2} photo={true} />}
                {/* {i == 3 && <Bruh moduleIndex={3} photo={false} />} */}
                {i == 3 && (
                  <div
                    className="flex full-size full-center text-xl text-black font-bold"
                    style={{
                      backgroundColor:
                        "rgb(" +
                        (150 + 100 * Math.sin(frameCountState / 20)) +
                        "," +
                        30 +
                        "," +
                        30 +
                        ")",
                    }}
                  >
                    SIGNAL LOST
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex full-size full-center bg-black text-green-500">
          {youWon ? "parebens bola" : "voce morreu"}
        </div>
      )}
    </div>
  );
}
