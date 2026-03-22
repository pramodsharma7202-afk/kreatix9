import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Order from '@/lib/db/models/Order';
import User from '@/lib/db/models/User';
import Product from '@/lib/db/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const [orders, activeUsers, activeProducts] = await Promise.all([
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }),
      User.countDocuments(),
      Product.countDocuments()
    ]);

    const totalRevenue = orders.reduce((acc, order) => {
      if (order.isPaid || order.status === 'Delivered' || order.status === 'processing' || order.status === 'shipped') {
        return acc + (order.totalPrice || 0);
      }
      return acc;
    }, 0);

    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order._id.toString(),
      customer: order.user ? (order.user as any).name : 'Guest',
      total: `$${order.totalPrice.toFixed(2)}`,
      status: order.status,
      date: new Date(order.createdAt).toLocaleDateString()
    }));

    return NextResponse.json({
      metrics: {
        totalRevenue: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        activeUsers: activeUsers.toLocaleString(),
        salesCount: orders.length.toLocaleString(),
        activeProducts: activeProducts.toLocaleString(),
      },
      recentOrders
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
