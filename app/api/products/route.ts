import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { tryDbConnect } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getDemoProducts } from '@/lib/demo-store';

export async function GET() {
  const hasDatabase = await tryDbConnect();

  if (!hasDatabase) {
    return NextResponse.json(getDemoProducts());
  }

  await dbConnect();

  const products = await Product.find();

  if (products.length === 0) {
    const demoProducts = getDemoProducts().map(({ _id, ...product }) => product);
    const seededProducts = await Product.insertMany(demoProducts);
    return NextResponse.json(seededProducts);
  }

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const product = await request.json();

  if (!product?.name || !product?.description || !product?.price || !product?.image || !product?.category) {
    return NextResponse.json({ error: 'All product fields are required' }, { status: 400 });
  }

  const hasDatabase = await tryDbConnect();

  if (!hasDatabase) {
    return NextResponse.json({ error: 'Product creation is unavailable in demo mode' }, { status: 501 });
  }

  await dbConnect();

  const newProduct = new Product(product);
  await newProduct.save();

  return NextResponse.json(newProduct, { status: 201 });
}
