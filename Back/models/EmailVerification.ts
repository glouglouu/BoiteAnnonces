import mongoose from "mongoose";

const VerificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: Number, required: true },
  expiredAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000),
    index: { expires: 0 },
  }, // TTL 10 min
});

export default mongoose.model("VerificationCode", VerificationCodeSchema);
