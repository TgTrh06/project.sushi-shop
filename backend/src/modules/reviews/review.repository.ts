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
      product: {
        slug: doc.productInfo?.slug || "",
        name: doc.productInfo?.name || "",
      },
      user: {
        id: doc.userId?._id?.toString() || doc.userId?.toString() || "",
        name: doc.userId?.username || "",
        email: doc.userId?.email || "",
        avatar: doc.userId?.avatar,
      },
      rating: doc.rating,
      comment: doc.comment,
      photo_ids: doc.photo_ids || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAllPaginated(
    skip: number,
    limit: number,
    email?: string,
    date?: string,
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{ docs: ReviewEntity[]; total: number }> {
    // Build match stage — we need to join with users to filter by email
    const pipeline: any[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
    ];

    const matchConditions: any = {};

    if (email) {
      matchConditions["userInfo.email"] = { $regex: email, $options: "i" };
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      matchConditions["createdAt"] = { $gte: start, $lte: end };
    }

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    const countPipeline = [...pipeline, { $count: "total" }];
    const dataPipeline = [
      ...pipeline,
      { $sort: { createdAt: sortOrder === "asc" ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const [countResult, docs] = await Promise.all([
      this.model.aggregate(countPipeline),
      this.model.aggregate(dataPipeline),
    ]);

    const total = countResult[0]?.total ?? 0;

    const mapped: ReviewEntity[] = docs.map((doc: any) => ({
      id: doc._id.toString(),
      productId: doc.productId?.toString() || "",
      product: {
        slug: doc.productInfo?.slug || "",
        name: doc.productInfo?.name || "",
      },
      user: {
        id: doc.userInfo?._id?.toString() || "",
        name: doc.userInfo?.username || "",
        email: doc.userInfo?.email || "",
        avatar: doc.userInfo?.avatar,
      },
      rating: doc.rating,
      comment: doc.comment,
      photo_ids: doc.photo_ids || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return { docs: mapped, total };
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
