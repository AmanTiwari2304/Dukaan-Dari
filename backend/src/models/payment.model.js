import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        amount: Number,
        method: {
            type: String,
            enum: ["cash", "upi", "card"],
        },
        status: {
            type: String,
            enum: ["paid", "pending"],
        },
    }, { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);