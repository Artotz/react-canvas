import { useEffect, useState } from "react";

export default function DesktopInterface() {
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  return (
    <div className="flex flex-col w-full h-full bg-black justify-center items-center text-green-500">
      {/* DESKTOP */}
      <div className="flex w-full h-full gap-4 p-4">
        {/* BUTTONS */}
        <div className="grid grid-rows-5 grid-flow-col h-full gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
            (v, i) => {
              return (
                <div
                  key={i}
                  className="flex flex-col w-16 h-20 border-green-500 border-solid border-2 hover:bg-green-500 hover:text-black justify-center items-end cursor-pointer select-none p-2 gap-2"
                >
                  <div className="flex w-full h-full bg-blue-500"></div>
                  <div className="flex ">bruh{v}</div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* TASK BAR */}
      <div className="flex w-full h-12 border-solid border-2 border-green-500 p-2">
        <div className="flex w-content flex-col border-green-500 border-solid border-2 hover:bg-green-500 hover:text-black justify-center items-center cursor-pointer select-none">
          <div className="flex px-2">iniciar</div>
        </div>
      </div>

      {/* APPLICATIONS' WINDOWS */}
      <div id="apps-windows">
        <div
          className={`absolute w-12 h-12 top-[${Math.floor(windowDimensions.height / 2)}px] left-[${Math.floor(windowDimensions.width / 2)}px] z-999 bg-red-500`}
        ></div>
      </div>
    </div>
  );
}
