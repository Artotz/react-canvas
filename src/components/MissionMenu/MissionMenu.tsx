import { createRef, useEffect, useState } from "react";
import { useKeybindings } from "../../hooks/useKeybindings";
import {
  player,
  mapsArray,
  miniMap,
  gameOver,
  endGame,
  youWon,
} from "../../utils/GameVariables";
import CLIModule, { addSudoCommand } from "../CLIModule/CLIModule";
import MapModule from "../MapModule/MapModule";
import RaycastingModule2 from "../RaycastingModule/RaycastingModule2";
import RaycastingPhotoModule2 from "../RaycastingModule/RaycastingPhotoModule2";

//TODO: SYNC THE UPDATES FROM MODULES (?)

export default function MissionMenu({ quitMission = () => {} }) {
  const [modules, setModules] = useState([0, 1, 2, 3]);

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

  var frameCount = 0;
  const [frameCountState, setFrameCountState] = useState(0);

  // ----- FPS CALCULATION -----
  var targetFps: number = 30,
    fpsInterval: number,
    startTime: number,
    now: number,
    then: number,
    elapsed: number;

  // ----- JSX ELEMENTS ------

  const results = () => {
    if (!youWon) return signalLost();
    else return connectionEnded();
  };

  const signalLost = () => {
    return (
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
    );
  };

  const connectionEnded = () => {
    return (
      <div className="flex full-size full-center text-xl bg-black text-green-500 font-bold">
        CONNECTION ENDED
      </div>
    );
  };

  // ----- PLAYER MOVEMENT -----

  // const move = () => {
  //   // // Player will move this far along
  //   // // the current direction vector
  //   // var moveStep = player.speed * player.moveSpeed;
  //   // // Add rotation if player is rotating (player.dir != 0)
  //   // player.rot += player.dir * player.rotSpeed;
  //   // // player.rot =
  //   // //   player.rot < 0
  //   // //     ? 2 * Math.PI + player.rot
  //   // //     : player.rot >= 2 * Math.PI
  //   // //     ? player.rot - 2 * Math.PI
  //   // //     : player.rot;
  //   // // console.log(player.rot / (2 * Math.PI));
  //   // // Calculate new player position with simple trigonometry
  //   // var newX = player.x + Math.cos(player.rot) * moveStep;
  //   // var newY = player.y + Math.sin(player.rot) * moveStep;
  //   // if (isBlocking(newX, newY)) return;
  //   // // Set new position
  //   // player.x = newX;
  //   // player.y = newY;
  // };

  // const isBlocking = (x: number, y: number) => {
  //   // first make sure that we cannot move outside the boundaries of the level
  //   if (y < 0 || y >= mapsArray.mapsHeight || x < 0 || x >= mapsArray.mapsWidth)
  //     return true;

  //   // return true if the map block is not 0, ie. if there is a blocking wall.
  //   return mapsArray.missionMap[Math.floor(y)][Math.floor(x)] > 0;
  // };

  // ----- GAME LOGIC -----

  //TODO: FIX TO DELTA TIME
  const missionLogic = () => {
    if (!gameOver) {
      // move();

      // mapsArray.missionMap[4][3] = 2 * Math.sin(frameCount);

      player.fuel -= 0.025;
      player.fuel = player.fuel < 0 ? 0 : player.fuel;

      miniMap.showingPosition -= miniMap.showingPosition > 0 ? 1 : 0;

      if ((player.fuel <= 0 || player.hp <= 0) && !gameOver) {
        endGame(false);
      }
    }
  };

  // ----- RENDERING -----

  useEffect(() => {
    let animationFrameId: number;

    // fps calculation
    fpsInterval = 1000 / targetFps;
    then = window.performance.now();
    startTime = then;

    // console.log("MissionMenu");

    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);

      //TODO: ADJUST TO DELTA TIME
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

        frameCount++;
        setFrameCountState(frameCount);
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
  }, [ref1.current?.clientWidth, ref2.current?.clientWidth]);

  return (
    <div className="flex full-size bg-green-500 p-2 border-solid border-2 border-black">
      <div className="grid grid-rows-3 grid-cols-4 gap-2 full-size">
        <div
          ref={ref1}
          className={`flex flex-col full-size full-center border-solid border-2 border-black row-span-4 col-span-3`}
        >
          {modules[0] == 0 && (
            <CLIModule focused={true} quitMission={quitMission} />
          )}
          {modules[0] == 1 &&
            (!gameOver ? (
              <MapModule
                width={bigWindowSize.width}
                height={bigWindowSize.height}
                focused={true}
              />
            ) : (
              results()
            ))}
          {modules[0] == 2 &&
            (!gameOver ? (
              <RaycastingModule2
                width={bigWindowSize.width}
                height={bigWindowSize.height}
                focused={true}
              />
            ) : (
              results()
            ))}
          {modules[0] == 3 &&
            (!gameOver ? (
              <RaycastingPhotoModule2
                width={bigWindowSize.width}
                height={bigWindowSize.height}
                focused={true}
              />
            ) : (
              results()
            ))}
        </div>

        {[0, 1, 2].map((v, i) => {
          return (
            <div
              key={i}
              ref={i == 0 ? ref2 : null}
              className={`flex flex-col full-size full-center border-solid border-2 border-black`}
              onClick={() => {
                let aux = modules[0];
                modules[0] = modules[i + 1];
                modules[i + 1] = aux;
              }}
            >
              {modules[i + 1] == 0 && (
                <CLIModule focused={false} quitMission={quitMission} />
              )}
              {modules[i + 1] == 1 &&
                (!gameOver ? (
                  <MapModule
                    width={smallWindowSize.width}
                    height={smallWindowSize.height}
                    focused={false}
                  />
                ) : (
                  results()
                ))}
              {modules[i + 1] == 2 &&
                (!gameOver ? (
                  <RaycastingModule2
                    width={smallWindowSize.width}
                    height={smallWindowSize.height}
                    focused={false}
                  />
                ) : (
                  results()
                ))}
              {modules[i + 1] == 3 &&
                (!gameOver ? (
                  <RaycastingPhotoModule2
                    width={smallWindowSize.width}
                    height={smallWindowSize.height}
                    focused={false}
                  />
                ) : (
                  results()
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
