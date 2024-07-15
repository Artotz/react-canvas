import { useEffect, useState } from "react";
import { checkCommands } from "./CLICommands";
import { LoremIpsum } from "./LoremIpsum";

type CommandLineType = {
  command: string;
  text: string;
  currentText: string;
  textRollingIndex: number;
};

export default function CLIModule() {
  //var text = LoremIpsum;
  var delay = 50;

  const [commandHistory, setCommandHistory] = useState<CommandLineType[]>([]);
  const [reloadAux, setReloadAux] = useState(0);

  const addCommand = () => {
    var input: HTMLInputElement;
    input = document.getElementById("input")! as HTMLInputElement;

    if (input.value.match(/[^\s]/g) != null) {
      setCommandHistory([
        {
          command: input.value,
          text: checkCommands(input.value),
          currentText: "",
          textRollingIndex: -1,
        },
        ...commandHistory,
      ]);

      console.log(input.value);

      input.value = "";
    }
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
    <div
      onClick={(e: any) => {
        e.preventDefault();

        document.getElementById("input")!.focus();

        return false;
      }}
      className="flex flex-col-reverse w-full h-full bg-black select-none border-green-500 border-solid border-2 p-2 gap-2 overflow-y-scroll no-scrollbar"
    >
      {/* ----- INPUT ----- */}
      <form className="flex m-0" onSubmit={onSubmitForm}>
        <input
          id="input"
          type="text"
          spellCheck="false"
          autoFocus
          onPaste={(e: any) => {
            e.preventDefault();
            return false;
          }}
          onCut={(e: any) => {
            e.preventDefault();
            return false;
          }}
          onDrop={(e: any) => {
            e.preventDefault();
            return false;
          }}
          className="flex flex-row w-full h-content px-2 pointer-events-none focus:outline-none bg-black text-green-500 border-green-500 border-solid border-2"
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
            className="flex flex-col w-full h-content px-2 text-left text-wrap break-all text-green-500 whitespace-pre border-green-500 border-solid border-2"
          >
            <div className="flex">{`${v.command}`}</div>
            {i == 0 ? v.currentText + " <" : v.text + " <"}
          </div>
        );
      })}
    </div>
  );
}
