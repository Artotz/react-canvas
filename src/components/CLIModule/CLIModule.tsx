import { useEffect, useState } from "react";
import { checkCommands, commands } from "./CLICommands";
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
  var username = "C:\\Users\\artotz>";
  // var lastEntry = "";

  const [commandHistory, setCommandHistory] = useState<CommandLineType[]>([
    {
      command: "",
      text: 'Welcome!\nTry "help" for commands.',
      currentText: "",
      textRollingIndex: -1,
    },
  ]);
  const [reloadAux, setReloadAux] = useState(0);

  const addCommand = () => {
    var input: HTMLInputElement;
    input = document.getElementById("input")! as HTMLInputElement;

    const trimmedInput = input.value.trim();

    console.log(trimmedInput);

    if (input.value.match(/[^\s]/g) != null) {
      setCommandHistory([
        {
          command: username + " " + trimmedInput,
          text: checkCommands(trimmedInput),
          currentText: "",
          textRollingIndex: -1,
        },
        ...commandHistory,
      ]);

      // lastEntry = trimmedInput;

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

  const bindingsKeyDown = (e: KeyboardEvent) => {
    e = e || window.event;

    // Which key was pressed?
    //console.log(e.key);

    let input = document.getElementById("input")! as HTMLInputElement;

    switch (e.key.toLowerCase()) {
      case "arrowup":
        e.preventDefault();

        break;

      case "arrowdown":
        e.preventDefault();

        break;

      case "tab":
        e.preventDefault();

        let cutAux = input.value.split(" ");

        console.log(cutAux);
        if (cutAux[cutAux.length - 1] == "") break;

        if (cutAux.length == 1) {
          let _commandTitles: string[] = [];
          commands.map((v) => _commandTitles.push(v.title));

          for (let i = 0; i < _commandTitles.length; i++) {
            if (_commandTitles[i].startsWith(cutAux[0])) {
              input.value +=
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
              input.value +=
                _commandOptions[i].substring(cutAux[1].length) + " ";
              break;
            }
          }
        }

        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", bindingsKeyDown);
    return () => {
      document.removeEventListener("keydown", bindingsKeyDown);
    };
  }, []);

  return (
    /* ----- TERMINAL WRAPPER ----- */
    <div
      onClick={(e: any) => {
        e.preventDefault();

        document.getElementById("input")!.focus();

        return false;
      }}
      className="flex full-size overflow-y-hidden"
    >
      <div className="flex flex-col-reverse full-size bg-black select-none p-2 overflow-y-scroll no-scrollbar">
        {/* <div className="flex flex-col-reverse full-size bg-black select-none border-green-500 border-solid border-2 p-2 overflow-y-scroll no-scrollbar"> */}
        {/* ----- INPUT ----- */}
        <form
          className="flex m-0 px-2 border-green-500 border-solid border-2 text-green-500"
          onSubmit={onSubmitForm}
        >
          {username}
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
    </div>
  );
}
