import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  originalPrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId | string;
  seller: mongoose.Types.ObjectId;
  stock: number;
  sku: string;
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  rating: number;
  numReviews: number;
  soldCount: number;
  variants?: {
    name: string;
    options: { name: string; stock: number; price?: number }[];
  }[];
  specifications?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    discountPrice: { type: Number },
    originalPrice: { type: Number },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stock: { type: Number, required: true, default: 0, index: true },
    sku: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    variants: [
      {
        name: String,
        options: [{
          name: String,
          stock: { type: Number, default: 0 },
          price: Number,
        }],
      },
    ],
    specifications: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ soldCount: -1 });
ProductSchema.index({ 'rating': -1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
