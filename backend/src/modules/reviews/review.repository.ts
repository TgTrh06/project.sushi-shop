import { Model } from "mongoose";
import { ReviewModel } from "./review.model";
import { ReviewDocument, ReviewEntity, CreateReviewDTO } from "./review.types";

export default class ReviewRepository {
  private model: Model<ReviewDocument>;

  constructor() {
    this.model = ReviewModel;
  }

  private mapToEntity(doc: any): ReviewEntity {
    if (!doc) return null as any;
    return {
      id: doc._id.toString(),
      productId: doc.productId.toString(),
      user: {
        id: doc.userId?._id?.toString() || doc.userId?.toString() || "",
        name: doc.userId?.username || "",
        avatar: doc.userId?.avatar,
      },
      rating: doc.rating,
      comment: doc.comment,
      photo_ids: doc.photo_ids || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(dto: CreateReviewDTO): Promise<ReviewEntity> {
    const doc = await this.model.create(dto);
    return this.mapToEntity(doc);
  }

  async findByProductId(productId: string): Promise<ReviewEntity[]> {
    const docs = await this.model
      .find({ productId })
      .populate("userId", "username") // Populate user name
      .sort({ createdAt: -1 })
      .lean();
    
    return docs.map(doc => ({
        ...this.mapToEntity(doc),
        user: (doc.userId as any).username // Extra field for convenience
    }));
  }

  async findByProductIdPaginated(
    productId: string,
    skip: number,
    limit: number
  ): Promise<{ docs: ReviewEntity[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.model
        .find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments({ productId })
    ]);

    return {
      docs: docs.map(doc => this.mapToEntity(doc)),
      total
    };
  }

  async findByUserId(userId: string): Promise<ReviewEntity[]> {
    const docs = await this.model.find({ userId }).sort({ createdAt: -1 }).lean();
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<ReviewEntity | null> {
    const doc = await this.model.findById(id).lean();
    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<ReviewEntity | null> {
    const doc = await this.model.findByIdAndDelete(id).lean();
    return this.mapToEntity(doc);
  }
}
