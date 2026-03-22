import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Category from '@/lib/db/models/Category';
import Product from '@/lib/db/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    
    const categories = await Category.find({}).sort({ order: 1, name: 1 });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return {
          ...cat.toObject(),
          productCount: count
        };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    
    const { name, description, image, slug, icon } = body;
    
    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json({ message: 'Category with this slug already exists' }, { status: 400 });
    }

    const category = new Category({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      image,
      icon
    });

    await category.save();

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
