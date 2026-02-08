'use client';

import { useFormContext, Controller } from 'react-hook-form';

import type { FieldValues, Path } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';


interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectFieldProps<TValues extends FieldValues> {
  readonly name: Path<TValues>;
  readonly label?: string;
  readonly placeholder?: string;
  readonly options: readonly SelectOption[];
  readonly disabled?: boolean;
  readonly className?: string;
}

export function CustomSelectField<TValues extends FieldValues>({
  name,
  label,
  placeholder = 'Select...',
  options,
  disabled = false,
  className,
}: CustomSelectFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          {label ? (
            <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
              {label}
            </Label>
          ) : null}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value as string}
            disabled={disabled}
          >
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error?.message ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : null}
        </div>
      )}
    />
  );
}
