# UploadInput Component

A reusable file upload component with drag and drop functionality, built with Framer Motion animations and TypeScript.

## Features

- **Drag and Drop**: Visual feedback when dragging files over the component
- **File Validation**: Built-in file type and size validation
- **Loading States**: Animated loading spinner during file processing
- **Error Handling**: Visual error display with icons
- **Responsive Design**: Mobile-friendly interface
- **Accessibility**: Keyboard navigation and screen reader support
- **Customizable**: Extensive props for customization

## Usage

```tsx
import { UploadInput } from "@/components/common/UploadInput";

function MyComponent() {
  const handleFileSelect = (file: File) => {
    console.log("Selected file:", file);
    // Process the file
  };

  return (
    <UploadInput
      onFileSelect={handleFileSelect}
      acceptedFileTypes={[".csv", ".xlsx", ".xls"]}
      maxFileSize={5 * 1024 * 1024} // 5MB
      dragDropText="Drag and drop your CSV file here"
      supportedExtensionsText="Supported: CSV, Excel files"
    >
      <p>Additional information can go here</p>
    </UploadInput>
  );
}
```

## Props

### UploadInputProps

| Prop                      | Type                   | Default                                              | Description                                              |
| ------------------------- | ---------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| `onFileSelect`            | `(file: File) => void` | **Required**                                         | Callback when a file is selected                         |
| `acceptedFileTypes`       | `string[]`             | `[]`                                                 | Array of accepted file types (e.g., `[".csv", ".xlsx"]`) |
| `maxFileSize`             | `number`               | `undefined`                                          | Maximum file size in bytes                               |
| `disabled`                | `boolean`              | `false`                                              | Whether the component is disabled                        |
| `isLoading`               | `boolean`              | `false`                                              | Shows loading state                                      |
| `error`                   | `string \| null`       | `null`                                               | Error message to display                                 |
| `children`                | `ReactNode`            | `undefined`                                          | Additional content below the upload area                 |
| `className`               | `string`               | `""`                                                 | Additional CSS classes                                   |
| `dragDropText`            | `string`               | `"Drag and drop your file here, or click to browse"` | Text shown in default state                              |
| `dragDropActiveText`      | `string`               | `"Drop your file here"`                              | Text shown when dragging                                 |
| `supportedExtensionsText` | `string`               | `undefined`                                          | Text showing supported file types                        |

## File Validation

The component automatically validates files based on:

1. **File Type**: Checks against `acceptedFileTypes` array
2. **File Size**: Validates against `maxFileSize` if provided

Invalid files will show visual feedback and log errors to console.

## States

- **Default**: Shows upload icon and instruction text
- **Drag Over**: Visual feedback with border color change
- **Drag Reject**: Red border for invalid files
- **Loading**: Spinning animation with "Processing file..." text
- **Error**: Red error container with icon and message
- **Disabled**: Reduced opacity and disabled interactions

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels
- Focus management

## Styling

The component uses CSS modules and can be customized through:

- CSS custom properties (CSS variables)
- Additional `className` prop
- CSS module overrides

## Examples

### Basic Usage

```tsx
<UploadInput onFileSelect={handleFile} />
```

### With File Type Restrictions

```tsx
<UploadInput
  onFileSelect={handleFile}
  acceptedFileTypes={[".csv", ".xlsx"]}
  supportedExtensionsText="CSV and Excel files only"
/>
```

### With Loading State

```tsx
<UploadInput onFileSelect={handleFile} isLoading={isProcessing} error={errorMessage} />
```

### With Custom Content

```tsx
<UploadInput onFileSelect={handleFile}>
  <div className="mt-4 p-4 bg-muted rounded">
    <h4>File Requirements:</h4>
    <ul>
      <li>Maximum 5MB</li>
      <li>CSV or Excel format</li>
      <li>UTF-8 encoding</li>
    </ul>
  </div>
</UploadInput>
```
