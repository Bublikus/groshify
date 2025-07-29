# CollapsibleCard Component

A generic, reusable collapsible card component with smooth animations.

## Usage

```tsx
import { CollapsibleCard } from '@/components/common/CollapsibleCard';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CollapsibleCard
      title="My Collapsible Section"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <div>Your content here</div>
    </CollapsibleCard>
  );
}
```

## Props

- `title` (string): The title displayed in the card header
- `isOpen` (boolean): Controls whether the card is expanded or collapsed
- `onOpenChange` (function): Callback function called when the open state changes
- `children` (ReactNode): The content to display when the card is expanded
- `className` (string, optional): Additional CSS classes to apply to the card

## Features

- Smooth expand/collapse animations using Framer Motion
- Rotating chevron icon that indicates the current state
- Hover effects on the trigger button
- Fully accessible with proper ARIA attributes
- Responsive design 