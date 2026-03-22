import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Category from '@/lib/db/models/Category';
import Product from '@/lib/db/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    const count = await Product.countDocuments({ category: params.id });

    return NextResponse.json({ ...category.toObject(), productCount: count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { name, description, image, slug, icon, isActive, order } = body;

    const category = await Category.findByIdAndUpdate(
      params.id,
      { name, description, image, slug, icon, isActive, order },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const productCount = await Product.countDocuments({ category: params.id });
    if (productCount > 0) {
      return NextResponse.json({ 
        message: `Cannot delete category with ${productCount} products. Remove or reassign products first.` 
      }, { status: 400 });
    }

    const category = await Category.findByIdAndDelete(params.id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
