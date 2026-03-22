import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Product from '@/lib/db/models/Product';
import Category from '@/lib/db/models/Category';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const product = await Product.findOne({ slug: params.id }).populate('category', 'name slug');

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
