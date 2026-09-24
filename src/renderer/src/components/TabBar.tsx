import Badge from './ui/Badge';

interface TabBarItem {
  key: string;
  label: string;
  count: number | null;
}

interface TabBarProps {
  tabs: TabBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function TabBar({ tabs, activeKey, onChange }: TabBarProps) {
  return (
    <div className="flex gap-0.5 px-2.5 pt-3 border-b border-border">
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`h-13.5 px-2.75 flex items-center gap-1.75 text-[17px] whitespace-nowrap border-b-[3px] ${
              active
                ? 'text-ink font-bold border-primary'
                : 'text-text-tertiary font-semibold border-transparent'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <Badge size="count" variant={active ? 'solid' : 'neutral'}>
                {tab.count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
