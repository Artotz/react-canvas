import MainInterface from "./components/MainInterface/MainInterface";
import MainMenu from "./components/MainMenu/MainMenu";
import "./styles.css";

export default function App() {
  // ----- HTML -----

  return (
    <div className="flex w-full h-full bg-green-500 p-4 justify-center items-center ">
      <MainInterface />
      {/* <MainMenu /> */}
    </div>
  );
}
