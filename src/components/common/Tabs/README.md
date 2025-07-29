# Tabs Component

A generic, reusable tabs component with navigation arrows that select previous/next tabs and scroll them into view.

## Usage

```tsx
import { Tabs } from '@/components/common/Tabs';

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'january', label: 'January' },
  { value: 'february', label: 'February' },
  { value: 'march', label: 'March' },
  // ... more tabs
];

function MyComponent() {
  const [selectedTab, setSelectedTab] = useState('all');

  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      tabs={tabs}
      showNavigationArrows={true}
    />
  );
}
```

## Props

- `value` (string): Currently selected tab value
- `onValueChange` (function): Callback when tab selection changes
- `tabs` (TabItem[]): Array of tab items to display
- `showNavigationArrows` (boolean, optional): Whether to show left/right navigation arrows (default: true)
- `className` (string, optional): Additional CSS classes for the container
- `tabsListClassName` (string, optional): Additional CSS classes for the tabs list
- `tabTriggerClassName` (string, optional): Additional CSS classes for individual tab triggers

## TabItem Interface

- `value` (string): Unique identifier for the tab
- `label` (string): Display text for the tab
- `disabled` (boolean, optional): Whether the tab is disabled

## Features

- **Tab navigation**: Left/right arrows select the previous/next tab
- **Auto-scroll to view**: Selected tabs are automatically scrolled into view
- **Smart button states**: Navigation arrows are disabled when at the first/last tab
- **Smooth animations**: All transitions use smooth scrolling and animations
- **Responsive design** with horizontal scrolling
- **Customizable styling** through className props
- **Disabled state support** for individual tabs
- **TypeScript support** with proper interfaces
- **Accessible** with proper ARIA attributes
- **Automatic cleanup** of event listeners 