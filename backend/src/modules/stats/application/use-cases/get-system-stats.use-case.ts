import type { StatsRepository } from "../../domain/ports/stats-repository.port";
export class GetSystemStatsUseCase { constructor(private readonly stats: StatsRepository) {} execute() { return this.stats.getSystemStats(); } }
