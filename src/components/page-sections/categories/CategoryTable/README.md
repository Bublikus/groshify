# CategoryTable Component

Displays a comprehensive table of categories with expandable subcategories, transaction data, and management actions.

## Usage

```typescript
import { CategoryTable } from "@/components/page-sections/categories/CategoryTable";

<CategoryTable categories={categories} />
```

## Features

- **Expandable Categories** - Click chevron to show/hide subcategories
- **Subcategory Details** - Shows transaction count and amounts for each subcategory
- **Auto Rules Display** - Shows categorization rules with status indicators
- **Interactive Actions** - Edit, settings, and more options for each category
- **Status Toggle** - Switch to activate/deactivate categories
- **Animated Transitions** - Smooth expand/collapse animations using Framer Motion

## Props

- `categories` - Array of Category objects with subcategories and rules

## State Management

The component manages:

- Expanded categories state (which categories are expanded)
- Toggle functionality for expanding/collapsing categories

## Data Display

- **Category Name** - With icon and badges showing rule/subcategory counts
- **Transaction Count** - Total transactions for the category
- **Total Amount** - Sum of all transactions (color-coded for positive/negative)
- **Auto Rules** - Shows first 2 rules with status indicators
- **Status** - Active/Inactive toggle switch
- **Actions** - Edit, settings, and more options buttons

## Future Enhancements

- Implement actual edit functionality
- Add sorting capabilities
- Implement filtering based on search/filter inputs
- Add bulk actions for multiple categories
