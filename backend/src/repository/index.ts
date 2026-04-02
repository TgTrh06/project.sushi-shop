import { Model } from "mongoose";

export default abstract class BaseRepository<
  TEntity,
  TCreateDTO extends object,
  TUpdateDTO extends object,
> {
  constructor(protected model: Model<any>) {}

  protected abstract mapToEntity(doc: any): TEntity;

  async create(dto: TCreateDTO): Promise<TEntity> {
    const doc = await this.model.create(dto);
    return this.mapToEntity(doc);
  }

  async findAll(): Promise<TEntity[]> {
    const docs = await this.model.find().lean();
    return docs.map(this.mapToEntity);
  }

  async findPaginated(
    limit: number,
    offset: number
  ): Promise<{ docs: TEntity[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.model.find().skip(offset).limit(limit).lean(),
      this.model.countDocuments(),
    ]);

    return {
      docs: docs.map((doc) => this.mapToEntity(doc)),
      total,
    };
  }

  async findById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByName(name: string): Promise<TEntity | null> {
    const doc = await this.model.findOne({ name }).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async update(id: string, dto: TUpdateDTO): Promise<TEntity | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result; // Ensure to return a simple true of false
  }
}