# CategoryFilters Component

Provides search and filtering functionality for the categories page.

## Usage

```typescript
import { CategoryFilters } from "@/components/page-sections/categories/CategoryFilters";

<CategoryFilters />
```

## Features

- **Search functionality** - Search categories by name
- **Status filtering** - Filter by All, Active, or Inactive categories
- **Responsive design** - Grid layout that adapts to screen size
- **Clean UI** - Card-based design with proper spacing

## State Management

The component manages its own state for:

- Search query input
- Status filter selection

## Future Enhancements

- Add debounced search for better performance
- Implement actual filtering logic
- Add more filter options (by subcategory, transaction count, etc.)
