import CLIModule from "./components/CLIModule/CLIModule";
import DesktopInterface from "./components/DesktopInterface/DesktopInterface";
import MainMenu from "./components/MainMenu/MainMenu";
import "./styles.css";

export default function App() {
  // ----- HTML -----

  return (
    <div className="flex w-full h-full bg-gray-500 p-4 justify-center items-center">
      {/* <DesktopInterface /> */}
      {/* <MainMenu /> */}
      <CLIModule />
    </div>
  );
}
