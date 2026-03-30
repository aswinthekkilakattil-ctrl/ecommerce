import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { tryDbConnect } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { verifyToken } from '@/lib/auth';
import { addDemoCartItem, getDemoCart } from '@/lib/demo-store';

export async function GET(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasDatabase = await tryDbConnect();

  if (!hasDatabase) {
    return NextResponse.json(getDemoCart(userId));
  }

  await dbConnect();

  const cart = await Cart.findOne({ userId }).populate('items.productId');
  return NextResponse.json(cart || { items: [] });
}

export async function POST(request: NextRequest) {
  const userId = verifyToken(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { productId, quantity } = await request.json();

  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    return NextResponse.json({ error: 'A valid productId and quantity are required' }, { status: 400 });
  }

  const hasDatabase = await tryDbConnect();

  if (!hasDatabase) {
    const cart = addDemoCartItem(userId, productId, quantity);

    if (!cart) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(cart);
  }

  await dbConnect();

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item: { productId: { toString: () => string }; quantity: number }) =>
      item.productId.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  return NextResponse.json(cart);
}
