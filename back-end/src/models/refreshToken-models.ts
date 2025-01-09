import mongoose from "mongoose";

const refreshtokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
  },
  issuedAt: {
    type: Date,
  },
});

export const RefreshToken = mongoose.model("RefreshToken", refreshtokenSchema);
