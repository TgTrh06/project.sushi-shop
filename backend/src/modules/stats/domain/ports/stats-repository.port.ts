import type { SystemStats } from "@itsu-sushi/shared/schemas/stats.schema";

export interface StatsRepository { getSystemStats(): Promise<SystemStats>; }
