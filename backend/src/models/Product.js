import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "El nombre del producto es obligatorio"] 
  },
  description: { 
    type: String, 
    default: "" 
  },
  price: { 
    type: Number, 
    required: [true, "El precio es obligatorio"],
    min: [0.01, "El precio debe ser mayor que 0"]
  },
  stock: { 
    type: Number, 
    default: 0,
    min: [0, "El stock no puede ser negativo"]
  },
  images: { 
    type: [String],
    default: [] // Valor por defecto como array vacío
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: false,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

export const Product = mongoose.model("Product", productSchema);