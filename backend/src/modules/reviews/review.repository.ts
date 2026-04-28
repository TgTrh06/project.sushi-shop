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
    // userId may be populated (object with _id, username) or a plain ObjectId string
    const userObj = typeof doc.userId === "object" && doc.userId !== null
      ? { id: doc.userId._id?.toString() || doc.userId.toString(), name: doc.userId.username || "" }
      : { id: doc.userId?.toString() || "", name: "" };

    return {
      id: doc._id.toString(),
      productId: doc.productId.toString(),
      user: userObj,
      rating: doc.rating,
      comment: doc.comment,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(dto: CreateReviewDTO): Promise<ReviewEntity> {
    const doc = await this.model.create({
      productId: dto.productId,
      userId: dto.user.id,
      rating: dto.rating,
      comment: dto.comment,
    });
    return this.mapToEntity(doc);
  }

  async findByProductId(productId: string): Promise<ReviewEntity[]> {
    const docs = await this.model
      .find({ productId })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .lean();
    
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findByProductIdPaginated(
    productId: string,
    skip: number,
    limit: number
  ): Promise<{ docs: ReviewEntity[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.model
        .find({ productId })
        .populate("userId", "username")
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
    const docs = await this.model.find({ userId }).populate("userId", "username").sort({ createdAt: -1 }).lean();
    return docs.map(doc => this.mapToEntity(doc));
  }

  async delete(id: string): Promise<ReviewEntity | null> {
    const doc = await this.model.findByIdAndDelete(id).lean();
    return this.mapToEntity(doc);
  }
}
