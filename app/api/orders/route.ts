import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { tryDbConnect } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import { getDemoOrders, cancelDemoOrder } from '@/lib/demo-store';

export async function GET(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasDatabase = await tryDbConnect();
  if (!hasDatabase) {
    const orders = getDemoOrders(userId);
    return NextResponse.json({ orders });
  }

  await dbConnect();
  // Ensure Product model is registered for population
  Product.find({});
  
  const orders = await Order.find({ userId }).populate('items.productId').sort({ _id: -1 });
  return NextResponse.json({ orders });
}

export async function PATCH(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderId } = await request.json();
  if (!orderId) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

  const hasDatabase = await tryDbConnect();
  if (!hasDatabase) {
    const order = cancelDemoOrder(orderId, userId);
    if (order === null) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order === false) return NextResponse.json({ error: 'Order cannot be cancelled' }, { status: 400 });
    return NextResponse.json({ message: 'Order cancelled', order });
  }

  await dbConnect();
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.status !== 'pending') {
    return NextResponse.json({ error: 'Order cannot be cancelled' }, { status: 400 });
  }
  
  order.status = 'cancelled';
  await order.save();
  return NextResponse.json({ message: 'Order cancelled', order });
}
