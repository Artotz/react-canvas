import { useEffect, useState } from "react";
import Tabs from "../Tabs/Tabs";
import { StoreItems } from "./StoreItems";

export default function StoreMenu() {
  const [tabs, setTabs] = useState<React.JSX.Element[]>([]);

  function tabItem(_tabItem: { title: string; content: string[] }) {
    return (
      <div
        id={_tabItem.title}
        className="flex flex-col full-size bg-sky-300 full-center"
      >
        {_tabItem.content.map((v, i) => {
          return <div key={i}>{v}</div>;
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
  }, []);

  return (
    <div className="flex full-size border-solid border-2 border-black full-center">
      <Tabs tabsArray={tabs} />
    </div>
  );
}
