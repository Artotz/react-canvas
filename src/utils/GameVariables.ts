import { ScreenStrip } from "../components/RaycastingModule/RaycastingPhotoModule";

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
  fuel: number;
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
  fuel: 100, // battery whatever
  hp: 100, // durability
  showingPosition: 0, // frames displaying position
};

export const twoPI = Math.PI * 2;

//export const raycastingRays: { x: number; y: number }[] = [];

export const miniMap = {
  offsetX: 0,
  offsetY: 0,
  drawingOffsetX: 0,
  drawingOffsetY: 0,
  scale: 15,
};

export const raycastingPhoto = {
  trigger: false,
  cover: 0,
  photo: Array<ScreenStrip>(),
};
