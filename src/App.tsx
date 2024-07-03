import CLIModule from "./components/CLIModule/CLIModule";
import DesktopInterface from "./components/DesktopInterface/DesktopInterface";
import MainMenu from "./components/MainMenu/MainMenu";
import StoreMenu from "./components/StoreMenu/StoreMenu";
import "./styles.css";

export default function App() {
  return (
    <div className="flex full-size bg-gray-500 p-4 full-center">
      {/* <DesktopInterface /> */}
      {/* <MainMenu /> */}
      {/* <CLIModule /> */}
      <StoreMenu />
    </div>
  );
}
