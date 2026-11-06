import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * Core project record shared by every domain. Domain-specific fields (PDF, live URL,
 * video category, galleries …) are added in Phase 4/5 under `details`.
 */
const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    domain: { type: String, required: true, index: true }, // a project permission scope id
    status: { type: String, enum: ["draft", "published", "unpublished"], default: "draft", index: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    clientName: { type: String, trim: true },
    description: { type: String },
    coverUrl: { type: String },
    details: { type: Schema.Types.Mixed },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
projectSchema.index({ domain: 1, status: 1, order: 1 });

export type ProjectDoc = InferSchemaType<typeof projectSchema>;
export const Project: Model<ProjectDoc> =
  (mongoose.models.Project as Model<ProjectDoc>) || mongoose.model<ProjectDoc>("Project", projectSchema);
