import { ScreenStrip } from "../components/RaycastingModule/RaycastingModule2";
import { CommandLineType } from "../components/CLIModule/CLIModule";

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
  showingPosition: number;
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
  showingPosition: 0, // frames displaying position
};

export const spriteExample = {
  x: 2.5,
  y: 2.5,
  width: 0.25,
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
  scale: 15,
};

// ----- State for RaycastingModule (Photo Mode) -----
export const raycastingPhoto = {
  trigger: false,
  cover: 0,
  photo: Array<ScreenStrip>(),
};

// ----- State for Score (?) -----
export const mission = { result: "" };

// ----- Money duh -----
export var money = 0;
export const addMoney = (amount: number) => {
  money += amount;
};
