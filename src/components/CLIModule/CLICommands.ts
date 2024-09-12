import {
  mapsArray,
  miniMap,
  missionPhase,
  moving,
  player,
  rayCastingVideo,
  raycastingPhoto,
  setMaxRayCastingVideo,
  setMaxShowingPosition,
  setMoving,
} from "../../utils/GameVariables";
import { Categories, getCurrentUpgrade } from "../StoreMenu/StoreItems";
import { addSudoCommand } from "./CLIModule";

type Command = {
  title: string;
  options: string[];
  missionPhaseOnly: boolean;
  functionCall: (options: string[]) => string;
};

export const checkCommands = (cmd: string) => {
  let _cmd = cmd.split(" ");

  console.log(_cmd);

  let commandReturn = "Command not found.";

  for (let i = 0; i < commands.length; i++) {
    if (_cmd[0] == commands[i].title) {
      if (
        getCurrentUpgrade(
          Categories.CLIModule,
          commands[i].title + " Command"
        ) == 0
      ) {
        console.log("command not unlocked");
        break;
      } else if (commands[i].missionPhaseOnly && !missionPhase) {
        commandReturn = ". . . . .\nNo response.";
        break;
      }

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
  if (
    getCurrentUpgrade(Categories.CLIModule, "move Command Default Option") ==
      0 &&
    options[0] == ""
  ) {
    return "move command error!";
  }

  if (
    getCurrentUpgrade(Categories.CLIModule, "move Command backward Option") ==
      0 &&
    options[0] == "backward"
  ) {
    return "move command error!";
  }

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

  moveTimeoutFunction(
    getCurrentUpgrade(Categories.Player, "Move Speed"),
    fixedDir,
    options[0] == "backward" ? -1 : 1
  );

  return "Moving . . .";
};

const moveTimeoutFunction = (
  step: number,
  dir: { x: number; y: number },
  sign: number
) => {
  let newPos = {
    x:
      player.x +
      (sign * dir.x) / getCurrentUpgrade(Categories.Player, "Move Speed"),
    y:
      player.y +
      (sign * dir.y) / getCurrentUpgrade(Categories.Player, "Move Speed"),
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
    if (getCurrentUpgrade(Categories.Player, "Damage Detection") > 0)
      addSudoCommand({ command: "", text: "Damage detected!" });

    setTimeout(
      moveTimeoutFunction,
      50,
      getCurrentUpgrade(Categories.Player, "Move Speed") / 2 - 1,
      dir,
      -sign
    );
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
        if (getCurrentUpgrade(Categories.Player, "Damage Detection") > 1)
          addSudoCommand({ command: "", text: "Damage detected!" });
      }

      console.log("x: ", player.x, "y: ", player.y);

      setMoving(false);
    }
  }
};

const turnFunction = (options: string[]) => {
  if (
    getCurrentUpgrade(Categories.CLIModule, "Turn Command Default Option") ==
      0 &&
    options[0] == ""
  ) {
    return "turn command error!";
  }

  if (moving) return "Already moving!";

  setMoving(true);

  turnTimeoutFunction(
    getCurrentUpgrade(Categories.Player, "Turn Speed"),
    options[0] == "left" ? -1 : 1
  );

  return "Turning . . .";
};

const turnTimeoutFunction = (step: number, dir: number) => {
  player.rot +=
    (dir * Math.PI) / 2 / getCurrentUpgrade(Categories.Player, "Turn Speed");

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
    missionPhaseOnly: true,
    functionCall: moveFunction,
  },
  {
    title: "turn",
    options: ["", "left", "right"],
    missionPhaseOnly: true,
    functionCall: turnFunction,
  },
  {
    title: "integrity",
    options: [""],
    missionPhaseOnly: true,
    functionCall: (options: string[]) => {
      return "Integrity: " + player.hp.toFixed(2);
    },
  },
  {
    title: "fuel",
    options: [""],
    missionPhaseOnly: true,
    functionCall: (options: string[]) => {
      return "Fuel: " + player.fuel.toFixed(2);
    },
  },
  {
    title: "scan",
    options: [""],
    missionPhaseOnly: true,
    functionCall: (options: string[]) => {
      // let radarPos = {
      //   x: ~~(player.x + Math.cos(player.rot) * 1),
      //   y: ~~(player.y + Math.sin(player.rot) * 1),
      // };

      // mapsArray.viewingMap[radarPos.y][radarPos.x] =
      //   mapsArray.missionMap[radarPos.y][radarPos.x];

      // let cell;
      // for (let i = -1; i < 2; i++) {
      //   for (let j = -1; j < 2; j++) {
      //     cell = mapsArray.missionMap[~~player.y + i][~~player.x + j];

      //     if (
      //       cell == -1 &&
      //       getCurrentUpgrade(Categories.MapModule, "scan Threat Detection") < 0
      //     )
      //       cell = 0;

      //     mapsArray.viewingMap[~~player.y + i][~~player.x + j] = cell;
      //   }
      // }

      mapsArray.viewingMap[~~player.y][~~player.x] =
        mapsArray.missionMap[~~player.y][~~player.x];

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
      if (getCurrentUpgrade(Categories.MapModule, "scan Range") > 0) {
        mapsArray.viewingMap[~~player.y - 1][~~player.x - 1] =
          mapsArray.missionMap[~~player.y - 1][~~player.x - 1];
        mapsArray.viewingMap[~~player.y - 1][~~player.x + 1] =
          mapsArray.missionMap[~~player.y - 1][~~player.x + 1];
        mapsArray.viewingMap[~~player.y + 1][~~player.x - 1] =
          mapsArray.missionMap[~~player.y + 1][~~player.x - 1];
        mapsArray.viewingMap[~~player.y + 1][~~player.x + 1] =
          mapsArray.missionMap[~~player.y + 1][~~player.x + 1];
      }

      return "Scanning . . .";
    },
  },
  {
    title: "position",
    options: [""],
    missionPhaseOnly: true,
    functionCall: (options: string[]) => {
      setMaxShowingPosition();

      return "Showing position . . .";
    },
  },
  {
    title: "video",
    options: [""],
    missionPhaseOnly: true,
    functionCall: (options: string[]) => {
      setMaxRayCastingVideo();

      return "Toggling video . . .";
    },
  },
  {
    title: "capture",
    options: [""],
    missionPhaseOnly: true,
    functionCall: (options: string[]) => {
      if (raycastingPhoto.cover > 0) return "Processing image!";

      raycastingPhoto.trigger = true;
      raycastingPhoto.cover = 100;

      const bruh = () => {
        raycastingPhoto.cover -= 10;
        if (raycastingPhoto.cover > 0)
          setTimeout(
            bruh,
            getCurrentUpgrade(
              Categories.RaycastingPhotoModule,
              "Photo Capture Delay"
            )
          );
      };
      bruh();

      return "Capturing image . . .";
    },
  },
  {
    title: "gallery",
    options: ["previous", "next", "delete"],
    missionPhaseOnly: true,
    functionCall: (options: string[]) => {
      if (options[0] == "delete") {
        if (
          getCurrentUpgrade(
            Categories.CLIModule,
            "gallery Command delete Option"
          ) == 0
        )
          return "gallery command error!";

        if (raycastingPhoto.cover > 0) return "Processing image!";

        if (raycastingPhoto.photos.length == 0) return "No photos to delete!";

        raycastingPhoto.photos.splice(raycastingPhoto.currentPhoto, 1);
        if (raycastingPhoto.currentPhoto > raycastingPhoto.photos.length - 1)
          raycastingPhoto.currentPhoto = raycastingPhoto.photos.length - 1;

        raycastingPhoto.trigger2 = true;
        return "Deleting image . . .";
      } else if (options[0] == "previous") {
        if (
          getCurrentUpgrade(
            Categories.CLIModule,
            "gallery Command previous Option"
          ) == 0
        )
          return "gallery command error!";

        if (raycastingPhoto.cover > 0) return "Processing image!";

        raycastingPhoto.currentPhoto =
          raycastingPhoto.currentPhoto > 0
            ? raycastingPhoto.currentPhoto - 1
            : raycastingPhoto.photos.length - 1;
      } else if (options[0] == "next") {
        if (raycastingPhoto.cover > 0) return "Processing image!";
        raycastingPhoto.currentPhoto =
          raycastingPhoto.currentPhoto < raycastingPhoto.photos.length - 1
            ? raycastingPhoto.currentPhoto + 1
            : 0;
      }

      raycastingPhoto.trigger2 = true;
      return "Changing photo . . .";
    },
  },
  {
    title: "abort",
    options: [""],
    missionPhaseOnly: true,
    functionCall: (options: string[]) => {
      return "Aborting . . . . . . . . . .";
    },
  },
  {
    title: "quit",
    options: [""],
    missionPhaseOnly: false,
    functionCall: (options: string[]) => {
      if (missionPhase) return "Can't quit now!";
      else return "Quitting . . . . . . . . . .";
    },
  },
  {
    title: "help",
    options: [""],
    missionPhaseOnly: false,
    functionCall: (options: string[]) => {
      let _cmdsHelp = "";
      for (let i = 0; i < commands.length; i++) {
        if (
          getCurrentUpgrade(
            Categories.CLIModule,
            commands[i].title + " Command"
          ) > 0
        ) {
          _cmdsHelp +=
            commands[i].title + (i < commands.length - 1 ? "\n" : "");
        }
      }
      return _cmdsHelp;
    },
  },
];
