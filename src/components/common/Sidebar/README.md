# Sidebar Component

A responsive sidebar component that provides navigation for the Groshify application.

## Features

- **Responsive Design**: Desktop sidebar with mobile sheet overlay
- **Navigation Sections**: Main navigation and quick actions
- **Active State**: Visual indication of current page
- **Error Boundary**: Wrapped with error boundary for robust error handling
- **CSS Modules**: Styled using CSS modules for component-specific styles

## Structure

```
Sidebar/
├── Sidebar.tsx          # Main component
├── Sidebar.module.css   # Component styles
├── index.ts            # Exports
└── README.md           # Documentation
```

## Usage

```tsx
import { Sidebar } from "@/components/common/Sidebar";

function Layout() {
  return (
    <div>
      <Sidebar />
      <main>
        {/* Main content */}
      </main>
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Optional CSS class name |

## Components

### Sidebar
The main sidebar component that handles both desktop and mobile layouts.

### SidebarContent
Internal component that renders the sidebar content (header, navigation, footer).

### NavigationItemComponent
Internal component that renders individual navigation items with active state handling.

## Styling

The component uses CSS modules for styling with the following key classes:

- `.sidebar` - Main container
- `.desktopSidebar` - Desktop sidebar layout
- `.mobileMenuButton` - Mobile menu trigger button
- `.sidebarContent` - Content wrapper
- `.header` - Header section with logo and app info
- `.navigation` - Navigation area
- `.navigationItem` - Individual navigation items
- `.footer` - Footer section

## Responsive Behavior

- **Desktop (lg+)**: Fixed sidebar on the left with main content offset
- **Mobile**: Hidden sidebar with hamburger menu trigger and sheet overlay

## Dependencies

- `@/components/common/ErrorBoundary` - Error handling
- `@/components/ui/button` - Button components
- `@/components/ui/scroll-area` - Scrollable area
- `@/components/ui/sheet` - Mobile sheet overlay
- `@/constants/app` - App configuration
- `@/constants/navigation` - Navigation items
- `@/utils/cn` - Class name utility 