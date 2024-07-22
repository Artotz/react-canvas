import { useEffect, useState } from "react";
import MissionMenu from "../MissionMenu/MissionMenu";

import "../../utils/GameVariables";
import {
  commandHistory,
  mapsArray,
  miniMap,
  player,
  raycastingPhoto,
} from "../../utils/GameVariables";
import { ScreenStrip } from "../RaycastingModule/RaycastingPhotoModule";

const p = -666;
const x = -1;

const someMaps = [
  [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, x, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, p, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

export default function DesktopInterface() {
  const [playing, setPlaying] = useState(false);

  const loadMap = (_map: number) => {
    mapsArray.missionMap = someMaps[_map];
    resetMap();
  };

  const resetMap = () => {
    mapsArray.mapsHeight = mapsArray.missionMap.length;
    mapsArray.mapsWidth = mapsArray.missionMap[0].length;

    mapsArray.viewingMap.length = 0;
    mapsArray.drawingMap.length = 0;

    let startingPosition = { x: 1.5, y: 1.5 };

    for (let i = 0; i < mapsArray.mapsHeight; i++) {
      for (let j = 0; j < mapsArray.mapsWidth; j++) {
        if (mapsArray.missionMap[i][j] == -666)
          startingPosition = { x: j, y: i };
      }

      let arr = Array<number>(mapsArray.mapsWidth);
      arr.fill(0);
      mapsArray.viewingMap.push([...arr]);
      mapsArray.drawingMap.push([...arr]);
    }

    // console.log(mapsArray.missionMap);
    // console.log(mapsArray.drawingMap);

    Object.assign(player, {
      x: startingPosition.x + 0.5, // current x, y position
      y: startingPosition.y + 0.5,
      dir: 0, // the direction that the player is turning, either -1 for left or 1 for right.
      rot: 0, // the current angle of rotation
      speed: 0, // is the playing moving forward (speed = 1) or backwards (speed = -1).
      moveSpeed: 0.05, // how far (in map units) does the player move each step/update
      rotSpeed: (6 * Math.PI) / 180, // how much does the player rotate each step/update (in radians)
      fuel: 100, // battery whatever
      hp: 100, // durability
      showingPosition: 0, // frames displaying position
    });

    commandHistory.length = 0;

    Object.assign(
      {
        trigger: false,
        cover: 0,
        photo: Array<ScreenStrip>(),
      },
      raycastingPhoto,
    );

    Object.assign(
      {
        offsetX: 0,
        offsetY: 0,
        drawingOffsetX: 0,
        drawingOffsetY: 0,
        scale: 15,
      },
      miniMap,
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-black justify-center items-center text-green-500">
      {/* DESKTOP */}
      <div className="flex w-full h-full gap-4 p-4">
        {/* BUTTONS */}
        <div className="grid grid-rows-6 grid-flow-col h-full gap-4">
          {Array(7)
            .fill(0)
            .map((v, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    loadMap(i);
                    setPlaying(true);
                  }}
                  className="flex flex-col w-content w-16 h-20 border-green-500 border-solid border-2 hover:bg-green-500 hover:text-black justify-center items-center cursor-pointer select-none p-2 gap-2"
                >
                  <div className="flex w-full h-full bg-blue-500"></div>
                  <div className="flex justify-center">{i}</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* TASK BAR */}
      <div className="flex w-full h-12 border-solid border-2 border-green-500 p-2">
        <div className="flex w-content flex-col border-green-500 border-solid border-2 hover:bg-green-500 hover:text-black justify-center items-center cursor-pointer select-none">
          <div className="flex px-2">start</div>
        </div>
      </div>

      {/* APPLICATIONS' WINDOWS */}
      {playing == true && (
        <div className="absolute full-size p-8 pb-16 z-999">
          <div className="flex flex-col full-size bg-green-500 border-solid border-2 border-green-500">
            <div className="flex w-full h-12 p-2 justify-between border-solid border-2 border-black">
              <div className="flex text-xl text-black font-bold">
                mission.exe
              </div>
              <div
                onClick={() => {
                  setPlaying(false);
                }}
                className="flex px-2 border-solid border-2 border-black text-black hover:bg-black hover:text-green-500 cursor-pointer select-none"
              >
                X
              </div>
            </div>
            <div className="flex full-size overflow-y-hidden">
              <MissionMenu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
