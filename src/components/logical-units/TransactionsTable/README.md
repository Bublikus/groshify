# TransactionsTable Component

This folder contains the organized TransactionsTable component with separated concerns for better maintainability and reusability.

## 📁 File Structure

```
TransactionsTable/
├── README.md                    # This documentation file
├── index.ts                     # Main exports
├── TransactionsTable.tsx        # Main component (UI layer)
├── TransactionsTableContainer.tsx # Container component
├── hooks/                       # Business logic and custom hooks
│   ├── useTransactionsTable.ts
│   └── index.ts
├── helpers.ts                   # Utility functions
├── constants.ts                 # Component constants
└── types.ts                     # TypeScript interfaces and types
```

## 🏗️ Architecture

### **Component Separation of Concerns:**

1. **`TransactionsTable.tsx`** - UI Layer
   - Pure React component
   - Handles rendering and user interactions
   - Uses hooks for business logic
   - No direct state management

2. **`TransactionsTableContainer.tsx`** - Container Layer
   - Combines stateless component with business logic
   - Provides data and handlers to UI component
   - Manages component dependencies

3. **`hooks/useTransactionsTable.ts`** - Business Logic Layer
   - Custom hook `useTransactionsTable`
   - State management
   - Data processing and calculations
   - Event handlers

4. **`helpers.ts`** - Utility Layer
   - Transaction processing functions
   - Data transformation utilities
   - Pure functions with no side effects

5. **`constants.ts`** - Constants Layer
   - Component-specific constants
   - Configuration values
   - Magic number replacements

6. **`types.ts`** - Type Definitions
   - TypeScript interfaces
   - Type safety across the component

7. **`index.ts`** - Public API
   - Exports for external consumption
   - Clean interface for other components

## 🎯 Key Features

- **Sticky Category Column**: Pinned left column with category selection
- **Smart Category Detection**: Auto-categorizes transactions based on descriptions
- **Monthly Grouping**: Groups data by month with navigation tabs
- **Responsive Design**: Mobile-friendly with compact layouts
- **Real-time Summaries**: Live category and financial summaries
- **File Upload**: Supports multiple file formats (CSV, Excel)

## 🔧 Usage

```tsx
import { TransactionsTableContainer } from "@/components/logical-units/TransactionsTable";

function App() {
  return <TransactionsTableContainer />;
}
```

## 📊 Data Flow

1. **File Upload** → `handleFileUpload` in hooks
2. **Category Detection** → AI categorization via API
3. **Data Processing** → `useTransactionsTable` hook
4. **UI Rendering** → `TransactionsTable` component

## 🎨 Styling

- Uses shadcn/ui components
- Responsive design with Tailwind CSS
- Sticky table column with custom CSS
- Framer Motion animations

## 🔄 State Management

- Local state with React hooks
- Centralized state in `useTransactionsTable` hook
- Immutable state updates
- Optimized re-renders with `useMemo`

## 📱 Responsive Features

- Mobile-first design
- Compact category column on mobile
- Stacked summary cards on small screens
- Touch-friendly interactions

## 🚀 Performance

- Memoized calculations
- Efficient re-renders
- Lazy loading of data
- Optimized animations

## 🔧 Props Interface

The component accepts the following props:

```typescript
interface TransactionsTableProps {
  state: TransactionsTableState;
  setState: React.Dispatch<React.SetStateAction<TransactionsTableState>>;
  handleFileUpload: (file: File) => Promise<void>;
  handleFileRemove: () => void;
  handleCategoryChange: (rowId: string, category: TransactionCategory) => void;
  monthlyData: MonthData[];
  currentMonthData: ParsedRow[];
  currentSums: CurrentSums;
  categorySummaries: [string, CategorySummary][];
  supportedExtensions: string[];
  expenseCategories: Array<{
    name: string;
    description: string;
    icon: string;
    color: string;
    subcategories: string[];
  }>;
}
```
