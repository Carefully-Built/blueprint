/**
 * Filter configuration types and constants
 * 
 * Define filter options once, use everywhere:
 * - Table filters
 * - Form selects
 * - Badge colors
 */

// ============================================================
// ITEM STATUS
// ============================================================

export const ITEM_STATUSES = ['draft', 'active', 'archived'] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const ITEM_STATUS_CONFIG: Record<ItemStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-yellow-600', bgColor: 'bg-yellow-100 text-yellow-800' },
  active: { label: 'Active', color: 'text-green-600', bgColor: 'bg-green-100 text-green-800' },
  archived: { label: 'Archived', color: 'text-gray-600', bgColor: 'bg-gray-100 text-gray-800' },
};

// ============================================================
// ITEM PRIORITY
// ============================================================

export const ITEM_PRIORITIES = ['low', 'medium', 'high'] as const;
export type ItemPriority = (typeof ITEM_PRIORITIES)[number];

export const ITEM_PRIORITY_CONFIG: Record<ItemPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-gray-500' },
  medium: { label: 'Medium', color: 'text-yellow-600' },
  high: { label: 'High', color: 'text-red-600' },
};

// ============================================================
// FILTER OPTION TYPE
// ============================================================

export interface FilterOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
}

/**
 * Convert config to filter options for dropdowns
 */
export function toFilterOptions<T extends string>(
  values: readonly T[],
  config: Record<T, { label: string }>
): FilterOption<T>[] {
  return values.map((value) => ({
    value,
    label: config[value].label,
  }));
}

// Pre-built filter options
export const ITEM_STATUS_OPTIONS = toFilterOptions(ITEM_STATUSES, ITEM_STATUS_CONFIG);
export const ITEM_PRIORITY_OPTIONS = toFilterOptions(ITEM_PRIORITIES, ITEM_PRIORITY_CONFIG);
