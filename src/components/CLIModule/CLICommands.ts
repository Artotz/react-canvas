import { player } from "../../utils/GameVariables";

type Command = {
  title: string;
  options: string[];
  functionCall: (options: string[]) => string;
};

export const checkCommands = (cmd: string) => {
  let _cmd = cmd.split(" ");

  console.log(_cmd);

  let commandReturn = "Command not found.";

  for (let i = 0; i < commands.length; i++) {
    if (_cmd[0] == commands[i].title) {
      commandReturn = commands[i].functionCall(_cmd.slice(1));
    }
  }

  return commandReturn;
};

const moveFunction = (options: string[]) => {
  moveTimeoutFunction(10);

  return "Moving . . .";
};

const moveTimeoutFunction = (step: number) => {
  player.x += (Math.cos(player.rot) * 1) / 10;
  player.y += (Math.sin(player.rot) * 1) / 10;

  if (step > 1) {
    setTimeout(moveTimeoutFunction, 50, step - 1);
  } else {
    player.x = parseFloat(player.x.toFixed(1));
    player.y = parseFloat(player.y.toFixed(1));
    console.log("x: ", player.x, "y: ", player.y);
  }
};

const turnFunction = (options: string[]) => {
  turnTimeoutFunction(10);

  return "Turning . . .";
};

const turnTimeoutFunction = (step: number) => {
  player.rot += Math.PI / 2 / 10;

  if (step > 1) {
    setTimeout(turnTimeoutFunction, 50, step - 1);
  } else {
    player.rot = Math.round(player.rot / (Math.PI / 2)) * (Math.PI / 2);
  }
};

const commands: Command[] = [
  {
    title: "move",
    options: ["", "foward", "backward"],
    functionCall: moveFunction,
  },
  {
    title: "turn",
    options: [""],
    functionCall: turnFunction,
  },
];
