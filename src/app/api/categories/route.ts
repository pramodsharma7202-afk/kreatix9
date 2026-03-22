import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Category from '@/lib/db/models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort('name');
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
