import React, { memo, useState } from "react";
import { TabsProps } from "./tabs.types";

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div>
      <div className="flex bg-gray-900 item-center rounded-md p-2 space-x-2 m-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 text-sm font-medium p-2 rounded-md text-gray-600 ${
              activeTab === tab.key
                ? "bg-gold-900 text-gray-900"
                : "text-slate-200 hover:bg-gray-800 shadow-2xl"
            }`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div>{tabs.find((tab) => tab.key === activeTab)?.content}</div>
    </div>
  );
};

export default memo(Tabs);
