import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  fullName: string;
  policeStationName: string;
  badgeId: string;
  role: "SUPER_ADMIN" | "ADMIN" | "OFFICER";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    policeStationName: {
      type: String,
      required: [true, "Police station name is required"],
      trim: true,
    },
    badgeId: {
      type: String,
      required: [true, "Badge ID is required"],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "OFFICER"],
      default: "OFFICER",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;