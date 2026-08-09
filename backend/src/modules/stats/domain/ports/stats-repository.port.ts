export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  count: number;
}

export interface SystemStats {
  totalUsers: number;
  newUsersLast30Days: number;
  totalProducts: number;
  activeProducts: number;
  productsByCategory: CategoryBreakdown[];
  totalCategories: number;
  totalReservations: number;
  pendingReservations: number;
  completedReservations: number;
  todayReservations: number;
}

export interface StatsRepository { getSystemStats(): Promise<SystemStats>; }
