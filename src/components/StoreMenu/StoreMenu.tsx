import { useEffect, useState } from "react";
import { addMoney, money } from "../../utils/GameVariables";
import Tabs from "../Tabs/Tabs";
import { StoreItems, StoreItemType } from "./StoreItems";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function StoreMenu() {
  const [tabs, setTabs] = useState<React.JSX.Element[]>([]);
  const [keyState, setKeyState] = useState<number>(0);
  const [acquiredUpgrades, setAcquiredUpgrades, removeAcquiredUpgrades] =
    useLocalStorage("acquiredUpgrades", undefined);

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
                      className={`flex w-4 h-4 border-solid border-2 border-green-500 ${
                        i2 < v.acquired ? "bg-green-500" : "bg-black"
                      }`}
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

                      StoreItems.map((v) => {
                        if (v.name == _tabItem.content[i].name) {
                          v.acquired++;
                        }
                      });

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
    let _dbUpgrades = acquiredUpgrades;

    StoreItems.map((v, i) => {
      v.acquired = _dbUpgrades[i] || 0;
    });

    console.log("loaded from database");
    console.log(_dbUpgrades);
  }, []);

  useEffect(() => {
    let _tabs: React.JSX.Element[] = [];

    let _array = {} as any;

    StoreItems.map((v) => {
      if (!_array.hasOwnProperty(v.category)) {
        _array[v.category] = [];
      }
      _array[v.category].push(v);
    });

    console.log("updated");

    for (let myProp in _array) {
      _tabs.push(tabItem({ title: myProp, content: _array[myProp] }));
    }

    setTabs([..._tabs]);

    let _acquiredUpgrades = StoreItems.map((v) => v.acquired);
    setAcquiredUpgrades(_acquiredUpgrades);
    console.log("saved to database");
    console.log(_acquiredUpgrades);
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
