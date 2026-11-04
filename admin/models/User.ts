import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const grantSchema = new Schema(
  {
    scope: { type: String, required: true },
    actions: { type: [String], default: [] },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    // Role is immutable: nobody can be promoted/demoted through the API.
    role: { type: String, enum: ["owner", "manager"], required: true, immutable: true },
    active: { type: Boolean, default: true },
    permissions: { type: [grantSchema], default: [] },
    lastLoginAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", immutable: true },
    ownerSlot: { type: String, unique: true, sparse: true, immutable: true },
  },
  { timestamps: true },
);

// Database-level guarantee that only one Owner can ever exist: only owners get a value here,
// and the sparse unique index rejects a second one. (Managers leave it unset.)
userSchema.pre("validate", function () {
  if (this.isNew && this.role === "owner") this.ownerSlot = "owner";
});

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) || mongoose.model<UserDoc>("User", userSchema);
