import {
  mapsArray,
  miniMap,
  moving,
  player,
  rayCastingVideo,
  raycastingPhoto,
  setMaxRayCastingVideo,
  setMoving,
} from "../../utils/GameVariables";
import { addSudoCommand } from "./CLIModule";

const totalSteps = 50 / 5;

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
      let _options = _cmd.slice(1);
      if (_options.length == 0) _options.push("");

      console.log(_options);

      if (_options.length > 1) {
        commandReturn = commands[i].title + " command error!";
        break;
      }

      if (commands[i].options.indexOf(_options[0]) > -1)
        commandReturn = commands[i].functionCall(_options);
      else commandReturn = commands[i].title + " command error!";
    }
  }

  return commandReturn;
};

const moveFunction = (options: string[]) => {
  if (moving) return "Already moving!";

  setMoving(true);

  const clampAux = player.rot % (2 * Math.PI);

  const angleAux =
    clampAux < 0
      ? 2 * Math.PI + clampAux
      : clampAux >= 2 * Math.PI
      ? clampAux - 2 * Math.PI
      : clampAux;

  const fixedAngle = Math.round(angleAux / (Math.PI / 2));

  let fixedDir = { x: [1, 0, -1, 0][fixedAngle], y: [0, 1, 0, -1][fixedAngle] };
  console.log(
    "player.rot: ",
    player.rot,
    "\nangle: ",
    fixedAngle,
    "\ndir: ",
    fixedDir
  );

  //console.log(options);

  moveTimeoutFunction(totalSteps, fixedDir, options[0] == "backward" ? -1 : 1);

  return "Moving . . .";
};

const moveTimeoutFunction = (
  step: number,
  dir: { x: number; y: number },
  sign: number
) => {
  let newPos = {
    x: player.x + (sign * dir.x) / totalSteps,
    y: player.y + (sign * dir.y) / totalSteps,
  };

  // illegal move one step ahead
  if (
    mapsArray.missionMap[
      //
      ~~newPos.y
    ][~~newPos.x] > 0
  ) {
    // You were wrong. Go back.
    player.hp -= 10;
    addSudoCommand({ command: "", text: "Damage detected!" });

    setTimeout(moveTimeoutFunction, 50, totalSteps / 2 - 1, dir, -sign);
  }
  //legal move
  else {
    player.x = newPos.x;
    player.y = newPos.y;

    if (step > 1) {
      setTimeout(moveTimeoutFunction, 50, step - 1, dir, sign);
    } else {
      player.x = Math.floor(player.x) + 0.5;
      player.y = Math.floor(player.y) + 0.5;

      player.x = parseFloat(player.x.toFixed(1));
      player.y = parseFloat(player.y.toFixed(1));

      // damaging floor
      if (
        mapsArray.missionMap[
          //
          ~~newPos.y
        ][~~newPos.x] == -1
      ) {
        player.hp -= 10;
        addSudoCommand({ command: "", text: "Damage detected!" });
      }

      console.log("x: ", player.x, "y: ", player.y);

      setMoving(false);
    }
  }
};

const turnFunction = (options: string[]) => {
  if (moving) return "Already moving!";

  setMoving(true);

  turnTimeoutFunction(totalSteps, options[0] == "left" ? -1 : 1);

  return "Turning . . .";
};

const turnTimeoutFunction = (step: number, dir: number) => {
  player.rot += (dir * Math.PI) / 2 / totalSteps;

  if (step > 1) {
    setTimeout(turnTimeoutFunction, 50, step - 1, dir);
  } else {
    player.rot = Math.round(player.rot / (Math.PI / 2)) * (Math.PI / 2);
    console.log(player.rot / (2 * Math.PI));
    setMoving(false);
  }
};

export const commands: Command[] = [
  {
    title: "move",
    options: ["", "foward", "backward"],
    functionCall: moveFunction,
  },
  {
    title: "turn",
    options: ["", "left", "right"],
    functionCall: turnFunction,
  },
  {
    title: "durability",
    options: [""],
    functionCall: (options: string[]) => {
      return "Durability: " + player.hp.toFixed(2);
    },
  },
  {
    title: "fuel",
    options: [""],
    functionCall: (options: string[]) => {
      return "Fuel: " + player.fuel.toFixed(2);
    },
  },
  {
    title: "scan",
    options: [""],
    functionCall: (options: string[]) => {
      // let radarPos = {
      //   x: ~~(player.x + Math.cos(player.rot) * 1),
      //   y: ~~(player.y + Math.sin(player.rot) * 1),
      // };

      // mapsArray.viewingMap[radarPos.y][radarPos.x] =
      //   mapsArray.missionMap[radarPos.y][radarPos.x];

      // CROSS
      mapsArray.viewingMap[~~player.y - 1][~~player.x] =
        mapsArray.missionMap[~~player.y - 1][~~player.x];
      mapsArray.viewingMap[~~player.y + 1][~~player.x] =
        mapsArray.missionMap[~~player.y + 1][~~player.x];
      mapsArray.viewingMap[~~player.y][~~player.x - 1] =
        mapsArray.missionMap[~~player.y][~~player.x - 1];
      mapsArray.viewingMap[~~player.y][~~player.x + 1] =
        mapsArray.missionMap[~~player.y][~~player.x + 1];

      // DIAGONALS
      mapsArray.viewingMap[~~player.y - 1][~~player.x - 1] =
        mapsArray.missionMap[~~player.y - 1][~~player.x - 1];
      mapsArray.viewingMap[~~player.y - 1][~~player.x + 1] =
        mapsArray.missionMap[~~player.y - 1][~~player.x + 1];
      mapsArray.viewingMap[~~player.y + 1][~~player.x - 1] =
        mapsArray.missionMap[~~player.y + 1][~~player.x - 1];
      mapsArray.viewingMap[~~player.y + 1][~~player.x + 1] =
        mapsArray.missionMap[~~player.y + 1][~~player.x + 1];

      return "Scanning . . .";
    },
  },
  {
    title: "position",
    options: [""],
    functionCall: (options: string[]) => {
      miniMap.showingPosition = 500;

      return "Showing position . . .";
    },
  },
  {
    title: "video",
    options: [""],
    functionCall: (options: string[]) => {
      setMaxRayCastingVideo();

      return "Toggling video . . .";
    },
  },
  {
    title: "capture",
    options: [""],
    functionCall: (options: string[]) => {
      if (rayCastingVideo > 0) {
        raycastingPhoto.trigger = true;

        return "Capturing image . . .";
      } else return "Camera is toggled off!";
    },
  },
  {
    title: "abort",
    options: [""],
    functionCall: (options: string[]) => {
      return "Aborting . . .";
    },
  },
  {
    title: "help",
    options: [""],
    functionCall: (options: string[]) => {
      let _cmdsHelp = "";
      for (let i = 0; i < commands.length; i++) {
        _cmdsHelp += commands[i].title + (i < commands.length - 1 ? "\n" : "");
      }
      return _cmdsHelp;
    },
  },
];
