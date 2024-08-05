import { useEffect, useState } from "react";
import { commandHistory } from "../../utils/GameVariables";
import { checkCommands, commands } from "./CLICommands";
import { LoremIpsum } from "./LoremIpsum";

export type CommandLineType = {
  command: string;
  text: string;
};

export default function CLIModule({ focused = false, welcome = true }) {
  //var text = LoremIpsum;
  var delay = welcome ? 100 : 100;
  const userShellText = "C:\\Users\\" + JSON.parse(window.localStorage.getItem("username")!) + ">";
  var historyIndex = 0;

  const [currentText, setCurrentText] = useState("");

  const addCommand = (_command: string) => {
    commandHistory.unshift({
      command: _command,
      text: checkCommands(_command),
      currentText: "",
      textRollingIndex: -1,
    });
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    var input: HTMLInputElement;
    input = document.getElementById("input")! as HTMLInputElement;

    const trimmedInput = input.value.trim();
    // console.log(trimmedInput);
    // console.log(input.value);

    if (trimmedInput.match(/[^\s]/g) != null) {
      addCommand(trimmedInput);

      input.value = "";
    }
  };

  const rollText = () => { };

  useEffect(() => {
    rollText;
  }, [commandHistory.length]);

  const bindingsKeyDown = (e: KeyboardEvent) => {
    e = e || window.event;

    // Which key was pressed?
    //console.log(e.key);

    switch (e.key.toLowerCase()) {
      case "arrowup":
        e.preventDefault();
        let input1 = document.getElementById("input")! as HTMLInputElement;

        let aux1 = [""];
        commandHistory.map((v) => aux1.push(v.command));

        historyIndex += historyIndex < aux1.length - 1 ? 1 : 0;

        input1.value = aux1[historyIndex];

        break;

      case "arrowdown":
        e.preventDefault();
        let input2 = document.getElementById("input")! as HTMLInputElement;

        let aux2 = [""];
        commandHistory.map((v) => aux2.push(v.command));

        historyIndex -= historyIndex > 0 ? 1 : 0;

        input2.value = aux2[historyIndex];

        break;

      case "tab":
        e.preventDefault();
        let input3 = document.getElementById("input")! as HTMLInputElement;

        let cutAux = input3.value.split(" ");

        console.log(cutAux);
        if (cutAux[cutAux.length - 1] == "") break;

        if (cutAux.length == 1) {
          let _commandTitles: string[] = [];
          commands.map((v) => _commandTitles.push(v.title));

          for (let i = 0; i < _commandTitles.length; i++) {
            if (_commandTitles[i].startsWith(cutAux[0])) {
              input3.value +=
                _commandTitles[i].substring(cutAux[0].length) + " ";
              break;
            }
          }
        } else if (cutAux.length == 2) {
          let _commandOptions: string[] = [];

          commands.map((v) => {
            if (v.title == cutAux[0]) _commandOptions = [...v.options];
          });

          for (let i = 0; i < _commandOptions.length; i++) {
            if (_commandOptions[i].startsWith(cutAux[1])) {
              input3.value +=
                _commandOptions[i].substring(cutAux[1].length) + " ";
              break;
            }
          }
        }

        break;
      default:
        historyIndex = 0;
        break;
    }
  };

  useEffect(() => {
    if (focused) document.addEventListener("keydown", bindingsKeyDown);
    return () => {
      if (focused) document.removeEventListener("keydown", bindingsKeyDown);
    };
  }, []);

  return (
    /* ----- TERMINAL WRAPPER ----- */
    <div
      onClick={(e: any) => {
        e.preventDefault();

        if (document.getElementById("input"))
          document.getElementById("input")!.focus();

        return false;
      }}
      className="flex full-size overflow-y-hidden"
    >
      <div className="flex flex-col-reverse full-size bg-black select-none p-2 overflow-y-scroll no-scrollbar">
        {/* <div className="flex flex-col-reverse full-size bg-black select-none border-green-500 border-solid border-2 p-2 overflow-y-scroll no-scrollbar"> */}
        {/* ----- INPUT ----- */}
        {focused && (
          <form
            className="flex m-0 px-2 border-green-500 border-solid border-2 text-green-500"
            onSubmit={onSubmitForm}
          >
            {userShellText}
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
              className="flex flex-row w-full h-content px-2 pointer-events-none focus:outline-none bg-black"
            ></input>
            {/* <button onClick={addCommand} className="flex bg-white px-2">
          send
        </button> */}
          </form>
        )}

        {/* ----- COMMANDS ----- */}
        {commandHistory.map((v, i) => {
          return (
            <div
              key={i}
              className="flex flex-col w-full h-content px-2 text-left text-wrap break-all text-green-500 whitespace-pre border-green-500 border-solid border-2"
            >
              {v.command != "" && `${userShellText} ${v.command} \n`}
              {/* {i == 0 ? currentText + " <" : v.text + " <"} */}
              {v.text + " <"}
            </div>
          );
        })}

        {welcome && (
          <div className="flex flex-col w-full h-content px-2 text-left text-wrap break-all text-green-500 whitespace-pre border-green-500 border-solid border-2">
            <div className="flex">{'Welcome!\nTry "help" for commands.'}</div>
          </div>
        )}
      </div>
    </div>
  );
}
