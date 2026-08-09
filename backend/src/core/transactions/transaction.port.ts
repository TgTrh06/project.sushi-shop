export interface TransactionContext {
  readonly id: symbol;
}

export interface UnitOfWork {
  execute<T>(work: (context: TransactionContext) => Promise<T>): Promise<T>;
}
