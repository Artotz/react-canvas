import { useEffect, useRef, useState } from "react";
import {
  commandHistory,
  currentText,
  endGame,
  localUsername,
  missionPhase,
  setCurrentText,
} from "../../utils/GameVariables";
import { checkCommands, commands } from "./CLICommands";
import { LoremIpsum } from "../../utils/LoremIpsum";
import { Categories, getCurrentUpgrade } from "../StoreMenu/StoreItems";

export type CommandLineType = {
  command: string;
  text: string;
};

export const addSudoCommand = (_command: CommandLineType) => {
  setCurrentText("");
  commandHistory.unshift(_command);
};

export const addCommand = (_command: string): boolean => {
  if (
    commandHistory.length > 0 &&
    commandHistory[0].text.length > currentText.length
  )
    return false;

  setCurrentText("");
  commandHistory.unshift({
    command: _command,
    text: checkCommands(_command),
  });

  return true;
};

export const getLastPlayerCommand = () => {
  for (let i = 0; i < commandHistory.length; i++) {
    if (commandHistory[i].command != "") return commandHistory[i].command;
  }
  return "";
};

export default function CLIModule({ focused = false, quitMission = () => {} }) {
  //var text = LoremIpsum;

  var delay = getCurrentUpgrade(Categories.CLIModule, "Text Delay");

  const userShellText = "C:\\Users\\" + localUsername + ">";
  var historyIndex = 0;

  // const [currentTextState, setCurrentTextState] = useState("");

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    var input: HTMLInputElement;
    input = document.getElementById("input")! as HTMLInputElement;

    const trimmedInput = input.value.trim();
    // console.log(trimmedInput);
    // console.log(input.value);

    if (trimmedInput.match(/[^\s]/g) != null) {
      if (addCommand(trimmedInput)) input.value = "";
    }
  };

  useEffect(() => {
    let addChar = setInterval(tick, delay);

    function tick() {
      if (commandHistory.length > 0) {
        if (currentText.length < commandHistory[0].text.length) {
          setCurrentText(
            commandHistory[0].text.slice(0, currentText.length + 1)
          );
          if (currentText.length == commandHistory[0].text.length) {
            clearInterval(addChar);

            console.log("meme acabou");

            let lastPlayerCommand = getLastPlayerCommand();
            if (lastPlayerCommand == "abort" && missionPhase) endGame(true);
            else if (lastPlayerCommand == "quit" && !missionPhase)
              quitMission();
          }
        }
      }
    }

    return () => clearInterval(addChar);
  }, [commandHistory.length]);

  const bindingsKeyDown = (e: KeyboardEvent) => {
    e = e || window.event;

    // Which key was pressed?
    //console.log(e.key);

    switch (e.key.toLowerCase()) {
      case "arrowup":
        e.preventDefault();

        if (getCurrentUpgrade(Categories.CLIModule, "Command History") == 0)
          break;

        let input1 = document.getElementById("input")! as HTMLInputElement;

        let aux1 = [""];
        commandHistory.map((v) => {
          if (v.command != "") aux1.push(v.command);
        });

        historyIndex +=
          historyIndex <
          Math.min(
            aux1.length - 1,
            getCurrentUpgrade(Categories.CLIModule, "Command History")
          )
            ? 1
            : 0;

        input1.value = aux1[historyIndex];

        break;

      case "arrowdown":
        e.preventDefault();

        if (getCurrentUpgrade(Categories.CLIModule, "Command History") == 0)
          break;

        let input2 = document.getElementById("input")! as HTMLInputElement;

        let aux2 = [""];
        commandHistory.map((v) => {
          if (v.command != "") aux2.push(v.command);
        });

        historyIndex -= historyIndex > 0 ? 1 : 0;

        input2.value = aux2[historyIndex];

        break;

      case "tab":
        e.preventDefault();

        if (getCurrentUpgrade(Categories.CLIModule, "Auto Complete") == 0)
          break;

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
    // console.log("CLIModule");

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
              {i == 0 ? currentText + " <" : v.text + " <"}
              {/* {v.text + " <"} */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
