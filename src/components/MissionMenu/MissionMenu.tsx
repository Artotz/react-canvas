import { createRef, useEffect, useState } from "react";
import { useKeybindings } from "../../hooks/useKeybindings";
import { player, mapsArray } from "../../utils/GameVariables";
import CLIModule from "../CLIModule/CLIModule";
import MapModule from "../MapModule/MapModule";
import Bruh from "../RaycastingModule/Bruh";
import RaycastingModule from "../RaycastingModule/RaycastingModule";
import RaycastingModule2 from "../RaycastingModule/RaycastingModule2";

//TODO: SYNC THE UPDATES FROM MODULES

export default function MissionMenu() {
  const [modules, setModules] = useState([0, 1, 2, 3]);

  const [youWon, setYouWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const ref1 = createRef<HTMLDivElement>();
  const ref2 = createRef<HTMLDivElement>();

  const [bigWindowSize, setBigWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [smallWindowSize, setSmallWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const [colors, setColors] = useState<string[]>([
    "#5f5",
    "#555",
    "#55f",
    "#ff5",
  ]);

  var frameBruh = 0;
  const [frameCountState, setFrameCountState] = useState(0);

  const [keyAux, setKeyAux] = useState(0);

  // ----- FPS CALCULATION -----
  var targetFps: number = 30,
    fpsInterval: number,
    startTime: number,
    now: number,
    then: number,
    elapsed: number;

  // ----- PLAYER MOVEMENT -----

  //KEYBINDING HOOK
  useKeybindings();

  const move = () => {
    // Player will move this far along
    // the current direction vector
    var moveStep = player.speed * player.moveSpeed;

    // Add rotation if player is rotating (player.dir != 0)
    player.rot += player.dir * player.rotSpeed;
    // player.rot =
    //   player.rot < 0
    //     ? 2 * Math.PI + player.rot
    //     : player.rot >= 2 * Math.PI
    //     ? player.rot - 2 * Math.PI
    //     : player.rot;

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

  useEffect(() => {
    setBigWindowSize({
      width: ref1.current!.clientWidth,
      height: ref1.current!.clientHeight,
    });
    setSmallWindowSize({
      width: ref2.current!.clientWidth,
      height: ref2.current!.clientHeight,
    });

    setKeyAux(Math.random());
    console.log("keyaux: " + keyAux);
  }, [ref1.current?.clientWidth, ref2.current?.clientWidth]);

  return (
    <div className="flex full-size bg-green-500 p-2 border-solid border-2 border-black">
      {!gameOver ? (
        <div className="grid grid-rows-3 grid-cols-4 gap-2 full-size">
          <div
            ref={ref1}
            key={keyAux}
            className={`flex flex-col full-size full-center border-solid border-2 border-black row-span-4 col-span-3 bg-[${colors[0]}]`}
          >
            {modules[0] == 0 && <CLIModule />}
            {modules[0] == 1 && (
              <MapModule
                width={bigWindowSize.width}
                height={bigWindowSize.height}
                focused={true}
              />
            )}
            {modules[0] == 2 && (
              <RaycastingModule2
                width={bigWindowSize.width}
                height={bigWindowSize.height}
                focused={true}
              />
            )}
            {modules[0] == 3 && (
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

          {[0, 1, 2].map((v, i) => {
            return (
              <div
                ref={i == 0 ? ref2 : null}
                key={i + 1 + keyAux}
                className={`flex flex-col full-size full-center border-solid border-2 border-black bg-[${
                  colors[i + 1]
                }]`}
                onClick={() => {
                  let aux = modules[0];
                  modules[0] = modules[i + 1];
                  modules[i + 1] = aux;
                }}
              >
                {modules[i + 1] == 0 && <CLIModule />}
                {modules[i + 1] == 1 && (
                  <MapModule
                    width={smallWindowSize.width}
                    height={smallWindowSize.height}
                    focused={false}
                  />
                )}
                {modules[i + 1] == 2 && (
                  <RaycastingModule2
                    width={smallWindowSize.width}
                    height={smallWindowSize.height}
                    focused={false}
                  />
                )}
                {modules[i + 1] == 3 && (
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
          {youWon ? "parebens bola" : "jogou mto"}
        </div>
      )}
    </div>
  );
}
