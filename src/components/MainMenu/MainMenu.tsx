import { useState } from "react";
import RaycastingModule, {
  RaycastingModuleProps,
} from "../RaycastingModule/RaycastingModule";

export default function MainMenu() {
  const [rayCastingConfigs, setRayCastingConfigs] =
    useState<RaycastingModuleProps>({
      miniMapScale: 10,
      screenWidth: 480,
      screenHeight: 300,
      stripWidth: 80,
      fov: 60,
    });

  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex w-1/2 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-black font-bold text-3xl"> TESTE </h1>
          <label htmlFor="title1">Title1</label>
          <input type="text" name="title1" id="title1" />

          <label htmlFor="title2">Title2</label>
          <input type="text" name="title2" id="title2" />

          <label htmlFor="title3">Title3</label>
          <input type="text" name="title3" id="title3" />

          <button className="border-black border-2 rounded-xl p-2 px-4 bg-blue-300">
            bruh
          </button>

          <div>{JSON.stringify(rayCastingConfigs)}</div>
        </div>
      </div>
      <div className="flex w-1/2 bg-white pl-4">
        <RaycastingModule {...rayCastingConfigs} />
      </div>
    </div>
  );
}
