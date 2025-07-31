# Subcategories Component

A virtualized, interactive component for displaying and managing transaction categories and their subcategories with expandable/collapsible functionality.

## Usage

```typescript
import { SubcategoriesContainer } from "@/components/page-sections/categories";

<SubcategoriesContainer categories={categories} />
```

## Features

- **Virtualized Rendering** - Efficient display of large category lists using VirtualizedList
- **Expandable Categories** - Click to expand/collapse subcategories with smooth animations
- **Dynamic Item Heights** - Automatically adjusts item heights based on content
- **Interactive Management** - Edit and delete buttons for subcategories
- **Add Subcategory** - Button to add new subcategories to categories
- **Status Indicators** - Visual indicators for active/inactive subcategories
- **Transaction Counts** - Shows transaction count for each subcategory
- **Responsive Design** - Works well on different screen sizes
- **Smooth Animations** - Framer Motion animations for expand/collapse

## Props

### SubcategoriesContainer Props

- `categories` - Array of Category objects to display

### Subcategories Props

- `categories` - Array of Category objects
- `totalCategories` (optional) - Total number of categories
- `totalSubcategories` (optional) - Total number of subcategories

## Category Display

Each category shows:

- **Category Icon and Name** - Visual identification
- **Subcategory Count** - Number of subcategories in parentheses
- **Expand/Collapse Button** - Chevron icon to toggle subcategory visibility
- **Add Subcategory Button** - To create new subcategories for the category

## Subcategory Display

When expanded, each subcategory shows:

- **Status Indicator** - Green dot for active, gray for inactive
- **Subcategory Name** - Name of the subcategory
- **Transaction Count** - Number of transactions in this subcategory
- **Edit Button** - To modify the subcategory
- **Delete Button** - To remove the subcategory

## Technical Implementation

### VirtualizedList Integration

- Uses `react-virtuoso` for efficient rendering of large datasets
- Dynamic item height calculation based on expansion state
- Adaptive height container that adjusts to content
- Optimized performance for large category lists

### Animation Features

- Staggered entrance animations for categories
- Smooth expand/collapse transitions
- Height animations for subcategory lists
- Framer Motion integration for fluid interactions

### State Management

- Local expansion state per category item
- Optimized re-rendering with useCallback
- Proper TypeScript typing throughout

## Performance Considerations

- **Virtualization**: Only renders visible items for large datasets
- **Memoization**: Uses useCallback for render functions
- **Dynamic Heights**: Calculates item heights based on content
- **Efficient Updates**: Minimal re-renders with proper state management

## Accessibility

- **Keyboard Navigation** - Full keyboard support for expand/collapse
- **Screen Reader Support** - Proper ARIA labels and descriptions
- **Focus Management** - Maintains focus during interactions
- **High Contrast** - Works with high contrast themes

## Future Enhancements

- Implement actual subcategory editing functionality
- Add subcategory creation modal/form
- Implement subcategory deletion confirmation
- Add subcategory reordering capabilities
- Show subcategory effectiveness metrics
- Add bulk operations for subcategories
- Implement search/filter within subcategories
