import { FC, useState, useRef, useEffect } from 'react';
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
  const [showScrollIndicators, setShowScrollIndicators] = useState({ left: false, right: false });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollIndicators({
          left: scrollLeft > 0,
          right: scrollLeft < scrollWidth - clientWidth - 1
        });
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowScrollIndicators({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1
      });
    }
  };

  return (
    <div className="relative">
      {/* Scroll Indicators */}
      {showScrollIndicators.left && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none md:hidden" />
      )}
      {showScrollIndicators.right && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none md:hidden" />
      )}

      <div className="border-b border-gray-200 relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide -mb-px"
          onScroll={handleScroll}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                relative
                whitespace-nowrap px-4 py-3 text-sm font-medium
                min-w-[4.5rem] flex-shrink-0
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                ${activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-500 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
                md:px-6 md:py-4 md:text-base
                touch-manipulation
                select-none
              `}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div 
        className="py-4 md:py-6"
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={activeTab}
      >
        {children(activeTab)}
      </div>
    </div>
  );
};