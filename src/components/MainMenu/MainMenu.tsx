import { useEffect, useState } from "react";
import RaycastingModule, {
  RaycastingModuleProps,
} from "../RaycastingModule/RaycastingModule";
import MapModule from "../MapModule/MapModule";

import {
  map,
  mapHeight,
  mapWidth,
  Player,
  player,
  twoPI,
} from "../../utils/GameVariables";
import { useKeybindings } from "../../hooks/useKeybindings";

export default function MainMenu() {
  const [rayCastingConfigs, setRayCastingConfigs] =
    useState<RaycastingModuleProps>({
      miniMapScale: 10,
      screenWidth: 480,
      screenHeight: 300,
      stripWidth: 80,
      fov: 60,
      targetFps: 30,
    });

  const [keyState, setKeyState] = useState(0);

  const bruh = () => {
    let inputs = document.getElementsByTagName("input");

    let arrayAux: number[] = [];

    for (let input of Array.from(inputs)) {
      arrayAux.push(parseInt(input.value));
    }

    let _rayCastingConfigs: RaycastingModuleProps = {
      miniMapScale: arrayAux[0],
      screenWidth: arrayAux[1],
      screenHeight: arrayAux[2],
      stripWidth: arrayAux[3],
      fov: arrayAux[4],
      targetFps: arrayAux[5],
    };

    setRayCastingConfigs(_rayCastingConfigs);
    setKeyState(Math.random());
  };

  var frameBruh = 0;
  const [frameCountState, setFrameCountState] = useState(0);

  var targetFps: number = 30,
    fpsInterval: number,
    startTime: number,
    now: number,
    then: number,
    elapsed: number;

  //KEYBINDING HOOK
  useKeybindings(player);
  // ----- PLAYER MOVEMENT -----

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

    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);

      // game logic
      // move();

      // calc elapsed time since last loop
      now = window.performance.now();
      elapsed = now - then;
      // if enough time has elapsed, draw the next frame
      if (elapsed > fpsInterval) {
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
    <div className="flex flex-row w-full h-full">
      <div className="flex w-1/2 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-black font-bold text-3xl"> TESTE </h1>
          <label id="title1">miniMapScale</label>
          <input
            type="text"
            name="title1"
            id="title1"
            defaultValue={rayCastingConfigs.miniMapScale}
          />

          <label id="title2">screenWidth</label>
          <input
            type="text"
            name="title2"
            id="title2"
            defaultValue={rayCastingConfigs.screenWidth}
          />

          <label id="title3">screenHeight</label>
          <input
            type="text"
            name="title3"
            id="title3"
            defaultValue={rayCastingConfigs.screenHeight}
          />

          <label id="title4">stripWidth</label>
          <input
            type="text"
            name="title4"
            id="title4"
            defaultValue={rayCastingConfigs.stripWidth}
          />

          <label id="title5">fov</label>
          <input
            type="text"
            name="title5"
            id="title5"
            defaultValue={rayCastingConfigs.fov}
          ></input>

          <label id="title6">targetFps</label>
          <input
            type="text"
            name="title6"
            id="title6"
            defaultValue={rayCastingConfigs.targetFps}
          ></input>

          <button
            className="border-black border-2 rounded-xl p-2 px-4 bg-blue-300"
            onClick={bruh}
          >
            bruh
          </button>

          <button
            className="border-black border-2 rounded-xl p-2 px-4 bg-blue-300"
            onClick={() => {
              player.x += 0.1;
              console.log();
            }}
          >
            move player
          </button>

          <div>{JSON.stringify(rayCastingConfigs)}</div>
          <div>{frameCountState}</div>
        </div>
      </div>
      <div className="flex flex-col w-1/2 bg-white pl-4">
        <MapModule key={keyState} />
        <RaycastingModule key={keyState + 1} />
      </div>
    </div>
  );
}
