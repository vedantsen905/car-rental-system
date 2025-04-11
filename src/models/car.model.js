import mongoose from "mongoose";


const carSchema = new mongoose.Schema({
    model: { type: String, required: true },
    brand: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true },
    imageUrl: { type: String },
  });
  
export const Car = mongoose.model("Car", carSchema);
