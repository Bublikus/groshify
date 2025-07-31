/**
 * Generic utility for sorting search results by relevance
 * Prioritizes: exact matches > starts with > contains
 *
 * @example
 * ```typescript
 * const items = [
 *   { name: "Apple", description: "A fruit" },
 *   { name: "Banana", description: "A yellow fruit" },
 *   { name: "Orange", description: "A citrus fruit" },
 * ];
 *
 * const sorted = sortBySearchRelevance(items, {
 *   searchQuery: "apple",
 *   fields: ["name", "description"],
 * });
 * // Returns: [{ name: "Apple", description: "A fruit" }, ...]
 * ```
 */

export interface SearchableItem {
  [key: string]: unknown;
}

export type SearchField = string | ((item: SearchableItem) => string);

export interface SearchSortOptions {
  searchQuery: string;
  fields: SearchField[];
  caseSensitive?: boolean;
}

/**
 * Sorts an array of items by search relevance
 * @param items - Array of items to sort
 * @param options - Search and sort options
 * @returns Sorted array with most relevant items first
 */
export function sortBySearchRelevance<T extends SearchableItem>(
  items: T[],
  options: SearchSortOptions
): T[] {
  const { searchQuery, fields, caseSensitive = false } = options;

  if (!searchQuery.trim()) {
    return items;
  }

  const query = caseSensitive ? searchQuery : searchQuery.toLowerCase();

  return [...items].sort((a, b) => {
    const aScore = getSearchScore(a, query, fields, caseSensitive);
    const bScore = getSearchScore(b, query, fields, caseSensitive);

    // Higher score means better match (exact = 3, startsWith = 2, contains = 1)
    return bScore - aScore;
  });
}

/**
 * Calculates search relevance score for an item
 * @param item - Item to score
 * @param query - Search query
 * @param fields - Fields to search in
 * @param caseSensitive - Whether to perform case-sensitive matching
 * @returns Score from 0-3 (3 = exact match, 2 = starts with, 1 = contains, 0 = no match)
 */
function getSearchScore(
  item: SearchableItem,
  query: string,
  fields: SearchField[],
  caseSensitive: boolean
): number {
  let maxScore = 0;

  for (const field of fields) {
    const value = typeof field === "function" ? field(item) : item[field];

    if (typeof value !== "string") {
      continue;
    }

    const itemValue = caseSensitive ? value : value.toLowerCase();

    // Exact match gets highest score
    if (itemValue === query) {
      maxScore = Math.max(maxScore, 3);
    }
    // Starts with query gets medium score
    else if (itemValue.startsWith(query)) {
      maxScore = Math.max(maxScore, 2);
    }
    // Contains query gets lowest score
    else if (itemValue.includes(query)) {
      maxScore = Math.max(maxScore, 1);
    }
  }

  return maxScore;
}
