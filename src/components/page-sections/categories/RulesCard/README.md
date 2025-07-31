# RulesCard Component

Displays auto-categorization rules for the first 3 categories with management capabilities.

## Usage

```typescript
import { RulesCard } from "@/components/page-sections/categories/RulesCard";

<RulesCard categories={categories} />
```

## Features

- **Category Rules Display** - Shows rules for the first 3 categories
- **Rule Status Indicators** - Visual indicators for active/inactive rules
- **Rule Management** - Edit and delete buttons for each rule
- **Add Rule Functionality** - Button to add new rules to categories
- **Animated Entries** - Smooth animations when rules are displayed
- **Clean Layout** - Card-based design with proper spacing

## Props

- `categories` - Array of Category objects (only first 3 are displayed)

## Rule Display

Each category shows:

- **Category Icon and Name** - Visual identification
- **Add Rule Button** - To create new rules for the category
- **Rule List** - All rules for the category with:
  - Status indicator (green dot for active, gray for inactive)
  - Rule condition and value
  - Edit and delete action buttons

## Future Enhancements

- Implement actual rule editing functionality
- Add rule creation modal/form
- Implement rule deletion confirmation
- Add rule reordering capabilities
- Show rule effectiveness metrics
