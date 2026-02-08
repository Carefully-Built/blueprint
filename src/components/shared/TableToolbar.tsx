'use client';

import { Search, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterOption } from '@/lib/filters';

// ============================================================
// FILTER DROPDOWN
// ============================================================

interface FilterDropdownProps<T extends string> {
  readonly label: string;
  readonly value: T | 'all';
  readonly options: readonly FilterOption<T>[];
  readonly onChange: (value: T | 'all') => void;
  readonly className?: string;
}

export function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: FilterDropdownProps<T>): React.ReactElement {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T | 'all')}>
      <SelectTrigger className={className ?? 'w-[140px]'}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================================
// SEARCH INPUT
// ============================================================

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchInputProps): React.ReactElement {
  return (
    <div className={`relative ${className ?? ''}`}>
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================
// TABLE TOOLBAR
// ============================================================

export interface FilterConfig<T extends string = string> {
  readonly key: string;
  readonly label: string;
  readonly options: readonly FilterOption<T>[];
}

export interface TableToolbarProps {
  readonly search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  readonly filters?: {
    config: FilterConfig<string>;
    value: string;
    onChange: (value: string) => void;
  }[];
  readonly onClearAll?: () => void;
  readonly children?: React.ReactNode;
}

export function TableToolbar({
  search,
  filters,
  onClearAll,
  children,
}: TableToolbarProps): React.ReactElement {
  const hasActiveFilters =
    (search?.value && search.value.length > 0) ||
    filters?.some((f) => f.value !== 'all');

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {search && (
          <SearchInput
            value={search.value}
            onChange={search.onChange}
            placeholder={search.placeholder}
            className="w-full sm:w-64"
          />
        )}
        {filters?.map((filter) => (
          <FilterDropdown
            key={filter.config.key}
            label={filter.config.label}
            value={filter.value}
            options={filter.config.options}
            onChange={filter.onChange}
          />
        ))}
        {hasActiveFilters && onClearAll && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8 px-2">
            <X className="mr-1 size-4" />
            Clear
          </Button>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

// ============================================================
// USE TABLE FILTERS HOOK
// ============================================================

export interface UseTableFiltersOptions<T> {
  readonly data: T[];
  readonly searchFields?: (keyof T)[];
  readonly filterKeys?: (keyof T)[];
}

export interface UseTableFiltersReturn<T> {
  readonly filteredData: T[];
  readonly search: string;
  readonly setSearch: (value: string) => void;
  readonly filters: Record<string, string>;
  readonly setFilter: (key: string, value: string) => void;
  readonly clearAll: () => void;
}

export function useTableFilters<T extends Record<string, unknown>>({
  data,
  searchFields = [],
  filterKeys = [],
}: UseTableFiltersOptions<T>): UseTableFiltersReturn<T> {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearAll = useCallback(() => {
    setSearch('');
    setFilters({});
  }, []);

  const filteredData = data.filter((item) => {
    // Search filter
    if (search && searchFields.length > 0) {
      const searchLower = search.toLowerCase();
      const matchesSearch = searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        return false;
      });
      if (!matchesSearch) return false;
    }

    // Field filters
    for (const key of filterKeys) {
      const filterValue = filters[String(key)];
      if (filterValue && filterValue !== 'all') {
        if (item[key] !== filterValue) return false;
      }
    }

    return true;
  });

  return {
    filteredData,
    search,
    setSearch,
    filters,
    setFilter,
    clearAll,
  };
}
