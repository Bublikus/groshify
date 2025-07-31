/**
 * Text formatting utilities
 */

export interface TextFormatOptions {
  /**
   * Maximum length of the text (default: no limit)
   */
  maxLength?: number;
  /**
   * Whether to add ellipsis when text is truncated (default: true)
   */
  addEllipsis?: boolean;
  /**
   * Whether to preserve word boundaries when truncating (default: true)
   */
  preserveWords?: boolean;
  /**
   * Whether to convert to lowercase (default: false)
   */
  toLowerCase?: boolean;
  /**
   * Whether to convert to uppercase (default: false)
   */
  toUpperCase?: boolean;
  /**
   * Whether to capitalize first letter of each word (default: false)
   */
  capitalize?: boolean;
  /**
   * Whether to remove extra whitespace (default: true)
   */
  trimWhitespace?: boolean;
}

/**
 * Format text according to specified options
 *
 * @param text - Text to format
 * @param options - Text formatting options
 * @returns Formatted text string
 *
 * @example
 * formatText("hello world", { capitalize: true }) // "Hello World"
 * formatText("very long text", { maxLength: 10 }) // "very long..."
 * formatText("  extra  spaces  ", { trimWhitespace: true }) // "extra spaces"
 */
export function formatText(
  text: string | null | undefined,
  options: TextFormatOptions = {}
): string {
  const {
    maxLength,
    addEllipsis = true,
    preserveWords = true,
    toLowerCase = false,
    toUpperCase = false,
    capitalize = false,
    trimWhitespace = true,
  } = options;

  // Handle null, undefined, or empty values
  if (!text || typeof text !== "string") {
    return "";
  }

  let result = text;

  // Trim whitespace
  if (trimWhitespace) {
    result = result.replace(/\s+/g, " ").trim();
  }

  // Apply case transformations
  if (toLowerCase) {
    result = result.toLowerCase();
  } else if (toUpperCase) {
    result = result.toUpperCase();
  } else if (capitalize) {
    result = capitalizeWords(result);
  }

  // Truncate if maxLength is specified
  if (maxLength && result.length > maxLength) {
    result = truncateText(result, maxLength, addEllipsis, preserveWords);
  }

  return result;
}

/**
 * Truncate text to specified length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param addEllipsis - Whether to add ellipsis
 * @param preserveWords - Whether to preserve word boundaries
 * @returns Truncated text
 */
function truncateText(
  text: string,
  maxLength: number,
  addEllipsis: boolean,
  preserveWords: boolean
): string {
  if (text.length <= maxLength) {
    return text;
  }

  const ellipsis = addEllipsis ? "..." : "";
  const availableLength = maxLength - ellipsis.length;

  if (preserveWords) {
    // Find the last space within the available length
    const lastSpaceIndex = text.lastIndexOf(" ", availableLength);
    if (lastSpaceIndex > 0) {
      return text.substring(0, lastSpaceIndex) + ellipsis;
    }
  }

  return text.substring(0, availableLength) + ellipsis;
}

/**
 * Capitalize the first letter of each word
 *
 * @param text - Text to capitalize
 * @returns Capitalized text
 *
 * @example
 * capitalizeWords("hello world") // "Hello World"
 * capitalizeWords("john doe") // "John Doe"
 */
export function capitalizeWords(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Convert text to title case (first letter of each word capitalized)
 *
 * @param text - Text to convert
 * @returns Title case text
 *
 * @example
 * toTitleCase("hello world") // "Hello World"
 * toTitleCase("the quick brown fox") // "The Quick Brown Fox"
 */
export function toTitleCase(text: string): string {
  return capitalizeWords(text);
}

/**
 * Convert text to sentence case (first letter of first word capitalized)
 *
 * @param text - Text to convert
 * @returns Sentence case text
 *
 * @example
 * toSentenceCase("hello world") // "Hello world"
 * toSentenceCase("THE QUICK BROWN FOX") // "The quick brown fox"
 */
export function toSentenceCase(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert text to camel case
 *
 * @param text - Text to convert
 * @returns Camel case text
 *
 * @example
 * toCamelCase("hello world") // "helloWorld"
 * toCamelCase("user name") // "userName"
 */
export function toCamelCase(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .split(/[\s\-_]+/)
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
}

/**
 * Convert text to kebab case
 *
 * @param text - Text to convert
 * @returns Kebab case text
 *
 * @example
 * toKebabCase("hello world") // "hello-world"
 * toKebabCase("userName") // "user-name"
 */
export function toKebabCase(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert text to snake case
 *
 * @param text - Text to convert
 * @returns Snake case text
 *
 * @example
 * toSnakeCase("hello world") // "hello_world"
 * toSnakeCase("userName") // "user_name"
 */
export function toSnakeCase(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Convert text to Pascal case
 *
 * @param text - Text to convert
 * @returns Pascal case text
 *
 * @example
 * toPascalCase("hello world") // "HelloWorld"
 * toPascalCase("user name") // "UserName"
 */
export function toPascalCase(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .split(/[\s\-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Remove HTML tags from text
 *
 * @param text - Text with HTML tags
 * @returns Clean text without HTML tags
 *
 * @example
 * stripHtmlTags("<p>Hello <strong>world</strong></p>") // "Hello world"
 */
export function stripHtmlTags(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text.replace(/<[^>]*>/g, "");
}

/**
 * Escape HTML special characters
 *
 * @param text - Text to escape
 * @returns Escaped text
 *
 * @example
 * escapeHtml("<script>alert('hello')</script>") // "&lt;script&gt;alert('hello')&lt;/script&gt;"
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}

/**
 * Unescape HTML special characters
 *
 * @param text - Text to unescape
 * @returns Unescaped text
 *
 * @example
 * unescapeHtml("&lt;script&gt;alert('hello')&lt;/script&gt;") // "<script>alert('hello')</script>"
 */
export function unescapeHtml(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  const htmlUnescapes: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };

  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (match) => htmlUnescapes[match]);
}

/**
 * Generate a slug from text
 *
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 *
 * @example
 * generateSlug("Hello World!") // "hello-world"
 * generateSlug("User Name 123") // "user-name-123"
 */
export function generateSlug(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Mask sensitive information in text
 *
 * @param text - Text to mask
 * @param maskChar - Character to use for masking (default: '*')
 * @param visibleChars - Number of characters to keep visible at start and end (default: 2)
 * @returns Masked text
 *
 * @example
 * maskText("1234567890") // "12******90"
 * maskText("john.doe@example.com") // "jo**********om"
 */
export function maskText(text: string, maskChar: string = "*", visibleChars: number = 2): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (text.length <= visibleChars * 2) {
    return text;
  }

  const start = text.substring(0, visibleChars);
  const end = text.substring(text.length - visibleChars);
  const masked = maskChar.repeat(text.length - visibleChars * 2);

  return start + masked + end;
}
