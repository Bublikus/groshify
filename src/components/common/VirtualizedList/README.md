# VirtualizedList Component

A virtualized, generic, reusable list component with support for custom rendering, loading states, error handling, smooth animations, and **adaptive heights**. Built on top of react-virtuoso for optimal performance with large datasets.

## Usage

```tsx
import { VirtualizedList } from "@/components/common/VirtualizedList";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const users: UserData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/avatars/jane.jpg",
  },
];

function UserList() {
  const renderUser = (user: UserData, index: number) => (
    <div className="flex items-center space-x-3">
      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
      <div>
        <h3 className="font-medium">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );

  return (
    <VirtualizedList<UserData>
      data={users}
      renderItem={renderUser}
      itemHeight={80}
      adaptiveHeight={true}
      minHeight="200px"
      maxHeight="600px"
    />
  );
}
```

## Props

- `data` (TData[]): Array of data objects to display
- `renderItem` (function): Function to render each item with proper typing
- `itemHeight` (number, optional): Fixed height for each item (default: 50px)
- `itemSize` (function, optional): Function to calculate variable item heights
- `className` (string, optional): Additional CSS classes
- `height` (string | number, optional): Height of the list container
- `overscan` (number, optional): Number of items to render outside viewport (default: 5)
- `itemKey` (keyof TData | function, optional): Key for React list rendering
- `emptyState` (ReactNode, optional): Custom empty state component
- `loading` (boolean, optional): Loading state flag
- `loadingState` (ReactNode, optional): Custom loading state component
- `adaptiveHeight` (boolean, optional): Enable adaptive height calculation
- `minHeight` (string | number, optional): Minimum height for adaptive mode
- `maxHeight` (string | number, optional): Maximum height for adaptive mode

## Adaptive Height

The component now supports **adaptive height calculation** that automatically adjusts the container height based on the data size:

### Automatic Adaptive Height

```tsx
// Automatically uses adaptive height for datasets with < 100 items
<VirtualizedList data={smallDataset} renderItem={renderItem} itemHeight={60} />
```

### Explicit Adaptive Height

```tsx
// Force adaptive height calculation
<VirtualizedList
  data={data}
  renderItem={renderItem}
  itemHeight={60}
  adaptiveHeight={true}
  minHeight="200px"
  maxHeight="80vh"
/>
```

### Fixed Height

```tsx
// Use fixed height (disables adaptive calculation)
<VirtualizedList data={data} renderItem={renderItem} height="400px" adaptiveHeight={false} />
```

## Variable Item Heights

Support for items with different heights:

### Fixed Item Heights (Better Performance)

```tsx
<VirtualizedList
  data={data}
  renderItem={renderItem}
  itemHeight={80} // All items have the same height
/>
```

### Variable Item Heights

```tsx
<VirtualizedList
  data={data}
  renderItem={renderItem}
  itemSize={(index) => (data[index].isExpanded ? 120 : 60)} // Dynamic heights
/>
```

## renderItem Function

The `renderItem` function receives two parameters:

- `item` (TData): The current item from the data array
- `index` (number): The index of the current item

```tsx
const renderItem = (item: MyDataType, index: number) => (
  <div className="p-4 border-b">
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </div>
);
```

## Features

- **Virtualization**: Efficient rendering of large datasets using react-virtuoso
- **Adaptive Heights**: Automatic height calculation based on data size
- **Variable Item Heights**: Support for items with different heights
- **Type Safety**: Full TypeScript support with generic types
- **Custom Rendering**: Flexible render function with proper typing
- **Loading States**: Built-in loading state handling
- **Error Handling**: Error boundary integration
- **Empty States**: Customizable empty state display
- **Smooth Animations**: Framer Motion integration
- **Responsive Design**: Mobile-friendly styling
- **Accessibility**: Proper focus management and ARIA support
- **Performance Optimized**: Efficient rendering for large datasets
- **Custom Item Keys**: Flexible key generation for React reconciliation

## Advanced Usage

### Adaptive Height with Constraints

```tsx
<VirtualizedList
  data={data}
  renderItem={renderItem}
  itemHeight={60}
  adaptiveHeight={true}
  minHeight="150px"
  maxHeight="70vh"
/>
```

### Variable Heights with Adaptive Container

```tsx
<VirtualizedList
  data={data}
  renderItem={renderItem}
  itemSize={(index) => {
    const item = data[index];
    return item.type === "header" ? 80 : item.type === "content" ? 120 : 60;
  }}
  adaptiveHeight={true}
  minHeight="200px"
/>
```

### Custom Empty State

```tsx
const CustomEmptyState = () => (
  <div className="text-center py-8">
    <Icon name="empty" className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
    <h3 className="text-lg font-medium mb-2">No items found</h3>
    <p className="text-muted-foreground">Try adjusting your search criteria</p>
  </div>
);

<VirtualizedList data={data} renderItem={renderItem} emptyState={<CustomEmptyState />} />;
```

### Custom Loading State

```tsx
const CustomLoadingState = () => (
  <div className="flex items-center justify-center py-8">
    <Spinner className="w-6 h-6 mr-2" />
    <span>Loading items...</span>
  </div>
);

<VirtualizedList
  data={data}
  renderItem={renderItem}
  loading={isLoading}
  loadingState={<CustomLoadingState />}
/>;
```

### Dynamic Item Keys

```tsx
// Using a property as key
<VirtualizedList data={users} renderItem={renderUser} itemKey="id" />

// Using a function for complex key generation
<VirtualizedList
  data={users}
  renderItem={renderUser}
  itemKey={(user, index) => `${user.id}-${user.email}`}
/>
```

## Performance Considerations

- Use `itemHeight` for fixed-height items (better performance)
- Use `itemSize` function for variable-height items
- Keep `renderItem` functions lightweight
- Use `React.memo` for complex item components
- Set appropriate `overscan` values based on your use case
- Adaptive height is automatically enabled for datasets < 100 items
- For large datasets, consider using fixed height for better performance

## Adaptive Height Algorithm

The adaptive height calculation works as follows:

1. **Auto-detection**: For datasets < 100 items, adaptive height is automatically enabled
2. **Manual control**: Use `adaptiveHeight={true/false}` to override auto-detection
3. **Calculation**: Height = min(max(dataLength \* itemHeight, minHeight), maxHeight)
4. **Constraints**: Respects `minHeight` and `maxHeight` props
5. **Responsive**: Adjusts based on viewport size

## Accessibility

- Proper focus management
- Keyboard navigation support
- ARIA labels and roles
- Screen reader compatibility
- High contrast support

## Styling

The component uses CSS modules for styling and supports:

- Custom CSS classes via `className` prop
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Custom scrollbar styling
- Hover and focus states
- Smooth height transitions for adaptive mode
