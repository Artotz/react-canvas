import { useEffect, useState } from "react";
import { LoremIpsum } from "./LoremIpsum";

type CommandType = {
  text: string;
  currentText: string;
  textRollingIndex: number;
};

export default function CLIModule() {
  var text = LoremIpsum;
  var delay = 25;

  const [commandHistory, setCommandHistory] = useState<CommandType[]>([]);
  const [reloadAux, setReloadAux] = useState(0);

  const addCommand = () => {
    var input: HTMLInputElement;
    input = document.getElementById("input")! as HTMLInputElement;

    setCommandHistory([
      { text: input.value, currentText: "", textRollingIndex: -1 },
      ...commandHistory,
    ]);

    input.value = "";
  };

  const rollText = () => {
    if (commandHistory.length > 0) {
      let _cmds = [...commandHistory];

      if (_cmds[0].textRollingIndex < _cmds[0].text.length - 1) {
        _cmds[0].currentText += _cmds[0].text[++_cmds[0].textRollingIndex];
        if (_cmds[0].textRollingIndex < _cmds[0].text.length - 1)
          setTimeout(rollText, delay);
      }

      setReloadAux(Math.random());
    }
  };

  useEffect(rollText, [commandHistory]);

  return (
    /* ----- TERMINAL WRAPPER ----- */
    <div className="flex flex-col-reverse w-full h-full bg-black border-green-500 border-solid border-2 p-2 gap-2 overflow-y-scroll no-scrollbar">
      {/* ----- INPUT ----- */}
      <div className="flex gap-2">
        <input
          id="input"
          className="flex flex-row w-full h-content px-2 focus:outline-none bg-black text-green-500 border-green-500 border-solid border-2"
        ></input>
        <button onClick={addCommand} className="flex bg-white px-2">
          send
        </button>
      </div>

      {/* ----- COMMANDS ----- */}
      {commandHistory.map((v, i) => {
        return (
          <div
            key={i == 0 ? reloadAux : i}
            className="flex flex-row w-full h-content px-2 text-wrap break-all text-green-500 border-green-500 border-solid border-2"
          >
            {i == 0 ? v.currentText + " <" : v.text + " <"}
          </div>
        );
      })}
    </div>
  );
}