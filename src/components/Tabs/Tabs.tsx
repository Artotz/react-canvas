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
    <div className="flex flex-col full-size">
      {/* ----- TAB TITLES ----- */}
      <div className="flex border-b-2 border-gray-300 gap-x-2">
        {props.tabsArray!.map((tab, i) => (
          <button
            key={i}
            className={`${
              activeTab === i ? "bg-black text-white" : "text-black"
            } flex-1 text-gray-700 font-medium py-2 duration-500`}
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
            <div key={i} className="flex full-size">
              {tab}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
