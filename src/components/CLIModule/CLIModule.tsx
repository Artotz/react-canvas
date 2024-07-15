import { useEffect, useState } from "react";
import { LoremIpsum } from "./LoremIpsum";

type CommandType = {
  title: string;
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
      {
        title: "@artotz: " + input.value,
        text: "Command not found.",
        currentText: "",
        textRollingIndex: -1,
      },
      ...commandHistory,
    ]);

    input.value = "";
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addCommand();
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
    <div className="flex flex-col-reverse w-full h-full text-xl bg-black border-green-500 border-solid border-2 p-2 gap-2 overflow-y-scroll no-scrollbar">
      {/* ----- INPUT ----- */}
      <form
        className="flex m-0 px-2 border-green-500 border-solid border-2 text-green-500"
        onSubmit={onSubmitForm}
      >
        @artotz:
        <input
          id="input"
          className="flex flex-row w-full ml-2 h-content  focus:outline-none bg-black"
        ></input>
        {/* <button onClick={addCommand} className="flex bg-white px-2">
          send
        </button> */}
      </form>

      {/* ----- COMMANDS ----- */}
      {commandHistory.map((v, i) => {
        return (
          <div
            key={i == 0 ? reloadAux : i}
            className="flex flex-col w-full h-content px-2 text-left text-wrap break-all text-green-500 border-green-500 border-solid border-2"
          >
            <div className="flex">{v.title}</div>
            <div className="flex">
              {i == 0 ? v.currentText + " <" : v.text + " <"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
