import { useState } from "react";

import "../../utils/GameVariables";
import { resetMap, unlockedEntries } from "../../utils/GameVariables";
import MissionMenu from "../MissionMenu/MissionMenu";
import StoreMenu from "../StoreMenu/StoreMenu";

export default function DesktopInterface() {
  const [playing, setPlaying] = useState(false);
  const [app, setApp] = useState("");

  const loadMap = (entry: number) => {
    resetMap(unlockedEntries[entry].y, unlockedEntries[entry].x);

    setApp("mission");
    setPlaying(true);
  };

  const quitMission = () => {
    setPlaying(false);
    setApp("");
  };

  return (
    <div className="flex flex-col w-full h-full bg-black justify-center items-center text-green-500 overflow-y-hidden">
      {/* DESKTOP */}
      <div className="flex w-full h-full gap-4 p-4">
        {/* APPS */}
        <div className="grid grid-rows-6 grid-flow-col h-full gap-4">
          {/* ----- MISSIONS MENU ----- */}
          <div
            onClick={() => {
              setApp("missionsFolder");
              setPlaying(true);
            }}
            className="flex flex-col w-content h-fit border-green-500 border-solid border-2 hover:bg-green-500 hover:text-black justify-center items-center cursor-pointer select-none p-2 gap-2"
          >
            <div className="flex w-8 h-8 bg-blue-500"></div>
            <div className="flex justify-center">missions</div>
          </div>

          {/* ----- STORE ----- */}
          <div
            onClick={() => {
              setApp("store");
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
              setApp("storage");
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
          className={`absolute full-size z-999 top-[000] ${
            app == "mission" ? "" : "p-8 pb-16"
          }`}
        >
          {/* ----- APPLICATION WINDOW ----- */}
          <div className="flex flex-col full-size bg-green-500 border-solid border-2 border-green-500">
            {/* ----- WINDOW NAME BAR ----- */}
            {app != "mission" && (
              <div className="flex w-full h-12 p-2 justify-between border-solid border-2 border-black">
                <div className="flex text-xl text-black font-bold">
                  {app}.exe
                </div>
                <div className="flex gap-2">
                  <div
                    className="flex px-2 border-solid border-2 border-black text-black hover:bg-black hover:text-green-500 font-bold cursor-pointer select-none"
                    onClick={() => {
                      setApp("");
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
              {app == "missionsFolder" && (
                <div className="flex w-full h-full gap-4 p-4">
                  {/* BUTTONS */}
                  <div className="grid grid-rows-6 grid-flow-col h-full gap-4">
                    {/* ----- MISSIONS ----- */}
                    {unlockedEntries.map((v, i) => {
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            loadMap(i);
                          }}
                          className={`flex flex-col w-content h-fit border-green-500 border-solid border-2 justify-center items-center select-none p-2 gap-2 ${
                            unlockedEntries[i].isUnlocked
                              ? "cursor-pointer hover:bg-green-500 hover:text-black"
                              : "cursor-not-allowed"
                          }`}
                        >
                          <div
                            className={`flex w-8 h-8 ${
                              unlockedEntries[i].isUnlocked
                                ? "bg-blue-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <div className="flex justify-center">lvl {i}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {app == "store" && <StoreMenu />}
              {app == "storage" && (
                <div className="flex full-size full-center"> vazio </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
