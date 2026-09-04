import mongoose, { type ClientSession } from "mongoose";
import type { TransactionContext, UnitOfWork } from "./transaction.port";

export interface MongooseTransactionContext extends TransactionContext { session: ClientSession; }
export function sessionOf(context?: TransactionContext): ClientSession | undefined { return (context as MongooseTransactionContext | undefined)?.session; }

export class MongooseUnitOfWork implements UnitOfWork {
  async execute<T>(work: (context: TransactionContext) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();
    try {
      let result!: T;
      await session.withTransaction(async () => { result = await work({ id: Symbol("mongo-transaction"), session } as MongooseTransactionContext); });
      return result;
    } finally { await session.endSession(); }
  }
}
