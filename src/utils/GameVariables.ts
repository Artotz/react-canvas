import { ScreenStrip } from "../components/RaycastingModule/RaycastingModule2";
import {
  CommandLineType,
  addSudoCommand,
} from "../components/CLIModule/CLIModule";

// random default values for reasons
export const mapsArray = {
  missionMap: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  viewingMap: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  drawingMap: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  mapsWidth: 4,
  mapsHeight: 4,
};

export type Player = {
  x: number;
  y: number;
  dir: number;
  rot: number;
  speed: number;
  moveSpeed: number;
  rotSpeed: number;

  // other stuff
  maxFuel: number;
  fuel: number;
  maxHp: number;
  hp: number;
};

export const player: Player = {
  x: 1.5, // current x, y position
  y: 1.5,
  dir: 0, // the direction that the player is turning, either -1 for left or 1 for right.
  rot: 0, // the current angle of rotation
  speed: 0, // is the playing moving forward (speed = 1) or backwards (speed = -1).
  moveSpeed: 0.05, // how far (in map units) does the player move each step/update
  rotSpeed: (6 * Math.PI) / 180, // how much does the player rotate each step/update (in radians)

  // other stuff
  maxFuel: 100, // max battery whatever
  fuel: 100, // battery whatever
  maxHp: 20, // max durability
  hp: 20, // durability
};

export const twoPI = Math.PI * 2;

export const raycastingRays: { x: number; y: number }[] = [];

// ----- STATES FOR MODULES -----
// ------------------------------

// ----- State for CLIModule -----
export const commandHistory: CommandLineType[] = [];

export var currentText = "";
export const setCurrentText = (value: string) => {
  currentText = value;
};

export var moving = false;
export const setMoving = (value: boolean) => {
  moving = value;
};

// ----- State for MapModule -----
export const miniMap = {
  offsetX: 0,
  offsetY: 0,
  drawingOffsetX: 0,
  drawingOffsetY: 0,
  scale: 20,
  showingPosition: 0,
  maxShowingPosition: 1000,
};

export const setMaxShowingPosition = () => {
  miniMap.showingPosition = miniMap.maxShowingPosition;
};

// ----- State for RaycastingModule -----

export var rayCastingVideo = 10000;
export var maxRayCastingVideo = 10000;
export const decreaseRayCastingVideo = () => {
  rayCastingVideo -= rayCastingVideo > 0 ? 1 : 0;
};
export const setMaxRayCastingVideo = () => {
  rayCastingVideo = maxRayCastingVideo;
};

// ----- State for RaycastingPhotoModule -----

export const raycastingPhoto = {
  trigger: false,
  trigger2: false,
  cover: 0,
  currentPhoto: 0,
  totalPhotos: 0,
  photos: Array<ImageData>(0),
};

// ------------------------------

// ----- State for Score (?) -----
export var missionPhase = true;
export const setMissionPhase = (value: boolean) => {
  missionPhase = value;
};
export const mission = { result: "" };

// ----- Money duh -----
export var money = 0;
export const addMoney = (amount: number) => {
  money += amount;
};

// ----- Map Management -----
// todo: fix this
export const resetMap = (x: number, y: number) => {
  setMissionPhase(true);

  // mapsArray.mapsHeight = mapsArray.missionMap.length;
  // mapsArray.mapsWidth = mapsArray.missionMap[0].length;

  // mapsArray.viewingMap.length = 0;
  // mapsArray.drawingMap.length = 0;

  // let startingPosition = { x: x, y: y };

  // for (let i = 0; i < mapsArray.mapsHeight; i++) {
  // for (let j = 0; j < mapsArray.mapsWidth; j++) {
  //     if (mapsArray.missionMap[i][j] == -666) startingPosition = { x: j, y: i };
  //   }

  // let arr = Array<number>(mapsArray.mapsWidth);
  // arr.fill(-999);
  // mapsArray.viewingMap.push([...arr]);
  // mapsArray.drawingMap.push([...arr]);
  // }

  // console.log(mapsArray.missionMap);
  // console.log(mapsArray.drawingMap);

  Object.assign(player, {
    x: x + 0.5, // current x, y position
    y: y + 0.5,
    dir: 0, // the direction that the player is turning, either -1 for left or 1 for right.
    rot: 0, // the current angle of rotation
    speed: 0, // is the playing moving forward (speed = 1) or backwards (speed = -1).
    //moveSpeed: 0.05, // how far (in map units) does the player move each step/update
    //rotSpeed: (6 * Math.PI) / 180, // how much does the player rotate each step/update (in radians)

    // other stuff
    //maxFuel: 100, // max battery whatever
    fuel: player.maxFuel, // battery whatever
    //maxHp: 20, // max durability
    hp: player.maxHp, // durability
    showingPosition: 0, // frames displaying position
  });

  commandHistory.length = 0;
  addSudoCommand({
    command: "",
    text: 'Welcome!\nTry "help" for commands.',
  });

  setMoving(false);

  Object.assign(
    {
      trigger: false,
      cover: 0,
      photo: Array<ScreenStrip>(),
    },
    raycastingPhoto
  );

  Object.assign(
    {
      offsetX: 0,
      offsetY: 0,
      drawingOffsetX: 0,
      drawingOffsetY: 0,
      scale: 20,
    },
    miniMap
  );
};

const o = -1;

mapsArray.missionMap = [
  [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
  [
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    o,
    1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ],
  [
    1,
    0,
    0,
    2,
    o,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
  ],
  [
    1,
    0,
    0,
    3,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    o,
    0,
    1,
  ],
  [
    1,
    0,
    0,
    4,
    0,
    o,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
  ],
  [
    1,
    0,
    0,
    5,
    o,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
  ],
  [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
];

mapsArray.mapsHeight = mapsArray.missionMap.length;
mapsArray.mapsWidth = mapsArray.missionMap[0].length;

for (let i = 0; i < mapsArray.mapsHeight; i++) {
  let arr = Array<number>(mapsArray.mapsWidth);
  arr.fill(-999);
  mapsArray.viewingMap.push([...arr]);
  mapsArray.drawingMap.push([...arr]);
}

export const unlockedEntries = [
  { x: 1, y: 1, isUnlocked: true },
  { x: 3, y: 5, isUnlocked: false },
  { x: 7, y: 8, isUnlocked: false },
  { x: 5, y: 7, isUnlocked: true },
  { x: 7, y: 5, isUnlocked: false },
  { x: 7, y: 5, isUnlocked: false },
];

for (let i = 0; i < unlockedEntries.length; i++) {
  mapsArray.missionMap[unlockedEntries[i].y][unlockedEntries[i].x] = -420;
}
