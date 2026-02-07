'use client';

import { useFormContext, Controller } from 'react-hook-form';

import type { FieldValues, Path } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';


interface CustomInputFieldProps<TValues extends FieldValues> {
  name: Path<TValues>;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function CustomInputField<TValues extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  autoFocus = false,
  className,
}: CustomInputFieldProps<TValues>): React.ReactElement {
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
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            className={error ? 'border-destructive' : ''}
            value={field.value ?? ''}
          />
          {error?.message ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : null}
        </div>
      )}
    />
  );
}
