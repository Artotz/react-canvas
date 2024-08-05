import CLIModule from "./components/CLIModule/CLIModule";
import DesktopInterface from "./components/DesktopInterface/DesktopInterface";
import GameHandler from "./components/GameHandler/GameHandler";
import MissionMenu from "./components/MissionMenu/MissionMenu";
import StoreMenu from "./components/StoreMenu/StoreMenu";
import "./styles.css";

export default function App() {
  return (
    <div
      className="flex full-size bg-gray-500 p-2 full-center"
    // onContextMenu={(e) => {
    //   e.preventDefault();
    //   e.stopPropagation();
    // }}
    >
      {/* <GameHandler /> */}
      <DesktopInterface />
      {/* <MainMenu /> */}
      {/* <CLIModule /> */}
      {/* <StoreMenu /> */}
      {/* <MissionMenu /> */}
    </div>
  );
}
