import crypto from "crypto";
export interface IdGenerator { next(): string; }
export class UuidIdGenerator implements IdGenerator { next() { return crypto.randomUUID(); } }
