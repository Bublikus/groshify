# DataTable Component

A generic, reusable data table component with support for custom rendering, sticky columns, and animations.

## Usage

```tsx
import { DataTable } from '@/components/common/DataTable';

interface ExpenseData {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

const columns = [
  {
    key: 'name' as keyof ExpenseData,
    title: 'Name',
  },
  {
    key: 'amount' as keyof ExpenseData,
    title: 'Amount',
    render: (value: number) => `$${value}`,
  },
  {
    key: 'category' as keyof ExpenseData,
    title: 'Category',
    sticky: true, // Makes this column sticky
  },
];

const data: ExpenseData[] = [
  { id: '1', name: 'Item 1', amount: 100, category: 'Food', date: '2024-01-01' },
  { id: '2', name: 'Item 2', amount: 200, category: 'Transport', date: '2024-01-02' },
];

function MyComponent() {
  return (
    <DataTable<ExpenseData>
      columns={columns}
      data={data}
      stickyFirstColumn={true}
      rowKey="id"
    />
  );
}
```

## Props

- `columns` (DataTableColumn<TData>[]): Array of column definitions
- `data` (TData[]): Array of data objects to display
- `stickyFirstColumn` (boolean, optional): Makes the first column sticky
- `className` (string, optional): Additional CSS classes
- `rowKey` (keyof TData | function, optional): Key for React list rendering (default: "id")

## DataTableColumn Interface

- `key` (keyof TData): Unique identifier for the column (must be a key of your data type)
- `title` (string): Display title for the column header
- `render` (function, optional): Custom render function for cell content with proper typing
- `className` (string, optional): Additional CSS classes for the column
- `sticky` (boolean, optional): Makes this specific column sticky

## Features

- **Full TypeScript Support**: Generic types ensure type safety for your data
- **Type Inference**: Column keys are validated against your data type
- **Custom Rendering**: Type-safe render functions with proper value and row typing
- **Smooth animations** using Framer Motion
- **Support for sticky columns**
- **Responsive design**
- **Flexible row key configuration**
- **Built-in null/undefined handling** 