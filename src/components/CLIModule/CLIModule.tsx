import { useEffect, useState } from "react";
import { LoremIpsum } from "./LoremIpsum";

type CommandType = {
  text: string;
  currentText: string;
  textRollingIndex: number;
};

export default function CLIModule() {
  var text = LoremIpsum;
  var delay = 50;

  const [commandHistory, setCommandHistory] = useState<CommandType[]>([]);

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
    let _cmds = [...commandHistory];

    for (var i = 0; i < _cmds.length; i++) {
      if (_cmds[i].textRollingIndex < _cmds[i].text.length - 1) {
        _cmds[i].currentText += _cmds[i].text[++_cmds[i].textRollingIndex];
      }

      console.log(_cmds[i].currentText);
    }

    setCommandHistory([..._cmds]);
  };

  useEffect(() => {
    console.log("bruh");
  }, []);

  return (
    /* ----- TERMINAL WRAPPER ----- */
    <div className="flex flex-col-reverse w-full h-full bg-green-500 border-green-500 border-solid border-2 p-2 gap-2 overflow-y-scroll no-scrollbar">
      {/* ----- INPUT ----- */}
      <div className="flex gap-2">
        <input
          id="input"
          className="flex flex-row w-full h-content px-2 border-black border-solid border-2"
        ></input>
        <button onClick={addCommand} className="flex bg-white px-2">
          send
        </button>
      </div>

      {/* ----- COMMANDS ----- */}
      {commandHistory.map((v, i) => {
        return (
          <div
            key={i}
            className="flex flex-row w-full h-content px-2 bg-white border-black border-solid border-2"
          >
            {v.text} .
          </div>
        );
      })}
    </div>
  );
}
