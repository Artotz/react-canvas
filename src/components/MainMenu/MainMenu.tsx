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
    };

    setRayCastingConfigs(_rayCastingConfigs);
    setKeyState(Math.random());
  };

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

          <button
            className="border-black border-2 rounded-xl p-2 px-4 bg-blue-300"
            onClick={bruh}
          >
            bruh
          </button>

          <div>{JSON.stringify(rayCastingConfigs)}</div>
        </div>
      </div>
      <div className="flex w-1/2 bg-white pl-4">
        <RaycastingModule key={keyState} {...rayCastingConfigs} />
      </div>
    </div>
  );
}
