import { FC, useState } from 'react';
import { JSX } from 'react/jsx-runtime';

interface Tab {
  id: string;
  label: string;
}

interface ProductTabsProps {
  tabs: Tab[];
  defaultTabId: string;
  children: (activeTabId: string) => JSX.Element;
}

export const ProductTabs: FC<ProductTabsProps> = ({ tabs, defaultTabId, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTabId);
  
  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              className={`px-6 py-3 ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="py-6">
        {children(activeTab)}
      </div>
    </div>
  );
};