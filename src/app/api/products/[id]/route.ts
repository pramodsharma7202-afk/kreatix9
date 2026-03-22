import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Product from '@/lib/db/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    let product;
    if (params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(params.id).populate('category', 'name slug image');
    } else {
      product = await Product.findOne({ slug: params.id }).populate('category', 'name slug image');
    }

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { name, slug, description, price, discountPrice, images, category, stock, sku, isFeatured, isTrending, isActive } = body;

    const product = await Product.findByIdAndUpdate(
      params.id,
      { name, slug, description, price, discountPrice, images, category, stock, sku, isFeatured, isTrending, isActive },
      { new: true }
    ).populate('category', 'name slug');

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
