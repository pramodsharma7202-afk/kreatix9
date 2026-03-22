import mongoose, { Schema, Document } from 'mongoose';

export interface ISellerProfile extends Document {
  user: mongoose.Types.ObjectId;
  storeName: string;
  storeDescription?: string;
  storeLogo?: string;
  storeBanner?: string;
  isApproved: boolean;
  commissionRate: number;
  balance: number;
  stripeAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SellerProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: true, unique: true },
    storeDescription: { type: String },
    storeLogo: { type: String },
    storeBanner: { type: String },
    isApproved: { type: Boolean, default: false },
    commissionRate: { type: Number, default: 0.1 }, // 10% by default
    balance: { type: Number, default: 0 },
    stripeAccountId: { type: String }, // For Stripe Connect payouts
  },
  { timestamps: true }
);

export default mongoose.models.SellerProfile || mongoose.model<ISellerProfile>('SellerProfile', SellerProfileSchema);
