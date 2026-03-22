import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Order from '@/lib/db/models/Order';
import User from '@/lib/db/models/User';
import Product from '@/lib/db/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const [
      totalOrders,
      totalUsers,
      totalProducts,
      paidOrders,
      pendingOrders,
      recentOrders,
      lowStockProducts,
      topProducts,
      monthlyStats,
      recentUsers
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments({ isPaid: true }),
      Order.countDocuments({ status: 'pending' }),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10),
      Product.find({ stock: { $gt: 0, $lte: 5 } }).select('name stock').sort({ stock: 1 }).limit(5),
      Product.find({ soldCount: { $gt: 0 } }).select('name soldCount price images').sort({ soldCount: -1 }).limit(5),
      Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 12 }
      ]),
      User.find({ role: 'user' }).select('name email createdAt').sort({ createdAt: -1 }).limit(5)
    ]);

    const totalRevenue = paidOrders > 0 
      ? await Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }])
      : [{ total: 0 }];

    const avgOrderValue = totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0;

    return NextResponse.json({
      metrics: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        totalUsers,
        totalProducts,
        paidOrders,
        pendingOrders,
        avgOrderValue,
      },
      recentOrders: recentOrders.map(order => ({
        _id: order._id.toString(),
        customer: order.user ? (order.user as any).name : 'Guest',
        email: order.user ? (order.user as any).email : '',
        total: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt
      })),
      lowStockProducts: lowStockProducts.map(p => ({
        _id: p._id.toString(),
        name: p.name,
        stock: p.stock
      })),
      topProducts: topProducts.map(p => ({
        _id: p._id.toString(),
        name: p.name,
        soldCount: p.soldCount,
        price: p.price,
        image: p.images?.[0] || ''
      })),
      monthlyStats: monthlyStats.reverse(),
      recentUsers: recentUsers.map(u => ({
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
        createdAt: u.createdAt
      }))
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
