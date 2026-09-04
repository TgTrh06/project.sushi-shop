export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class Pagination {
  static parse(query: Record<string, unknown>, maxLimit = 100): PaginationQuery {
    const page = Math.max(Number.parseInt(String(query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(String(query.limit ?? "10"), 10) || 10, 1), maxLimit);
    return { page, limit };
  }

  static result<T>(data: T[], total: number, page: number, limit: number): PaginationResult<T> {
    return { data, meta: { total, page, limit, totalPages: limit ? Math.ceil(total / limit) : 0 } };
  }
}
