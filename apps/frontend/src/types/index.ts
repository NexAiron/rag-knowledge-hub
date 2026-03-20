export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

