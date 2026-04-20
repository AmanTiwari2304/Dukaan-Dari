import mongoose from "mongoose";
import { sendLowStockNotification } from "../utils/stockAlert.js";

const productSchema = new mongoose.Schema(
    {
        name: {
            type : String,
            required : true,
            trim : true,
            index : true
        },
        brandName: {
            type : String,
            required : true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        unit: {
            type : String, // kg, piece, box
            required : true
        }, 
        packsizes: [{
            size : {
                type : String, // 1kg, 5L
                // required : true
            },    
            price: {
                type: Number,
                // required : true,
                min: [0, 'Price cannot be negative']
            },
            stock:{
                type : Number,
                // required : true
            }
        }],
        stockAlertNumber : {
            type : Number,
            required : true
        },
        minQty: { 
            type: Number,
            required : true,
            default: 1 
        },
        maxQty : {
            type : Number,
            required : true
        },
        imageURL: {
            type : String,
            required : true 
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    }, 
    { timestamps: true }
);

// Post-save middleware to check stock levels
productSchema.post('save', function(doc) {
  if (doc.stockAlertNumber && doc.stock < doc.stockAlertNumber) {
    sendLowStockNotification(doc);
  }
});

// Pre-save middleware for update operations
productSchema.pre('findByIdAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  if (update.$set && update.$set.stock !== undefined) {
    const product = await this.model.findById(this.getFilter()._id);
    
    if (product && product.stockAlertNumber && update.$set.stock < product.stockAlertNumber) {
      sendLowStockNotification({ ...product.toObject(), stock: update.$set.stock });
    }
  }
  
  next();
});

export const Product = mongoose.model("Product", productSchema)