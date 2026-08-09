import type { SessionEntity } from "../entities/session.entity";

export interface SessionRepository {
  create(session: Omit<SessionEntity, "id">): Promise<SessionEntity>;
  consumeByTokenHash(tokenHash: string): Promise<SessionEntity | null>;
  revokeByTokenHash(tokenHash: string): Promise<boolean>;
  revokeAllByUserId(userId: string): Promise<void>;
}
