/**
 * Tabs Component — 8Hats Lab Design System
 *
 * Tabbed content with keyboard navigation.
 * Token source: style1-teal-gold.json (primary, muted-foreground, foreground)
 */

import React, { useState, useRef, useCallback } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, defaultTab, onChange, className = '', ...props }, ref) => {
    const [activeTab, setActiveTab] = useState(() => {
      if (defaultTab && tabs.some((t) => t.id === defaultTab)) return defaultTab;
      const firstEnabled = tabs.find((t) => !t.disabled);
      return firstEnabled?.id ?? tabs[0]?.id ?? '';
    });

    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleTabChange = useCallback(
      (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
      },
      [onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, currentIndex: number) => {
        const enabledTabs = tabs
          .map((tab, index) => ({ tab, index }))
          .filter(({ tab }) => !tab.disabled);

        const currentEnabledIndex = enabledTabs.findIndex(
          ({ index }) => index === currentIndex
        );

        let targetEnabledIndex: number | null = null;

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          targetEnabledIndex =
            (currentEnabledIndex + 1) % enabledTabs.length;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          targetEnabledIndex =
            (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetEnabledIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetEnabledIndex = enabledTabs.length - 1;
        }

        if (targetEnabledIndex !== null) {
          const target = enabledTabs[targetEnabledIndex];
          handleTabChange(target.tab.id);
          tabRefs.current[target.index]?.focus();
        }
      },
      [tabs, handleTabChange]
    );

    const activeContent = tabs.find((t) => t.id === activeTab)?.content;
    const tabListId = `tabs-${React.useId?.() ?? Math.random().toString(36).substr(2, 9)}`;

    return (
      <div ref={ref} className={className} {...props}>
        {/* Tab List */}
        <div
          role="tablist"
          aria-label="Tabs"
          className="flex border-b border-border-light gap-1"
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab;
            const isDisabled = tab.disabled ?? false;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                role="tab"
                id={`${tabListId}-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`${tabListId}-panel-${tab.id}`}
                aria-disabled={isDisabled}
                tabIndex={isActive ? 0 : -1}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={[
                  'px-4 py-2.5 text-sm font-medium transition-colors duration-normal -mb-px',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-md',
                  isActive
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${tabListId}-panel-${tab.id}`}
            aria-labelledby={`${tabListId}-tab-${tab.id}`}
            hidden={tab.id !== activeTab}
            tabIndex={0}
            className="pt-4 focus-visible:outline-none"
          >
            {tab.id === activeTab && activeContent}
          </div>
        ))}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
