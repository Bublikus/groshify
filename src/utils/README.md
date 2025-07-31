# Utils - Formatting Utilities

This directory contains all formatting utilities organized by type for better maintainability and reusability.

## Structure

```
src/utils/
├── index.ts              # Main exports for all utilities
├── cn.ts                 # CSS class name utility
├── search-sort.ts        # Search result sorting utilities
├── number-format.ts      # Number formatting utilities
├── currency-format.ts    # Currency formatting utilities
├── date-format.ts        # Date formatting utilities
├── text-format.ts        # Text formatting utilities
├── file-format.ts        # File formatting utilities
├── language-format.ts    # Language formatting utilities
└── README.md            # This file
```

## Usage

### Import from main utils index

```typescript
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  formatLanguage,
  formatNumber,
  formatText,
  sortBySearchRelevance,
  sortCategoriesBySearchRelevance,
} from "@/utils";
```

### Import specific utilities

```typescript
import { formatDate, formatDateHuman } from "@/utils/date-format";
import { formatCurrency, formatNumber } from "@/utils/number-format";
import { sortBySearchRelevance } from "@/utils/search-sort";
import { capitalizeWords, formatText } from "@/utils/text-format";
```

## Available Utilities

### Search and Sort (`search-sort.ts`)

- `sortBySearchRelevance()` - Sort items by search relevance (exact > starts with > contains)
- `sortCategoriesBySearchRelevance()` - Sort categories specifically by search relevance
- `SearchableItem` - Interface for searchable items
- `SearchField` - Type for search field definitions
- `SearchSortOptions` - Interface for search sort options

### Number Formatting (`number-format.ts`)

- `formatNumber()` - Format numbers with custom options
- `formatCurrency()` - Format numbers as currency (legacy, use currency-format.ts)
- `formatPercentage()` - Format numbers as percentages
- `parseFormattedNumber()` - Parse formatted number strings

### Currency Formatting (`currency-format.ts`)

- `formatCurrency()` - Format numbers as currency with proper symbols
- `getCurrencySymbol()` - Get currency symbol by code
- `getCurrencyName()` - Get currency name by code
- `parseFormattedCurrency()` - Parse formatted currency strings

### Date Formatting (`date-format.ts`)

- `formatDate()` - Format dates with custom options
- `formatDateHuman()` - Format dates in human-readable format
- `formatDateShort()` - Format dates in short format
- `formatRelativeTime()` - Format relative time (e.g., "2 hours ago")
- `parseDate()` - Parse date strings

### Text Formatting (`text-format.ts`)

- `formatText()` - Format text with various options
- `capitalizeWords()` - Capitalize first letter of each word
- `toTitleCase()` - Convert to title case
- `toSentenceCase()` - Convert to sentence case
- `toCamelCase()` - Convert to camel case
- `toKebabCase()` - Convert to kebab case
- `toSnakeCase()` - Convert to snake case
- `toPascalCase()` - Convert to Pascal case
- `stripHtmlTags()` - Remove HTML tags
- `escapeHtml()` - Escape HTML characters
- `unescapeHtml()` - Unescape HTML characters
- `generateSlug()` - Generate URL-friendly slugs
- `maskText()` - Mask sensitive information

### File Formatting (`file-format.ts`)

- `formatFileSize()` - Format file sizes for display
- `parseFileSize()` - Parse file size strings
- `validateFileExtension()` - Validate file extensions
- `getFileExtension()` - Get file extension
- `getFilenameWithoutExtension()` - Get filename without extension
- `generateUniqueFilename()` - Generate unique filenames
- `formatFileType()` - Format file type for display
- `isImageFile()` - Check if file is an image
- `isDocumentFile()` - Check if file is a document
- `isSpreadsheetFile()` - Check if file is a spreadsheet

### Language Formatting (`language-format.ts`)

- `formatLanguage()` - Format language for display
- `getLanguageName()` - Get language name by code
- `getLanguageFlag()` - Get language flag emoji
- `getAvailableLanguages()` - Get all available language codes
- `isLanguageSupported()` - Check if language is supported
- `getDefaultLanguage()` - Get default language
- `getLanguageFromLocale()` - Get language from browser locale
- `formatLocale()` - Format locale for display
- `getBrowserLanguages()` - Get browser language preferences
- `getPreferredLanguage()` - Get preferred language
- `formatLanguageList()` - Format language list
- `getLanguageDirection()` - Get language direction (LTR/RTL)

## Migration Guide

### From Component-Specific Utilities

If you were using formatting utilities from component-specific files, update your imports:

**Before:**

```typescript
import { formatCurrency } from "@/utils/number-format";
import { formatFileSize } from "../helpers";
```

**After:**

```typescript
import { formatCurrency, formatFileSize } from "@/utils";
```

### Constants Migration

File size constants have been moved to the utils folder:

**Before:**

```typescript
import { FILE_SIZE_CONSTANTS } from "./constants";
```

**After:**

```typescript
import { FILE_SIZE_CONSTANTS } from "@/utils";
```

## Best Practices

1. **Use the main index**: Import from `@/utils` for better tree-shaking
2. **Type safety**: All utilities include proper TypeScript types
3. **Consistent options**: All formatting functions use similar option patterns
4. **Error handling**: All utilities handle null/undefined values gracefully
5. **Documentation**: Each function includes JSDoc with examples

## Examples

### Number Formatting

```typescript
import { formatCurrency, formatNumber } from "@/utils";

// Basic number formatting
formatNumber(1234567.89); // "1.234.567,89"

// Currency formatting
formatCurrency(1234567.89, { currency: "USD" }); // "$1,234,567.89"
formatCurrency(1234567.89, { currency: "EUR" }); // "€1,234,567.89"
```

### Date Formatting

```typescript
import { formatDate, formatRelativeTime } from "@/utils";

// Date formatting
formatDate(new Date("2024-01-15")); // "01/15/2024"
formatDate(new Date("2024-01-15"), { format: "DD/MM/YYYY" }); // "15/01/2024"

// Relative time
formatRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
```

### Text Formatting

```typescript
import { capitalizeWords, formatText, generateSlug } from "@/utils";

// Text formatting
formatText("hello world", { capitalize: true }); // "Hello World"
formatText("very long text", { maxLength: 10 }); // "very long..."

// Case conversion
capitalizeWords("john doe"); // "John Doe"
generateSlug("Hello World!"); // "hello-world"
```

### File Formatting

```typescript
import { formatFileSize, validateFileExtension } from "@/utils";

// File size formatting
formatFileSize(1024); // "1 KB"
formatFileSize(1048576); // "1 MB"

// File validation
validateFileExtension("document.pdf", [".pdf", ".doc"]); // true
```

### Language Formatting

```typescript
import { formatLanguage, getPreferredLanguage } from "@/utils";

// Language formatting
formatLanguage("en"); // "🇺🇸 English"
formatLanguage("uk"); // "🇺🇦 Українська"

// Browser language detection
getPreferredLanguage(); // "en" or "uk" based on browser settings
```

### Search and Sort

```typescript
import { sortBySearchRelevance } from "@/utils";

// Generic search sorting
const items = [
  { name: "Apple", description: "A fruit" },
  { name: "Banana", description: "A yellow fruit" },
  { name: "Orange", description: "A citrus fruit" },
];

const sorted = sortBySearchRelevance(items, {
  searchQuery: "apple",
  fields: ["name", "description"],
});
// Returns: [{ name: "Apple", description: "A fruit" }, ...]
```
