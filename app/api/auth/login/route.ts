import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { tryDbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import { findDemoUserByEmail } from '@/lib/demo-store';
import { signToken, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const hasDatabase = await tryDbConnect();

    if (!hasDatabase) {
      const user = findDemoUserByEmail(normalizedEmail);

      if (!user || !verifyPassword(password, user.password)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      return NextResponse.json({
        token: signToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        mode: 'demo',
      });
    }

    await dbConnect();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      token: signToken(String(user._id)),
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
