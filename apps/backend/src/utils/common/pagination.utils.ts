export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
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

export const PaginationUtils = {
  extract(query: any): PaginationParams {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  },

  format<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginationResult<T> {
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};