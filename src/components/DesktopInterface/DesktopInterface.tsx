import { useState } from "react";

import "../../utils/GameVariables";
import {
  changeCurrentMap,
  resetMap,
  unlockedMaps,
} from "../../utils/GameVariables";
import MissionMenu from "../MissionMenu/MissionMenu";
import StoreMenu from "../StoreMenu/StoreMenu";
import LoginMenu from "../LoginMenu/LoginMenu";

var app = "";

export default function DesktopInterface() {
  const [playing, setPlaying] = useState(false);

  const loadMap = (_map: number) => {
    if (unlockedMaps[_map]) {
      changeCurrentMap(_map);
      resetMap();
      setPlaying(true);
    }
  };

  const quitMission = () => {
    setPlaying(false);
    app = "";
  };

  return (
    <div className="flex flex-col w-full h-full bg-black justify-center items-center text-green-500 overflow-y-hidden">
      {/* DESKTOP */}
      <div className="flex w-full h-full gap-4 p-4">
        {/* BUTTONS */}
        <div className="grid grid-rows-6 grid-flow-col h-full gap-4">
          {/* ----- MISSIONS ----- */}
          {unlockedMaps.map((v, i) => {
            return (
              <div
                key={i}
                onClick={() => {
                  app = "mission";
                  loadMap(i);
                }}
                className={`flex flex-col w-content h-fit border-green-500 border-solid border-2 justify-center items-center select-none p-2 gap-2 ${
                  unlockedMaps[i]
                    ? "cursor-pointer hover:bg-green-500 hover:text-black"
                    : "cursor-not-allowed"
                }`}
              >
                <div
                  className={`flex w-8 h-8 ${
                    unlockedMaps[i] ? "bg-blue-500" : "bg-red-500"
                  }`}
                ></div>
                <div className="flex justify-center">lvl {i}</div>
              </div>
            );
          })}

          {/* ----- STORE ----- */}
          <div
            onClick={() => {
              app = "store";
              setPlaying(true);
            }}
            className="flex flex-col w-content h-fit border-green-500 border-solid border-2 hover:bg-green-500 hover:text-black justify-center items-center cursor-pointer select-none p-2 gap-2"
          >
            <div className="flex w-8 h-8 bg-blue-500"></div>
            <div className="flex justify-center">store</div>
          </div>

          {/* ----- STORAGE ----- */}
          <div
            onClick={() => {
              app = "storage";
              setPlaying(true);
            }}
            className="flex flex-col w-content h-fit border-green-500 border-solid border-2 hover:bg-green-500 hover:text-black justify-center items-center cursor-pointer select-none p-2 gap-2"
          >
            <div className="flex w-8 h-8 bg-blue-500"></div>
            <div className="flex justify-center">storage</div>
          </div>
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
        // ----- FULLSCREEN INVISIBLE OVERLAY -----
        <div
          className={`absolute full-size z-999 top-[000] duration-200 ${
            app == "mission" ? "" : "p-8 pb-16"
          }`}
        >
          {/* ----- APPLICATION WINDOW ----- */}
          <div className="flex flex-col full-size bg-green-500 border-solid border-2 border-green-500">
            {/* ----- WINDOW NAME BAR ----- */}
            {/* {app != "mission" && ( */}
            {true && (
              <div className="flex w-full h-12 p-2 justify-between border-solid border-2 border-black">
                <div className="flex text-xl text-black font-bold">
                  {app}.exe
                </div>
                <div className="flex gap-2">
                  <div
                    className="flex px-2 border-solid border-2 border-black text-black hover:bg-black hover:text-green-500 font-bold cursor-pointer select-none"
                    onClick={() => {
                      app = "";
                      setPlaying(false);
                    }}
                  >
                    X
                  </div>
                </div>
              </div>
            )}

            {/* ----- APPLICATION ----- */}
            <div className="flex full-size overflow-y-hidden bg-black">
              {app == "mission" && <MissionMenu quitMission={quitMission} />}
              {app == "store" && <StoreMenu />}
              {app == "storage" && <LoginMenu />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
