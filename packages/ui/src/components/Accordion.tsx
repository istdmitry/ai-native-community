/**
 * Accordion Component — 8Hats Lab Design System
 *
 * Collapsible sections with keyboard navigation and animated transitions.
 * Token source: style1-teal-gold.json (border-light, foreground), duration-normal (200ms)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

interface AccordionPanelProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({ item, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(isOpen ? 'none' : '0px');

  useEffect(() => {
    if (isOpen) {
      const el = contentRef.current;
      if (el) {
        setMaxHeight(`${el.scrollHeight}px`);
        // After transition, remove max-height constraint so content can resize
        const timer = setTimeout(() => setMaxHeight('none'), 200);
        return () => clearTimeout(timer);
      }
    } else {
      // First set explicit height so transition can animate from it
      const el = contentRef.current;
      if (el) {
        setMaxHeight(`${el.scrollHeight}px`);
        // Force reflow, then collapse
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setMaxHeight('0px');
          });
        });
      } else {
        setMaxHeight('0px');
      }
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(item.id);
    }
  };

  return (
    <div className="border-b border-border-light">
      <h3>
        <button
          type="button"
          id={`accordion-header-${item.id}`}
          aria-expanded={isOpen}
          aria-controls={`accordion-panel-${item.id}`}
          onClick={() => onToggle(item.id)}
          onKeyDown={handleKeyDown}
          className={[
            'flex items-center justify-between w-full py-4 px-1 text-left font-display text-base font-medium text-foreground',
            'transition-colors duration-normal',
            'hover:text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
          ].join(' ')}
        >
          <span>{item.title}</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`shrink-0 ml-2 transition-transform duration-normal ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </h3>
      <div
        id={`accordion-panel-${item.id}`}
        role="region"
        aria-labelledby={`accordion-header-${item.id}`}
        ref={contentRef}
        style={{ maxHeight, overflow: 'hidden' }}
        className="transition-[max-height] duration-normal ease-out-expo"
      >
        <div className="pb-4 px-1 text-sm text-muted-foreground">
          {item.content}
        </div>
      </div>
    </div>
  );
};

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, allowMultiple = false, className = '', ...props }, ref) => {
    const [openIds, setOpenIds] = useState<Set<string>>(() => {
      const defaults = new Set<string>();
      items.forEach((item) => {
        if (item.defaultOpen) defaults.add(item.id);
      });
      return defaults;
    });

    const handleToggle = useCallback(
      (id: string) => {
        setOpenIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            if (!allowMultiple) {
              next.clear();
            }
            next.add(id);
          }
          return next;
        });
      },
      [allowMultiple]
    );

    return (
      <div ref={ref} className={className} {...props}>
        {items.map((item) => (
          <AccordionPanel
            key={item.id}
            item={item}
            isOpen={openIds.has(item.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';
