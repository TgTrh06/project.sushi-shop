export const Role = {
  CUSTOMER: "customer",
  STAFF: "staff",
  ADMIN: "admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
