# Page Sections Components

This directory contains page-specific components that are organized by page/feature. These components are designed to be reusable within their specific page context but are not meant to be shared across different pages.

## Structure

```
page-sections/
├── categories/           # Categories page components
│   ├── CategoryStats.tsx
│   ├── CategoryFilters.tsx
│   ├── CategoryTable.tsx
│   ├── RulesCard.tsx
│   ├── types.ts
│   └── index.ts
├── dashboard/            # Dashboard page components (future)
├── transactions/         # Transactions page components (future)
├── reports/             # Reports page components (future)
└── README.md
```

## Guidelines

### When to Use Page Sections

- **Page-specific components** that are not shared across multiple pages
- **Complex UI sections** that would make the main page file too large
- **Reusable sections** within a specific page context
- **Feature-specific components** that belong to a particular page

### When NOT to Use Page Sections

- **Common components** that are used across multiple pages (use `common/` instead)
- **UI components** that are part of the design system (use `ui/` instead)
- **Business logic components** that represent entities (use `logical-units/` instead)

### Naming Conventions

- Use PascalCase for component names
- Use descriptive names that indicate the component's purpose
- Include the page name in the folder structure for clarity

### File Organization

Each page section folder should contain:

- **Component files** (`.tsx`) - Individual section components
- **Types file** (`types.ts`) - Shared types for the page
- **Index file** (`index.ts`) - Exports for clean imports
- **README.md** (optional) - Documentation for complex sections

### Import Pattern

```typescript
// Good - Clean imports from page sections
import { CategoryStats, CategoryTable } from "@/components/page-sections/categories";

// Avoid - Direct imports from individual files
import { CategoryStats } from "@/components/page-sections/categories/CategoryStats";
```

### Type Sharing

- Define shared types in `types.ts` within each page section folder
- Export types through the `index.ts` file
- Use type imports to avoid duplication

### Example Usage

```typescript
// In a page file
import { CategoryStats, CategoryTable } from "@/components/page-sections/categories";

export default function CategoriesPage() {
  return (
    <div>
      <CategoryStats {...statsProps} />
      <CategoryTable categories={categories} />
    </div>
  );
}
```

## Benefits

1. **Better Organization** - Page-specific components are grouped logically
2. **Cleaner Page Files** - Main page files are more readable
3. **Reusability** - Components can be reused within the same page context
4. **Maintainability** - Easier to find and update page-specific components
5. **Type Safety** - Shared types prevent duplication and ensure consistency

## Migration from Inline Components

When migrating from inline components in page files:

1. **Extract the component** to a separate file
2. **Define proper props interface** for the component
3. **Move shared types** to `types.ts`
4. **Update imports** in the main page file
5. **Test the component** to ensure it works correctly

This structure helps maintain a clean separation between page-specific logic and reusable components while keeping the codebase organized and maintainable.
