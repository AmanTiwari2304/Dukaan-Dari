import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        retailer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        items: [
            {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product" 
            },
            quantity: Number,
            price: Number,
            },
        ],
        totalAmount: Number,
        status: {
            type: String,
            enum: ["pending", "packed", "delivered"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["paid", "partial", "due"],
            default: "due",
        },
    }, 
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema)