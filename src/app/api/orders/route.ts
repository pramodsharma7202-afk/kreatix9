import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import Order from '@/lib/db/models/Order';
import Product from '@/lib/db/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await req.json();
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = body;

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 });
    }

    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${(orderCount + 1).toString().padStart(4, '0')}`;

    const order = new Order({
      user: session.user.id,
      orderNumber,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'cod' ? false : true,
      isDelivered: false,
      status: 'pending'
    });

    const createdOrder = await order.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { soldCount: item.qty, stock: -item.qty } });
    }

    return NextResponse.json(createdOrder, { status: 201 });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const userRole = (session.user as any).role;
    
    let query = {};
    if (userRole === 'admin') {
      query = {};
    } else {
      query = { user: session.user.id };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
