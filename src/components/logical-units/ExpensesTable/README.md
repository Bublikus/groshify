# ExpensesTable Component

This folder contains the organized ExpensesTable component with separated concerns for better maintainability and reusability.

## 📁 File Structure

```
ExpensesTable/
├── README.md              # This documentation file
├── index.ts               # Main exports
├── ExpensesTable.tsx      # Main component (UI layer)
├── hooks.ts               # Business logic and custom hooks
├── helpers.ts             # Utility functions and constants
└── types.ts               # TypeScript interfaces and types
```

## 🏗️ Architecture

### **Component Separation of Concerns:**

1. **`ExpensesTable.tsx`** - UI Layer
   - Pure React component
   - Handles rendering and user interactions
   - Uses hooks for business logic
   - No direct state management

2. **`hooks.ts`** - Business Logic Layer
   - Custom hook `useExpensesTable`
   - State management
   - Data processing and calculations
   - Event handlers

3. **`helpers.ts`** - Utility Layer
   - Expense categories constants
   - Category guessing logic
   - Pure functions with no side effects

4. **`types.ts`** - Type Definitions
   - TypeScript interfaces
   - Type safety across the component

5. **`index.ts`** - Public API
   - Exports for external consumption
   - Clean interface for other components

## 🎯 Key Features

- **Sticky Category Column**: Pinned left column with category selection
- **Smart Category Detection**: Auto-categorizes expenses based on descriptions
- **Monthly Grouping**: Groups data by month with navigation tabs
- **Responsive Design**: Mobile-friendly with compact layouts
- **Real-time Summaries**: Live category and financial summaries
- **File Upload**: Supports multiple file formats (CSV, Excel)

## 🔧 Usage

```tsx
import { ExpensesTable } from "@/components/ExpensesTable";

function App() {
  return <ExpensesTable />;
}
```

## 📊 Data Flow

1. **File Upload** → `handleFileUpload` in hooks
2. **Category Detection** → `guessCategory` in helpers
3. **Data Processing** → `useExpensesTable` hook
4. **UI Rendering** → `ExpensesTable` component

## 🎨 Styling

- Uses shadcn/ui components
- Responsive design with Tailwind CSS
- Sticky table column with custom CSS
- Framer Motion animations

## 🔄 State Management

- Local state with React hooks
- Centralized state in `useExpensesTable` hook
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
