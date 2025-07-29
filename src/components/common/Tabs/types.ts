export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: TabItem[];
  showNavigationArrows?: boolean;
  className?: string;
  tabsListClassName?: string;
  tabTriggerClassName?: string;
}
