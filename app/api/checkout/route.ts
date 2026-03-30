import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { tryDbConnect } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';
import { checkoutDemoCart } from '@/lib/demo-store';

export async function POST(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { address } = await request.json();

  if (!address || String(address).trim().length < 10) {
    return NextResponse.json({ error: 'Please enter a complete delivery address' }, { status: 400 });
  }

  const hasDatabase = await tryDbConnect();

  if (!hasDatabase) {
    const order = checkoutDemoCart(userId, String(address).trim());

    if (!order) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Order placed successfully', orderId: order._id, mode: 'demo' });
  }

  await dbConnect();

  const cart = await Cart.findOne({ userId }).populate('items.productId');

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  let total = 0;
  const orderItems = cart.items.map((item: { productId: { _id: string; price: number }; quantity: number }) => {
    total += item.productId.price * item.quantity;
    return {
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    };
  });

  const order = new Order({
    userId,
    items: orderItems,
    total,
    address: String(address).trim(),
  });

  await order.save();

  // Clear cart
  cart.items = [];
  await cart.save();

  return NextResponse.json({ message: 'Order placed successfully', orderId: order._id });
}
