import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  icon?: string;
  parent?: mongoose.Types.ObjectId;
  isActive: boolean;
  order: number;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    description: { type: String },
    icon: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ isActive: 1, order: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
