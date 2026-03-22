import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/db/models/User';
import Category from '@/lib/db/models/Category';
import Product from '@/lib/db/models/Product';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    await connectToDatabase();

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ message: 'Seeding not allowed in production' }, { status: 403 });
    }

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        name: 'John Seller',
        email: 'seller@example.com',
        password: hashedPassword,
        role: 'seller',
      },
      {
        name: 'Jane Doe',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
      },
    ]);

    const seller = users[1];

    const categories = await Category.insertMany([
      { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
      { name: 'Fashion', slug: 'fashion', description: 'Apparel and clothing' },
      { name: 'Home', slug: 'home', description: 'Home appliances and furniture' },
    ]);

    await Product.insertMany([
      {
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        description: 'High quality noise-canceling headphones with premium sound quality.',
        price: 299.99,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000'],
        category: categories[0]._id,
        seller: seller._id,
        stock: 50,
        sku: 'ELEC-HPH-001',
        tags: ['headphones', 'wireless', 'audio'],
        isFeatured: true,
        rating: 4.8,
        numReviews: 12,
      },
      {
        name: 'Luxury Leather Jacket',
        slug: 'luxury-leather-jacket',
        description: 'Genuine leather jacket for all seasons with premium craftsmanship.',
        price: 499.00,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000'],
        category: categories[1]._id,
        seller: seller._id,
        stock: 20,
        sku: 'FASH-JAC-001',
        tags: ['leather', 'jacket', 'fashion'],
        isTrending: true,
        rating: 4.5,
        numReviews: 8,
      },
      {
        name: 'Minimalist Wooden Desk',
        slug: 'minimalist-wooden-desk',
        description: 'Perfect for your home office with clean modern aesthetics.',
        price: 199.50,
        images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000'],
        category: categories[2]._id,
        seller: seller._id,
        stock: 15,
        sku: 'HOME-DSK-001',
        tags: ['desk', 'wood', 'office'],
        isFeatured: true,
        rating: 4.9,
        numReviews: 24,
      },
    ]);

    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
