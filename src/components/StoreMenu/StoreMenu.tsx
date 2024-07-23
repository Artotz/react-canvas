import { useEffect, useState } from "react";
import { addMoney, money } from "../../utils/GameVariables";
import Tabs from "../Tabs/Tabs";
import { StoreItems, StoreItemType } from "./StoreItems";

export default function StoreMenu() {
  const [tabs, setTabs] = useState<React.JSX.Element[]>([]);
  const [keyState, setKeyState] = useState<number>(0);

  function tabItem(_tabItem: { title: string; content: StoreItemType[] }) {
    return (
      <div
        id={_tabItem.title}
        className="flex flex-col full-size bg-black overflow-y-scroll no-scrollbar"
      >
        {_tabItem.content.map((v, i) => {
          return (
            <div
              className="flex flex-row w-full h-content py-2 justify-around items-center border-solid border-2 border-green-500"
              key={i}
            >
              {/* name */}
              <div className="flex w-full full-center">
                <div className="flex">{v.name}</div>
              </div>

              {/* tiers */}
              <div className="flex w-full full-center gap-x-2">
                {v.cost.map((v2, i2) => {
                  return (
                    <div
                      key={i2}
                      className={`flex w-4 h-4 border-solid border-2 border-green-500 ${i2 < v.acquired ? "bg-green-500" : "bg-black"}`}
                    ></div>
                  );
                })}
              </div>

              {/* buy button */}
              <div className="flex w-full full-center py-2">
                {v.cost.length <= v.acquired ? (
                  <div className="flex p-2 px-4 border-solid border-2 border-black bg-green-500 text-black select-none">
                    Acquired
                  </div>
                ) : (
                  <div
                    className="flex p-2 px-4 border-solid border-2 border-black hover:border-green-500 bg-green-500 text-black hover:bg-black hover:text-green-500 cursor-pointer select-none"
                    onClick={() => {
                      addMoney(-v.cost[v.acquired]);

                      StoreItems[_tabItem.title as keyof typeof StoreItems][
                        i
                      ].acquired += 1;

                      setKeyState(Math.random());
                    }}
                  >
                    {v.cost[v.acquired] + " $"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  useEffect(() => {
    let _tabs: React.JSX.Element[] = [];
    for (let category in StoreItems) {
      _tabs.push(
        tabItem({
          title: category,
          content: StoreItems[category as keyof typeof StoreItems],
        }),
      );
    }
    setTabs([..._tabs]);
  }, [keyState]);

  return (
    <div className="flex flex-col full-size border-solid border-2 border-black full-center">
      <div className="flex w-full h-12 border-solid border-b-4 border-black full-center bg-green-500 text-black text-xl font-bold">
        {money} $
      </div>
      <Tabs tabsArray={tabs} />
    </div>
  );
}
