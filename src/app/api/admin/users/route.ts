import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/db/models/User';
import Order from '@/lib/db/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all users for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Using lean() for faster read and mapping
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    
    // We want to count orders for each user
    const usersWithOrderCount = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ user: user._id });
        return {
          ...user,
          orderCount
        };
      })
    );

    return NextResponse.json(usersWithOrderCount);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
