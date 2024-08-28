import { useState, useEffect, ChangeEvent } from "react";
import DesktopInterface from "../DesktopInterface/DesktopInterface";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function GameHandler() {
  const [username, setUsername, removeUsername] = useLocalStorage(
    "username",
    undefined
  );

  const [inputText, setInputText] = useState("");
  function handleInputTextChange(e: ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  const [loading, setLoading] = useState(0);
  const [isLogged, setIsLogged] = useState(false);

  const bruh = (v: number) => {
    setLoading(v);
    if (v < 100) {
      setTimeout(bruh, 100, v + 5);
    } else {
    }
  };

  useEffect(() => {
    bruh(0);
    // setLoading(loading == 1 ? 0 : 1);
  }, []);

  return (
    <div className="flex flex-col full-size full-center bg-black border-green-500 border-solid border-2 text-green-500">
      {isLogged ? (
        <DesktopInterface />
      ) : loading < 100 ? (
        <div className="flex flex-col gap-2 full-size full-center">
          {/* Loading */}
          <div className="flex flex-col w-[256] h-4 border-green-500 border-solid border-2">
            <div
              // onTransitionEnd={() => setLoading(loading == 1 ? 0 : 1)}

              style={{
                backgroundColor: "rgb(34,197,94)",
                transitionDuration: "100ms",
                height: "100%",
                width: 1 * loading + "%",
              }}
            ></div>
          </div>
        </div>
      ) : username == undefined ? (
        // (true) ?
        <div className="flex flex-col p-4 gap-2 full-center bg-blue-500">
          <div>userName on storage: {username || "undefined"}</div>
          <div>input value: {inputText}</div>
          <input
            type="text"
            value={inputText}
            onChange={handleInputTextChange}
          />
          <div className="flex gap-2 full-center">
            <button
              onClick={() => {
                removeUsername();
              }}
            >
              remove
            </button>
            <button
              onClick={() => {
                setUsername(inputText);
              }}
            >
              send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col p-4 gap-2 full-center bg-blue-500">
          Welcome {username}
          <div className="flex gap-2 full-center">
            <button
              onClick={() => {
                removeUsername();
              }}
            >
              log out
            </button>
            <button
              onClick={() => {
                setIsLogged(true);
              }}
            >
              enter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
