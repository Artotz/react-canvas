import { useEffect, useState } from "react";

import {
  map,
  mapHeight,
  mapWidth,
  player,
  raycastingRays,
  twoPI,
} from "../../utils/GameVariables";

export type RaycastingModuleProps = {
  width?: number;
  height?: number;
  _numRays?: number;
  _fov?: number;
  _targetFps?: number;
};

// RaycastingModule.defaultProps = {
//   miniMapScale: 10,
//   screenWidth: 600,
//   screenHeight: 480,
//   stripWidth: 20,
//   fov: 60,
//   targetFps: 30,
// };

type ScreenStrip = { top: number; left: number; height: number; color: string };

export default function RaycastingModule({
  width = 100,
  height = 100,
  _numRays = 10,
  _fov = 60,
  _targetFps = 30,
}: RaycastingModuleProps) {
  // ----- VARIABLES -----

  var frameCount = 0;
  const [frameCountState, setFrameCountState] = useState(0);

  // ----- SCREEN (RAYCASTING) -----

  var _screenStrips: ScreenStrip[] = [];
  const [screenStrips, setScreenStrips] = useState<ScreenStrip[]>([]);

  // ----- FUN ZONE -----

  const screenWidth = width;
  const screenHeight = height;

  const numRays = _numRays;
  const fov = (_fov * Math.PI) / 180;

  const stripWidth = Math.ceil(screenWidth / numRays);
  //const fovHalf = fov / 2;

  const viewDist = screenWidth / 2 / Math.tan(fov / 2);

  // ----- MEMES -----

  var targetFps: number = _targetFps,
    fpsInterval: number,
    startTime: number,
    now: number,
    then: number,
    elapsed: number;

  const [fpsState, setFpsState] = useState(0);

  // ----- FUNCTIONS -----
  // ----- INITIALIZATION -----

  const initScreen = () => {
    _screenStrips.length = 0;

    for (var i = 0; i < screenWidth; i += stripWidth) {
      let strip = {
        top: 0,
        left: i,
        height: 0,
        color: "grey",
      };

      _screenStrips.push(strip);
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
        rayScreenPos * rayScreenPos + viewDist * viewDist,
      );

      // The angle of the ray, relative to the viewing direction
      // Right triangle: a = sin(A) * c
      var rayAngle = Math.asin(rayScreenPos / rayViewDist);

      castSingleRay(
        // Add the players viewing direction
        // to get the angle in world space
        player.rot + rayAngle,
        stripIdx++,
      );
    }
    setScreenStrips([..._screenStrips]);

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

    var textureX; // the x-coord on the texture of the block, ie. what part of the texture are we going to render
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

    let color = "grey";

    while (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
      var wallX = Math.floor(x + (right ? 0 : -1));
      var wallY = Math.floor(y);

      // is this point inside a wall block?
      if (map[wallY][wallX] > 0) {
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

    while (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
      var wallY = Math.floor(y + (up ? -1 : 0));
      var wallX = Math.floor(x);
      if (map[wallY][wallX] > 0) {
        var distX = x - player.x;
        var distY = y - player.y;
        var blockDist = distX * distX + distY * distY;
        if (!dist || blockDist < dist) {
          dist = blockDist;
          xHit = x;
          yHit = y;
          textureX = x % 1;
          if (up) textureX = 1 - textureX;

          color = "darkgray";
        }
        break;
      }
      x += dX;
      y += dY;
    }

    if (dist) {
      //drawRay(xHit, yHit);
      raycastingRays[stripIdx] = { x: xHit, y: yHit };

      var strip = _screenStrips[stripIdx];

      dist = Math.sqrt(dist);

      // use perpendicular distance to adjust for fish eye
      // distorted_dist = correct_dist / cos(relative_angle_of_ray)

      dist = dist * Math.cos(player.rot - rayAngle);

      // now calc the position, height and width of the wall strip

      // "real" wall height in the game world is 1 unit, the distance from the player to the screen is viewDist,
      // thus the height on the screen is equal to wall_height_real * viewDist / dist

      var height = Math.round(viewDist / dist);

      // width is the same, but we have to stretch the texture to a factor of stripWidth to make it fill the strip correctly
      //var width = height * stripWidth;

      // top placement is easy since everything is centered on the x-axis, so we simply move
      // it half way down the screen and then half the wall height back up.
      var top = Math.round((screenHeight - height) / 2);

      strip.top = top;
      strip.height = height;
      strip.color = color;
    }
  };

  // ----- DRAWING -----

  const draw = () => {
    setFrameCountState(frameCount);

    castRays();
  };

  // ----- USE EFFECT -----

  useEffect(() => {
    let animationFrameId: number;

    // initializing the screen strips
    initScreen();

    // fps calculation
    fpsInterval = 1000 / targetFps;
    then = window.performance.now();
    startTime = then;

    if (raycastingRays.length == 0) {
      for (var i = 0; i < numRays; i++) {
        raycastingRays.push({ x: 0, y: 0 });
      }
    }

    // console.log("RaycastingModule");

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

        setFpsState(currentFps);

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
    <div className="flex full-size full-center overflow-hidden">
      <div
        style={{
          position: "relative",
          width: screenWidth + "px",
          height: screenHeight + "px",
        }}
      >
        {/* ----- UPDATING THE SCREEN STRIPS DIVS ----- */}
        {screenStrips.map((v, i) => {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: v.top + "px",
                left: v.left + "px",
                width: stripWidth + "px",
                height: v.height + "px",
                overflow: "hidden",
                backgroundColor: v.color,
              }}
            ></div>
          );
        })}

        {/* ----- SKY ----- */}
        <div
          style={{
            width: screenWidth + "px",
            height: screenHeight / 2 + "px",
            backgroundColor: "#AAF",
          }}
        >
          {/* ----- DEBUG (YES, IN THE SKY) ----- */}
          frames: {frameCountState} fps: {fpsState}
        </div>

        {/* ----- GROUND ----- */}
        <div
          style={{
            width: screenWidth + "px",
            height: screenHeight / 2 + "px",
            backgroundColor: "#CC9",
          }}
        ></div>
      </div>
    </div>
  );
}
