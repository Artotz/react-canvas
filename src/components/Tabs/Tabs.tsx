import React, { useState } from "react";

type TabsProps = {
  tabsArray: React.JSX.Element[];
};

export default function Tabs(props: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newActiveTab: number,
  ) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div className="flex flex-col full-size overflow-y-hidden">
      {/* ----- TAB TITLES ----- */}
      <div className="flex border-b-2 bg-green-500 border-black gap-x-2">
        {props.tabsArray!.map((tab, i) => (
          <button
            key={i}
            className={`${
              activeTab === i ? "bg-black text-green-500" : "text-black"
            } flex-1 font-medium py-2`}
            onClick={(e) => handleClick(e, i)}
          >
            {tab.props.id}
          </button>
        ))}
      </div>

      {/* ----- CONTENT ----- */}
      {props.tabsArray!.map((tab, i) => {
        if (i === activeTab) {
          return (
            <div key={i} className="flex full-size pb-12">
              {tab}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
