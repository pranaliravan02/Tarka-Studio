import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BLOCKED = [
  "updateOne",
  "updateMany",
  "findOneAndUpdate",
  "findOneAndReplace",
  "replaceOne",
  "deleteOne",
  "deleteMany",
  "findOneAndDelete",
] as const;

// Every field is immutable: an audit record can be created, never changed.
const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, immutable: true, index: true },
    userName: { type: String, required: true, immutable: true },
    action: { type: String, required: true, immutable: true, index: true },
    resourceType: { type: String, immutable: true },
    resourceId: { type: String, immutable: true },
    resourceLabel: { type: String, immutable: true },
    domain: { type: String, immutable: true, index: true },
    details: { type: Schema.Types.Mixed, immutable: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

activitySchema.index({ createdAt: -1 });

for (const op of BLOCKED) {
  activitySchema.pre(op as "updateOne", function () {
    throw new Error("Activity log entries are append-only");
  });
}

export type ActivityDoc = InferSchemaType<typeof activitySchema>;
export const ActivityLog: Model<ActivityDoc> =
  (mongoose.models.ActivityLog as Model<ActivityDoc>) ||
  mongoose.model<ActivityDoc>("ActivityLog", activitySchema);
