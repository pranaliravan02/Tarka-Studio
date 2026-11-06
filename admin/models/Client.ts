import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/** Core client record. Logo retrieval/approval workflow is added in Phase 6. */
const clientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    logoUrl: { type: String },
    logoApproved: { type: Boolean, default: false },
    websiteUrl: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: false }, // shown in the public Client Strip
  },
  { timestamps: true },
);

export type ClientDoc = InferSchemaType<typeof clientSchema>;
export const Client: Model<ClientDoc> =
  (mongoose.models.Client as Model<ClientDoc>) || mongoose.model<ClientDoc>("Client", clientSchema);
