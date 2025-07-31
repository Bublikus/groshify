# CategoryStats Component

Displays statistics cards for the categories page, showing key metrics like total categories, rules, transactions, and accuracy.

## Usage

```typescript
import { CategoryStats } from "@/components/page-sections/categories/CategoryStats";

<CategoryStats
  totalCategories={14}
  activeCategories={14}
  totalRules={28}
  totalTransactions={156}
  totalSubcategories={42}
/>
```

## Props

- `totalCategories` - Total number of categories
- `activeCategories` - Number of active categories
- `totalRules` - Total number of auto-categorization rules
- `totalTransactions` - Total number of categorized transactions
- `totalSubcategories` - Total number of subcategories

## Features

- Responsive grid layout (2 columns on medium screens, 4 on large)
- Displays key metrics with icons
- Shows accuracy percentage for auto-categorization
- Clean card-based design
