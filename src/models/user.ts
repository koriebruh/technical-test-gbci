import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const UserSchema = new Schema(
  {
    name:      { type: String,   required: true, trim: true },
    email:     { type: String,   required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String,   required: true },
    birthday:  { type: Date,     required: false },
    weight:    { type: Number,   required: false, min: 0 },
    height:    { type: Number,   required: false, min: 0 },
    interests: { type: [String], required: false, default: [] },
    role:      { type: String,   required: true, enum: ["admin", "user"] as const, default: "user" },
  },
  {
    timestamps: true, // auto-handle createdAt & updatedAt
    versionKey: false // hapus __v field
  }
);

export type UserType = InferSchemaType<typeof UserSchema> & {
  _id: string | mongoose.Types.ObjectId;
};

const User: Model<UserType> =
  mongoose.models.User ?? mongoose.model<UserType>("User", UserSchema);

export default User;