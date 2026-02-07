// Shared types
export * from './shared/layout';
export * from './shared/navigation';

// Domain types
export * from './items/item';

// API types
export interface ApiResponse<T> {
  data: T;
  success: true;
}

export interface ApiError {
  error: string;
  code: string;
  success: false;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
