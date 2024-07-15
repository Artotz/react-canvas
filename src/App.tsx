import CLIModule from "./components/CLIModule/CLIModule";
import DesktopInterface from "./components/DesktopInterface/DesktopInterface";
import MainMenu from "./components/MainMenu/MainMenu";
import MissionMenu from "./components/MissionMenu/MissionMenu";
import StoreMenu from "./components/StoreMenu/StoreMenu";
import "./styles.css";

export default function App() {
  return (
    <div
      className="flex full-size bg-gray-500 p-2 full-center"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* <DesktopInterface /> */}
      {/* <MainMenu /> */}
      {/* <CLIModule /> */}
      {/* <StoreMenu /> */}
      <MissionMenu />
    </div>
  );
}
