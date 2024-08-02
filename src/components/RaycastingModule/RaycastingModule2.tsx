import { createRef, useEffect, useState } from "react";

import {
  mapsArray,
  player,
  spriteExample,
  twoPI,
} from "../../utils/GameVariables";

export type RaycastingModule2Props = {
  width?: number;
  height?: number;
  _fov?: number;
  _targetFps?: number;
  focused: boolean;
};

type ScreenStrip = { height: number; color: string; texX: number };

export default function RaycastingModule2({
  width = 0,
  height = 0,
  _fov = 90,
  _targetFps = 30,
  focused = false,
}: RaycastingModule2Props) {
  // ----- VARIABLES -----

  var frameCount = 0;

  // ----- CANVAS -----

  const screenSize = { width: 480, height: 360 };
  //const screenSize = { width: width, height: height };

  var raycastCanvas: HTMLCanvasElement | null;
  var raycastCtx: CanvasRenderingContext2D;

  const greystoneWall = new Image();
  greystoneWall.src = "src/assets/greystone.png";

  greystoneWall.onload = () => {
    var tempCanvas = document.createElement("canvas");
    var tempCtx = tempCanvas.getContext("2d");

    tempCtx?.drawImage(greystoneWall, 0, 0);

    floorData = tempCtx?.getImageData(0, 0, 64, 64)!;

    // why is this called multiple times?
    // console.log("bruh");
  };

  var floorData = new ImageData(64, 64);
  var mode7Image: ImageData;

  // ----- FUN ZONE -----

  const numRays = screenSize.width;
  const fov = (_fov * Math.PI) / 180;

  var _screenStrips: ScreenStrip[] = Array(numRays);
  var zBuffer: { type: string; i: number; dist: number }[] = Array(numRays);

  const stripWidth = screenSize.width / numRays;
  const fovHalf = fov / 2;

  const viewDist = screenSize.width / 2 / Math.tan(fovHalf);

  const wallHeight = 1;

  // ----- MEMES -----

  var targetFps: number = _targetFps,
    fpsInterval: number,
    startTime: number,
    now: number,
    then: number,
    elapsed: number;

  var fps = 0;

  // ----- FUNCTIONS -----
  // ----- INITIALIZATION -----

  const initScreen = () => {
    for (var i = 0; i < numRays; i++) {
      let strip = {
        height: 100,
        color: "black",
        texX: 0,
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
    var xHit = 0; // the x and y coord of where the ray hit the block
    var yHit = 0;

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
    let color = "grey";

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

        xHit = x; // save the coordinates of the hit. We only really use these to draw the rays on minimap.
        yHit = y;

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
          xHit = x;
          yHit = y;
          textureX = x % 1;
          if (up) textureX = 1 - textureX;

          // if on the other side
          color = "darkgray";
        }
        break;
      }
      x += dX;
      y += dY;
    }

    if (dist) {
      //drawRay(xHit, yHit);

      // draw rays
      //raycastingRays[stripIdx] = { x: xHit, y: yHit };

      var strip = _screenStrips[stripIdx];

      dist = Math.sqrt(dist);

      // use perpendicular distance to adjust for fish eye
      // distorted_dist = correct_dist / cos(relative_angle_of_ray)

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

      // optimization ?
      zBuffer[stripIdx] = { type: "wall", i: stripIdx, dist: dist };
    }
  };

  // ----- FLOOR AND CEILING ( MODE 7 ) -----

  const mode7 = () => {
    let _x = 0,
      _y = 0,
      z = -screenSize.height / 2;

    const texSize = 64,
      scale = 4,
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

        _y *= texSize / scale;
        _y %= texSize;
        _y = ~~_y;

        // X -----
        _x = ((screenSize.width - x) * _sin + x * _cos) / z;
        _x += z < 0 ? _playerX : -_playerX;
        _x = Math.abs(_x);

        _x *= texSize / scale;
        _x %= texSize;
        _x = ~~_x;

        // The data from an image consists of an array of size width * height * 4,
        // where the values in order are the R, G, B and A of a single pixel.

        // Below is the (kinda annoying) method to acess each one.
        // if (y < screenSize.height / 2) {
        //   // r
        //   mode7Image.data[x * 4 + y * mode7Image.width * 4] =
        //     floorData.data[_x * 4 + _y * texSize * 4] / 2;
        //   // g
        //   mode7Image.data[x * 4 + y * mode7Image.width * 4 + 1] =
        //     floorData.data[_x * 4 + _y * texSize * 4 + 1] / 2;
        //   // b
        //   mode7Image.data[x * 4 + y * mode7Image.width * 4 + 2] =
        //     floorData.data[_x * 4 + _y * texSize * 4 + 2] / 2;
        //   // a
        //   mode7Image.data[x * 4 + y * mode7Image.width * 4 + 3] = 255;
        // }
        // else {
        // r
        mode7Image.data[x * 4 + y * mode7Image.width * 4] =
          floorData.data[_x * 4 + _y * texSize * 4];
        // g
        mode7Image.data[x * 4 + y * mode7Image.width * 4 + 1] =
          floorData.data[_x * 4 + _y * texSize * 4 + 1];
        // b
        mode7Image.data[x * 4 + y * mode7Image.width * 4 + 2] =
          floorData.data[_x * 4 + _y * texSize * 4 + 2];
        // a
        mode7Image.data[x * 4 + y * mode7Image.width * 4 + 3] = 255;
        // }
      }

      z++;
    }
    raycastCtx.putImageData(mode7Image, 0, 0);
  };

  // ----- DRAWING -----

  const draw = () => {
    castRays();
    // SCALING -----
    // fix this for scaling
    let canvasHeight = raycastCtx.canvas.height;
    raycastCtx.clearRect(0, 0, raycastCtx.canvas.width, canvasHeight);

    // FLOOR AND CEILING
    mode7();

    // SPRITES -----
    // angle between player and sprite
    var angleRadians = Math.atan2(
      spriteExample.y - player.y,
      spriteExample.x - player.x
    );

    // angle difference
    let angleDiff =
      ((player.rot - angleRadians + twoPI / 2) % twoPI) - twoPI / 2;
    angleDiff = angleDiff < -twoPI / 2 ? angleDiff + twoPI : angleDiff;

    // sprite distance
    // fix the corners problem ( the distance is measured from the center of the sprite )
    let spriteDist = Math.sqrt(
      (spriteExample.y - player.y) * (spriteExample.y - player.y) +
        (spriteExample.x - player.x) * (spriteExample.x - player.x)
    );

    // inserting sprite in zBuffer
    let _zBuffer = [...zBuffer, { type: "sprite", i: -1, dist: spriteDist }];
    _zBuffer.sort((a, b) => b.dist - a.dist);

    //console.log(spriteDist);
    // SPRITES (END)-----

    // DRAWING THE TEXTURES -----
    // screen strips

    // let auxMeme = Math.min(frameCount * 2, _zBuffer.length);
    let auxMeme = _zBuffer.length;
    // let auxMeme = 0;

    for (let i = 0; i < auxMeme; i++) {
      // DRAWING THE TEXTURES
      // TODO: use texture pixel colors
      if (_zBuffer[i].type == "wall") {
        raycastCtx.drawImage(
          greystoneWall, // source image

          Math.floor(64 * _screenStrips[_zBuffer[i].i].texX), // The x coordinate where to start clipping

          0, // The y coordinate where to start clipping

          stripWidth, // The width of the clipped image

          64, // The height of the clipped image

          _zBuffer[i].i * stripWidth, // The x coordinate where to place the image on the canvas

          canvasHeight / 2 - _screenStrips[_zBuffer[i].i].height / 2, // The y coordinate where to place the image on the canvas

          stripWidth, // The width of the image to use (stretch or reduce the image)

          _screenStrips[_zBuffer[i].i].height // The height of the image to use (stretch or reduce the image)
        );

        // different colors for x and y walls
        if (_screenStrips[_zBuffer[i].i].color == "grey") {
          raycastCtx.fillStyle = "rgba(0,0,0,0.5)";
          raycastCtx.fillRect(
            _zBuffer[i].i * stripWidth, // The x coordinate where to place the image on the canvas

            canvasHeight / 2 - _screenStrips[_zBuffer[i].i].height / 2, // The y coordinate where to place the image on the canvas

            stripWidth, // The width of the image to use (stretch or reduce the image)

            _screenStrips[_zBuffer[i].i].height // The height of the image to use (stretch or reduce the image)
          );
        }
      }
      // DRAWING SPRITES
      // if angle difference is less than half the fov plus a little extra because
      // the calculation is based on the center of the sprite
      // (actually, fix this to get the border of the sprite)
      else if (Math.abs(angleDiff) < fovHalf + Math.PI / 12) {
        raycastCtx.fillStyle = "red";

        const offsetXAux = (angleDiff / fov) * 2;

        let sizeAux = Math.round((0.5 * viewDist) / spriteDist);

        raycastCtx.fillRect(
          screenSize.width / 2 -
            (screenSize.width / 2) * offsetXAux -
            sizeAux / 2,
          canvasHeight / 2 - sizeAux / 2,
          sizeAux,
          sizeAux
        );
      }
    }

    // FRAMES -----
    raycastCtx.fillStyle = "red";
    raycastCtx.beginPath();
    raycastCtx.fillText("fps: " + fps, 10, 20);
  };

  // ----- USE EFFECT -----

  useEffect(() => {
    let animationFrameId: number;

    // initializing the raycastCanvas
    raycastCanvas = document.getElementById(
      "raycastCanvas"
    ) as HTMLCanvasElement;
    raycastCtx = raycastCanvas!.getContext("2d")!;

    mode7Image = raycastCtx.createImageData(
      screenSize.width,
      screenSize.height
    );

    raycastCtx.font = "20px monospace";

    // scaling test
    // if (focused) raycastCtx.scale(1.25, 1.25);
    // else raycastCtx.scale(0.8, 0.8);

    // initializing the screen strips
    initScreen();

    //draw();

    // fps calculation
    fpsInterval = 1000 / targetFps;
    then = window.performance.now();
    startTime = then;

    console.log("RaycastingModule2");

    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);

      // game logic

      // calc elapsed time since last loop

      now = window.performance.now();
      elapsed = now - then;

      // if enough time has elapsed, draw the next frame

      if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        var sinceStart = now - startTime;
        var currentFps =
          Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;

        fps = currentFps;

        // drawing the frames
        draw();
      }
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ----- HTML -----

  return (
    <div className="flex flex-col full-size overflow-hidden text-white">
      {/* frames: {frameCountState} fps: {fpsState} */}
      <div
        style={{
          position: "relative",
          width: width + "px",
          height: height + "px",
          border: "2px solid blue",
          backgroundColor: "black",
        }}
      >
        <canvas
          id="raycastCanvas"
          style={{
            position: "absolute",
            border: "2px solid red",
          }}
          width={screenSize.width}
          height={screenSize.height}
        />
      </div>
    </div>
  );
}