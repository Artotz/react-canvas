import { createRef, useEffect, useRef, useState } from "react";

import {
  mapsArray,
  player,
  raycastingPhoto,
  twoPI,
} from "../../utils/GameVariables";
import { addCommand } from "../CLIModule/CLIModule";
import { Categories, getCurrentUpgrade } from "../StoreMenu/StoreItems";

type RaycastingPhotoModule2Props = {
  width?: number;
  height?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  _fov?: number;
  focused: boolean;
};

export type ScreenStrip = {
  height: number;
  color: string;
  texX: number;
  value: number;
};

export default function RaycastingPhotoModule2({
  width = 0,
  height = 0,
  _fov = 90,
  focused = false,
}: RaycastingPhotoModule2Props) {
  // ----- VARIABLES -----
  // ----- CANVAS -----
  let res = getCurrentUpgrade(
    Categories.RaycastingPhotoModule,
    "Photo Resolution"
  );
  const screenSize = { width: 4 * res, height: 3 * res };
  //const screenSize = { width: width, height: height };

  const canvasRef = createRef<HTMLCanvasElement>();

  var raycastCanvas: HTMLCanvasElement | null;
  var raycastCtx: CanvasRenderingContext2D;

  const scale = width / screenSize.width;

  const texSize = 16;
  const greystoneWall = new Image();
  var floorData = new ImageData(texSize, texSize);
  var mode7Image: ImageData;

  const [loadingState, setLoadingState] = useState(true);
  const [coverState, setCoverState] = useState(true);

  // ----- FUN ZONE -----

  const numRays = screenSize.width;
  const fov = (_fov * Math.PI) / 180;

  var _screenStrips: ScreenStrip[] = Array(numRays);
  var zBuffer: { type: string; i: number; dist: number; trueDist: number }[] =
    Array(numRays);

  const stripWidth = screenSize.width / numRays;
  const fovHalf = fov / 2;

  const viewDist = screenSize.width / 2 / Math.tan(fovHalf);

  const wallHeight = 1;

  const lightsOff = true;
  const flashLightSettings = [
    { z: Infinity, x: Infinity, walls: 0 },
    { z: 3, x: 3, walls: 1.55 },
    { z: 1.6, x: 1.25, walls: 2.25 },
    { z: 1.45, x: 0.7, walls: 2.9 },
    { z: 1.1, x: 0.25, walls: 5 },
    { z: 0, x: 0, walls: Infinity },
  ];

  // ----- UPGRADES -----

  var currentFlashLightSettings: number;
  var photoColor: number;

  // ----- FUNCTIONS -----
  // ----- INITIALIZATION -----

  const initScreen = () => {
    for (var i = 0; i < numRays; i++) {
      let strip = {
        height: 100,
        color: "blue",
        texX: 0,
        value: -1,
      };

      _screenStrips[i] = strip;
    }
  };

  // ----- RAYCASTING -----

  const castRays = () => {
    var stripIdx = 0;

    for (var i = 0; i < numRays; i++) {
      // Where on the screen does ray go through?
      var rayScreenPos = (-numRays / 2 + i) * stripWidth;

      // The distance from the viewer to the point
      // on the screen, simply Pythagoras.
      var rayViewDist = Math.sqrt(
        rayScreenPos * rayScreenPos + viewDist * viewDist
      );

      // The angle of the ray, relative to the viewing direction
      // Right triangle: a = sin(A) * c
      var rayAngle = Math.asin(rayScreenPos / rayViewDist);

      castSingleRay(
        // Add the players viewing direction
        // to get the angle in world space
        player.rot + rayAngle,
        stripIdx++
      );
    }

    //console.log(raycastingRays);
  };

  const castSingleRay = (rayAngle: number, stripIdx: number) => {
    // first make sure the angle is between 0 and 360 degrees
    rayAngle %= twoPI;
    if (rayAngle < 0) rayAngle += twoPI;

    // moving right/left? up/down? Determined by which quadrant the angle is in.
    var right = rayAngle > twoPI * 0.75 || rayAngle < twoPI * 0.25;
    var up = rayAngle < 0 || rayAngle > Math.PI;

    // only do these once
    var angleSin = Math.sin(rayAngle);
    var angleCos = Math.cos(rayAngle);

    var dist = 0; // the distance to the block we hit
    // var xHit = 0; // the x and y coord of where the ray hit the block
    // var yHit = 0;

    var textureX = 0; // the x-coord on the texture of the block, ie. what part of the texture are we going to render
    var wallX: number; // the (x,y) map coords of the block
    var wallY: number;

    // first check against the vertical map/wall lines
    // we do this by moving to the right or left edge of the block we're standing in
    // and then moving in 1 map unit steps horizontally. The amount we have to move vertically
    // is determined by the slope of the ray, which is simply defined as sin(angle) / cos(angle).

    var slope = angleSin / angleCos; // the slope of the straight line made by the ray
    var dX = right ? 1 : -1; // we move either 1 map unit to the left or right
    var dY = dX * slope; // how much to move up or down

    var x = right ? Math.ceil(player.x) : Math.floor(player.x); // starting horizontal position, at one of the edges of the current map block
    var y = player.y + (x - player.x) * slope; // starting vertical position. We add the small horizontal step we just made, multiplied by the slope.

    // if on one side
    let color = "black";
    let value = -1;

    while (
      x >= 0 &&
      x < mapsArray.mapsWidth &&
      y >= 0 &&
      y < mapsArray.mapsHeight
    ) {
      var wallX = Math.floor(x + (right ? 0 : -1));
      var wallY = Math.floor(y);

      // is this point inside a wall block?
      if (mapsArray.missionMap[wallY][wallX] > 0) {
        var distX = x - player.x;
        var distY = y - player.y;
        dist = distX * distX + distY * distY; // the distance from the player to this point, squared.

        textureX = y % 1; // where exactly are we on the wall? textureX is the x coordinate on the texture that we'll use when texturing the wall.
        if (!right) textureX = 1 - textureX; // if we're looking to the left side of the map, the texture should be reversed

        // xHit = x; // save the coordinates of the hit. We only really use these to draw the rays on minimap.
        // yHit = y;

        color = "gray";
        value = mapsArray.missionMap[wallY][wallX];
        break;
      }
      x += dX;
      y += dY;
    }

    // now check against horizontal lines. It's basically the same, just "turned around".
    // the only difference here is that once we hit a map block,
    // we check if there we also found one in the earlier, vertical run. We'll know that if dist != 0.
    // If so, we only register this hit if this distance is smaller.

    var slope = angleCos / angleSin;
    var dY = up ? -1 : 1;
    var dX = dY * slope;
    var y = up ? Math.floor(player.y) : Math.ceil(player.y);
    var x = player.x + (y - player.y) * slope;

    while (
      x >= 0 &&
      x < mapsArray.mapsWidth &&
      y >= 0 &&
      y < mapsArray.mapsHeight
    ) {
      var wallY = Math.floor(y + (up ? -1 : 0));
      var wallX = Math.floor(x);
      if (mapsArray.missionMap[wallY][wallX] > 0) {
        var distX = x - player.x;
        var distY = y - player.y;
        var blockDist = distX * distX + distY * distY;
        if (!dist || blockDist < dist) {
          dist = blockDist;
          // xHit = x;
          // yHit = y;
          textureX = x % 1;
          if (up) textureX = 1 - textureX;

          // if on the other side
          color = "darkgray";
          value = mapsArray.missionMap[wallY][wallX];
        }
        break;
      }
      x += dX;
      y += dY;
    }

    if (dist) {
      //drawRay(xHit, yHit);

      // draw rays
      // raycastingRays[stripIdx] = { x: xHit, y: yHit };

      var strip = _screenStrips[stripIdx];

      dist = Math.sqrt(dist);

      // use perpendicular distance to adjust for fish eye
      // distorted_dist = correct_dist / cos(relative_angle_of_ray)
      let trueDist = dist;
      dist = dist * Math.cos(player.rot - rayAngle);

      // now calc the position, height and width of the wall strip

      // "real" wall height in the game world is 1 unit, the distance from the player to the screen is viewDist,
      // thus the height on the screen is equal to wall_height_real * viewDist / dist

      var height = Math.round((wallHeight * viewDist) / dist);

      // width is the same, but we have to stretch the texture to a factor of stripWidth to make it fill the strip correctly
      //var width = height * stripWidth;

      // top placement is easy since everything is centered on the x-axis, so we simply move
      // it half way down the screen and then half the wall height back up.
      // var top = Math.round((screenSize.height - height) / 2);

      strip.height = height;
      strip.color = color;
      strip.texX = textureX;
      strip.value = value;

      // todo: optimization ?
      zBuffer[stripIdx] = {
        type: "wall",
        i: stripIdx,
        dist: dist,
        trueDist: trueDist,
      };
    }
  };

  // ----- FLOOR AND CEILING (MODE7) -----

  const mode7 = () => {
    let _x = 0,
      _y = 0,
      z = -screenSize.height / 2;

    const _scale = 3,
      _sin = Math.sin(player.rot + Math.PI / 4),
      _cos = Math.cos(player.rot + Math.PI / 4),
      // MAGIC NUMBER 3 WORKED FUCK IT
      // somehow related to fov and wall height
      _playerX = (-player.x * 3) / wallHeight,
      _playerY = (player.y * 3) / wallHeight;

    for (let y = 0; y < screenSize.height; y++) {
      for (let x = 0; x < screenSize.width; x++) {
        // Y -----
        _y = ((screenSize.width - x) * _cos - x * _sin) / z;
        _y += z < 0 ? _playerY : -_playerY;
        _y = Math.abs(_y);

        let meme = ~~(_y / _scale);

        _y *= texSize / _scale;
        _y %= texSize;
        _y = ~~_y;

        // X -----
        _x = ((screenSize.width - x) * _sin + x * _cos) / z;
        _x += z < 0 ? _playerX : -_playerX;
        _x = Math.abs(_x);

        let meme2 = ~~(_x / _scale);

        _x *= texSize / _scale;
        _x %= texSize;
        _x = ~~_x;

        // The data from an image consists of an array of size width * height * 4,
        // where the values in order are the R, G, B and A of a single pixel.

        // Below is the (kinda annoying) method to acess each one.
        // (amazing breakthrough: meme and meme2 are the x and y coords for a tileset)

        // flashlight effect is composed of a Z-Index darkening combined with an edges of X darkening

        let zLight =
          flashLightSettings[currentFlashLightSettings].z *
          -255 *
          (1 - Math.abs(z) / (screenSize.height / 2));
        let xLight =
          flashLightSettings[currentFlashLightSettings].x *
          255 *
          -(1 - Math.abs(Math.sin((x / screenSize.width) * Math.PI)));

        let flashlightEffect = lightsOff ? zLight + xLight : 0;

        let tile = -999;

        if (
          meme >= 0 &&
          meme < mapsArray.missionMap.length &&
          meme2 >= 0 &&
          meme2 < mapsArray.missionMap[0].length &&
          photoColor
        )
          tile = mapsArray.missionMap[meme][meme2];

        if (y < screenSize.height / 2) {
          // r
          mode7Image.data[x * 4 + y * mode7Image.width * 4] =
            floorData.data[_x * 4 + _y * texSize * 4] + flashlightEffect;
          // g
          mode7Image.data[x * 4 + y * mode7Image.width * 4 + 1] =
            floorData.data[_x * 4 + _y * texSize * 4 + 1] + flashlightEffect;
          // b
          mode7Image.data[x * 4 + y * mode7Image.width * 4 + 2] =
            floorData.data[_x * 4 + _y * texSize * 4 + 2] + flashlightEffect;
          // a
          mode7Image.data[x * 4 + y * mode7Image.width * 4 + 3] = 255;
        } else {
          // r
          mode7Image.data[x * 4 + y * mode7Image.width * 4] =
            floorData.data[_x * 4 + _y * texSize * 4] + flashlightEffect;
          // g
          mode7Image.data[x * 4 + y * mode7Image.width * 4 + 1] =
            floorData.data[_x * 4 + _y * texSize * 4 + 1] -
            (tile == -1 ? 100 : 0) +
            flashlightEffect;
          // b
          mode7Image.data[x * 4 + y * mode7Image.width * 4 + 2] =
            floorData.data[_x * 4 + _y * texSize * 4 + 2] -
            (tile == -1 ? 100 : 0) +
            flashlightEffect;
          // a
          mode7Image.data[x * 4 + y * mode7Image.width * 4 + 3] = 255;
        }
      }

      z++;
    }
    raycastCtx.putImageData(mode7Image, 0, 0);
  };

  // ----- DRAWING -----

  const draw = () => {
    raycastCtx.clearRect(0, 0, screenSize.width, screenSize.height);

    draw2();
    // HUD -----
    raycastCtx.fillStyle = "red";

    raycastCtx.fillText((raycastingPhoto.totalPhotos++).toString(), 10, 30);
  };

  const draw2 = () => {
    // WALLS
    castRays();

    // FLOOR AND CEILING
    mode7();

    // const spriteExample = {
    //   x: 2.5,
    //   y: 2.5,
    //   width: 0.25,
    // };

    // // SPRITES ----------------------------------------
    // // angle between player and sprite
    // var angleRadians = Math.atan2(
    //   spriteExample.y - player.y,
    //   spriteExample.x - player.x
    // );

    // // angle difference
    // let angleDiff =
    //   ((player.rot - angleRadians + twoPI / 2) % twoPI) - twoPI / 2;
    // angleDiff = angleDiff < -twoPI / 2 ? angleDiff + twoPI : angleDiff;

    // // sprite distance
    // // fix the corners problem ( the distance is measured from the center of the sprite )
    // let spriteDist = Math.sqrt(
    //   (spriteExample.y - player.y) * (spriteExample.y - player.y) +
    //     (spriteExample.x - player.x) * (spriteExample.x - player.x)
    // );

    // // inserting sprite in zBuffer
    // // spriteDist != zBuffer dist (hands in fps game inside walls remember)
    // // todo: 0.5 maybe be too close dunno <<<
    // let _zBuffer = [
    //   ...zBuffer,
    //   { type: "sprite", i: -1, dist: spriteDist - 0.5 },
    // ];
    // _zBuffer.sort((a, b) => b.dist - a.dist);

    // //console.log(spriteDist);
    // // SPRITES (END)----------------------------------------

    // DRAWING THE TEXTURES -----
    // screen strips

    // let auxMeme = Math.min(frameCount * 2, _zBuffer.length);
    // let auxMeme = _zBuffer.length;
    let auxMeme = zBuffer.length;
    // let auxMeme = 0;

    for (let i = 0; i < auxMeme; i++) {
      // DRAWING THE TEXTURES
      // TODO: use texture pixel colors
      if (zBuffer[i].type == "wall") {
        raycastCtx.drawImage(
          greystoneWall, // source image

          ~~(texSize * _screenStrips[zBuffer[i].i].texX), // The x coordinate where to start clipping

          0, // The y coordinate where to start clipping

          stripWidth, // The width of the clipped image

          texSize, // The height of the clipped image

          zBuffer[i].i * stripWidth, // The x coordinate where to place the image on the canvas

          screenSize.height / 2 - _screenStrips[zBuffer[i].i].height / 2, // The y coordinate where to place the image on the canvas

          stripWidth, // The width of the image to use (stretch or reduce the image)

          _screenStrips[zBuffer[i].i].height // The height of the image to use (stretch or reduce the image)
        );

        // flashlight effect
        // todo: sync this with flashlight from mode7
        if (lightsOff) {
          // arbitrary number below xd
          raycastCtx.fillStyle =
            "rgba(0,0,0," +
            zBuffer[i].trueDist /
              flashLightSettings[currentFlashLightSettings].walls +
            ")";
          raycastCtx.fillRect(
            zBuffer[i].i * stripWidth, // The x coordinate where to place the image on the canvas

            screenSize.height / 2 - _screenStrips[zBuffer[i].i].height / 2 - 1, // The y coordinate where to place the image on the canvas

            stripWidth, // The width of the image to use (stretch or reduce the image)

            _screenStrips[zBuffer[i].i].height + 2 // The height of the image to use (stretch or reduce the image)
          );
        }

        // different colors for x and y walls
        // else if (_screenStrips[zBuffer[i].i].color == "darkgray") {
        //   raycastCtx.fillStyle = "rgba(0,0,0,0.5)";
        //   raycastCtx.fillRect(
        //     zBuffer[i].i * stripWidth, // The x coordinate where to place the image on the canvas

        //     canvasHeight / 2 - _screenStrips[zBuffer[i].i].height / 2 - 1, // The y coordinate where to place the image on the canvas

        //     stripWidth, // The width of the image to use (stretch or reduce the image)

        //     _screenStrips[zBuffer[i].i].height + 2 // The height of the image to use (stretch or reduce the image)
        //   );
        // }
      }

      // DRAWING SPRITES
      // if angle difference is less than half the fov plus a little extra because
      // the calculation is based on the center of the sprite
      // todo: (actually, fix this to get the border of the sprite) <<<
      //   else if (Math.abs(angleDiff) < fovHalf + Math.PI / 12) {
      //     raycastCtx.fillStyle = "red";

      //     const offsetXAux = (angleDiff / fov) * 2;

      //     // size = 0.5
      //     let sizeAux = Math.round((0.5 * viewDist) / spriteDist);

      //     raycastCtx.fillRect(
      //       screenSize.width / 2 -
      //         (screenSize.width / 2) * offsetXAux -
      //         sizeAux / 2,
      //       canvasHeight / 2 - sizeAux / 2,
      //       sizeAux,
      //       sizeAux
      //     );
      //   }
    }
  };

  // ----- TAKING THE PICTURE -----

  const takePhoto = () => {
    draw();
    raycastingPhoto.currentPhoto =
      raycastingPhoto.photos.push(
        raycastCtx.getImageData(0, 0, screenSize.width, screenSize.height)
      ) - 1;
  };

  // ----- KEYBINDINGS -----

  const bindingsKeyDown = (e: KeyboardEvent) => {
    e = e || window.event;

    // Which key was pressed?
    console.log(e.key);

    switch (e.key.toLowerCase()) {
      // case "arrowup":
      //   e.preventDefault();
      //   break;

      // case "arrowdown":
      //   e.preventDefault();
      //   break;

      case "arrowleft":
        e.preventDefault();
        if (
          getCurrentUpgrade(
            Categories.RaycastingPhotoModule,
            "Gallery Commands"
          )
        )
          addCommand("gallery previous");
        break;

      case "arrowright":
        e.preventDefault();
        if (
          getCurrentUpgrade(
            Categories.RaycastingPhotoModule,
            "Gallery Commands"
          )
        )
          addCommand("gallery next");
        break;

      case "delete":
        e.preventDefault();
        if (
          getCurrentUpgrade(
            Categories.RaycastingPhotoModule,
            "Gallery Commands"
          )
        )
          addCommand("gallery delete");
        break;

      default:
        break;
    }
  };

  // ----- USE EFFECT -----

  useEffect(() => {
    // initializing the raycastCanvas
    raycastCanvas = canvasRef.current;
    raycastCtx = raycastCanvas!.getContext("2d", { willReadFrequently: true })!;

    raycastCtx.imageSmoothingEnabled = false;

    // greystoneWall.src = "src/assets/greystone.png";
    greystoneWall.src = "src/assets/asdf.png";

    greystoneWall.onload = () => {
      var tempCanvas = document.createElement("canvas");
      var tempCtx = tempCanvas.getContext("2d");

      tempCtx?.drawImage(greystoneWall, 0, 0);

      floorData = tempCtx?.getImageData(0, 0, texSize, texSize)!;

      setLoadingState(false);

      if (raycastingPhoto.trigger == true) {
        takePhoto();
        raycastingPhoto.trigger = false;
      }

      if (raycastingPhoto.trigger2 == true) {
        raycastingPhoto.trigger2 = false;
      }

      if (raycastingPhoto.photos.length > 0)
        raycastCtx.putImageData(
          raycastingPhoto.photos[raycastingPhoto.currentPhoto],
          0,
          0
        );
      else raycastCtx.clearRect(0, 0, screenSize.width, screenSize.height);
    };

    mode7Image = raycastCtx.createImageData(
      screenSize.width,
      screenSize.height
    );

    raycastCtx.font = "30px monospace";
    currentFlashLightSettings = getCurrentUpgrade(
      Categories.RaycastingPhotoModule,
      "Photo Flash"
    );
    photoColor = getCurrentUpgrade(
      Categories.RaycastingPhotoModule,
      "Photo Threat Detection"
    );

    // initializing the screen strips
    initScreen();

    // console.log("RaycastingPhotoModule2");
    if (focused) document.addEventListener("keydown", bindingsKeyDown);

    return () => {
      if (focused) document.removeEventListener("keydown", bindingsKeyDown);
    };
  }, [raycastingPhoto.trigger, raycastingPhoto.trigger2]);

  useEffect(() => {
    setCoverState(true);
    // console.log(raycastingPhoto.cover);
    if (raycastingPhoto.cover == 0) {
      setCoverState(false);
    }
  }, [raycastingPhoto.cover]);
  // ----- HTML -----

  return (
    <div className="flex flex-col full-size overflow-hidden text-white">
      {/* frames: {frameCountState} fps: {fpsState} */}
      <div
        style={{
          position: "relative",
          width: width + "px",
          height: height + "px",
          // border: "2px solid blue",
          backgroundColor: "black",
        }}
      >
        <div
          style={{
            transform: "scale(" + scale + ")",
            width: screenSize.width,
            height: screenSize.height,
            backgroundColor: "black",
            left: width / 2 - screenSize.width / 2,
            top: height / 2 - screenSize.height / 2,
            position: "absolute",
            // border: "2px solid red",
          }}
        >
          <div className="flex full-size full-center font-mono text-green-500 animate-pulse">
            No photos.
          </div>
        </div>
        <canvas
          ref={canvasRef}
          style={{
            transform: "scale(" + scale + ")",
            left: width / 2 - screenSize.width / 2,
            top: height / 2 - screenSize.height / 2,
            position: "absolute",
            // border: "2px solid red",
          }}
          width={screenSize.width}
          height={screenSize.height}
        />
        {(loadingState || coverState) && (
          <div
            style={{
              transform: "scale(" + scale + ")",
              width: screenSize.width + 2,
              height: screenSize.height + 2,
              backgroundColor: "black",
              left: width / 2 - screenSize.width / 2 - 1,
              top: height / 2 - screenSize.height / 2 - 1,
              position: "absolute",
              // border: "2px solid red",
            }}
          >
            <div className="flex full-size full-center font-mono text-green-500 animate-pulse">
              Processing . . .
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
