import { Model } from "mongoose";

export abstract class BaseRepository<
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

  async findById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async update(id: string, dto: TUpdateDTO): Promise<TEntity | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
