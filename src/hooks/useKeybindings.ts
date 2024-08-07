import { useEffect } from "react";
import { player, Player } from "../utils/GameVariables";

export const useKeybindings = () => {
  const bindingsKeyDown = (e: KeyboardEvent) => {
    e = e || window.event;
    // Which key was pressed?

    //console.log(e.key);

    switch (e.key.toLowerCase()) {
      // Up, move player forward, ie. increase speed
      case "w":
        player.speed = 1;
        break;
      // Down, move player backward, set negative speed
      case "s":
        player.speed = -1;
        break;
      // Left, rotate player left
      case "a":
        player.dir = -1;
        break;
      // Right, rotate player right
      case "d":
        player.dir = 1;
        break;
      case "shift":
        player.moveSpeed = 0.1;
        break;
    }
  };

  const bindingsKeyUp = (e: KeyboardEvent) => {
    e = e || window.event;
    switch (e.key.toLowerCase()) {
      case "w":
      case "s":
        player.speed = 0;
        break;
      case "a":
      case "d":
        player.dir = 0;
        break;
      case "shift":
        player.moveSpeed = 0.05;
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", bindingsKeyDown);
    document.addEventListener("keyup", bindingsKeyUp);
    return () => {
      document.removeEventListener("keydown", bindingsKeyDown);
      document.removeEventListener("keyup", bindingsKeyUp);
    };
  }, []);
};
